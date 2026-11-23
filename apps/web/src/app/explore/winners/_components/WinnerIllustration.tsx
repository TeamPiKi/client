import BlueCharacter from '../_assets/blue-character.svg';
import YellowCharacter from '../_assets/yellow-character.svg';

/** 캐릭터 하단이 잘린 채로 노출되는 장식 일러스트 */
function WinnerIllustration() {
  return (
    <div aria-hidden className="relative h-[61px] w-[100px] shrink-0 overflow-hidden">
      <BlueCharacter className="absolute top-[13.58px] left-[37.21px]" />
      <YellowCharacter className="absolute top-[28.53px] left-[8.62px]" />
    </div>
  );
}

export default WinnerIllustration;
