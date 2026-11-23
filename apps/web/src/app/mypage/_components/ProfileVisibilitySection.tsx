'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import ConfirmDialog from '@/components/common/confirm-dialog';
import Switch from '@/components/switch';

function ProfileVisibilitySection() {
  // TODO: 프로필 공개 여부 API 스펙이 나오면 조회·변경 API 로 교체
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleDialogCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    switchRef.current?.focus();
  };

  const handleCheckedChange = (checked: boolean) => {
    if (!checked) {
      setIsConfirmOpen(true);
      return;
    }

    setIsProfilePublic(true);
    toast.success('내 프로필을 공개로 바꿨어요.');
  };

  const handleConfirmPrivate = () => {
    setIsProfilePublic(false);
    setIsConfirmOpen(false);
    toast.success('내 프로필을 비공개로 바꿨어요.');
  };

  return (
    <>
      <section className="flex w-full flex-col gap-3">
        <h2 className="body-2-semibold text-text-neutral-secondary">공개 설정</h2>
        <div className="flex items-center gap-2 rounded-xl bg-bg-layer-default px-4">
          <span
            id="profile-visibility-label"
            className="flex-1 px-2 py-4 body-1-medium text-text-neutral-primary"
          >
            내 프로필 공개
          </span>
          <Switch
            ref={switchRef}
            checked={isProfilePublic}
            onCheckedChange={handleCheckedChange}
            aria-labelledby="profile-visibility-label"
          />
        </div>
      </section>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        icon={null}
        title="내 프로필을 비공개로 바꿀까요?"
        description="탐색에서 위시와 폴더가 모두 보이지 않아요"
        confirmLabel="비공개로 바꾸기"
        onConfirm={handleConfirmPrivate}
        onCloseAutoFocus={handleDialogCloseAutoFocus}
      />
    </>
  );
}

export default ProfileVisibilitySection;
