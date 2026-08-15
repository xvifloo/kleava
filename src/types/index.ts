/**
 * KLEAVA AI — CORE TYPE DEFINITIONS
 */

export type ModelProvider = 'kleava' | 'openai' | 'anthropic' | 'custom';

export type ModelCapability = 'speed' | 'reasoning' | 'coding' | 'vision';

export type ModelGroup = 'Recommended' | 'Kleava' | 'External Providers' | 'Custom';

export interface ModelProfile {
  id: string;
  name: string;
  provider: ModelProvider;
  group: ModelGroup;
  description: string;
  capabilities: ModelCapability[];
  badge?: string;
  isDefault?: boolean;
  isAvailable: boolean;
  contextWindow?: number;
  requiresApiKey?: boolean;
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

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  plan?: string;
}

export type SettingsSection =
  | 'general'
  | 'models'
  | 'memory'
  | 'notifications'
  | 'personalization'
  | 'privacy'
  | 'data'
  | 'shortcuts'
  | 'about';

export interface ComposerAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status?: 'ready' | 'uploading' | 'error';
  error?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'idle' | 'sending' | 'sent' | 'streaming' | 'complete' | 'error' | 'cancelled';
export type MessageFeedback = 'love' | 'broken-love' | null;

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  updatedAt?: string;
  model?: string;
  attachments?: ComposerAttachment[];
  status?: MessageStatus;
  feedback?: MessageFeedback;
  errorMessage?: string;
  isEdited?: boolean;
}