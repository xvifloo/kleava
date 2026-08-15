'use client';

import React from 'react';
import { useSettings } from '@/state/settings-context';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

/**
 * NotificationSettings: Preferences for Chat Activity, Task Alerts,
 * System Updates, Sound Effects, and Desktop Notification channels.
 */
export function NotificationSettings() {
    const { notifications, updateNotifications } = useSettings();

    const isMasterEnabled = notifications.enabled;

    return (
        <SettingsContent
            sectionId="notifications"
            title="Notifications"
            description="Configure alert triggers, background task completion notices, and audio feedback."
        >
            {/* 1. Master Toggle Section */}
            <SettingsSectionBlock title="Alert Center">
                <SettingsRow
                    label="Allow Notifications"
                    description="Master toggle for all non-critical notifications and task completion alerts"
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

            {/* 2. Activity & Task Alerts */}
            <SettingsSectionBlock
                title="Activity & Tasks"
                className={cn('transition-opacity duration-150', !isMasterEnabled && 'opacity-50 pointer-events-none')}
            >
                {/* Chat Activity Toggle */}
                <SettingsRow
                    label="Chat Activity"
                    description="Notifications for background chat updates and responses"
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

                {/* Task Completed Toggle */}
                <SettingsRow
                    label="Task Completed"
                    description="Alerts when long-running AI operations or exports finish"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.taskCompleted}
                            onClick={() => updateNotifications({ taskCompleted: !notifications.taskCompleted })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.taskCompleted && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.taskCompleted && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Error Alerts Toggle */}
                <SettingsRow
                    label="Error Alerts"
                    description="Notifications when generation or network requests fail"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.errorAlerts}
                            onClick={() => updateNotifications({ errorAlerts: !notifications.errorAlerts })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.errorAlerts && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.errorAlerts && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 3. System & Knowledge Updates */}
            <SettingsSectionBlock
                title="System & Knowledge"
                className={cn('transition-opacity duration-150', !isMasterEnabled && 'opacity-50 pointer-events-none')}
            >
                {/* Memory Updates Toggle */}
                <SettingsRow
                    label="Memory Updates"
                    description="Alerts when new context rules or memory items are created"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.memoryUpdates}
                            onClick={() => updateNotifications({ memoryUpdates: !notifications.memoryUpdates })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.memoryUpdates && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.memoryUpdates && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Model Updates Toggle */}
                <SettingsRow
                    label="Model Updates"
                    description="Notifications when AI models or providers are added or updated"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.modelUpdates}
                            onClick={() => updateNotifications({ modelUpdates: !notifications.modelUpdates })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.modelUpdates && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.modelUpdates && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* System Updates Toggle */}
                <SettingsRow
                    label="System Notices"
                    description="Important updates and release announcements"
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

            {/* 4. Sound & Delivery Channels */}
            <SettingsSectionBlock
                title="Delivery & Audio"
                className={cn('transition-opacity duration-150', !isMasterEnabled && 'opacity-50 pointer-events-none')}
            >
                {/* Sound Effects Toggle */}
                <SettingsRow
                    label="Sound Effects"
                    description="Play subtle audio cues on task completion and user actions"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.soundEffects}
                            onClick={() => updateNotifications({ soundEffects: !notifications.soundEffects })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.soundEffects && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.soundEffects && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Voice Auto-Play Toggle */}
                <SettingsRow
                    label="Voice Auto-Play"
                    description="Automatically read aloud new assistant responses"
                    control={
                        <button
                            type="button"
                            role="switch"
                            disabled={!isMasterEnabled}
                            aria-checked={notifications.voiceAutoPlay}
                            onClick={() => updateNotifications({ voiceAutoPlay: !notifications.voiceAutoPlay })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                notifications.voiceAutoPlay && isMasterEnabled ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    notifications.voiceAutoPlay && isMasterEnabled ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Desktop Alerts Toggle */}
                <SettingsRow
                    label="Desktop Notifications"
                    description="Show system desktop alerts when Kleava tab is in the background"
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
        </SettingsContent>
    );
}

export default NotificationSettings;