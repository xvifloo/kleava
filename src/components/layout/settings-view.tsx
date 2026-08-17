'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Brain,
  Bell,
  Palette,
  ShieldCheck,
  Keyboard,
  Info,
  ChevronRight,
} from 'lucide-react';
import { SettingsSection, ChatSession, ChatMessage } from '@/types';
import { useSettings } from '@/state/settings-context';
import { t, TranslationKey } from '@/lib/i18n';
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
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  descriptionKey: TranslationKey;
}

const SETTINGS_SECTIONS: SectionItem[] = [
  { id: 'general', labelKey: 'categoryGeneral', icon: SlidersHorizontal, descriptionKey: 'generalSettingsDesc' },
  { id: 'ai-models', labelKey: 'categoryModels', icon: Sparkles, descriptionKey: 'categoryModels' },
  { id: 'memory', labelKey: 'categoryMemory', icon: Brain, descriptionKey: 'categoryMemory' },
  { id: 'notifications', labelKey: 'categoryNotifications', icon: Bell, descriptionKey: 'categoryNotifications' },
  { id: 'personalization', labelKey: 'categoryPersonalization', icon: Palette, descriptionKey: 'categoryPersonalization' },
  { id: 'privacy', labelKey: 'categoryPrivacy', icon: ShieldCheck, descriptionKey: 'categoryPrivacy' },
  { id: 'shortcuts', labelKey: 'categoryShortcuts', icon: Keyboard, descriptionKey: 'categoryShortcuts' },
  { id: 'about', labelKey: 'categoryAbout', icon: Info, descriptionKey: 'categoryAbout' },
];

const SEARCHABLE_SETTING_ITEMS: Array<{
  section: SettingsSection;
  titleKey: TranslationKey;
  keywords: string[];
}> = [
    { section: 'general', titleKey: 'colorTheme', keywords: ['theme', 'dark', 'light', 'থিম', 'ডার্ক', 'লাইট'] },
    { section: 'general', titleKey: 'accentColor', keywords: ['accent', 'color', 'mint', 'কালার', 'রং'] },
    { section: 'general', titleKey: 'language', keywords: ['language', 'english', 'bangla', 'ভাষা', 'বাংলা', 'ইংরেজি'] },
    { section: 'general', titleKey: 'contentFontSize', keywords: ['font', 'size', 'scale', 'ফন্ট', 'সাইজ'] },
    { section: 'general', titleKey: 'autoSave', keywords: ['autosave', 'save', 'অটো সেভ'] },
    { section: 'general', titleKey: 'compactMode', keywords: ['compact', 'density', 'কমপ্যাক্ট'] },
    { section: 'ai-models', titleKey: 'categoryModels', keywords: ['model', 'temperature', 'streaming', 'reasoning', 'vision', 'মডেল', 'টেম্পারেচার', 'স্ট্রিমিং'] },
    { section: 'memory', titleKey: 'categoryMemory', keywords: ['memory', 'knowledge', 'scope', 'rules', 'মেমোরি', 'স্কোপ'] },
    { section: 'notifications', titleKey: 'categoryNotifications', keywords: ['notification', 'sound', 'alert', 'নোটিফিকেশন', 'সাউন্ড'] },
    { section: 'personalization', titleKey: 'categoryPersonalization', keywords: ['tone', 'style', 'emoji', 'depth', 'টোন', 'স্টাইল', 'ইমোজি'] },
    { section: 'privacy', titleKey: 'categoryPrivacy', keywords: ['privacy', 'export', 'delete', 'telemetry', 'প্রাইভেসি', 'এক্সপোর্ট', 'মুছুন'] },
    { section: 'shortcuts', titleKey: 'categoryShortcuts', keywords: ['shortcut', 'keyboard', 'ctrl', 'cmd', 'শর্টকাট', 'কীবোর্ড'] },
    { section: 'about', titleKey: 'categoryAbout', keywords: ['about', 'version', 'সম্পর্কে', 'ভার্সন'] },
  ];

/**
 * SettingsView: Redesigned clean settings shell.
 * Structure:
 * Settings Header (with Back)
 * [ Search settings... ]
 * Horizontal Scrollable Categories Bar
 * [ Active Section Content / Search Results ]
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
  const [searchQuery, setSearchQuery] = useState('');
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const lang = settings.language;

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  // Scroll active tab into view when selected
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeSection]);

  // Settings Search Filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return SEARCHABLE_SETTING_ITEMS.filter((item) => {
      const title = t(item.titleKey, lang).toLowerCase();
      const matchedKeyword = item.keywords.some((k) => k.toLowerCase().includes(q));
      return title.includes(q) || matchedKeyword;
    });
  }, [searchQuery, lang]);

  const isSearchActive = searchQuery.trim().length > 0;
  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === activeSection) || SETTINGS_SECTIONS[0];

  const handleSelectSearchResult = (section: SettingsSection) => {
    setActiveSection(section);
    setSearchQuery('');
  };

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col select-none font-ui',
        'animate-in fade-in slide-in-from-right-3 duration-200 ease-out',
        className
      )}
    >
      {/* 1. Header Bar: Back Button & Title */}
      <div className="flex items-center space-x-2 pb-2 flex-shrink-0">
        <button
          ref={backButtonRef}
          type="button"
          aria-label={t('back', lang)}
          onClick={onBack}
          className="w-6 h-6 rounded-kleava-sm flex items-center justify-center text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] transition-colors focus-ring-kleava"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <span className="typography-label font-semibold text-xs text-kleava-text-primary">
          {t('settingsTitle', lang)}
        </span>
      </div>

      {/* 2. Search Settings Input Bar */}
      <div className="relative mb-2.5 flex items-center flex-shrink-0">
        <Search className="absolute left-2.5 w-3.5 h-3.5 text-kleava-text-secondary/60 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchSettingsPlaceholder', lang)}
          className="w-full pl-8 pr-7 py-1.5 rounded-kleava-md bg-kleava-surface-light/40 dark:bg-[#1E2A27]/50 text-xs text-kleava-text-primary placeholder:text-kleava-text-secondary/60 focus:outline-none focus:ring-1 focus:ring-kleava-accent/40 transition-all"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            aria-label="Clear settings search"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 text-kleava-text-secondary hover:text-kleava-text-primary p-0.5 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3. Horizontal Scrollable Category Navigation Bar (No hard border/dividers) */}
      {!isSearchActive && (
        <div
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Settings categories navigation"
          className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-2 mb-2 flex-shrink-0 text-xs"
        >
          {SETTINGS_SECTIONS.map((section) => {
            const isSelected = section.id === activeSection;
            return (
              <button
                key={section.id}
                ref={isSelected ? activeTabRef : null}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'px-2.5 py-1 rounded-kleava-control font-medium whitespace-nowrap transition-all shrink-0',
                  isSelected
                    ? 'bg-kleava-accent/15 text-kleava-accent font-semibold shadow-2xs'
                    : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40 dark:hover:bg-[#1E2A27]/40'
                )}
              >
                {t(section.labelKey, lang)}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Content Area: Switch between Search Results and Selected Section */}
      {isSearchActive ? (
        /* Settings Search Results Feed */
        <div className="flex-1 overflow-y-auto scrollbar-none pr-0.5 space-y-1 min-h-[160px]">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-kleava-text-secondary">
              {t('noSettingsFound', lang)}
            </div>
          ) : (
            searchResults.map((res, rIdx) => (
              <div
                key={rIdx}
                onClick={() => handleSelectSearchResult(res.section)}
                className="p-2 rounded-kleava-md bg-kleava-surface-light/30 dark:bg-[#1E2A27]/40 hover:bg-kleava-surface-light dark:hover:bg-[#1E2A27] cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="typography-label text-xs font-medium text-kleava-text-primary">
                    {t(res.titleKey, lang)}
                  </span>
                  <span className="typography-metadata text-[10px] text-kleava-text-secondary capitalize">
                    {res.section.replace('-', ' ')}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-kleava-text-secondary/50 shrink-0" />
              </div>
            ))
          )}
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
          title={t(currentSection.labelKey, lang)}
          description={t(currentSection.descriptionKey, lang)}
        />
      )}
    </div>
  );
}

export default SettingsView;