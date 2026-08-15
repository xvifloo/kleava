/**
 * KLEAVA AI — CORE TYPE DEFINITIONS
 */

export type ModelProvider = 'kleava' | 'openai' | 'anthropic' | 'custom';

export type ModelCapability = 'speed' | 'reasoning' | 'coding' | 'vision';

export type ModelGroup = 'Recommended' | 'Kleava' | 'External Providers' | 'Custom';

export type ResponseLengthMode = 'short' | 'balanced' | 'long';

export interface ModelGenerationConfig {
  temperature: number; // 0.0 to 1.0
  responseLength: ResponseLengthMode;
  streaming: boolean;
  reasoningMode: boolean;
  visionEnabled: boolean;
}

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
  isCustom?: boolean;
  contextWindow?: number;
  apiKey?: string;
  baseUrl?: string;
  requiresApiKey?: boolean;
  isAutoRoutable?: boolean;
}

export type MemoryScope = 'Global' | 'Project' | 'Chat';

export type MemoryCategory =
  | 'Preference'
  | 'Project'
  | 'Workflow'
  | 'Context'
  | 'Instruction'
  | 'Other';

export type MemorySource = 'Manual' | 'AI Suggested' | 'Imported' | 'System';

export interface MemoryRecord {
  id: string;
  title: string;
  content: string;
  category: MemoryCategory;
  source: MemorySource;
  scope: MemoryScope;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  chatId?: string;
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

export type ChatTimeGroup = 'Pinned' | 'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  plan?: string;
}

export type SettingsSection =
  | 'general'
  | 'ai-models'
  | 'memory'
  | 'notifications'
  | 'personalization'
  | 'privacy'
  | 'data'
  | 'shortcuts'
  | 'about';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSizeMode = 'small' | 'default' | 'large';
export type LanguageCode = 'en' | 'bn';

export interface GeneralSettings {
  theme: ThemeMode;
  accentColor: string;
  language: LanguageCode;
  fontSize: FontSizeMode;
  autoSave: boolean;
  compactMode: boolean;
  reduceMotion: boolean;
  soundEffects: boolean;
}

export interface NotificationSettings {
  enabled: boolean; // Master toggle
  chatActivity: boolean;
  taskCompleted: boolean;
  errorAlerts: boolean;
  systemUpdates: boolean;
  memoryUpdates: boolean;
  modelUpdates: boolean;
  soundEffects: boolean;
  voiceAutoPlay: boolean;
  desktopAlerts: boolean;
}

export type NotificationType =
  | 'chatActivity'
  | 'taskCompleted'
  | 'errorAlerts'
  | 'systemUpdates'
  | 'memoryUpdates'
  | 'modelUpdates';

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