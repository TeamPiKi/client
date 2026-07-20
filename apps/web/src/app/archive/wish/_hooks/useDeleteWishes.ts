import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteWishes } from '../_apis/deleteWishes';

export const useDeleteWishes = (options?: { onSuccess?: () => void }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();
  const { mutate: deleteWishesMutation, isPending: isDeleteWishesPending } = useMutation({
    mutationFn: (wishIds: number[]) => deleteWishes(wishIds),
    onSuccess: (_, wishIds) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      wishIds.forEach(wishId => {
        queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      });
      setSelectedIds(new Set());
      options?.onSuccess?.();
      toast.success('선택한 위시를 삭제했어요');
    },
  });

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (allIds: number[]) => {
    setSelectedIds(new Set(allIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteWishes = () => {
    if (selectedIds.size === 0) return;
    deleteWishesMutation(Array.from(selectedIds));
  };

  return {
    selectedIds,
    isDeleteWishesPending,
    handleToggleSelect,
    handleSelectAll,
    handleClearSelection,
    handleDeleteWishes,
  };
};
