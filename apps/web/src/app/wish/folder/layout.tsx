import { notFound } from 'next/navigation';

import { IS_WISH_FOLDER_ENABLED } from '@/consts/featureFlag';

type WishFolderLayoutProps = {
  children: React.ReactNode;
};

function WishFolderLayout({ children }: WishFolderLayoutProps) {
  if (!IS_WISH_FOLDER_ENABLED) notFound();

  return children;
}

export default WishFolderLayout;
