import { LanguageCode } from '@/types';
import { GREETINGS_CONFIG, TimeOfDayContext, GreetingOption } from '@/config/greetings';

/**
 * Derives the active time-of-day context from client local time.
 */
export function getTimeOfDayContext(date: Date = new Date()): TimeOfDayContext {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
}

/**
 * Resolves a dynamic, natural greeting based on local time, language,
 * and user profile display name with controlled session variance.
 */
export function resolveGreeting({
    language = 'en',
    userName,
    date = new Date(),
    seed = 0,
}: {
    language?: LanguageCode;
    userName?: string;
    date?: Date;
    seed?: number;
}): { heading: string; supporting: string } {
    const timeContext = getTimeOfDayContext(date);
    const langConfig = GREETINGS_CONFIG[language] || GREETINGS_CONFIG.en;
    const optionsList: GreetingOption[] = langConfig[timeContext] || langConfig.morning;

    // Controlled index selection (stable per session seed or date hour)
    const index = Math.abs(seed + date.getHours()) % optionsList.length;
    const selected: GreetingOption = optionsList[index] || optionsList[0];

    let heading = selected.greeting;
    if (userName && userName.trim().length > 0) {
        const trimmedName = userName.trim();
        if (language === 'bn') {
            heading = `${selected.greeting}, ${trimmedName}`;
        } else {
            heading = `${selected.greeting}, ${trimmedName}`;
        }
    }

    return {
        heading,
        supporting: selected.supportingLine,
    };
}