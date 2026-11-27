'use client';

import { AddCirularIconFill } from '@/assets/icons';
import Button from '@/components/button';
import ButtonLink from '@/components/button/ButtonLink';
import { ROUTES } from '@/consts/route';

import type { ProfileRelationT } from '../_types/profile';

type ProfileActionsProps = {
  relation: ProfileRelationT;
  /** 친구 추가 · 차단 해제 요청 중 */
  isPending: boolean;
  onAddFriend: () => void;
  onUnblock: () => void;
};

/** 관계별 버튼. 노출 여부는 호출하는 쪽에서 판단 */
function ProfileActions({ relation, isPending, onAddFriend, onUnblock }: ProfileActionsProps) {
  if (relation === 'SELF')
    return (
      <div className="flex gap-3 px-5">
        <ButtonLink href={ROUTES.MYPAGE_EDIT} variant="secondary" size="lg" className="flex-1">
          프로필 수정
        </ButtonLink>
        <ButtonLink href={ROUTES.FRIENDS} variant="secondary" size="lg" className="flex-1">
          내 친구 목록
        </ButtonLink>
      </div>
    );

  if (relation === 'BLOCKED')
    return (
      <div className="px-5">
        <Button variant="secondary" size="lg" isLoading={isPending} onClick={onUnblock}>
          차단 해제
        </Button>
      </div>
    );

  return (
    <div className="px-5">
      <Button
        size="lg"
        isLoading={isPending}
        icon="leading"
        leadingIcon={<AddCirularIconFill aria-hidden className="size-5" />}
        onClick={onAddFriend}
      >
        친구 추가
      </Button>
    </div>
  );
}

export default ProfileActions;
