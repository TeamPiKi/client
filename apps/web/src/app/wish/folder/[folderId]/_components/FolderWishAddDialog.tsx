'use client';

import { useState } from 'react';

import { HeartIconFill, ImageIconFill, LinkIconFill } from '@/assets/icons';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/dialog';
import ByImageDialog from '@/components/get-item-dialog/ByImageDialog';
import ByLinkDialog from '@/components/get-item-dialog/ByLinkDialog';
import OptionButton from '@/components/get-item-dialog/OptionButton';
import { ROUTES } from '@/consts/route';

type FolderWishAddDialogProps = {
  folderId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** TODO: 링크·이미지로 담은 위시를 이 폴더에도 저장하는 API 연결 */
function FolderWishAddDialog({ folderId, open, onOpenChange }: FolderWishAddDialogProps) {
  const [subDialog, setSubDialog] = useState<'link' | 'image' | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="flex flex-col gap-[15px]">
          <DialogTitle className="text-center heading-1-bold text-text-neutral-primary">
            폴더에 위시 추가
          </DialogTitle>
          <DialogDescription className="sr-only">
            저장한 위시, 링크, 이미지 중 하나를 선택해 폴더에 위시를 추가합니다.
          </DialogDescription>
          <ul className="flex w-full flex-col gap-2">
            <OptionButton
              href={ROUTES.WISHLIST_FOLDER_ADD(folderId)}
              label="내 위시에서 가져오기"
              description="전체 위시에서 골라 이 폴더에 담아요"
              Icon={HeartIconFill}
            />
            <OptionButton
              label="링크로 담기"
              description="전체 위시에도 저장돼요"
              Icon={LinkIconFill}
              onClick={() => setSubDialog('link')}
            />
            <OptionButton
              label="이미지로 담기"
              description="전체 위시에도 저장돼요"
              Icon={ImageIconFill}
              onClick={() => setSubDialog('image')}
            />
          </ul>
        </DialogContent>
      </Dialog>

      <ByLinkDialog
        type="wish"
        folderId={folderId}
        open={subDialog === 'link'}
        onOpenChange={isOpen => setSubDialog(isOpen ? 'link' : null)}
      />
      <ByImageDialog
        type="wish"
        folderId={folderId}
        open={subDialog === 'image'}
        onOpenChange={isOpen => setSubDialog(isOpen ? 'image' : null)}
      />
    </>
  );
}

export default FolderWishAddDialog;
