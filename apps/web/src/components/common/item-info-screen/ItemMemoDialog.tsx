'use client';

import { useState } from 'react';

import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import Spacing from '@/components/spacing';

const MEMO_MAX_LENGTH = 200;

type ItemMemoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memo: string;
  onSave: (memo: string) => void;
};

type ItemMemoFormProps = {
  memo: string;
  onCancel: () => void;
  onSave: (memo: string) => void;
};

/** 닫힐 때 통째로 언마운트되므로, 열 때마다 저장된 메모에서 다시 시작한다 */
function ItemMemoForm({ memo, onCancel, onSave }: ItemMemoFormProps) {
  const [draft, setDraft] = useState(memo);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center body-1-bold text-text-neutral-primary">
          메모
        </DialogTitle>
      </DialogHeader>

      <Spacing size={20} />

      <textarea
        value={draft}
        onChange={event => setDraft(event.target.value)}
        maxLength={MEMO_MAX_LENGTH}
        placeholder="위시에 대한 생각을 메모해보세요."
        autoCapitalize="off"
        autoCorrect="off"
        className="hide-scrollbar h-[154px] w-full resize-none rounded-xl border border-border-neutral-muted p-4 body-1-medium text-text-neutral-secondary transition-colors outline-none placeholder:text-text-neutral-tertiary focus-within:border-border-accent"
      />

      <Spacing size={24} />

      <DialogFooter className="flex-row gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
          취소
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={() => onSave(draft.trim())}>
          확인
        </Button>
      </DialogFooter>
    </>
  );
}

/** 메모 입력 다이얼로그 — 확인을 눌러야 저장된다 */
function ItemMemoDialog({ open, onOpenChange, memo, onSave }: ItemMemoDialogProps) {
  const handleSave = (nextMemo: string) => {
    onSave(nextMemo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="bg-bg-layer-floating">
        <ItemMemoForm memo={memo} onCancel={() => onOpenChange(false)} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

export default ItemMemoDialog;
