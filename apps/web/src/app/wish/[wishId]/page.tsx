import WishInfoScreen from './_components/WishInfoScreen';

type WishInfoPageProps = {
  params: Promise<{ wishId: string }>;
};

async function WishInfoPage({ params }: WishInfoPageProps) {
  const { wishId } = await params;

  return <WishInfoScreen wishId={Number(wishId)} />;
}

export default WishInfoPage;
