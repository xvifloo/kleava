'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, ArrowUp, Mic, ChevronDown, Check, X, FileText, Image as ImageIcon } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { cn } from '@/lib/utils';

export interface ChatComposerProps {
  onSend?: (message: string, attachments: ComposerAttachment[], model: string) => void;
  disabled?: boolean;
  className?: string;
}

interface ModelOption {
  id: string;
  name: string;
  badge?: string;
}

const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'kleava-0.7', name: 'Kleava 0.7', badge: 'Default' },
  { id: 'auto', name: 'Auto', badge: 'Smart' },
];

const DEFAULT_HEIGHT = 116;
const MIN_HEIGHT = 116;

/**
 * ChatComposer: Core adaptive workspace composer for Kleava AI.
 * Supports auto-grow, manual drag-resize (up to 80% viewport height),
 * attachment selection, model choosing, and soft rounded-hexagonal send trigger.
 */
export function ChatComposer({ onSend, disabled = false, className }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('kleava-0.7');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const dragStartHeightRef = useRef<number>(DEFAULT_HEIGHT);

  // Close model dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelDropdownOpen]);

  // Handle Drag-Resize (Mouse & Touch)
  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    dragStartYRef.current = clientY;
    dragStartHeightRef.current = height;
  };

  const handleDragMove = useCallback((clientY: number) => {
    const deltaY = dragStartYRef.current - clientY;
    const maxViewportHeight = window.innerHeight * 0.8;
    const newHeight = Math.min(Math.max(dragStartHeightRef.current + deltaY, MIN_HEIGHT), maxViewportHeight);
    setHeight(newHeight);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDragMove(e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleDragMove(e.touches[0].clientY);
    };
    const onMouseUp = () => isDragging && handleDragEnd();
    const onTouchEnd = () => isDragging && handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments: ComposerAttachment[] = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit Handler
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    onSend?.(trimmed, attachments, selectedModel);
    setText('');
    setAttachments([]);
    setHeight(DEFAULT_HEIGHT);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const canSend = text.trim().length > 0 || attachments.length > 0;

  return (
    <div
      ref={composerRef}
      style={{ height: `${height}px` }}
      className={cn(
        'relative w-full rounded-kleava-sm select-none',
        'bg-kleava-surface text-kleava-text-primary',
        'border border-kleava-border-subtle/80 shadow-kleava-subtle',
        'flex flex-col justify-between transition-all duration-150',
        isDragging && 'shadow-md border-kleava-accent/40',
        className
      )}
    >
      {/* 1. Top Drag-Resize Handle */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize composer height"
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onTouchStart={(e) => e.touches[0] && handleDragStart(e.touches[0].clientY)}
        className={cn(
          'absolute -top-1.5 left-0 right-0 h-3 flex items-center justify-center cursor-row-resize z-10 group'
        )}
      >
        <span className="w-8 h-1 rounded-full bg-kleava-border-subtle/50 group-hover:bg-kleava-accent/60 transition-colors" />
      </div>

      {/* 2. Top-Left Subtle Label */}
      <div className="pt-2 px-3 flex items-center justify-between flex-shrink-0">
        <span className="typography-metadata text-[10.5px] text-kleava-text-secondary/70 tracking-wide select-none">
          Chat with Kleava...
        </span>
      </div>

      {/* 3. Attachment Previews Tray (if files selected) */}
      {attachments.length > 0 && (
        <div className="px-3 pt-1 flex items-center space-x-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center space-x-1 px-2 py-0.5 rounded-kleava-sm bg-kleava-surface-soft border border-kleava-border-subtle text-[11px] text-kleava-text-primary flex-shrink-0"
            >
              {att.type.startsWith('image/') ? (
                <ImageIcon className="w-3 h-3 text-kleava-accent flex-shrink-0" />
              ) : (
                <FileText className="w-3 h-3 text-kleava-text-secondary flex-shrink-0" />
              )}
              <span className="max-w-[100px] truncate">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="w-3.5 h-3.5 rounded-full hover:bg-kleava-surface-light flex items-center justify-center text-kleava-text-secondary hover:text-kleava-destructive"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Textarea Input Area */}
      <div className="flex-1 px-3 py-1 flex flex-col min-h-0">
        <textarea
          ref={textareaRef}
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything in Bangla or English..."
          aria-label="Message prompt"
          className={cn(
            'w-full h-full resize-none bg-transparent',
            'typography-body text-xs sm:text-sm text-kleava-text-primary',
            'placeholder:text-kleava-text-secondary/60',
            'focus:outline-none scrollbar-none'
          )}
        />
      </div>

      {/* 5. Bottom Controls Dock */}
      <div className="px-2.5 pb-2 pt-1 flex items-center justify-between flex-shrink-0 border-t border-kleava-border-subtle/30">
        {/* Left Side: Attachment & Model Selector */}
        <div className="flex items-center space-x-1.5">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Attachment Button */}
          <button
            type="button"
            aria-label="Add attachment"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-7 h-7 rounded-kleava-control flex items-center justify-center',
              'bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-accent',
              'hover:bg-kleava-surface-light transition-colors active:scale-95',
              'focus-ring-kleava'
            )}
          >
            <Paperclip className="w-3.5 h-3.5 rotate-45" />
          </button>

          {/* Model Selector Dropdown Trigger */}
          <div className="relative" ref={modelMenuRef}>
            <button
              type="button"
              aria-label="Select AI model"
              aria-expanded={isModelDropdownOpen}
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className={cn(
                'h-7 px-2.5 rounded-kleava-control flex items-center space-x-1.5',
                'bg-kleava-surface-soft text-kleava-text-primary text-xs font-medium',
                'hover:bg-kleava-surface-light hover:text-kleava-accent transition-colors',
                'focus-ring-kleava'
              )}
            >
              <span>{currentModel.name}</span>
              <ChevronDown className="w-3 h-3 text-kleava-text-secondary" />
            </button>

            {/* Model Dropdown Menu */}
            {isModelDropdownOpen && (
              <div
                role="menu"
                className={cn(
                  'absolute left-0 bottom-9 z-50 min-w-[150px]',
                  'bg-kleava-surface text-kleava-text-primary',
                  'rounded-kleava-md border border-kleava-border-subtle/80',
                  'shadow-kleava-floating p-1 flex flex-col space-y-0.5',
                  'animate-in fade-in zoom-in-95 duration-150 origin-bottom-left'
                )}
              >
                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = model.id === selectedModel;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-kleava-sm text-left text-xs transition-colors',
                        isSelected
                          ? 'bg-kleava-surface-soft text-kleava-accent font-medium'
                          : 'text-kleava-text-primary hover:bg-kleava-surface-light'
                      )}
                    >
                      <span className="truncate">{model.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-kleava-accent flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Microphone & Soft Rounded-Hexagonal Send Button */}
        <div className="flex items-center space-x-1.5">
          {/* Microphone Voice Control */}
          <button
            type="button"
            aria-label="Voice input"
            className={cn(
              'w-7 h-7 rounded-kleava-control flex items-center justify-center',
              'bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-accent',
              'hover:bg-kleava-surface-light transition-colors active:scale-95',
              'focus-ring-kleava'
            )}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {/* Rounded-Hexagonal Send Button */}
          <button
            type="button"
            aria-label="Send message"
            disabled={!canSend || disabled}
            onClick={handleSend}
            className={cn(
              // Soft 6-sided rounded contour (clip-path rounded-hexagon silhouette)
              'relative w-7 h-7 flex items-center justify-center',
              'rounded-[9px] transition-all duration-200 ease-out',
              canSend && !disabled
                ? 'bg-kleava-accent text-white shadow-sm hover:opacity-90 active:scale-95 cursor-pointer'
                : 'bg-kleava-surface-soft text-kleava-text-secondary/40 cursor-not-allowed opacity-70',
              'focus-ring-kleava'
            )}
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;