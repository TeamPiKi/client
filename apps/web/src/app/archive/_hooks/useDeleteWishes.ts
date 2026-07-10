import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteWishes } from '../_apis/deleteWishes';

export const useWishlistDelete = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const queryClient = useQueryClient();
  const { mutate: deleteWishesMutation, isPending: isDeleteWishesPending } = useMutation({
    mutationFn: (wishIds: number[]) => deleteWishes(wishIds),
    onSuccess: (_, wishIds) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      wishIds.forEach(wishId => {
        queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      });
      toast.success('선택한 위시를 삭제했어요');
    },
  });

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      deleteWishesMutation(Array.from(selectedIds));
    } finally {
      setSelectedIds(new Set());
      setIsDeleteMode(false);
    }
  };

  return {
    isDeleteMode,
    selectedIds,
    isDeleteWishesPending,
    handleEnterDeleteMode,
    handleToggleSelect,
    handleConfirmDelete,
  };
};
