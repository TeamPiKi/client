import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

type SwitchProps = Omit<ComponentProps<'button'>, 'onChange' | 'role' | 'aria-checked'> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function Switch({ checked, onCheckedChange, disabled, className, ...rest }: SwitchProps) {
  const handleClick = () => {
    onCheckedChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-bg-neutral-primary' : 'bg-gray-100',
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          'size-[22px] rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

export default Switch;
