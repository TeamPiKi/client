import { cn } from '@/utils/cn';

type TypographyStyleRowT = {
  label: string;
  utilityClass: string;
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weightLabel: string;
};

const PREVIEW_TEXT = '때문에 고통 그 자체를 사랑하거나';

const TYPOGRAPHY_ROWS: TypographyStyleRowT[] = [
  {
    label: 'Title 1',
    utilityClass: 'title-1',
    size: '24px',
    lineHeight: '32px',
    letterSpacing: '-0.6px',
    weightLabel: 'Bold',
  },
  {
    label: 'Heading 1',
    utilityClass: 'heading-1',
    size: '20px',
    lineHeight: '28px',
    letterSpacing: '-0.6px',
    weightLabel: 'Bold',
  },
  {
    label: 'Heading 2',
    utilityClass: 'heading-2-semibold',
    size: '18px',
    lineHeight: '26px',
    letterSpacing: '-0.6px',
    weightLabel: 'Semibold',
  },
  {
    label: 'Heading 2',
    utilityClass: 'heading-2-medium',
    size: '18px',
    lineHeight: '26px',
    letterSpacing: '-0.6px',
    weightLabel: 'medium',
  },
  {
    label: 'Body1',
    utilityClass: 'body-1-bold',
    size: '16px',
    lineHeight: '22px',
    letterSpacing: '-0.6px',
    weightLabel: 'Bold',
  },
  {
    label: 'Body1',
    utilityClass: 'body-1-semibold',
    size: '16px',
    lineHeight: '22px',
    letterSpacing: '-0.6px',
    weightLabel: 'Semibold',
  },
  {
    label: 'Body1',
    utilityClass: 'body-1-medium',
    size: '16px',
    lineHeight: '22px',
    letterSpacing: '-0.6px',
    weightLabel: 'medium',
  },
  {
    label: 'Body2',
    utilityClass: 'body-2-semibold',
    size: '14px',
    lineHeight: '20px',
    letterSpacing: '-0.6px',
    weightLabel: 'Semibold',
  },
  {
    label: 'Body2',
    utilityClass: 'body-2-medium',
    size: '14px',
    lineHeight: '20px',
    letterSpacing: '-0.6px',
    weightLabel: 'medium',
  },
  {
    label: 'Body2',
    utilityClass: 'body-2-regular',
    size: '14px',
    lineHeight: '20px',
    letterSpacing: '-0.6px',
    weightLabel: 'regular',
  },
  {
    label: 'Caption1',
    utilityClass: 'caption-1-semibold',
    size: '12px',
    lineHeight: '18px',
    letterSpacing: '-0.4px',
    weightLabel: 'Semibold',
  },
  {
    label: 'Caption1',
    utilityClass: 'caption-1-regular',
    size: '12px',
    lineHeight: '18px',
    letterSpacing: '-0.4px',
    weightLabel: 'regular',
  },
];

type Props = {
  term: string;
  value: string;
};

function SpecItem({ term, value }: Props) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="caption-1-semibold text-[rgba(55,56,60,0.61)]">{term}</span>
      <span className="body-1-semibold text-[#171719]">{value}</span>
    </div>
  );
}

function TypographyPage() {
  return (
    <div className="text-black">
      <div className="mx-auto flex max-w-[min(100%,1392px)] flex-col gap-12 px-4 py-8 sm:gap-16 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <header>
          <h1 className="text-[28px] leading-[1.334] font-bold tracking-[-0.78px] text-black sm:text-[36px] sm:tracking-[-0.972px]">
            Typography
          </h1>
        </header>

        <section className="flex flex-col gap-8 sm:gap-16">
          <h2 className="text-[20px] leading-[1.334] font-bold tracking-[-0.45px] text-black sm:text-[24px] sm:tracking-[-0.552px]">
            Font
          </h2>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f7f7f8] p-6 sm:rounded-[24px] sm:p-12">
            <p className="w-full text-center text-[32px] leading-tight font-bold tracking-[-0.55px] text-black sm:text-5xl sm:tracking-[-0.85px] lg:text-[64px] lg:tracking-[-1.088px]">
              Pretendard 프리텐다드
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-10 sm:gap-16">
          <div className="h-0.5 w-full shrink-0 bg-[#dcdee2]" aria-hidden />
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <h2 className="shrink-0 text-[20px] leading-[1.334] font-bold tracking-[-0.45px] text-black sm:text-[24px] sm:tracking-[-0.552px] lg:max-w-[280px]">
              Style
            </h2>
            <p className="max-w-[720px] heading-2-semibold text-[#171719]">
              타이포그래피는 4단계 위계에서 총 12개 하위 위계를 가지고 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4 sm:gap-5">
              {TYPOGRAPHY_ROWS.map(row => (
                <li
                  key={row.utilityClass}
                  className="rounded-2xl border border-[rgba(112,115,124,0.22)] bg-white p-4 sm:p-5 lg:rounded-3xl lg:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-1 border-b border-[rgba(112,115,124,0.15)] pb-4 lg:border-b-0 lg:pb-0">
                        <p className={cn('text-[#171719]', row.utilityClass)}>{row.label}</p>
                        <p className="font-mono caption-1-regular text-[rgba(55,56,60,0.61)]">
                          {row.utilityClass}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-[520px]">
                        <SpecItem term="크기" value={row.size} />
                        <SpecItem term="행간" value={row.lineHeight} />
                        <SpecItem term="자간" value={row.letterSpacing} />
                        <SpecItem term="두께" value={row.weightLabel} />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 border-t border-[rgba(112,115,124,0.15)] pt-4 lg:border-t-0 lg:pt-0">
                      <p className="caption-1-semibold text-[rgba(55,56,60,0.61)]">미리보기</p>
                      <p className={cn('wrap-break-word text-[#171719]', row.utilityClass)}>
                        {PREVIEW_TEXT}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TypographyPage;
