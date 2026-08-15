'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChatSession,
  UserProfile as UserProfileType,
  ComposerAttachment,
  ChatMessage,
  MessageFeedback,
  CandidateMemorySuggestion,
  MemoryCategory,
  MemoryScope,
} from '@/types';
import { startAiStream, StreamController } from '@/lib/ai-stream';
import { resolveEffectiveModel } from '@/lib/model-router';
import { compileModelPayload } from '@/lib/generation-config';
import {
  resolveConversationMemoryContext,
  assembleStructuredMemoryContext,
  detectCandidateMemories,
} from '@/lib/memory-context-engine';
import { compilePersonalizationEnvelope } from '@/lib/personalization-engine';
import { useGlobalShortcuts } from '@/hooks/use-global-shortcuts';
import { useSettings } from '@/state/settings-context';
import { ApplicationShell } from '@/components/layout/application-shell';
import { BrandHeader } from '@/components/layout/brand-header';
import { WelcomeState } from '@/components/modules/welcome-state';
import { ConversationView } from '@/components/messages/conversation-view';
import { NavPanel } from '@/components/layout/nav-panel';
import { ChatComposer } from '@/components/composer/chat-composer';

// Mock User Profile
const CURRENT_USER: UserProfileType = {
  id: 'usr_1',
  name: 'Nafis',
  email: 'nafis@xvifloo.com',
  plan: 'Workspace Pro',
};

// Initial Mock Dataset for Recent Chats
const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'c1',
    title: 'Landing Page redesign',
    isPinned: true,
    pinnedOrder: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'c2',
    title: 'API architecture discussion',
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'c3',
    title: 'বাংলা প্রম্পট অপটিমাইজেশন',
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'c4',
    title: 'Authentication flow setup',
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

/**
 * Root Application Canvas:
 * Orchestrates Global Keyboard Shortcuts Dispatcher, Privacy Controls,
 * Memory Context Engine, Multi-Model resolution, and ChatComposer.
 */
export default function HomePage() {
  const {
    models,
    generationConfig,
    personalization,
    privacy,
    useMemory,
    autoSuggestMemories,
    injectMemoryInContext,
    memories,
    addMemory,
    dispatchAppNotification,
  } = useSettings();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'project'>('chat');
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [candidateSuggestions, setCandidateSuggestions] = useState<CandidateMemorySuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const navTriggerRef = useRef<HTMLButtonElement>(null);
  const activeStreamControllerRef = useRef<StreamController | null>(null);

  // Clean stream and audio on unmount
  useEffect(() => {
    return () => {
      activeStreamControllerRef.current?.cancel();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // New Chat Handler
  const handleNewChat = useCallback(() => {
    activeStreamControllerRef.current?.cancel();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
    setActiveChatId(undefined);
    setMessages([]);
    setCandidateSuggestions([]);
    setActiveView('chat');
    setIsProcessing(false);
    setIsLoadingSession(false);
    setSessionError(null);
  }, []);

  // Cancel / Stop Generation Handler
  const handleCancelGeneration = useCallback(() => {
    activeStreamControllerRef.current?.cancel();
    activeStreamControllerRef.current = null;
    setIsProcessing(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.status === 'streaming' ? { ...msg, status: 'cancelled' } : msg))
    );
  }, []);

  // Global Keyboard Shortcuts Dispatcher (Ctrl+K, Ctrl+B, Ctrl+, Alt+N, /, Escape)
  useGlobalShortcuts({
    onSearch: () => setIsNavOpen(true),
    onToggleNav: () => setIsNavOpen((prev) => !prev),
    onNewChat: handleNewChat,
    onOpenSettings: () => setIsNavOpen(true),
    onFocusComposer: () => {
      const textarea = document.querySelector('textarea');
      textarea?.focus();
    },
    onCancelGeneration: handleCancelGeneration,
  });

  // Send message submission handler
  const handleSendMessage = (message: string, attachments: ComposerAttachment[], modelId: string) => {
    if (isProcessing) return;
    const currentChatId = activeChatId || `chat-${Date.now()}`;

    // 1. Resolve active model profile
    const effectiveModel = resolveEffectiveModel({
      modelId,
      hasAttachments: attachments.length > 0,
      models,
    });

    // 2. Resolve scoped memories (Global + Project + Conversation)
    let memoryContextEnvelope = '';
    if (injectMemoryInContext) {
      const selectedMemories = resolveConversationMemoryContext({
        conversationId: currentChatId,
        projectId: activeView === 'project' ? 'active-proj' : undefined,
        userMessage: message,
        memories,
        useMemory,
        maxLimit: 6,
      });
      memoryContextEnvelope = assembleStructuredMemoryContext(selectedMemories);
    }

    // 3. Compile personalization directive envelope
    const personalizationEnvelope = compilePersonalizationEnvelope(personalization);

    // 4. Compile full model payload with active generation parameters & context envelopes
    compileModelPayload({
      prompt: `${message}${personalizationEnvelope}${memoryContextEnvelope}`,
      config: generationConfig,
      model: effectiveModel,
    });

    // 5. Create or update session in recent chats (respecting saveChatHistory privacy setting)
    if (privacy.saveChatHistory) {
      if (!activeChatId) {
        const initialTitle =
          message.trim() || (attachments.length > 0 ? `Attachment: ${attachments[0].name}` : 'New Conversation');
        const newChat: ChatSession = {
          id: currentChatId,
          title: initialTitle.slice(0, 30),
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId: effectiveModel.name,
        };
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(currentChatId);
      } else {
        setChats((prev) =>
          prev.map((c) => (c.id === currentChatId ? { ...c, updatedAt: new Date().toISOString() } : c))
        );
      }
    }

    // 6. Append user message
    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      chatId: currentChatId,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
      model: effectiveModel.name,
      attachments,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newUserMsg]);

    // 7. Check for automatic candidate memory suggestions if enabled
    if (autoSuggestMemories && useMemory) {
      const candidate = detectCandidateMemories(message, currentChatId);
      if (candidate) {
        setCandidateSuggestions((prev) => [...prev, candidate]);
        dispatchAppNotification(
          'memoryEvents',
          'Memory Rule Candidate',
          `Detected preference: "${candidate.content.slice(0, 40)}..."`,
          'info',
          'Memory Engine'
        );
      }
    }

    // 8. Initiate decoupled AI Stream
    const assistantMsgId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      chatId: currentChatId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      model: effectiveModel.name,
      status: 'streaming',
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);
    setIsProcessing(true);

    activeStreamControllerRef.current?.cancel();
    activeStreamControllerRef.current = startAiStream(
      message || 'নতুন প্রজেক্ট আলোচনা',
      effectiveModel.name,
      {
        onChunk: (accumulated) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulated, status: 'streaming' } : m
            )
          );
        },
        onComplete: (full) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: full, status: 'complete' } : m
            )
          );
          setIsProcessing(false);
          activeStreamControllerRef.current = null;
          dispatchAppNotification(
            'aiResponses',
            'Response Complete',
            `AI generated response using ${effectiveModel.name}`,
            'success',
            'AI Stream Engine'
          );
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, status: 'error', errorMessage: 'Stream generation failed. Please retry.' }
                : m
            )
          );
          setIsProcessing(false);
          activeStreamControllerRef.current = null;
          dispatchAppNotification(
            'errorsAndWarnings',
            'Generation Failed',
            'AI Stream request failed. You can retry the message.',
            'error',
            'AI Stream Engine'
          );
        },
      }
    );
  };

  // Clear Chat History Privacy Action
  const handleClearAllChats = () => {
    setChats([]);
    setMessages([]);
    setActiveChatId(undefined);
    setCandidateSuggestions([]);
    dispatchAppNotification(
      'systemUpdates',
      'Chat History Cleared',
      'All local conversations have been deleted from your browser.',
      'info',
      'Privacy Engine'
    );
  };

  // Candidate Memory Suggestion Accept Handler
  const handleAcceptMemorySuggestion = (
    suggestionId: string,
    content: string,
    type: MemoryCategory,
    scope: MemoryScope
  ) => {
    addMemory({
      title: content.slice(0, 24) || 'Saved Rule',
      content,
      type,
      source: 'AI Suggested',
      scope,
      usage: 'relevant',
      pinned: false,
      enabled: true,
      tags: ['user-confirmed'],
    });

    setCandidateSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
    dispatchAppNotification(
      'memoryEvents',
      'Memory Saved',
      `Saved rule under ${scope} scope.`,
      'success',
      'Memory System'
    );
  };

  // Candidate Memory Suggestion Dismiss Handler
  const handleDismissMemorySuggestion = (suggestionId: string) => {
    setCandidateSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  // Select Chat Session
  const handleSelectChat = (id: string) => {
    activeStreamControllerRef.current?.cancel();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
    setActiveChatId(id);
    setActiveView('chat');
    setIsLoadingSession(true);
    setSessionError(null);
    setIsProcessing(false);
    setCandidateSuggestions([]);

    // Simulate session restoration
    setTimeout(() => {
      setIsLoadingSession(false);
      setMessages([
        {
          id: `msg-restored-1-${id}`,
          chatId: id,
          role: 'user',
          content: 'পূর্ববর্তী সেশনের আলোচনা ও রিকোয়ারমেন্টস দেখতে চাই।',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: 'sent',
        },
        {
          id: `msg-restored-2-${id}`,
          chatId: id,
          role: 'assistant',
          content: `### পূর্ববর্তী সেশনের সংক্ষেপ\nএই সেশনে আমরা **${id}** সংক্রান্ত কাজগুলো রিভিউ করেছিলাম।`,
          createdAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
          status: 'complete',
        },
      ]);
    }, 150);
  };

  // Feedback Handler (Love / Broken Love)
  const handleFeedback = (messageId: string, feedback: MessageFeedback) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
  };

  // Retry Response Handler
  const handleRetry = (messageId: string) => {
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;
    handleSendMessage('পুনরায় জেনারেট করা হচ্ছে', [], targetMsg.model || 'kleava-0.7');
  };

  // Edit Message Handler
  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true, updatedAt: new Date().toISOString() }
          : msg
      )
    );
  };

  // Pin / Unpin Toggle
  const handlePinToggle = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const nextPinned = !chat.isPinned;
          return {
            ...chat,
            isPinned: nextPinned,
            pinnedOrder: nextPinned ? 0 : undefined,
          };
        }
        return chat;
      })
    );
  };

  // Rename
  const handleRename = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle, updatedAt: new Date().toISOString() } : chat
      )
    );
  };

  // Archive
  const handleArchive = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, isArchived: true } : chat))
    );
    if (activeChatId === chatId) {
      handleNewChat();
    }
  };

  // Delete
  const handleDelete = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      handleNewChat();
    }
  };

  // Reorder Pinned
  const handleReorderPinned = (reorderedPinned: ChatSession[]) => {
    setChats((prev) => {
      const unpinned = prev.filter((c) => !c.isPinned);
      return [...reorderedPinned, ...unpinned];
    });
  };

  // Close Navigation
  const handleCloseNav = () => {
    setIsNavOpen(false);
    navTriggerRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <ApplicationShell>
      {/* Top Region: Top-Left Two-Dot Trigger & Top-Right Brand Anchor */}
      <ApplicationShell.Top>
        <BrandHeader
          isNavOpen={isNavOpen}
          onToggleNav={(open) => setIsNavOpen(open)}
          triggerRef={navTriggerRef}
        />
      </ApplicationShell.Top>

      {/* Floating Navigation Window with Settings Shell */}
      <NavPanel
        isOpen={isNavOpen}
        onClose={handleCloseNav}
        activeItem={activeView}
        chats={chats}
        user={CURRENT_USER}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onPinToggle={handlePinToggle}
        onRename={handleRename}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onReorderPinned={handleReorderPinned}
        onNavigate={(item) => setActiveView(item)}
        onNewChat={handleNewChat}
      />

      {/* Main Region: Conditional Rendering between Welcome State and Live Conversation Feed */}
      <ApplicationShell.Main>
        {!hasMessages ? (
          <WelcomeState userName={CURRENT_USER.name} />
        ) : (
          <ConversationView
            messages={messages}
            candidateSuggestions={candidateSuggestions}
            isLoadingSession={isLoadingSession}
            sessionError={sessionError}
            currentlySpeakingId={currentlySpeakingId}
            onAcceptMemorySuggestion={handleAcceptMemorySuggestion}
            onDismissMemorySuggestion={handleDismissMemorySuggestion}
            onStartSpeaking={(id: string) => setCurrentlySpeakingId(id)}
            onStopSpeaking={() => setCurrentlySpeakingId(null)}
            onRetrySession={() => setSessionError(null)}
            onEditMessage={handleEditMessage}
            onFeedbackMessage={handleFeedback}
            onRetryMessage={handleRetry}
          />
        )}
      </ApplicationShell.Main>

      {/* Bottom Region: Adaptive Chat Composer */}
      <ApplicationShell.Bottom>
        <ChatComposer
          onSend={handleSendMessage}
          onCancel={handleCancelGeneration}
          isProcessing={isProcessing}
        />
      </ApplicationShell.Bottom>
    </ApplicationShell>
  );
}