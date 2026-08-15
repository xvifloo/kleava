'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Paperclip, X, FileText, UploadCloud } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { DEFAULT_MODEL_ID } from '@/config/models';
import { formatFileSize } from '@/config/attachments';
import { useAttachments } from '@/hooks/use-attachments';
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
 * Supports auto-grow, manual drag-resize (up to 80% viewport height),
 * attachment selection, multi-model choosing, and speech recognition.
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const dragStartHeightRef = useRef<number>(DEFAULT_HEIGHT);

  // Manual Drag-Resize Handle (Mouse & Touch)
  const handleResizeStart = (clientY: number) => {
    setIsDraggingHandle(true);
    dragStartYRef.current = clientY;
    dragStartHeightRef.current = height;
  };

  const handleResizeMove = useCallback((clientY: number) => {
    const deltaY = dragStartYRef.current - clientY;
    const maxViewportHeight = window.innerHeight * 0.8;
    const newHeight = Math.min(Math.max(dragStartHeightRef.current + deltaY, MIN_HEIGHT), maxViewportHeight);
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

  // File Input Change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Handler
  const handleSend = () => {
    if (isProcessing) return;
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSend?.(trimmed, attachments, selectedModelId);
    setText('');
    clearAttachments();
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
        'relative w-full rounded-kleava-sm select-none',
        'bg-kleava-surface text-kleava-text-primary',
        'border border-kleava-border-subtle/80 shadow-kleava-subtle',
        'flex flex-col justify-between transition-all duration-150',
        isDraggingHandle && 'shadow-md border-kleava-accent/40',
        isDraggingFile && 'border-dashed border-2 border-kleava-accent bg-kleava-surface-light/40',
        className
      )}
    >
      {/* Drag & Drop Dropzone Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-30 rounded-kleava-sm bg-kleava-surface-light/90 flex flex-col items-center justify-center space-y-1 pointer-events-none animate-in fade-in duration-150">
          <UploadCloud className="w-6 h-6 text-kleava-accent animate-bounce" />
          <span className="typography-label text-xs text-kleava-accent font-medium">
            Drop files to attach
          </span>
        </div>
      )}

      {/* 1. Top Drag-Resize Handle */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize composer height"
        onMouseDown={(e) => handleResizeStart(e.clientY)}
        onTouchStart={(e) => e.touches[0] && handleResizeStart(e.touches[0].clientY)}
        className="absolute -top-1.5 left-0 right-0 h-3 flex items-center justify-center cursor-row-resize z-10 group"
      >
        <span className="w-8 h-1 rounded-full bg-kleava-border-subtle/50 group-hover:bg-kleava-accent/60 transition-colors" />
      </div>

      {/* 2. Top-Left Subtle Label */}
      <div className="pt-2 px-3 flex items-center justify-between flex-shrink-0">
        <span className="typography-metadata text-[10.5px] text-kleava-text-secondary/70 tracking-wide select-none">
          Chat with Kleava...
        </span>
        {errorMessage && (
          <span className="typography-metadata text-[10.5px] text-kleava-destructive font-medium animate-in fade-in">
            {errorMessage}
          </span>
        )}
      </div>

      {/* 3. Rich Attachment Previews Tray */}
      {attachments.length > 0 && (
        <div className="px-3 pt-1 flex items-center space-x-2 overflow-x-auto scrollbar-none flex-shrink-0">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group flex items-center space-x-1.5 pl-1.5 pr-2 py-1 rounded-[5px] bg-kleava-surface-soft/90 border border-kleava-border-subtle/80 text-[11.5px] text-kleava-text-primary flex-shrink-0"
            >
              {att.previewUrl ? (
                <div className="w-5 h-5 relative rounded overflow-hidden flex-shrink-0 bg-kleava-surface">
                  <Image
                    src={att.previewUrl}
                    alt={att.name}
                    fill
                    sizes="20px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <FileText className="w-4 h-4 text-kleava-text-secondary flex-shrink-0" />
              )}
              <div className="flex flex-col min-w-0 pr-1">
                <span className="max-w-[110px] truncate font-medium leading-tight">{att.name}</span>
                <span className="typography-metadata text-[9px] text-kleava-text-secondary">
                  {formatFileSize(att.size)}
                </span>
              </div>
              <button
                type="button"
                aria-label={`Remove ${att.name}`}
                onClick={() => removeAttachment(att.id)}
                className="w-4 h-4 rounded-full hover:bg-kleava-surface-light flex items-center justify-center text-kleava-text-secondary hover:text-kleava-destructive transition-colors ml-0.5"
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
          disabled={disabled || isProcessing}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything in Bangla or English..."
          aria-label="Message prompt"
          className={cn(
            'w-full h-full resize-none bg-transparent',
            'typography-body text-xs sm:text-sm text-kleava-text-primary',
            'placeholder:text-kleava-text-secondary/60',
            'focus:outline-none scrollbar-none',
            isProcessing && 'opacity-70'
          )}
        />
      </div>

      {/* 5. Bottom Controls Dock */}
      <div className="px-2.5 pb-2 pt-1 flex items-center justify-between flex-shrink-0 border-t border-kleava-border-subtle/30">
        {/* Left: Attachment Trigger & Dedicated Model Selector */}
        <div className="flex items-center space-x-1.5">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Attachment Button */}
          <button
            type="button"
            aria-label="Add attachment"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-7 h-7 rounded-kleava-control flex items-center justify-center',
              'bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-accent',
              'hover:bg-kleava-surface-light transition-colors active:scale-95',
              'focus-ring-kleava',
              isProcessing && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Paperclip className="w-3.5 h-3.5 rotate-45" />
          </button>

          {/* Dedicated Model Selector */}
          <ModelSelector
            selectedModelId={selectedModelId}
            onModelChange={(id) => setSelectedModelId(id)}
            disabled={disabled || isProcessing}
          />
        </div>

        {/* Right: Microphone Voice Button & Rounded-Hexagonal Send Button */}
        <div className="flex items-center space-x-1.5">
          {/* Speech-to-Text Microphone Button */}
          <MicButton
            onTranscript={handleVoiceTranscript}
            disabled={disabled || isProcessing}
          />

          {/* Soft Rounded-Hexagonal Send / Stop Button */}
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