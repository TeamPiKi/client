'use client';

import Image from 'next/image';

import { Dialog, DialogTrigger } from '@/components/dialog';
import GetItemDialogContent from '@/components/get-item-dialog';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';

import AddWishBg from '../_assets/add-wish-bg.png';

function AddWishHomeDialog() {
  const handleAddWishClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.WISH_ADD_START);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={handleAddWishClick}
          className="relative row-span-2 h-[220px] cursor-pointer overflow-hidden rounded-2xl bg-[#62c7ff]"
        >
          <Image src={AddWishBg} alt="위시 담기" width={197} height={242} className="mx-auto" />
          <span className="absolute top-[18px] left-[15px] heading-1 text-base-50">위시 담기</span>
        </button>
      </DialogTrigger>

      <GetItemDialogContent type="wish" />
    </Dialog>
  );
}

export default AddWishHomeDialog;
