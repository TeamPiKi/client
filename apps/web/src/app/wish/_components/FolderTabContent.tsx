'use client';

import { josa } from 'es-hangul';
import { useState } from 'react';

import ConfirmDialog from '@/components/common/confirm-dialog';
import { useGetFolders } from '@/hooks/useGetFolders';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import type { FolderT } from '@/types/folder';
import { SCROLL_NAMESPACE } from '@/utils/scrollRestoration';

import { useDeleteFolder } from '../_common/_hooks/useDeleteFolder';
import { usePatchFolder } from '../_common/_hooks/usePatchFolder';
import { usePostFolder } from '../_common/_hooks/usePostFolder';
import { WISH_TAB } from '../_consts/wishTab';
import FolderAddCard from './FolderAddCard';
import FolderCard from './FolderCard';
import FolderEmptyState from './FolderEmptyState';
import FolderNameSheet from './FolderNameSheet';

function FolderTabContent() {
  useScrollRestoration({ namespace: SCROLL_NAMESPACE.WISH, scope: WISH_TAB.FOLDER });

  const { foldersData } = useGetFolders();

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<FolderT | null>(null);
  const [isRenameSheetOpen, setIsRenameSheetOpen] = useState(false);
  const [renameErrorMessage, setRenameErrorMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FolderT | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { postFolderMutation, isPostFolderPending } = usePostFolder({
    onSuccess: () => setIsCreateSheetOpen(false),
    onNameError: setCreateErrorMessage,
  });
  const { patchFolderMutation, isPatchFolderPending } = usePatchFolder({
    onSuccess: () => setIsRenameSheetOpen(false),
    onNameError: setRenameErrorMessage,
  });
  const { deleteFolderMutation, isDeleteFolderPending } = useDeleteFolder({
    onSuccess: () => setIsDeleteDialogOpen(false),
  });

  const handleOpenCreateSheet = () => {
    setCreateErrorMessage(null);
    setIsCreateSheetOpen(true);
  };

  const handleRename = (name: string) => {
    if (renameTarget) patchFolderMutation({ folderId: renameTarget.id, name });
  };

  const handleDelete = () => {
    if (deleteTarget) deleteFolderMutation(deleteTarget.id);
  };

  return (
    <>
      {foldersData.length === 0 ? (
        <FolderEmptyState onAdd={handleOpenCreateSheet} />
      ) : (
        <ul className="grid grid-cols-2">
          <li>
            <FolderAddCard onClick={handleOpenCreateSheet} />
          </li>
          {foldersData.map(folder => (
            <li key={folder.id}>
              <FolderCard
                folderId={folder.id}
                name={folder.name}
                wishCount={folder.wishCount}
                thumbnailUrls={folder.coverImageUrls}
                onRename={() => {
                  setRenameTarget(folder);
                  setRenameErrorMessage(null);
                  setIsRenameSheetOpen(true);
                }}
                onDelete={() => {
                  setDeleteTarget(folder);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <FolderNameSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        title="새 폴더 추가"
        submitErrorMessage={createErrorMessage}
        isPending={isPostFolderPending}
        onNameChange={() => setCreateErrorMessage(null)}
        onSubmit={postFolderMutation}
      />
      <FolderNameSheet
        key={renameTarget?.id}
        open={isRenameSheetOpen}
        onOpenChange={setIsRenameSheetOpen}
        title="폴더명 변경"
        {...(renameTarget && { initialName: renameTarget.name })}
        submitErrorMessage={renameErrorMessage}
        isPending={isPatchFolderPending}
        onNameChange={() => setRenameErrorMessage(null)}
        onSubmit={handleRename}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`‘${deleteTarget?.name}’${josa.pick(deleteTarget?.name ?? '', '을/를')} 삭제할까요?`}
        description="폴더를 삭제해도 담아둔 위시는 그대로 유지돼요."
        confirmLabel="삭제하기"
        icon={null}
        isPending={isDeleteFolderPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default FolderTabContent;
