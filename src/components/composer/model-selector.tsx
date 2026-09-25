'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Brain } from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { cn } from '@/lib/utils';

export interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ModelSelector({
  selectedModelId,
  onModelChange,
  disabled = false,
  className,
}: ModelSelectorProps) {
  const { models } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
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
  }, [isOpen]);

  return (
    <div
      className={cn('relative inline-flex items-center select-none font-ui shrink-0', className)}
      ref={menuRef}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Current AI model: ${currentModel?.name || 'Kleava'}. Click to change model.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-[36px] min-h-[36px] px-3 rounded-kleava-control flex items-center space-x-1.5 border-0 outline-none ring-0',
          'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary text-xs font-medium',
          'hover:bg-kleava-surface-light dark:hover:bg-[#253531] hover:text-kleava-accent transition-colors',
          'shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
          isOpen && 'bg-kleava-surface-light dark:bg-[#253531] text-kleava-accent',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {currentModel?.id === 'kleava-pro' ? (
          <Brain className="w-3.5 h-3.5 text-kleava-accent shrink-0" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-kleava-accent shrink-0" />
        )}
        <span className="truncate max-w-[100px] sm:max-w-[120px]">
          {currentModel?.name || 'Kleava'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-kleava-text-secondary shrink-0" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Kleava AI Models"
          className={cn(
            'absolute left-0 bottom-11 z-50',
            'w-[240px] sm:w-[260px] flex flex-col',
            'bg-kleava-surface/95 dark:bg-[#151F1C]/95 backdrop-blur-xl',
            'text-kleava-text-primary rounded-kleava-lg border border-kleava-border-subtle/30',
            'shadow-[0_12px_36px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)] p-1.5 select-none',
            'transform-gpu origin-bottom-left',
            'animate-in fade-in zoom-in-95 duration-150 ease-out'
          )}
        >
          <div className="flex flex-col space-y-1">
            {models.map((model) => {
              const isSelected = model.id === currentModel?.id;
              const isPro = model.id === 'kleava-pro';

              return (
                <button
                  key={model.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={cn(
                    'w-full flex items-start justify-between px-2.5 py-2 rounded-kleava-md text-left',
                    'transition-colors duration-150 border-0 outline-none',
                    isSelected
                      ? 'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-primary'
                      : 'hover:bg-kleava-surface-light/70 dark:hover:bg-[#1E2A27]/60 text-kleava-text-secondary hover:text-kleava-text-primary'
                  )}
                >
                  <div className="flex items-start space-x-2 min-w-0 pr-1">
                    <div className="mt-0.5 w-4 h-4 flex items-center justify-center shrink-0">
                      {isPro ? (
                        <Brain className="w-3.5 h-3.5 text-purple-500" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-kleava-accent" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-kleava-text-primary truncate">
                          {model.name}
                        </span>
                        {model.badge && (
                          <span className="typography-metadata text-[8px] uppercase px-1 py-0.2 rounded bg-kleava-accent/15 text-kleava-accent font-bold">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <span className="typography-metadata text-[10px] text-kleava-text-secondary mt-0.5 line-clamp-1">
                        {model.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-kleava-accent shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelSelector;