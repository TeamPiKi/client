'use client';

import { type ComponentType, type SVGProps, useState } from 'react';

import { FolderIconFill, TrashIconFill } from '@/assets/icons';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import { MOCK_FOLDERS } from '../_consts/wishMock';
import type { WishFolderT } from '../_types/wish';
import FolderSelectSheet from './FolderSelectSheet';
import WishDeleteSheet from './WishDeleteSheet';

type WishEditActionBarProps = {
  selectedCount: number;
  currentFolderId?: number;
  onMove: (folder: WishFolderT) => void;
  onDelete: () => void;
};

function ActionButton({
  label,
  Icon,
  disabled,
  onClick,
}: {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-[7px] body-2-semibold disabled:cursor-not-allowed',
        disabled ? 'text-text-neutral-tertiary' : 'text-text-neutral-secondary'
      )}
    >
      <Icon
        className={cn(
          'size-6',
          disabled ? 'text-icon-neutral-secondary' : 'text-icon-neutral-primary'
        )}
      />
      {label}
    </button>
  );
}

function WishEditActionBar({
  selectedCount,
  currentFolderId,
  onMove,
  onDelete,
}: WishEditActionBarProps) {
  const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  /** TEMP: API 연동 시 폴더 목록 조회·생성 API 로 교체 */
  const [folders, setFolders] = useState(() =>
    MOCK_FOLDERS.filter(({ id }) => id !== currentFolderId)
  );

  const isDisabled = selectedCount === 0;

  const handleAddFolder = (name: string) => {
    setFolders(prev => [{ id: Date.now(), name, wishIds: [] }, ...prev]);
  };

  const handleSelectFolder = (folder: WishFolderT) => {
    setIsFolderSheetOpen(false);
    onMove(folder);
  };

  const handleConfirmDelete = () => {
    setIsDeleteSheetOpen(false);
    onDelete();
  };

  return (
    <>
      <div
        data-bottom-cta
        className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-120 justify-center gap-[82px] rounded-t-2xl bg-white pt-4 pb-[34px]"
        style={{ zIndex: Z_INDEX.BOTTOM_CTA }}
      >
        <ActionButton
          label="폴더 이동"
          Icon={FolderIconFill}
          disabled={isDisabled}
          onClick={() => setIsFolderSheetOpen(true)}
        />
        <ActionButton
          label="삭제"
          Icon={TrashIconFill}
          disabled={isDisabled}
          onClick={() => setIsDeleteSheetOpen(true)}
        />
      </div>

      <FolderSelectSheet
        open={isFolderSheetOpen}
        onOpenChange={setIsFolderSheetOpen}
        folders={folders}
        onSelect={handleSelectFolder}
        onAddFolder={handleAddFolder}
      />
      <WishDeleteSheet
        open={isDeleteSheetOpen}
        onOpenChange={setIsDeleteSheetOpen}
        selectedCount={selectedCount}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default WishEditActionBar;
