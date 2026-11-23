'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';
import { getScrollContainer } from '@/utils/scrollRestoration';

/** 제목 높이 28 + 아래 간격 24 */
const TITLE_HEIGHT_WITH_GAP = 52;

type CollapsibleTitleProps = {
  title: string;
  right?: React.ReactNode;
};

/** NOTE: 부모는 gap-6 세로 flex 여야 함 */
function CollapsibleTitle({ title, right }: CollapsibleTitleProps) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const scroller = getScrollContainer();
    if (!scroller) return;

    const handleScroll = () => {
      if (scroller.scrollTop > TITLE_HEIGHT_WITH_GAP) setIsHidden(true);
      else if (scroller.scrollTop <= 0) setIsHidden(false);
    };
    /** 편집 모드 등으로 다시 마운트돼도 현재 스크롤 위치에 맞게 시작함 */
    handleScroll();
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'grid transition-all duration-100',
        isHidden ? '-mb-6 grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]'
      )}
    >
      <div className="flex min-h-0 items-center justify-between overflow-hidden" inert={isHidden}>
        <h1 className="heading-1-bold text-text-neutral-primary">{title}</h1>
        {right}
      </div>
    </div>
  );
}

export default CollapsibleTitle;
