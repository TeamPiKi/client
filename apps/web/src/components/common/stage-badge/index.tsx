/** production 이외 환경(dev·local)을 콘텐츠 영역 우상단에 표시 — pointer-events-none 으로 클릭은 밑 요소에 전달 */
function StageBadge() {
  const stage = process.env.NODE_ENV === 'development' ? 'local' : process.env.NEXT_PUBLIC_STAGE;

  if (!stage || stage === 'production') return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto max-w-120">
      <span className="absolute top-[env(safe-area-inset-top)] right-0 bg-gray-950/60 px-2 py-1 caption-1-semibold text-base-50 uppercase select-none">
        {stage}
      </span>
    </div>
  );
}

export default StageBadge;
