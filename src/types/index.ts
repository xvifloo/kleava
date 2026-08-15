/**
 * KLEAVA AI — CORE TYPE DEFINITIONS
 */

export type ModelProvider = 'kleava' | 'openai' | 'anthropic' | 'google' | 'local' | 'custom';

export type ModelCapability = 'text' | 'vision' | 'reasoning' | 'coding' | 'speed' | 'tools';

export type ModelGroup = 'Recommended' | 'Built-in' | 'Kleava' | 'External Providers' | 'Custom';

export type ModelAvailability = 'available' | 'config_required' | 'unavailable' | 'disabled';

export type ResponseLengthMode = 'short' | 'balanced' | 'detailed' | 'maximum';

export interface ModelGenerationConfig {
  temperature: number; // 0.0 to 1.0
  responseLength: ResponseLengthMode;
  streaming: boolean;
  reasoningMode: boolean;
  visionEnabled: boolean;
  autoModelSelection: boolean;
}

export interface ModelProfile {
  id: string;
  name: string;
  provider: ModelProvider;
  group: ModelGroup;
  type: 'builtin' | 'custom';
  description: string;
  capabilities: ModelCapability[];
  badge?: string;
  isDefault?: boolean;
  isAvailable: boolean;
  availability: ModelAvailability;
  isCustom?: boolean;
  contextWindow?: number;
  apiKey?: string;
  baseUrl?: string;
  requiresApiKey?: boolean;
  supportsStreaming?: boolean;
  supportsVision?: boolean;
  supportsReasoning?: boolean;
  isAutoRoutable?: boolean;
}

export type MemoryScope = 'Global' | 'Project' | 'Conversation';

export type MemoryCategory =
  | 'Personal'
  | 'Preference'
  | 'Project'
  | 'Workflow'
  | 'Context'
  | 'Instruction'
  | 'Custom'
  | 'Other';

export type MemorySource = 'Manual' | 'AI Suggested' | 'Imported' | 'System';

export type MemoryUsageOption = 'always' | 'relevant' | 'never';

export interface MemoryRecord {
  id: string;
  title: string;
  content: string;
  type: MemoryCategory;
  category?: MemoryCategory;
  source: MemorySource;
  scope: MemoryScope;
  enabled: boolean;
  pinned: boolean;
  usage?: MemoryUsageOption;
  tags?: string[];
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  chatId?: string;
  version?: number;
}

export interface SelectedContextMemory {
  memoryId: string;
  title: string;
  content: string;
  type: MemoryCategory;
  scope: MemoryScope;
  priorityScore: number;
  reason: string;
  source: MemorySource;
}

export interface CandidateMemorySuggestion {
  id: string;
  content: string;
  suggestedType: MemoryCategory;
  suggestedScope: MemoryScope;
  confidence: number;
  sourceConversationId: string;
  tags: string[];
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
export type FontSizeMode = 'small' | 'medium' | 'large';
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

export type ResponseStyleMode = 'balanced' | 'concise' | 'detailed' | 'technical';
export type ToneMode = 'neutral' | 'friendly' | 'professional' | 'direct' | 'casual';
export type ResponseLanguageMode = 'match_input' | 'en' | 'bn';
export type FormattingStyleMode = 'clean' | 'structured' | 'minimal';
export type DetailLevelMode = 'brief' | 'balanced' | 'deep';
export type EmojiUsageMode = 'off' | 'minimal' | 'normal';
export type TechnicalDepthMode = 'simple' | 'standard' | 'advanced';
export type ProactiveBehaviorMode = 'minimal' | 'balanced' | 'proactive';

export interface PersonalizationSettings {
  responseStyle: ResponseStyleMode;
  tone: ToneMode;
  responseLanguage: ResponseLanguageMode;
  formattingStyle: FormattingStyleMode;
  detailLevel: DetailLevelMode;
  emojiUsage: EmojiUsageMode;
  technicalDepth: TechnicalDepthMode;
  proactiveBehavior: ProactiveBehaviorMode;
}

export interface PrivacySettings {
  saveChatHistory: boolean;
  enableMemoryPrivacy: boolean;
  analyticsTelemetry: boolean;
  modelTrainingOptOut: boolean;
}

export type ShortcutCategory =
  | 'Global'
  | 'Navigation'
  | 'Chat'
  | 'Composer'
  | 'Messages'
  | 'Settings';

export type ShortcutScope = 'Global' | 'App' | 'Composer' | 'Settings';

export interface KeyboardShortcutItem {
  id: string;
  action: string;
  keys: string[];
  category: ShortcutCategory;
  description: string;
  enabled: boolean;
  scope: ShortcutScope;
  isCustom?: boolean;
}

export type NotificationCategory =
  | 'aiResponses'
  | 'chatActivity'
  | 'systemUpdates'
  | 'errorsAndWarnings'
  | 'memoryEvents';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NotificationSettings {
  enabled: boolean;
  aiResponses: boolean;
  chatActivity: boolean;
  systemUpdates: boolean;
  errorsAndWarnings: boolean;
  memoryEvents: boolean;
  sound: boolean;
  voiceAutoPlay: boolean;
  desktopAlerts: boolean;
}

export interface NotificationRecord {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: NotificationSeverity;
  source: string;
}

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