'use client';

import { useState } from 'react';

import { NoteIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import ItemMemoDialog from './ItemMemoDialog';

const MEMO_PLACEHOLDER = '위시에 대한 생각을 메모해보세요. 메모는 나만 볼 수 있어요.';

/**
 * 메모 카드 — 탭하면 메모 다이얼로그가 열린다
 *
 * TODO: 메모 조회·저장 API 가 아직 없어 화면 안에서만 유지된다. API 연동 시 상위에서 값을 주입할 것
 */
function ItemMemoCard() {
  const [memo, setMemo] = useState('');
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
            'line-clamp-2 block body-2-medium break-keep',
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
        onSave={setMemo}
      />
    </>
  );
}

export default ItemMemoCard;
