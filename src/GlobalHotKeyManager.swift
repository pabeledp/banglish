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

        let status = InstallEventHandler(GetApplicationEventTarget(), { (nextHandler, theEvent, userData) -> OSStatus in
            var hkID = EventHotKeyID()
            let err = GetEventParameter(theEvent, EventParamName(kEventParamDirectObject), EventParamType(typeEventHotKeyID), nil, MemoryLayout<EventHotKeyID>.size, nil, &hkID)
            guard err == noErr else { return noErr }

            let now = CACurrentMediaTime()
            if now - GlobalHotKeyManager.shared.lastCycleTimestamp < 0.15 {
                return noErr
            }
            GlobalHotKeyManager.shared.lastCycleTimestamp = now

            if hkID.id == 1 || hkID.id == 2 {
                // Command + Space or Option + Space => Continuous Cycle: Bangla -> Arabic -> English -> Bangla
                BanglishInputController.performCycle()
            }
            return noErr
        }, 1, &eventType, nil, &eventHandlerRef)

        guard status == noErr else {
            NSLog("[Banglish] Failed to install Carbon Event Handler: %d", status)
            return
        }

        // HotKey 1: Command + Space (keyCode 49, cmdKey) => 3-Way Language Cycle
        let cmdID = EventHotKeyID(signature: OSType(0x424E434D), id: 1) // 'BNCM'
        RegisterEventHotKey(49, UInt32(cmdKey), cmdID, GetApplicationEventTarget(), 0, &cmdSpaceHotKeyRef)

        // HotKey 2: Option + Space (keyCode 49, optionKey) => 3-Way Language Cycle fallback
        let banglaID = EventHotKeyID(signature: OSType(0x424E4247), id: 2) // 'BNBG'
        RegisterEventHotKey(49, UInt32(optionKey), banglaID, GetApplicationEventTarget(), 0, &banglaHotKeyRef)

        BanglishInputController.prewarmInputSources()
        enableAllBanglishModes()
        NSLog("[Banglish] Global HotKey active: Command + Space & Option + Space for 3-way cycle")
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
        BanglishInputController.performCycle()
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
