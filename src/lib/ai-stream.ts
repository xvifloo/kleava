/**
 * KLEAVA AI — STREAMING ADAPTER
 * Generates clean, divider-less typographic streams matching prompt language.
 */

export interface StreamCallbacks {
    onChunk: (accumulatedText: string, chunk: string) => void;
    onComplete: (fullText: string) => void;
    onError: (error: Error) => void;
}

export interface StreamController {
    cancel: () => void;
}

type PromptLanguage = 'en' | 'bn' | 'mixed';

function detectPromptLanguage(prompt: string): PromptLanguage {
    const lower = prompt.toLowerCase();

    if (lower.includes('answer in english') || lower.includes('in english') || lower.includes('ইংরেজি')) {
        return 'en';
    }
    if (lower.includes('বাংলায় উত্তর') || lower.includes('বাংলায় বলো') || lower.includes('in bengali') || lower.includes('in bangla')) {
        return 'bn';
    }

    const bengaliCharCount = (prompt.match(/[\u0980-\u09FF]/g) || []).length;
    const latinCharCount = (prompt.match(/[a-zA-Z]/g) || []).length;

    if (bengaliCharCount > 0 && latinCharCount > 0) return 'mixed';
    if (bengaliCharCount > 0) return 'bn';
    return 'en';
}

export function startAiStream(
    prompt: string,
    modelName: string,
    callbacks: StreamCallbacks
): StreamController {
    let isCancelled = false;
    let intervalId: NodeJS.Timeout | null = null;

    const lang = detectPromptLanguage(prompt);
    let fullResponse = '';

    if (lang === 'en') {
        fullResponse =
            `# System Architecture\n\n` +
            `Here is the structured solution for **${prompt}**.\n\n` +
            `> Kleava AI delivers a clean, document-grade reading experience with multi-model workflow execution.\n\n` +
            `## Key Principles\n` +
            `- **State Management**: Reactive and isolated context boundaries\n` +
            `- **Clean Architecture**: Decoupled presentation and data layers\n` +
            `- **Typographic Coherence**: Balanced English and Bengali typesetting\n\n` +
            `\`\`\`typescript\nimport { createWorkspace } from "@kleava/core";\n\nexport async function runTask() {\n  return createWorkspace({\n    mode: "autonomous",\n    telemetry: false,\n  });\n}\n\`\`\`\n\n` +
            `Let me know if you would like to explore any specific component further.`;
    } else if (lang === 'bn') {
        fullResponse =
            `# সিস্টেম আর্কিটেকচার\n\n` +
            `আপনার **${prompt}** সম্পর্কিত পূর্ণাঙ্গ আলোচনা এবং কাঠামো নিচে উপস্থাপন করা হলো।\n\n` +
            `> Kleava AI হলো একটি শান্ত ও দ্রুতগতির মাল্টি-মডেল ওয়ার্কস্পেস ইঞ্জিন।\n\n` +
            `## মূল উপাদানসমূহ\n` +
            `- **স্টেট ম্যানেজমেন্ট**: রিঅ্যাক্টিভ ও আইসোলেটেড স্টেট বাউন্ডারি\n` +
            `- **ক্লিন আর্কিটেকচার**: আলাদা প্রেজেন্টেশন ও ডেটা সার্ভিস\n` +
            `- **টাইপোগ্রাফিক ভারসাম্য**: স্বাচ্ছন্দ্যময় রিডিং অভিজ্ঞতা\n\n` +
            `\`\`\`typescript\nimport { createWorkspace } from "@kleava/core";\n\nexport async function runTask() {\n  return createWorkspace({\n    mode: "autonomous",\n    telemetry: false,\n  });\n}\n\`\`\`\n\n` +
            `অন্য কোনো বিষয়ে বিস্তারিত জানার থাকলে জানাতে পারেন।`;
    } else {
        fullResponse =
            `# সেশন ওভারভিউ\n\n` +
            `আপনার প্রম্পট **"${prompt}"** অনুযায়ী সিস্টেম আর্কিটেকচার এবং কোড নিচে তৈরি করা হলো।\n\n` +
            `> Kleava AI হলো একটি ফোকাসড এবং দ্রুত রেসপন্সশীল multi-model workspace ইঞ্জিন।\n\n` +
            `## মূল মডিউলসমূহ (Core Architecture)\n` +
            `- **Model Dispatcher**: অপ্টিমাইজড প্রসেসিং রুট\n` +
            `- **Typographic Coherence**: বাংলা এবং ইংরেজির ব্যালেন্সড রিডিং অভিজ্ঞতা\n` +
            `- **Context Protection**: প্রতিটি চ্যাট সেশনের মেমোরি আইসোলেশন\n\n` +
            `\`\`\`typescript\nimport { KleavaEngine } from "@kleava/core";\n\nexport const session = new KleavaEngine({\n  stream: true,\n});\n\`\`\`\n\n` +
            `আপনি চাইলে আরও বিস্তারিত জানতে পারেন।`;
    }

    let currentLength = 0;

    intervalId = setInterval(() => {
        if (isCancelled) {
            if (intervalId) clearInterval(intervalId);
            return;
        }

        const step = Math.floor(Math.random() * 14) + 8;
        currentLength += step;

        if (currentLength >= fullResponse.length) {
            if (intervalId) clearInterval(intervalId);
            callbacks.onChunk(fullResponse, fullResponse.slice(currentLength - step));
            callbacks.onComplete(fullResponse);
        } else {
            const currentText = fullResponse.slice(0, currentLength);
            callbacks.onChunk(currentText, fullResponse.slice(currentLength - step, currentLength));
        }
    }, 30);

    return {
        cancel: () => {
            isCancelled = true;
            if (intervalId) clearInterval(intervalId);
        },
    };
}