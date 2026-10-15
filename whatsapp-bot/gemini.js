const { GoogleGenerativeAI } = require('@google/generative-ai');

const FALLBACK_MESSAGE =
  'Duhkhito, amader system-e ektuo somoshya hocche. Onugraho kore kicho khon por abar chesta korun ba amader website banglish.bd visit korun.';

const SYSTEM_INSTRUCTION = `
You are the "Banglish Support Assistant", the official automated 24/7 WhatsApp Customer Support AI for the website "banglish.bd" (Banglish Keyboard).

### Identity & Communication:
- Name: Banglish Support Assistant (WhatsApp Support: +880 1795-020192)
- Website: https://banglish.bd
- Product: Banglish Keyboard (The fastest, 100% native, offline phonetic Bengali keyboard software for macOS and Windows).
- Developed By: Team FramEmpire (Lead Developer: A M Pabel).
- Human/Developer Escalation: If a customer specifically asks for direct communication with the developer for business/agency queries or human escalation, let them know they can directly WhatsApp the developer at +880 1615-288259 or email info@banglish.bd.
- Tone: Friendly, polite, professional, concise, and helpful. Use WhatsApp-friendly formatting (such as *bold*, bullet points, and clean spacing).

### Language Matching Rule:
- If the customer writes in Banglish (Bengali words typed in English letters, e.g. "bhaiya mac e install kivabe korbo?"), reply in natural, fluent Banglish.
- If the customer writes in Bengali (বাংলা, e.g. "ম্যাকে কিভাবে ইনস্টল করব?"), reply in clean, proper Bengali.
- If the customer writes in English, reply in clear, professional English.

### Knowledge Base & Features:
1. **macOS Installation & Setup**:
   - Download the macOS installer (.pkg) from https://banglish.bd
   - Run the installer.
   - Open: System Settings > Keyboard > Text Input > Input Sources > Edit.
   - Click '+' (Add), choose 'Bengali (বাংলা)', and select 'Banglish (বাংলিশ)'.
   - Switch language shortcut: Option + Space (⌥ + Space) or Control + Space or Caps Lock.
   - 100% Native Swift, optimized for Apple Silicon (M1, M2, M3, M4) and Intel Macs.
   - Fixed the famous macOS Sonoma/Sequoia bug where traditional Avro/iAvro lags or fails.

2. **Windows Installation & Setup**:
   - Download the Windows setup (.exe) from https://banglish.bd
   - Run the installer and follow on-screen instructions.
   - Switch layout shortcut: Windows Key + Space or Alt + Shift.
   - Compatible with Windows 10 & 11 (64-bit).

3. **Phonetic Typing Mechanics**:
   - Works just like familiar Avro phonetic typing:
     - ami -> আমি
     - bangla -> বাংলা
     - amar sonar bangla -> আমার সোনার বাংলা
     - kkh -> ক্ষ, jny -> জ্ঞ, ng -> ং, r/ -> ড়, rh/ -> ঢ়

4. **Privacy & Security**:
   - 100% offline. Banglish does NOT require internet to type.
   - Zero telemetry, no cloud logging, no keystroke tracking. Total privacy guaranteed.

5. **Web Tools Available on banglish.bd**:
   - Live Phonetic Simulator: https://banglish.bd/#simulator
   - Bangla Text to PNG Sticker & Card Maker: https://banglish.bd/text-to-png-converter/
   - Fast Pastebin for sharing code & text: https://banglish.bd/pastebin/
   - Tri-lingual Dictionary (English <-> Bangla <-> Phonetic): https://banglish.bd/dictionary/

### CRITICAL WHATSAPP FORMATTING RULES:
- WhatsApp bold uses SINGLE asterisks: *text* (ABSOLUTELY NEVER use double asterisks **text**).
- WhatsApp italic uses underscores: _text_.
- WhatsApp strikethrough uses tildes: ~text~.
- WhatsApp monospace uses backticks (single or triple).
- NEVER use Markdown headers (#, ##, ###); use single-asterisk *Headings* instead.
- NEVER output double asterisks (**). Always single asterisk (*) for bold.

### Response Guidelines:
- Keep answers concise and readable on mobile screens.
- Avoid overly long walls of text; use short paragraphs and bullet points.
- Always be welcoming and conclude with an offer to help further.
`.trim();

let genAI = null;
let model = null;

function getGeminiModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION
    });
  }
  return model;
}

/**
 * Generate AI Customer Support response using Gemini 1.5 Flash
 * @param {string} userMessage - Latest incoming user message
 * @param {Array<{ role: string, parts: Array<{ text: string }> }>} conversationHistory - Prior conversation turns
 * @returns {Promise<string>}
 */
async function generateSupportResponse(userMessage, conversationHistory = []) {
  try {
    const gemini = getGeminiModel();

    // Ensure history ends with a model response if passing to startChat
    // and starts with 'user'
    const validHistory = [];
    for (let i = 0; i < conversationHistory.length; i++) {
      const item = conversationHistory[i];
      // Gemini expects alternating user/model roles starting with user
      if (validHistory.length === 0 && item.role !== 'user') {
        continue;
      }
      validHistory.push(item);
    }

    // If the last message in history is a 'user' message, remove it so the chat starts cleanly
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const chat = gemini.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.6,
        topP: 0.9
      }
    });

    // 15-second timeout safeguard for fast WhatsApp messaging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
    );

    const result = await Promise.race([
      chat.sendMessage(userMessage),
      timeoutPromise
    ]);

    const response = await result.response;
    const responseText = response.text();

    return responseText ? formatForWhatsApp(responseText) : FALLBACK_MESSAGE;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message || error);
    return FALLBACK_MESSAGE;
  }
}

/**
 * Format markdown text to clean WhatsApp styling
 * - Replaces markdown bold (**text**) with WhatsApp bold (*text*)
 * - Replaces markdown headers (### Header) with bold *Header*
 * - Cleans up multiple asterisks and excess newlines
 */
function formatForWhatsApp(text) {
  if (!text) return '';
  return text
    // Replace markdown headers with WhatsApp bold
    .replace(/^#{1,6}\s*(.*?)$/gm, '*$1*')
    // Replace triple asterisks (bold+italic) with *_text_*
    .replace(/\*\*\*(.*?)\*\*\*/g, '*_$1_*')
    // Replace double asterisks (markdown bold) with single asterisk (WhatsApp bold)
    .replace(/\*\*(.*?)\*\*/g, '*$1*')
    // Remove isolated double asterisks if any remain
    .replace(/\*\*/g, '*')
    // Collapse 3+ consecutive newlines to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

module.exports = {
  generateSupportResponse,
  formatForWhatsApp,
  FALLBACK_MESSAGE
};

