'use client';

import React from 'react';
import Image from 'next/image';
import { Settings, UserPlus } from 'lucide-react';
import { UserProfile as UserProfileType } from '@/types';
import { cn } from '@/lib/utils';

export interface UserProfileProps {
  user?: UserProfileType;
  onOpenSettings: () => void;
  onSignIn?: () => void;
  className?: string;
}

/**
 * UserProfile: Bottom-anchored user profile and account area for Kleava AI.
 * Displays user avatar (or initial fallback), display name, workspace badge,
 * and an independent settings trigger with safe event propagation.
 */
export function UserProfile({
  user,
  onOpenSettings,
  onSignIn,
  className,
}: UserProfileProps) {
  // Logged-out state foundation
  if (!user) {
    return (
      <button
        type="button"
        aria-label="Sign in to your account"
        onClick={onSignIn}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-kleava-md select-none',
          'bg-kleava-surface-light/50 border border-kleava-border-subtle/60 text-xs',
          'hover:bg-kleava-surface-light hover:border-kleava-accent/30 transition-colors',
          'focus-ring-kleava',
          className
        )}
      >
        <div className="flex items-center space-x-2 text-kleava-text-secondary">
          <UserPlus className="w-3.5 h-3.5 text-kleava-accent" />
          <span className="font-medium text-kleava-text-primary">Sign in</span>
        </div>
        <span className="typography-metadata text-[10px] text-kleava-text-secondary uppercase">
          Guest
        </span>
      </button>
    );
  }

  const displayName = user.name || 'User';
  const displayPlan = user.plan || 'Workspace';
  const initial = displayName.charAt(0).toUpperCase();

  const handleRowClick = () => {
    onOpenSettings();
  };

  const handleSettingsButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid double execution if row is clicked
    onOpenSettings();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`User account for ${displayName}. Open settings.`}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenSettings();
        }
      }}
      className={cn(
        'group w-full flex items-center justify-between px-2.5 py-1.5 rounded-kleava-md select-none cursor-pointer',
        'bg-kleava-surface-light/40 border border-kleava-border-subtle/50',
        'hover:bg-kleava-surface-light hover:border-kleava-accent/30 transition-all duration-150',
        'focus-ring-kleava',
        className
      )}
    >
      {/* User Avatar and Information */}
      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
        {/* Avatar / Fallback Initial */}
        <div className="w-7 h-7 rounded-full bg-kleava-surface-soft border border-kleava-border-subtle flex items-center justify-center text-kleava-text-primary text-xs font-semibold flex-shrink-0 overflow-hidden relative shadow-xs">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={displayName}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : (
            <span className="text-kleava-text-primary leading-none">{initial}</span>
          )}
        </div>

        {/* Name and Workspace Badge */}
        <div className="flex flex-col min-w-0">
          <span className="typography-label text-xs font-medium truncate text-kleava-text-primary leading-tight">
            {displayName}
          </span>
          <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
            {displayPlan}
          </span>
        </div>
      </div>

      {/* Independent Settings Gear Button */}
      <button
        type="button"
        aria-label="Open settings"
        onClick={handleSettingsButtonClick}
        className={cn(
          'w-7 h-7 rounded-kleava-sm flex items-center justify-center flex-shrink-0',
          'text-kleava-text-secondary hover:text-kleava-accent',
          'hover:bg-kleava-surface-soft transition-colors active:scale-95',
          'focus-ring-kleava'
        )}
      >
        <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
      </button>
    </div>
  );
}

export default UserProfile;