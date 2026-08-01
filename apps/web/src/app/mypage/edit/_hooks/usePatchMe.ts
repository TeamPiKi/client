import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

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
      if (!isAxiosError(error) || !error.response) return;

      const { status } = error.response;

      if (status === 401 || status >= 500) return;

      /**
       * 400: 이미지 형식 오류
       * 403: 게스트는 프로필 이미지 변경 불가
       * 409: 중복 닉네임·탈퇴한 계정
       * 413: 이미지 용량 초과
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { patchMeMutation, isPatchMePending };
};
