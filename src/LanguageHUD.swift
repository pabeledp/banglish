import Cocoa

/// Floating non-activating HUD indicator for instant visual feedback on language switch
/// Guarantees 0% focus stealing so active apps (Notes, Antigravity, Safari, etc.) never lose focus.
public final class LanguageHUD: NSPanel {
    public static let shared = LanguageHUD()

    private let label = NSTextField(labelWithString: "")
    private let iconLabel = NSTextField(labelWithString: "")
    private let visualEffectView = NSVisualEffectView()
    private var dismissWorkItem: DispatchWorkItem?

    private init() {
        super.init(
            contentRect: NSRect(x: 0, y: 0, width: 176, height: 40),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )

        self.isOpaque = false
        self.backgroundColor = .clear
        self.level = .floating
        self.hasShadow = true
        self.ignoresMouseEvents = true
        self.isReleasedWhenClosed = false
        self.hidesOnDeactivate = false

        setupUI()
    }

    private func setupUI() {
        visualEffectView.frame = NSRect(x: 0, y: 0, width: 176, height: 40)
        visualEffectView.material = .hudWindow
        visualEffectView.state = .active
        visualEffectView.blendingMode = .behindWindow
        visualEffectView.wantsLayer = true
        visualEffectView.layer?.cornerRadius = 20.0
        visualEffectView.layer?.masksToBounds = true
        visualEffectView.layer?.borderWidth = 1.0
        visualEffectView.layer?.borderColor = NSColor(hex: 0x2D6A4F, alpha: 0.7).cgColor
        visualEffectView.layer?.backgroundColor = NSColor(hex: 0x0B2217, alpha: 0.94).cgColor

        contentView = visualEffectView

        iconLabel.font = NSFont.systemFont(ofSize: 15)
        iconLabel.alignment = .center
        iconLabel.frame = NSRect(x: 12, y: 10, width: 24, height: 20)
        visualEffectView.addSubview(iconLabel)

        label.font = NSFont.systemFont(ofSize: 13, weight: .bold)
        label.textColor = .white
        label.alignment = .left
        label.frame = NSRect(x: 38, y: 10, width: 126, height: 20)
        visualEffectView.addSubview(label)
    }

    public func show(mode: InputMode, near cursorRect: NSRect = .zero) {
        dismissWorkItem?.cancel()

        switch mode {
        case .bangla:
            iconLabel.stringValue = "🇧🇩"
            label.stringValue = "বাংলা (Bangla)"
            visualEffectView.layer?.backgroundColor = NSColor(hex: 0x0B2217, alpha: 0.96).cgColor
            visualEffectView.layer?.borderColor = NSColor(hex: 0x2D6A4F, alpha: 0.85).cgColor
        case .arabic:
            iconLabel.stringValue = "🇸🇦"
            label.stringValue = "العربية (Arabic)"
            visualEffectView.layer?.backgroundColor = NSColor(hex: 0x1E1A0C, alpha: 0.96).cgColor
            visualEffectView.layer?.borderColor = NSColor(hex: 0x8A7B2A, alpha: 0.85).cgColor
        case .english:
            iconLabel.stringValue = "🇺🇸"
            label.stringValue = "English"
            visualEffectView.layer?.backgroundColor = NSColor(hex: 0x121724, alpha: 0.96).cgColor
            visualEffectView.layer?.borderColor = NSColor(hex: 0x3D4A68, alpha: 0.85).cgColor
        }

        let hudWidth: CGFloat = 176
        let hudHeight: CGFloat = 40

        var origin: NSPoint
        if cursorRect != .zero && cursorRect.origin.x > 10 && cursorRect.origin.y > 10 {
            origin = NSPoint(x: cursorRect.origin.x, y: cursorRect.origin.y - hudHeight - 8)
        } else if let screen = NSScreen.main {
            origin = NSPoint(x: screen.frame.midX - hudWidth / 2, y: screen.frame.minY + 100)
        } else {
            origin = NSPoint(x: 200, y: 200)
        }

        // Keep HUD on screen
        if let screen = NSScreen.screens.first(where: { NSPointInRect(origin, $0.frame) }) ?? NSScreen.main {
            if origin.y < screen.frame.minY + 20 {
                origin.y = (cursorRect != .zero) ? cursorRect.origin.y + cursorRect.height + 8 : screen.frame.minY + 60
            }
            if origin.x + hudWidth > screen.frame.maxX - 20 {
                origin.x = screen.frame.maxX - hudWidth - 20
            }
            if origin.x < screen.frame.minX + 20 {
                origin.x = screen.frame.minX + 20
            }
        }

        self.setFrame(NSRect(origin: origin, size: NSSize(width: hudWidth, height: hudHeight)), display: true)
        self.alphaValue = 1.0
        self.orderFront(nil)

        let workItem = DispatchWorkItem { [weak self] in
            guard let self = self else { return }
            NSAnimationContext.runAnimationGroup({ context in
                context.duration = 0.2
                self.animator().alphaValue = 0.0
            }, completionHandler: {
                if self.alphaValue == 0.0 {
                    self.orderOut(nil)
                }
            })
        }
        self.dismissWorkItem = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.65, execute: workItem)
    }
}
