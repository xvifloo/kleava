/**
 * KLEAVA AI — CORE TYPE DEFINITIONS
 */

export type ModelProvider = 'kleava' | 'openai' | 'anthropic' | 'custom';

export type ModelCapability = 'speed' | 'reasoning' | 'coding' | 'vision';

export interface ModelProfile {
  id: string;
  name: string;
  provider: ModelProvider;
  capabilities: ModelCapability[];
  contextWindow?: number;
  isAutoRoutable?: boolean;
}

export type MemoryScope = 'global' | 'project' | 'chat' | 'temporary';

export interface MemoryRecord {
  id: string;
  scope: MemoryScope;
  key: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  isArchived?: boolean;
  pinnedOrder?: number;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export type ChatTimeGroup = 'Pinned' | 'Today' | 'Yesterday' | 'Last 7 Days' | 'Older';