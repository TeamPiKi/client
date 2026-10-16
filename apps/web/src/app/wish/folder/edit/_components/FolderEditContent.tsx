'use client';

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { josa } from 'es-hangul';
import { useState } from 'react';

import { CloseIconFill, WarningIconFill } from '@/assets/icons';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { Header } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { cn } from '@/utils/cn';

import { MOCK_FOLDERS } from '../../../_common/_consts/wishMock';
import type { WishFolderT } from '../../../_common/_types/wish';
import SortableFolderRow from './SortableFolderRow';

function FolderEditContent() {
  const backWithFallback = useBackWithFallback();

  /** TEMP: API 연동 시 폴더 목록 조회 응답으로 교체 */
  const [folders, setFolders] = useState(MOCK_FOLDERS);
  const [deleteTarget, setDeleteTarget] = useState<WishFolderT | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const isChanged = folders.map(({ id }) => id).join() !== MOCK_FOLDERS.map(({ id }) => id).join();

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setFolders(prev =>
      arrayMove(
        prev,
        prev.findIndex(({ id }) => id === active.id),
        prev.findIndex(({ id }) => id === over.id)
      )
    );
  };

  const handleClose = () => backWithFallback(ROUTES.WISHLIST_FOLDER_TAB);

  /** TODO: 폴더 삭제·순서 변경 API 연결 */
  const handleDone = () => handleClose();

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    setFolders(prev => prev.filter(({ id }) => id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <div
        className="sticky top-0 bg-bg-layer-basement px-5 pt-padding-top pb-7"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <Header
          left={
            <button
              type="button"
              aria-label="닫기"
              onClick={handleClose}
              className="cursor-pointer"
            >
              <CloseIconFill className="size-7.5 text-text-neutral-primary" />
            </button>
          }
          center={<h1 className="heading-1-bold text-text-neutral-primary">폴더 편집</h1>}
          right={
            <button
              type="button"
              disabled={!isChanged}
              onClick={handleDone}
              className={cn(
                'cursor-pointer heading-2-semibold disabled:cursor-not-allowed',
                isChanged ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
              )}
            >
              완료
            </button>
          }
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={folders} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-3">
            {folders.map(folder => (
              <SortableFolderRow key={folder.id} folder={folder} onDelete={setDeleteTarget} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={open => !open && setDeleteTarget(null)}
        icon={<WarningIconFill width={40} height={40} className="text-icon-warning" aria-hidden />}
        title={
          deleteTarget
            ? `'${deleteTarget.name}'${josa.pick(deleteTarget.name, '을/를')} 삭제할까요?`
            : ''
        }
        description="폴더를 삭제해도 담아둔 위시는 그대로 유지돼요."
        confirmLabel="삭제하기"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default FolderEditContent;
