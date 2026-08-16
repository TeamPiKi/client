import WishInfoScreen from './_components/WishInfoScreen';

type WishInfoPageProps = {
  params: Promise<{ id: string }>;
};

async function WishInfoPage({ params }: WishInfoPageProps) {
  const { id } = await params;
  const wishId = Number(id);

  return <WishInfoScreen wishId={wishId} />;
}

export default WishInfoPage;
