type MatchTitleProps = {
  isFinal?: boolean;
};

function MatchTitle({ isFinal = false }: MatchTitleProps) {
  const title = isFinal ? '최후의 선택을 받을 위시는?' : '내 마음을 움직이는 위시는?';

  return (
    <h1 className="text-center text-[22px] leading-8 font-bold tracking-[-0.6px] text-text-neutral-primary">
      {title}
    </h1>
  );
}

export default MatchTitle;
