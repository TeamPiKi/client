import { cn } from '@/utils/cn';

type FolderChipFilterProps = {
  folders: { id: number; name: string }[];
  activeFolderId: number | null;
  onFolderChange: (folderId: number | null) => void;
};

function FolderChipFilter({ folders, activeFolderId, onFolderChange }: FolderChipFilterProps) {
  const chips = [{ id: null, name: '전체' }, ...folders];

  return (
    <div
      role="group"
      aria-label="폴더 필터"
      className="hide-scrollbar flex gap-2 overflow-x-auto px-5"
    >
      {chips.map(({ id, name }) => {
        const isActive = activeFolderId === id;

        return (
          <button
            key={id ?? 'all'}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFolderChange(id)}
            className={cn(
              'flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-3 body-2-semibold transition-colors',
              isActive
                ? 'border-border-neutral-primary bg-bg-neutral-secondary text-text-neutral-inverse'
                : 'border-gray-75 bg-bg-layer-default text-text-neutral-secondary'
            )}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

export default FolderChipFilter;
