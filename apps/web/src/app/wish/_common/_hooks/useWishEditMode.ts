import { useState } from 'react';

import { WISH_MODE } from '../_consts/wishMode';
import type { WishModeT } from '../_types/wishMode';

export const useWishEditMode = () => {
  const [mode, setMode] = useState<WishModeT>(WISH_MODE.DEFAULT);
  const [selectedWishIds, setSelectedWishIds] = useState<Set<number>>(new Set());

  const handleToggleSelect = (wishId: number) => {
    setSelectedWishIds(prev => {
      const next = new Set(prev);
      if (next.has(wishId)) next.delete(wishId);
      else next.add(wishId);
      return next;
    });
  };

  const handleClearSelection = () => setSelectedWishIds(new Set());

  const handleEnterEditMode = () => setMode(WISH_MODE.EDIT);

  const handleExitEditMode = () => {
    setMode(WISH_MODE.DEFAULT);
    handleClearSelection();
  };

  return {
    mode,
    selectedWishIds,
    handleToggleSelect,
    handleClearSelection,
    handleEnterEditMode,
    handleExitEditMode,
  };
};
