'use client';

import { useState } from 'react';

import { BasketIconFill, EditIconFill } from '@/assets/icons';
import Button from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import Input from '@/components/input';

import { usePostCreateTournament } from '../_hooks/usePostCreateTournament';

/** 토너먼트 생성 시 기본 초대 마감 시각 — 현재 + 30분. */
const DEFAULT_INVITE_DURATION_MINUTES = 30;

function CreateTournamentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { postCreateTournamentMutation, isPostCreateTournamentPending } = usePostCreateTournament();

  const trimmedName = name.trim();
  const isDisabled = trimmedName.length === 0 || isPostCreateTournamentPending;

  const handleCreate = () => {
    if (isDisabled) return;
    postCreateTournamentMutation(
      { name: trimmedName, inviteDurationMinutes: DEFAULT_INVITE_DURATION_MINUTES },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="새 토너먼트 만들기"
          className="flex h-[104px] cursor-pointer flex-col rounded-2xl bg-gray-900 p-4"
        >
          <span className="text-left body-1-semibold whitespace-pre-line text-base-50">
            {'새 토너먼트\n만들기'}
          </span>
          <BasketIconFill className="size-7.5 self-end text-white" />
        </button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="flex flex-col gap-5">
        <DialogDescription className="sr-only">새 토너먼트 생성 다이얼로그</DialogDescription>
        <DialogTitle className="text-center heading-1 text-text-neutral-primary">
          새 토너먼트
        </DialogTitle>
        <div className="flex flex-col gap-[15px]">
          <Input
            label="토너먼트 이름"
            placeholder="ex.이번주 신발 고르기"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            maxLength={30}
            right={isDisabled ? <EditIconFill className="size-5" /> : null}
          />
          <Button size="lg" variant="primary" disabled={isDisabled} onClick={handleCreate}>
            생성하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTournamentDialog;
