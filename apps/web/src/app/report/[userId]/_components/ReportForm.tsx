'use client';

import { type FormEvent, useState } from 'react';

import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import Spacing from '@/components/spacing';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { usePageBackground } from '@/hooks/usePageBackground';

import { REPORT_REASONS } from '../_consts/report';
import { usePostUserReport } from '../_hooks/usePostUserReport';
import type { ReportReasonT } from '../_types/report';
import ReportEtcField from './ReportEtcField';

type ReportFormProps = {
  userId: string;
};

function ReportForm({ userId }: ReportFormProps) {
  usePageBackground('var(--color-bg-layer-default)');

  const backWithFallback = useBackWithFallback();

  const [selectedReason, setSelectedReason] = useState<ReportReasonT | null>(null);
  const [etcReason, setEtcReason] = useState<string>('');

  const { postUserReportMutation, isPostUserReportPending } = usePostUserReport({
    onSuccess: () => backWithFallback(ROUTES.PROFILE(userId)),
  });

  const handleReasonChange = (reason: ReportReasonT) => {
    setSelectedReason(prev => (prev === reason ? null : reason));
    setEtcReason('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedReason || isPostUserReportPending) return;

    const detail = etcReason.trim();
    postUserReportMutation({
      userId,
      reason: selectedReason,
      ...(selectedReason === 'OTHER' && detail && { detail }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto px-5 pb-bottom-cta">
        <h2 className="heading-2-semibold text-text-neutral-primary">신고하는 이유를 알려주세요</h2>
        <Spacing size={6} />
        <p className="body-2-medium text-text-neutral-tertiary">
          신고 내용은 상대방에게 알려지지 않아요.
        </p>

        <Spacing size={43} />

        <fieldset className="flex flex-col gap-8">
          <legend className="sr-only">신고 사유</legend>
          {REPORT_REASONS.map(({ value, label }) => (
            <ReportReasonOption
              key={value}
              value={value}
              label={label}
              checked={selectedReason === value}
              onChange={handleReasonChange}
            />
          ))}
        </fieldset>

        {selectedReason === 'OTHER' && (
          <>
            <Spacing size={19} />
            <ReportEtcField value={etcReason} onChange={setEtcReason} />
          </>
        )}
      </div>

      <BottomCta className="border-t border-gray-50 bg-bg-layer-default">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!selectedReason}
          isLoading={isPostUserReportPending}
        >
          신고하기
        </Button>
      </BottomCta>
    </form>
  );
}

type ReportReasonOptionProps = {
  value: ReportReasonT;
  label: string;
  checked: boolean;
  onChange: (reason: ReportReasonT) => void;
};

function ReportReasonOption({ value, label, checked, onChange }: ReportReasonOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-4">
      <input
        type="checkbox"
        name="reason"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      {checked ? (
        <CheckboxSelectedIconFill className="size-5 rounded-sm text-bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bg-accent" />
      ) : (
        <CheckboxEmptyIconFill className="size-5 rounded-sm text-black/8 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bg-accent" />
      )}
      <span className="body-1-medium text-text-neutral-primary">{label}</span>
    </label>
  );
}

export default ReportForm;
