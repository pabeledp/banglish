import Foundation

/// Master Latin-to-Arabic Phonetic Data Specification
/// Includes: Letter-Only schema, Shift-key pharyngeal sounds, Shift-fallbacks for neutral letters,
/// Harakat (Tashkeel), Maddah, Waqf marks, Islamic honorifics, and Arabic punctuation.
public struct ArabicData {
    public static let rules: [(latin: String, arabic: String)] = [
        // 1. Honorific Ligatures & Quranic Symbols (Highest Priority)
        ("@ayah", "\u{06DD}"), // End of Ayah (۝)
        ("@riyal","\u{FDFC}"), // Rial currency sign (﷼)
        ("@saw",  "\u{FDFA}"), // Sallallahu Alayhi Wasallam (ﷺ)
        ("@bis",  "\u{FDFD}"), // Bismillahir Rahmanir Raheem (﷽)
        ("@jj",   "\u{FDFB}"), // Jalla Jalaluhu (ﷻ)
        ("@sl",   "\u{06D6}"), // Al-Waslu Awla (ۖ)
        ("@ql",   "\u{06D7}"), // Al-Waqfu Awla (ۗ)
        ("@la",   "\u{06D9}"), // Waqf Mamnoo (ۙ)
        ("@sj",   "\u{06E9}"), // Sajdah (۩)
        ("@m",    "\u{06D8}"), // Waqf Lazim (ۘ)
        ("@j",    "\u{06DA}"), // Waqf Jaiz (ۚ)
        ("@3",    "\u{06DB}"), // Mu'anaqah (ۛ)
        ("@s",    "\u{06DC}"), // Saktah (ۜ)
        ("@r",    "\u{06DE}"), // Rub El Hizb (۞)

        // 2. Quranic Maddah & Elongations
        ("~m",    "\u{06E4}"), // Quranic Maddah (3-4 Alif) (ۤ)
        ("~",     "\u{0653}"), // Maddah Above (ٓ)
        ("^a",    "\u{0670}"), // Dagger Alif (Khada Zobor) (ٰ)
        ("^i",    "\u{0656}"), // Subscript Alif (Khada Zer) (ٖ)
        ("^u",    "\u{0657}"), // Inverted Damma (Ulta Pesh) (ٗ)

        // 3. Harakat (Tashkeel)
        ("`an",   "\u{064B}"), // Tanwin Fath (ً)
        ("`in",   "\u{064D}"), // Tanwin Kasr (ٍ)
        ("`un",   "\u{064C}"), // Tanwin Damm (ٌ)
        ("`a",    "\u{064E}"), // Fatha (َ)
        ("`i",    "\u{0650}"), // Kasra (ِ)
        ("`u",    "\u{064F}"), // Damma (ُ)
        ("`o",    "\u{0652}"), // Sukun (ْ)
        ("`s",    "\u{0651}"), // Shaddah (ّ)

        // 4. Punctuation
        ("<<",    "\u{00AB}"), // Left angle quote («)
        (">>",    "\u{00BB}"), // Right angle quote (»)
        ("?",     "\u{061F}"), // Arabic question mark (؟)
        (",",     "\u{060C}"), // Arabic comma (،)
        (";",     "\u{061B}"), // Arabic semicolon (؛)

        // 5. Two-Character Compounds (Case-Insensitive variants supported)
        ("Th",    "\u{0629}"), // Ta Marbuta (ة)
        ("TH",    "\u{062B}"), // Tha (ث)
        ("th",    "\u{062B}"), // Tha (ث)
        ("kh",    "\u{062E}"), // Kha (خ)
        ("Kh",    "\u{062E}"), // Kha (خ)
        ("KH",    "\u{062E}"), // Kha (خ)
        ("sh",    "\u{0634}"), // Sheen (ش)
        ("Sh",    "\u{0634}"), // Sheen (ش)
        ("SH",    "\u{0634}"), // Sheen (ش)
        ("gh",    "\u{063A}"), // Ghayn (غ)
        ("Gh",    "\u{063A}"), // Ghayn (غ)
        ("GH",    "\u{063A}"), // Ghayn (غ)
        ("la",    "\u{0644}\u{0627}"), // Lam-Alif (لا)
        ("lA",    "\u{0644}\u{0627}"), // Lam-Alif (لا)
        ("La",    "\u{0644}\u{0627}"), // Lam-Alif (لا)
        ("LA",    "\u{0644}\u{0627}"), // Lam-Alif (لا)
        ("aa",    "\u{0627}"), // Long Alif (ا)
        ("AA",    "\u{0627}"),
        ("Aa",    "\u{0627}"),
        ("ee",    "\u{064A}"), // Long Ya (ي)
        ("EE",    "\u{064A}"),
        ("Ee",    "\u{064A}"),
        ("oo",    "\u{0648}"), // Long Waw (و)
        ("OO",    "\u{0648}"),
        ("Oo",    "\u{0648}"),
        ("ou",    "\u{0648}"), // Waw (و)
        ("OU",    "\u{0648}"),
        ("Ou",    "\u{0648}"),

        // 6. Single Uppercase Letters (Shift Key) - Heavy & Pharyngeal Sounds
        ("Z",     "\u{0638}"), // Dhaa / Zha (ظ)
        ("G",     "\u{063A}"), // Ghayn (غ)
        ("H",     "\u{062D}"), // Pharyngeal Ha (ح)
        ("S",     "\u{0635}"), // Saad (ص)
        ("D",     "\u{0636}"), // Daad (ض)
        ("T",     "\u{0637}"), // Taa Heavy (ط)
        ("E",     "\u{0639}"), // Ayn (ع)
        ("A",     "\u{0627}"), // Explicit Alif (ا)
        ("Y",     "\u{0649}"), // Alif Maqsura (ى)
        ("K",     "\u{062E}"), // Kha alternative (خ)

        // 7. Single Lowercase Letters & Shift-Fallbacks for neutral consonants/vowels
        ("z",     "\u{0630}"), // Dhal (ذ)
        ("g",     "\u{062C}"), // Jeem (ج)
        ("h",     "\u{0647}"), // Soft Ha (ه)
        ("s",     "\u{0633}"), // Seen (س)
        ("d",     "\u{062F}"), // Dal (د)
        ("t",     "\u{062A}"), // Soft Ta (ت)
        ("b",     "\u{0628}"), // Ba (ب)
        ("B",     "\u{0628}"), // Ba (Shift fallback)
        ("p",     "\u{0628}"), // Ba fallback (ب)
        ("P",     "\u{0628}"), // Ba fallback (Shift)
        ("r",     "\u{0631}"), // Ra (ر)
        ("R",     "\u{0631}"), // Ra (Shift fallback)
        ("f",     "\u{0641}"), // Fa (ف)
        ("F",     "\u{0641}"), // Fa (Shift fallback)
        ("v",     "\u{0641}"), // Fa fallback (ف)
        ("V",     "\u{0641}"), // Fa fallback (Shift)
        ("q",     "\u{0642}"), // Qaaf (ق)
        ("Q",     "\u{0642}"), // Qaaf (Shift fallback)
        ("k",     "\u{0643}"), // Kaaf (ك)
        ("l",     "\u{0644}"), // Lam (ل)
        ("L",     "\u{0644}"), // Lam (Shift fallback)
        ("m",     "\u{0645}"), // Meem (م)
        ("M",     "\u{0645}"), // Meem (Shift+M produces Meem!)
        ("n",     "\u{0646}"), // Noon (ن)
        ("N",     "\u{0646}"), // Noon (Shift+N produces Noon!)
        ("w",     "\u{0648}"), // Waw (و)
        ("W",     "\u{0648}"), // Waw (Shift fallback)
        ("y",     "\u{064A}"), // Ya (ي)
        ("j",     "\u{062C}"), // Jeem fallback (ج)
        ("J",     "\u{062C}"), // Jeem fallback (Shift)
        ("c",     "\u{0643}"), // Kaaf (ك)
        ("C",     "\u{0643}"), // Kaaf (Shift)
        ("x",     "\u{062E}"), // Kha (خ)
        ("X",     "\u{062E}"), // Kha (Shift)
        ("a",     "\u{0627}"), // Alif (ا)
        ("i",     "\u{064A}"), // Ya (ي)
        ("I",     "\u{064A}"), // Ya (Shift)
        ("u",     "\u{0648}"), // Waw (و)
        ("U",     "\u{0648}"), // Waw (Shift)
        ("e",     "\u{064A}"), // Ya fallback (ي)
        ("o",     "\u{0648}"), // Waw fallback (و)
        ("O",     "\u{0648}")  // Waw fallback (Shift)
    ]
}
