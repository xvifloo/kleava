'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatSearchProps {
  value: string;
  onChange: (query: string) => void;
  className?: string;
}

/**
 * ChatSearch: Compact search input supporting real-time case-insensitive
 * query filtering across English and Bangla scripts.
 */
export function ChatSearch({ value, onChange, className }: ChatSearchProps) {
  return (
    <div className={cn('relative w-full flex items-center', className)}>
      {/* Search Icon Indicator */}
      <Search className="absolute left-2.5 w-3.5 h-3.5 text-kleava-text-secondary/70 pointer-events-none" />

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats..."
        aria-label="Search chats"
        className={cn(
          'w-full pl-8 pr-7 py-1.5 rounded-kleava-md',
          'bg-kleava-surface-light/40 text-kleava-text-primary text-xs',
          'placeholder:text-kleava-text-secondary/70',
          'border border-kleava-border-subtle/70',
          'transition-all duration-150 ease-out',
          'hover:bg-kleava-surface-light/70 hover:border-kleava-accent/30',
          'focus:bg-kleava-surface focus:outline-none focus:border-kleava-accent focus:ring-1 focus:ring-kleava-accent/30'
        )}
      />

      {/* Clear Search Action */}
      {value.trim().length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2 w-4 h-4 rounded-full flex items-center justify-center text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default ChatSearch;