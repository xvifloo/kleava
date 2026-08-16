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
 * TopRegion: Firmly anchored sticky top navigation area.
 */
export function TopRegion({ children, className, ...props }: ShellRegionProps) {
  return (
    <header
      role="banner"
      className={cn(
        'w-full shrink-0 z-40 sticky top-0',
        'pt-[env(safe-area-inset-top,0px)]',
        'h-12 sm:h-14 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}

/**
 * MainRegion: Fluid message canvas with independent scroll isolation.
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
 * BottomRegion: Interaction area holding the adaptive composer.
 * Raised with comfortable bottom padding for an elegant floating presence.
 */
export function BottomRegion({ children, className, ...props }: ShellRegionProps) {
  return (
    <footer
      role="region"
      aria-label="Interactive composer region"
      className={cn(
        'w-full shrink-0 z-30',
        'pb-4 sm:pb-6 md:pb-8 pt-2', // Lifted comfortably from bottom
        'flex flex-col items-center justify-end',
        className
      )}
      {...props}
    >
      {children}
    </footer>
  );
}

/**
 * ApplicationShell: Root 100dvh responsive shell.
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
          'px-3.5 sm:px-5 md:px-8',
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