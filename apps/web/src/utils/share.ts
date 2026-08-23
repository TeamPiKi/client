type ShareDataT = {
  title?: string;
  text?: string;
  url?: string;
};

const canUseWebShare = (data: ShareDataT) => {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) return false;
  return true;
};

export const copyToClipboard = async (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error('Clipboard API unavailable');
};

type ShareResultT = 'shared' | 'copied' | 'cancelled' | 'failed';

export const share = async (data: ShareDataT): Promise<ShareResultT> => {
  if (canUseWebShare(data)) {
    try {
      await navigator.share(data);
      return 'shared';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled';
      // Web Share 실패 시 clipboard로 fallback
    }
  }

  const fallbackText = data.url ?? data.text ?? '';
  if (!fallbackText) return 'failed';

  try {
    await copyToClipboard(fallbackText);
    return 'copied';
  } catch {
    return 'failed';
  }
};
