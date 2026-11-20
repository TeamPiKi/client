'use client';

import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import * as React from 'react';

import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        'relative cursor-pointer after:absolute after:top-1/2 after:left-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  style,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <>
      <DropdownMenuPrimitive.Portal>
        <div
          data-slot="dropdown-menu-overlay"
          aria-hidden
          className="fixed inset-0 isolate animate-in bg-bg-layer-overlay duration-100 fade-in-0"
          style={{ zIndex: Z_INDEX.DROPDOWN_MENU }}
        />
      </DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          data-slot="dropdown-menu-content"
          sideOffset={sideOffset}
          className={cn(
            'flex w-[191px] origin-(--radix-dropdown-menu-content-transform-origin) flex-col rounded-2xl bg-bg-layer-default p-2 text-text-neutral-primary shadow-[0_1px_8px_0_rgba(0,0,0,0.1)] outline-hidden duration-100 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          style={{ zIndex: Z_INDEX.DROPDOWN_MENU, ...style }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            onCloseAutoFocus?.(event);
          }}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    </>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-3 body-2-medium text-text-neutral-primary outline-none data-disabled:cursor-not-allowed data-disabled:text-text-neutral-tertiary data-highlighted:bg-bg-layer-basement [&_svg]:size-6 [&_svg]:shrink-0 [&_svg]:text-icon-neutral-primary data-disabled:[&_svg]:text-icon-neutral-secondary',
        className
      )}
      {...props}
    />
  );
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
