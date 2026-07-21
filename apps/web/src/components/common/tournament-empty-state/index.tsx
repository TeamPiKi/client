import BasketEmptyIcon from '@/assets/images/basket-empty.svg';

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
      <BasketEmptyIcon className={tournamentEmptyStateIconStyles({ variant })} aria-hidden />
      <div className={tournamentEmptyStateTextGroupStyles({ variant })}>
        <p className={tournamentEmptyStateTitleStyles({ variant })}>
          최근 생성한 토너먼트가 없어요
        </p>
        <p className="body-1-medium text-center text-text-neutral-tertiary">
          새 토너먼트를 만들거나
          <br />
          초대를 받아 시작해보세요.
        </p>
      </div>
    </div>
  );
}

export default TournamentEmptyState;
