'use client';

import { type RefObject, useRef, useState } from 'react';

import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import Spacing from '@/components/spacing';

/** 서버가 허용하는 메모 길이 */
const MEMO_MAX_LENGTH = 100;

type ItemMemoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memo: string;
  onSave: (memo: string) => void;
};

type ItemMemoFormProps = {
  ref: RefObject<HTMLTextAreaElement | null>;
  memo: string;
  onCancel: () => void;
  onSave: (memo: string) => void;
};

function ItemMemoForm({ ref, memo, onCancel, onSave }: ItemMemoFormProps) {
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
        ref={ref}
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

function ItemMemoDialog({ open, onOpenChange, memo, onSave }: ItemMemoDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = (nextMemo: string) => {
    onSave(nextMemo);
    onOpenChange(false);
  };

  /** 저장된 메모 끝에 포커스 오도록 직접 제어 */
  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-layer-floating"
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <ItemMemoForm
          ref={textareaRef}
          memo={memo}
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ItemMemoDialog;
