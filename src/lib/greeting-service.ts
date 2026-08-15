import { LanguageCode } from '@/types';
import { GREETINGS_CONFIG, TimeOfDayContext, GreetingText } from '@/config/greetings';

/**
 * Derives the active time-of-day bracket from client system time.
 */
export function getTimeOfDayContext(date: Date = new Date()): TimeOfDayContext {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
}

/**
 * Deterministically resolves contextual greeting text with user name formatting.
 */
export function resolveGreeting({
    language = 'en',
    userName,
    date = new Date(),
}: {
    language?: LanguageCode;
    userName?: string;
    date?: Date;
}): { heading: string; supporting: string } {
    const timeContext = getTimeOfDayContext(date);
    const langConfig = GREETINGS_CONFIG[language] || GREETINGS_CONFIG.en;
    const greetingData: GreetingText = langConfig[timeContext] || langConfig.morning;

    let heading = greetingData.greeting;
    if (userName && userName.trim().length > 0) {
        heading = `${greetingData.greeting}, ${userName.trim()}`;
    }

    return {
        heading,
        supporting: greetingData.supportingLine,
    };
}