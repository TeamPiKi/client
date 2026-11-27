import ExploreDetailFrame from '../../_common/_components/ExploreDetailFrame';
import ExploreDetailSkeleton from '../../_common/_components/ExploreDetailSkeleton';

function ExplorePickLoading() {
  return (
    <ExploreDetailFrame>
      <ExploreDetailSkeleton />
    </ExploreDetailFrame>
  );
}

export default ExplorePickLoading;
