'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { DEFAULT_MODEL_ID } from '@/config/models';
import { useAttachments } from '@/hooks/use-attachments';
import { useSettings } from '@/state/settings-context';
import { ComposerResizeHandle } from '@/components/composer/composer-resize-handle';
import { ComposerAttachmentButton } from '@/components/composer/composer-attachment-button';
import { ComposerAttachmentTray } from '@/components/composer/composer-attachment-tray';
import { ModelSelector } from '@/components/composer/model-selector';
import { SendButton } from '@/components/composer/send-button';
import { MicButton } from '@/components/composer/mic-button';
import { cn } from '@/lib/utils';

export interface ChatComposerProps {
  onSend?: (message: string, attachments: ComposerAttachment[], modelId: string) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
  disabled?: boolean;
  className?: string;
}

// Compact Default Height
const DEFAULT_HEIGHT = 96;
const MIN_HEIGHT = 96;

const CHAT_PLACEHOLDERS = {
  en: [
    'Ask anything...',
    'How can I help you today?',
    'Write a TypeScript component...',
    'Plan a landing page or structure...',
    'Explain code or solve a problem...',
  ],
  bn: [
    'যেকোনো কিছু জিজ্ঞাসা করুন...',
    'আজ কীভাবে সাহায্য করতে পারি?',
    'একটি নেক্সটজেএস কম্পোনেন্ট তৈরি করুন...',
    'প্রজেক্টের পরিকল্পনা বা কোড লিখুন...',
    'যেকোনো কোড বিশ্লেষণ বা সমস্যার সমাধান করুন...',
  ],
};

/**
 * ChatComposer:
 * - Compact 96px default height
 * - Stable session-specific placeholder without distracting timer cycling
 * - Clean "Ask anything..." text (without "in Bangla or English")
 * - 40x40px prominent super-rounded hexagon send button
 */
export function ChatComposer({
  onSend,
  onCancel,
  isProcessing = false,
  disabled = false,
  className,
}: ChatComposerProps) {
  const { settings } = useSettings();
  const lang = settings.language === 'bn' ? 'bn' : 'en';

  const [text, setText] = useState('');
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

  // Stable session placeholder (picked once per session without flip-flopping)
  const [stablePlaceholder, setStablePlaceholder] = useState(CHAT_PLACEHOLDERS.en[0]);

  const {
    attachments,
    errorMessage,
    isDraggingFile,
    addFiles,
    removeAttachment,
    clearAttachments,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useAttachments();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const dragStartHeightRef = useRef<number>(DEFAULT_HEIGHT);
  const isManuallyResizedRef = useRef<boolean>(false);

  // Select a clean stable placeholder per chat session or language switch
  useEffect(() => {
    const list = CHAT_PLACEHOLDERS[lang];
    const randomIndex = Math.floor(Math.random() * list.length);
    setStablePlaceholder(list[randomIndex] || list[0]);
  }, [lang]);

  // Smooth Auto-grow calculation
  const adjustHeightForContent = useCallback(() => {
    if (isManuallyResizedRef.current) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const textScrollHeight = textarea.scrollHeight;

    const trayHeight = attachments.length > 0 ? 38 : 0;
    // Top handle padding + Bottom controls dock (~52px) = ~60px
    const chromeHeight = 60 + trayHeight;

    const calculatedHeight = Math.min(
      Math.max(textScrollHeight + chromeHeight, MIN_HEIGHT + trayHeight),
      Math.min(window.innerHeight * 0.52, 320)
    );

    setHeight(calculatedHeight);
    textarea.style.height = '100%';
  }, [attachments.length]);

  useEffect(() => {
    adjustHeightForContent();
  }, [text, attachments.length, adjustHeightForContent]);

  // Manual Drag-Resize Handlers
  const handleResizeStart = (clientY: number) => {
    setIsDraggingHandle(true);
    isManuallyResizedRef.current = true;
    dragStartYRef.current = clientY;
    dragStartHeightRef.current = height;
  };

  const handleResizeMove = useCallback((clientY: number) => {
    const deltaY = dragStartYRef.current - clientY;
    const maxViewportHeight = window.innerHeight * 0.8;
    const newHeight = Math.min(
      Math.max(dragStartHeightRef.current + deltaY, MIN_HEIGHT),
      maxViewportHeight
    );
    setHeight(newHeight);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsDraggingHandle(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingHandle) handleResizeMove(e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDraggingHandle && e.touches[0]) handleResizeMove(e.touches[0].clientY);
    };
    const onMouseUp = () => isDraggingHandle && handleResizeEnd();
    const onTouchEnd = () => isDraggingHandle && handleResizeEnd();

    if (isDraggingHandle) {
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
  }, [isDraggingHandle, handleResizeMove, handleResizeEnd]);

  // Submit Handler
  const handleSend = () => {
    if (isProcessing) return;
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSend?.(trimmed, attachments, selectedModelId);
    setText('');
    clearAttachments();
    isManuallyResizedRef.current = false;
    setHeight(DEFAULT_HEIGHT);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    textareaRef.current?.focus();
  };

  const canSend = text.trim().length > 0 || attachments.length > 0;

  return (
    <div
      ref={composerRef}
      style={{ height: `${height}px` }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative w-full rounded-kleava-sm select-none font-ui',
        'bg-kleava-surface text-kleava-text-primary',
        'border-0 shadow-[0_4px_24px_-4px_rgba(23,188,155,0.14),0_2px_8px_-2px_rgba(23,188,155,0.08)]',
        'flex flex-col justify-between transition-[height,box-shadow] duration-150 ease-out',
        isDraggingHandle && 'shadow-[0_6px_28px_-4px_rgba(23,188,155,0.22)]',
        isDraggingFile && 'ring-2 ring-dashed ring-kleava-accent bg-kleava-surface-light/40',
        className
      )}
    >
      {/* 1. Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-30 rounded-kleava-sm bg-kleava-surface-light/95 flex flex-col items-center justify-center space-y-1 pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-6 h-6 text-kleava-accent animate-bounce" />
          <span className="typography-label text-xs text-kleava-accent font-medium">
            Drop files to attach
          </span>
        </div>
      )}

      {/* 2. Top Drag-Resize Handle */}
      <ComposerResizeHandle
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        isDragging={isDraggingHandle}
      />

      {/* Error Message Tooltip if any */}
      {errorMessage && (
        <div className="pt-2 px-3.5">
          <span className="typography-metadata text-[10.5px] text-kleava-destructive font-medium animate-in fade-in">
            {errorMessage}
          </span>
        </div>
      )}

      {/* 3. Attachment Tray */}
      {attachments.length > 0 && (
        <div className="shrink-0 pt-1.5">
          <ComposerAttachmentTray
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      )}

      {/* 4. Fluid Multi-line Textarea Area */}
      <div className="flex-1 px-3.5 pt-2 pb-0.5 flex flex-col min-h-[40px] overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          disabled={disabled || isProcessing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={stablePlaceholder}
          aria-label="Message prompt"
          className={cn(
            'w-full h-full resize-none bg-transparent',
            'text-[15px] leading-relaxed text-kleava-text-primary',
            lang === 'bn' ? 'font-bangla' : 'font-ui',
            'placeholder:text-kleava-text-secondary/55',
            'focus:outline-none scrollbar-none overflow-y-auto',
            isProcessing && 'opacity-70'
          )}
        />
      </div>

      {/* 5. Clean Bottom Controls Dock */}
      <div className="px-2.5 pb-2 pt-1 flex items-center justify-between shrink-0 select-none">
        {/* Left: Attachment & Model Selector */}
        <div className="flex items-center space-x-1.5">
          <ComposerAttachmentButton
            onFilesSelected={addFiles}
            disabled={isProcessing || disabled}
          />

          <ModelSelector
            selectedModelId={selectedModelId}
            onModelChange={(id) => setSelectedModelId(id)}
            disabled={disabled || isProcessing}
          />
        </div>

        {/* Right: Microphone & Prominently Sized 40x40px Send Button */}
        <div className="flex items-center space-x-1.5">
          <MicButton
            onTranscript={handleVoiceTranscript}
            disabled={disabled || isProcessing}
          />

          <SendButton
            canSend={canSend}
            isProcessing={isProcessing}
            onSend={handleSend}
            onCancel={onCancel}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatComposer;