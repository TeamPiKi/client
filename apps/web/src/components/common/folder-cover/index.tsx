import ImageIconOutline from '@/assets/icons/outline/image.svg';
import FolderCoverEmptyImage from '@/assets/images/folder-cover-empty.svg';
import BaseImage from '@/components/base-image';
import { cn } from '@/utils/cn';

type FolderCoverProps = {
  /** 앞에서부터 최대 3장 사용 */
  thumbnailUrls: (string | null)[];
};

function FolderThumbnail({ url, className }: { url: string | null; className?: string }) {
  return (
    <div className={cn('relative bg-gray-75', className)}>
      {url ? (
        <BaseImage
          src={url}
          alt=""
          sizes="(max-width: 480px) 50vw, 240px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-200">
          <ImageIconOutline width={32} height={32} aria-hidden />
        </div>
      )}
    </div>
  );
}

function FolderCover({ thumbnailUrls }: FolderCoverProps) {
  const [first = null, second = null, third = null] = thumbnailUrls;

  if (thumbnailUrls.length === 0)
    return (
      <div className="flex aspect-[201/248] w-full items-center justify-center bg-bg-layer-basement">
        <FolderCoverEmptyImage width={58} height={43} aria-hidden />
      </div>
    );

  if (thumbnailUrls.length === 1)
    return <FolderThumbnail url={first} className="aspect-[201/248] w-full" />;

  return (
    <div className="grid aspect-[201/248] w-full grid-cols-2 grid-rows-2">
      <FolderThumbnail
        url={first}
        className="col-span-2 border-b-[1.5px] border-bg-layer-basement"
      />
      <FolderThumbnail url={second} />
      {thumbnailUrls.length === 2 ? (
        <div className="flex items-center justify-center border-l-[1.5px] border-bg-layer-basement bg-bg-layer-basement">
          <FolderCoverEmptyImage width={41} height={30} aria-hidden />
        </div>
      ) : (
        <FolderThumbnail url={third} className="border-l-[1.5px] border-bg-layer-basement" />
      )}
    </div>
  );
}

export default FolderCover;
