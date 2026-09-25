import { ChatSession, ChatTimeGroup } from '@/types';

/**
 * Formats an ISO date string into a user-friendly, human-readable relative timestamp.
 * Examples: 'Just now', '12 minutes ago', '2 hours ago', 'Yesterday', '3 days ago'
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Categorizes a list of chats into clean chronological groups:
 * Pinned, Today, Yesterday, Previous 7 Days, Older
 * Sorted by updatedAt descending.
 */
export function groupChatsByDate(chats: ChatSession[]): Record<ChatTimeGroup, ChatSession[]> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const prev7DaysStart = todayStart - 86400000 * 6;

  const groups: Record<ChatTimeGroup, ChatSession[]> = {
    Pinned: [],
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  const nonArchived = chats.filter((c) => !c.isArchived);

  // 1. Separate & sort pinned chats
  const pinnedChats = nonArchived
    .filter((c) => c.isPinned)
    .sort((a, b) => (a.pinnedOrder ?? 0) - (b.pinnedOrder ?? 0));
  groups.Pinned = pinnedChats;

  // 2. Chronologically sort unpinned chats (latest active on top)
  const unpinnedChats = nonArchived.filter((c) => !c.isPinned);
  unpinnedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  unpinnedChats.forEach((chat) => {
    const chatTime = new Date(chat.updatedAt).getTime();
    if (chatTime >= todayStart) {
      groups.Today.push(chat);
    } else if (chatTime >= yesterdayStart) {
      groups.Yesterday.push(chat);
    } else if (chatTime >= prev7DaysStart) {
      groups['Previous 7 Days'].push(chat);
    } else {
      groups.Older.push(chat);
    }
  });

  return groups;
}