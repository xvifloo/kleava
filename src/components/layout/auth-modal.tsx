'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { cn } from '@/lib/utils';

export interface AuthModalProps {
    isOpen: boolean;
    initialMode?: 'signin' | 'signup';
    onClose: () => void;
    onSuccess: (user: UserProfile) => void;
}

/**
 * AuthModal: Clean, minimal authentication dialog for Sign In and Sign Up.
 */
export function AuthModal({
    isOpen,
    initialMode = 'signin',
    onClose,
    onSuccess,
}: AuthModalProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const [name, setName] = useState('Nafis');
    const [email, setEmail] = useState('nafis@xvifloo.com');
    const [password, setPassword] = useState('password123');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess({
            id: `usr_${Date.now()}`,
            name: name.trim() || 'User',
            email: email.trim(),
            plan: 'Workspace Pro',
        });
        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[70] bg-black/30 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3.5 select-none font-ui animate-in fade-in duration-150"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xs bg-kleava-surface dark:bg-[#151F1C] rounded-kleava-lg border border-kleava-border-subtle/50 shadow-kleava-floating p-4 flex flex-col space-y-3"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-1 border-b border-kleava-border-subtle/40">
                    <span className="typography-label font-semibold text-xs text-kleava-text-primary">
                        {mode === 'signin' ? 'Sign in to Kleava' : 'Create an Account'}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-5 h-5 rounded hover:bg-kleava-surface-soft dark:hover:bg-[#1E2A27] flex items-center justify-center text-kleava-text-secondary text-xs"
                    >
                        ✕
                    </button>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2.5">
                    {mode === 'signup' && (
                        <div>
                            <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 dark:bg-[#1E2A27]/60 border border-kleava-border-subtle text-kleava-text-primary focus:outline-none focus:border-kleava-accent"
                            />
                        </div>
                    )}

                    <div>
                        <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 dark:bg-[#1E2A27]/60 border border-kleava-border-subtle text-kleava-text-primary focus:outline-none focus:border-kleava-accent"
                        />
                    </div>

                    <div>
                        <label className="typography-metadata text-[10px] text-kleava-text-secondary block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-2.5 py-1.5 rounded-kleava-sm text-xs bg-kleava-surface-light/40 dark:bg-[#1E2A27]/60 border border-kleava-border-subtle text-kleava-text-primary focus:outline-none focus:border-kleava-accent"
                        />
                    </div>

                    <div className="pt-1 flex flex-col space-y-2">
                        <button
                            type="submit"
                            className="w-full py-1.5 text-xs rounded bg-kleava-accent text-white font-medium hover:opacity-90 transition-opacity focus-ring-kleava shadow-2xs"
                        >
                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="typography-metadata text-[10.5px] text-kleava-text-secondary hover:text-kleava-accent transition-colors text-center"
                        >
                            {mode === 'signin'
                                ? "Don't have an account? Sign Up"
                                : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;