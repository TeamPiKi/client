import Onboarding1 from '../_assets/onboarding-1.svg';
import Onboarding2 from '../_assets/onboarding-2.svg';
import Onboarding3Android from '../_assets/onboarding-3-android.svg';
import Onboarding3Ios from '../_assets/onboarding-3-ios.svg';

export const getOnboardingSlides = (isAndroid: boolean) => [
  {
    title: '쉽게 위시를 담아보세요',
    description: '구매하고 싶은 아이템의\n링크 공유를 눌러주세요',
    Illust: Onboarding1,
    illustClassName: 'top-0 left-[66px] h-[270px] w-[202px]',
  },
  {
    title: 'PiKi 아이콘을 눌러주세요',
    description: '앱을 따로 열지 않아도\nPiKi에 저장돼요',
    Illust: Onboarding2,
    illustClassName: 'top-0 left-[66px] h-[266px] w-[202px]',
  },
  isAndroid
    ? {
        title: '위시 저장 완료!',
        description: '저장된 위시는\n위시 탭에서 확인 가능해요',
        Illust: Onboarding3Android,
        illustClassName: 'top-[50.9px] left-[40.1px] h-[237px] w-[254px]',
      }
    : {
        title: '위시 저장 완료!',
        description: '저장된 위시는 위시 탭에서\n확인할 수 있어요',
        Illust: Onboarding3Ios,
        illustClassName: 'top-0 left-[66px] h-[270px] w-[202px]',
      },
];
