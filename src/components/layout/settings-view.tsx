'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  Brain,
  Bell,
  Palette,
  ShieldCheck,
  HardDrive,
  Keyboard,
  Info,
} from 'lucide-react';
import { SettingsSection, ChatSession, ChatMessage } from '@/types';
import { useSettings } from '@/state/settings-context';
import { t } from '@/lib/i18n';
import { SettingsContent } from '@/components/layout/settings-content';
import { GeneralSettings } from '@/components/layout/general-settings';
import { ModelSettings } from '@/components/layout/model-settings';
import { MemorySettings } from '@/components/layout/memory-settings';
import { NotificationSettings } from '@/components/layout/notification-settings';
import { PersonalizationSettings } from '@/components/layout/personalization-settings';
import { PrivacySettings } from '@/components/layout/privacy-settings';
import { ShortcutsSettings } from '@/components/layout/shortcuts-settings';
import { cn } from '@/lib/utils';

export interface SettingsViewProps {
  onBack: () => void;
  chats?: ChatSession[];
  messages?: ChatMessage[];
  onClearChatHistory?: () => void;
  className?: string;
}

interface SectionItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const SETTINGS_SECTIONS: SectionItem[] = [
  { id: 'general', label: 'General', icon: SlidersHorizontal, description: 'Language, theme, typography scale, and behavior' },
  { id: 'ai-models', label: 'AI Models', icon: Sparkles, description: 'Default model, auto routing, custom endpoints, and parameters' },
  { id: 'memory', label: 'Memory', icon: Brain, description: 'Knowledge rules, category tags, and context scopes' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert triggers, task notices, and sound preferences' },
  { id: 'personalization', label: 'Personalization', icon: Palette, description: 'Response style, conversational tone, formatting, and depth' },
  { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck, description: 'Data retention, local storage, backups, and deletion' },
  { id: 'data', label: 'Data', icon: HardDrive, description: 'Storage management and backup settings' },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard, description: 'Keyboard commands and fast navigation' },
  { id: 'about', label: 'About', icon: Info, description: 'Version 0.1.0 and XviFloo acknowledgements' },
];

/**
 * SettingsView: Complete responsive settings shell fitting inside the navigation window.
 * Houses General, AI Models, Memory, Notifications, Personalization, Privacy, and Shortcuts.
 */
export function SettingsView({
  onBack,
  chats = [],
  messages = [],
  onClearChatHistory = () => { },
  className,
}: SettingsViewProps) {
  const { settings } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const lang = settings.language;

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  const currentSection =
    SETTINGS_SECTIONS.find((s) => s.id === activeSection) || SETTINGS_SECTIONS[0];

  const handleSelectCategory = (id: SettingsSection) => {
    setActiveSection(id);
    setShowCategoryMenu(false);
  };

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col select-none font-ui',
        'animate-in fade-in slide-in-from-right-3 duration-200 ease-out',
        className
      )}
    >
      {/* 1. Header Bar: Back Button, Title & Category Pill */}
      <div className="flex items-center justify-between pb-2.5 border-b border-kleava-border-subtle/50 mb-2 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            ref={backButtonRef}
            type="button"
            aria-label={t('back', lang)}
            onClick={onBack}
            className="w-6 h-6 rounded-kleava-sm flex items-center justify-center text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="typography-label font-semibold text-xs text-kleava-text-primary">
            {t('settings', lang)}
          </span>
        </div>

        {/* Category Switcher Trigger */}
        <button
          type="button"
          aria-label="Toggle settings categories"
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className={cn(
            'px-2 py-0.5 rounded-kleava-sm typography-metadata text-[10px] font-medium transition-colors',
            showCategoryMenu
              ? 'bg-kleava-accent text-white'
              : 'bg-kleava-surface-soft text-kleava-text-secondary hover:text-kleava-text-primary'
          )}
        >
          {showCategoryMenu ? 'Close Menu' : 'Categories'}
        </button>
      </div>

      {/* 2. Main Body: Switchable between Category List & Active Module Content */}
      {showCategoryMenu ? (
        /* Category Navigation List */
        <div
          role="tablist"
          aria-label="Settings categories"
          className="flex-1 overflow-y-auto scrollbar-none pr-0.5 space-y-0.5 min-h-[160px] animate-in fade-in duration-150"
        >
          <div className="px-2 py-1 mb-1">
            <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/70">
              Select Category
            </span>
          </div>

          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectCategory(section.id)}
                className={cn(
                  'w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-kleava-md',
                  'text-left typography-label text-xs transition-colors duration-150',
                  isActive
                    ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium border-l-2 border-kleava-accent rounded-l-none'
                    : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40',
                  'focus-ring-kleava'
                )}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 flex-shrink-0',
                    isActive ? 'text-kleava-accent' : 'text-kleava-text-secondary'
                  )}
                />
                <span className="truncate">{section.label}</span>
              </button>
            );
          })}
        </div>
      ) : activeSection === 'general' ? (
        <GeneralSettings />
      ) : activeSection === 'ai-models' ? (
        <ModelSettings />
      ) : activeSection === 'memory' ? (
        <MemorySettings />
      ) : activeSection === 'notifications' ? (
        <NotificationSettings />
      ) : activeSection === 'personalization' ? (
        <PersonalizationSettings />
      ) : activeSection === 'privacy' ? (
        <PrivacySettings
          chats={chats}
          messages={messages}
          onClearChatHistory={onClearChatHistory}
        />
      ) : activeSection === 'shortcuts' ? (
        <ShortcutsSettings />
      ) : (
        <SettingsContent
          sectionId={currentSection.id}
          title={currentSection.label}
          description={currentSection.description}
        />
      )}

      {/* 3. Footer Status */}
      <div className="mt-2 pt-2 border-t border-kleava-border-subtle/40 flex items-center justify-between text-kleava-text-secondary flex-shrink-0">
        <span className="typography-metadata text-[10px] truncate max-w-[190px]">
          {currentSection.label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent flex-shrink-0" />
      </div>
    </div>
  );
}

export default SettingsView;