'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';
import { getScrollContainer } from '@/utils/scrollRestoration';

/** 제목 높이 28 + 아래 간격 24 */
const TITLE_HEIGHT_WITH_GAP = 52;

type CollapsibleTitleProps = {
  children: React.ReactNode;
};

/** NOTE: 부모는 gap-6 세로 flex 여야 함 */
function CollapsibleTitle({ children }: CollapsibleTitleProps) {
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
      <h1 className="min-h-0 overflow-hidden heading-1-bold text-text-neutral-primary">
        {children}
      </h1>
    </div>
  );
}

export default CollapsibleTitle;
