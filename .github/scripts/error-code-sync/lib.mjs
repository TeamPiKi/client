const CODE = '[A-Z]+(?:-[A-Z0-9]+)+';

export const CLIENT_EXCLUDED_PREFIXES = ['APPLE'];

export const BOT_MARKER = '<!-- error-code-sync -->';

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const codePrefix = code => code.split('-')[0];

export const compareCodes = (a, b) => {
  const pa = a.split('-');
  const pb = b.split('-');
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const x = pa[i];
    const y = pb[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (x === y) continue;
    if (/^\d+$/.test(x) && /^\d+$/.test(y)) return Number(x) - Number(y);
    return x < y ? -1 : 1;
  }
  return 0;
};

export const stripKotlinComments = src => {
  let out = '';
  let inString = false;
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    const n = src[i + 1];
    if (inString) {
      out += c;
      if (c === '\\') {
        out += n ?? '';
        i += 1;
      } else if (c === '"') {
        inString = false;
      }
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
    } else if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') i += 1;
      out += '\n';
    } else if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 1;
      out += ' ';
    } else {
      out += c;
    }
  }
  return out;
};

const PAIRS = { '(': ')', '{': '}' };

const matchClose = (src, open) => {
  const o = src[open];
  const c = PAIRS[o];
  let depth = 0;
  let inString = false;
  for (let i = open; i < src.length; i += 1) {
    const ch = src[i];
    if (inString) {
      if (ch === '\\') i += 1;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === o) depth += 1;
    else if (ch === c) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error(`'${o}' 의 닫는 괄호를 찾지 못함`);
};

const parseAddAllArg = arg => {
  const m = arg.match(/^([A-Z][A-Za-z0-9]*)\.entries(?:\.filter\s*\{([\s\S]*)\})?$/);
  if (!m) throw new Error(`addAll 인자를 해석할 수 없음: ${arg}`);
  const [, enumName, filterBody] = m;
  if (filterBody === undefined) return { enumName, excluded: [] };
  const excluded = filterBody.split('&&').map(cond => {
    const c = cond.trim().match(/^it\s*!=\s*([A-Z][A-Za-z0-9]*)\.([A-Z][A-Z0-9_]*)$/);
    if (!c || c[1] !== enumName) throw new Error(`filter 조건을 해석할 수 없음: ${cond.trim()}`);
    return c[2];
  });
  return { enumName, excluded };
};

export const parseRegistry = src => {
  const code = stripKotlinComments(src);
  const objectAt = code.indexOf('object ErrorCodeRegistry');
  if (objectAt === -1) throw new Error('ErrorCodeRegistry 를 찾지 못함');
  const listAt = code.indexOf('buildList', objectAt);
  const open = listAt === -1 ? -1 : code.indexOf('{', listAt);
  if (open === -1) throw new Error('ErrorCodeRegistry.all 의 buildList 를 찾지 못함');
  const body = code.slice(open + 1, matchClose(code, open));

  const entries = [];
  let rest = '';
  let i = 0;
  while (i < body.length) {
    const at = body.indexOf('addAll(', i);
    if (at === -1) {
      rest += body.slice(i);
      break;
    }
    rest += body.slice(i, at);
    const paren = at + 'addAll'.length;
    const close = matchClose(body, paren);
    entries.push(parseAddAllArg(body.slice(paren + 1, close).trim()));
    i = close + 1;
  }
  if (rest.trim())
    throw new Error(`ErrorCodeRegistry 에 해석할 수 없는 구문: ${rest.trim().slice(0, 80)}`);
  if (entries.length === 0) throw new Error('ErrorCodeRegistry 에 등록된 enum 이 없음');
  return entries;
};

const unescapeKotlin = s => s.replace(/\\(.)/g, (_, c) => ({ n: '\n', t: '\t' })[c] ?? c);

export const parseEnumEntries = src => {
  const code = stripKotlinComments(src);
  const entryRe = new RegExp(
    String.raw`\b([A-Z][A-Z0-9_]*)\(\s*"(${CODE})"\s*,\s*ErrorCategory\.([A-Z_]+)\s*,\s*"((?:[^"\\]|\\.)*)"`,
    'g'
  );
  const entries = [...code.matchAll(entryRe)].map(m => ({
    name: m[1],
    code: m[2],
    category: m[3],
    message: unescapeKotlin(m[4]),
  }));
  if (entries.length === 0) throw new Error('enum 항목을 찾지 못함');
  const literals = [...code.matchAll(new RegExp(`"(${CODE})"`, 'g'))].length;
  if (literals !== entries.length) {
    throw new Error(`해석하지 못한 code 가 있음 (code ${literals}개, 항목 ${entries.length}개)`);
  }
  return entries;
};

export const parseCategoryStatuses = src => {
  const code = stripKotlinComments(src);
  return new Map(
    [...code.matchAll(/\b([A-Z][A-Z_]*)\(\s*HttpStatus\.([A-Z_]+)/g)].map(m => [
      m[1],
      HTTP_STATUS[m[2]] ?? null,
    ])
  );
};

export const collectServerCodes = ({ registry, enumSources, categoryStatus }) => {
  const codes = new Map();
  for (const { enumName, excluded } of registry) {
    const src = enumSources.get(enumName);
    if (src === undefined) throw new Error(`${enumName} 파일이 없음`);
    const entries = parseEnumEntries(src);
    for (const name of excluded) {
      if (!entries.some(e => e.name === name))
        throw new Error(`${enumName} 에 제외 대상 ${name} 이 없음`);
    }
    for (const entry of entries) {
      if (excluded.includes(entry.name)) continue;
      if (codes.has(entry.code)) throw new Error(`중복 code: ${entry.code}`);
      codes.set(entry.code, {
        ...entry,
        enumName,
        status: categoryStatus.get(entry.category) ?? null,
      });
    }
  }
  return codes;
};

const BLOCKS = {
  map: {
    start: /^export const ERROR_MESSAGE_MAP = \{$/,
    end: /^\} as const;$/,
    entry: new RegExp(`^\\s*'(${CODE})':`),
  },
  const: {
    start: /^export const ERROR_CODE = \{$/,
    end: /^\} as const satisfies /,
    entry: new RegExp(`^\\s*[A-Z][A-Z0-9_]*: '(${CODE})',$`),
  },
};

const GROUP_COMMENT = /^\s*\/\*\*.*\*\/$/;

const blockRange = (lines, kind) => {
  const { start, end } = BLOCKS[kind];
  const s = lines.findIndex(l => start.test(l));
  const e = s === -1 ? -1 : lines.findIndex((l, i) => i > s && end.test(l));
  if (s === -1 || e === -1)
    throw new Error(
      `카탈로그에서 ${kind === 'map' ? 'ERROR_MESSAGE_MAP' : 'ERROR_CODE'} 블록을 찾지 못함`
    );
  return { start: s, end: e };
};

const entryCode = (line, kind) => line.match(BLOCKS[kind].entry)?.[1] ?? null;

export const parseClientCatalog = src => {
  const lines = src.split('\n');
  const map = blockRange(lines, 'map');
  const consts = blockRange(lines, 'const');
  const messageCodes = lines
    .slice(map.start + 1, map.end)
    .map(l => entryCode(l, 'map'))
    .filter(Boolean);
  const constants = lines
    .slice(consts.start + 1, consts.end)
    .map(l => l.match(new RegExp(`^\\s*([A-Z][A-Z0-9_]*): '(${CODE})',$`)))
    .filter(Boolean)
    .map(m => ({ name: m[1], code: m[2] }));
  return { messageCodes, constants };
};

export const diffCodes = ({
  server,
  serverMainCodes,
  client,
  excludedPrefixes = CLIENT_EXCLUDED_PREFIXES,
}) => {
  const isExcluded = code => excludedPrefixes.includes(codePrefix(code));
  const clientCodes = new Set(client.messageCodes);
  const added = [...server.values()]
    .filter(e => !clientCodes.has(e.code) && !isExcluded(e.code))
    .map(e => ({ ...e, inMain: serverMainCodes ? serverMainCodes.has(e.code) : null }))
    .sort((a, b) => compareCodes(a.code, b.code));
  const removed = client.messageCodes
    .filter(code => !server.has(code) && !isExcluded(code))
    .sort(compareCodes)
    .map(code => ({
      code,
      constants: client.constants.filter(k => k.code === code).map(k => k.name),
    }));
  return { added, removed };
};

export const suggestConstantName = (entry, constants) => {
  const prefix = codePrefix(entry.code);
  const group = constants.filter(k => codePrefix(k.code) === prefix).map(k => k.name.split('_'));
  let head = [prefix];
  if (group.length >= 2) {
    const common = group.reduce((acc, tokens) => {
      let i = 0;
      while (i < acc.length && acc[i] === tokens[i]) i += 1;
      return acc.slice(0, i);
    });
    if (common.length > 0 && group.every(tokens => tokens.length > common.length)) head = common;
  }
  const own = entry.name.split('_').filter(t => t !== prefix);
  return [...head, ...(own.length > 0 ? own : entry.name.split('_'))].join('_');
};

const escapeTs = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const insertEntry = (lines, kind, code, newLine) => {
  const { start, end } = blockRange(lines, kind);
  const prefix = codePrefix(code);
  const same = [];
  for (let i = start + 1; i < end; i += 1) {
    const c = entryCode(lines[i], kind);
    if (c && codePrefix(c) === prefix) same.push({ i, c });
  }
  const next = [...lines];
  if (same.length > 0) {
    const ordered = /-\d+$/.test(code);
    const after = ordered
      ? same.find(s => /-\d+$/.test(s.c) && compareCodes(s.c, code) > 0)
      : undefined;
    next.splice(after ? after.i : same[same.length - 1].i + 1, 0, newLine);
    return next;
  }
  const lead = lines[end - 1].trim() === '' ? [] : [''];
  next.splice(end, 0, ...lead, `  /** ${prefix} */`, newLine);
  return next;
};

const removeEntry = (lines, kind, code) => {
  const { start, end } = blockRange(lines, kind);
  return lines.filter((l, i) => i <= start || i >= end || entryCode(l, kind) !== code);
};

const tidyBlock = (lines, kind) => {
  const { start, end } = blockRange(lines, kind);
  const inner = lines.slice(start + 1, end);
  const kept = inner.filter((l, i) => {
    if (!GROUP_COMMENT.test(l)) return true;
    const next = inner[i + 1];
    return next !== undefined && entryCode(next, kind) !== null;
  });
  const collapsed = kept.filter(
    (l, i) => !(l.trim() === '' && (i === 0 || kept[i - 1].trim() === ''))
  );
  while (collapsed.length > 0 && collapsed[collapsed.length - 1].trim() === '') collapsed.pop();
  return [...lines.slice(0, start + 1), ...collapsed, ...lines.slice(end)];
};

export const applyCatalogChanges = (src, { added, removed }, { references = new Map() } = {}) => {
  const { constants } = parseClientCatalog(src);
  const known = [...constants];
  let lines = src.split('\n');
  const applied = { added: [], removed: [] };
  const manual = [];

  for (const entry of added) {
    if (entry.message.includes('${')) {
      manual.push({ code: entry.code, reason: '서버 문구에 변수가 있음', detail: entry.message });
      continue;
    }
    const name = suggestConstantName(entry, known);
    if (known.some(k => k.name === name)) {
      manual.push({
        code: entry.code,
        reason: `상수 이름 \`${name}\` 이 이미 있음`,
        detail: entry.message,
      });
      continue;
    }
    lines = insertEntry(
      lines,
      'map',
      entry.code,
      `  '${entry.code}': '${escapeTs(entry.message)}',`
    );
    lines = insertEntry(lines, 'const', entry.code, `  ${name}: '${entry.code}',`);
    known.push({ name, code: entry.code });
    applied.added.push({ ...entry, constantName: name });
  }

  for (const { code, constants: names } of removed) {
    const refs = references.get(code) ?? [];
    if (refs.length > 0) {
      manual.push({
        code,
        reason: '서버에서 사라졌지만 프론트 코드가 참조 중',
        detail: refs.join(' · '),
      });
      continue;
    }
    lines = removeEntry(removeEntry(lines, 'map', code), 'const', code);
    applied.removed.push({ code, constants: names });
  }

  lines = tidyBlock(tidyBlock(lines, 'map'), 'const');
  return { source: lines.join('\n'), applied, manual };
};

const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

const short = sha => (sha ? `\`${sha.slice(0, 7)}\`` : '확인 불가');

const MAIN_LABEL = { true: '반영됨', false: 'dev 에만 있음', null: '확인 불가' };

export const renderPrBody = ({
  applied,
  manual,
  serverRepo,
  serverDevSha,
  serverMainSha,
  clientSha,
}) => {
  const summary = `추가 ${applied.added.length} · 삭제 ${applied.removed.length} · 직접 처리 ${manual.length}`;
  const parts = [
    BOT_MARKER,
    '## 작업 요약',
    '',
    `- 서버 에러 코드 등록 목록과 프론트 에러 코드 카탈로그의 차이를 맞춥니다 (${summary})`,
    '',
    '## 작업 세부 내용',
    '',
    '### 배경',
    '',
    `매일 서버 \`${serverRepo}\` 의 \`ErrorCodeRegistry\` 와 \`packages/core/src/consts/errorCode.ts\` 를 대조하는 워크플로우가 만든 PR 입니다. 새 코드에는 서버 문구를 그대로 넣었습니다. 화면에 맞게 다듬을 곳이 있으면 이 브랜치에 커밋해 주세요. 사람 커밋이 생기면 봇은 이 PR 을 더 갱신하지 않습니다.`,
  ];

  if (applied.added.length > 0) {
    parts.push(
      '',
      '### 추가',
      '',
      '| code | HTTP | 서버 문구 | 상수 (초안) | 서버 운영(main) |',
      '|---|---|---|---|---|',
      ...applied.added.map(
        e =>
          `| \`${e.code}\` | ${e.status ?? '?'} | ${cell(e.message)} | \`${e.constantName}\` | ${MAIN_LABEL[e.inMain]} |`
      )
    );
  }

  if (applied.removed.length > 0) {
    parts.push(
      '',
      '### 삭제',
      '',
      '서버 등록 목록에서 사라졌고 프론트 코드에서 참조하지 않는 코드입니다.',
      '',
      '| code | 상수 |',
      '|---|---|',
      ...applied.removed.map(
        r => `| \`${r.code}\` | ${r.constants.map(n => `\`${n}\``).join(' · ') || '없음'} |`
      )
    );
  }

  if (manual.length > 0) {
    parts.push(
      '',
      '### 직접 처리 필요',
      '',
      '자동으로 고치지 않은 코드입니다.',
      '',
      '| code | 이유 | 상세 |',
      '|---|---|---|',
      ...manual.map(m => `| \`${m.code}\` | ${cell(m.reason)} | ${cell(m.detail)} |`)
    );
  }

  parts.push(
    '',
    '### 기준',
    '',
    `- 서버 \`${serverRepo}\` dev ${short(serverDevSha)} · main ${short(serverMainSha)}`,
    `- 프론트 dev ${short(clientSha)}`,
    ''
  );
  return parts.join('\n');
};

export const stableBody = body => body.replace(/### 기준[\s\S]*?(?=\n## |$)/, '');

export const renderDiscordMessage = ({ url, action, applied, manual }) =>
  `🔄 서버 에러 코드 카탈로그 동기화 PR ${action === 'created' ? '생성' : '갱신'} · 추가 ${applied.added.length} · 삭제 ${applied.removed.length} · 직접 처리 ${manual.length}\n<${url}>`;
