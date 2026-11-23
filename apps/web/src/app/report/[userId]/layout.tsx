import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getRoleOrRedirect } from '@/utils/getRoleOrRedirect';

type ReportLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
};

async function ReportLayout({ children, params }: ReportLayoutProps) {
  const role = await getRoleOrRedirect();

  if (role !== 'MEMBER') redirect(ROUTES.PROFILE((await params).userId));

  return children;
}

export default ReportLayout;
