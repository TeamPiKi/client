import JoinErrorDialog from '@/components/common/join-error-dialog';
import type { JoinErrorTypeT } from '@/components/common/join-error-dialog';

type JoinErrorScreenProps = {
  type: JoinErrorTypeT;
};

/** 토너먼트 참여 불가 안내 화면 */
function JoinErrorScreen({ type }: JoinErrorScreenProps) {
  return (
    <>
      <main className="min-h-dvh bg-bg-layer-default" />
      <JoinErrorDialog type={type} />
    </>
  );
}

export default JoinErrorScreen;
