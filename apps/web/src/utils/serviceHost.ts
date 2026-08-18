/** 앱의 associatedDomains·intentFilters 에 등록돼 Universal Link 가 발동하는 호스트 */
const SERVICE_HOSTS = ['piki.day', 'staging.piki.day', 'dev.piki.day'];

const isLocalHost = (hostname: string) =>
  hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

/**
 * 요청 호스트를 앱 링크가 실제로 발동하는 서비스 호스트로 정규화한다.
 *
 * 랜딩(`/open`)이 만드는 앱 진입 URL 은 등록된 호스트를 가리켜야 한다.
 * 로컬·서비스 호스트는 그대로 두고, 그 외에는 프로덕션으로 떨어뜨린다.
 */
export const toServiceHost = (host: string) => {
  /** userinfo(`@`)·비숫자 포트 등 변형된 Host 헤더는 오리진 조작이 가능하므로 형태부터 거른다 */
  const match = /^([a-z0-9.-]+)(:\d+)?$/i.exec(host);
  const hostname = match?.[1] ?? '';

  if (SERVICE_HOSTS.includes(hostname) || isLocalHost(hostname)) return host;

  /** 미등록 호스트(Vercel 프리뷰 등)에서는 UL 이 발동하지 않으므로 프로덕션을 가리킨다 */
  return SERVICE_HOSTS[0] as string;
};
