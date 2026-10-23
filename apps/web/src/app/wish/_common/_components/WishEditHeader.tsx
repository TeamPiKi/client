import { Header } from '@/components/header';

type WishEditHeaderProps = {
  selectedCount: number;
  onDone: () => void;
};

function WishEditHeader({ selectedCount, onDone }: WishEditHeaderProps) {
  return (
    <Header
      center={
        <h1 className="heading-1-bold text-text-neutral-primary">
          {selectedCount > 0 ? `위시 ${selectedCount}개 선택` : '위시 선택'}
        </h1>
      }
      right={
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer heading-2-semibold text-text-neutral-primary"
        >
          완료
        </button>
      }
    />
  );
}

export default WishEditHeader;
