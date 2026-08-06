import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchMe } from '../_apis/patchMe';

export const usePatchMe = () => {
  const queryClient = useQueryClient();

  const { mutate: patchMeMutation, isPending: isPatchMePending } = useMutation({
    mutationFn: ({ image, nickname }: { image?: File; nickname?: string }) => {
      const formData = new FormData();
      if (image) formData.append('image', image);
      if (nickname) formData.append('nickname', nickname);

      return patchMe(formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 400: 이미지 형식 오류
       * 403: 게스트는 프로필 이미지 변경 불가
       * 409: 중복 닉네임
       * 413: 이미지 용량 초과
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { patchMeMutation, isPatchMePending };
};
