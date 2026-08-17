'use client';

import React, { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComposerAttachmentButtonProps {
    onFilesSelected: (files: File[]) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * ComposerAttachmentButton: 36x36px control matching the theme-aware surface of ModelSelector.
 */
export function ComposerAttachmentButton({
    onFilesSelected,
    disabled = false,
    className,
}: ComposerAttachmentButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        onFilesSelected(files);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="relative inline-flex items-center select-none shrink-0 font-ui">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                aria-label="Upload file attachments"
                disabled={disabled}
                onChange={handleInputChange}
                className="hidden"
            />

            <button
                type="button"
                aria-label="Add file attachment"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-kleava-control flex items-center justify-center shrink-0 border-0 outline-none ring-0',
                    'bg-kleava-surface-soft dark:bg-[#1E2A27] text-kleava-text-secondary dark:text-[#8A9E97]',
                    'hover:bg-kleava-surface-light dark:hover:bg-[#253531] hover:text-kleava-accent',
                    'active:scale-95 transition-all duration-150 shadow-2xs',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kleava-accent',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <Paperclip className="w-4 h-4 rotate-45" />
            </button>
        </div>
    );
}

export default ComposerAttachmentButton;