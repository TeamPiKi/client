import BaseImage from '@/components/base-image';
import { cn } from '@/utils/cn';

import FolderEmptyImage from '../_assets/folder-empty.svg';

type FolderListThumbnailProps = {
  url: string | null;
  className?: string;
};

function FolderListThumbnail({ url, className }: FolderListThumbnailProps) {
  return (
    <div
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-50',
        className
      )}
    >
      {url ? (
        <BaseImage src={url} alt="" sizes="40px" className="object-cover" />
      ) : (
        <FolderEmptyImage width={30} height={22} />
      )}
    </div>
  );
}

export default FolderListThumbnail;
