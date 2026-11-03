import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import { cn } from '@/utils/cn';

import FolderEmptyImage from '../_assets/folder-empty.svg';

type FolderListThumbnailProps = {
  coverImageUrls: (string | null)[];
  className?: string;
};

function FolderListThumbnail({ coverImageUrls, className }: FolderListThumbnailProps) {
  const [url = null] = coverImageUrls;
  const isEmptyFolder = coverImageUrls.length === 0;

  return (
    <div
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-50',
        className
      )}
    >
      {url && <BaseImage src={url} alt="" sizes="40px" className="object-cover" />}
      {!url && isEmptyFolder && <FolderEmptyImage width={30} height={22} />}
      {!url && !isEmptyFolder && (
        <ImageIconOutline width={20} height={20} className="text-gray-200" aria-hidden />
      )}
    </div>
  );
}

export default FolderListThumbnail;
