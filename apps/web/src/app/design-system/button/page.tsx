import Button from '@/components/button';

const SIZES = ['sm', 'md', 'lg'] as const;
const VARIANTS = ['primary', 'secondary'] as const;
const STATES = ['default', 'disabled', 'pressed'] as const;

type SizeT = (typeof SIZES)[number];
type VariantT = (typeof VARIANTS)[number];
type StateT = (typeof STATES)[number];

type StateProps = {
  disabled?: boolean;
  'data-force-active'?: boolean;
};

const stateToProps = (state: StateT): StateProps => {
  if (state === 'disabled') return { disabled: true };
  if (state === 'pressed') return { 'data-force-active': true };
  return {};
};

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M10 2.5V5M10 15V17.5M4.6967 4.6967L6.46447 6.46447M13.5355 13.5355L15.3033 15.3033M2.5 10H5M15 10H17.5M4.6967 15.3033L6.46447 13.5355M13.5355 6.46447L15.3033 4.6967"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PlusIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PLUS_ICON_SIZE: Record<SizeT, number> = {
  sm: 20,
  md: 24,
  lg: 30,
};

type ButtonCellProps = {
  size: SizeT;
  variant: VariantT;
  state: StateT;
  icon: 'none' | 'leading' | 'only';
};

const pressedClassName = (variant: VariantT) => {
  if (variant === 'primary') return 'pointer-events-none bg-gray-400 border-gray-400';
  return 'pointer-events-none bg-gray-50 border-border-neutral-muted text-text-neutral-tertiary';
};

function ButtonCell({ size, variant, state, icon }: ButtonCellProps) {
  const props = stateToProps(state);
  const isPressed = state === 'pressed';
  const pressedOverride = isPressed ? pressedClassName(variant) : '';

  if (icon === 'only') {
    return (
      <Button size={size} variant={variant} icon="only" className={pressedOverride} {...props}>
        <PlusIcon size={PLUS_ICON_SIZE[size]} />
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      icon={icon}
      {...(icon === 'leading' ? { leadingIcon: <LoaderIcon /> } : {})}
      className={pressedOverride}
      {...props}
    >
      Button CTA
    </Button>
  );
}

type SectionProps = {
  title: string;
  icon: 'none' | 'leading';
};

function ButtonMatrix({ title, icon }: SectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="heading-2-semibold text-text-neutral-primary">{title}</h2>
      <div className="flex flex-col gap-8">
        {VARIANTS.map(variant => (
          <div key={variant} className="flex flex-col gap-3">
            <h3 className="body-2-semibold text-text-neutral-secondary capitalize">{variant}</h3>
            <div className="grid grid-cols-[80px_auto_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4">
              <span className="caption-1-regular text-text-neutral-secondary">state ↓ size →</span>
              {SIZES.map(size => (
                <span
                  key={size}
                  className="text-center caption-1-regular text-text-neutral-secondary"
                >
                  {size}
                </span>
              ))}
              {STATES.map(state => (
                <div key={state} className="contents">
                  <span className="caption-1-regular text-text-neutral-secondary">{state}</span>
                  {SIZES.map(size => (
                    <div key={size} className="flex justify-start">
                      <ButtonCell size={size} variant={variant} state={state} icon={icon} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ButtonIconOnlyMatrix() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="heading-2-semibold text-text-neutral-primary">
        Icon Only (Primary · Default)
      </h2>
      <div className="flex items-center gap-6">
        {SIZES.map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <ButtonCell size={size} variant="primary" state="default" icon="only" />
            <span className="caption-1-regular text-text-neutral-secondary">{size}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ButtonDocsPage() {
  return (
    <div className="text-black">
      <div className="mx-auto flex max-w-[min(100%,960px)] flex-col gap-12 px-4 py-8 sm:gap-16 sm:px-6 sm:py-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-[1.334] font-bold tracking-[-0.78px] text-text-neutral-primary sm:text-[36px]">
            Button
          </h1>
          <p className="body-2-regular text-text-neutral-secondary">
            size × variant × state 매트릭스
          </p>
        </header>

        <ButtonMatrix title="Icon: None" icon="none" />
        <ButtonMatrix title="Icon: Leading" icon="leading" />
        <ButtonIconOnlyMatrix />
      </div>
    </div>
  );
}

export default ButtonDocsPage;
