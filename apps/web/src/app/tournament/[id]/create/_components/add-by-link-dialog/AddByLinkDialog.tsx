'use client';

import { useState } from 'react';

import { LinkIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/dialog';
import Input from '@/components/input';
import { URL_PATTERN, extractUrlFromText } from '@/utils/extractUrl';

type AddByLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (url: string) => void;
};

function AddByLinkDialog({ open, onOpenChange, onSubmit }: AddByLinkDialogProps) {
  const [url, setUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  const trimmedUrl = url.trim();
  const isEmpty = trimmedUrl.length === 0;

  const resetState = () => {
    setUrl('');
    setHasError(false);
  };

  const handleSubmit = () => {
    if (isEmpty) return;

    // 상품 설명과 URL 이 함께 붙여넣어진 경우 URL 만 추출해 제출한다 (onPaste 를 타지 않은 경로 안전망).
    const submitUrl = URL_PATTERN.test(trimmedUrl) ? trimmedUrl : extractUrlFromText(trimmedUrl);

    if (!submitUrl) {
      setHasError(true);
      return;
    }

    onSubmit?.(submitUrl);
    onOpenChange(false);
    resetState();
  };

  const handleChange = (value: string) => {
    setUrl(value);
    if (hasError) setHasError(false);
  };

  /** 상품 설명 + URL 형태로 붙여넣으면 URL 만 입력창에 반영한다 */
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const extractedUrl = extractUrlFromText(event.clipboardData.getData('text'));
    if (!extractedUrl) return;

    event.preventDefault();
    handleChange(extractedUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex w-[360px] max-w-[calc(100%-40px)] flex-col gap-5 rounded-3xl"
      >
        <DialogTitle className="text-center heading-1 text-text-neutral-primary">
          링크로 담기
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <Input
            label="링크 URL"
            placeholder="복사한 링크를 입력해주세요."
            value={url}
            onChange={e => handleChange(e.target.value)}
            onPaste={handlePaste}
            left={<LinkIconFill className="size-5" />}
            aria-invalid={hasError}
            {...(hasError ? { helperText: '올바른 URL 형식으로 입력해주세요.' } : {})}
            autoFocus
          />
          <Button size="lg" variant="primary" disabled={isEmpty} onClick={handleSubmit}>
            후보 바구니에 담기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddByLinkDialog;
