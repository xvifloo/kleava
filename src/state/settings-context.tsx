'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    GeneralSettings,
    ModelProfile,
    ModelGenerationConfig,
    MemoryRecord,
    NotificationSettings,
} from '@/types';
import {
    BUILTIN_MODELS,
    DEFAULT_MODEL_ID,
    DEFAULT_GENERATION_CONFIG,
    GENERATION_PRESETS,
    GenerationPreset,
} from '@/config/models';

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    theme: 'light',
    accentColor: '#17BC9B', // Canonical Kleava Mint
    language: 'en',
    fontSize: 'default',
    autoSave: true,
    compactMode: false,
    reduceMotion: false,
    soundEffects: true,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    enabled: true,
    chatActivity: true,
    taskCompleted: true,
    errorAlerts: true,
    systemUpdates: false,
    memoryUpdates: true,
    modelUpdates: false,
    soundEffects: true,
    voiceAutoPlay: false,
    desktopAlerts: false,
};

const GENERAL_STORAGE_KEY = 'kleava_general_settings';
const CUSTOM_MODELS_STORAGE_KEY = 'kleava_custom_models';
const ACTIVE_MODEL_STORAGE_KEY = 'kleava_active_model_id';
const GENERATION_CONFIG_STORAGE_KEY = 'kleava_generation_config';
const USE_MEMORY_STORAGE_KEY = 'kleava_use_memory';
const MEMORIES_STORAGE_KEY = 'kleava_memories';
const NOTIFICATIONS_STORAGE_KEY = 'kleava_notification_settings';

interface SettingsContextType {
    settings: GeneralSettings;
    activeModelId: string;
    models: ModelProfile[];
    generationConfig: ModelGenerationConfig;
    useMemory: boolean;
    memories: MemoryRecord[];
    notifications: NotificationSettings;
    updateSettings: (partial: Partial<GeneralSettings>) => void;
    setActiveModelId: (modelId: string) => void;
    updateGenerationConfig: (partial: Partial<ModelGenerationConfig>) => void;
    applyGenerationPreset: (preset: GenerationPreset) => void;
    addCustomModel: (model: Omit<ModelProfile, 'isCustom' | 'type'>) => boolean;
    updateCustomModel: (id: string, model: Partial<ModelProfile>) => void;
    deleteCustomModel: (id: string) => void;
    setUseMemory: (enabled: boolean) => void;
    addMemory: (data: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateMemory: (id: string, data: Partial<Omit<MemoryRecord, 'id' | 'createdAt'>>) => void;
    deleteMemory: (id: string) => void;
    toggleMemoryEnabled: (id: string) => void;
    clearAllMemories: () => void;
    updateNotifications: (partial: Partial<NotificationSettings>) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_GENERAL_SETTINGS);
    const [activeModelId, setActiveModelIdState] = useState<string>(DEFAULT_MODEL_ID);
    const [customModels, setCustomModels] = useState<ModelProfile[]>([]);
    const [generationConfig, setGenerationConfig] = useState<ModelGenerationConfig>(DEFAULT_GENERATION_CONFIG);
    const [useMemory, setUseMemoryState] = useState<boolean>(true);
    const [memories, setMemories] = useState<MemoryRecord[]>([]);
    const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

    // Restore stored configurations on client mount
    useEffect(() => {
        try {
            const storedGeneral = localStorage.getItem(GENERAL_STORAGE_KEY);
            if (storedGeneral) setSettings((prev) => ({ ...prev, ...JSON.parse(storedGeneral) }));

            const storedCustom = localStorage.getItem(CUSTOM_MODELS_STORAGE_KEY);
            const parsedCustom: ModelProfile[] = storedCustom ? JSON.parse(storedCustom) : [];
            setCustomModels(parsedCustom);

            const storedModelId = localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY);
            if (storedModelId) {
                // Validate if stored model ID exists in builtin or custom models
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

            const storedMems = localStorage.getItem(MEMORIES_STORAGE_KEY);
            if (storedMems) setMemories(JSON.parse(storedMems));

            const storedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            if (storedNotifs) setNotifications((prev) => ({ ...prev, ...JSON.parse(storedNotifs) }));
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
            root.style.setProperty('--font-size-multiplier', '0.92');
        } else if (settings.fontSize === 'large') {
            root.style.setProperty('--font-size-multiplier', '1.08');
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

    // Combined models catalogue
    const models = useMemo(() => [...BUILTIN_MODELS, ...customModels], [customModels]);

    const updateSettings = useCallback((partial: Partial<GeneralSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...partial };
            try {
                localStorage.setItem(GENERAL_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Safe write fallback
            }
            return next;
        });
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

    const addMemory = useCallback((data: Omit<MemoryRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
        setMemories((prev) => {
            const newMem: MemoryRecord = {
                ...data,
                id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
    }, []);

    const updateMemory = useCallback((id: string, data: Partial<Omit<MemoryRecord, 'id' | 'createdAt'>>) => {
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
    }, []);

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

    const clearAllMemories = useCallback(() => {
        setMemories([]);
        try {
            localStorage.removeItem(MEMORIES_STORAGE_KEY);
        } catch {
            // Safe write fallback
        }
    }, []);

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

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_GENERAL_SETTINGS);
        setActiveModelIdState(DEFAULT_MODEL_ID);
        setGenerationConfig(DEFAULT_GENERATION_CONFIG);
        setUseMemoryState(true);
        setMemories([]);
        setNotifications(DEFAULT_NOTIFICATION_SETTINGS);
        setCustomModels([]);
        try {
            localStorage.removeItem(GENERAL_STORAGE_KEY);
            localStorage.removeItem(ACTIVE_MODEL_STORAGE_KEY);
            localStorage.removeItem(GENERATION_CONFIG_STORAGE_KEY);
            localStorage.removeItem(USE_MEMORY_STORAGE_KEY);
            localStorage.removeItem(MEMORIES_STORAGE_KEY);
            localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
            localStorage.removeItem(CUSTOM_MODELS_STORAGE_KEY);
        } catch {
            // Safe storage reset fallback
        }
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                settings,
                activeModelId,
                models,
                generationConfig,
                useMemory,
                memories,
                notifications,
                updateSettings,
                setActiveModelId,
                updateGenerationConfig,
                applyGenerationPreset,
                addCustomModel,
                updateCustomModel,
                deleteCustomModel,
                setUseMemory,
                addMemory,
                updateMemory,
                deleteMemory,
                toggleMemoryEnabled,
                clearAllMemories,
                updateNotifications,
                resetSettings,
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