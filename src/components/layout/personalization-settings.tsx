'use client';

import React from 'react';
import { useSettings } from '@/state/settings-context';
import {
    ResponseStyleMode,
    ToneMode,
    ResponseLanguageMode,
    FormattingStyleMode,
    DetailLevelMode,
    EmojiUsageMode,
    TechnicalDepthMode,
    ProactiveBehaviorMode,
} from '@/types';
import {
    SettingsContent,
    SettingsSectionBlock,
    SettingsRow,
    SettingsDivider,
} from '@/components/layout/settings-content';
import { cn } from '@/lib/utils';

/**
 * PersonalizationSettings: Response Style, Tone, Language Behavior, Formatting,
 * Emoji rules, and Technical Depth controls for Kleava AI.
 */
export function PersonalizationSettings() {
    const { personalization, updatePersonalization } = useSettings();

    return (
        <SettingsContent
            sectionId="personalization"
            title="Personalization"
            description="Customize Kleava's conversational style, tone, formatting density, and response depth."
        >
            {/* 1. Response Style & Tone */}
            <SettingsSectionBlock title="Style & Tone">
                {/* Response Style */}
                <SettingsRow
                    label="Response Style"
                    description="Overall response phrasing and structural approach"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['balanced', 'concise', 'detailed', 'technical'] as ResponseStyleMode[]).map((style) => {
                                const isSelected = personalization.responseStyle === style;
                                return (
                                    <button
                                        key={style}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ responseStyle: style })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {style}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />

                {/* Tone */}
                <SettingsRow
                    label="Conversational Tone"
                    description="Interpersonal demeanor and voice"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['neutral', 'friendly', 'professional', 'direct', 'casual'] as ToneMode[]).map((tone) => {
                                const isSelected = personalization.tone === tone;
                                return (
                                    <button
                                        key={tone}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ tone })}
                                        className={cn(
                                            'px-1.5 py-1 rounded-kleava-sm typography-metadata text-[10px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {tone}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 2. Language & Formatting Rules */}
            <SettingsSectionBlock title="Language & Formatting">
                {/* Response Language */}
                <SettingsRow
                    label="Response Language"
                    description="Primary target language for generated answers"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {[
                                { id: 'match_input', label: 'Auto / Match' },
                                { id: 'en', label: 'English' },
                                { id: 'bn', label: 'বাংলা' },
                            ].map((item) => {
                                const isSelected = personalization.responseLanguage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ responseLanguage: item.id as ResponseLanguageMode })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10px] transition-all',
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

                {/* Formatting Style */}
                <SettingsRow
                    label="Formatting Layout"
                    description="Level of structural headings and callouts"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['clean', 'structured', 'minimal'] as FormattingStyleMode[]).map((fmt) => {
                                const isSelected = personalization.formattingStyle === fmt;
                                return (
                                    <button
                                        key={fmt}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ formattingStyle: fmt })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {fmt}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />
            </SettingsSectionBlock>

            <SettingsDivider />

            {/* 3. Depth, Emojis & Proactivity */}
            <SettingsSectionBlock title="Depth & Behavior">
                {/* Technical Depth */}
                <SettingsRow
                    label="Technical Depth"
                    description="Inclusion of low-level architecture and type definitions"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['simple', 'standard', 'advanced'] as TechnicalDepthMode[]).map((depth) => {
                                const isSelected = personalization.technicalDepth === depth;
                                return (
                                    <button
                                        key={depth}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ technicalDepth: depth })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {depth}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />

                {/* Emoji Usage */}
                <SettingsRow
                    label="Emoji Usage"
                    description="Frequency of expressive icons in prose"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['off', 'minimal', 'normal'] as EmojiUsageMode[]).map((emoji) => {
                                const isSelected = personalization.emojiUsage === emoji;
                                return (
                                    <button
                                        key={emoji}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ emojiUsage: emoji })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {emoji}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />

                {/* Proactive Suggestions */}
                <SettingsRow
                    label="Proactive Guidance"
                    description="Anticipate follow-up steps and potential edge cases"
                    control={
                        <div className="flex items-center space-x-1 p-0.5 rounded-kleava-md bg-kleava-surface border border-kleava-border-subtle/80 select-none">
                            {(['minimal', 'balanced', 'proactive'] as ProactiveBehaviorMode[]).map((pro) => {
                                const isSelected = personalization.proactiveBehavior === pro;
                                return (
                                    <button
                                        key={pro}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => updatePersonalization({ proactiveBehavior: pro })}
                                        className={cn(
                                            'px-2 py-1 rounded-kleava-sm typography-metadata text-[10.5px] capitalize transition-all',
                                            isSelected
                                                ? 'bg-kleava-surface-soft text-kleava-accent font-semibold shadow-xs'
                                                : 'text-kleava-text-secondary hover:text-kleava-text-primary'
                                        )}
                                    >
                                        {pro}
                                    </button>
                                );
                            })}
                        </div>
                    }
                />
            </SettingsSectionBlock>
        </SettingsContent>
    );
}

export default PersonalizationSettings;