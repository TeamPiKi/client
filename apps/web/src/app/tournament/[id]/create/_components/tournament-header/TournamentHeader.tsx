'use client';

import { useState } from 'react';

import { Header, HeaderIcon } from '@/components/header';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import ConfirmExitDialog from './ConfirmExitDialog';
import TournamentGuidePopover from './TournamentGuidePopover';

type TournamentHeaderProps = {
  name: string;
  hasFriends: boolean;
};

function TournamentHeader({ name, hasFriends }: TournamentHeaderProps) {
  const backWithFallback = useBackWithFallback();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const handleExit = () => {
    setIsExitConfirmOpen(false);
    backWithFallback(ROUTES.HOME);
  };

  const handleBackClick = () => {
    if (hasFriends) {
      setIsExitConfirmOpen(true);
      return;
    }
    handleExit();
  };

  return (
    <>
      <Header
        left={<HeaderIcon name="BACK" onClick={handleBackClick} />}
        center={<span className="block w-full truncate">{name}</span>}
        centerClassName="heading-1-bold w-[calc(100%-40px-30px-30px)] text-center"
        right={<TournamentGuidePopover />}
      />

      <ConfirmExitDialog
        open={isExitConfirmOpen}
        onOpenChange={setIsExitConfirmOpen}
        onConfirm={handleExit}
      />
    </>
  );
}

export default TournamentHeader;
