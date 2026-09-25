'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ComposerAttachment } from '@/types';
import { ATTACHMENT_CONFIG } from '@/config/attachments';

export function useAttachments() {
    const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showError = useCallback((msg: string) => {
        setErrorMessage(msg);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => setErrorMessage(null), 3500);
    }, []);

    // Add files with duplicate prevention and security checks
    const addFiles = useCallback(
        (files: File[]) => {
            if (!files || files.length === 0) return;

            if (attachments.length + files.length > ATTACHMENT_CONFIG.maxAttachmentsCount) {
                showError(`Maximum ${ATTACHMENT_CONFIG.maxAttachmentsCount} attachments allowed`);
                return;
            }

            const newAttachments: ComposerAttachment[] = [];

            for (const file of files) {
                // 1. Blocked executable extension check
                const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
                if (ATTACHMENT_CONFIG.blockedExtensions.includes(ext as (typeof ATTACHMENT_CONFIG.blockedExtensions)[number])) {
                    showError(`File type '${ext}' is blocked for security`);
                    continue;
                }

                // 2. Individual file size limit
                if (file.size > ATTACHMENT_CONFIG.maxFileSizeBytes) {
                    showError(`'${file.name}' exceeds ${ATTACHMENT_CONFIG.maxFileSizeLabel} limit`);
                    continue;
                }

                // 3. Duplicate check (matching name and size)
                const isDuplicate = attachments.some(
                    (a) => a.name === file.name && a.size === file.size
                );
                if (isDuplicate) {
                    showError(`'${file.name}' is already attached`);
                    continue;
                }

                // 4. Generate object URL for images
                let previewUrl: string | undefined = undefined;
                if (file.type.startsWith('image/')) {
                    previewUrl = URL.createObjectURL(file);
                }

                newAttachments.push({
                    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    previewUrl,
                    status: 'ready',
                });
            }

            if (newAttachments.length > 0) {
                setAttachments((prev) => [...prev, ...newAttachments]);
            }
        },
        [attachments, showError]
    );

    // Remove individual attachment and revoke object URL
    const removeAttachment = useCallback((id: string) => {
        setAttachments((prev) => {
            const target = prev.find((a) => a.id === id);
            if (target?.previewUrl) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter((a) => a.id !== id);
        });
    }, []);

    // Clear all attachments
    const clearAttachments = useCallback(() => {
        attachments.forEach((a) => {
            if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
        });
        setAttachments([]);
    }, [attachments]);

    // Clean up object URLs on component unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            attachments.forEach((a) => {
                if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
            });
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, [attachments]);

    // Drag and drop event handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.types.includes('Files')) {
            setIsDraggingFile(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingFile(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                addFiles(Array.from(e.dataTransfer.files));
            }
        },
        [addFiles]
    );

    return {
        attachments,
        errorMessage,
        isDraggingFile,
        addFiles,
        removeAttachment,
        clearAttachments,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}

export default useAttachments;