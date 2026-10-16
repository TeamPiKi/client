'use client';

import { useSortable } from '@dnd-kit/sortable';

import { AlignEqualIconFill, CloseCircularIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import FolderListThumbnail from '../../../_common/_components/FolderListThumbnail';
import { getMockWishImageUrl } from '../../../_common/_consts/wishMock';
import type { WishFolderT } from '../../../_common/_types/wish';

type SortableFolderRowProps = {
  folder: WishFolderT;
  onDelete: (folder: WishFolderT) => void;
};

function SortableFolderRow({ folder, onDelete }: SortableFolderRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: `translate3d(0, ${transform?.y ?? 0}px, 0)`,
        transition,
      }}
      className={cn(
        'relative flex items-center gap-5 bg-bg-layer-basement pr-5 pl-[23px]',
        isDragging && 'z-10 opacity-80'
      )}
    >
      <button
        type="button"
        aria-label={`${folder.name} 폴더 삭제`}
        onClick={() => onDelete(folder)}
        className="shrink-0 cursor-pointer"
      >
        <CloseCircularIconFill className="size-6 text-red-300" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-[13px] p-2.5">
        <FolderListThumbnail
          url={folder.wishIds[0] ? getMockWishImageUrl(folder.wishIds[0]) : null}
          className="bg-white"
        />
        <p className="flex min-w-0 items-center gap-[5px] body-1-medium">
          <span className="truncate text-text-neutral-primary">{folder.name}</span>
          <span className="shrink-0 text-text-neutral-tertiary">({folder.wishIds.length})</span>
        </p>
      </div>
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`${folder.name} 폴더 순서 변경`}
        className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <AlignEqualIconFill className="size-7.5 text-gray-300" />
      </button>
    </li>
  );
}

export default SortableFolderRow;
