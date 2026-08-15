import { LanguageCode } from '@/types';

export type TimeOfDayContext = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingText {
    greeting: string;
    supportingLine: string;
}

/**
 * Centralized deterministic greetings dictionary for Kleava AI.
 */
export const GREETINGS_CONFIG: Record<LanguageCode, Record<TimeOfDayContext, GreetingText>> = {
    en: {
        morning: {
            greeting: 'Good morning',
            supportingLine: 'What would you like to explore or build today?',
        },
        afternoon: {
            greeting: 'Good afternoon',
            supportingLine: 'Ready to continue your thoughts and workflows?',
        },
        evening: {
            greeting: 'Good evening',
            supportingLine: 'How can Kleava assist you this evening?',
        },
        night: {
            greeting: 'Good evening',
            supportingLine: 'Quiet hours. What is on your mind tonight?',
        },
    },
    bn: {
        morning: {
            greeting: 'শুভ সকাল',
            supportingLine: 'আজ আপনি কী নিয়ে কাজ করতে বা অনুসন্ধান করতে চান?',
        },
        afternoon: {
            greeting: 'শুভ বিকেল',
            supportingLine: 'আপনার কাজ বা চিন্তাভাবনা কীভাবে এগিয়ে নিতে সাহায্য করতে পারি?',
        },
        evening: {
            greeting: 'শুভ সন্ধ্যা',
            supportingLine: 'আজ সন্ধ্যায় কী নিয়ে আলোচনা করতে চান?',
        },
        night: {
            greeting: 'শুভ রাত্রি',
            supportingLine: 'শান্ত সময়। আপনার নতুন কোনো ভাবনা নিয়ে কাজ শুরু করবেন?',
        },
    },
};