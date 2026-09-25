import {
    NotificationSettings,
    NotificationCategory,
    NotificationSeverity,
    NotificationRecord,
} from '@/types';

export interface CreateNotificationInput {
    type: NotificationCategory;
    title: string;
    message: string;
    severity?: NotificationSeverity;
    source?: string;
}

/**
 * Validates if notification category is enabled under master & category preferences.
 */
export function isNotificationCategoryAllowed(
    type: NotificationCategory,
    settings: NotificationSettings
): boolean {
    if (!settings.enabled) return false;
    return Boolean(settings[type]);
}

/**
 * Generates a subtle, non-intrusive Web Audio chime when sound is enabled.
 */
export function playNotificationChime(soundEnabled: boolean) {
    if (!soundEnabled || typeof window === 'undefined') return;

    try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 tone
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5 chime

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    } catch {
        // Safe audio fallback
    }
}

/**
 * Creates and formats a sanitized notification record.
 */
export function createNotificationRecord(
    input: CreateNotificationInput
): NotificationRecord {
    return {
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: input.type,
        title: input.title.slice(0, 100),
        message: input.message.slice(0, 300),
        severity: input.severity || 'info',
        source: input.source || 'Kleava System',
        timestamp: new Date().toISOString(),
        read: false,
    };
}