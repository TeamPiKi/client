import NotificationContent from './_components/NotificationContent';

/**
 * 알림 목록은 서버 prefetch 없이 클라이언트 캐시로 렌더한다 (#491).
 * 홈 배지(AlarmHeaderIcon)가 같은 키(['notifications'])를 이미 채워두고 SSE 가 신선도를 유지하므로,
 * RSC prefetch 는 페이지 진입마다 중복 서버 호출만 만든다.
 */
function Notification() {
  return <NotificationContent />;
}

export default Notification;
