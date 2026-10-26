import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  applyCatalogChanges,
  collectServerCodes,
  compareCodes,
  diffCodes,
  parseCategoryStatuses,
  parseClientCatalog,
  parseEnumEntries,
  parseRegistry,
  renderPrBody,
  stableBody,
  suggestConstantName,
} from './lib.mjs';

const registrySource = body => `package x

// 등록 안 한 enum: addAll(AnnouncementImageErrorCode.entries) 는 주석이라 무시돼야 한다
object ErrorCodeRegistry {
    val all: List<ErrorCode> =
        buildList {
${body}
            // 도메인 이관 시 여기에 addAll(XxxErrorCode.entries) 추가
        }
}

fun errorCodeCatalogMarkdown(codes: List<ErrorCode>): String = ""
`;

const CLIENT = `export const ERROR_MESSAGE_MAP = {
  /** 공통 4xx */
  'COMMON-UNAUTHORIZED': '로그인이 필요해요.',

  /** WISH */
  'WISH-004': '이미 삭제된 아이템이에요.',
  'WISH-006': '한 번에 최대 100개까지 삭제할 수 있어요.',
  'WISH-010': '지금은 더 담을 수 없어요.',

  /** ITEM */
  'ITEM-003': '상품 이름을 입력해 주세요.',
} as const;

export const ERROR_CODE = {
  /** 공통 */
  COMMON_UNAUTHORIZED: 'COMMON-UNAUTHORIZED',

  /** 위시 */
  WISH_NOT_FOUND: 'WISH-004',
  WISH_INVALID_ID_COUNT: 'WISH-006',
  WISH_RATE_LIMITED: 'WISH-010',

  /** 상품 */
  ITEM_NAME_REQUIRED_FOR_READY: 'ITEM-003',
} as const satisfies Record<string, keyof typeof ERROR_MESSAGE_MAP>;
`;

const serverEntry = (code, name, message, extra = {}) => [
  code,
  { code, name, message, category: 'CONFLICT', status: 409, enumName: 'XErrorCode', ...extra },
];

test('등록 목록에서 addAll 과 filter 제외를 읽고 주석 속 enum 이름은 무시한다', () => {
  const registry = parseRegistry(
    registrySource(`            addAll(CommonErrorCode.entries)
            addAll(WishErrorCode.entries)
            addAll(ImageStorageErrorCode.entries.filter { it != ImageStorageErrorCode.DELETE_FAILED })`)
  );

  assert.deepEqual(registry, [
    { enumName: 'CommonErrorCode', excluded: [] },
    { enumName: 'WishErrorCode', excluded: [] },
    { enumName: 'ImageStorageErrorCode', excluded: ['DELETE_FAILED'] },
  ]);
});

test('filter 조건 여러 개를 && 로 이으면 모두 제외 대상으로 읽는다', () => {
  const registry = parseRegistry(
    registrySource(
      '            addAll(ImageStorageErrorCode.entries.filter { it != ImageStorageErrorCode.A && it != ImageStorageErrorCode.B })'
    )
  );

  assert.deepEqual(registry[0].excluded, ['A', 'B']);
});

test('등록 목록에 addAll 이 아닌 구문이 있으면 실패한다', () => {
  assert.throws(
    () => parseRegistry(registrySource('            add(WishErrorCode.NOT_FOUND)')),
    /해석할 수 없는 구문/
  );
});

test('등록 목록의 filter 형식을 모르면 실패한다', () => {
  assert.throws(
    () =>
      parseRegistry(
        registrySource('            addAll(WishErrorCode.entries.filter { it.public })')
      ),
    /filter 조건을 해석할 수 없음/
  );
});

test('enum 항목을 한 줄·여러 줄 모두 읽고 문구 속 따옴표와 쉼표를 보존한다', () => {
  const entries = parseEnumEntries(`enum class WishErrorCode(
    override val code: String,
) : ErrorCode {
    // 결번 "WISH-099" 는 주석이라 항목이 아니다
    NOT_FOUND("WISH-004", ErrorCategory.NOT_FOUND, "이미 삭제된 아이템이에요."),
    FAILED_NOT_REFRESHABLE(
        "WISH-008",
        ErrorCategory.CONFLICT,
        "\\"추출 실패\\" 항목은, 직접 입력해 주세요.",
    ),
}`);

  assert.deepEqual(entries, [
    {
      name: 'NOT_FOUND',
      code: 'WISH-004',
      category: 'NOT_FOUND',
      message: '이미 삭제된 아이템이에요.',
    },
    {
      name: 'FAILED_NOT_REFRESHABLE',
      code: 'WISH-008',
      category: 'CONFLICT',
      message: '"추출 실패" 항목은, 직접 입력해 주세요.',
    },
  ]);
});

test('enum 에 형식을 모르는 code 가 있으면 실패한다', () => {
  assert.throws(
    () =>
      parseEnumEntries(`enum class X {
    A("WISH-001", ErrorCategory.CONFLICT, "a"),
    B("WISH-002", "b", ErrorCategory.CONFLICT),
}`),
    /해석하지 못한 code/
  );
});

test('등록된 enum 만 모으고 filter 제외 항목은 빼며 category 로 HTTP status 를 붙인다', () => {
  const categoryStatus =
    parseCategoryStatuses(`enum class ErrorCategory(val httpStatus: HttpStatus) {
    CONFLICT(HttpStatus.CONFLICT, "a"),
    TOO_MANY_REQUESTS(HttpStatus.TOO_MANY_REQUESTS, "b"),
}`);
  const codes = collectServerCodes({
    registry: [{ enumName: 'ItemErrorCode', excluded: ['OLD'] }],
    enumSources: new Map([
      [
        'ItemErrorCode',
        `QUOTA_EXCEEDED("ITEM-006", ErrorCategory.TOO_MANY_REQUESTS, "지금은 추가할 수 없어요.")
         OLD("ITEM-007", ErrorCategory.CONFLICT, "x")`,
      ],
    ]),
    categoryStatus,
  });

  assert.deepEqual([...codes.keys()], ['ITEM-006']);
  assert.equal(codes.get('ITEM-006').status, 429);
});

test('등록된 enum 파일이 없거나 code 가 겹치면 실패한다', () => {
  assert.throws(
    () =>
      collectServerCodes({
        registry: [{ enumName: 'MissingErrorCode', excluded: [] }],
        enumSources: new Map(),
        categoryStatus: new Map(),
      }),
    /파일이 없음/
  );
  const dup = 'A("WISH-001", ErrorCategory.CONFLICT, "a")';
  assert.throws(
    () =>
      collectServerCodes({
        registry: [
          { enumName: 'A', excluded: [] },
          { enumName: 'B', excluded: [] },
        ],
        enumSources: new Map([
          ['A', dup],
          ['B', dup],
        ]),
        categoryStatus: new Map(),
      }),
    /중복 code/
  );
});

test('대조 결과는 서버에만·프론트에만을 나누고 APPLE 접두어는 양쪽 모두 제외한다', () => {
  const server = new Map([
    serverEntry('COMMON-UNAUTHORIZED', 'UNAUTHORIZED', '로그인이 필요해요.'),
    serverEntry('WISH-004', 'NOT_FOUND', '이미 삭제된 아이템이에요.'),
    serverEntry('WISH-006', 'INVALID_ID_COUNT', '최대 100개'),
    serverEntry('ITEM-003', 'NAME_REQUIRED_FOR_READY', '이름'),
    serverEntry('ITEM-006', 'QUOTA_EXCEEDED', '지금은 추가할 수 없어요.'),
    serverEntry('LINK-009', 'NEW', '새 코드'),
    serverEntry('APPLE-001', 'TOKEN', '애플'),
  ]);

  const { added, removed } = diffCodes({
    server,
    serverMainCodes: new Set(['ITEM-006']),
    client: parseClientCatalog(CLIENT),
  });

  assert.deepEqual(
    added.map(e => [e.code, e.inMain]),
    [
      ['ITEM-006', true],
      ['LINK-009', false],
    ]
  );
  assert.deepEqual(removed, [{ code: 'WISH-010', constants: ['WISH_RATE_LIMITED'] }]);
});

test('서버 main 을 못 읽었으면 운영 반영 여부는 null 이다', () => {
  const { added } = diffCodes({
    server: new Map([serverEntry('ITEM-006', 'QUOTA_EXCEEDED', 'a')]),
    serverMainCodes: null,
    client: parseClientCatalog(CLIENT),
  });

  assert.equal(added[0].inMain, null);
});

test('상수 이름은 묶음의 공통 앞부분에 enum 이름을 붙이고 enum 속 접두어 단어는 뺀다', () => {
  const constants = [
    { name: 'PRODUCT_IMAGE_EMPTY_IMAGE', code: 'PRODUCTIMAGE-001' },
    { name: 'PRODUCT_IMAGE_UNKNOWN_TYPE', code: 'PRODUCTIMAGE-002' },
    { name: 'TOURNAMENT_NOT_FOUND', code: 'TOURNAMENT-002' },
  ];

  assert.equal(
    suggestConstantName({ code: 'PRODUCTIMAGE-004', name: 'TOO_LARGE' }, constants),
    'PRODUCT_IMAGE_TOO_LARGE'
  );
  assert.equal(
    suggestConstantName({ code: 'TOURNAMENT-050', name: 'FORBIDDEN_TOURNAMENT' }, constants),
    'TOURNAMENT_FORBIDDEN'
  );
  assert.equal(
    suggestConstantName({ code: 'ITEM-006', name: 'QUOTA_EXCEEDED' }, constants),
    'ITEM_QUOTA_EXCEEDED'
  );
  assert.equal(suggestConstantName({ code: 'ITEM-007', name: 'ITEM' }, constants), 'ITEM_ITEM');
});

test('새 코드는 같은 묶음 안 코드 순서 자리에 넣고 묶음이 없으면 새 묶음을 만든다', () => {
  const { source, applied } = applyCatalogChanges(CLIENT, {
    added: [
      {
        code: 'WISH-005',
        name: 'INVALID_IMAGE_COUNT',
        message: "이미지는 '1~5장'만 올릴 수 있어요.",
      },
      { code: 'LINK-001', name: 'INVALID_FORMAT', message: '올바른 링크 형식이 아니에요.' },
    ],
    removed: [],
  });

  assert.equal(applied.added.length, 2);
  assert.match(
    source,
    /'WISH-004': '이미 삭제된 아이템이에요.',\n {2}'WISH-005': '이미지는 \\'1~5장\\'만 올릴 수 있어요.',\n {2}'WISH-006'/
  );
  assert.match(
    source,
    /WISH_NOT_FOUND: 'WISH-004',\n {2}WISH_INVALID_IMAGE_COUNT: 'WISH-005',\n {2}WISH_INVALID_ID_COUNT/
  );
  assert.match(
    source,
    /'ITEM-003': '상품 이름을 입력해 주세요.',\n\n {2}\/\*\* LINK \*\/\n {2}'LINK-001'/
  );
  assert.match(
    source,
    /ITEM_NAME_REQUIRED_FOR_READY: 'ITEM-003',\n\n {2}\/\*\* LINK \*\/\n {2}LINK_INVALID_FORMAT: 'LINK-001',\n\} as const satisfies/
  );
});

test('참조 없는 코드는 맵과 상수에서 지우고 비게 된 묶음 주석도 지운다', () => {
  const { source, applied } = applyCatalogChanges(CLIENT, {
    added: [],
    removed: [
      { code: 'WISH-010', constants: ['WISH_RATE_LIMITED'] },
      { code: 'ITEM-003', constants: ['ITEM_NAME_REQUIRED_FOR_READY'] },
    ],
  });

  assert.deepEqual(
    applied.removed.map(r => r.code),
    ['WISH-010', 'ITEM-003']
  );
  assert.doesNotMatch(source, /WISH-010|ITEM-003|\/\*\* ITEM \*\/|\/\*\* 상품 \*\//);
  assert.match(source, /'WISH-006': '한 번에 최대 100개까지 삭제할 수 있어요.',\n\} as const;/);
  assert.match(source, /WISH_INVALID_ID_COUNT: 'WISH-006',\n\} as const satisfies/);
});

test('프론트가 아직 참조하는 코드는 지우지 않고 직접 처리로 넘긴다', () => {
  const { source, applied, manual } = applyCatalogChanges(
    CLIENT,
    { added: [], removed: [{ code: 'WISH-010', constants: ['WISH_RATE_LIMITED'] }] },
    { references: new Map([['WISH-010', ['apps/web/src/a.ts:3']]]) }
  );

  assert.equal(source, CLIENT);
  assert.equal(applied.removed.length, 0);
  assert.deepEqual(manual, [
    {
      code: 'WISH-010',
      reason: '서버에서 사라졌지만 프론트 코드가 참조 중',
      detail: 'apps/web/src/a.ts:3',
    },
  ]);
});

test('문구에 변수가 있거나 상수 이름이 겹치면 넣지 않고 직접 처리로 넘긴다', () => {
  const { source, manual } = applyCatalogChanges(CLIENT, {
    added: [
      {
        code: 'USER-012',
        name: 'NICKNAME_TOO_LONG',
        message: '닉네임은 ${User.MAX}자까지 입력할 수 있어요.',
      },
      { code: 'WISH-011', name: 'RATE_LIMITED', message: '겹치는 이름' },
    ],
    removed: [],
  });

  assert.equal(source, CLIENT);
  assert.deepEqual(
    manual.map(m => [m.code, m.reason]),
    [
      ['USER-012', '서버 문구에 변수가 있음'],
      ['WISH-011', '상수 이름 `WISH_RATE_LIMITED` 이 이미 있음'],
    ]
  );
});

test('수정한 카탈로그로 다시 대조하면 차이가 없다', () => {
  const server = new Map([
    serverEntry('COMMON-UNAUTHORIZED', 'UNAUTHORIZED', '로그인이 필요해요.'),
    serverEntry('WISH-004', 'NOT_FOUND', 'a'),
    serverEntry('WISH-006', 'INVALID_ID_COUNT', 'b'),
    serverEntry('ITEM-003', 'NAME_REQUIRED_FOR_READY', 'c'),
    serverEntry('ITEM-006', 'QUOTA_EXCEEDED', '지금은 추가할 수 없어요.'),
  ]);
  const first = applyCatalogChanges(
    CLIENT,
    diffCodes({ server, serverMainCodes: null, client: parseClientCatalog(CLIENT) })
  );

  const second = diffCodes({
    server,
    serverMainCodes: null,
    client: parseClientCatalog(first.source),
  });
  const again = applyCatalogChanges(first.source, second);

  assert.deepEqual(second, { added: [], removed: [] });
  assert.equal(again.source, first.source);
});

test('PR 본문은 있는 항목의 표만 넣고 문구 속 | 를 이스케이프한다', () => {
  const body = renderPrBody({
    applied: {
      added: [
        {
          code: 'ITEM-006',
          status: 429,
          message: 'a | b',
          constantName: 'ITEM_QUOTA_EXCEEDED',
          inMain: true,
        },
      ],
      removed: [],
    },
    manual: [{ code: 'USER-012', reason: '서버 문구에 변수가 있음', detail: '${x}' }],
    serverRepo: 'TeamPiKi/core',
    serverDevSha: 'aaaaaaaaaa',
    serverMainSha: null,
    clientSha: 'bbbbbbbbbb',
  });

  assert.match(body, /추가 1 · 삭제 0 · 직접 처리 1/);
  assert.match(body, /\| `ITEM-006` \| 429 \| a \\\| b \| `ITEM_QUOTA_EXCEEDED` \| 반영됨 \|/);
  assert.doesNotMatch(body, /### 삭제/);
  assert.match(body, /### 직접 처리 필요/);
  assert.match(body, /dev `aaaaaaa` · main 확인 불가/);
});

test('본문 비교용 형태는 기준 커밋 절만 뺀다', () => {
  const base = {
    applied: { added: [], removed: [{ code: 'WISH-010', constants: ['WISH_RATE_LIMITED'] }] },
    manual: [],
    serverRepo: 'TeamPiKi/core',
    serverMainSha: 'm',
    clientSha: 'c',
  };

  assert.equal(
    stableBody(renderPrBody({ ...base, serverDevSha: 'aaaaaaa' })),
    stableBody(renderPrBody({ ...base, serverDevSha: 'bbbbbbb' }))
  );
  assert.doesNotMatch(stableBody(renderPrBody({ ...base, serverDevSha: 'a' })), /### 기준/);
});

test('code 비교는 숫자 부분을 수로 비교한다', () => {
  assert.ok(compareCodes('WISH-009', 'WISH-010') < 0);
  assert.ok(compareCodes('TOURNAMENT-100', 'TOURNAMENT-099') > 0);
});
