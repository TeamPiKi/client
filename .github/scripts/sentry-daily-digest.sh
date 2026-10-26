#!/usr/bin/env bash
set -euo pipefail

: "${SENTRY_TOKEN:?SENTRY_TOKEN 이 없습니다}"
: "${SENTRY_ORG:?SENTRY_ORG 가 없습니다}"
: "${SENTRY_PROJECT:?SENTRY_PROJECT 가 없습니다}"
SENTRY_ENV="${SENTRY_ENV:-production}"
DRY_RUN="${DRY_RUN:-0}"
if [ "$DRY_RUN" != "1" ]; then
  : "${DISCORD_BOT_TOKEN:?DISCORD_BOT_TOKEN 이 없습니다}"
  : "${CHANNEL_ID:?CHANNEL_ID 가 없습니다}"
fi

case "$SENTRY_ENV" in
  production) STAGE="PROD" ;;
  staging) STAGE="STG" ;;
  *) STAGE=$(printf '%s' "$SENTRY_ENV" | tr '[:lower:]' '[:upper:]') ;;
esac
LABEL="[${SENTRY_PLATFORM:-WEB}·$STAGE]"

API="https://sentry.io/api/0"
GH_ISSUE_MAX=10
# 프론트가 고칠 수 없는 에러 이름 — 쓸데없는 이슈가 생기면 여기에 추가
GH_ISSUE_EXCLUDE='["ApiError", "AxiosError", "ChunkLoadError"]'
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

send_discord() {
  local text="$1" code
  if [ "$DRY_RUN" = "1" ]; then
    printf '%s\n%s\n' "----- Discord 메시지 ($(jq -rn --arg t "$text" '$t | length')자) -----" "$text"
    return 0
  fi
  code=$(curl -s --max-time 10 -o "$WORK/discord.json" -w '%{http_code}' \
    -X POST "https://discord.com/api/v10/channels/$CHANNEL_ID/messages" \
    -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
    -H "Content-Type: application/json; charset=utf-8" \
    --data "$(jq -n --arg content "$text" '{content: $content, allowed_mentions: {parse: []}}')") || code="000"
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "::error::Discord 전송 실패 (HTTP $code) $(cat "$WORK/discord.json" 2>/dev/null)"
    return 1
  fi
}

# 조회가 실패한 날을 "에러 없는 날"과 구분하려고 실패도 채널에 알린다
fail() {
  echo "::error::$1"
  send_discord "⚠️ $LABEL Sentry 일간 요약 실패: $1" || true
  exit 1
}

sentry_get() {
  local out="$1" url="$2" code
  shift 2
  code=$(curl -sS --max-time 20 --get -o "$out" -D "$out.headers" -w '%{http_code}' \
    -H "Authorization: Bearer $SENTRY_TOKEN" "$url" "$@") || code="000"
  echo "$code"
}

is_2xx() { [ "${1:0:1}" = "2" ] && [ "${#1}" -eq 3 ]; }

CODE=$(sentry_get "$WORK/project.json" "$API/projects/$SENTRY_ORG/$SENTRY_PROJECT/")
is_2xx "$CODE" || fail "프로젝트 조회 HTTP $CODE"
PROJECT_ID=$(jq -r '.id // empty' "$WORK/project.json")
[ -n "$PROJECT_ID" ] || fail "프로젝트 ID 없음"

CODE=$(sentry_get "$WORK/issues.json" "$API/organizations/$SENTRY_ORG/issues/" \
  --data-urlencode "project=$PROJECT_ID" \
  --data-urlencode "environment=$SENTRY_ENV" \
  --data-urlencode "statsPeriod=24h" \
  --data-urlencode "groupStatsPeriod=24h" \
  --data-urlencode "query=is:unresolved lastSeen:-24h" \
  --data-urlencode "sort=freq" \
  --data-urlencode "limit=100")
is_2xx "$CODE" || fail "이슈 조회 HTTP $CODE"
jq -e 'type == "array"' "$WORK/issues.json" >/dev/null || fail "이슈 응답 형식 오류"

UNRESOLVED=""
CODE=$(sentry_get "$WORK/unresolved.json" "$API/organizations/$SENTRY_ORG/issues/" \
  --data-urlencode "project=$PROJECT_ID" \
  --data-urlencode "environment=$SENTRY_ENV" \
  --data-urlencode "statsPeriod=30d" \
  --data-urlencode "query=is:unresolved" \
  --data-urlencode "limit=1")
if is_2xx "$CODE"; then
  UNRESOLVED=$(grep -i '^x-hits:' "$WORK/unresolved.json.headers" | tr -dc '0-9' || true)
fi

LIST_URL="https://$SENTRY_ORG.sentry.io/issues/?project=$PROJECT_ID&environment=$SENTRY_ENV&query=is%3Aunresolved&statsPeriod=24h"

jq --argjson now "$(date +%s)" '
  def ts: sub("\\.[0-9]+"; "") | sub("\\+00:00$"; "Z") | fromdateiso8601;
  def headline:
    . as $i
    | if $i.message != "" and ($i.title | contains($i.message) | not)
      then "\($i.title): \($i.message)" else $i.title end;
  # API 에러는 axios·인터셉터 내부 함수라 위치 정보가 없다 — 페이지만 보여준다
  def where:
    if .title == "ApiError" or .title == "AxiosError" then "" else
    ([.culprit | capture("data-sentry-component=\"(?<c>[^\"]+)\"") | .c] | first) as $component
    | if $component then $component
      elif .func != "" then .func
      elif .file != "" then (.file | split("/") | last)
      else .culprit end end;
  ($now - 86400) as $since
  | length as $fetched
  | map({
      id: (.id | tostring),
      title: (.title // "(제목 없음)"),
      message: (.metadata.value // ""),
      culprit: (.culprit // ""),
      file: (.metadata.filename // ""),
      func: (.metadata.function // ""),
      link: .permalink,
      events: (if (.stats["24h"] | type) == "array"
        then (.stats["24h"] | map(.[1]) | add // 0)
        else ((.count // "0") | tonumber) end),
      users: (.userCount // 0),
      firstSeen: ((.firstSeen // "1970-01-01T00:00:00Z") | ts),
      substatus: .substatus,
      level: (.level // "error")
    } | . + {headline: headline, where: where})
  | sort_by(-.events)
  | {
      now: $now,
      since: $since,
      fetched: $fetched,
      new: map(select(.firstSeen >= $since)),
      regressed: map(select(.firstSeen < $since and .substatus == "regressed")),
      top: .[0:3]
    }
' "$WORK/issues.json" > "$WORK/classified.json" || fail "이슈 분류 실패"

PAGES='{}'
while read -r ISSUE_ID; do
  [[ "$ISSUE_ID" =~ ^[0-9]+$ ]] || continue
  CODE=$(sentry_get "$WORK/event-$ISSUE_ID.json" \
    "$API/organizations/$SENTRY_ORG/issues/$ISSUE_ID/events/latest/" \
    --data-urlencode "environment=$SENTRY_ENV")
  is_2xx "$CODE" || continue
  PAGE=$(jq -r '
    [(.tags // [])[] | select(.key == "url") | .value][0]
      // [(.tags // [])[] | select(.key == "transaction") | .value][0]
      // ""
    | sub("^[a-z]+://[^/]+"; "") | sub("[?#].*$"; "")
  ' "$WORK/event-$ISSUE_ID.json" 2>/dev/null) || continue
  if [ -n "$PAGE" ]; then
    PAGES=$(jq -c --arg id "$ISSUE_ID" --arg page "$PAGE" '. + {($id): $page}' <<<"$PAGES")
  fi
done < <(jq -r --argjson max "$GH_ISSUE_MAX" '[.new[0:$max][], .regressed[0:$max][], .top[]] | map(.id) | unique | .[]' "$WORK/classified.json")

if [ "$DRY_RUN" = "1" ]; then
  echo "----- 이슈별 원본 값 (필드 확인용) -----"
  jq -r '["shortId", "stats24h합", "count", "lifetime", "userCount", "substatus", "firstSeen", "title", "metadata.value", "culprit"],
    (.[] | [.shortId, ((.stats["24h"] // []) | map(.[1]) | add // 0), .count, .lifetime.count, .userCount, .substatus, .firstSeen, .title, .metadata.value, .culprit])
    | @tsv' "$WORK/issues.json"
  echo "미해결(30일) X-Hits: ${UNRESOLVED:-없음}"
  echo "발생 페이지: $PAGES"
fi

# 공개 레포라 본문은 요약만 — 스택·요청 정보는 로그인이 필요한 Sentry 링크로 넘긴다
GH_JQ_DEFS='
  def clip($n): if length > $n then .[0:$n - 1] + "…" else . end;
  def norm: gsub("/[0-9]+(?=$|[/\\s?#])"; "/:id") | gsub("/[0-9a-fA-F]{8}-[0-9a-fA-F-]{27}"; "/:id");
  def code: "`" + (gsub("[\r\n]+"; " ") | gsub("`"; "\u0027") | gsub("\\|"; "\\|")) + "`";
  def kst: . + 32400 | strftime("%Y-%m-%d %H:%M");
  def place($page):
    if .where != "" and (.where | test("^[A-Za-z_$][\\w$.]*$")) then .where
    elif $page != "" then $page
    else "" end;
  def title($page):
    ([place($page), .title] | map(select(. != "")) | join(" ")) + " 수정"
    | gsub("[\r\n]+"; " ") | clip(70);
'

GH_LINKS='{}'
sync_github_issues() {
  local targets="$WORK/gh-targets.jsonl" existing="$WORK/gh-existing.json"
  local line id found state number url title

  jq -c --argjson max "$GH_ISSUE_MAX" \
    --argjson exclude "$GH_ISSUE_EXCLUDE" \
    '[(.new[] | . + {kind: "new"}), (.regressed[] | . + {kind: "regressed"})]
      | map(select((.level == "error" or .level == "fatal") and (.title as $t | $exclude | index($t) | not)))
      | .[0:$max] | .[]' \
    "$WORK/classified.json" > "$targets" || return 1
  [ -s "$targets" ] || return 0

  if [ "$DRY_RUN" != "1" ]; then
    gh label create sentry --color D93F0B --description "Sentry 일간 요약이 자동 생성한 에러 이슈" \
      >/dev/null 2>&1 || true
  fi
  gh issue list --label sentry --state all --limit 1000 --json number,state,stateReason,url,body \
    | jq 'map({key: ((.body // "") | capture("<!-- sentry-issue-id: (?<id>[0-9]+) -->") | .id),
               value: {number, state, stateReason, url}}) | from_entries' > "$existing" || return 1

  while IFS= read -r line; do
    id=$(jq -r '.id' <<<"$line")
    found=$(jq -c --arg id "$id" '.[$id] // empty' "$existing")
    url=""
    if [ -n "$found" ]; then
      state=$(jq -r '.state' <<<"$found")
      number=$(jq -r '.number' <<<"$found")
      url=$(jq -r '.url' <<<"$found")
      # "not planned" 로 닫은 이슈는 고칠 수 없다고 판단한 것 — 재발해도 다시 열지 않는다
      if [ "$state" = "CLOSED" ] && [ "$(jq -r '.stateReason' <<<"$found")" = "NOT_PLANNED" ]; then
        continue
      elif [ "$state" = "CLOSED" ]; then
        if [ "$DRY_RUN" = "1" ]; then
          echo "[GitHub] #$number 다시 열기 (Sentry $id)"
        elif ! gh issue reopen "$number" --comment "$(jq -r \
          '"Sentry 재발 감지: 지난 24시간 \(.events)회 · 유저 \(.users)명 · [Sentry](\(.link))"' <<<"$line")" >/dev/null; then
          echo "::warning::GitHub 이슈 #$number 다시 열기 실패"
        fi
      fi
    else
      title=$(jq -r --argjson pages "$PAGES" "$GH_JQ_DEFS"' title($pages[.id] // "" | norm)' <<<"$line")
      jq -r --arg label "$LABEL" --argjson pages "$PAGES" "$GH_JQ_DEFS"'
        ($pages[.id] // "" | norm) as $page
        | [
            "## Sentry 에러",
            "",
            "| 항목 | 값 |",
            "|---|---|",
            "| 프로젝트 | \($label) |",
            "| 에러 | \(.headline | norm | clip(300) | code) |",
            "| 페이지 | \(if $page != "" then ($page | code) else "없음" end) |",
            "| 위치 | \(if .where != "" then (.where | clip(120) | code) else "없음" end) |",
            "| 처음 발생 | \(.firstSeen | kst) KST |",
            "| 지난 24시간 | \(.events)회 · 유저 \(.users)명 |",
            "| Sentry | [이슈 열기](\(.link)) |",
            "",
            "- 스택 트레이스·요청 정보는 Sentry 링크에서 확인 (팀 계정 로그인 필요)",
            "- Sentry 일간 요약 워크플로우가 자동 생성한 이슈",
            "",
            "<!-- sentry-issue-id: \(.id) -->"
          ] | join("\n")
      ' <<<"$line" > "$WORK/gh-body.md"
      if [ "$DRY_RUN" = "1" ]; then
        printf '%s\n%s\n%s\n' "----- [GitHub] 새 이슈: $title -----" "$(cat "$WORK/gh-body.md")" "-----"
      elif url=$(gh issue create --title "$title" --body-file "$WORK/gh-body.md" --label fix --label "${SENTRY_PLATFORM:-WEB}" --label sentry); then
        number="${url##*/}"
      else
        echo "::warning::GitHub 이슈 생성 실패 (Sentry $id)"
        url=""
      fi
    fi
    if [ -n "$url" ]; then
      GH_LINKS=$(jq -c --arg id "$id" --arg url "$url" --arg n "$number" \
        '. + {($id): {url: $url, number: $n}}' <<<"$GH_LINKS")
    fi
  done < "$targets"
}

if [ -n "${GH_REPO:-}" ]; then
  sync_github_issues || echo "::warning::GitHub 이슈 동기화 실패 — Discord 요약만 전송"
fi

MESSAGE=$(jq -r \
  --arg label "$LABEL" \
  --arg unresolved "$UNRESOLVED" \
  --arg listUrl "$LIST_URL" \
  --argjson pages "$PAGES" \
  --argjson gh "$GH_LINKS" '
  def kst: . + 32400 | strftime("%m/%d %H:%M");
  def clip($n): if length > $n then .[0:$n - 1] + "…" else . end;
  # 이슈 제목·메시지는 외부 입력 — 링크 라벨 탈출과 서식 깨짐을 이스케이프로 막는다
  def esc: gsub("(?<c>[\\[\\]\\\\`*_~|<>])"; "\\\(.c)");

  def itemLine:
    ([($pages[.id] // "" | clip(60)), (.where | clip(80))] | map(select(. != "") | esc)) as $loc
    | "• \(.headline | clip(100) | esc)"
      + (if ($loc | length) > 0 then "\n  📍 \($loc | join(" · "))" else "" end)
      + "\n  \(.events)회 · 유저 \(.users)명 · [Sentry](<\(.link)>)"
      + (if $gh[.id] then " · [#\($gh[.id].number)](<\($gh[.id].url)>)" else "" end);

  def section($title; $items; $max):
    if ($items | length) == 0 then empty
    else
      ([$title] + ($items[0:$max] | map(itemLine))
        + (if ($items | length) > $max then ["  외 \(($items | length) - $max)건"] else [] end))
      | join("\n")
    end;

  def topSection($items):
    if ($items | length) == 0 then empty
    else
      (["🔥 24시간 최다 발생"]
        + ($items | to_entries | map(
            ($pages[.value.id] // "") as $page
            | "\(.key + 1). \(.value.headline | clip(60) | esc)"
              + (if $page != "" then " · \($page | clip(40) | esc)" else "" end)
              + " · \(.value.events)회 · [Sentry](<\(.value.link)>)")))
      | join("\n")
    end;

  . as $d
  | (if $unresolved != "" then " · 미해결(30일) \($unresolved)건" else "" end) as $unresolvedPart
  | "[미해결 이슈 전체 보기](<\($listUrl)>)" as $footer

  | if ($d.new | length) == 0 and ($d.regressed | length) == 0 then
      "📋 \($label) Sentry 지난 24시간 새 이슈·재발 없음 · 발생 이슈 \($d.fetched)건\($unresolvedPart) · \($footer)"
    else
      def build($max; $withTop):
        [
          "📋 \($label) Sentry 일간 요약 (\($d.since | kst) ~ \($d.now | kst) KST)\n새 이슈 \($d.new | length)건 · 재발 \($d.regressed | length)건 · 발생 이슈 \($d.fetched)건\(if $d.fetched >= 100 then "(조회 상한)" else "" end)\($unresolvedPart)",
          section("🆕 새 이슈"; $d.new; $max),
          section("🔁 재발 (해결 처리 뒤 다시 발생)"; $d.regressed; $max),
          (if $withTop then topSection($d.top) else empty end),
          $footer
        ] | join("\n\n");
      # Discord 메시지 상한 2000자 — 최다 발생 섹션부터 빼고, 그래도 넘치면 섹션별 건수를 줄인다
      [build(5; true), build(5; false), build(3; false), build(2; false), build(1; false)]
      | map(select(length <= 2000))
      | .[0] // (build(1; false) | .[0:1990] + "…")
    end
  ' "$WORK/classified.json") || fail "메시지 조립 실패"

send_discord "$MESSAGE"
