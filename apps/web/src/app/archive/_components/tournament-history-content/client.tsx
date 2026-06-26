'use client';

import BottomTabBar from '@/components/bottom-tab-bar';

import TournamentHistoryList from '../TournamentHistoryList';

function TournamentHistoryContentClient() {
  return (
    <>
      <TournamentHistoryList />
      <div className="fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <BottomTabBar />
      </div>
    </>
  );
}

export default TournamentHistoryContentClient;
