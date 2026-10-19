import Foundation

/// Clean, Deterministic Latin-to-Arabic Phonetic Transliteration Engine
public final class ArabicEngine {
    public static let shared = ArabicEngine()

    public init() {}

    public static func transliterate(_ text: String) -> String {
        return shared.transliterate(text)
    }

    /// Strip Harakat (Diacritics) for unvocalized text search & fallback
    public func stripDiacritics(_ text: String) -> String {
        let diacriticScalars: Set<UInt32> = [
            0x064B, // Fathatan
            0x064C, // Dammatan
            0x064D, // Kasratan
            0x064E, // Fatha
            0x064F, // Damma
            0x0650, // Kasra
            0x0651, // Shaddah
            0x0652  // Sukun
        ]
        let stripped = text.unicodeScalars.filter { !diacriticScalars.contains($0.value) }
        return String(String.UnicodeScalarView(stripped))
    }

    /// Transliterate Latin phonetic string into Arabic Unicode (Case-Sensitive, Greedy Longest-Prefix Match)
    public func transliterate(_ text: String) -> String {
        guard !text.isEmpty else { return "" }
        var result = ""
        var buffer = text

        while !buffer.isEmpty {
            // Check for initial 'al' ligature at word start
            let isWordStart = result.isEmpty || result.hasSuffix(" ") || result.hasSuffix("\n") || result.hasSuffix("-")
            if isWordStart && buffer.count >= 2 {
                if buffer.hasPrefix("al") || buffer.hasPrefix("Al") {
                    result.append("ال")
                    buffer.removeFirst(2)
                    continue
                }
            }

            var matched = false
            for rule in ArabicData.rules {
                if buffer.hasPrefix(rule.latin) {
                    // Check Lam-Alif ligature if previous character is Lam and rule produces Alif
                    if result.hasSuffix("ل") && (rule.arabic == "\u{0627}" || rule.arabic == "\u{0623}") {
                        result.removeLast()
                        result.append("\u{0644}\u{0627}")
                    } else {
                        result.append(rule.arabic)
                    }
                    buffer.removeFirst(rule.latin.count)
                    matched = true
                    break
                }
            }

            if !matched {
                let firstChar = buffer.removeFirst()
                let lowerStr = String(firstChar).lowercased()
                if let rule = ArabicData.rules.first(where: { $0.latin == lowerStr }) {
                    result.append(rule.arabic)
                } else {
                    result.append(firstChar)
                }
            }
        }
        return result
    }
}
