import { useEffect, useState } from 'react';

// 위시 아이템 선택 상태 및 최대 선택 초과 토스트 노출 여부를 관리하는 훅
const useWishSelection = (maxSelect: number) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // isAtMax(계산값)와 분리: 초과 시도 시에만 true, 선택 해제 시 즉시 false
  const [isMaxExceeded, setIsMaxExceeded] = useState(false);

  const isAtMax = selectedIds.length >= maxSelect;

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
      setIsMaxExceeded(false);
      return;
    }
    if (isAtMax) {
      setIsMaxExceeded(true);
      return;
    }
    setSelectedIds(prev => [...prev, id]);
  };

  // 토스트 2초 후 자동 소멸
  useEffect(() => {
    if (!isMaxExceeded) return;
    const timer = setTimeout(() => setIsMaxExceeded(false), 2000);
    return () => clearTimeout(timer);
  }, [isMaxExceeded]);

  return { selectedIds, isMaxExceeded, isAtMax, handleSelect };
};

export default useWishSelection;
