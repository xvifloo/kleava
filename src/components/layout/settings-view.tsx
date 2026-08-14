'use client';

import React, { useState } from 'react';
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
import { SettingsSection } from '@/types';
import { cn } from '@/lib/utils';

export interface SettingsViewProps {
  onBack: () => void;
  className?: string;
}

interface SectionItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SETTINGS_SECTIONS: SectionItem[] = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'models', label: 'AI Models', icon: Sparkles },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
  { id: 'data', label: 'Data', icon: HardDrive },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Info },
];

/**
 * SettingsView: Smooth navigation drawer view housing all future settings categories.
 */
export function SettingsView({ onBack, className }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col',
        'animate-in fade-in slide-in-from-right-3 duration-200 ease-out',
        className
      )}
    >
      {/* Top Header: Back button & Title */}
      <div className="flex items-center space-x-2.5 pb-2.5 border-b border-kleava-border-subtle/50 mb-2 flex-shrink-0">
        <button
          type="button"
          aria-label="Back to navigation"
          onClick={onBack}
          className="w-6 h-6 rounded-kleava-sm flex items-center justify-center text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-soft transition-colors focus-ring-kleava"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <span className="typography-label font-semibold text-xs text-kleava-text-primary">
          Settings
        </span>
      </div>

      {/* Settings Category Navigation List */}
      <div className="flex-1 overflow-y-auto scrollbar-none pr-0.5 space-y-0.5 min-h-[160px]">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-kleava-md',
                'text-left typography-label text-xs transition-colors duration-150',
                isActive
                  ? 'bg-kleava-surface-soft text-kleava-text-primary font-medium border-l-2 border-kleava-accent rounded-l-none'
                  : 'text-kleava-text-secondary hover:text-kleava-text-primary hover:bg-kleava-surface-light/40',
                'focus-ring-kleava'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', isActive ? 'text-kleava-accent' : 'text-kleava-text-secondary')} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Category Badge / Prepared Canvas */}
      <div className="mt-2 pt-2 border-t border-kleava-border-subtle/40 flex items-center justify-between text-kleava-text-secondary flex-shrink-0">
        <span className="typography-metadata text-[10px]">
          {currentSection?.label} Ready
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent" />
      </div>
    </div>
  );
}

export default SettingsView;