import { PersonalizationSettings } from '@/types';

/**
 * Compiles a provider-agnostic, structured personalization directive envelope
 * to guide the AI's conversational style, tone, and formatting constraints.
 */
export function compilePersonalizationEnvelope(
    settings: PersonalizationSettings
): string {
    const directives: string[] = [];

    // 1. Response Style
    switch (settings.responseStyle) {
        case 'concise':
            directives.push('Style: Deliver direct, compact, and to-the-point responses.');
            break;
        case 'detailed':
            directives.push('Style: Provide thorough, comprehensive, and illustrative explanations.');
            break;
        case 'technical':
            directives.push('Style: Focus heavily on technical precision, architecture, and code mechanics.');
            break;
        case 'balanced':
        default:
            directives.push('Style: Maintain a clear, balanced, and naturally paced explanation.');
            break;
    }

    // 2. Tone Directive
    switch (settings.tone) {
        case 'friendly':
            directives.push('Tone: Warm, encouraging, and approachable.');
            break;
        case 'professional':
            directives.push('Tone: Formal, objective, and executive-grade.');
            break;
        case 'direct':
            directives.push('Tone: Concise, direct, and focused strictly on results without preamble.');
            break;
        case 'casual':
            directives.push('Tone: Conversational, relaxed, and natural.');
            break;
        case 'neutral':
        default:
            directives.push('Tone: Calm, clear, and neutral.');
            break;
    }

    // 3. Response Language Directive
    if (settings.responseLanguage === 'bn') {
        directives.push('Language: Primary language must be fluent Bengali (বাংলা) with standard English technical terms.');
    } else if (settings.responseLanguage === 'en') {
        directives.push('Language: Primary language must be English.');
    } else {
        directives.push('Language: Match the natural language of the user prompt (supports mixed Bengali and English).');
    }

    // 4. Formatting Style
    if (settings.formattingStyle === 'structured') {
        directives.push('Formatting: Use clear headings, bullet points, and code blocks where helpful.');
    } else if (settings.formattingStyle === 'minimal') {
        directives.push('Formatting: Keep formatting minimal; avoid unnecessary lists or decorative headers.');
    }

    // 5. Technical Depth
    if (settings.technicalDepth === 'advanced') {
        directives.push('Technical Depth: Include advanced architecture, type safety, and edge-case handling.');
    } else if (settings.technicalDepth === 'simple') {
        directives.push('Technical Depth: Explain concepts in accessible, non-technical terms with minimal jargon.');
    }

    // 6. Emoji Usage
    if (settings.emojiUsage === 'off') {
        directives.push('Emojis: Do not use emojis in responses.');
    } else if (settings.emojiUsage === 'minimal') {
        directives.push('Emojis: Use emojis sparingly only when directly relevant.');
    }

    // 7. Proactivity
    if (settings.proactiveBehavior === 'proactive') {
        directives.push('Proactivity: Anticipate next steps, suggest best practices, and highlight potential risks.');
    }

    if (directives.length === 0) return '';

    return `\n--- Conversational Directives & Style Preferences ---\n${directives.join('\n')}\n----------------------------------------------------\n`;
}