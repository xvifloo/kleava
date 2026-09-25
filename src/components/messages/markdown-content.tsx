'use client';

import React from 'react';
import { CodeBlock } from '@/components/messages/code-block';
import { isSafeUrl } from '@/lib/text-utils';
import { cn } from '@/lib/utils';

export interface MarkdownContentProps {
    content: string;
    className?: string;
}

/**
 * MarkdownContent: Clean, divider-less document formatter for Kleava AI.
 * Strict Typography Roles:
 * - Regular Text: Hind Siliguri (Bengali) / Geist (English)
 * - Emphasized / Bold Words: Lora Bold (English) / Hind Siliguri SemiBold (Bengali)
 * - Headings: Geist (font-ui)
 * - Code & Inline Code: JetBrains Mono (font-code)
 * - Separation: Pure typographic spacing and vertical rhythm without harsh horizontal lines
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
    const blocks = content.split('\n\n');

    const renderInlineFormatted = (text: string) => {
        // Split links, inline code, bold, and italics
        const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

        return parts.map((part, index) => {
            // 1. Links [Title](URL)
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
                const linkText = linkMatch[1];
                const linkUrl = linkMatch[2];
                const safe = isSafeUrl(linkUrl);

                return (
                    <a
                        key={index}
                        href={safe ? linkUrl : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-kleava-accent underline underline-offset-2 hover:opacity-80 transition-opacity break-words font-medium"
                    >
                        {linkText}
                    </a>
                );
            }

            // 2. Inline Code (`code`) -> JetBrains Mono
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={index}
                        className="typography-code-inline text-[13px] text-kleava-text-primary bg-kleava-surface-soft dark:bg-[#1E2A27] px-1.5 py-0.5 rounded-[4px] border border-kleava-border-subtle/40 font-code inline-block"
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }

            // 3. Bold (**bold**) -> Lora for English, Hind Siliguri for Bengali
            if (part.startsWith('**') && part.endsWith('**')) {
                const inner = part.slice(2, -2);
                const isEnglishOnly = /^[a-zA-Z0-9\s.,!?:;'"-_()]+$/.test(inner);

                return (
                    <strong
                        key={index}
                        className={cn(
                            'text-kleava-text-primary font-semibold',
                            isEnglishOnly ? 'font-editorial font-bold' : 'font-bangla font-semibold'
                        )}
                    >
                        {inner}
                    </strong>
                );
            }

            // 4. Italic (*italic*)
            if (part.startsWith('*') && part.endsWith('*')) {
                return (
                    <em key={index} className="italic text-kleava-text-primary font-editorial">
                        {part.slice(1, -1)}
                    </em>
                );
            }

            return part;
        });
    };

    return (
        <div className={cn('ai-response-prose w-full space-y-3 select-text font-bangla', className)}>
            {blocks.map((block, bIdx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // 1. Fenced Code Block Detection
                if (trimmed.startsWith('```')) {
                    const lines = trimmed.split('\n');
                    const firstLine = lines[0].replace(/^```/, '').trim();
                    const language = firstLine || 'code';

                    const lastLineIndex =
                        lines[lines.length - 1].startsWith('```') && lines.length > 1
                            ? lines.length - 1
                            : lines.length;
                    const codeLines = lines.slice(1, lastLineIndex);
                    const rawCode = codeLines.join('\n');

                    return <CodeBlock key={bIdx} code={rawCode} language={language} />;
                }

                // 2. Neutralized Divider (Replaced with clean whitespace, no line)
                if (trimmed === '---' || trimmed === '***') {
                    return <div key={bIdx} className="h-2" aria-hidden="true" />;
                }

                // 3. Blockquotes (> quote)
                if (trimmed.startsWith('> ')) {
                    const quoteText = trimmed.replace(/^>\s?/gm, '');
                    return (
                        <blockquote
                            key={bIdx}
                            className="my-2.5 pl-3.5 pr-2 py-1.5 border-l-2 border-kleava-accent/60 bg-kleava-surface-soft/40 dark:bg-[#1E2A27]/40 rounded-r-[4px] text-kleava-text-primary/95 text-sm italic font-editorial leading-relaxed"
                        >
                            {renderInlineFormatted(quoteText)}
                        </blockquote>
                    );
                }

                // 4. Headings Hierarchy (H1 - H4) -> Clean Geist font
                if (trimmed.startsWith('#### ')) {
                    return (
                        <h5 key={bIdx} className="typography-label font-semibold text-xs text-kleava-text-primary pt-1 font-ui">
                            {renderInlineFormatted(trimmed.slice(5))}
                        </h5>
                    );
                }
                if (trimmed.startsWith('### ')) {
                    return (
                        <h4 key={bIdx} className="typography-subheading font-medium text-sm text-kleava-text-primary pt-1.5 font-ui">
                            {renderInlineFormatted(trimmed.slice(4))}
                        </h4>
                    );
                }
                if (trimmed.startsWith('## ')) {
                    return (
                        <h3 key={bIdx} className="typography-heading font-semibold text-base text-kleava-text-primary pt-2 font-ui">
                            {renderInlineFormatted(trimmed.slice(3))}
                        </h3>
                    );
                }
                if (trimmed.startsWith('# ')) {
                    return (
                        <h2 key={bIdx} className="typography-display font-semibold text-lg text-kleava-text-primary pt-2.5 font-ui">
                            {renderInlineFormatted(trimmed.slice(2))}
                        </h2>
                    );
                }

                // 5. Unordered Lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const lines = trimmed.split('\n');
                    return (
                        <ul key={bIdx} className="list-disc pl-5 space-y-1.5 my-1.5 text-kleava-text-primary text-[15px] leading-[1.65]">
                            {lines.map((line, lIdx) => {
                                const isNested = /^(\s{2,}|\t)[-*+]\s/.test(line);
                                const cleanLine = line.replace(/^\s*[-*+]\s/, '');
                                return (
                                    <li key={lIdx} className={cn('leading-relaxed', isNested && 'ml-4 list-[circle]')}>
                                        {renderInlineFormatted(cleanLine)}
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }

                // 6. Ordered Lists
                if (/^\d+\.\s/.test(trimmed)) {
                    const lines = trimmed.split('\n');
                    return (
                        <ol key={bIdx} className="list-decimal pl-5 space-y-1.5 my-1.5 text-kleava-text-primary text-[15px] leading-[1.65]">
                            {lines.map((line, lIdx) => {
                                const isNested = /^(\s{2,}|\t)\d+\.\s/.test(line);
                                const cleanLine = line.replace(/^\s*\d+\.\s/, '');
                                return (
                                    <li key={lIdx} className={cn('leading-relaxed', isNested && 'ml-4 list-[lower-alpha]')}>
                                        {renderInlineFormatted(cleanLine)}
                                    </li>
                                );
                            })}
                        </ol>
                    );
                }

                // 7. Standard Paragraph
                return (
                    <p key={bIdx} className="text-[15px] leading-[1.65] tracking-[0.3px] text-kleava-text-primary break-words">
                        {renderInlineFormatted(trimmed)}
                    </p>
                );
            })}
        </div>
    );
}

export default MarkdownContent;