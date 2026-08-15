/**
 * KLEAVA AI — STREAMING ADAPTER & SIMULATOR
 * Clean, decoupled streaming controller interface ready to be mapped
 * to real AI providers (OpenAI, Anthropic, Custom SSE) in upcoming phases.
 */

export interface StreamCallbacks {
    onChunk: (accumulatedText: string, chunk: string) => void;
    onComplete: (fullText: string) => void;
    onError: (error: Error) => void;
}

export interface StreamController {
    cancel: () => void;
}

/**
 * Generates structured, realistic response streams with Markdown & Code formatting.
 */
export function startAiStream(
    prompt: string,
    modelName: string,
    callbacks: StreamCallbacks
): StreamController {
    let isCancelled = false;
    let intervalId: NodeJS.Timeout | null = null;

    const fullResponse =
        `# Kleava AI — ${modelName} সেশন ওভারভিউ\n\n` +
        `আপনার দেওয়া প্রম্পট **"${prompt}"** অনুযায়ী সিস্টেম আর্কিটেকচার এবং কোড নিচে তৈরি করা হলো।\n\n` +
        `> Kleava AI হলো একটি শান্ত, ফোকাসড এবং দ্রুত রেসপন্সশীল মাল্টি-মডেল ওয়ার্কস্পেস ইঞ্জিন।\n\n` +
        `## ১. মূল মডিউলসমূহ (Core Architecture)\n` +
        `- **Model Dispatcher**: \`${modelName}\` অপ্টিমাইজড প্রসেসিং রুট\n` +
        `- **Typographic Coherence**: বাংলা এবং ইংরেজির ব্যালেন্সড রিডিং অভিজ্ঞতা\n` +
        `- **Context Protection**: প্রতিটি চ্যাট সেশনের মেমোরি আইসোলেশন\n\n` +
        `\`\`\`typescript\nimport { KleavaEngine } from "@kleava/core";\n\n// Initialize multi-model session configuration\nexport const session = new KleavaEngine({\n  model: "${modelName.toLowerCase().replace(/\s+/g, '-')}",\n  stream: true,\n  reasoning: "balanced",\n});\n\nexport async function executePrompt(input: string) {\n  const stream = await session.generate(input);\n  console.log("Token stream established for:", input);\n  return stream;\n}\n\`\`\`\n\n` +
        `---\n\n` +
        `### ২. পরবর্তী পদক্ষেপ\n` +
        `আপনি চাইলে কোড ব্লকটি টেনে বড় করতে পারেন, কিংবা [Kleava Documentation](https://kleava.ai/docs)-এ বিস্তারিত দেখতে পারেন।`;

    let currentLength = 0;

    intervalId = setInterval(() => {
        if (isCancelled) {
            if (intervalId) clearInterval(intervalId);
            return;
        }

        // Dynamic token chunking
        const step = Math.floor(Math.random() * 12) + 6;
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