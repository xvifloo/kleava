'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { UserProfile as UserProfileType } from '@/types';
import { cn } from '@/lib/utils';

export interface UserProfileProps {
  user?: UserProfileType;
  onOpenSettings: () => void;
  className?: string;
}

/**
 * UserProfile: Bottom-anchored user badge featuring a circular avatar,
 * truncated name, plan metadata, and an accessible settings trigger.
 */
export function UserProfile({ user, onOpenSettings, className }: UserProfileProps) {
  const displayName = user?.name || 'Guest User';
  const displayPlan = user?.plan || 'Workspace';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'w-full flex items-center justify-between px-2 py-1.5 rounded-kleava-md',
        'bg-kleava-surface-light/40 border border-kleava-border-subtle/50',
        'transition-colors duration-150',
        className
      )}
    >
      {/* User Information */}
      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-kleava-surface-soft border border-kleava-accent/30 flex items-center justify-center text-kleava-text-primary text-xs font-medium flex-shrink-0 select-none">
          {initial}
        </div>

        {/* Name & Plan Meta */}
        <div className="flex flex-col min-w-0">
          <span className="typography-label text-xs font-medium truncate text-kleava-text-primary">
            {displayName}
          </span>
          <span className="typography-metadata text-[10px] text-kleava-text-secondary">
            {displayPlan}
          </span>
        </div>
      </div>

      {/* Settings Gear Button */}
      <button
        type="button"
        aria-label="Open settings"
        onClick={onOpenSettings}
        className={cn(
          'w-7 h-7 rounded-kleava-sm flex items-center justify-center',
          'text-kleava-text-secondary hover:text-kleava-accent',
          'hover:bg-kleava-surface-soft transition-all duration-150 active:scale-95',
          'focus-ring-kleava flex-shrink-0'
        )}
      >
        <Settings className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default UserProfile;