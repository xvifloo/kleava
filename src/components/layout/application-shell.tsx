import React from 'react';
import { cn } from '@/lib/utils';

export interface ApplicationShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxWidthClassName?: string;
}

export interface ShellRegionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

/**
 * TopRegion: Reserved composition area for header branding and navigation triggers.
 */
export function TopRegion({ children, className, ...props }: ShellRegionProps) {
  return (
    <header
      role="banner"
      className={cn(
        'w-full flex-shrink-0 z-30 pt-[env(safe-area-inset-top,0px)]',
        'h-14 md:h-16 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}

/**
 * MainRegion: Flexible, central content area for conversation flow and canvas content.
 */
export function MainRegion({ children, className, ...props }: ShellRegionProps) {
  return (
    <main
      role="main"
      className={cn(
        'w-full flex-1 flex flex-col min-h-0 relative',
        'overflow-y-auto overflow-x-hidden',
        'scrollbar-none focus:outline-none',
        className
      )}
      tabIndex={-1}
      {...props}
    >
      {children}
    </main>
  );
}

/**
 * BottomRegion: Reserved interaction area for composer input and action controls.
 */
export function BottomRegion({ children, className, ...props }: ShellRegionProps) {
  return (
    <footer
      role="region"
      aria-label="Interactive composer region"
      className={cn(
        'w-full flex-shrink-0 z-20 pb-[env(safe-area-inset-bottom,0px)]',
        'pt-2 pb-4 md:pb-6 flex flex-col items-center justify-end',
        className
      )}
      {...props}
    >
      {children}
    </footer>
  );
}

/**
 * ApplicationShell: Root responsive viewport container.
 * Enforces dynamic viewport bounds (100dvh), safe gutters, and fluid width limits.
 */
export function ApplicationShell({
  children,
  className,
  maxWidthClassName = 'max-w-[520px] md:max-w-[640px] lg:max-w-[768px]',
  ...props
}: ApplicationShellProps) {
  return (
    <div
      className={cn(
        'relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh]',
        'bg-kleava-bg text-kleava-text-primary font-ui',
        'flex flex-col items-center justify-between',
        'overflow-hidden select-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'w-full h-full flex flex-col relative',
          'px-5 sm:px-6 md:px-8',
          maxWidthClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

ApplicationShell.Top = TopRegion;
ApplicationShell.Main = MainRegion;
ApplicationShell.Bottom = BottomRegion;

export default ApplicationShell;