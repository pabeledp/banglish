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
        if let list = TISCreateInputSourceList(nil, true)?.takeRetainedValue() as? [TISInputSource] {
            for source in list {
                let id = (TISGetInputSourceProperty(source, kTISPropertyInputSourceID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""
                let bId = (TISGetInputSourceProperty(source, kTISPropertyBundleID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""
                if id.lowercased().contains("banglish") || bId.lowercased().contains("banglish") {
                    TISEnableInputSource(source)
                }
            }
        }
        let modeProps = [kTISPropertyInputSourceType: "TISTypeKeyboardInputMode"] as CFDictionary
        if let modeList = TISCreateInputSourceList(modeProps, true)?.takeRetainedValue() as? [TISInputSource] {
            for source in modeList {
                let bId = (TISGetInputSourceProperty(source, kTISPropertyBundleID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""
                if bId.lowercased().contains("banglish") {
                    TISEnableInputSource(source)
                }
            }
        }
    }
}
