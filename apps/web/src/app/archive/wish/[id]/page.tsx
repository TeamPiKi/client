import EditContent from './_components/EditContent';

type WishEditPageProps = {
  params: Promise<{ id: string }>;
};

async function WishEditPage({ params }: WishEditPageProps) {
  const { id } = await params;
  const wishId = Number(id);

  return <EditContent wishId={wishId} />;
}

export default WishEditPage;
