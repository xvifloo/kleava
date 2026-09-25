'use client';

import React from 'react';
import {
    Bell,
    CheckCheck,
    Trash2,
    X,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
} from 'lucide-react';
import { useSettings } from '@/state/settings-context';
import { NotificationRecord, NotificationSeverity } from '@/types';
import { formatRelativeTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

function renderSeverityIcon(severity: NotificationSeverity) {
    switch (severity) {
        case 'success':
            return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
        case 'warning':
            return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
        case 'error':
            return <AlertCircle className="w-3.5 h-3.5 text-kleava-destructive flex-shrink-0" />;
        case 'info':
        default:
            return <Info className="w-3.5 h-3.5 text-kleava-accent flex-shrink-0" />;
    }
}

/**
 * NotificationFeed: Compact, scrollable in-app notification inbox
 * with unread markers, single dismiss, and mark all as read.
 */
export function NotificationFeed() {
    const {
        notificationEvents,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        clearAllNotifications,
    } = useSettings();

    return (
        <div className="w-full flex flex-col space-y-2 select-none font-ui">
            {/* Feed Controls Header */}
            <div className="flex items-center justify-between px-1 pb-1">
                <div className="flex items-center space-x-1.5">
                    <span className="typography-metadata uppercase tracking-wider text-[10px] font-semibold text-kleava-text-secondary/70">
                        Inbox
                    </span>
                    {unreadNotificationCount > 0 && (
                        <span className="typography-metadata text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-kleava-accent text-white">
                            {unreadNotificationCount}
                        </span>
                    )}
                </div>

                {notificationEvents.length > 0 && (
                    <div className="flex items-center space-x-2 text-[10.5px]">
                        {unreadNotificationCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllNotificationsAsRead}
                                className="text-kleava-accent hover:underline flex items-center space-x-0.5"
                            >
                                <CheckCheck className="w-3 h-3" />
                                <span>Mark all read</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={clearAllNotifications}
                            className="text-kleava-destructive hover:underline flex items-center space-x-0.5"
                        >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Notifications List */}
            <div className="flex flex-col space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-none">
                {notificationEvents.length === 0 ? (
                    <div className="py-6 text-center px-4 rounded-kleava-md bg-kleava-surface-light/20 border border-kleava-border-subtle/40">
                        <Bell className="w-5 h-5 text-kleava-text-secondary/40 mx-auto mb-1" />
                        <p className="typography-caption text-kleava-text-secondary text-xs">
                            No notifications yet.
                        </p>
                    </div>
                ) : (
                    notificationEvents.map((notif: NotificationRecord) => (
                        <div
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={cn(
                                'group p-2 rounded-kleava-md border transition-all duration-150 cursor-pointer',
                                notif.read
                                    ? 'bg-kleava-surface-light/20 border-kleava-border-subtle/40 opacity-75'
                                    : 'bg-kleava-surface border-kleava-accent/30 shadow-xs'
                            )}
                        >
                            <div className="flex items-start justify-between space-x-2">
                                <div className="flex items-start space-x-2 min-w-0">
                                    {renderSeverityIcon(notif.severity)}
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center space-x-1.5">
                                            <span className="typography-label text-xs font-semibold text-kleava-text-primary truncate">
                                                {notif.title}
                                            </span>
                                            {!notif.read && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-kleava-accent flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="typography-metadata text-[10.5px] text-kleava-text-secondary mt-0.5 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    aria-label={`Dismiss ${notif.title}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissNotification(notif.id);
                                    }}
                                    className="p-1 rounded-full text-kleava-text-secondary/50 hover:text-kleava-destructive hover:bg-red-50 transition-colors flex-shrink-0"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[9px] text-kleava-text-secondary/60 pl-5">
                                <span>{notif.source}</span>
                                <span>{formatRelativeTime(notif.timestamp)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationFeed;