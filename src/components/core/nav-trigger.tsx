'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface NavTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

/**
 * NavTrigger: Kleava 38x38px Two-Dot Morphing Navigation Control.
 * Transforms smoothly between Horizontal (● ●) and Vertical (:) orientations.
 */
export function NavTrigger({
  isOpen: controlledIsOpen,
  onToggle,
  className,
  ...props
}: NavTriggerProps) {
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
      type="button"
      role="button"
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      aria-expanded={open}
      onClick={handleClick}
      className={cn(
        // Outer 38x38 rounded capsule/circular container with 25px radius
        'relative w-[38px] h-[38px] rounded-kleava-control',
        'bg-kleava-surface text-kleava-accent',
        'flex items-center justify-center select-none',
        'shadow-kleava-subtle border border-kleava-border-subtle/50',
        'transition-all duration-200 ease-out',
        // Hover & Active Micro-feedback
        'hover:bg-kleava-surface-light hover:border-kleava-accent/30',
        'active:scale-[0.96] active:bg-kleava-surface-soft',
        // Accessible Focus Ring
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent focus-visible:ring-offset-2 focus-visible:ring-offset-kleava-bg',
        open && 'bg-kleava-surface-light/80 border-kleava-accent/40 shadow-sm',
        className
      )}
      {...props}
    >
      {/* Centered Dot Morph Canvas */}
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        {/* Dot 1 (Left in closed state -> Top in open state) */}
        <span
          className={cn(
            'absolute w-1.5 h-1.5 rounded-full bg-kleava-accent',
            'will-change-transform transform-gpu',
            'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'motion-reduce:transition-none',
            open
              ? 'translate-x-0 -translate-y-[4.5px]' // Vertical Top
              : '-translate-x-[4.5px] translate-y-0'  // Horizontal Left
          )}
        />

        {/* Dot 2 (Right in closed state -> Bottom in open state) */}
        <span
          className={cn(
            'absolute w-1.5 h-1.5 rounded-full bg-kleava-accent',
            'will-change-transform transform-gpu',
            'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'motion-reduce:transition-none',
            open
              ? 'translate-x-0 translate-y-[4.5px]'  // Vertical Bottom
              : 'translate-x-[4.5px] translate-y-0'   // Horizontal Right
          )}
        />
      </div>
    </button>
  );
}

export default NavTrigger;