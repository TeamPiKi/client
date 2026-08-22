import axios from 'axios';

import type { PresignedImageUploadT } from '@/types/image';
import { createS3UploadError } from '@/utils/apiError';

export const putImageToS3 = async (upload: PresignedImageUploadT, file: File) => {
  try {
    await axios.put(upload.uploadUrl, file, {
      headers: { 'Content-Type': upload.contentType },
    });
  } catch (error) {
    throw createS3UploadError(error);
  }
};
