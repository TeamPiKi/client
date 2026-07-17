import { MAX_SELECT } from '../_consts/selectLimits';

type WishSelectHeaderProps = {
  selectedCount: number;
  totalCount: number;
  tournamentCandidateCount: number;
  isMaxExceeded: boolean;
};

function WishSelectHeader({
  selectedCount,
  totalCount,
  tournamentCandidateCount,
  isMaxExceeded,
}: WishSelectHeaderProps) {
  const renderSubtitle = () => {
    if (isMaxExceeded)
      return (
        <p>
          <span className="heading-2-semibold text-gray-600">최대 {MAX_SELECT}개</span>
          <span className="heading-2-medium text-gray-300">까지 선택할 수 있어요</span>
        </p>
      );

    return (
      <p className="whitespace-pre-line">
        <span className="heading-2-semibold text-text-neutral-secondary">
          {tournamentCandidateCount}개가
        </span>
        <span className="heading-2-medium text-text-neutral-secondary">
          {' 담겨있어요\n더 추가하고 싶은 상품을 골라보세요.'}
        </span>
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-[25px]">
      <div className="flex flex-col gap-2">
        <h1 className="title-1 text-gray-950">비교할 위시템을 선택해주세요</h1>
        <div className="min-h-[52px]">{renderSubtitle()}</div>
      </div>
      <p className="body-1-medium">
        <span className="text-gray-950">{selectedCount}</span>
        <span className="text-gray-600">/{totalCount}개 선택 중</span>
      </p>
    </div>
  );
}

export default WishSelectHeader;
