import { LanguageCode } from '@/types';

export type TimeOfDayContext = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingOption {
    greeting: string;
    supportingLine: string;
}

/**
 * KLEAVA AI — DYNAMIC CONTEXTUAL GREETINGS DICTIONARY
 * Curated natural variations across time-of-day contexts in English & Bengali.
 */
export const GREETINGS_CONFIG: Record<
    LanguageCode,
    Record<TimeOfDayContext, GreetingOption[]>
> = {
    en: {
        morning: [
            {
                greeting: 'Good morning',
                supportingLine: 'What would you like to explore, write, or design today?',
            },
            {
                greeting: 'Ready to create',
                supportingLine: 'Start a conversation, solve code, or structure your thoughts.',
            },
            {
                greeting: 'Fresh perspective',
                supportingLine: 'How can Kleava assist with your morning workflow?',
            },
        ],
        afternoon: [
            {
                greeting: 'Good afternoon',
                supportingLine: 'Ready to continue your projects, analysis, and ideas?',
            },
            {
                greeting: 'Focus hours',
                supportingLine: 'What challenge would you like to tackle right now?',
            },
            {
                greeting: 'Midday momentum',
                supportingLine: 'Bring your code, drafts, or queries to explore.',
            },
        ],
        evening: [
            {
                greeting: 'Good evening',
                supportingLine: 'How can Kleava assist you with your thoughts this evening?',
            },
            {
                greeting: 'Winding down & creating',
                supportingLine: 'Refine your concepts, review knowledge, or explore new ideas.',
            },
            {
                greeting: 'Evening clarity',
                supportingLine: 'Where should we begin tonight?',
            },
        ],
        night: [
            {
                greeting: 'Late-night focus',
                supportingLine: 'Quiet hours for deep thinking, writing, and coding.',
            },
            {
                greeting: 'Good evening',
                supportingLine: 'Calm ideas and thoughtful responses whenever you are ready.',
            },
            {
                greeting: 'Night hours',
                supportingLine: 'What is on your mind tonight?',
            },
        ],
    },
    bn: {
        morning: [
            {
                greeting: 'শুভ সকাল',
                supportingLine: 'আজ আপনি কী নিয়ে কাজ করতে, লিখতে বা ডিজাইন করতে চান?',
            },
            {
                greeting: 'নতুন শুরুর প্রহর',
                supportingLine: 'আপনার কাজ বা চিন্তাভাবনা কীভাবে এগিয়ে নিতে সাহায্য করতে পারি?',
            },
            {
                greeting: 'সকালের অনুপ্রেরণা',
                supportingLine: 'কোন বিষয় নিয়ে আলোচনা শুরু করতে চান?',
            },
        ],
        afternoon: [
            {
                greeting: 'শুভ বিকেল',
                supportingLine: 'আপনার কাজ, কোড বা পরিকল্পনা আরও এগিয়ে নেওয়ার সময়।',
            },
            {
                greeting: 'কাজের গতি',
                supportingLine: 'এখন কোন জটিল সমস্যা বা প্রজেক্ট নিয়ে সমাধান খুঁজবেন?',
            },
            {
                greeting: 'চিন্তার বিকাশ',
                supportingLine: 'আপনার যেকোনো ভাবনা বা প্রশ্ন নিয়ে শুরু করুন।',
            },
        ],
        evening: [
            {
                greeting: 'শুভ সন্ধ্যা',
                supportingLine: 'আজ সন্ধ্যায় কী বিষয় নিয়ে অনুসন্ধান বা পর্যালোচনা করতে চান?',
            },
            {
                greeting: 'শান্ত সন্ধ্যা',
                supportingLine: 'আপনার আইডিয়াগুলোকে পরিশীলিত ও স্পষ্ট রূপ দেওয়ার সুযোগ।',
            },
            {
                greeting: 'সন্ধ্যায় স্বাগত',
                supportingLine: 'কোথা থেকে আমাদের কথোপকথন শুরু করব?',
            },
        ],
        night: [
            {
                greeting: 'গভীর রাতের ভাবনা',
                supportingLine: 'মনোযোগ দিয়ে কোডিং, লেখা বা গভীর বিশ্লেষণের সেরা সময়।',
            },
            {
                greeting: 'শুভ রাত্রি',
                supportingLine: 'শান্ত সময়ে আপনার নতুন কোনো আইডিয়া নিয়ে এক্সপ্লোর করুন।',
            },
            {
                greeting: 'নিস্তব্ধ প্রহর',
                supportingLine: 'আজ রাতে আপনার মনে কোন বিষয়টি ঘুরপাক খাচ্ছে?',
            },
        ],
    },
};