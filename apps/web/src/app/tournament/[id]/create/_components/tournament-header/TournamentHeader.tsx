'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Header, HeaderIcon } from '@/components/header';
import { ROUTES } from '@/consts/route';

import ConfirmExitDialog from './ConfirmExitDialog';
import TournamentGuidePopover from './TournamentGuidePopover';

type TournamentHeaderProps = {
  name: string;
  hasFriends: boolean;
};

function TournamentHeader({ name, hasFriends }: TournamentHeaderProps) {
  const router = useRouter();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const handleBackClick = () => {
    if (hasFriends) {
      setIsExitConfirmOpen(true);
      return;
    }
    router.push(ROUTES.HOME);
  };

  const handleConfirmExit = () => {
    setIsExitConfirmOpen(false);
    router.back();
  };

  return (
    <>
      <Header
        left={<HeaderIcon name="BACK" onClick={handleBackClick} />}
        center={<span className="block w-full truncate">{name}</span>}
        centerClassName="title-1 w-[calc(100%-40px-30px-30px)] text-center"
        right={<TournamentGuidePopover />}
      />

      <ConfirmExitDialog
        open={isExitConfirmOpen}
        onOpenChange={setIsExitConfirmOpen}
        onConfirm={handleConfirmExit}
      />
    </>
  );
}

export default TournamentHeader;
