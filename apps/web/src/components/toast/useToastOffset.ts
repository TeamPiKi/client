'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

type ToastOffsetStoreT = {
  overrides: { id: number; offset: string }[];
  pushOverride: (id: number, offset: string) => void;
  removeOverride: (id: number) => void;
};

/**
 * 토스트 offset override 스택.
 * 하단 고정 UI(탭바 등)를 렌더하는 컴포넌트가 여러 개 동시에 등록해도,
 * 하나가 언마운트되면 남은 등록이 유지되도록 배열로 관리한다.
 */
export const useToastOffsetStore = create<ToastOffsetStoreT>(set => ({
  overrides: [],
  pushOverride: (id, offset) => set(state => ({ overrides: [...state.overrides, { id, offset }] })),
  removeOverride: id =>
    set(state => ({ overrides: state.overrides.filter(override => override.id !== id) })),
}));

let nextOverrideId = 0;

/** 마운트 동안 토스트 offset을 override. 언마운트 시 자동 해제. */
export const useToastOffset = (offset: string) => {
  const pushOverride = useToastOffsetStore(state => state.pushOverride);
  const removeOverride = useToastOffsetStore(state => state.removeOverride);

  useEffect(() => {
    const id = nextOverrideId++;
    pushOverride(id, offset);
    return () => removeOverride(id);
  }, [offset, pushOverride, removeOverride]);
};
