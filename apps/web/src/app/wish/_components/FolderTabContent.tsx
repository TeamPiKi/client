'use client';

import Spacing from '@/components/spacing';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { SCROLL_NAMESPACE } from '@/utils/scrollRestoration';

import { MOCK_FOLDERS, MOCK_WISHES } from '../_common/_consts/wishMock';
import { WISH_TAB } from '../_consts/wishTab';
import FolderAddCard from './FolderAddCard';
import FolderCard from './FolderCard';

const getImageUrl = (wishId: number) =>
  MOCK_WISHES.find(({ wish }) => wish.id === wishId)?.item.imageUrl ?? null;

function FolderTabContent() {
  useScrollRestoration({ namespace: SCROLL_NAMESPACE.WISH, scope: WISH_TAB.FOLDER });

  return (
    <>
      <div className="flex items-center justify-between px-5">
        <p className="body-2-medium text-text-neutral-tertiary">폴더 {MOCK_FOLDERS.length}개</p>
        <button type="button" className="cursor-pointer body-2-medium text-text-neutral-secondary">
          편집 {/* TODO: 폴더 편집 동작 연결 */}
        </button>
      </div>
      <Spacing size={16} />
      <ul className="grid grid-cols-2">
        <li>
          <FolderAddCard />
        </li>
        {MOCK_FOLDERS.map(({ id, name, wishIds }) => (
          <li key={id}>
            <FolderCard
              folderId={id}
              name={name}
              wishCount={wishIds.length}
              thumbnailUrls={wishIds.slice(0, 3).map(getImageUrl)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default FolderTabContent;
