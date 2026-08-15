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
 * MarkdownContent: Document-grade rich text formatter for Kleava AI.
 * Renders paragraphs, headings (H1-H4), ordered/unordered/nested lists,
 * blockquotes, links, inline code, and dedicated CodeBlock instances
 * with optimized mixed Bangla (Hind Siliguri) + English (Geist/Lora) baseline coherence.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
    // Normalize double line breaks for paragraph/block separation
    const blocks = content.split('\n\n');

    const renderInlineFormatted = (text: string) => {
        // Parse links [title](url), inline code (`code`), bold (**bold**), and italic (*italic*)
        const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

        return parts.map((part, index) => {
            // 1. Markdown Links [Text](URL)
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
                        className="text-kleava-accent underline underline-offset-2 hover:opacity-80 transition-opacity break-words font-medium font-ui"
                    >
                        {linkText}
                    </a>
                );
            }

            // 2. Inline Code (`code`)
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={index}
                        className="typography-code-inline text-[13px] text-kleava-text-primary bg-kleava-surface-soft px-1.5 py-0.5 rounded-[4px] border border-kleava-border-subtle/50 font-code inline-block"
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }

            // 3. Bold (**bold**)
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-semibold text-kleava-text-primary font-ui">
                        {part.slice(2, -2)}
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
        <div className={cn('ai-response-prose w-full space-y-3.5 select-text font-bangla', className)}>
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

                // 2. Horizontal Divider (--- or ***)
                if (trimmed === '---' || trimmed === '***') {
                    return <hr key={bIdx} className="my-4 border-t border-kleava-border-subtle/60" />;
                }

                // 3. Blockquotes (> quote)
                if (trimmed.startsWith('> ')) {
                    const quoteText = trimmed.replace(/^>\s?/gm, '');
                    return (
                        <blockquote
                            key={bIdx}
                            className="my-2.5 pl-3.5 pr-2 py-1.5 border-l-2 border-kleava-accent/60 bg-kleava-surface-soft/40 rounded-r-[4px] text-kleava-text-primary/95 text-sm italic font-editorial leading-relaxed"
                        >
                            {renderInlineFormatted(quoteText)}
                        </blockquote>
                    );
                }

                // 4. Headings Hierarchy (H1 - H4)
                if (trimmed.startsWith('#### ')) {
                    return (
                        <h5 key={bIdx} className="typography-label font-semibold text-xs text-kleava-text-primary pt-0.5 font-ui">
                            {renderInlineFormatted(trimmed.slice(5))}
                        </h5>
                    );
                }
                if (trimmed.startsWith('### ')) {
                    return (
                        <h4 key={bIdx} className="typography-subheading font-medium text-sm text-kleava-text-primary pt-1 font-ui">
                            {renderInlineFormatted(trimmed.slice(4))}
                        </h4>
                    );
                }
                if (trimmed.startsWith('## ')) {
                    return (
                        <h3 key={bIdx} className="typography-heading font-semibold text-base text-kleava-text-primary pt-1.5 font-ui">
                            {renderInlineFormatted(trimmed.slice(3))}
                        </h3>
                    );
                }
                if (trimmed.startsWith('# ')) {
                    return (
                        <h2 key={bIdx} className="typography-display font-semibold text-lg text-kleava-text-primary pt-2 font-ui">
                            {renderInlineFormatted(trimmed.slice(2))}
                        </h2>
                    );
                }

                // 5. Unordered Lists (supports nested lines)
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const lines = trimmed.split('\n');
                    return (
                        <ul key={bIdx} className="list-disc pl-5 space-y-1.5 my-2 text-kleava-text-primary text-sm font-ui">
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

                // 6. Ordered Lists (supports nested lines)
                if (/^\d+\.\s/.test(trimmed)) {
                    const lines = trimmed.split('\n');
                    return (
                        <ol key={bIdx} className="list-decimal pl-5 space-y-1.5 my-2 text-kleava-text-primary text-sm font-ui">
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

                // 7. Standard Paragraph (15px base, 1.65 line-height, 0.3px letter spacing)
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