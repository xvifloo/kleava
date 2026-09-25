'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface NavTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

/**
 * NavTrigger: 38x38px Two-Dot Morphing Control.
 * Solid pure white (#FFFFFF) surface without blur or glassmorphism.
 */
export const NavTrigger = forwardRef<HTMLButtonElement, NavTriggerProps>(
  ({ isOpen: controlledIsOpen, onToggle, className, ...props }, ref) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const open = isControlled ? controlledIsOpen : internalIsOpen;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextState = !open;
      if (!isControlled) {
        setInternalIsOpen(nextState);
      }
      onToggle?.(nextState);
      props.onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={handleClick}
        className={cn(
          // 38x38 circular control with 25px radius
          'relative w-[38px] h-[38px] min-w-[38px] min-h-[38px] rounded-kleava-control shrink-0',
          'flex items-center justify-center select-none border-0 outline-none ring-0',
          // Solid Pure White (#FFFFFF) in Light, Solid Dark (#151F1C) in Dark (NO BLUR)
          'bg-white dark:bg-[#151F1C] text-kleava-accent',
          'shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
          'transition-all duration-200 ease-out',
          'hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
          className
        )}
        {...props}
      >
        {/* Centered Dot Morph Canvas */}
        <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
          {/* Dot 1 */}
          <span
            className={cn(
              'absolute w-1.5 h-1.5 rounded-full bg-kleava-accent',
              'will-change-transform transform-gpu',
              'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              open
                ? 'translate-x-0 -translate-y-[4.5px]' // Vertical Top
                : '-translate-x-[4.5px] translate-y-0'  // Horizontal Left
            )}
          />

          {/* Dot 2 */}
          <span
            className={cn(
              'absolute w-1.5 h-1.5 rounded-full bg-kleava-accent',
              'will-change-transform transform-gpu',
              'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              open
                ? 'translate-x-0 translate-y-[4.5px]'  // Vertical Bottom
                : 'translate-x-[4.5px] translate-y-0'   // Horizontal Right
            )}
          />
        </div>
      </button>
    );
  }
);

NavTrigger.displayName = 'NavTrigger';

export default NavTrigger;