import Image from 'next/image';

import { InfoIconFill } from '@/assets/icons';
import ImageCropGuideImg from '@/assets/images/image-crop-guide.jpg';

function ImageCropGuide() {
  return (
    <div className="flex size-full flex-col">
      <div className="flex items-center gap-4 bg-gray-600 px-5 py-2.5">
        <InfoIconFill className="size-6 shrink-0 text-icon-neutral-inverse [&_rect]:fill-gray-600" />
        <p className="caption-1-regular text-text-neutral-inverse">
          이미지, 이름, 가격이 보이도록 잘라주세요.
          <br />
          모든 이미지를 확인하면 저장할 수 있어요.
        </p>
      </div>
      <div className="relative min-h-0 flex-1">
        <Image
          src={ImageCropGuideImg}
          alt="상품 이미지, 이름, 가격이 모두 들어가게 자른 예시"
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default ImageCropGuide;
