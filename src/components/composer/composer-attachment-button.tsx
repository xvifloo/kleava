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
 * ComposerAttachmentButton: 36x36px control in #E2EEE9 matching ModelSelector & SendButton.
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
        <div className="relative inline-flex items-center select-none shrink-0">
            {/* Hidden Native File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                aria-label="Upload file attachments"
                disabled={disabled}
                onChange={handleInputChange}
                className="hidden"
            />

            {/* 36x36px Control in #E2EEE9 */}
            <button
                type="button"
                aria-label="Add file attachment"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-kleava-control flex items-center justify-center shrink-0',
                    'bg-[#E2EEE9] text-kleava-text-secondary',
                    'hover:bg-[#E2F5F0] hover:text-kleava-accent',
                    'active:scale-95 transition-all duration-150',
                    'border border-kleava-border-subtle/50 shadow-xs',
                    'focus-ring-kleava',
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