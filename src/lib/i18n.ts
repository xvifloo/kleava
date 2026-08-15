import { LanguageCode } from '@/types';

/**
 * KLEAVA AI — CENTRALIZED UI TRANSLATION DICTIONARY
 */
export const TRANSLATIONS = {
    en: {
        // Navigation & Header
        newChat: 'New Chat',
        chat: 'Chat',
        project: 'Project',
        settings: 'Settings',
        searchChats: 'Search chats...',
        noChatsFound: 'No chats found.',
        noRecentChats: 'No recent chats yet.',
        clearSearch: 'Clear search',
        workspaceReady: 'Workspace Ready',

        // General Settings
        generalSettingsTitle: 'General',
        generalSettingsDesc: 'Manage visual appearance, language, typography scale, and workspace density.',
        appearance: 'Appearance',
        colorTheme: 'Color Theme',
        colorThemeDesc: 'Choose between Light, Dark, or System mode',
        accentColor: 'Accent Color',
        accentColorDesc: 'Primary brand tint applied to interactive controls and active indicators',
        customHex: 'Custom Hex',
        languageAndScale: 'Language & Scale',
        language: 'Language',
        languageDesc: 'Application interface and system default script',
        contentFontSize: 'Content Font Size',
        contentFontSizeDesc: 'Scale document and conversation reading baseline',
        preferencesAndAccessibility: 'Preferences & Accessibility',
        autoSave: 'Auto Save History',
        autoSaveDesc: 'Persist chat sessions and configurations automatically',
        compactMode: 'Compact Mode',
        compactModeDesc: 'Reduce spacing density across workspace rows and containers',
        reduceMotion: 'Reduce Motion',
        reduceMotionDesc: 'Minimize transition and rotational animations',
        soundFeedback: 'Sound Feedback',
        soundFeedbackDesc: 'Play audio cues on completion and microphone feedback',

        // Actions
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        copy: 'Copy',
        copied: 'Copied',
        back: 'Back',
    },
    bn: {
        // Navigation & Header
        newChat: 'নতুন চ্যাট',
        chat: 'চ্যাট',
        project: 'প্রজেক্ট',
        settings: 'সেটিংস',
        searchChats: 'চ্যাট খুঁজুন...',
        noChatsFound: 'কোনো চ্যাট পাওয়া যায়নি।',
        noRecentChats: 'কোনো সাম্প্রতিক চ্যাট নেই।',
        clearSearch: 'সার্চ ক্লিয়ার করুন',
        workspaceReady: 'ওয়ার্কস্পেস প্রস্তুত',

        // General Settings
        generalSettingsTitle: 'সাধারণ (General)',
        generalSettingsDesc: 'অ্যাপ্লিকেশনের থিম, অ্যাকসেন্ট কালার, ভাষা, ফন্ট সাইজ এবং স্পেসিং ঘনত্ব পরিচালনা করুন।',
        appearance: 'অ্যাপেয়ারেন্স (Appearance)',
        colorTheme: 'কালার থিম',
        colorThemeDesc: 'লাইট, ডার্ক অথবা সিস্টেম মোড নির্বাচন করুন',
        accentColor: 'অ্যাকসেন্ট কালার',
        accentColorDesc: 'ইন্টারেক্টিভ কন্ট্রোল ও সক্রিয় ইন্ডিকেটরের মূল ব্র্যান্ড কালার',
        customHex: 'কাস্টম হেক্স',
        languageAndScale: 'ভাষা ও ফন্ট স্কেল',
        language: 'ভাষা (Language)',
        languageDesc: 'অ্যাপ্লিকেশন ইন্টারফেস এবং সিস্টেম ডিফল্ট ভাষা',
        contentFontSize: 'কনটেন্ট ফন্ট সাইজ',
        contentFontSizeDesc: 'ডকুমেন্ট ও কনভার্সেশন পড়ার ফন্ট স্কেল সমন্বয় করুন',
        preferencesAndAccessibility: 'পছন্দ ও অ্যাক্সেসিবিলিটি',
        autoSave: 'অটো সেভ হিস্ট্রি',
        autoSaveDesc: 'চ্যাট সেশন ও কনফিগারেশন স্বয়ংক্রিয়ভাবে লোকাল মেমোরিতে সংরক্ষণ করুন',
        compactMode: 'কমপ্যাক্ট মোড',
        compactModeDesc: 'ওয়ার্কস্পেস রো ও কনটেইনারের স্পেসিং ঘনত্ব কিছুটা কমিয়ে আনুন',
        reduceMotion: 'মোশন হ্রাস করুন',
        reduceMotionDesc: 'ট্রানজিশন ও ঘূর্ণন অ্যানিমেশন কমিয়ে আনুন',
        soundFeedback: 'সাউন্ড ফিডব্যাক',
        soundFeedbackDesc: 'টাস্ক সম্পন্ন হলে ও মাইক ফিডব্যাকে অডিও কিউ চালু রাখুন',

        // Actions
        save: 'সংরক্ষণ',
        cancel: 'বাতিল',
        delete: 'মুছুন',
        edit: 'সম্পাদনা',
        copy: 'কপি',
        copied: 'কপি হয়েছে',
        back: 'পেছনে',
    },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

/**
 * Type-safe translation lookup helper.
 */
export function t(key: TranslationKey, lang: LanguageCode = 'en'): string {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
}