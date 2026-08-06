'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getInvitePreviewByCode } from '@/apis/getInvitePreviewByCode';
import {
  CODE_LENGTH,
  isValidInviteCodeFormat,
} from '@/app/tournament/join/_utils/verifyInviteCode';
import { GroupIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import Input from '@/components/input';
import Spinner from '@/components/spinner';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';

import InvalidCodeDialog from './invite-code-dialog/InvalidCodeDialog';

function InviteTournamentDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [showFormatError, setShowFormatError] = useState(false);
  const [isInvalidDialogOpen, setIsInvalidDialogOpen] = useState(false);
  const [isTournamentErrorDialogOpen, setIsTournamentErrorDialogOpen] = useState(false);

  const { mutate: previewMutation, isPending: isPreviewPending } = useMutation({
    mutationFn: getInvitePreviewByCode,
    /** mutation 진행 중 사용자가 input 을 바꿀 수 있으므로 검증에 사용한 variables 를 그대로 라우팅에 쓴다. */
    onSuccess: (data, enteredCode) => {
      setOpen(false);
      reset();
      router.push(`/tournament/join/${data.tournamentId}?code=${enteredCode}`);
    },
    onError: error => {
      setOpen(false);
      reset();

      if (isGlobalNetError(error)) return;

      /** 409: 초대 코드 만료 */
      if (getApiErrorStatus(error) === 409) {
        setIsTournamentErrorDialogOpen(true);
        return;
      }

      /** 그 외(400 코드 불일치 포함): 유효하지 않은 코드로 안내 */
      setIsInvalidDialogOpen(true);
    },
  });

  const isComplete = code.length === CODE_LENGTH;
  const canSubmit = isComplete && !isPreviewPending;

  const reset = () => {
    setCode('');
    setShowFormatError(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  const handleTriggerClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.SOCIAL_INVITE_CLICK);
  };

  const handleChange = (next: string) => {
    setCode(next.slice(0, CODE_LENGTH).toUpperCase());
    if (showFormatError) setShowFormatError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (!isValidInviteCodeFormat(code)) {
      setShowFormatError(true);
      return;
    }

    previewMutation(code);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild onClick={handleTriggerClick}>
          <button
            type="button"
            aria-label="공유받은 토너먼트 참여하기"
            className="flex h-[104px] cursor-pointer flex-col rounded-2xl bg-gray-50 p-4"
          >
            <span className="text-left body-1-semibold whitespace-pre-line text-text-neutral-primary">
              {'공유받은 토너먼트\n참여하기'}
            </span>
            <GroupIconFill className="size-7.5 self-end text-icon-neutral-secondary" />
          </button>
        </DialogTrigger>
        <DialogContent showCloseButton={false} className="flex flex-col gap-5 p-6">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            공유받은 토너먼트
          </DialogTitle>
          <DialogDescription className="sr-only">초대 코드를 입력해 입장합니다.</DialogDescription>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="초대 코드"
              placeholder="pik123"
              value={code}
              onChange={event => handleChange(event.target.value)}
              aria-invalid={showFormatError}
              {...(showFormatError
                ? { helperText: '영문 대문자 3자 + 숫자 3자로 입력해주세요.' }
                : {})}
              maxLength={CODE_LENGTH}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
            />

            <Button type="submit" size="lg" variant="primary" disabled={!canSubmit}>
              {isPreviewPending ? <Spinner size={20} /> : '입장하기'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <InvalidCodeDialog open={isInvalidDialogOpen} onOpenChange={setIsInvalidDialogOpen} />
      <TournamentErrorDialog
        type="LINK_EXPIRED"
        open={isTournamentErrorDialogOpen}
        onOpenChange={setIsTournamentErrorDialogOpen}
      />
    </>
  );
}

export default InviteTournamentDialog;
