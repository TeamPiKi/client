'use client';

import Button from '@/components/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/drawer';
import { PROFILE_SVG, type ProfileTypeT } from '@/components/user-profile-group/userProfile.const';

type MemberJoinConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nickname: string;
  profileType: ProfileTypeT;
  tournamentName: string;
  itemCount: number;
  participantCount: number;
  onConfirm: () => void;
};

function MemberJoinConfirmDialog({
  open,
  onOpenChange,
  nickname,
  profileType,
  tournamentName,
  itemCount,
  participantCount,
  onConfirm,
}: MemberJoinConfirmDialogProps) {
  const ProfileSvg = PROFILE_SVG[profileType];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
      <DrawerContent>
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <ProfileSvg className="size-12.5" aria-label={nickname} />
            <div className="flex flex-col items-center gap-1">
              <DrawerTitle className="heading-1-bold text-text-neutral-primary">{nickname}</DrawerTitle>
              <DrawerDescription className="body-2-medium text-text-neutral-tertiary">
                이 프로필로 참여할게요.
              </DrawerDescription>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 rounded-xl bg-gray-50 p-4">
            <p className="body-1-semibold text-text-neutral-primary">{tournamentName}</p>
            <p className="body-2-medium text-text-neutral-secondary">
              후보 {itemCount}개 · 참여 {participantCount}명
            </p>
          </div>

          <Button size="lg" variant="primary" className="w-full" onClick={onConfirm}>
            참여하기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MemberJoinConfirmDialog;
