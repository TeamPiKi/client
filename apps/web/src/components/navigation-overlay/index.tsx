import Spinner from '@/components/spinner';
import { Z_INDEX } from '@/consts/zIndex';

/** warm start 딥링크 SPA 전환 중 노출되는 전체 화면 로딩 오버레이 */
function NavigationOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 flex items-center justify-center bg-bg-layer-overlay"
      style={{ zIndex: Z_INDEX.NAVIGATION_OVERLAY }}
    >
      <Spinner size={36} color="white" />
    </div>
  );
}

export default NavigationOverlay;
