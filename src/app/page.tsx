'use client';

import React, { useState } from 'react';
import { ChatSession, UserProfile as UserProfileType, ComposerAttachment } from '@/types';
import { ApplicationShell } from '@/components/layout/application-shell';
import { WelcomeState } from '@/components/modules/welcome-state';
import { NavTrigger } from '@/components/core/nav-trigger';
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
 * Orchestrates the Shell, NavTrigger, NavPanel, WelcomeState, and ChatComposer.
 */
export default function HomePage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'project'>('chat');
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);

  // Send message submission handler (with all parameters actively consumed)
  const handleSendMessage = (message: string, attachments: ComposerAttachment[], model: string) => {
    const hasAttachments = attachments.length > 0;
    const initialTitle = message.trim() || (hasAttachments ? `Attachment: ${attachments[0].name}` : 'New Conversation');

    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: initialTitle.slice(0, 30),
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: model, // associate selected model ID
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // New Chat Handler
  const handleNewChat = () => {
    setActiveChatId(undefined);
    setActiveView('chat');
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
      setActiveChatId(undefined);
    }
  };

  // Delete
  const handleDelete = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(undefined);
    }
  };

  // Reorder Pinned
  const handleReorderPinned = (reorderedPinned: ChatSession[]) => {
    setChats((prev) => {
      const unpinned = prev.filter((c) => !c.isPinned);
      return [...reorderedPinned, ...unpinned];
    });
  };

  return (
    <ApplicationShell>
      {/* Top Region: Houses the NavTrigger in top-left position */}
      <ApplicationShell.Top className="justify-between">
        <div className="relative">
          <NavTrigger
            isOpen={isNavOpen}
            onToggle={(open) => setIsNavOpen(open)}
          />
        </div>
        <div className="w-[38px] h-[38px]" /> {/* Spacer for top-right balance */}
      </ApplicationShell.Top>

      {/* Floating Navigation Panel */}
      <NavPanel
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        activeItem={activeView}
        chats={chats}
        user={CURRENT_USER}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setActiveView('chat');
        }}
        onPinToggle={handlePinToggle}
        onRename={handleRename}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onReorderPinned={handleReorderPinned}
        onNavigate={(item) => setActiveView(item)}
        onNewChat={handleNewChat}
      />

      {/* Main Region: Dynamic Welcome / Initial Canvas */}
      <ApplicationShell.Main>
        <WelcomeState userName={CURRENT_USER.name} />
      </ApplicationShell.Main>

      {/* Bottom Region: Dynamic Adaptive Chat Composer */}
      <ApplicationShell.Bottom>
        <ChatComposer onSend={handleSendMessage} />
      </ApplicationShell.Bottom>
    </ApplicationShell>
  );
}