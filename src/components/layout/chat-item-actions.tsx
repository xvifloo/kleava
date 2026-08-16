'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pin, PinOff, Pencil, Archive, RotateCcw, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatItemActionsProps {
  chatId: string;
  chatTitle: string;
  isPinned: boolean;
  isArchived?: boolean;
  isOpen: boolean;
  onOpenToggle: (chatId: string) => void;
  onClose: () => void;
  onPinToggle: (chatId: string) => void;
  onRename: (chatId: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

/**
 * ChatItemActions: Circular, borderless Two-Dot Button with close dot-spacing.
 * Clicks trigger an organic glass-morph floating context menu with high z-index.
 */
export function ChatItemActions({
  chatId,
  chatTitle,
  isPinned,
  isArchived = false,
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

  // Close popup only on outside click or Escape (moving mouse away does NOT close it)
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
    <div className="relative inline-flex items-center font-ui" ref={menuRef}>
      {/* Refined Circular Minimal Two-Dot Action Button */}
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
          // Circular button (no rectangular box, no hard outline border)
          'w-6 h-6 rounded-full flex items-center justify-center select-none border-0 outline-none ring-0',
          'text-kleava-text-secondary hover:text-kleava-accent',
          'hover:bg-kleava-surface-soft/80 dark:hover:bg-[#1E2A27]/90 transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kleava-accent',
          isOpen && 'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-accent'
        )}
      >
        <div className="relative w-3 h-3 flex items-center justify-center pointer-events-none">
          {/* Dot 1 (Vertical closer spacing) */}
          <span
            className={cn(
              'absolute w-[3px] h-[3px] rounded-full bg-current',
              'transition-transform duration-200 ease-out',
              isOpen
                ? '-translate-x-[3.5px] translate-y-0' // Morphs to Horizontal Left
                : 'translate-x-0 -translate-y-[3.5px]' // Vertical Top
            )}
          />
          {/* Dot 2 */}
          <span
            className={cn(
              'absolute w-[3px] h-[3px] rounded-full bg-current',
              'transition-transform duration-200 ease-out',
              isOpen
                ? 'translate-x-[3.5px] translate-y-0' // Morphs to Horizontal Right
                : 'translate-x-0 translate-y-[3.5px]'  // Vertical Bottom
            )}
          />
        </div>
      </button>

      {/* Floating Glass-Morph Context Menu (High z-index z-50 to prevent overflow clipping) */}
      {isOpen && (
        <div
          role="menu"
          aria-label={`Options for ${chatTitle}`}
          className={cn(
            'absolute right-0 top-7 z-50 min-w-[150px] select-none',
            // Glass surface treatment in Light & Dark modes
            'bg-kleava-surface/95 dark:bg-[#1A2522]/95 backdrop-blur-xl',
            'text-kleava-text-primary rounded-kleava-md',
            'border border-kleava-border-subtle/30 shadow-[0_8px_28px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.6)]',
            'p-1 flex flex-col space-y-0.5',
            'transform-gpu origin-top-right',
            'animate-in fade-in zoom-in-90 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {!showDeleteConfirm ? (
            <>
              {/* Pin / Unpin */}
              {!isArchived && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(() => onPinToggle(chatId))}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light dark:hover:bg-[#253531] text-kleava-text-primary transition-colors"
                >
                  {isPinned ? (
                    <PinOff className="w-3.5 h-3.5 text-kleava-accent shrink-0" />
                  ) : (
                    <Pin className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                  )}
                  <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                </button>
              )}

              {/* Rename */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onRename(chatId))}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light dark:hover:bg-[#253531] text-kleava-text-primary transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                <span>Rename</span>
              </button>

              {/* Archive / Unarchive */}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(() => onArchive(chatId))}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-kleava-surface-light dark:hover:bg-[#253531] text-kleava-text-primary transition-colors"
              >
                {isArchived ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-kleava-accent shrink-0" />
                    <span>Unarchive</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
                    <span>Archive</span>
                  </>
                )}
              </button>

              <div className="my-0.5 border-t border-kleava-border-subtle/30" />

              {/* Delete Trigger */}
              <button
                type="button"
                role="menuitem"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-kleava-sm text-left typography-label text-xs hover:bg-red-500/10 text-kleava-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
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
                  className="py-1 px-1.5 rounded bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary text-[11px] hover:bg-kleava-surface-light transition-colors"
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