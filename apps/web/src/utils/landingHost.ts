/**
 * 인스타 프로필 링크 전용 랜딩 서브도메인 판정.
 *
 * 랜딩은 `associatedDomains`·`intentFilters` 에 없는 호스트여야 한다.
 * 같은 도메인 페이지에서 그 도메인으로 가는 Universal Link 는 앱을 열지 않기 때문에,
 * 랜딩을 `piki.day` 밖(`open.piki.day`)에 두어야 UL 이 크로스 도메인으로 발동한다.
 */
export const isLandingHost = (host: string) => {
  const subdomain = host.split('.')[0] ?? '';
  return subdomain === 'open' || subdomain.startsWith('open-');
};

/** 앱의 associatedDomains·intentFilters 에 등록돼 Universal Link 가 발동하는 호스트 */
const SERVICE_HOSTS = ['piki.day', 'staging.piki.day', 'dev.piki.day'];

const isLocalHost = (hostname: string) =>
  hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

/** 랜딩 호스트를 실제 서비스 호스트로 되돌린다 (open.piki.day → piki.day, open-staging.piki.day → staging.piki.day) */
export const toServiceHost = (host: string) => {
  const hostname = host.split(':')[0] ?? '';

  if (isLandingHost(host)) {
    const [subdomain = '', ...rest] = host.split('.');
    if (rest.length === 0) return host;

    const remainder = subdomain.replace(/^open-?/, '');
    return remainder ? [remainder, ...rest].join('.') : rest.join('.');
  }

  if (SERVICE_HOSTS.includes(hostname) || isLocalHost(hostname)) return host;

  /** 미등록 호스트(Vercel 프리뷰 등)에서는 UL 이 발동하지 않으므로 프로덕션을 가리킨다 */
  return SERVICE_HOSTS[0] as string;
};
