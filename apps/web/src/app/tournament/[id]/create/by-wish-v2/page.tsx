import { notFound } from 'next/navigation';

import { Header, HeaderIcon } from '@/components/header';

import ByWishV2Content from './_components/ByWishV2Content';

type ByWishV2PageProps = {
  params: Promise<{ id: string }>;
};

/** TEMP: 폴더 칩 작업용 임시 경로. 완료 후 by-wish 로 합치고 삭제함 */
async function ByWishV2Page({ params }: ByWishV2PageProps) {
  if (process.env.NEXT_PUBLIC_STAGE === 'production') notFound();

  const { id } = await params;
  const tournamentId = Number(id);

  return (
    <div className="flex h-full flex-col bg-bg-layer-basement">
      <div className="bg-bg-layer-default px-5 pt-padding-top">
        <Header
          left={<HeaderIcon name="BACK" />}
          center={
            <h1 className="heading-1-bold text-text-neutral-primary">내 위시에서 가져오기</h1>
          }
        />
      </div>
      <ByWishV2Content tournamentId={tournamentId} />
    </div>
  );
}

export default ByWishV2Page;
