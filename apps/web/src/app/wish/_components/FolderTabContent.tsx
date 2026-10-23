'use client';

import { josa } from 'es-hangul';
import { useState } from 'react';

import ConfirmDialog from '@/components/common/confirm-dialog';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { SCROLL_NAMESPACE } from '@/utils/scrollRestoration';

import { getMockWishImageUrl } from '../_common/_consts/wishMock';
import type { WishFolderT } from '../_common/_types/wish';
import { WISH_TAB } from '../_consts/wishTab';
import type { FolderTabContentProps } from '../_types/wishTab';
import FolderAddCard from './FolderAddCard';
import FolderCard from './FolderCard';
import FolderEmptyState from './FolderEmptyState';
import FolderNameSheet from './FolderNameSheet';

function FolderTabContent({ folders, onCreate, onRename, onDelete }: FolderTabContentProps) {
  useScrollRestoration({ namespace: SCROLL_NAMESPACE.WISH, scope: WISH_TAB.FOLDER });

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<WishFolderT | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WishFolderT | null>(null);

  const handleCreate = (name: string) => {
    onCreate(name);
    setIsCreateSheetOpen(false);
  };

  const handleRename = (name: string) => {
    if (renameTarget) onRename(renameTarget.id, name);
    setRenameTarget(null);
  };

  const handleDelete = () => {
    if (deleteTarget) onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      {folders.length === 0 ? (
        <FolderEmptyState onAdd={() => setIsCreateSheetOpen(true)} />
      ) : (
        <ul className="grid grid-cols-2">
          <li>
            <FolderAddCard onClick={() => setIsCreateSheetOpen(true)} />
          </li>
          {folders.map(folder => (
            <li key={folder.id}>
              <FolderCard
                folderId={folder.id}
                name={folder.name}
                wishCount={folder.wishIds.length}
                thumbnailUrls={folder.wishIds.slice(0, 3).map(getMockWishImageUrl)}
                onRename={() => setRenameTarget(folder)}
                onDelete={() => setDeleteTarget(folder)}
              />
            </li>
          ))}
        </ul>
      )}

      <FolderNameSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        title="새 폴더 추가"
        onSubmit={handleCreate}
      />
      <FolderNameSheet
        key={renameTarget?.id}
        open={renameTarget !== null}
        onOpenChange={isOpen => !isOpen && setRenameTarget(null)}
        title="폴더명 변경"
        {...(renameTarget && { initialName: renameTarget.name })}
        onSubmit={handleRename}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={isOpen => !isOpen && setDeleteTarget(null)}
        title={`‘${deleteTarget?.name}’${josa.pick(deleteTarget?.name ?? '', '을/를')} 삭제할까요?`}
        description="폴더를 삭제해도 담아둔 위시는 그대로 유지돼요."
        confirmLabel="삭제하기"
        icon={null}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default FolderTabContent;
