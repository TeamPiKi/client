import { useEffect, useRef } from 'react';

const useIntersectionObserver = (onIntersect: () => void, enabled: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) onIntersect();
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return ref;
};

export default useIntersectionObserver;
