import Basket from '@/components/common/basket';

import {
  type TournamentEmptyStateVariantProps,
  tournamentEmptyStateIconStyles,
  tournamentEmptyStateStyles,
  tournamentEmptyStateTextGroupStyles,
  tournamentEmptyStateTitleStyles,
} from './tournamentEmptyState.style';

type TournamentEmptyStateProps = TournamentEmptyStateVariantProps;

function TournamentEmptyState({ variant }: TournamentEmptyStateProps) {
  return (
    <div className={tournamentEmptyStateStyles({ variant })} role="status">
      <Basket type="confused" className={tournamentEmptyStateIconStyles({ variant })} />
      <div className={tournamentEmptyStateTextGroupStyles({ variant })}>
        <p className={tournamentEmptyStateTitleStyles({ variant })}>최근 토너먼트가 없어요</p>
        <p className="text-center body-1-medium text-text-neutral-tertiary">
          새 토너먼트를 만들거나
          <br />
          초대를 받아 시작해보세요.
        </p>
      </div>
    </div>
  );
}

export default TournamentEmptyState;
