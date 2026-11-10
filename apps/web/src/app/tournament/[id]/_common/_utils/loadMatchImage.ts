import { getImageProps } from 'next/image';

import { PRODUCT_CARD_IMAGE_SIZES } from '../_consts/image';

const pendingImages = new Set<HTMLImageElement>();

export const loadMatchImage = (imageUrl: string, fetchPriority: 'high' | 'low') =>
  new Promise<boolean>(resolve => {
    const { props } = getImageProps({
      src: imageUrl,
      /** NOTE: 프리로드 시에는 alt 값이 필요없으므로 빈 string으로 저장. 토너먼트에서는 alt=상품명으로 주입 */
      alt: '',
      fill: true,
      sizes: PRODUCT_CARD_IMAGE_SIZES,
    });

    const image = new Image();
    image.fetchPriority = fetchPriority;

    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;

    const settle = (isLoaded: boolean) => {
      pendingImages.delete(image);
      resolve(isLoaded);
    };
    image.onload = () => settle(true);
    image.onerror = () => settle(false);

    pendingImages.add(image);
    image.src = props.src;
  });
