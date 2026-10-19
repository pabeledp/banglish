import Cocoa
import Carbon
import InputMethodKit

final class GlobalHotKeyManager {
    static let shared = GlobalHotKeyManager()

    private var arabicHotKeyRef: EventHotKeyRef?
    private var banglaHotKeyRef: EventHotKeyRef?
    private var ctrlArabicHotKeyRef: EventHotKeyRef?
    private var cmdSpaceHotKeyRef: EventHotKeyRef?
    private var ctrlSpaceHotKeyRef: EventHotKeyRef?
    private var eventHandlerRef: EventHandlerRef?

    private var lastCycleTimestamp: TimeInterval = 0

    func start() {
        var eventType = EventTypeSpec(eventClass: OSType(kEventClassKeyboard), eventKind: UInt32(kEventHotKeyPressed))

        let status = InstallEventHandler(GetEventDispatcherTarget(), { (nextHandler, theEvent, userData) -> OSStatus in
            var hkID = EventHotKeyID()
            let err = GetEventParameter(theEvent, EventParamName(kEventParamDirectObject), EventParamType(typeEventHotKeyID), nil, MemoryLayout<EventHotKeyID>.size, nil, &hkID)
            guard err == noErr else { return noErr }

            let now = CACurrentMediaTime()
            if now - GlobalHotKeyManager.shared.lastCycleTimestamp < 0.25 {
                // Debounce rapid duplicate trigger within 250ms
                return noErr
            }
            GlobalHotKeyManager.shared.lastCycleTimestamp = now

            if hkID.id == 1 || hkID.id == 3 {
                // Shift + Option + Space OR Control + Option + Space => Direct to Arabic!
                GlobalHotKeyManager.shared.selectArabic()
                return noErr
            } else if hkID.id == 2 || hkID.id == 4 || hkID.id == 5 {
                // Command + Space OR Option + Space OR Control + Space =>
                // Cycle: Bangla -> Arabic -> English (US) -> Bangla
                GlobalHotKeyManager.shared.cycleNextInputSource()
                return noErr
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

        // HotKey 2: Option + Space (keyCode 49, optionKey) => Cycle
        let banglaID = EventHotKeyID(signature: OSType(0x424E4247), id: 2) // 'BNBG'
        RegisterEventHotKey(49, UInt32(optionKey), banglaID, GetEventDispatcherTarget(), 0, &banglaHotKeyRef)

        // HotKey 3: Control + Option + Space (keyCode 49, controlKey | optionKey) => ARABIC
        let ctrlArabicID = EventHotKeyID(signature: OSType(0x424E4341), id: 3) // 'BNCA'
        RegisterEventHotKey(49, UInt32(controlKey | optionKey), ctrlArabicID, GetEventDispatcherTarget(), 0, &ctrlArabicHotKeyRef)

        // HotKey 4: Command + Space (keyCode 49, cmdKey) => Cycle
        let cmdSpaceID = EventHotKeyID(signature: OSType(0x424E4353), id: 4) // 'BNCS'
        RegisterEventHotKey(49, UInt32(cmdKey), cmdSpaceID, GetEventDispatcherTarget(), 0, &cmdSpaceHotKeyRef)

        // HotKey 5: Control + Space (keyCode 49, controlKey) => Cycle
        let ctrlSpaceID = EventHotKeyID(signature: OSType(0x424E4354), id: 5) // 'BNCT'
        RegisterEventHotKey(49, UInt32(controlKey), ctrlSpaceID, GetEventDispatcherTarget(), 0, &ctrlSpaceHotKeyRef)

        enableAllBanglishModes()
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

    /// Select Arabic input mode directly
    func selectArabic() {
        BanglishInputController.activateArabicDirectly()
    }

    /// Continuous 3-Way Cycle:
    /// Bangla -> Arabic -> English -> Bangla
    func cycleNextInputSource() {
        BanglishInputController.cycleLanguageGlobal()
    }
}
