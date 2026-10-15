'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { getScrollContainer } from '@/utils/scrollRestoration';

import { WISH_TAB, WISH_TAB_PANEL_ID } from '../_consts/wishTab';
import type { WishTabT } from '../_types/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';
import AllWishTabContent from './AllWishTabContent';
import FolderTabContent from './FolderTabContent';

function WishTabContent() {
  const searchParams = useSearchParams();
  const activeTab = parseWishTabParam(searchParams.get('tab'));

  /** 탭별 스크롤 위치*/
  const scrollTopByTabRef = useRef<Partial<Record<WishTabT, number>>>({});
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    const scroller = getScrollContainer();
    if (!scroller) return;

    const handleScroll = () => {
      scrollTopByTabRef.current[activeTabRef.current] = scroller.scrollTop;
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  /** 탭별 스크롤 위치 복원. 첫 진입 시에는 생략 */
  useLayoutEffect(() => {
    if (activeTabRef.current === activeTab) return;

    activeTabRef.current = activeTab;
    const scroller = getScrollContainer();
    if (scroller) scroller.scrollTop = scrollTopByTabRef.current[activeTab] ?? 0;
  }, [activeTab]);

  return (
    <div id={WISH_TAB_PANEL_ID} role="tabpanel" aria-labelledby={`wish-tab-${activeTab}`}>
      {activeTab === WISH_TAB.FOLDER ? <FolderTabContent /> : <AllWishTabContent />}
    </div>
  );
}

export default WishTabContent;
