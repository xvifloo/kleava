'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pin, PinOff, Pencil, Archive, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatItemActionsProps {
  chatId: string;
  chatTitle: string;
  isPinned: boolean;
  isOpen: boolean;
  onOpenToggle: (chatId: string) => void;
  onClose: () => void;
  onPinToggle: (chatId: string) => void;
  onRename: (chatId: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

/**
 * ChatItemActions: Two-dot action trigger (:) that morphs to horizontal (● ●)
 * upon revealing contextual menu actions (Pin/Unpin, Rename, Archive, Delete).
 */
export function ChatItemActions({
  chatId,
  chatTitle,
  isPinned,
  isOpen,
  onOpenToggle,
  onClose,
  onPinToggle,
  onRename,
  onArchive,
  onDelete,
}: ChatItemActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
        setShowDeleteConfirm(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        setShowDeleteConfirm(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      {/* Signature Two-Dot Action Button */}
      <button
        type="button"
        aria-label={`Actions for ${chatTitle}`}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          onOpenToggle(chatId);
          setShowDeleteConfirm(false);
        }}
        className={cn(
          'w-6 h-6 rounded-kleava-sm flex items-center justify-center select-none',
          'text-kleava-text-secondary hover:text-kleava-accent',
          'hover:bg-kleava-surface-soft/80 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kleava-accent',
          isOpen && 'bg-kleava-surface-soft text-kleava-accent'
        )}
      >
        <div className="relative w-3.5 h-3.5 flex items-center justify-center pointer-events-none">
          {/* Dot 1 */}
          <span
            className={cn(
              'absolute w-1 h-1 rounded-full bg-current',
              'transition-transform duration-200 ease-out',
              isOpen
                ? '-translate-x-1.5 translate-y-0' // Horizontal Left
                : 'translate-x-0 -translate-y-1.5'  // Vertical Top
            )}
          />
          {/* Dot 2 */}
          <span
            className={cn(
              'absolute w-1 h-1 rounded-full bg-current',
              'transition-transform duration-200 ease-out',
              isOpen
                ? 'translate-x-1.5 translate-y-0'  // Horizontal Right
                : 'translate-x-0 translate-y-1.5'   // Vertical Bottom
            )}
          />
        </div>
      </button>

      {/* Contextual Action Window / Popover (Origin-Aware) */}
      {isOpen && (
        <div
          role="menu"
          aria-label={`Options for ${chatTitle}`}
          className={cn(
            'absolute right-0 top-7 z-50 min-w-[145px]',
            'bg-kleava-surface text-kleava-text-primary',
            'rounded-kleava-md border border-kleava-border-subtle/80',
            'shadow-kleava-floating p-1 flex flex-col space-y-0.5 select-none',
            'animate-in fade-in zoom-in-95 duration-150 origin-top-right'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {!showDeleteConfirm ? (
            <>
              {/* Dynamic Pin / Unpin */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onPinToggle(chatId))}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light text-kleava-text-primary transition-colors"
              >
                {isPinned ? (
                  <PinOff className="w-3.5 h-3.5 text-kleava-accent flex-shrink-0" />
                ) : (
                  <Pin className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />
                )}
                <span>{isPinned ? 'Unpin' : 'Pin'}</span>
              </button>

              {/* Rename */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onRename(chatId))}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light text-kleava-text-primary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />
                <span>Rename</span>
              </button>

              {/* Archive */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onArchive(chatId))}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light text-kleava-text-primary transition-colors"
              >
                <Archive className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />
                <span>Archive</span>
              </button>

              <div className="my-0.5 border-t border-kleava-border-subtle/40" />

              {/* Delete Trigger */}
              <button
                type="button"
                role="menuitem"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-red-50 text-kleava-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Delete</span>
              </button>
            </>
          ) : (
            /* Inline Delete Confirmation */
            <div className="p-1.5 flex flex-col space-y-1.5">
              <span className="typography-metadata text-[10px] text-kleava-destructive font-medium text-center">
                Delete this chat?
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleAction(() => onDelete(chatId))}
                  className="flex-1 py-1 px-1.5 rounded bg-kleava-destructive text-white text-[11px] font-medium flex items-center justify-center space-x-1 hover:opacity-90 transition-opacity"
                >
                  <Check className="w-3 h-3" />
                  <span>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-1 px-1.5 rounded bg-kleava-surface-soft text-kleava-text-primary text-[11px] hover:bg-kleava-surface-light transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatItemActions;