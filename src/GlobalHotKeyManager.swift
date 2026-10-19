import Cocoa
import Carbon
import InputMethodKit

final class GlobalHotKeyManager {
    static let shared = GlobalHotKeyManager()

    private var arabicHotKeyRef: EventHotKeyRef?
    private var banglaHotKeyRef: EventHotKeyRef?
    private var ctrlArabicHotKeyRef: EventHotKeyRef?
    private var eventHandlerRef: EventHandlerRef?

    func start() {
        var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard), eventKind: UInt32(kEventHotKeyPressed))

        let status = InstallEventHandler(GetEventDispatcherTarget(), { (nextHandler, theEvent, userData) -> OSStatus in
            var hkID = EventHotKeyID()
            let err = GetEventParameter(theEvent, EventParamName(kEventParamDirectObject), EventParamType(typeEventHotKeyID), nil, MemoryLayout<EventHotKeyID>.size, nil, &hkID)
            guard err == noErr else { return noErr }

            if hkID.id == 1 || hkID.id == 3 {
                // Shift + Option + Space OR Control + Option + Space => ARABIC DIRECTLY!
                GlobalHotKeyManager.shared.activateArabicDirectly()
            } else if hkID.id == 2 {
                // Option + Space => BANGLA / ENGLISH TOGGLE!
                GlobalHotKeyManager.shared.toggleBanglaEnglish()
            }
            return noErr
        }, 1, &eventType, nil, &eventHandlerRef)

        guard status == noErr else {
            NSLog("[Banglish] Failed to install Carbon Event Handler: %d", status)
            return
        }

        // HotKey 1: Shift + Option + Space (keyCode 49, shiftKey | optionKey) => ARABIC
        let arabicID = EventHotKeyID(signature: OSType(0x424E4152), id: 1) // 'BNAR'
        RegisterEventHotKey(49, UInt32(shiftKey | optionKey), arabicID, GetEventDispatcherTarget(), 0, &arabicHotKeyRef)

        // HotKey 2: Option + Space (keyCode 49, optionKey) => BANGLA
        let banglaID = EventHotKeyID(signature: OSType(0x424E4247), id: 2) // 'BNBG'
        RegisterEventHotKey(49, UInt32(optionKey), banglaID, GetEventDispatcherTarget(), 0, &banglaHotKeyRef)

        // HotKey 3: Control + Option + Space (keyCode 49, controlKey | optionKey) => ARABIC (fallback)
        let ctrlArabicID = EventHotKeyID(signature: OSType(0x424E4341), id: 3) // 'BNCA'
        RegisterEventHotKey(49, UInt32(controlKey | optionKey), ctrlArabicID, GetEventDispatcherTarget(), 0, &ctrlArabicHotKeyRef)

        NSLog("[Banglish] Global HotKeys registered successfully (Shift+Opt+Space for Arabic, Opt+Space for Bangla)")
    }

    /// Directly switch to Arabic mode regardless of which app or language was active
    func activateArabicDirectly() {
        DispatchQueue.main.async {
            BanglishInputController.currentMode = .arabic
            BanglishInputController.lastNonEnglishMode = .arabic
            self.selectBanglishInputSource(modeSuffix: ".Arabic")
            BanglishInputController.syncTISInputSource(to: .arabic)
        }
    }

    /// Toggle between Bangla and English
    func toggleBanglaEnglish() {
        DispatchQueue.main.async {
            if BanglishInputController.currentMode == .bangla {
                // If already in Bangla, switch to English
                BanglishInputController.currentMode = .english
                self.selectEnglishInputSource()
            } else {
                // If in English or Arabic, switch to Bangla
                BanglishInputController.currentMode = .bangla
                BanglishInputController.lastNonEnglishMode = .bangla
                self.selectBanglishInputSource(modeSuffix: ".Bangla")
            }
            BanglishInputController.syncTISInputSource(to: BanglishInputController.currentMode)
        }
    }

    private func selectBanglishInputSource(modeSuffix: String) {
        guard let list = TISCreateInputSourceList(nil, false)?.takeRetainedValue() as? [TISInputSource] else { return }
        // 1. First try mode-specific source (e.g. .Arabic or .Bangla)
        for source in list {
            if let ptrId = TISGetInputSourceProperty(source, kTISPropertyInputSourceID) {
                let id = Unmanaged<CFString>.fromOpaque(ptrId).takeUnretainedValue() as String
                if id.lowercased().contains("banglish") && id.hasSuffix(modeSuffix) {
                    TISSelectInputSource(source)
                    return
                }
            }
        }
        // 2. Fallback to any enabled Banglish source
        for source in list {
            if let ptrId = TISGetInputSourceProperty(source, kTISPropertyInputSourceID) {
                let id = Unmanaged<CFString>.fromOpaque(ptrId).takeUnretainedValue() as String
                if id.lowercased().contains("banglish") && id.contains("Bangla") {
                    TISSelectInputSource(source)
                    return
                }
            }
        }
    }

    private func selectEnglishInputSource() {
        guard let list = TISCreateInputSourceList(nil, false)?.takeRetainedValue() as? [TISInputSource] else { return }
        for source in list {
            if let ptrId = TISGetInputSourceProperty(source, kTISPropertyInputSourceID) {
                let id = Unmanaged<CFString>.fromOpaque(ptrId).takeUnretainedValue() as String
                if id.contains("keylayout.US") || id.contains("ABC") {
                    TISSelectInputSource(source)
                    return
                }
            }
        }
    }
}
