'use client';

import React, { useState } from 'react';
import { useSettings } from '@/state/settings-context';
import { NotificationFeed } from '@/components/layout/notification-feed';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

/**
 * NotificationSettings: Complete preferences for AI Responses, Chat Activity,
 * System Updates, Errors & Warnings, Memory Events, Audio, and In-App Feed.
 */
export function NotificationSettings() {
    const { notifications, updateNotifications } = useSettings();
    const [activeTab, setActiveTab] = useState<'preferences' | 'feed'>('preferences');

    const isMasterEnabled = notifications.enabled;

    return (
        <SettingsContent
            sectionId="notifications"
            title="Notifications & Alerts"
            description="Manage event alerts, sound effects, background notices, and view in-app activity."
        >
            {/* View Switcher Tabs */}
            <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none mb-1">
                <button
                    type="button"
                    onClick={() => setActiveTab('preferences')}
                    className={cn(
                        'flex-1 py-1 text-center rounded-kleava-sm typography-metadata text-[10.5px] font-medium transition-all',
                        activeTab === 'preferences'
                            ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                            : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                    )}
                >
                    Preferences
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className={cn(
                        'flex-1 py-1 text-center rounded-kleava-sm typography-metadata text-[10.5px] font-medium transition-all',
                        activeTab === 'feed'
                            ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                            : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                    )}
                >
                    Notification Inbox
                </button>
            </div>

            {activeTab === 'feed' ? (
                /* In-App Notifications Feed Inbox */
                <NotificationFeed />
            ) : (
                /* Notification Preferences Form */
                <>
                    {/* 1. Master Toggle Section */}
                    <SettingsSectionBlock title="Alert Center">
                        <SettingsRow
                            label="Allow Notifications"
                            description="Master toggle for all non-critical notifications and task alerts"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isMasterEnabled}
                                    onClick={() => updateNotifications({ enabled: !isMasterEnabled })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />
                    </SettingsSectionBlock>

                    <SettingsDivider />

                    {/* 2. Notification Event Categories */}
                    <SettingsSectionBlock
                        title="Event Categories"
                        className={cn('transition-opacity duration-150', !isMasterEnabled && 'opacity-50 pointer-events-none')}
                    >
                        {/* AI Responses */}
                        <SettingsRow
                            label="AI Responses"
                            description="Alerts upon completion of long-running responses or tasks"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.aiResponses}
                                    onClick={() => updateNotifications({ aiResponses: !notifications.aiResponses })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.aiResponses && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.aiResponses && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />

                        {/* Chat Activity */}
                        <SettingsRow
                            label="Chat Activity"
                            description="Notices for background conversation updates and branch operations"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.chatActivity}
                                    onClick={() => updateNotifications({ chatActivity: !notifications.chatActivity })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.chatActivity && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.chatActivity && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />

                        {/* Errors & Warnings */}
                        <SettingsRow
                            label="Errors & Warnings"
                            description="Alerts when generation streams or model connections fail"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.errorsAndWarnings}
                                    onClick={() => updateNotifications({ errorsAndWarnings: !notifications.errorsAndWarnings })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.errorsAndWarnings && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.errorsAndWarnings && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />

                        {/* Memory Events */}
                        <SettingsRow
                            label="Memory Events"
                            description="Notices when new knowledge rules are saved or suggested"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.memoryEvents}
                                    onClick={() => updateNotifications({ memoryEvents: !notifications.memoryEvents })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.memoryEvents && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.memoryEvents && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />

                        {/* System Updates */}
                        <SettingsRow
                            label="System Updates"
                            description="Notices for Kleava release notes and capability updates"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.systemUpdates}
                                    onClick={() => updateNotifications({ systemUpdates: !notifications.systemUpdates })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.systemUpdates && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.systemUpdates && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />
                    </SettingsSectionBlock>

                    <SettingsDivider />

                    {/* 3. Audio & Delivery Channels */}
                    <SettingsSectionBlock
                        title="Audio & Delivery"
                        className={cn('transition-opacity duration-150', !isMasterEnabled && 'opacity-50 pointer-events-none')}
                    >
                        {/* Sound Toggle */}
                        <SettingsRow
                            label="Sound Chimes"
                            description="Play gentle audio cues on task completion and notifications"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.sound}
                                    onClick={() => updateNotifications({ sound: !notifications.sound })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.sound && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.sound && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />

                        {/* Desktop Alerts */}
                        <SettingsRow
                            label="Desktop Alerts"
                            description="Show OS desktop notifications when the app tab is inactive"
                            control={
                                <button
                                    type="button"
                                    role="switch"
                                    disabled={!isMasterEnabled}
                                    aria-checked={notifications.desktopAlerts}
                                    onClick={() => updateNotifications({ desktopAlerts: !notifications.desktopAlerts })}
                                    className={cn(
                                        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                        notifications.desktopAlerts && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                            notifications.desktopAlerts && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                        )}
                                    />
                                </button>
                            }
                        />
                    </SettingsSectionBlock>
                </>
            )}
        </SettingsContent>
    );
}

export default NotificationSettings;