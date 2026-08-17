'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Settings, LogOut, LogIn, UserPlus, Shield } from 'lucide-react';
import { UserProfile as UserProfileType } from '@/types';
import { AuthModal } from '@/components/layout/auth-modal';
import { cn } from '@/lib/utils';

export interface UserProfileProps {
  user?: UserProfileType | null;
  onOpenSettings: () => void;
  onLogin?: (user: UserProfileType) => void;
  onLogout?: () => void;
  className?: string;
}

/**
 * UserProfile: Borderless bottom profile row with an organic floating glass popup
 * providing User details, Settings trigger, Login, and Logout actions.
 */
export function UserProfile({
  user,
  onOpenSettings,
  onLogin,
  onLogout,
  className,
}: UserProfileProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click or Escape (moving mouse away does NOT close it)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPopupOpen) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen]);

  const displayName = user?.name || 'Guest User';
  const displayPlan = user?.plan || (user ? 'Workspace' : 'Free');
  const initial = (user?.name || 'G').charAt(0).toUpperCase();

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(false);
    onOpenSettings();
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(false);
    onLogout?.();
  };

  return (
    <div className="relative w-full font-ui select-none" ref={profileRef}>
      {/* 1. Interactive Borderless Profile Row */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`User account: ${displayName}. Click to open profile menu.`}
        aria-expanded={isPopupOpen}
        onClick={() => setIsPopupOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsPopupOpen((prev) => !prev);
          }
        }}
        className={cn(
          'w-full flex items-center justify-between px-2 py-1.5 rounded-kleava-md cursor-pointer border-0 outline-none ring-0',
          'bg-transparent hover:bg-kleava-surface-soft/80 dark:hover:bg-[#1E2A27]/80 transition-all duration-150',
          isPopupOpen && 'bg-kleava-surface-soft dark:bg-[#1E2A27]',
          className
        )}
      >
        {/* User Info / Avatar */}
        <div className="flex items-center space-x-2.5 min-w-0 pr-1">
          <div className="w-7 h-7 rounded-full bg-kleava-surface-soft dark:bg-[#1E2A27] border border-kleava-border-subtle/50 flex items-center justify-center text-kleava-text-primary text-xs font-semibold shrink-0 overflow-hidden relative shadow-2xs">
            {user?.avatarUrl ? (
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

          <div className="flex flex-col min-w-0">
            <span className="typography-label text-xs font-medium truncate text-kleava-text-primary leading-tight">
              {displayName}
            </span>
            <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
              {user ? displayPlan : 'Click to Sign in'}
            </span>
          </div>
        </div>

        {/* Minimal Borderless Gear Button */}
        <button
          type="button"
          aria-label="Open settings"
          onClick={handleSettingsClick}
          className={cn(
            'w-7 h-7 rounded-kleava-sm flex items-center justify-center shrink-0 border-0 outline-none',
            'text-kleava-text-secondary hover:text-kleava-accent',
            'hover:bg-kleava-surface-light dark:hover:bg-[#253531] transition-colors active:scale-95',
            'focus-ring-kleava'
          )}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Floating Glass Profile Popup (Docked above profile row, z-50) */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-label="Profile and account actions"
          className={cn(
            'absolute bottom-11 left-0 z-50 min-w-[220px] max-w-[260px]',
            'bg-kleava-surface/95 dark:bg-[#151F1C]/95 backdrop-blur-xl',
            'text-kleava-text-primary rounded-kleava-lg border border-kleava-border-subtle/30',
            'shadow-kleava-floating p-2 flex flex-col space-y-1.5',
            'transform-gpu origin-bottom-left',
            'animate-in fade-in zoom-in-95 duration-200 ease-out'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {user ? (
            /* Logged-In State View */
            <>
              <div className="px-2 py-1.5 rounded-kleava-sm bg-kleava-surface-light/40 dark:bg-[#1E2A27]/40 flex flex-col">
                <span className="typography-label text-xs font-semibold text-kleava-text-primary truncate">
                  {user.name}
                </span>
                <span className="typography-metadata text-[10.5px] text-kleava-text-secondary truncate mt-0.5">
                  {user.email}
                </span>
                {user.plan && (
                  <span className="mt-1 self-start typography-metadata text-[9px] uppercase px-1.5 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-semibold">
                    {user.plan}
                  </span>
                )}
              </div>

              {/* Action Rows */}
              <div className="flex flex-col space-y-0.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27] transition-colors focus-ring-kleava"
                >
                  <Settings className="w-3.5 h-3.5 text-kleava-text-secondary" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-kleava-sm text-left typography-label text-xs text-kleava-destructive hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-ring-kleava"
                >
                  <LogOut className="w-3.5 h-3.5 text-kleava-destructive" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            /* Logged-Out State View */
            <>
              <div className="px-2 py-1 flex flex-col">
                <span className="typography-label text-xs font-semibold text-kleava-text-primary">
                  Welcome to Kleava
                </span>
                <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5">
                  Sign in to sync your workspace and memories.
                </span>
              </div>

              <div className="flex flex-col space-y-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setAuthModalMode('signin');
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-kleava-sm text-xs font-medium bg-kleava-accent text-white hover:opacity-90 transition-opacity focus-ring-kleava shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setAuthModalMode('signup');
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-kleava-sm text-xs font-medium bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary hover:bg-kleava-surface-light transition-colors focus-ring-kleava"
                >
                  <UserPlus className="w-3.5 h-3.5 text-kleava-text-secondary" />
                  <span>Sign Up</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={Boolean(authModalMode)}
        initialMode={authModalMode || 'signin'}
        onClose={() => setAuthModalMode(null)}
        onSuccess={(newUser) => onLogin?.(newUser)}
      />
    </div>
  );
}

export default UserProfile;