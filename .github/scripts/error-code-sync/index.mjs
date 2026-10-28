import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  BOT_MARKER,
  applyCatalogChanges,
  collectServerCodes,
  diffCodes,
  parseCategoryStatuses,
  parseClientCatalog,
  parseRegistry,
  renderPrBody,
  stableBody,
} from './lib.mjs';

const SERVER_REPO = process.env.SERVER_REPO ?? 'TeamPiKi/core';
const BASE = process.env.BASE_BRANCH ?? 'dev';
const BOT_BRANCH = process.env.BOT_BRANCH ?? 'chore/error-code-sync';
const CATALOG = 'packages/core/src/consts/errorCode.ts';
const DRY_RUN = process.env.DRY_RUN === '1';
const PR_TITLE = 'chore: 서버 에러 코드 카탈로그 동기화';
const BOT_NAME = 'TeamPiki-bot';
const BOT_EMAIL = '349097567+TeamPiki-bot@users.noreply.github.com';
const PAUSED_MARKER = '<!-- error-code-sync:paused -->';

const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'],
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  }).trim();

const tryRun = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};

const gh = (...args) => run('gh', args);

const serverFile = (path, ref) =>
  gh(
    'api',
    '-H',
    'Accept: application/vnd.github.raw',
    `repos/${SERVER_REPO}/contents/${path}?ref=${ref}`
  );

const fetchServerCodes = ref => {
  const sha = gh('api', `repos/${SERVER_REPO}/commits/${ref}`, '--jq', '.sha');
  const tree = JSON.parse(gh('api', `repos/${SERVER_REPO}/git/trees/${sha}?recursive=1`));
  if (tree.truncated) throw new Error('서버 레포 트리가 잘려 파일을 모두 찾을 수 없음');
  const paths = tree.tree
    .filter(t => t.type === 'blob' && t.path.startsWith('src/main/'))
    .map(t => t.path);
  const findOne = basename => {
    const hits = paths.filter(p => p.endsWith(`/${basename}`));
    if (hits.length !== 1)
      throw new Error(`${basename} 를 하나로 특정하지 못함 (${hits.length}개)`);
    return hits[0];
  };

  const registry = parseRegistry(serverFile(findOne('ErrorCodeCatalog.kt'), sha));
  const categoryStatus = parseCategoryStatuses(serverFile(findOne('ErrorCategory.kt'), sha));
  const enumSources = new Map(
    registry.map(({ enumName }) => [enumName, serverFile(findOne(`${enumName}.kt`), sha)])
  );
  return { sha, codes: collectServerCodes({ registry, enumSources, categoryStatus }) };
};

const findReferences = (code, constantNames) => {
  const patterns = [...constantNames.map(n => `ERROR_CODE.${n}`), `'${code}'`, `"${code}"`];
  const r = spawnSync(
    'git',
    [
      'grep',
      '-n',
      '-F',
      '-w',
      ...patterns.flatMap(p => ['-e', p]),
      '--',
      'apps',
      'packages',
      `:(exclude)${CATALOG}`,
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  );
  if (r.status === 1) return [];
  if (r.status !== 0) {
    throw new Error(`${code} 참조 검색 실패: ${r.error?.message ?? r.stderr.trim()}`);
  }
  return r.stdout
    .trim()
    .split('\n')
    .map(line => line.split(':').slice(0, 2).join(':'));
};

const formatCatalog = text =>
  `${run('pnpm', ['exec', 'prettier', '--stdin-filepath', CATALOG], { input: text })}\n`;

const writeTemp = (name, text) => {
  const path = join(mkdtempSync(join(tmpdir(), 'error-code-sync-')), name);
  writeFileSync(path, text);
  return path;
};

const findOpenBotPr = () =>
  JSON.parse(
    gh(
      'pr',
      'list',
      '--head',
      BOT_BRANCH,
      '--base',
      BASE,
      '--state',
      'open',
      '--json',
      'number,url,body'
    )
  ).find(pr => pr.body.includes(BOT_MARKER)) ?? null;

const remoteBranchExists = () =>
  tryRun('git', ['ls-remote', '--exit-code', '--heads', 'origin', BOT_BRANCH]) !== null;

const humanCommitsOnBotBranch = () => {
  run('git', [
    'fetch',
    '--quiet',
    'origin',
    `+refs/heads/${BOT_BRANCH}:refs/remotes/origin/${BOT_BRANCH}`,
  ]);
  return run('git', ['log', '--format=%ae', `origin/${BASE}..origin/${BOT_BRANCH}`])
    .split('\n')
    .filter(email => email && email !== BOT_EMAIL);
};

const pauseOnce = pr => {
  const comments = JSON.parse(gh('pr', 'view', String(pr.number), '--json', 'comments')).comments;
  if (comments.some(c => c.body.includes(PAUSED_MARKER))) return;
  gh(
    'pr',
    'comment',
    String(pr.number),
    '--body',
    `${PAUSED_MARKER}\n사람이 올린 커밋이 있어 자동 갱신을 멈춥니다. 서버와의 차이가 새로 생기면 이 PR 을 머지하거나 닫은 뒤 다음 실행에서 다시 맞춥니다.`
  );
};

const dev = fetchServerCodes('dev');
let main = null;
try {
  main = fetchServerCodes('main');
} catch (error) {
  console.log(`::warning::서버 main 조회 실패, 운영 반영 여부는 생략: ${error.message}`);
}

const source = readFileSync(CATALOG, 'utf8');
const diff = diffCodes({
  server: dev.codes,
  serverMainCodes: main ? new Set(main.codes.keys()) : null,
  client: parseClientCatalog(source),
});
const references = new Map(diff.removed.map(r => [r.code, findReferences(r.code, r.constants)]));
const result = applyCatalogChanges(source, diff, { references });
const formatted = formatCatalog(result.source);
const catalogChanged = formatted !== formatCatalog(source);
const hasDifference = catalogChanged || result.manual.length > 0;
const body = renderPrBody({
  ...result,
  serverRepo: SERVER_REPO,
  serverDevSha: dev.sha,
  serverMainSha: main?.sha ?? null,
  clientSha: run('git', ['rev-parse', 'HEAD']),
});

if (DRY_RUN) {
  const after = writeTemp('errorCode.ts', formatted);
  const patch = spawnSync('git', ['diff', '--no-index', '--', CATALOG, after], {
    encoding: 'utf8',
  });
  console.log(patch.stdout || '카탈로그 변경 없음');
  console.log(hasDifference ? body : '서버와 카탈로그가 일치함');
  process.exit(0);
}

const openPr = findOpenBotPr();

if (!hasDifference) {
  if (openPr) {
    gh(
      'pr',
      'close',
      String(openPr.number),
      '--comment',
      '서버 등록 목록과 카탈로그가 다시 일치해서 닫습니다.',
      '--delete-branch'
    );
    console.log(`봇 PR #${openPr.number} 닫음`);
  } else {
    console.log('서버와 카탈로그가 일치함');
  }
  process.exit(0);
}

if (openPr && remoteBranchExists()) {
  if (humanCommitsOnBotBranch().length > 0) {
    pauseOnce(openPr);
    console.log(`봇 PR #${openPr.number} 에 사람 커밋이 있어 갱신하지 않음`);
    process.exit(0);
  }
  const remoteCatalog = tryRun('git', ['show', `origin/${BOT_BRANCH}:${CATALOG}`]);
  if (
    remoteCatalog !== null &&
    `${remoteCatalog}\n` === formatted &&
    stableBody(openPr.body) === stableBody(body)
  ) {
    console.log(`봇 PR #${openPr.number} 이 이미 최신`);
    process.exit(0);
  }
}

writeFileSync(CATALOG, formatted);
run('git', ['switch', '--quiet', '-C', BOT_BRANCH]);
run('git', ['add', CATALOG]);
run('git', [
  '-c',
  `user.name=${BOT_NAME}`,
  '-c',
  `user.email=${BOT_EMAIL}`,
  'commit',
  '--quiet',
  '--allow-empty',
  '-m',
  PR_TITLE,
]);
run('git', ['push', '--quiet', '--force', 'origin', `HEAD:refs/heads/${BOT_BRANCH}`]);

const bodyFile = writeTemp('body.md', body);
let url;
let action;
if (openPr) {
  gh('pr', 'edit', String(openPr.number), '--body-file', bodyFile);
  url = openPr.url;
  action = 'updated';
} else {
  url = gh(
    'pr',
    'create',
    '--base',
    BASE,
    '--head',
    BOT_BRANCH,
    '--title',
    PR_TITLE,
    '--body-file',
    bodyFile,
    '--label',
    'chore'
  );
  action = 'created';
}

console.log(`봇 PR ${action === 'created' ? '생성' : '갱신'}: ${url}`);
