'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Maximize2, Minimize2 } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { DEFAULT_MODEL_ID } from '@/config/models';
import { useAttachments } from '@/hooks/use-attachments';
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
 * ChatComposer:
 * - Dynamic Auto-grow height when text expands
 * - 15px readable multiline text input
 * - Manual vertical resize up to 80% viewport height
 * - Non-overlapping attachment tray
 * - Unified 36px bottom controls bar
 */
export function ChatComposer({
  onSend,
  onCancel,
  isProcessing = false,
  disabled = false,
  className,
}: ChatComposerProps) {
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

  // Auto-grow calculation when typing or adding attachments
  const adjustHeightForContent = useCallback(() => {
    if (isExpandedMode || isManuallyResizedRef.current) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset textarea height to calculate natural scrollHeight
    textarea.style.height = 'auto';
    const textScrollHeight = textarea.scrollHeight;

    // Tray height if files are attached
    const trayHeight = attachments.length > 0 ? 38 : 0;
    // Top bar (18px) + Bottom controls dock (50px) + Internal margins (12px)
    const chromeHeight = 68 + trayHeight;

    const calculatedHeight = Math.min(
      Math.max(textScrollHeight + chromeHeight, MIN_HEIGHT + trayHeight),
      window.innerHeight * 0.55 // auto-grow up to 55% screen before scrollbar activates
    );

    setHeight(calculatedHeight);
  }, [attachments.length, isExpandedMode]);

  useEffect(() => {
    adjustHeightForContent();
  }, [text, attachments.length, adjustHeightForContent]);

  // Manual Vertical Drag-Resize Handlers
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
        // Borderless card with soft accent shadow
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

      {/* 3. Top Action Row (Compact Error & Maximize Toggle) */}
      <div className="pt-2 px-3 flex items-center justify-between shrink-0 select-none">
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
          className="p-1 rounded text-kleava-text-secondary/50 hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
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
      <div className="flex-1 px-3 py-1 flex flex-col min-h-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={text}
          disabled={disabled || isProcessing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything in Bangla or English..."
          aria-label="Message prompt"
          className={cn(
            'w-full h-full resize-none bg-transparent',
            'text-[15px] leading-[1.65] font-bangla text-kleava-text-primary', // 15px clear readable size
            'placeholder:text-kleava-text-secondary/60 placeholder:font-ui placeholder:text-sm',
            'focus:outline-none scrollbar-none',
            isProcessing && 'opacity-70'
          )}
        />
      </div>

      {/* 6. Clean Bottom Controls Dock (Unified 36px Height on All Buttons) */}
      <div className="px-2.5 pb-2.5 pt-1.5 flex items-center justify-between shrink-0 select-none">
        {/* Left Side: 36px Attachment Button & 36px Model Selector */}
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

        {/* Right Side: 36px Microphone & 36x36px Circular-Hexagonal Send Button */}
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