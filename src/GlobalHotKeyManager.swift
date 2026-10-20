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
            if now - GlobalHotKeyManager.shared.lastCycleTimestamp < 0.12 {
                return noErr
            }
            GlobalHotKeyManager.shared.lastCycleTimestamp = now

            if hkID.id == 1 || hkID.id == 3 {
                // Shift + Option + Space OR Control + Option + Space => ARABIC DIRECTLY
                GlobalHotKeyManager.shared.activateArabicDirectly()
            } else if hkID.id == 2 || hkID.id == 4 || hkID.id == 5 {
                // Command + Space OR Option + Space OR Control + Space =>
                // Cycle: Bangla -> Arabic -> English -> Bangla
                GlobalHotKeyManager.shared.cycleNextLanguage()
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

        // HotKey 2: Option + Space (keyCode 49, optionKey) => CYCLE
        let banglaID = EventHotKeyID(signature: OSType(0x424E4247), id: 2) // 'BNBG'
        RegisterEventHotKey(49, UInt32(optionKey), banglaID, GetEventDispatcherTarget(), 0, &banglaHotKeyRef)

        // HotKey 3: Control + Option + Space (keyCode 49, controlKey | optionKey) => ARABIC
        let ctrlArabicID = EventHotKeyID(signature: OSType(0x424E4341), id: 3) // 'BNCA'
        RegisterEventHotKey(49, UInt32(controlKey | optionKey), ctrlArabicID, GetEventDispatcherTarget(), 0, &ctrlArabicHotKeyRef)

        // HotKey 4: Command + Space (keyCode 49, cmdKey) => CYCLE
        let cmdSpaceID = EventHotKeyID(signature: OSType(0x424E4353), id: 4) // 'BNCS'
        RegisterEventHotKey(49, UInt32(cmdKey), cmdSpaceID, GetEventDispatcherTarget(), 0, &cmdSpaceHotKeyRef)

        // HotKey 5: Control + Space (keyCode 49, controlKey) => CYCLE
        let ctrlSpaceID = EventHotKeyID(signature: OSType(0x424E4354), id: 5) // 'BNCT'
        RegisterEventHotKey(49, UInt32(controlKey), ctrlSpaceID, GetEventDispatcherTarget(), 0, &ctrlSpaceHotKeyRef)

        BanglishInputController.prewarmInputSources()
        enableAllBanglishModes()
        NSLog("[Banglish] Global HotKeys active: Cmd+Space, Opt+Space, Ctrl+Space for 3-way cycle")
    }

    /// Directly switch to Arabic mode regardless of which app was active
    func activateArabicDirectly() {
        DispatchQueue.main.async {
            BanglishInputController.commitActiveBuffer()
            BanglishInputController.selectSystemInputSource(mode: .arabic)
        }
    }

    /// Cycle continuously: Bangla -> Arabic -> English -> Bangla
    func cycleNextLanguage() {
        DispatchQueue.main.async {
            BanglishInputController.commitActiveBuffer()

            guard let current = TISCopyCurrentKeyboardInputSource()?.takeRetainedValue() else {
                BanglishInputController.selectSystemInputSource(mode: .bangla)
                return
            }

            let modeId = (TISGetInputSourceProperty(current, kTISPropertyInputModeID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""
            let bId = (TISGetInputSourceProperty(current, kTISPropertyBundleID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""
            let sId = (TISGetInputSourceProperty(current, kTISPropertyInputSourceID).map { Unmanaged<CFString>.fromOpaque($0).takeUnretainedValue() as String }) ?? ""

            let isBanglish = bId.contains("Banglish") || sId.contains("Banglish")

            if isBanglish {
                if modeId.contains("Arabic") || sId.contains("Arabic") || BanglishInputController.currentMode == .arabic {
                    // Arabic -> English
                    BanglishInputController.selectSystemInputSource(mode: .english)
                } else {
                    // Bangla -> Arabic
                    BanglishInputController.selectSystemInputSource(mode: .arabic)
                }
            } else {
                // English or other -> Bangla
                BanglishInputController.selectSystemInputSource(mode: .bangla)
            }
        }
    }

    func selectBanglishMode(_ modeKeyword: String) {
        if modeKeyword.contains("Arabic") {
            BanglishInputController.selectSystemInputSource(mode: .arabic)
        } else {
            BanglishInputController.selectSystemInputSource(mode: .bangla)
        }
    }

    func selectEnglishInputSource() {
        BanglishInputController.selectSystemInputSource(mode: .english)
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
