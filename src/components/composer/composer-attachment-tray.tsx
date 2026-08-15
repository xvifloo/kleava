'use client';

import React from 'react';
import Image from 'next/image';
import { X, FileText, FileCode, FileSpreadsheet, File } from 'lucide-react';
import { ComposerAttachment } from '@/types';
import { formatFileSize } from '@/config/attachments';
import { cn } from '@/lib/utils';

export interface ComposerAttachmentTrayProps {
    attachments: ComposerAttachment[];
    onRemoveAttachment: (id: string) => void;
    className?: string;
}

function getFileIcon(type: string, name: string) {
    const ext = name.split('.').pop()?.toLowerCase();

    if (type.includes('json') || ['ts', 'js', 'tsx', 'jsx', 'py', 'html', 'css'].includes(ext || '')) {
        return <FileCode className="w-3.5 h-3.5 text-kleava-accent flex-shrink-0" />;
    }
    if (type.includes('csv') || type.includes('spreadsheet') || ['xls', 'xlsx'].includes(ext || '')) {
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
    }
    if (type.includes('pdf') || type.includes('text') || ['doc', 'docx', 'md', 'txt'].includes(ext || '')) {
        return <FileText className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />;
    }
    return <File className="w-3.5 h-3.5 text-kleava-text-secondary flex-shrink-0" />;
}

/**
 * ComposerAttachmentTray: Compact scrollable horizontal strip of attachment preview chips.
 */
export function ComposerAttachmentTray({
    attachments,
    onRemoveAttachment,
    className,
}: ComposerAttachmentTrayProps) {
    if (!attachments || attachments.length === 0) return null;

    return (
        <div
            aria-label="Attached files"
            className={cn(
                'w-full px-3 pt-1 flex items-center space-x-2 overflow-x-auto scrollbar-none flex-shrink-0 select-none',
                className
            )}
        >
            {attachments.map((att) => (
                <div
                    key={att.id}
                    className="relative group flex items-center space-x-1.5 pl-1.5 pr-2 py-1 rounded-[5px] bg-kleava-surface-soft/90 border border-kleava-border-subtle/80 text-[11.5px] text-kleava-text-primary flex-shrink-0 transition-shadow hover:shadow-xs"
                >
                    {att.previewUrl ? (
                        <div className="w-5 h-5 relative rounded overflow-hidden flex-shrink-0 bg-kleava-surface border border-kleava-border-subtle">
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
                        getFileIcon(att.type, att.name)
                    )}

                    <div className="flex flex-col min-w-0 pr-1">
                        <span className="max-w-[110px] truncate font-medium text-xs leading-tight" title={att.name}>
                            {att.name}
                        </span>
                        <span className="typography-metadata text-[9px] text-kleava-text-secondary">
                            {formatFileSize(att.size)}
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-label={`Remove attachment ${att.name}`}
                        onClick={() => onRemoveAttachment(att.id)}
                        className="w-4 h-4 rounded-full hover:bg-kleava-surface-light flex items-center justify-center text-kleava-text-secondary hover:text-kleava-destructive transition-colors ml-0.5 focus-ring-kleava"
                    >
                        <X className="w-2.5 h-2.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ComposerAttachmentTray;