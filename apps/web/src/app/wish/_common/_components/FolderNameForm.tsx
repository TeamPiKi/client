'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import { ChevronBackwardIconFill } from '@/assets/icons';
import Button from '@/components/button';
import { DrawerTitle } from '@/components/drawer';
import { Header } from '@/components/header';
import Input from '@/components/input';

const MAX_FOLDER_NAME_LENGTH = 20;

const graphemeSegmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });

/** NOTE: 이모지도 1자로 세야 해서 length 대신 grapheme 단위로 셈 */
const splitGraphemes = (value: string) =>
  Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment);

type FolderNameFormProps = {
  title: string;
  initialName?: string;
  onBack: () => void;
  onSubmit: (name: string) => void;
};

function FolderNameForm({ title, initialName = '', onBack, onSubmit }: FolderNameFormProps) {
  const [name, setName] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedName = name.trim();
  const isUnchanged = initialName !== '' && trimmedName === initialName;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const graphemes = splitGraphemes(event.target.value);
    const isOverLimit = graphemes.length >= MAX_FOLDER_NAME_LENGTH;

    setName(graphemes.slice(0, MAX_FOLDER_NAME_LENGTH).join(''));
    setErrorMessage(isOverLimit ? `최대 ${MAX_FOLDER_NAME_LENGTH}자까지 입력할 수 있어요.` : null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedName) {
      setErrorMessage('폴더 이름을 입력해 주세요.');
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Header
        left={
          <button type="button" aria-label="뒤로가기" onClick={onBack} className="cursor-pointer">
            <ChevronBackwardIconFill className="size-7.5 text-text-neutral-primary" />
          </button>
        }
        center={
          <DrawerTitle className="heading-2-semibold text-text-neutral-primary">
            {title}
          </DrawerTitle>
        }
      />
      <div className="flex flex-col gap-9 pb-1.5">
        <Input
          aria-label="폴더명"
          placeholder="폴더명을 입력해주세요."
          value={name}
          onChange={handleChange}
          aria-invalid={errorMessage !== null}
          {...(errorMessage && { helperText: errorMessage })}
          autoFocus
        />
        <Button type="submit" size="lg" disabled={name === '' || isUnchanged}>
          완료
        </Button>
      </div>
    </form>
  );
}

export default FolderNameForm;
