import { FireIconFill, SandTimerIconFill, ShoppingBagIconFill } from '@/assets/icons/fill';
import { InfoIconOutline } from '@/assets/icons/outline';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';

const GUIDE_ITEMS = [
  { icon: SandTimerIconFill, text: '담기 시간이 지나면 후보를 추가할 수 없어요.' },
  { icon: FireIconFill, text: '주최자가 먼저 마감하면 토너먼트가 바로 시작돼요.' },
  { icon: ShoppingBagIconFill, text: '담긴 후보 수에 따라 토너먼트 라운드가 결정돼요.' },
];

function TournamentGuidePopover() {
  return (
    <Popover>
      <PopoverTrigger aria-label="안내">
        <InfoIconOutline className="size-6 text-icon-neutral-secondary" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={25}
        className="w-[calc(100vw-2.5rem)] max-w-[440px] gap-4 p-5"
      >
        <h2 className="heading-1">토너먼트 진행 가이드</h2>
        <ul className="flex flex-col gap-2">
          {GUIDE_ITEMS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <Icon className="size-6 shrink-0 text-icon-accent" aria-hidden />
              <p className="body-1-medium text-text-neutral-secondary">{text}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default TournamentGuidePopover;
