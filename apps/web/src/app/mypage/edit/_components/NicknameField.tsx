import { EditIconFill } from '@/assets/icons';
import Input from '@/components/input';

type NicknameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  errorText?: string;
};

function NicknameField({ value, onChange, errorText }: NicknameFieldProps) {
  const isError = !!errorText;

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="heading-2-semibold text-gray-950">닉네임</h2>
      <Input
        name="nickname"
        value={value}
        autoCorrect="off"
        onChange={event => onChange(event.target.value)}
        aria-invalid={isError}
        {...(errorText ? { helperText: errorText } : {})}
        right={<EditIconFill className="size-5 text-icon-neutral-secondary" />}
      />
    </div>
  );
}

export default NicknameField;
