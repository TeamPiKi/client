'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 bg-bg-layer-overlay data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0',
        className
      )}
      style={{ zIndex: Z_INDEX.DRAWER, ...props.style }}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content fixed flex h-auto w-full flex-col rounded-t-[20px] bg-white data-[vaul-drawer-direction=bottom]:right-safe-right data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:left-safe-left data-[vaul-drawer-direction=bottom]:mx-auto data-[vaul-drawer-direction=bottom]:w-auto data-[vaul-drawer-direction=bottom]:max-w-120',
          className
        )}
        style={{ zIndex: Z_INDEX.DRAWER, ...props.style }}
        {...props}
      >
        <div className="mx-auto mt-3 hidden h-1 w-9 shrink-0 rounded-full bg-gray-200 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        <div className="p-5">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center',
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={className} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return <DrawerPrimitive.Title data-slot="drawer-title" className={className} {...props} />;
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description data-slot="drawer-description" className={className} {...props} />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
