import Foundation

/// Clean, Deterministic Latin-to-Arabic Letter-Only Specification
public struct ArabicData {
    public static let rules: [(latin: String, arabic: String)] = [
        // Harakat & Modifiers
        ("`an", "\u{064B}"), // Tanwin Fath (ً)
        ("`in", "\u{064D}"), // Tanwin Kasr (ٍ)
        ("`un", "\u{064C}"), // Tanwin Damm (ٌ)
        ("`a",  "\u{064E}"), // Fatha (َ)
        ("`i",  "\u{0650}"), // Kasra (ِ)
        ("`u",  "\u{064F}"), // Damma (ُ)
        ("`o",  "\u{0652}"), // Sukun (ْ)
        ("`s",  "\u{0651}"), // Shaddah (ّ)

        // Punctuation
        ("?", "\u{061F}"), // Arabic Question Mark (؟)
        (",", "\u{060C}"), // Arabic Comma (،)
        (";", "\u{061B}"), // Arabic Semicolon (؛)

        // Two-character compounds (High Priority)
        ("Th", "\u{0629}"), // Ta Marbuta (ة)
        ("kh", "\u{062E}"), // Kha (خ)
        ("sh", "\u{0634}"), // Sheen (ش)
        ("gh", "\u{063A}"), // Ghayn (غ)
        ("th", "\u{062B}"), // Tha (ث)
        ("la", "\u{0644}\u{0627}"), // Lam-Alif Ligature (لا)
        ("lA", "\u{0644}\u{0627}"), // Lam-Alif Ligature (لا)
        ("aa", "\u{0627}"), // Long Alif (ا)
        ("ee", "\u{064A}"), // Long Ya (ي)
        ("oo", "\u{0648}"), // Long Waw (و)
        ("ou", "\u{0648}"), // Waw (و)

        // Single Uppercase (Shifted) Letters
        ("Z", "\u{0638}"), // Dhaa / Zha Heavy (ظ)
        ("G", "\u{063A}"), // Ghayn (غ)
        ("H", "\u{062D}"), // Pharyngeal Ha (ح)
        ("S", "\u{0635}"), // Saad (ص)
        ("D", "\u{0636}"), // Daad (ض)
        ("T", "\u{0637}"), // Taa Heavy (ط)
        ("E", "\u{0639}"), // Ayn (ع)
        ("A", "\u{0627}"), // Explicit Alif (ا)
        ("Y", "\u{0649}"), // Alif Maqsura (ى)
        ("K", "\u{062E}"), // Kha alternative (خ)

        // Single Lowercase Letters
        ("z", "\u{0630}"), // Dhal (ذ)
        ("g", "\u{062C}"), // Jeem (ج)
        ("h", "\u{0647}"), // Soft Ha (ه)
        ("s", "\u{0633}"), // Seen (س)
        ("d", "\u{062F}"), // Dal (د)
        ("t", "\u{062A}"), // Soft Ta (ت)
        ("b", "\u{0628}"), // Ba (ب)
        ("p", "\u{0628}"), // Ba fallback (ب)
        ("r", "\u{0631}"), // Ra (ر)
        ("f", "\u{0641}"), // Fa (ف)
        ("v", "\u{0641}"), // Fa fallback (ف)
        ("q", "\u{0642}"), // Qaaf (ق)
        ("k", "\u{0643}"), // Kaaf (ك)
        ("l", "\u{0644}"), // Lam (ل)
        ("m", "\u{0645}"), // Meem (م)
        ("n", "\u{0646}"), // Noon (ن)
        ("w", "\u{0648}"), // Waw (و)
        ("y", "\u{064A}"), // Ya (ي)
        ("j", "\u{062C}"), // Jeem fallback (ج)
        ("a", "\u{0627}"), // Initial Alif (ا)
        ("i", "\u{064A}"), // Ya (ي)
        ("u", "\u{0648}"), // Waw (و)
        ("e", "\u{064A}"), // Ya fallback (ي)
        ("o", "\u{0648}")  // Waw fallback (و)
    ]
}
