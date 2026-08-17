'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Maximize2, Minimize2 } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { DEFAULT_MODEL_ID } from '@/config/models';
import { useAttachments } from '@/hooks/use-attachments';
import { useSettings } from '@/state/settings-context';
import { t } from '@/lib/i18n';
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

const DEFAULT_HEIGHT = 116;
const MIN_HEIGHT = 116;

/**
 * ChatComposer: Unified 36px bottom controls bar (Attachment, ModelSelector, Mic, Send)
 * with auto-grow multiline input and zero hard borders.
 */
export function ChatComposer({
  onSend,
  onCancel,
  isProcessing = false,
  disabled = false,
  className,
}: ChatComposerProps) {
  const { settings } = useSettings();
  const lang = settings.language;

  const [text, setText] = useState('');
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [isExpandedMode, setIsExpandedMode] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);

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

  // Dynamic Smooth Auto-Grow Height Calculation
  const adjustHeightForContent = useCallback(() => {
    if (isExpandedMode || isManuallyResizedRef.current) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const textScrollHeight = textarea.scrollHeight;
    const trayHeight = attachments.length > 0 ? 38 : 0;
    const chromeHeight = 76 + trayHeight;

    const calculatedHeight = Math.min(
      Math.max(textScrollHeight + chromeHeight - 16, MIN_HEIGHT + trayHeight),
      Math.min(window.innerHeight * 0.52, 320)
    );

    setHeight(calculatedHeight);
  }, [attachments.length, isExpandedMode]);

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

    if (newHeight >= window.innerHeight * 0.72) {
      setIsExpandedMode(true);
    } else {
      setIsExpandedMode(false);
    }
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

  // Toggle Expanded Mode
  const toggleExpandedMode = () => {
    if (isExpandedMode) {
      setIsExpandedMode(false);
      isManuallyResizedRef.current = false;
      setHeight(DEFAULT_HEIGHT);
    } else {
      setIsExpandedMode(true);
      isManuallyResizedRef.current = true;
      setHeight(Math.min(window.innerHeight * 0.8, 520));
    }
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

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
    setIsExpandedMode(false);
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
        'flex flex-col justify-between transition-[box-shadow] duration-200',
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
            {t('dropFiles', lang)}
          </span>
        </div>
      )}

      {/* 2. Top Drag-Resize Handle */}
      <ComposerResizeHandle
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        isDragging={isDraggingHandle}
      />

      {/* 3. Top Compact Bar */}
      <div className="pt-1.5 px-3.5 flex items-center justify-between shrink-0 select-none">
        {errorMessage ? (
          <span className="typography-metadata text-[10.5px] text-kleava-destructive font-medium animate-in fade-in">
            {errorMessage}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          aria-label={isExpandedMode ? 'Collapse writing mode' : 'Expand writing mode'}
          onClick={toggleExpandedMode}
          className="p-1 rounded text-kleava-text-secondary/50 hover:text-kleava-text-primary hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] transition-colors focus-ring-kleava"
        >
          {isExpandedMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>
      </div>

      {/* 4. Non-Overlapping Attachment Tray */}
      {attachments.length > 0 && (
        <div className="shrink-0 mb-1">
          <ComposerAttachmentTray
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      )}

      {/* 5. Fluid 15px Multi-line Textarea Area */}
      <div className="flex-1 px-3.5 pt-0.5 pb-1 flex flex-col min-h-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          disabled={disabled || isProcessing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('composerPlaceholder', lang)}
          aria-label="Message prompt"
          className={cn(
            'w-full h-full resize-none bg-transparent',
            'text-[15px] sm:text-base leading-relaxed text-kleava-text-primary',
            lang === 'bn' ? 'font-bangla' : 'font-ui',
            'placeholder:text-kleava-text-secondary/60 placeholder:text-[15px]',
            'focus:outline-none scrollbar-none overflow-y-auto',
            isProcessing && 'opacity-70'
          )}
        />
      </div>

      {/* 6. Clean Bottom Controls Dock (Unified 36px Height on All Buttons) */}
      <div className="px-3 pb-2.5 pt-1 flex items-center justify-between shrink-0 select-none">
        {/* Left: 36px Attachment Button & 36px Model Selector */}
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

        {/* Right: 36px Microphone & Symmetrical 36x36px Circular-Hexagonal Send Button */}
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