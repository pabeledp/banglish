using System;
using System.Collections.Generic;

namespace Banglish.Core
{
    public struct ArabicRule
    {
        public string Latin { get; }
        public string Arabic { get; }

        public ArabicRule(string latin, string arabic)
        {
            Latin = latin;
            Arabic = arabic;
        }
    }

    /// <summary>
    /// Master Latin-to-Arabic Phonetic Data Specification for Windows.
    /// Completely letter-based with shift states (no Arabizi digits),
    /// supporting Harakat (Tashkeel), Quranic Maddah, Waqf marks, Islamic honorifics,
    /// Arabic punctuation, and Arabic-Indic numerals.
    /// </summary>
    public static class ArabicData
    {
        public const string LamAlif = "\u0644\u0627"; // لا

        public static readonly List<ArabicRule> Rules = new List<ArabicRule>
        {
            // 1. Honorific Ligatures & Quranic Symbols (Highest Priority)
            new ArabicRule("@ayah",  "\u06DD"), // End of Ayah (۝)
            new ArabicRule("@riyal", "\uFDFC"), // Rial currency sign (﷼)
            new ArabicRule("@saw",   "\uFDFA"), // Sallallahu Alayhi Wasallam (ﷺ)
            new ArabicRule("@bis",   "\uFDFD"), // Bismillahir Rahmanir Raheem (﷽)
            new ArabicRule("@jj",    "\uFDFB"), // Jalla Jalaluhu (ﷻ)
            new ArabicRule("@sl",    "\u06D6"), // Al-Waslu Awla (ۖ)
            new ArabicRule("@ql",    "\u06D7"), // Al-Waqfu Awla (ۗ)
            new ArabicRule("@la",    "\u06D9"), // Waqf Mamnoo (ۙ)
            new ArabicRule("@sj",    "\u06E9"), // Sajdah (۩)
            new ArabicRule("@m",     "\u06D8"), // Waqf Lazim (ۘ)
            new ArabicRule("@j",     "\u06DA"), // Waqf Jaiz (ۚ)
            new ArabicRule("@3",     "\u06DB"), // Mu'anaqah (ۛ)
            new ArabicRule("@s",     "\u06DC"), // Saktah (ۜ)
            new ArabicRule("@r",     "\u06DE"), // Rub El Hizb (۞)

            // 2. Quranic Maddah & Elongations
            new ArabicRule("~m",     "\u06E4"), // Quranic Maddah (3-4 Alif) (ۤ)
            new ArabicRule("~",      "\u0653"), // Maddah Above (ٓ)
            new ArabicRule("^a",     "\u0670"), // Dagger Alif (Khada Zobor) (ٰ)
            new ArabicRule("^i",     "\u0656"), // Subscript Alif (Khada Zer) (ٖ)
            new ArabicRule("^u",     "\u0657"), // Inverted Damma (Ulta Pesh) (ٗ)

            // 3. Harakat (Tashkeel) - Backtick prefix
            new ArabicRule("`an",    "\u064B"), // Tanwin Fath (ً)
            new ArabicRule("`in",    "\u064D"), // Tanwin Kasr (ٍ)
            new ArabicRule("`un",    "\u064C"), // Tanwin Damm (ٌ)
            new ArabicRule("`a",     "\u064E"), // Fatha (َ)
            new ArabicRule("`i",     "\u0650"), // Kasra (ِ)
            new ArabicRule("`u",     "\u064F"), // Damma (ُ)
            new ArabicRule("`o",     "\u0652"), // Sukun (ْ)
            new ArabicRule("`s",     "\u0651"), // Shaddah (ّ)

            // 4. Punctuation
            new ArabicRule("<<",     "\u00AB"), // Left angle quote («)
            new ArabicRule(">>",     "\u00BB"), // Right angle quote (»)
            new ArabicRule("?",      "\u061F"), // Arabic question mark (؟)
            new ArabicRule(",",      "\u060C"), // Arabic comma (،)
            new ArabicRule(";",      "\u061B"), // Arabic semicolon (؛)

            // 4b. Arabic-Indic Numerals
            new ArabicRule("0",      "\u0660"), // ٠
            new ArabicRule("1",      "\u0661"), // ١
            new ArabicRule("2",      "\u0662"), // ٢
            new ArabicRule("3",      "\u0663"), // ٣
            new ArabicRule("4",      "\u0664"), // ٤
            new ArabicRule("5",      "\u0665"), // ٥
            new ArabicRule("6",      "\u0666"), // ٦
            new ArabicRule("7",      "\u0667"), // ٧
            new ArabicRule("8",      "\u0668"), // ٨
            new ArabicRule("9",      "\u0669"), // ٩

            // 5. Two-Character Compounds (Case-Insensitive variants supported)
            new ArabicRule("Th",     "\u0629"), // Ta Marbuta (ة)
            new ArabicRule("TH",     "\u062B"), // Tha (ث)
            new ArabicRule("th",     "\u062B"), // Tha (ث)
            new ArabicRule("kh",     "\u062E"), // Kha (خ)
            new ArabicRule("Kh",     "\u062E"), // Kha (خ)
            new ArabicRule("KH",     "\u062E"), // Kha (خ)
            new ArabicRule("sh",     "\u0634"), // Sheen (ش)
            new ArabicRule("Sh",     "\u0634"), // Sheen (ش)
            new ArabicRule("SH",     "\u0634"), // Sheen (ش)
            new ArabicRule("gh",     "\u063A"), // Ghayn (غ)
            new ArabicRule("Gh",     "\u063A"), // Ghayn (غ)
            new ArabicRule("GH",     "\u063A"), // Ghayn (غ)
            new ArabicRule("la",     LamAlif),  // Lam-Alif (لا)
            new ArabicRule("lA",     LamAlif),  // Lam-Alif (لا)
            new ArabicRule("La",     LamAlif),  // Lam-Alif (لا)
            new ArabicRule("LA",     LamAlif),  // Lam-Alif (لا)
            new ArabicRule("aa",     "\u0627"), // Long Alif (ا)
            new ArabicRule("AA",     "\u0627"),
            new ArabicRule("Aa",     "\u0627"),
            new ArabicRule("ee",     "\u064A"), // Long Ya (ي)
            new ArabicRule("EE",     "\u064A"),
            new ArabicRule("Ee",     "\u064A"),
            new ArabicRule("oo",     "\u0648"), // Long Waw (و)
            new ArabicRule("OO",     "\u0648"),
            new ArabicRule("Oo",     "\u0648"),
            new ArabicRule("ou",     "\u0648"), // Waw (و)
            new ArabicRule("OU",     "\u0648"),
            new ArabicRule("Ou",     "\u0648"),

            // 6. Single Uppercase Letters (Shift Key) - Heavy & Pharyngeal Sounds
            new ArabicRule("Z",      "\u0638"), // Dhaa / Zha (ظ)
            new ArabicRule("G",      "\u063A"), // Ghayn (غ)
            new ArabicRule("H",      "\u062D"), // Pharyngeal Ha (ح)
            new ArabicRule("S",      "\u0635"), // Saad (ص)
            new ArabicRule("D",      "\u0636"), // Daad (ض)
            new ArabicRule("T",      "\u0637"), // Taa Heavy (ط)
            new ArabicRule("E",      "\u0639"), // Ayn (ع)
            new ArabicRule("A",      "\u0627"), // Explicit Alif (ا)
            new ArabicRule("Y",      "\u0649"), // Alif Maqsura (ى)
            new ArabicRule("K",      "\u062E"), // Kha alternative (خ)

            // 7. Single Lowercase Letters & Shift-Fallbacks for neutral consonants/vowels
            new ArabicRule("z",      "\u0630"), // Dhal (ذ)
            new ArabicRule("g",      "\u062C"), // Jeem (ج)
            new ArabicRule("h",      "\u0647"), // Soft Ha (ه)
            new ArabicRule("s",      "\u0633"), // Seen (س)
            new ArabicRule("d",      "\u062F"), // Dal (د)
            new ArabicRule("t",      "\u062A"), // Soft Ta (ت)
            new ArabicRule("b",      "\u0628"), // Ba (ب)
            new ArabicRule("B",      "\u0628"), // Ba (Shift fallback)
            new ArabicRule("p",      "\u0628"), // Ba fallback (ب)
            new ArabicRule("P",      "\u0628"), // Ba fallback (Shift)
            new ArabicRule("r",      "\u0631"), // Ra (ر)
            new ArabicRule("R",      "\u0631"), // Ra (Shift fallback)
            new ArabicRule("f",      "\u0641"), // Fa (ف)
            new ArabicRule("F",      "\u0641"), // Fa (Shift fallback)
            new ArabicRule("v",      "\u0641"), // Fa fallback (ف)
            new ArabicRule("V",      "\u0641"), // Fa fallback (Shift)
            new ArabicRule("q",      "\u0642"), // Qaaf (ق)
            new ArabicRule("Q",      "\u0642"), // Qaaf (Shift fallback)
            new ArabicRule("k",      "\u0643"), // Kaaf (ك)
            new ArabicRule("l",      "\u0644"), // Lam (ل)
            new ArabicRule("L",      "\u0644"), // Lam (Shift fallback)
            new ArabicRule("m",      "\u0645"), // Meem (م)
            new ArabicRule("M",      "\u0645"), // Meem (Shift fallback)
            new ArabicRule("n",      "\u0646"), // Noon (ن)
            new ArabicRule("N",      "\u0646"), // Noon (Shift fallback)
            new ArabicRule("w",      "\u0648"), // Waw (و)
            new ArabicRule("W",      "\u0648"), // Waw (Shift fallback)
            new ArabicRule("y",      "\u064A"), // Ya (ي)
            new ArabicRule("j",      "\u062C"), // Jeem fallback (ج)
            new ArabicRule("J",      "\u062C"), // Jeem fallback (Shift)
            new ArabicRule("c",      "\u0643"), // Kaaf (ك)
            new ArabicRule("C",      "\u0643"), // Kaaf (Shift)
            new ArabicRule("x",      "\u062E"), // Kha (خ)
            new ArabicRule("X",      "\u062E"), // Kha (Shift)
            new ArabicRule("a",      "\u0627"), // Alif (ا)
            new ArabicRule("i",      "\u064A"), // Ya (ي)
            new ArabicRule("I",      "\u064A"), // Ya (Shift)
            new ArabicRule("u",      "\u0648"), // Waw (و)
            new ArabicRule("U",      "\u0648"), // Waw (Shift)
            new ArabicRule("e",      "\u064A"), // Ya fallback (ي)
            new ArabicRule("o",      "\u0648"), // Waw fallback (و)
            new ArabicRule("O",      "\u0648")  // Waw fallback (Shift)
        };
    }
}
