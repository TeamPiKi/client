'use client';

import { useEffect, useRef } from 'react';

import Input from '@/components/input';

const ETC_REASON_MAX_LENGTH = 300;

type ReportEtcFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function ReportEtcField({ value, onChange }: ReportEtcFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fieldRef.current?.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <div ref={fieldRef} className="flex scroll-mb-bottom-cta flex-col gap-2">
      <Input
        autoFocus
        value={value}
        onChange={event => onChange(event.target.value)}
        maxLength={ETC_REASON_MAX_LENGTH}
        placeholder="신고 사유를 자세히 알려주세요."
        aria-label="기타 신고 사유"
      />
      <p className="body-2-regular text-text-neutral-secondary">
        {value.length}/{ETC_REASON_MAX_LENGTH}
      </p>
    </div>
  );
}

export default ReportEtcField;
