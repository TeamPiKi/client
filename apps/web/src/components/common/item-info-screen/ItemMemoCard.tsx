'use client';

import { useState } from 'react';

import { NoteIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import ItemMemoDialog from './ItemMemoDialog';

const MEMO_PLACEHOLDER = '위시에 대한 생각을 메모해보세요. 메모는 나만 볼 수 있어요.';

type ItemMemoCardProps = {
  memo: string;
  onSave: (memo: string) => void;
};

/** 메모 카드 — 탭하면 메모 다이얼로그가 열린다 */
function ItemMemoCard({ memo, onSave }: ItemMemoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full cursor-pointer space-y-2 rounded-xl bg-bg-layer-floating p-4 text-left"
      >
        <span className="flex items-center gap-1">
          <NoteIconFill className="size-4 text-icon-neutral-secondary" />
          <span className="body-2-regular text-text-neutral-secondary">메모</span>
        </span>
        <span
          className={cn(
            'block body-2-medium break-keep whitespace-pre-line',
            memo ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
          )}
        >
          {memo || MEMO_PLACEHOLDER}
        </span>
      </button>

      <ItemMemoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        memo={memo}
        onSave={nextMemo => nextMemo !== memo && onSave(nextMemo)}
      />
    </>
  );
}

export default ItemMemoCard;
