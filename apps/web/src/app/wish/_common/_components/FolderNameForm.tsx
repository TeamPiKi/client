'use client';

import { type FormEvent, useState } from 'react';

import { ChevronBackwardIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { DrawerTitle } from '@/components/drawer';
import { Header } from '@/components/header';
import Input from '@/components/input';
import { cn } from '@/utils/cn';

const MAX_FOLDER_NAME_LENGTH = 20;

const graphemeSegmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

/** NOTE: 이모지도 1자로 세야 해서 length 대신 grapheme 단위로 셈 */
const countGraphemes = (value: string) => Array.from(graphemeSegmenter.segment(value)).length;

type FolderNameFormProps = {
  title: string;
  initialName?: string;
  submitErrorMessage?: string | null;
  isPending?: boolean;
  onBack: () => void;
  onNameChange?: () => void;
  onSubmit: (name: string) => void;
};

function FolderNameForm({
  title,
  initialName = '',
  submitErrorMessage = null,
  isPending = false,
  onBack,
  onNameChange,
  onSubmit,
}: FolderNameFormProps) {
  const [name, setName] = useState(initialName);
  const [isEmptySubmitted, setIsEmptySubmitted] = useState(false);

  const trimmedName = name.trim();
  const isUnchanged = initialName !== '' && trimmedName === initialName;
  const isOverLimit = countGraphemes(trimmedName) > MAX_FOLDER_NAME_LENGTH;

  let errorMessage: string | null = submitErrorMessage;
  if (isOverLimit) errorMessage = `최대 ${MAX_FOLDER_NAME_LENGTH}자까지 입력할 수 있어요.`;
  else if (isEmptySubmitted) errorMessage = '폴더 이름을 입력해 주세요.';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedName) {
      setIsEmptySubmitted(true);
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <form onSubmit={handleSubmit} className="-mt-2 flex flex-col gap-6">
      <Header
        left={
          <button type="button" aria-label="뒤로가기" onClick={onBack} className="cursor-pointer">
            <ChevronBackwardIconFill className="size-7.5 text-icon-neutral-primary" />
          </button>
        }
        center={
          <DrawerTitle className="heading-2-semibold text-text-neutral-primary">
            {title}
          </DrawerTitle>
        }
      />
      <div className={cn('flex flex-col pb-1.5', errorMessage ? 'gap-2' : 'gap-9')}>
        <Input
          aria-label="폴더명"
          placeholder="폴더명을 입력해주세요."
          value={name}
          onChange={event => {
            setName(event.target.value);
            setIsEmptySubmitted(false);
            onNameChange?.();
          }}
          aria-invalid={errorMessage !== null}
          {...(errorMessage && { helperText: errorMessage })}
          autoFocus
        />
        <Button
          type="submit"
          size="lg"
          disabled={name === '' || isUnchanged || isOverLimit || isPending}
        >
          완료
        </Button>
      </div>
    </form>
  );
}

export default FolderNameForm;
