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
 * ComposerAttachmentButton: Canonical 38x38px attachment control for Kleava AI.
 * Surface: #E2EEE9 (hover: #E2F5F0), 25px corner radius, triggering accessible native file input.
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
        <div className="relative inline-flex items-center select-none">
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

            {/* 38x38px, 25px radius Control in #E2EEE9 */}
            <button
                type="button"
                aria-label="Add file attachment"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'w-[38px] h-[38px] rounded-kleava-control flex items-center justify-center flex-shrink-0',
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