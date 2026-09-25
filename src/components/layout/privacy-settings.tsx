'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Download,
    Trash2,
    Database,
    RefreshCw,
    HardDrive,
    CheckCircle2,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { ChatSession, ChatMessage } from '@/types';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

export interface PrivacySettingsProps {
    chats: ChatSession[];
    messages: ChatMessage[];
    onClearChatHistory: () => void;
}

/**
 * PrivacySettings: Complete Privacy & Data Controls for Kleava AI.
 * Handles Chat History persistence toggles, Telemetry, Model training opt-outs,
 * Full JSON Data Export, Chat History Deletion, and Full Data Reset.
 */
export function PrivacySettings({
    chats,
    messages,
    onClearChatHistory,
}: PrivacySettingsProps) {
    const {
        privacy,
        updatePrivacy,
        clearAllMemories,
        exportAllUserData,
        resetAllApplicationData,
    } = useSettings();

    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

    // Modal Dialog States
    const [isDeleteChatsDialogOpen, setIsDeleteChatsDialogOpen] = useState(false);
    const [isDeleteMemoriesDialogOpen, setIsDeleteMemoriesDialogOpen] = useState(false);
    const [isFullResetDialogOpen, setIsFullResetDialogOpen] = useState(false);

    // Full User Data Exporter Trigger
    const handleExportData = () => {
        setIsExporting(true);
        setTimeout(() => {
            exportAllUserData(chats, messages);
            setIsExporting(false);
            setExportSuccessMessage('Your data package has been downloaded successfully.');
            setTimeout(() => setExportSuccessMessage(null), 4000);
        }, 400);
    };

    return (
        <SettingsContent
            sectionId="privacy"
            title="Privacy & Data"
            description="Control local data storage, telemetry, export full account backups, and manage data deletion."
        >
            {/* Export Success Feedback */}
            {exportSuccessMessage && (
                <div className="p-2.5 rounded-kleava-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in select-none">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{exportSuccessMessage}</span>
                </div>
            )}

            {/* 1. History & Privacy Preferences */}
            <SettingsSectionBlock title="Data Storage & Sharing">
                {/* Save Chat History Toggle */}
                <SettingsRow
                    label="Save Chat History"
                    description="Persist conversations locally in your browser storage"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={privacy.saveChatHistory}
                            onClick={() => updatePrivacy({ saveChatHistory: !privacy.saveChatHistory })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                privacy.saveChatHistory ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    privacy.saveChatHistory ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Model Training Opt-Out */}
                <SettingsRow
                    label="Model Training Opt-Out"
                    description="Request AI providers not to use your conversations to train models"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={privacy.modelTrainingOptOut}
                            onClick={() => updatePrivacy({ modelTrainingOptOut: !privacy.modelTrainingOptOut })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                privacy.modelTrainingOptOut ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    privacy.modelTrainingOptOut ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Analytics Telemetry */}
                <SettingsRow
                    label="Anonymous Telemetry"
                    description="Share anonymous diagnostic performance metrics to help improve Kleava"
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={privacy.analyticsTelemetry}
                            onClick={() => updatePrivacy({ analyticsTelemetry: !privacy.analyticsTelemetry })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                privacy.analyticsTelemetry ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    privacy.analyticsTelemetry ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 2. Data Export Section */}
            <SettingsSectionBlock title="Data Export">
                <div className="p-3 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 flex items-center justify-between select-none">
                    <div className="flex flex-col pr-2">
                        <span className="typography-label text-xs font-semibold text-kleava-text-primary">
                            Export Complete Workspace Backup
                        </span>
                        <span className="typography-metadata text-[10.5px] text-kleava-text-secondary mt-0.5">
                            Download structured JSON containing chats, memories, and personalization settings (excludes API keys).
                        </span>
                    </div>

                    <button
                        type="button"
                        disabled={isExporting}
                        onClick={handleExportData}
                        className="h-8 px-3 rounded-kleava-md bg-kleava-surface-soft text-kleava-text-primary hover:bg-kleava-surface-light hover:text-kleava-accent border border-kleava-border-subtle flex items-center space-x-1.5 text-xs font-medium transition-colors focus-ring-kleava flex-shrink-0"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
                    </button>
                </div>
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 3. Destructive Deletion & Reset Zone */}
            <SettingsSectionBlock title="Data Deletion & Reset">
                <div className="space-y-2 select-none">
                    {/* Delete Chat History */}
                    <div className="p-2.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/70 flex items-center justify-between">
                        <div className="flex flex-col pr-2">
                            <span className="typography-label text-xs font-medium text-kleava-text-primary">
                                Delete Chat History
                            </span>
                            <span className="typography-metadata text-[10px] text-kleava-text-secondary">
                                Permanently erase all conversations from this browser (memories will be preserved).
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsDeleteChatsDialogOpen(true)}
                            className="px-2.5 py-1 text-xs rounded bg-red-50 text-kleava-destructive border border-red-200 hover:bg-red-100 font-medium transition-colors flex-shrink-0"
                        >
                            Delete Chats
                        </button>
                    </div>

                    {/* Delete All Memories */}
                    <div className="p-2.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/70 flex items-center justify-between">
                        <div className="flex flex-col pr-2">
                            <span className="typography-label text-xs font-medium text-kleava-text-primary">
                                Delete All Memories
                            </span>
                            <span className="typography-metadata text-[10px] text-kleava-text-secondary">
                                Erase all saved knowledge rules (chat history will be preserved).
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsDeleteMemoriesDialogOpen(true)}
                            className="px-2.5 py-1 text-xs rounded bg-red-50 text-kleava-destructive border border-red-200 hover:bg-red-100 font-medium transition-colors flex-shrink-0"
                        >
                            Delete Memories
                        </button>
                    </div>

                    {/* Clear All Data (Factory Reset) */}
                    <div className="p-2.5 rounded-kleava-md bg-red-50/40 border border-red-200/80 flex items-center justify-between">
                        <div className="flex flex-col pr-2">
                            <span className="typography-label text-xs font-semibold text-kleava-destructive">
                                Reset All Application Data
                            </span>
                            <span className="typography-metadata text-[10px] text-kleava-text-secondary">
                                Factory reset all chats, memories, and custom configurations back to defaults.
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsFullResetDialogOpen(true)}
                            className="px-2.5 py-1 text-xs rounded bg-kleava-destructive text-white hover:opacity-90 font-medium transition-opacity flex-shrink-0"
                        >
                            Full Reset
                        </button>
                    </div>
                </div>
            </SettingsSectionBlock>

            {/* 4. Delete Chat History Confirmation Modal */}
            {isDeleteChatsDialogOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Delete All Chat History?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary leading-relaxed">
                            This will permanently delete all saved chats and message feeds from this browser. This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsDeleteChatsDialogOpen(false)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onClearChatHistory();
                                    setIsDeleteChatsDialogOpen(false);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Delete All Memories Confirmation Modal */}
            {isDeleteMemoriesDialogOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div className="w-full max-w-xs bg-kleava-surface rounded-kleava-lg border border-kleava-border-subtle shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Delete All Memory Records?
                        </span>
                        <p className="typography-metadata text-[11px] text-kleava-text-secondary leading-relaxed">
                            All stored knowledge rules across Global, Project, and Conversation scopes will be erased.
                        </p>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsDeleteMemoriesDialogOpen(false)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    clearAllMemories();
                                    setIsDeleteMemoriesDialogOpen(false);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Full Data Reset Confirmation Modal */}
            {isFullResetDialogOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-3 animate-in fade-in duration-150 select-none font-ui"
                >
                    <div className="w-full max-w-sm bg-kleava-surface rounded-kleava-lg border border-red-300 shadow-kleava-floating p-4 flex flex-col space-y-3 font-ui text-center">
                        <span className="typography-label text-xs font-semibold text-kleava-destructive">
                            Reset All Application Data?
                        </span>
                        <div className="p-2.5 rounded bg-red-50 text-[11px] text-left text-red-900 space-y-1">
                            <p className="font-semibold">This factory reset will erase:</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-[10.5px]">
                                <li>All conversation threads and messages</li>
                                <li>All memory rules and knowledge context</li>
                                <li>All customized model profiles and parameters</li>
                                <li>All general and personalization preferences</li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-center space-x-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsFullResetDialogOpen(false)}
                                className="px-3 py-1 text-xs rounded bg-kleava-surface-soft text-kleava-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    resetAllApplicationData();
                                    onClearChatHistory();
                                    setIsFullResetDialogOpen(false);
                                }}
                                className="px-3 py-1 text-xs rounded bg-kleava-destructive text-white font-medium hover:opacity-90"
                            >
                                Yes, Reset Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsContent>
    );
}

export default PrivacySettings;