import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@/utils/cn';

import { inputStyles } from './input.style';

type InputStatusT = 'default' | 'error' | 'disabled';

type InputProps = {
  label?: string;
  helperText?: string;
  left?: ReactNode;
  right?: ReactNode;
} & ComponentProps<'input'>;

function Input({
  label,
  helperText,
  left,
  right,
  id,
  disabled,
  'aria-invalid': ariaInvalid,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperTextId = `${inputId}-helper`;

  let status: InputStatusT = 'default';
  if (disabled) status = 'disabled';
  else if (ariaInvalid) status = 'error';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="body-2-semibold text-gray-950">
          {label}
        </label>
      )}
      <div className={cn(inputStyles({ status }))}>
        {left && <span className="shrink-0 text-gray-300">{left}</span>}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          {...(helperText ? { 'aria-describedby': helperTextId } : {})}
          className={cn(
            'w-full overflow-hidden bg-transparent body-1-medium text-ellipsis whitespace-nowrap text-gray-600 outline-none placeholder:text-text-neutral-tertiary focus:text-gray-900 disabled:text-gray-300',
            className
          )}
          {...props}
        />
        {right && <span className="shrink-0 text-gray-300">{right}</span>}
      </div>

      {helperText && (
        <p
          id={helperTextId}
          className={cn('body-2-regular', status === 'error' ? 'text-red-600' : 'text-gray-300')}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
