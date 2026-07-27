import { EditIconFill } from '@/assets/icons';
import Input from '@/components/input';
import Spinner from '@/components/spinner';

type NicknameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  isChecking: boolean;
  errorText?: string;
};

function NicknameField({ value, onChange, isChecking, errorText }: NicknameFieldProps) {
  const isError = !!errorText;

  return (
    <div className="flex w-full flex-col">
      <h2 className="heading-2-semibold text-gray-950">닉네임</h2>
      <Input
        name="nickname"
        value={value}
        autoCorrect="off"
        onChange={event => onChange(event.target.value)}
        aria-invalid={isError}
        {...(errorText ? { helperText: errorText } : {})}
        right={
          isChecking ? (
            <Spinner size={20} />
          ) : (
            <EditIconFill className="size-5 text-icon-neutral-secondary" />
          )
        }
      />
    </div>
  );
}

export default NicknameField;
