export type SizeVariantT = 'sm' | 'lg';

export const SIZE_STYLE: Record<
  SizeVariantT,
  { dimension: number; radius: string; decoration: string }
> = {
  lg: {
    dimension: 200,
    radius: 'rounded-[12px]',
    decoration: '',
  },
  sm: {
    dimension: 68,
    radius: 'rounded-[16px]',
    decoration: 'border-[2px] border-white shadow-[0_0_8px_rgba(0,0,0,0.16)]',
  },
};
