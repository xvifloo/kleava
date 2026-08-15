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
 * ChatComposer: Core adaptive workspace composer for Kleava AI.
 * - Base default height: 116px
 * - Multiline input with Hind Siliguri/Geist typography
 * - Pure vertical drag-resize (up to 80% viewport height)
 * - Dedicated Expanded Mode for comfortable long-form writing
 * - 38x38px Attachment control in #E2EEE9
 * - Reusable ModelSelector, MicButton, and Rounded-Hexagonal SendButton
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

  // Manual Vertical Drag-Resize Handlers
  const handleResizeStart = (clientY: number) => {
    setIsDraggingHandle(true);
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

  // Toggle Expanded Workspace Mode
  const toggleExpandedMode = () => {
    if (isExpandedMode) {
      setIsExpandedMode(false);
      setHeight(DEFAULT_HEIGHT);
    } else {
      setIsExpandedMode(true);
      setHeight(Math.min(window.innerHeight * 0.8, 520));
    }
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Submit Handler: Normalizes payload and dispatches outgoing prompt
  const handleSend = () => {
    if (isProcessing) return; // Prevent duplicate submissions during active generation
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSend?.(trimmed, attachments, selectedModelId);
    setText('');
    clearAttachments();
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

  // Enabled if valid trimmed text exists OR file attachments are present
  const canSend = text.trim().length > 0 || attachments.length > 0;

  return (
    <div
      ref={composerRef}
      style={{ height: `${height}px` }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        // Outer Container: 6px radius, pure #FFFFFF surface, subtle border & shadow
        'relative w-full rounded-kleava-sm select-none font-ui',
        'bg-kleava-surface text-kleava-text-primary',
        'border border-kleava-border-subtle/80 shadow-kleava-subtle',
        'flex flex-col justify-between transition-[box-shadow,border-color] duration-150',
        isDraggingHandle && 'shadow-md border-kleava-accent/50 ring-1 ring-kleava-accent/30',
        isDraggingFile && 'border-dashed border-2 border-kleava-accent bg-kleava-surface-light/40',
        isExpandedMode && 'shadow-kleava-floating border-kleava-border-subtle',
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

      {/* 3. Top-Left Context Label & Expand Button */}
      <div className="pt-2 px-3 flex items-center justify-between flex-shrink-0 select-none">
        <span className="typography-metadata text-[10.5px] text-kleava-text-secondary/70 tracking-wide">
          Chat with Kleava...
        </span>

        <div className="flex items-center space-x-2">
          {errorMessage && (
            <span className="typography-metadata text-[10.5px] text-kleava-destructive font-medium animate-in fade-in">
              {errorMessage}
            </span>
          )}

          <button
            type="button"
            aria-label={isExpandedMode ? 'Collapse writing mode' : 'Expand writing mode'}
            onClick={toggleExpandedMode}
            className="p-1 rounded text-kleava-text-secondary/60 hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
          >
            {isExpandedMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 4. Modular Attachment Previews Tray */}
      <ComposerAttachmentTray
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
      />

      {/* 5. Primary Multi-line Textarea Area */}
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
            'typography-body text-xs sm:text-sm text-kleava-text-primary leading-relaxed',
            'placeholder:text-kleava-text-secondary/60',
            'focus:outline-none scrollbar-none',
            isProcessing && 'opacity-70'
          )}
        />
      </div>

      {/* 6. Dedicated Bottom Controls Dock */}
      <div className="px-2.5 pb-2 pt-1 flex items-center justify-between flex-shrink-0 border-t border-kleava-border-subtle/30 select-none">
        {/* Left: 38x38 Attachment Button in #E2EEE9 & Model Selector */}
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

        {/* Right: Microphone Voice Button & Soft Rounded-Hexagonal Send Button */}
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