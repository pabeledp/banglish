import Cocoa
import Carbon
import InputMethodKit

final class GlobalHotKeyManager {
    static let shared = GlobalHotKeyManager()

    func start() {
        // Ensure both Banglish (Bangla) and Banglish AR (Arabic) modes are enabled in TIS
        enableAllBanglishModes()
        NSLog("[Banglish] Global manager started cleanly (carbon hotkeys omitted to preserve app focus)")
    }

    func enableAllBanglishModes() {
        guard let list = TISCreateInputSourceList(nil, true)?.takeRetainedValue() as? [TISInputSource] else { return }
        for source in list {
            if let ptrId = TISGetInputSourceProperty(source, kTISPropertyInputSourceID) {
                let id = Unmanaged<CFString>.fromOpaque(ptrId).takeUnretainedValue() as String
                if id.lowercased().contains("banglish") {
                    TISEnableInputSource(source)
                }
            }
        }
    }
}
