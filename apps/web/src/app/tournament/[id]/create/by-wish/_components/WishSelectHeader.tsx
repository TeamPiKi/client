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
        <p className="body-1-medium text-text-neutral-secondary">
          최대 {MAX_SELECT}개까지 선택할 수 있어요
        </p>
      );

    return (
      <p className="whitespace-pre-line body-1-medium text-text-neutral-secondary">
        {`후보가 ${tournamentCandidateCount}개 담겨있어요.\n후보로 추가할 상품을 선택해주세요.`}
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-8 pt-6">
      {renderSubtitle()}
      <p className="body-2-medium">
        <span className="text-text-accent">{selectedCount}</span>
        <span className="text-[#737373]">/{totalCount}개 선택</span>
      </p>
    </div>
  );
}

export default WishSelectHeader;
