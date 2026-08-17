import { LanguageCode } from '@/types';

/**
 * KLEAVA AI — CENTRALIZED UI TRANSLATION DICTIONARY
 * Complete localization catalog for Navigation, Composer, Settings, Chat Actions & History.
 */
export const TRANSLATIONS = {
    en: {
        // Top Navigation & Menu
        newChat: 'New Chat',
        chat: 'Chat',
        project: 'Projects',
        incognitoMode: 'Incognito Mode',
        exitIncognito: 'Exit Incognito',
        incognitoSession: 'Incognito Session',
        archive: 'Archive',
        archivedChats: 'Archived Chats',
        settings: 'Settings',
        searchChats: 'Search chats, settings, models, memory...',
        noChatsFound: 'No chats found.',
        noRecentChats: 'No recent chats yet.',
        noArchivedChats: 'No archived conversations.',
        clearSearch: 'Clear search',
        workspaceReady: 'Workspace Ready',
        menu: 'Menu',
        archivedBadge: 'Archived',

        // Chat History & Groups
        pinned: 'Pinned',
        today: 'Today',
        yesterday: 'Yesterday',
        previous7Days: 'Previous 7 Days',
        older: 'Older',
        pinAction: 'Pin',
        unpinAction: 'Unpin',
        renameAction: 'Rename',
        archiveAction: 'Archive',
        unarchiveAction: 'Unarchive',
        deleteAction: 'Delete',
        confirmDelete: 'Delete this chat?',
        yes: 'Yes',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        copy: 'Copy',
        copied: 'Copied',
        editedBadge: '(edited)',
        justNow: 'Just now',
        minuteAgo: '1 minute ago',
        minutesAgo: 'minutes ago',
        hourAgo: '1 hour ago',
        hoursAgo: 'hours ago',
        daysAgo: 'days ago',

        // Composer & Interactions
        composerPlaceholder: 'Ask anything in Bangla or English...',
        chatWithKleava: 'Chat with Kleava...',
        addAttachment: 'Add attachment',
        dropFiles: 'Drop files to attach',
        voiceInput: 'Voice input',
        stopListening: 'Stop listening',
        sendMessage: 'Send message',
        stopGenerating: 'Stop generating response',
        selectModel: 'Select AI model',

        // Settings Navigation & Header
        settingsTitle: 'Settings',
        searchSettingsPlaceholder: 'Search settings, models, preferences...',
        noSettingsFound: 'No matching settings found.',
        back: 'Back',

        // Settings Categories
        categoryGeneral: 'General',
        categoryModels: 'AI Models',
        categoryMemory: 'Memory',
        categoryNotifications: 'Notifications',
        categoryPersonalization: 'Personalization',
        categoryPrivacy: 'Privacy & Data',
        categoryShortcuts: 'Shortcuts',
        categoryAbout: 'About',

        // General Settings
        generalSettingsTitle: 'General',
        generalSettingsDesc: 'Manage visual appearance, language, typography scale, and workspace density.',
        appearance: 'Appearance',
        colorTheme: 'Color Theme',
        colorThemeDesc: 'Choose between Light, Dark, or System mode',
        accentColor: 'Accent Color',
        accentColorDesc: 'Primary brand tint applied to interactive controls and indicators',
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

        // User Profile
        guestUser: 'Guest User',
        clickToSignIn: 'Click to Sign in',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        logOut: 'Log Out',
    },
    bn: {
        // Top Navigation & Menu
        newChat: 'নতুন চ্যাট',
        chat: 'চ্যাট',
        project: 'প্রজেক্টস',
        incognitoMode: 'ইনকগনিটো মোড',
        exitIncognito: 'ইনকগনিটো বন্ধ',
        incognitoSession: 'ইনকগনিটো সেশন',
        archive: 'আর্কাইভ',
        archivedChats: 'আর্কাইভড চ্যাটসমূহ',
        settings: 'সেটিংস',
        searchChats: 'চ্যাট, সেটিংস, মডেল বা মেমোরি খুঁজুন...',
        noChatsFound: 'কোনো ফলাফল পাওয়া যায়নি।',
        noRecentChats: 'কোনো সাম্প্রতিক চ্যাট নেই।',
        noArchivedChats: 'কোনো আর্কাইভড চ্যাট নেই।',
        clearSearch: 'সার্চ মুছুন',
        workspaceReady: 'ওয়ার্কস্পেস প্রস্তুত',
        menu: 'মেনু',
        archivedBadge: 'আর্কাইভড',

        // Chat History & Groups
        pinned: 'পিন্ড',
        today: 'আজ',
        yesterday: 'গতকাল',
        previous7Days: 'গত ৭ দিন',
        older: 'আগের',
        pinAction: 'পিন করুন',
        unpinAction: 'আনপিন করুন',
        renameAction: 'নাম পরিবর্তন',
        archiveAction: 'আর্কাইভ করুন',
        unarchiveAction: 'আনআর্কাইভ করুন',
        deleteAction: 'মুছুন',
        confirmDelete: 'এই চ্যাটটি মুছে ফেলবেন?',
        yes: 'হ্যাঁ',
        cancel: 'বাতিল',
        save: 'সংরক্ষণ',
        edit: 'সম্পাদনা',
        copy: 'কপি',
        copied: 'কপি হয়েছে',
        editedBadge: '(সম্পাদিত)',
        justNow: 'এইমাত্র',
        minuteAgo: '১ মিনিট আগে',
        minutesAgo: 'মিনিট আগে',
        hourAgo: '১ ঘণ্টা আগে',
        hoursAgo: 'ঘণ্টা আগে',
        daysAgo: 'দিন আগে',

        // Composer & Interactions
        composerPlaceholder: 'বাংলা বা ইংরেজিতে যা ইচ্ছা জিজ্ঞাসা করুন...',
        chatWithKleava: 'ক্লিভার সাথে চ্যাট করুন...',
        addAttachment: 'ফাইল যুক্ত করুন',
        dropFiles: 'যুক্ত করতে ফাইল ড্রপ করুন',
        voiceInput: 'ভয়েস ইনপুট',
        stopListening: 'শোনা বন্ধ করুন',
        sendMessage: 'মেসেজ পাঠান',
        stopGenerating: 'রেসপন্স তৈরি থামান',
        selectModel: 'এআই মডেল নির্বাচন',

        // Settings Navigation & Header
        settingsTitle: 'সেটিংস',
        searchSettingsPlaceholder: 'সেটিংস, মডেল, পছন্দ খুঁজুন...',
        noSettingsFound: 'কোনো সেটিংস পাওয়া যায়নি।',
        back: 'পেছনে',

        // Settings Categories
        categoryGeneral: 'সাধারণ',
        categoryModels: 'এআই মডেলস',
        categoryMemory: 'মেমোরি',
        categoryNotifications: 'নোটিফিকেশনস',
        categoryPersonalization: 'পারসোনালাইজেশন',
        categoryPrivacy: 'প্রাইভেসি ও ডেটা',
        categoryShortcuts: 'শর্টকাটস',
        categoryAbout: 'সম্পর্কে',

        // General Settings
        generalSettingsTitle: 'সাধারণ সেটিংস (General)',
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

        // User Profile
        guestUser: 'গেস্ট ইউজার',
        clickToSignIn: 'সাইন ইন করতে ক্লিক করুন',
        signIn: 'সাইন ইন',
        signUp: 'সাইন আপ',
        logOut: 'লগ আউট',
    },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

/**
 * Type-safe translation lookup helper.
 */
export function t(key: TranslationKey, lang: LanguageCode = 'en'): string {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return (dict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
}