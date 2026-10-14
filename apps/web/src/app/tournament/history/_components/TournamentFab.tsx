import { AddIconFill } from '@/assets/icons';
import Button from '@/components/button';
import CreateTournamentDialogContent from '@/components/common/create-tournament-dialog';
import { Dialog, DialogTrigger } from '@/components/dialog';
import { Z_INDEX } from '@/consts/zIndex';

function TournamentFab() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          size="xl"
          icon="only"
          aria-label="토너먼트 만들기"
          style={{ zIndex: Z_INDEX.FAB }}
          className="fixed right-[max(20px,calc(50%-480px/2+20px))] bottom-[103px]"
        >
          <AddIconFill width={33.101} height={33.101} />
        </Button>
      </DialogTrigger>
      <CreateTournamentDialogContent />
    </Dialog>
  );
}

export default TournamentFab;
