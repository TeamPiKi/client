import type { Ref } from 'react';

import { ReloaderIconOutline } from '@/assets/icons';
import Spinner from '@/components/spinner';

type NextPageStatusProps = {
  ref: Ref<HTMLDivElement>;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
};

function NextPageStatus({ ref, isFetching, isError, onRetry }: NextPageStatusProps) {
  if (isError && !isFetching) {
    return (
      <div className="flex justify-center py-4">
        <button
          type="button"
          aria-label="다시 불러오기"
          onClick={() => onRetry()}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full"
        >
          <ReloaderIconOutline className="size-6 text-icon-neutral-secondary" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex justify-center">
      {isFetching && (
        <div className="py-4">
          <Spinner size={24} />
        </div>
      )}
    </div>
  );
}

export default NextPageStatus;
