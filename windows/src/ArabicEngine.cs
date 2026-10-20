using System;
using System.Collections.Generic;
using System.Text;

namespace Banglish.Core
{
    /// <summary>
    /// Clean, Deterministic Latin-to-Arabic Phonetic Transliteration Engine for Windows.
    /// Follows the Master Antigravity Specification with Case-Sensitive, Greedy Longest-Prefix Matching.
    /// </summary>
    public class ArabicEngine
    {
        public static readonly ArabicEngine Shared = new ArabicEngine();

        public static string TransliterateText(string text)
        {
            return Shared.Transliterate(text);
        }

        /// <summary>
        /// Strip Harakat (Diacritics) & Maddah for unvocalized search & fallback
        /// </summary>
        public string StripDiacritics(string text)
        {
            if (string.IsNullOrEmpty(text)) return "";
            StringBuilder sb = new StringBuilder();
            foreach (char c in text)
            {
                if (c >= 0x064B && c <= 0x0652) continue; // Fathatan to Sukun
                if (c == 0x0670 || c == 0x0656 || c == 0x0657 || c == 0x0653 || c == 0x06E4) continue; // Maddah & dagger alif
                sb.Append(c);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Transliterate Latin phonetic string into Arabic Unicode (Case-Sensitive, Greedy Longest-Prefix Match)
        /// </summary>
        public string Transliterate(string text)
        {
            if (string.IsNullOrEmpty(text)) return "";

            StringBuilder result = new StringBuilder();
            int cur = 0;
            int total = text.Length;

            while (cur < total)
            {
                // Check for initial 'al' ligature at word start
                bool isWordStart = (result.Length == 0) || 
                                   (result[result.Length - 1] == ' ') || 
                                   (result[result.Length - 1] == '\n') || 
                                   (result[result.Length - 1] == '-');

                if (isWordStart && (cur + 2 <= total))
                {
                    string prefix2 = text.Substring(cur, 2);
                    if (prefix2 == "al" || prefix2 == "Al")
                    {
                        result.Append("ال");
                        cur += 2;
                        continue;
                    }
                }

                bool matched = false;
                foreach (var rule in ArabicData.Rules)
                {
                    int rLen = rule.Latin.Length;
                    if (cur + rLen <= total)
                    {
                        if (string.CompareOrdinal(text, cur, rule.Latin, 0, rLen) == 0)
                        {
                            // Check Lam-Alif ligature if previous character is Lam and rule produces Alif
                            if (result.Length > 0 && result[result.Length - 1] == 'ل' && (rule.Arabic == "\u0627" || rule.Arabic == "\u0623"))
                            {
                                result.Remove(result.Length - 1, 1);
                                result.Append(ArabicData.LamAlif);
                            }
                            else
                            {
                                result.Append(rule.Arabic);
                            }
                            cur += rLen;
                            matched = true;
                            break;
                        }
                    }
                }

                if (!matched)
                {
                    char firstChar = text[cur];
                    string lowerStr = char.ToLowerInvariant(firstChar).ToString();
                    bool fallbackMatched = false;
                    foreach (var rule in ArabicData.Rules)
                    {
                        if (rule.Latin == lowerStr)
                        {
                            result.Append(rule.Arabic);
                            fallbackMatched = true;
                            break;
                        }
                    }
                    if (!fallbackMatched)
                    {
                        result.Append(firstChar);
                    }
                    cur++;
                }
            }

            return result.ToString();
        }
    }
}
