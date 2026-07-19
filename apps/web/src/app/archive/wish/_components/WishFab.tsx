'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import AddIconFill from '@/assets/icons/fill/add.svg';
import Button from '@/components/button';

import FabMenu from './FabMenu';

type WishFabProps = {
  onAddItem: () => void;
  onDelete: () => void;
};

function WishFab({ onAddItem, onDelete }: WishFabProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleAddItem = () => {
    setIsOpen(false);
    onAddItem();
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-20 bg-black/20" onClick={() => setIsOpen(false)} />,
          document.body
        )}
      <div className="relative z-30">
        {isOpen && <FabMenu onAddItem={handleAddItem} onDelete={handleDelete} />}
        <Button
          variant="primary"
          size="xl"
          icon="only"
          onClick={handleToggle}
          aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <AddIconFill width={33.101} height={33.101} />
        </Button>
      </div>
    </>
  );
}

export default WishFab;
