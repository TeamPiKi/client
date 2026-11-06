#!/usr/bin/env bash
set -euo pipefail

: "${VERCEL_TOKEN:?VERCEL_TOKEN 이 없습니다}"
: "${VERCEL_TEAM_ID:?VERCEL_TEAM_ID 가 없습니다}"
DRY_RUN="${DRY_RUN:-0}"
if [ "$DRY_RUN" != "1" ]; then
  : "${DISCORD_BOT_TOKEN:?DISCORD_BOT_TOKEN 이 없습니다}"
  : "${CHANNEL_ID:?CHANNEL_ID 가 없습니다}"
else
  CHANNEL_ID="${CHANNEL_ID:-channel}"
fi

LIMIT_GBHR=360
LIMIT_INVOCATIONS=1000000
LIMIT_FDT_BYTES=100000000000

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

discord_post() {
  local path="$1" body="$2" code
  code=$(curl -sS --max-time 10 -o "$WORK/discord.json" -w '%{http_code}' \
    -X POST "https://discord.com/api/v10$path" \
    -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
    -H "Content-Type: application/json; charset=utf-8" \
    --data "$body") || code="000"
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "::error::Discord 요청 실패 $path (HTTP $code) $(cat "$WORK/discord.json" 2>/dev/null)" >&2
    return 1
  fi
  jq -r '.id' "$WORK/discord.json"
}

send_discord() {
  local channel="$1" text="$2"
  if [ "$DRY_RUN" = "1" ]; then
    printf '%s\n%s\n' "----- Discord 메시지 → $channel ($(jq -rn --arg t "$text" '$t | length')자) -----" "$text" >&2
    echo "dry-run-$channel"
    return 0
  fi
  discord_post "/channels/$channel/messages" \
    "$(jq -n --arg content "$text" '{content: $content, allowed_mentions: {parse: []}}')"
}

start_thread() {
  local message_id="$1" name="$2"
  if [ "$DRY_RUN" = "1" ]; then
    echo "----- 스레드 생성: $name -----" >&2
    echo "thread"
    return 0
  fi
  discord_post "/channels/$CHANNEL_ID/messages/$message_id/threads" \
    "$(jq -n --arg name "$name" '{name: $name, auto_archive_duration: 10080}')"
}

fail() {
  echo "::error::$1"
  send_discord "$CHANNEL_ID" "⚠️ Vercel 사용량 주간 요약 실패: $1" >/dev/null || true
  exit 1
}

is_2xx() { [ "${1:0:1}" = "2" ] && [ "${#1}" -eq 3 ]; }

END=$(jq -n --argjson now "$(date +%s)" '(($now + 32400) / 86400 | floor) * 86400 - 32400')
START=$((END - 7 * 86400))
START_ISO=$(jq -rn --argjson t "$START" '$t | todate')
END_ISO=$(jq -rn --argjson t "$END" '$t | todate')

query() {
  local out="$1" body="$2" code
  code=$(curl -sS --max-time 60 -o "$out" -w '%{http_code}' \
    -X POST "https://api.vercel.com/v2/observability/query?teamId=$VERCEL_TEAM_ID" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$body") || code="000"
  echo "$code"
}

query_body() {
  jq -n \
    --arg metric "$1" \
    --arg teamId "$VERCEL_TEAM_ID" \
    --arg start "$START_ISO" \
    --arg end "$END_ISO" \
    --argjson groupBy "$2" '
    {
      metric: $metric,
      aggregation: "sum",
      scope: {type: "owner", ownerId: $teamId},
      startTime: $start,
      endTime: $end,
      granularity: {days: 1},
      bucketTimezone: "Asia/Seoul"
    }
    + (if ($groupBy | length) > 0 then {groupBy: $groupBy, limit: 5} else {} end)
  '
}

METRICS=(
  "gbhr:vercel.function_invocation.function_duration_gbhr"
  "invocations:vercel.function_invocation.count"
  "fdt:vercel.request.fdt_total_bytes"
)

for entry in "${METRICS[@]}"; do
  key="${entry%%:*}"
  metric="${entry#*:}"
  CODE=$(query "$WORK/$key.json" "$(query_body "$metric" '[]')")
  is_2xx "$CODE" || fail "$metric 조회 HTTP $CODE $(head -c 200 "$WORK/$key.json" 2>/dev/null)"
  jq -e '.summary | type == "array"' "$WORK/$key.json" >/dev/null || fail "$metric 응답 형식 오류"

  CODE=$(query "$WORK/$key-routes.json" "$(query_body "$metric" '["route"]')")
  is_2xx "$CODE" || fail "$metric 경로별 조회 HTTP $CODE $(head -c 200 "$WORK/$key-routes.json" 2>/dev/null)"
  jq -e '.summary | type == "array"' "$WORK/$key-routes.json" >/dev/null || fail "$metric 경로별 응답 형식 오류"
done

HISTORY_BRANCH="${HISTORY_BRANCH:-vercel-usage-history}"
HISTORY_PARENT=""
REMOTE_CODE=0
git ls-remote --exit-code origin "refs/heads/$HISTORY_BRANCH" >/dev/null 2>&1 || REMOTE_CODE=$?
case "$REMOTE_CODE" in
  0)
    git fetch -q --depth=1 origin "$HISTORY_BRANCH" || fail "누적 기록 브랜치 fetch 실패"
    HISTORY_PARENT=$(git rev-parse FETCH_HEAD)
    git show FETCH_HEAD:usage.json > "$WORK/history.json" || fail "누적 기록 읽기 실패"
    ;;
  2) echo '{}' > "$WORK/history.json" ;;
  *) fail "누적 기록 브랜치 조회 실패" ;;
esac

jq -n -S \
  --argjson end "$END" \
  --slurpfile history "$WORK/history.json" \
  --slurpfile gbhr "$WORK/gbhr.json" \
  --slurpfile invocations "$WORK/invocations.json" \
  --slurpfile fdt "$WORK/fdt.json" '
  def kstDay: sub("\\.[0-9]+"; "") | fromdateiso8601 + 32400 | strftime("%Y-%m-%d");
  def daily($r; $key): $r[0].data | map({(.timestamp | kstDay): {($key): (to_entries | map(select(.key | endswith("_sum"))) | (.[0].value // 0))}}) | add // {};
  ($end - 90 * 86400 + 32400 | strftime("%Y-%m-%d")) as $keepFrom
  | [$history[0], daily($gbhr; "gbhr"), daily($invocations; "invocations"), daily($fdt; "fdt")]
  | reduce .[] as $part ({}; . * $part)
  | with_entries(select(.key >= $keepFrom))
' > "$WORK/history-next.json" || fail "누적 기록 병합 실패"

jq -n \
  --argjson start "$START" \
  --argjson end "$END" \
  --slurpfile history "$WORK/history-next.json" \
  --slurpfile gbhrRoutes "$WORK/gbhr-routes.json" \
  --slurpfile invocationsRoutes "$WORK/invocations-routes.json" \
  --slurpfile fdtRoutes "$WORK/fdt-routes.json" '
  def kstDay: . + 32400 | strftime("%Y-%m-%d");
  def valueOf: to_entries | map(select(.key | endswith("_sum"))) | (.[0].value // 0);
  def routes($r): $r[0].summary
    | map({route: (.route // "(알 수 없음)"), value: valueOf})
    | map(select(.value > 0))
    | sort_by(-.value);
  def window($from): $history[0] | to_entries | map(select(.key >= ($from | kstDay) and .key < ($end | kstDay)) | .value);
  def sum($days; $key): $days | map(.[$key] // 0) | add // 0;
  window($start) as $week
  | window($end - 30 * 86400) as $month
  | {
      start: $start,
      end: $end,
      gbhr: {week: sum($week; "gbhr"), month: sum($month; "gbhr"), routes: routes($gbhrRoutes)},
      invocations: {week: sum($week; "invocations"), month: sum($month; "invocations"), routes: routes($invocationsRoutes)},
      fdt: {week: sum($week; "fdt"), month: sum($month; "fdt"), routes: routes($fdtRoutes)}
    }
' > "$WORK/usage.json" || fail "사용량 집계 실패"

if [ "$DRY_RUN" = "1" ]; then
  echo "----- 누적 기록 -----"
  jq -c 'to_entries[]' "$WORK/history-next.json"
  echo "----- 집계 결과 -----"
  jq 'del(.[].routes?)' "$WORK/usage.json"
fi

FORMAT='
  def kstDate: . + 32400 | strftime("%m/%d");
  def round($n): (. * pow(10; $n) | round) / pow(10; $n);
  def pct($limit): (. / $limit * 100 | round(1) | tostring) + "%";
  def comma: tostring | if length <= 3 then . else (.[0:-3] | comma) + "," + .[-3:] end;
  def fmtGbhr: (round(2) | tostring) + " GB-hr";
  def fmtCount: round | comma + "회";
  def fmtBytes:
    if . >= 1e9 then ((. / 1e9 | round(2)) | tostring) + " GB"
    else ((. / 1e6 | round(1)) | tostring) + " MB" end;
  def esc: gsub("(?<c>[\\[\\]\\\\`*_~|<>])"; "\\\(.c)");
  def period: "\(.start | kstDate) ~ \(.end - 1 | kstDate)";
'

SUMMARY=$(jq -r \
  --argjson limitGbhr "$LIMIT_GBHR" \
  --argjson limitInvocations "$LIMIT_INVOCATIONS" \
  --argjson limitFdt "$LIMIT_FDT_BYTES" "$FORMAT"'
  def line($title; $m; $limit; fmt):
    "- \($title) **\($m.month | pct($limit))** (\($m.month | fmt)/\($limit | fmt). 🔺\($m.week | fmt))";

  "### 📊 Vercel 주간 사용량 요약",
  line("함수 메모리"; .gbhr; $limitGbhr; fmtGbhr),
  line("함수 호출"; .invocations; $limitInvocations; fmtCount),
  line("전송량"; .fdt; $limitFdt; fmtBytes),
  "-# (\(period) KST)"
' "$WORK/usage.json") || fail "요약 메시지 조립 실패"

DETAIL=$(jq -r "$FORMAT"'
  def block($title; $m; fmt):
    ["### \($title) 경로별 상위"]
    + (if ($m.routes | length) == 0 then ["- 발생 없음"]
       else $m.routes | map("- \(.route | esc): \(.value | fmt)") end)
    | join("\n");

  block("함수 메모리"; .gbhr; fmtGbhr),
  "",
  block("함수 호출"; .invocations; fmtCount),
  "",
  block("전송량"; .fdt; fmtBytes)
' "$WORK/usage.json") || fail "상세 메시지 조립 실패"

THREAD_NAME=$(jq -r "$FORMAT"'"Vercel 사용량 \(period)"' "$WORK/usage.json")

if [ "$DRY_RUN" != "1" ]; then
  HISTORY_BLOB=$(git hash-object -w "$WORK/history-next.json")
  HISTORY_TREE=$(printf '100644 blob %s\tusage.json\n' "$HISTORY_BLOB" | git mktree)
  HISTORY_COMMIT=$(GIT_AUTHOR_NAME='github-actions[bot]' \
    GIT_AUTHOR_EMAIL='41898282+github-actions[bot]@users.noreply.github.com' \
    GIT_COMMITTER_NAME='github-actions[bot]' \
    GIT_COMMITTER_EMAIL='41898282+github-actions[bot]@users.noreply.github.com' \
    git commit-tree "$HISTORY_TREE" ${HISTORY_PARENT:+-p "$HISTORY_PARENT"} \
    -m "chore: Vercel 사용량 기록 $(jq -r "$FORMAT"'period' "$WORK/usage.json")") || fail "누적 기록 커밋 실패"
  git push -q origin "$HISTORY_COMMIT:refs/heads/$HISTORY_BRANCH" || fail "누적 기록 push 실패"
fi

MESSAGE_ID=$(send_discord "$CHANNEL_ID" "$SUMMARY") || exit 1
THREAD_ID=$(start_thread "$MESSAGE_ID" "$THREAD_NAME") || fail "스레드 생성 실패"
send_discord "$THREAD_ID" "$DETAIL" >/dev/null || fail "상세 메시지 전송 실패"
