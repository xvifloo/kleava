'use client';

import React, { useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { ThemeMode, FontSizeMode, LanguageCode } from '@/types';
import { t } from '@/lib/i18n';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

const ACCENT_PRESETS = [
    { label: 'Kleava Mint (Default)', value: '#17BC9B' },
    { label: 'Ocean Blue', value: '#3B82F6' },
    { label: 'Royal Violet', value: '#8B5CF6' },
    { label: 'Warm Amber', value: '#F59E0B' },
    { label: 'Rose Pink', value: '#EC4899' },
    { label: 'Forest Emerald', value: '#10B981' },
];

/**
 * GeneralSettings: Complete General Preferences & Appearance module.
 * Fully localized with Theme, Accent swatches, Language, Font scale (Small/Medium/Large),
 * Auto Save, Compact Mode, and Accessibility toggles.
 */
export function GeneralSettings() {
    const { settings, updateSettings } = useSettings();
    const [customHex, setCustomHex] = useState(settings.accentColor);
    const lang = settings.language;

    const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomHex(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            updateSettings({ accentColor: val });
        }
    };

    return (
        <SettingsContent
            sectionId="general"
            title={t('generalSettingsTitle', lang)}
            description={t('generalSettingsDesc', lang)}
        >
            {/* 1. Appearance Section */}
            <SettingsSectionBlock title={t('appearance', lang)}>
                {/* Theme Segmented Control */}
                <SettingsRow
                    label={t('colorTheme', lang)}
                    description={t('colorThemeDesc', lang)}
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80">
                            {[
                                { id: 'light', label: 'Light', icon: Sun },
                                { id: 'dark', label: 'Dark', icon: Moon },
                                { id: 'system', label: 'Auto', icon: Monitor },
                            ].map((item) => {
                                const Icon = item.icon;
                                const isSelected = settings.theme === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updateSettings({ theme: item.id as ThemeMode })}
                                        className={cn(
                                            'flex items-center space-x-1 px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    }
                />

                {/* Accent Color Swatch Picker */}
                <SettingsRow
                    label={t('accentColor', lang)}
                    description={t('accentColorDesc', lang)}
                    control={
                        <div className="flex items-center space-x-1.5 py-0.5 flex-wrap gap-y-1">
                            {ACCENT_PRESETS.map((preset) => {
                                const isSelected = settings.accentColor.toLowerCase() === preset.value.toLowerCase();
                                return (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        aria-label={preset.label}
                                        title={preset.label}
                                        onClick={() => {
                                            setCustomHex(preset.value);
                                            updateSettings({ accentColor: preset.value });
                                        }}
                                        style={{ backgroundColor: preset.value }}
                                        className={cn(
                                            'w-5 h-5 rounded-full flex items-center justify-center transition-transform active:scale-90',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                            isSelected
                                                ? 'ring-2 ring-kleava-text-primary scale-110 shadow-xs'
                                                : 'opacity-85 hover:opacity-100 hover:scale-105'
                                        )}
                                    >
                                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                    </button>
                                );
                            })}

                            {/* Custom Hex Input */}
                            <input
                                type="text"
                                value={customHex}
                                onChange={handleCustomHexChange}
                                maxLength={7}
                                placeholder="#17BC9B"
                                className="w-16 px-1.5 py-0.5 text-[10px] font-mono rounded bg-kleava-surface border border-kleava-border-subtle text-kleava-text-primary focus:outline-none focus:border-kleava-accent uppercase"
                            />
                        </div>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 2. Language & Typography Scale */}
            <SettingsSectionBlock title={t('languageAndScale', lang)}>
                {/* Language Selection */}
                <SettingsRow
                    label={t('language', lang)}
                    description={t('languageDesc', lang)}
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80">
                            {[
                                { id: 'en', label: 'English' },
                                { id: 'bn', label: 'বাংলা' },
                            ].map((item) => {
                                const isSelected = settings.language === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updateSettings({ language: item.id as LanguageCode })}
                                        className={cn(
                                            'px-2.5 py-1 rounded-kleava-sm typography-metadata text-[10.5px] transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />

                {/* Font Size Scaling */}
                <SettingsRow
                    label={t('contentFontSize', lang)}
                    description={t('contentFontSizeDesc', lang)}
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80">
                            {[
                                { id: 'small', label: 'Small' },
                                { id: 'medium', label: 'Medium' },
                                { id: 'large', label: 'Large' },
                            ].map((size) => {
                                const isSelected = settings.fontSize === size.id;
                                return (
                                    <button
                                        key={size.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updateSettings({ fontSize: size.id as FontSizeMode })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {size.label}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 3. Application Preferences & Accessibility */}
            <SettingsSectionBlock title={t('preferencesAndAccessibility', lang)}>
                {/* Auto Save Toggle */}
                <SettingsRow
                    label={t('autoSave', lang)}
                    description={t('autoSaveDesc', lang)}
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.autoSave}
                            onClick={() => updateSettings({ autoSave: !settings.autoSave })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                settings.autoSave ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    settings.autoSave ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Compact Mode Toggle */}
                <SettingsRow
                    label={t('compactMode', lang)}
                    description={t('compactModeDesc', lang)}
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.compactMode}
                            onClick={() => updateSettings({ compactMode: !settings.compactMode })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                settings.compactMode ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    settings.compactMode ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Reduce Motion Toggle */}
                <SettingsRow
                    label={t('reduceMotion', lang)}
                    description={t('reduceMotionDesc', lang)}
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.reduceMotion}
                            onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                settings.reduceMotion ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    settings.reduceMotion ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />

                {/* Sound Effects Toggle */}
                <SettingsRow
                    label={t('soundFeedback', lang)}
                    description={t('soundFeedbackDesc', lang)}
                    control={
                        <button
                            type="button"
                            role="switch"
                            aria-checked={settings.soundEffects}
                            onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                            className={cn(
                                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring-kleava',
                                settings.soundEffects ? 'bg-kleava-accent' : 'bg-kleava-surface-soft'
                            )}
                        >
                            <span
                                className={cn(
                                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                                    settings.soundEffects ? 'translate-x-4' : 'translate-x-0'
                                )}
                            />
                        </button>
                    }
                />
            </SettingsSectionBlock>
        </SettingsContent>
    );
}

export default GeneralSettings;