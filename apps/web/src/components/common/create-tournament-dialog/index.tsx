'use client';

import { useState } from 'react';


import Button from '@/components/button';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import Input from '@/components/input';
import { usePostCreateTournament } from '@/hooks/usePostCreateTournament';

/** 토너먼트 생성 시 기본 초대 마감 시각 — 현재 + 30분. */
const DEFAULT_INVITE_DURATION_MINUTES = 30;

function CreateTournamentDialogContent() {
  const [name, setName] = useState('');
  const { postCreateTournamentMutation, isPostCreateTournamentPending } = usePostCreateTournament();

  const trimmedName = name.trim();
  const isDisabled = trimmedName.length === 0 || isPostCreateTournamentPending;

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) return;
    postCreateTournamentMutation({
      name: trimmedName,
      inviteDurationMinutes: DEFAULT_INVITE_DURATION_MINUTES,
    });
  };

  return (
    <DialogContent showCloseButton={false} className="flex flex-col gap-5">
      <DialogDescription className="sr-only">새 토너먼트 생성 다이얼로그</DialogDescription>
      <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
        새 토너먼트
      </DialogTitle>
      <form onSubmit={handleCreate} className="flex flex-col gap-[15px]">
        <Input
          label="토너먼트 이름"
          placeholder="이번주 신발 고르기"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          maxLength={30}

        />
        <Button type="submit" size="lg" variant="primary" disabled={isDisabled}>
          생성하기
        </Button>
      </form>
    </DialogContent>
  );
}

export default CreateTournamentDialogContent;
