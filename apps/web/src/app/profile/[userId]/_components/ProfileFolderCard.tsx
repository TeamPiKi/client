import FolderCover from '@/components/common/folder-cover';

type ProfileFolderCardProps = {
  name: string;
  wishCount: number;
  thumbnailUrls: (string | null)[];
};

function ProfileFolderCard({ name, wishCount, thumbnailUrls }: ProfileFolderCardProps) {
  return (
    <div className="flex flex-col">
      <FolderCover thumbnailUrls={thumbnailUrls.slice(0, 3)} />
      <div className="flex flex-col items-center gap-0.5 p-3 text-center">
        <p className="w-full truncate body-2-semibold text-text-neutral-primary">{name}</p>
        <p className="caption-1-regular text-text-neutral-secondary">위시 {wishCount}개</p>
      </div>
    </div>
  );
}

export default ProfileFolderCard;
