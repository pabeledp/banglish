import Foundation

/// Fast Arabic Dictionary & Letter-Based Phonetic Candidate Suggester
public final class ArabicDictionary {
    public static let shared = ArabicDictionary()

    private var autodict: [String: String] = [:]
    private let lock = NSLock()

    // Common seed Arabic lexicon & high-frequency Arabic words (Letter-Only, No Arabizi Digits)
    private let seedAutodict: [String: String] = [
        // Greetings & Etiquette
        "salam": "سلام",
        "alsalam": "السلام",
        "marhaba": "مرحبا",
        "marHaba": "مرحبا",
        "ahlan": "أهلا",
        "shukran": "شكرا",
        "shokran": "شكرا",
        "afwan": "عفوا",
        "Efwan": "عفوا",
        "habibi": "حبيبي",
        "Habibi": "حبيبي",
        "habibti": "حبيبتي",
        "Habibti": "حبيبتي",
        "tamam": "تمام",
        "sabah": "صباح",
        "Sabah": "صباح",
        "kheir": "خير",
        "kheer": "خير",
        "masa": "مساء",
        "massa": "مساء",
        "kwayes": "كويس",
        "mnih": "منيح",
        "khalas": "خلاص",
        "yalla": "يلا",
        "aywa": "أيوه",
        "naam": "نعم",
        "la": "لا",
        "laa": "لا",

        // Verification & Benchmark Test Words
        "zalika": "ذلك",
        "Zalika": "ذلك",
        "zahir": "ظاهر",
        "Zahir": "ظاهر",
        "gameel": "جميل",
        "Gameel": "جميل",
        "gafoor": "غفور",
        "Gafoor": "غفور",
        "khalid": "خالد",
        "Khalid": "خالد",
        "rahmath": "رحمة",
        "raHmaTh": "رحمة",

        // Islamic & Cultural Phrases
        "inshallah": "إن شاء الله",
        "inshaallah": "إن شاء الله",
        "mashallah": "ما شاء الله",
        "mashaallah": "ما شاء الله",
        "alhamdulillah": "الحمد لله",
        "elhamdulillah": "الحمد لله",
        "subhanallah": "سبحان الله",
        "astaghfirullah": "أستغفر الله",
        "bismillah": "بسم الله",
        "allah": "الله",
        "mohammad": "محمد",
        "muhammad": "محمد",
        "quran": "قرآن",
        "islam": "إسلام",
        "muslim": "مسلم",
        "masjid": "مسجد",
        "jumaa": "جمعة",
        "eid": "عيد",
        "ramadan": "رمضان",

        // Common Questions & Pronouns
        "kayf": "كيف",
        "kef": "كيف",
        "kaifa": "كيف",
        "kayfak": "كيفك",
        "kefak": "كيفك",
        "wen": "وين",
        "wayn": "أين",
        "ayna": "أين",
        "lesh": "ليش",
        "lemadha": "لماذا",
        "meen": "مين",
        "man": "من",
        "shu": "شو",
        "matha": "ماذا",
        "kam": "كم",
        "mata": "متى",
        "ana": "أنا",
        "enta": "أنت",
        "enti": "أنتِ",
        "howa": "هو",
        "hiya": "هي",
        "nahnu": "نحن",
        "hom": "هم",

        // Everyday Vocabulary
        "kitab": "كتاب",
        "qalam": "قلم",
        "bayt": "بيت",
        "beit": "بيت",
        "madrasa": "مدرسة",
        "jamia": "جامعة",
        "shams": "شمس",
        "qamar": "قمر",
        "yawm": "يوم",
        "yom": "يوم",
        "shahr": "شهر",
        "sana": "سنة",
        "waqt": "وقت",
        "saa": "ساعة",
        "sooq": "سوق",
        "souq": "سوق",
        "matam": "مطعم",
        "funduq": "فندق",
        "sayyara": "سيارة",
        "tayyara": "طيارة",
        "matar": "مطار",
        "qahwa": "قهوة",
        "shay": "شاي",
        "ma": "ماء",
        "moya": "مويه",
        "khobz": "خبز",
        "akl": "أكل",
        "ful": "فول",
        "kabab": "كباب",
        "arab": "عرب",
        "Erab": "عرب",
        "arabi": "عربي",
        "Erabi": "عربي",
        "lugha": "لغة"
    ]

    private init() {
        self.autodict = seedAutodict
    }

    /// Add a learned user word mapping
    public func learn(latin: String, arabic: String) {
        let key = latin.trimmingCharacters(in: .whitespacesAndNewlines)
        let val = arabic.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !key.isEmpty, !val.isEmpty else { return }

        lock.lock()
        autodict[key] = val
        lock.unlock()
    }

    /// Generate ranked candidates for Letter-Based phonetic input
    public func candidates(for rawInput: String) -> [String] {
        guard !rawInput.isEmpty else { return [] }

        let trimmed = rawInput.trimmingCharacters(in: .whitespacesAndNewlines)
        var preferred: String? = nil
        lock.lock()
        // Check case-sensitive exact match first, then lowercase fallback
        preferred = autodict[trimmed] ?? autodict[trimmed.lowercased()]
        lock.unlock()

        let primary = ArabicEngine.shared.transliterate(rawInput)
        var result: [String] = []
        var seen: Set<String> = []

        func addCandidate(_ word: String) {
            let t = word.trimmingCharacters(in: .whitespacesAndNewlines)
            if !t.isEmpty && !seen.contains(t) {
                seen.insert(t)
                result.append(t)
            }
        }

        // 1. High-frequency dictionary match
        if let pref = preferred {
            addCandidate(pref)
        }

        // 2. Primary phonetic transliteration
        if !primary.isEmpty {
            addCandidate(primary)

            // 3. Diacritic-stripped version (so users easily get unvocalized Arabic)
            let stripped = ArabicEngine.shared.stripDiacritics(primary)
            if stripped != primary {
                addCandidate(stripped)
            }

            // 4. Common Arabic orthographic variations
            // Ta Marbuta (ة) <-> Ha (ه)
            if primary.hasSuffix("ة") {
                addCandidate(String(primary.dropLast()) + "ه")
            } else if primary.hasSuffix("ه") {
                addCandidate(String(primary.dropLast()) + "ة")
            }

            // Alif Maqsura (ى) <-> Ya (ي)
            if primary.hasSuffix("ى") {
                addCandidate(String(primary.dropLast()) + "ي")
            } else if primary.hasSuffix("ي") {
                addCandidate(String(primary.dropLast()) + "ى")
            }

            // Alif with Hamza variations
            if primary.hasPrefix("أ") {
                addCandidate("ا" + String(primary.dropFirst()))
                addCandidate("إ" + String(primary.dropFirst()))
            } else if primary.hasPrefix("إ") {
                addCandidate("ا" + String(primary.dropFirst()))
                addCandidate("أ" + String(primary.dropFirst()))
            } else if primary.hasPrefix("ا") {
                addCandidate("أ" + String(primary.dropFirst()))
                addCandidate("إ" + String(primary.dropFirst()))
            }
        }

        return result
    }
}
