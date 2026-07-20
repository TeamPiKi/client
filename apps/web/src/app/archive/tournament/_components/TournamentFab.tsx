import { AddIconFill } from '@/assets/icons';
import Button from '@/components/button';

function TournamentFab() {
  return (
    <Button
      variant="primary"
      size="xl"
      icon="only"
      aria-label="토너먼트 만들기"
      className="fixed right-5 bottom-[103px] z-30"
    >
      <AddIconFill width={30} height={30} />
    </Button>
  );
}

export default TournamentFab;
