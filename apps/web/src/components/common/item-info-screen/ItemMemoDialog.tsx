import { NoteIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import Spacing from '@/components/spacing';

function ItemMemoDialog() {
  return (
    <Dialog>
      <DialogTrigger className="w-full space-y-2 rounded-xl bg-bg-layer-floating p-4">
        <div className="flex items-center gap-1">
          <NoteIconFill className="size-4 text-icon-neutral-secondary" />
          <span className="body-2-regular text-text-neutral-secondary">Memo</span>
        </div>
        <div className="text-left body-2-medium">메모내용</div>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="bg-bg-layer-floating">
        <DialogHeader>
          <DialogTitle className="text-center body-1-bold text-text-neutral-primary">
            메모
          </DialogTitle>
        </DialogHeader>

        <Spacing size={20} />

        <textarea
          autoCapitalize="off"
          autoCorrect="off"
          className="hide-scrollbar h-[122px] w-full resize-none rounded-xl border border-border-neutral-muted p-4 text-text-neutral-secondary transition-colors outline-none focus-within:border-border-accent"
        />

        <Spacing size={24} />

        <DialogFooter className="flex items-center gap-3">
          <Button variant="secondary" size="lg">
            취소
          </Button>
          <Button variant="primary" size="lg">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ItemMemoDialog;
