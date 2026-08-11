'use client';

import { useState } from 'react';

import { NoteIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import ItemMemoDialog from './ItemMemoDialog';

const MEMO_PLACEHOLDER = '위시에 대한 생각을 메모해보세요. 메모는 나만 볼 수 있어요.';

const CARD_STYLE = 'w-full space-y-2 rounded-xl bg-bg-layer-floating p-4 text-left';

type ItemMemoCardProps = {
  memo: string;
  /** 없으면 읽기 전용 —  위시만 메모 수정 가능. 토너먼트 아이템은 읽기 전용 */
  onSave?: (memo: string) => void;
};

function ItemMemoCard({ memo, onSave }: ItemMemoCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const content = (
    <>
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
    </>
  );

  if (!onSave) return <div className={CARD_STYLE}>{content}</div>;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className={cn(CARD_STYLE, 'cursor-pointer')}
      >
        {content}
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
