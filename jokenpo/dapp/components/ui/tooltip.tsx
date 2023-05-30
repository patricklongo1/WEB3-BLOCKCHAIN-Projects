'use client'

import { cn } from '@/lib/utils'
import { Provider, Root, Trigger, Content } from '@radix-ui/react-tooltip'
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'

const TooltipProvider = Provider

const Tooltip = Root

const TooltipTrigger = Trigger

const TooltipContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
