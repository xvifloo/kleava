'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    GeneralSettings,
    ModelProfile,
    ModelGenerationConfig,
    MemoryRecord,
    NotificationSettings,
    NotificationRecord,
    NotificationCategory,
    NotificationSeverity,
    PersonalizationSettings,
    PrivacySettings,
    KeyboardShortcutItem,
    ChatSession,
    ChatMessage,
    UserProfile as UserProfileType,
} from '@/types';
import {
    BUILTIN_MODELS,
    DEFAULT_MODEL_ID,
    DEFAULT_GENERATION_CONFIG,
    GENERATION_PRESETS,
    GenerationPreset,
} from '@/config/models';
import { DEFAULT_SHORTCUTS } from '@/config/shortcuts';
import {
    isNotificationCategoryAllowed,
    playNotificationChime,
    createNotificationRecord,
} from '@/lib/notification-service';

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    theme: 'light',
    accentColor: '#17BC9B', // Canonical Kleava Mint
    language: 'en',
    fontSize: 'medium',
    autoSave: true,
    compactMode: false,
    reduceMotion: false,
    soundEffects: true,
};

export const DEFAULT_USER: UserProfileType = {
    id: 'usr_1',
    name: 'Nafis',
    email: 'nafis@xvifloo.com',
    plan: 'Workspace Pro',
};

export const DEFAULT_PERSONALIZATION_SETTINGS: PersonalizationSettings = {
    responseStyle: 'balanced',
    tone: 'neutral',
    responseLanguage: 'match_input',
    formattingStyle: 'structured',
    detailLevel: 'balanced',
    emojiUsage: 'minimal',
    technicalDepth: 'standard',
    proactiveBehavior: 'balanced',
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
    saveChatHistory: true,
    enableMemoryPrivacy: true,
    analyticsTelemetry: false,
    modelTrainingOptOut: true,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    enabled: true,
    aiResponses: true,
    chatActivity: true,
    systemUpdates: false,
    errorsAndWarnings: true,
    memoryEvents: true,
    sound: true,
    voiceAutoPlay: false,
    desktopAlerts: false,
};

export const INITIAL_SAMPLE_MEMORIES: MemoryRecord[] = [
    {
        id: 'mem_1',
        title: 'Response Tone & Style',
        content: 'Prefer concise, calm, and technically precise answers in clean mixed Bangla and English.',
        type: 'Preference',
        source: 'Manual',
        scope: 'Global',
        usage: 'always',
        enabled: true,
        pinned: true,
        tags: ['tone', 'language'],
        version: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
        id: 'mem_2',
        title: 'TypeScript Coding Rules',
        content: 'Always use strict typing, avoid `any`, prefer functional components with Tailwind CSS.',
        type: 'Instruction',
        source: 'Manual',
        scope: 'Global',
        usage: 'relevant',
        enabled: true,
        pinned: false,
        tags: ['typescript', 'code'],
        version: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: 'mem_3',
        title: 'Design System Tokens',
        content: 'Canonical background is #F1FFF9, primary accent is #17BC9B, corner radiuses are 6px and 25px.',
        type: 'Project',
        source: 'Manual',
        scope: 'Project',
        usage: 'relevant',
        enabled: true,
        pinned: false,
        tags: ['design-tokens'],
        version: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const GENERAL_STORAGE_KEY = 'kleava_general_settings';
const AUTH_USER_STORAGE_KEY = 'kleava_authenticated_user';
const PERSONALIZATION_STORAGE_KEY = 'kleava_personalization_settings';
const PRIVACY_STORAGE_KEY = 'kleava_privacy_settings_v2';
const SHORTCUTS_STORAGE_KEY = 'kleava_keyboard_shortcuts_v2';
const CUSTOM_MODELS_STORAGE_KEY = 'kleava_custom_models';
const ACTIVE_MODEL_STORAGE_KEY = 'kleava_active_model_id';
const GENERATION_CONFIG_STORAGE_KEY = 'kleava_generation_config';
const USE_MEMORY_STORAGE_KEY = 'kleava_use_memory';
const AUTO_SUGGEST_MEMORY_STORAGE_KEY = 'kleava_auto_suggest_memory';
const INJECT_MEMORY_STORAGE_KEY = 'kleava_inject_memory';
const MEMORIES_STORAGE_KEY = 'kleava_memories_v2';
const NOTIFICATIONS_STORAGE_KEY = 'kleava_notification_settings_v2';
const NOTIFICATION_EVENTS_STORAGE_KEY = 'kleava_notification_events_v2';
const CREDENTIALS_STORAGE_KEY = 'kleava_provider_credentials_secure';
const CHATS_STORAGE_KEY = 'kleava_saved_chats_v2';

interface SettingsContextType {
    settings: GeneralSettings;
    personalization: PersonalizationSettings;
    privacy: PrivacySettings;
    shortcuts: KeyboardShortcutItem[];
    currentUser: UserProfileType | null;
    activeModelId: string;
    models: ModelProfile[];
    generationConfig: ModelGenerationConfig;
    useMemory: boolean;
    autoSuggestMemories: boolean;
    injectMemoryInContext: boolean;
    memories: MemoryRecord[];
    notifications: NotificationSettings;
    notificationEvents: NotificationRecord[];
    unreadNotificationCount: number;
    updateSettings: (partial: Partial<GeneralSettings>) => void;
    updatePersonalization: (partial: Partial<PersonalizationSettings>) => void;
    updatePrivacy: (partial: Partial<PrivacySettings>) => void;
    loginUser: (user: UserProfileType) => void;
    logoutUser: () => void;
    updateShortcut: (id: string, keys: string[]) => boolean;
    toggleShortcutEnabled: (id: string) => void;
    resetShortcut: (id: string) => void;
    resetAllShortcuts: () => void;
    setActiveModelId: (modelId: string) => void;
    updateGenerationConfig: (partial: Partial<ModelGenerationConfig>) => void;
    applyGenerationPreset: (preset: GenerationPreset) => void;
    addCustomModel: (model: Omit<ModelProfile, 'isCustom' | 'type'>) => boolean;
    updateCustomModel: (id: string, model: Partial<ModelProfile>) => void;
    deleteCustomModel: (id: string) => void;
    configureProviderKey: (provider: string, apiKey: string) => void;
    setUseMemory: (enabled: boolean) => void;
    setAutoSuggestMemories: (enabled: boolean) => void;
    setInjectMemoryInContext: (enabled: boolean) => void;
    addMemory: (data: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
    updateMemory: (id: string, data: Partial<Omit<MemoryRecord, 'id' | 'createdAt'>>) => void;
    deleteMemory: (id: string) => void;
    toggleMemoryEnabled: (id: string) => void;
    toggleMemoryPinned: (id: string) => void;
    clearAllMemories: () => void;
    exportMemories: () => void;
    importMemories: (importedJson: string) => { success: boolean; count: number; error?: string };
    exportAllUserData: (chats: ChatSession[], messages: ChatMessage[]) => void;
    updateNotifications: (partial: Partial<NotificationSettings>) => void;
    dispatchAppNotification: (
        type: NotificationCategory,
        title: string,
        message: string,
        severity?: NotificationSeverity,
        source?: string
    ) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    dismissNotification: (id: string) => void;
    clearAllNotifications: () => void;
    resetSettings: () => void;
    resetAllApplicationData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_GENERAL_SETTINGS);
    const [currentUser, setCurrentUser] = useState<UserProfileType | null>(DEFAULT_USER);
    const [personalization, setPersonalization] = useState<PersonalizationSettings>(DEFAULT_PERSONALIZATION_SETTINGS);
    const [privacy, setPrivacy] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
    const [shortcuts, setShortcuts] = useState<KeyboardShortcutItem[]>(DEFAULT_SHORTCUTS);
    const [activeModelId, setActiveModelIdState] = useState<string>(DEFAULT_MODEL_ID);
    const [customModels, setCustomModels] = useState<ModelProfile[]>([]);
    const [generationConfig, setGenerationConfig] = useState<ModelGenerationConfig>(DEFAULT_GENERATION_CONFIG);
    const [useMemory, setUseMemoryState] = useState<boolean>(true);
    const [autoSuggestMemories, setAutoSuggestMemoriesState] = useState<boolean>(true);
    const [injectMemoryInContext, setInjectMemoryInContextState] = useState<boolean>(true);
    const [memories, setMemories] = useState<MemoryRecord[]>(INITIAL_SAMPLE_MEMORIES);
    const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
    const [notificationEvents, setNotificationEvents] = useState<NotificationRecord[]>([]);
    const [providerKeys, setProviderKeys] = useState<Record<string, string>>({});

    // Restore stored configurations on client mount
    useEffect(() => {
        try {
            const storedGeneral = localStorage.getItem(GENERAL_STORAGE_KEY);
            if (storedGeneral) {
                const parsed = JSON.parse(storedGeneral);
                const normalizedFontSize =
                    parsed.fontSize === 'default' ? 'medium' : parsed.fontSize || 'medium';
                setSettings((prev) => ({ ...prev, ...parsed, fontSize: normalizedFontSize }));
            }

            const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
            if (storedUser !== null) {
                setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
            }

            const storedPersonalization = localStorage.getItem(PERSONALIZATION_STORAGE_KEY);
            if (storedPersonalization) setPersonalization((prev) => ({ ...prev, ...JSON.parse(storedPersonalization) }));

            const storedPrivacy = localStorage.getItem(PRIVACY_STORAGE_KEY);
            if (storedPrivacy) setPrivacy((prev) => ({ ...prev, ...JSON.parse(storedPrivacy) }));

            const storedShortcuts = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
            if (storedShortcuts) setShortcuts(JSON.parse(storedShortcuts));

            const storedCustom = localStorage.getItem(CUSTOM_MODELS_STORAGE_KEY);
            const parsedCustom: ModelProfile[] = storedCustom ? JSON.parse(storedCustom) : [];
            setCustomModels(parsedCustom);

            const storedCredentials = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
            if (storedCredentials) setProviderKeys(JSON.parse(storedCredentials));

            const storedModelId = localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY);
            if (storedModelId) {
                const allIds = [...BUILTIN_MODELS, ...parsedCustom].map((m) => m.id);
                if (allIds.includes(storedModelId)) {
                    setActiveModelIdState(storedModelId);
                } else {
                    setActiveModelIdState(DEFAULT_MODEL_ID);
                }
            }

            const storedGen = localStorage.getItem(GENERATION_CONFIG_STORAGE_KEY);
            if (storedGen) setGenerationConfig((prev) => ({ ...prev, ...JSON.parse(storedGen) }));

            const storedUseMem = localStorage.getItem(USE_MEMORY_STORAGE_KEY);
            if (storedUseMem !== null) setUseMemoryState(storedUseMem === 'true');

            const storedAutoSuggest = localStorage.getItem(AUTO_SUGGEST_MEMORY_STORAGE_KEY);
            if (storedAutoSuggest !== null) setAutoSuggestMemoriesState(storedAutoSuggest === 'true');

            const storedInject = localStorage.getItem(INJECT_MEMORY_STORAGE_KEY);
            if (storedInject !== null) setInjectMemoryInContextState(storedInject === 'true');

            const storedMems = localStorage.getItem(MEMORIES_STORAGE_KEY);
            if (storedMems) {
                const parsed: MemoryRecord[] = JSON.parse(storedMems);
                const normalized = parsed.map((m) => ({
                    ...m,
                    type: m.type || m.category || 'Preference',
                    usage: m.usage || 'relevant',
                    pinned: Boolean(m.pinned),
                    version: 2,
                }));
                setMemories(normalized);
            }

            const storedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            if (storedNotifs) setNotifications((prev) => ({ ...prev, ...JSON.parse(storedNotifs) }));

            const storedEvents = localStorage.getItem(NOTIFICATION_EVENTS_STORAGE_KEY);
            if (storedEvents) setNotificationEvents(JSON.parse(storedEvents));
        } catch {
            // Safe storage fallback
        }
    }, []);

    // DOM attributes and CSS variable synchronization
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;
        root.style.setProperty('--accent-primary', settings.accentColor);

        if (settings.fontSize === 'small') {
            root.style.setProperty('--font-size-multiplier', '0.90');
        } else if (settings.fontSize === 'large') {
            root.style.setProperty('--font-size-multiplier', '1.12');
        } else {
            root.style.setProperty('--font-size-multiplier', '1.0');
        }

        if (settings.compactMode) {
            root.setAttribute('data-density', 'compact');
        } else {
            root.removeAttribute('data-density');
        }

        if (settings.reduceMotion) {
            root.setAttribute('data-reduce-motion', 'true');
        } else {
            root.removeAttribute('data-reduce-motion');
        }

        const applyTheme = () => {
            let isDark = false;
            if (settings.theme === 'system') {
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            } else {
                isDark = settings.theme === 'dark';
            }

            if (isDark) {
                root.classList.add('dark');
                root.setAttribute('data-theme', 'dark');
            } else {
                root.classList.remove('dark');
                root.setAttribute('data-theme', 'light');
            }
        };

        applyTheme();

        if (settings.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const listener = () => applyTheme();
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [settings]);

    const models = useMemo(() => {
        const combined = [...BUILTIN_MODELS, ...customModels];
        return combined.map((m) => {
            if (m.requiresApiKey) {
                const hasKey = Boolean(providerKeys[m.provider] || m.apiKey);
                return {
                    ...m,
                    isAvailable: hasKey,
                    availability: hasKey ? ('available' as const) : ('config_required' as const),
                };
            }
            return m;
        });
    }, [customModels, providerKeys]);

    const unreadNotificationCount = useMemo(
        () => notificationEvents.filter((n) => !n.read).length,
        [notificationEvents]
    );

    const updateSettings = useCallback((partial: Partial<GeneralSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...partial };
            if (next.autoSave) {
                try {
                    localStorage.setItem(GENERAL_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
            }
            return next;
        });
    }, []);

    const updatePersonalization = useCallback((partial: Partial<PersonalizationSettings>) => {
        setPersonalization((prev) => {
            const next = { ...prev, ...partial };
            try {
                localStorage.setItem(PERSONALIZATION_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const updatePrivacy = useCallback((partial: Partial<PrivacySettings>) => {
        setPrivacy((prev) => {
            const next = { ...prev, ...partial };
            try {
                localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    // Auth User Management
    const loginUser = useCallback((user: UserProfileType) => {
        setCurrentUser(user);
        try {
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
        } catch {
            // Safe write fallback
        }
    }, []);

    const logoutUser = useCallback(() => {
        setCurrentUser(null);
        try {
            localStorage.setItem(AUTH_USER_STORAGE_KEY, '');
        } catch {
            // Safe write fallback
        }
    }, []);

    // Shortcut Management Handlers
    const updateShortcut = useCallback(
        (id: string, keys: string[]): boolean => {
            const isConflict = shortcuts.some(
                (s) =>
                    s.id !== id &&
                    s.enabled &&
                    s.keys.join('+').toLowerCase() === keys.join('+').toLowerCase()
            );

            if (isConflict) return false;

            setShortcuts((prev) => {
                const next = prev.map((s) => (s.id === id ? { ...s, keys, isCustom: true } : s));
                try {
                    localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });
            return true;
        },
        [shortcuts]
    );

    const toggleShortcutEnabled = useCallback((id: string) => {
        setShortcuts((prev) => {
            const next = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
            try {
                localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const resetShortcut = useCallback((id: string) => {
        const defaultItem = DEFAULT_SHORTCUTS.find((s) => s.id === id);
        if (!defaultItem) return;

        setShortcuts((prev) => {
            const next = prev.map((s) => (s.id === id ? { ...defaultItem, isCustom: false } : s));
            try {
                localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const resetAllShortcuts = useCallback(() => {
        setShortcuts(DEFAULT_SHORTCUTS);
        try {
            localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(DEFAULT_SHORTCUTS));
        } catch {
            // Safe write fallback
        }
    }, []);

    const setActiveModelId = useCallback((modelId: string) => {
        setActiveModelIdState(modelId);
        try {
            localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, modelId);
        } catch {
            // Safe write fallback
        }
    }, []);

    const updateGenerationConfig = useCallback((partial: Partial<ModelGenerationConfig>) => {
        setGenerationConfig((prev) => {
            const next = { ...prev, ...partial };
            try {
                localStorage.setItem(GENERATION_CONFIG_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const applyGenerationPreset = useCallback((preset: GenerationPreset) => {
        const target = GENERATION_PRESETS[preset];
        if (target) {
            setGenerationConfig((prev) => {
                const next = { ...prev, ...target.config };
                try {
                    localStorage.setItem(GENERATION_CONFIG_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });
        }
    }, []);

    const configureProviderKey = useCallback((provider: string, apiKey: string) => {
        setProviderKeys((prev) => {
            const next = { ...prev, [provider]: apiKey.trim() };
            try {
                localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const addCustomModel = useCallback(
        (modelData: Omit<ModelProfile, 'isCustom' | 'type'>): boolean => {
            const isDuplicate = models.some((m) => m.id.toLowerCase() === modelData.id.toLowerCase());
            if (isDuplicate) return false;

            setCustomModels((prev) => {
                const newModel: ModelProfile = {
                    ...modelData,
                    isCustom: true,
                    type: 'custom',
                    group: 'Custom',
                };
                const next = [...prev, newModel];
                try {
                    localStorage.setItem(CUSTOM_MODELS_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });
            return true;
        },
        [models]
    );

    const updateCustomModel = useCallback((id: string, modelData: Partial<ModelProfile>) => {
        setCustomModels((prev) => {
            const next = prev.map((m) => (m.id === id ? { ...m, ...modelData } : m));
            try {
                localStorage.setItem(CUSTOM_MODELS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const deleteCustomModel = useCallback(
        (id: string) => {
            setCustomModels((prev) => {
                const next = prev.filter((m) => m.id !== id);
                try {
                    localStorage.setItem(CUSTOM_MODELS_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });

            if (activeModelId === id) {
                setActiveModelId(DEFAULT_MODEL_ID);
            }
        },
        [activeModelId, setActiveModelId]
    );

    // Memory Handlers
    const setUseMemory = useCallback((enabled: boolean) => {
        setUseMemoryState(enabled);
        try {
            localStorage.setItem(USE_MEMORY_STORAGE_KEY, String(enabled));
        } catch {
            // Safe write fallback
        }
    }, []);

    const setAutoSuggestMemories = useCallback((enabled: boolean) => {
        setAutoSuggestMemoriesState(enabled);
        try {
            localStorage.setItem(AUTO_SUGGEST_MEMORY_STORAGE_KEY, String(enabled));
        } catch {
            // Safe write fallback
        }
    }, []);

    const setInjectMemoryInContext = useCallback((enabled: boolean) => {
        setInjectMemoryInContextState(enabled);
        try {
            localStorage.setItem(INJECT_MEMORY_STORAGE_KEY, String(enabled));
        } catch {
            // Safe write fallback
        }
    }, []);

    const addMemory = useCallback(
        (data: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
            setMemories((prev) => {
                const newMem: MemoryRecord = {
                    ...data,
                    id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                    usage: data.usage || 'relevant',
                    version: 2,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                const next = [newMem, ...prev];
                try {
                    localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });
        },
        []
    );

    const updateMemory = useCallback(
        (id: string, data: Partial<Omit<MemoryRecord, 'id' | 'createdAt'>>) => {
            setMemories((prev) => {
                const next = prev.map((m) =>
                    m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
                );
                try {
                    localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe write fallback
                }
                return next;
            });
        },
        []
    );

    const deleteMemory = useCallback((id: string) => {
        setMemories((prev) => {
            const next = prev.filter((m) => m.id !== id);
            try {
                localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const toggleMemoryEnabled = useCallback((id: string) => {
        setMemories((prev) => {
            const next = prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
            try {
                localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const toggleMemoryPinned = useCallback((id: string) => {
        setMemories((prev) => {
            const next = prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m));
            try {
                localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const clearAllMemories = useCallback(() => {
        setMemories([]);
        try {
            localStorage.removeItem(MEMORIES_STORAGE_KEY);
        } catch {
            // Safe write fallback
        }
    }, []);

    const exportMemories = useCallback(() => {
        if (typeof window === 'undefined') return;
        const exportData = {
            version: 2,
            exportedAt: new Date().toISOString(),
            records: memories.map((m) => ({
                title: m.title,
                content: m.content,
                type: m.type,
                scope: m.scope,
                usage: m.usage || 'relevant',
                tags: m.tags || [],
                pinned: m.pinned,
                enabled: m.enabled,
            })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kleava-memories-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [memories]);

    // Full User Data Exporter
    const exportAllUserData = useCallback(
        (chats: ChatSession[], messages: ChatMessage[]) => {
            if (typeof window === 'undefined') return;
            const fullExportBundle = {
                app: 'Kleava AI',
                version: '0.1.0',
                exportedAt: new Date().toISOString(),
                user: currentUser,
                settings: {
                    general: settings,
                    personalization,
                    privacy,
                    generation: generationConfig,
                    notifications,
                    shortcuts,
                },
                memories: memories.map((m) => ({
                    title: m.title,
                    content: m.content,
                    type: m.type,
                    scope: m.scope,
                    usage: m.usage,
                    tags: m.tags,
                    pinned: m.pinned,
                    enabled: m.enabled,
                })),
                chats: chats.map((c) => ({
                    id: c.id,
                    title: c.title,
                    isPinned: c.isPinned,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt,
                })),
                messages: messages.map((msg) => ({
                    id: msg.id,
                    chatId: msg.chatId,
                    role: msg.role,
                    content: msg.content,
                    createdAt: msg.createdAt,
                    model: msg.model,
                    isEdited: msg.isEdited,
                })),
            };

            const blob = new Blob([JSON.stringify(fullExportBundle, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kleava-userdata-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        [settings, personalization, privacy, generationConfig, notifications, shortcuts, memories, currentUser]
    );

    const importMemories = useCallback(
        (importedJson: string): { success: boolean; count: number; error?: string } => {
            try {
                const parsed = JSON.parse(importedJson);
                const records: Array<Partial<MemoryRecord>> = Array.isArray(parsed)
                    ? parsed
                    : Array.isArray(parsed.records)
                        ? parsed.records
                        : [];

                if (records.length === 0) {
                    return { success: false, count: 0, error: 'No valid memory records found in file' };
                }

                const validNewMemories: MemoryRecord[] = [];

                records.forEach((r) => {
                    if (r.title && r.content) {
                        validNewMemories.push({
                            id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                            title: String(r.title).slice(0, 100),
                            content: String(r.content).slice(0, 2000),
                            type: r.type || 'Preference',
                            source: 'Imported',
                            scope: r.scope || 'Global',
                            usage: r.usage || 'relevant',
                            tags: Array.isArray(r.tags) ? r.tags : [],
                            pinned: Boolean(r.pinned),
                            enabled: r.enabled !== false,
                            version: 2,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                    }
                });

                if (validNewMemories.length === 0) {
                    return { success: false, count: 0, error: 'File did not contain valid title and content fields' };
                }

                setMemories((prev) => {
                    const next = [...validNewMemories, ...prev];
                    try {
                        localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(next));
                    } catch {
                        // Safe storage write fallback
                    }
                    return next;
                });

                return { success: true, count: validNewMemories.length };
            } catch {
                return { success: false, count: 0, error: 'Invalid JSON file structure' };
            }
        },
        []
    );

    // Notifications Handlers
    const updateNotifications = useCallback((partial: Partial<NotificationSettings>) => {
        setNotifications((prev) => {
            const next = { ...prev, ...partial };
            try {
                localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const dispatchAppNotification = useCallback(
        (
            type: NotificationCategory,
            title: string,
            message: string,
            severity: NotificationSeverity = 'info',
            source: string = 'Kleava System'
        ) => {
            if (!isNotificationCategoryAllowed(type, notifications)) return;

            const record = createNotificationRecord({
                type,
                title,
                message,
                severity,
                source,
            });

            playNotificationChime(notifications.sound);

            setNotificationEvents((prev) => {
                const next = [record, ...prev].slice(0, 30);
                try {
                    localStorage.setItem(NOTIFICATION_EVENTS_STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // Safe storage write fallback
                }
                return next;
            });
        },
        [notifications]
    );

    const markNotificationAsRead = useCallback((id: string) => {
        setNotificationEvents((prev) => {
            const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
            try {
                localStorage.setItem(NOTIFICATION_EVENTS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe storage write fallback
            }
            return next;
        });
    }, []);

    const markAllNotificationsAsRead = useCallback(() => {
        setNotificationEvents((prev) => {
            const next = prev.map((n) => ({ ...n, read: true }));
            try {
                localStorage.setItem(NOTIFICATION_EVENTS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe storage write fallback
            }
            return next;
        });
    }, []);

    const dismissNotification = useCallback((id: string) => {
        setNotificationEvents((prev) => {
            const next = prev.filter((n) => n.id !== id);
            try {
                localStorage.setItem(NOTIFICATION_EVENTS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotificationEvents([]);
        try {
            localStorage.removeItem(NOTIFICATION_EVENTS_STORAGE_KEY);
        } catch {
            // Safe write fallback
        }
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_GENERAL_SETTINGS);
        setCurrentUser(DEFAULT_USER);
        setPersonalization(DEFAULT_PERSONALIZATION_SETTINGS);
        setPrivacy(DEFAULT_PRIVACY_SETTINGS);
        setShortcuts(DEFAULT_SHORTCUTS);
        setActiveModelIdState(DEFAULT_MODEL_ID);
        setGenerationConfig(DEFAULT_GENERATION_CONFIG);
        setUseMemoryState(true);
        setAutoSuggestMemoriesState(true);
        setInjectMemoryInContextState(true);
        setMemories(INITIAL_SAMPLE_MEMORIES);
        setNotifications(DEFAULT_NOTIFICATION_SETTINGS);
        setNotificationEvents([]);
        setCustomModels([]);
        setProviderKeys({});
        try {
            localStorage.removeItem(GENERAL_STORAGE_KEY);
            localStorage.removeItem(AUTH_USER_STORAGE_KEY);
            localStorage.removeItem(PERSONALIZATION_STORAGE_KEY);
            localStorage.removeItem(PRIVACY_STORAGE_KEY);
            localStorage.removeItem(SHORTCUTS_STORAGE_KEY);
            localStorage.removeItem(ACTIVE_MODEL_STORAGE_KEY);
            localStorage.removeItem(GENERATION_CONFIG_STORAGE_KEY);
            localStorage.removeItem(USE_MEMORY_STORAGE_KEY);
            localStorage.removeItem(AUTO_SUGGEST_MEMORY_STORAGE_KEY);
            localStorage.removeItem(INJECT_MEMORY_STORAGE_KEY);
            localStorage.removeItem(MEMORIES_STORAGE_KEY);
            localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
            localStorage.removeItem(NOTIFICATION_EVENTS_STORAGE_KEY);
            localStorage.removeItem(CUSTOM_MODELS_STORAGE_KEY);
            localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
        } catch {
            // Safe storage reset fallback
        }
    }, []);

    const resetAllApplicationData = useCallback(() => {
        resetSettings();
        try {
            localStorage.removeItem(CHATS_STORAGE_KEY);
        } catch {
            // Safe storage reset fallback
        }
    }, [resetSettings]);

    return (
        <SettingsContext.Provider
            value={{
                settings,
                personalization,
                privacy,
                shortcuts,
                currentUser,
                activeModelId,
                models,
                generationConfig,
                useMemory,
                autoSuggestMemories,
                injectMemoryInContext,
                memories,
                notifications,
                notificationEvents,
                unreadNotificationCount,
                updateSettings,
                updatePersonalization,
                updatePrivacy,
                loginUser,
                logoutUser,
                updateShortcut,
                toggleShortcutEnabled,
                resetShortcut,
                resetAllShortcuts,
                setActiveModelId,
                updateGenerationConfig,
                applyGenerationPreset,
                addCustomModel,
                updateCustomModel,
                deleteCustomModel,
                configureProviderKey,
                setUseMemory,
                setAutoSuggestMemories,
                setInjectMemoryInContext,
                addMemory,
                updateMemory,
                deleteMemory,
                toggleMemoryEnabled,
                toggleMemoryPinned,
                clearAllMemories,
                exportMemories,
                importMemories,
                exportAllUserData,
                updateNotifications,
                dispatchAppNotification,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                dismissNotification,
                clearAllNotifications,
                resetSettings,
                resetAllApplicationData,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}