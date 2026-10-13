/**
 * Universal Translation Service
 * Auto-detects source language from user input and translates to selected target language.
 */

export interface TargetLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const TARGET_LANGUAGES: TargetLanguage[] = [
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

const GOOGLE_API_KEY = 'AIzaSyCs9Fp4gp8oOnyFkogXUBtM8tyMSOYDvsk';

/**
 * Translates input text into the target language.
 * Source language is automatically detected by the engine.
 */
export async function translateContent(text: string, targetLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: trimmed,
          target: targetLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    if (data?.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText;
    }
  } catch (error) {
    console.warn('Google Translation API failed:', error);
  }

  // Fallback: return original if translation fails
  return trimmed;
}
