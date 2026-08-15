import { NotificationSettings, NotificationType } from '@/types';

export interface NotificationPayload {
    title: string;
    message: string;
    type: NotificationType;
    metadata?: Record<string, unknown>;
}

/**
 * Checks if a specific notification type is allowed based on user preferences.
 */
export function isNotificationAllowed(
    type: NotificationType,
    settings: NotificationSettings
): boolean {
    if (!settings.enabled) return false;
    return Boolean(settings[type]);
}

/**
 * Clean client-side notification dispatcher boundary.
 * Ready for future In-App toast alerts, Audio bells, and Web Push integrations.
 */
export function dispatchNotification(
    payload: NotificationPayload,
    settings: NotificationSettings
): boolean {
    if (!isNotificationAllowed(payload.type, settings)) {
        return false;
    }

    // Audio feedback trigger if enabled
    if (settings.soundEffects && typeof window !== 'undefined') {
        // Non-intrusive UI chime foundation
    }

    return true;
}