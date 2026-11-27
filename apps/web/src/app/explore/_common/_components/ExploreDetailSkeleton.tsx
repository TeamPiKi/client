import Skeleton from '@/components/skeleton';

/** ExploreDetailView 의 이미지·상품 정보·담은 사람 카드 자리 */
function ExploreDetailSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-4">
      <Skeleton className="aspect-square w-full rounded-xl" />

      <div className="flex flex-col items-start gap-4 rounded-xl bg-bg-layer-floating p-4">
        <Skeleton className="h-[34px] w-32 rounded-3xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-7 w-28" />
        </div>
      </div>

      <div className="flex items-center gap-5 rounded-2xl bg-bg-layer-default p-4">
        <Skeleton shape="circle" className="size-10 shrink-0" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export default ExploreDetailSkeleton;
