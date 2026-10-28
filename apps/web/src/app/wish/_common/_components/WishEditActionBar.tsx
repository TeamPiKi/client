'use client';

import { type ComponentProps, type ComponentType, type SVGProps, useState } from 'react';

import { FolderIconFill, TrashIconFill } from '@/assets/icons';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import { MOCK_FOLDERS } from '../_consts/wishMock';
import type { WishFolderT } from '../_types/wish';
import FolderSelectSheet from './FolderSelectSheet';
import './WishEditActionBar.css';

type WishEditActionBarProps = {
  selectedCount: number;
  currentFolderId?: number;
  onMove: (folder: WishFolderT) => void;
  onDelete: () => void;
  deleteConfirm: Pick<ComponentProps<typeof ConfirmDialog>, 'title' | 'description' | 'icon'>;
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
        'flex w-25 cursor-pointer items-center justify-center gap-[7px] body-2-semibold disabled:cursor-not-allowed',
        disabled ? 'text-text-neutral-tertiary' : 'text-text-neutral-secondary'
      )}
    >
      <Icon
        className={cn(
          'size-5',
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
  deleteConfirm,
}: WishEditActionBarProps) {
  const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
    setIsDeleteDialogOpen(false);
    onDelete();
  };

  return (
    <>
      <div
        data-bottom-cta
        data-hide-bottom-tab-bar
        className="fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-120 items-center justify-center gap-10 rounded-t-2xl bg-white px-2.5 pt-6 pb-9"
        style={{ zIndex: Z_INDEX.BOTTOM_CTA }}
      >
        <ActionButton
          label="폴더 이동"
          Icon={FolderIconFill}
          disabled={isDisabled}
          onClick={() => setIsFolderSheetOpen(true)}
        />
        <span aria-hidden className="h-5.5 w-[1.4px] bg-gray-75" />
        <ActionButton
          label="삭제"
          Icon={TrashIconFill}
          disabled={isDisabled}
          onClick={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      <FolderSelectSheet
        open={isFolderSheetOpen}
        onOpenChange={setIsFolderSheetOpen}
        folders={folders}
        onSelect={handleSelectFolder}
        onAddFolder={handleAddFolder}
      />
      <ConfirmDialog
        {...deleteConfirm}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        confirmLabel="삭제하기"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default WishEditActionBar;
