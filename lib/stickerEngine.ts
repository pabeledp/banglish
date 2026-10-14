/**
 * Sticker & Card Canvas Rendering Engine
 * Handles High-DPI rasterization, multi-span rich text formatting,
 * sticker die-cut borders, site-themed backgrounds, and PNG export.
 */

export interface TextSpan {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing?: number;
}

export type BackgroundTheme = 'transparent' | 'dark-aurora' | 'light-emerald' | 'custom-rgb';

export interface StickerRenderOptions {
  lines: TextSpan[][];
  bgTheme: BackgroundTheme;
  customBgColor: string; // RGB / Hex / RGBA
  customBgGradient?: { from: string; to: string; angle: number };
  strokeWidth: number; // 0 for none, 4-30 for sticker die-cut
  strokeColor: string; // RGB / Hex
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  padding: number;
  align: 'left' | 'center' | 'right';
  scale: number; // 1x, 2x (HD), 4x (Ultra HD 300 DPI)
  aspectRatio?: 'auto' | '1:1' | '16:9' | '9:16';
  cardWidth?: number;
  cardHeight?: number;
}

interface MeasuredSpan {
  span: TextSpan;
  width: number;
  fontString: string;
}

interface MeasuredLine {
  spans: MeasuredSpan[];
  totalWidth: number;
  maxFontSize: number;
  lineHeight: number;
}

/**
 * Measures all spans and lines using a temporary offscreen canvas context
 */
function measureLines(
  ctx: CanvasRenderingContext2D,
  lines: TextSpan[][],
  scale: number
): { measuredLines: MeasuredLine[]; totalTextWidth: number; totalTextHeight: number } {
  const measuredLines: MeasuredLine[] = [];
  let totalTextWidth = 0;
  let totalTextHeight = 0;

  for (const lineSpans of lines) {
    const lineMeasuredSpans: MeasuredSpan[] = [];
    let lineTotalWidth = 0;
    let maxFontSize = 32;

    for (const span of lineSpans) {
      if (!span.text) continue;
      const scaledFontSize = Math.round(span.fontSize * scale);
      if (scaledFontSize > maxFontSize) maxFontSize = scaledFontSize;

      const fontString = `${span.fontWeight} ${scaledFontSize}px ${span.fontFamily}`;
      ctx.font = fontString;
      const metrics = ctx.measureText(span.text);
      const spanWidth = metrics.width;

      lineMeasuredSpans.push({
        span,
        width: spanWidth,
        fontString
      });
      lineTotalWidth += spanWidth;
    }

    const lineHeight = Math.round(maxFontSize * 1.35);
    totalTextHeight += lineHeight;
    if (lineTotalWidth > totalTextWidth) totalTextWidth = lineTotalWidth;

    measuredLines.push({
      spans: lineMeasuredSpans,
      totalWidth: lineTotalWidth,
      maxFontSize,
      lineHeight
    });
  }

  return { measuredLines, totalTextWidth, totalTextHeight };
}

/**
 * Draw themed backgrounds onto canvas
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: BackgroundTheme,
  customBgColor: string,
  customBgGradient?: { from: string; to: string; angle: number }
) {
  if (theme === 'transparent') {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  if (theme === 'custom-rgb') {
    if (customBgGradient) {
      const angleRad = (customBgGradient.angle * Math.PI) / 180;
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, customBgGradient.from);
      grad.addColorStop(1, customBgGradient.to);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = customBgColor;
    }
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (theme === 'dark-aurora') {
    // Theme 1: Banglish Dark Aurora Glass
    // Base dark slate gradient
    const baseGrad = ctx.createLinearGradient(0, 0, width, height);
    baseGrad.addColorStop(0, '#060a12');
    baseGrad.addColorStop(0.5, '#0b1120');
    baseGrad.addColorStop(1, '#050811');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Emerald Ambient Radial (top-left)
    const radEmerald = ctx.createRadialGradient(
      width * 0.2,
      height * 0.15,
      10,
      width * 0.2,
      height * 0.15,
      width * 0.65
    );
    radEmerald.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    radEmerald.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    radEmerald.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = radEmerald;
    ctx.fillRect(0, 0, width, height);

    // Glowing Cyan Ambient Radial (bottom-right)
    const radCyan = ctx.createRadialGradient(
      width * 0.85,
      height * 0.85,
      10,
      width * 0.85,
      height * 0.85,
      width * 0.6
    );
    radCyan.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
    radCyan.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
    radCyan.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = radCyan;
    ctx.fillRect(0, 0, width, height);

    // Glass Card Frame Border
    const inset = Math.max(12, Math.round(width * 0.02));
    const cardW = width - inset * 2;
    const cardH = height - inset * 2;
    const cornerR = Math.min(24, Math.round(cardW * 0.04));

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(inset, inset, cardW, cardH, cornerR);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = Math.max(2, Math.round(width * 0.003));
    ctx.stroke();

    // Subtle corner highlight
    const strokeGrad = ctx.createLinearGradient(inset, inset, inset + cardW * 0.4, inset + cardH * 0.4);
    strokeGrad.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
    strokeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.strokeStyle = strokeGrad;
    ctx.stroke();
    ctx.restore();

    return;
  }

  if (theme === 'light-emerald') {
    // Theme 2: Banglish Clean Light Emerald
    const baseGrad = ctx.createLinearGradient(0, 0, width, height);
    baseGrad.addColorStop(0, '#f0fdf4'); // emerald-50
    baseGrad.addColorStop(0.4, '#ffffff');
    baseGrad.addColorStop(1, '#f0fdfa'); // teal-50
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // Soft warm emerald ambient
    const radLight = ctx.createRadialGradient(
      width * 0.8,
      height * 0.2,
      20,
      width * 0.8,
      height * 0.2,
      width * 0.7
    );
    radLight.addColorStop(0, 'rgba(52, 211, 153, 0.15)');
    radLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radLight;
    ctx.fillRect(0, 0, width, height);

    // Editorial Card Frame
    const inset = Math.max(12, Math.round(width * 0.02));
    const cardW = width - inset * 2;
    const cardH = height - inset * 2;
    const cornerR = Math.min(24, Math.round(cardW * 0.04));

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(inset, inset, cardW, cardH, cornerR);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = Math.max(1.5, Math.round(width * 0.0025));
    ctx.stroke();

    // Subtle inner shadow
    ctx.shadowColor = 'rgba(15, 23, 42, 0.04)';
    ctx.shadowBlur = 16;
    ctx.restore();

    return;
  }
}

/**
 * Main render function that draws the entire sticker/card onto a canvas
 */
export function renderSticker(
  canvas: HTMLCanvasElement,
  options: StickerRenderOptions
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    lines,
    bgTheme,
    customBgColor,
    customBgGradient,
    strokeWidth,
    strokeColor,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
    padding,
    align,
    scale,
    aspectRatio,
    cardWidth,
    cardHeight
  } = options;

  // 1. Measure text
  const scaledPadding = Math.round(padding * scale);
  const scaledStrokeWidth = Math.round(strokeWidth * scale);
  const { measuredLines, totalTextWidth, totalTextHeight } = measureLines(ctx, lines, scale);

  // 2. Determine canvas dimensions
  let targetWidth = totalTextWidth + scaledPadding * 2 + scaledStrokeWidth * 2;
  let targetHeight = totalTextHeight + scaledPadding * 2 + scaledStrokeWidth * 2;

  if (cardWidth && cardHeight) {
    targetWidth = cardWidth * scale;
    targetHeight = cardHeight * scale;
  } else if (aspectRatio && aspectRatio !== 'auto') {
    const minSize = Math.max(targetWidth, targetHeight, 512 * scale);
    if (aspectRatio === '1:1') {
      targetWidth = minSize;
      targetHeight = minSize;
    } else if (aspectRatio === '16:9') {
      targetWidth = Math.max(minSize, (minSize * 16) / 9);
      targetHeight = (targetWidth * 9) / 16;
    } else if (aspectRatio === '9:16') {
      targetHeight = Math.max(minSize, (minSize * 16) / 9);
      targetWidth = (targetHeight * 9) / 16;
    }
  }

  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);

  // 3. Draw Background
  drawBackground(ctx, canvas.width, canvas.height, bgTheme, customBgColor, customBgGradient);

  // 4. Calculate vertical start position (vertically centered if card has extra space)
  const availableContentHeight = canvas.height - scaledPadding * 2;
  let currentY =
    totalTextHeight < availableContentHeight
      ? (canvas.height - totalTextHeight) / 2
      : scaledPadding + scaledStrokeWidth;

  // 5. Render Pass 1: Die-Cut Stroke / Outline (drawn first so it expands outward)
  if (scaledStrokeWidth > 0) {
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = scaledStrokeWidth * 2;
    ctx.strokeStyle = strokeColor;

    if (shadowBlur > 0) {
      ctx.shadowBlur = shadowBlur * scale;
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = shadowOffsetX * scale;
      ctx.shadowOffsetY = shadowOffsetY * scale;
    }

    let pass1Y = currentY;
    for (const mLine of measuredLines) {
      const lineBaselineY = pass1Y + mLine.lineHeight * 0.78;
      let startX = scaledPadding + scaledStrokeWidth;

      if (align === 'center') {
        startX = (canvas.width - mLine.totalWidth) / 2;
      } else if (align === 'right') {
        startX = canvas.width - scaledPadding - scaledStrokeWidth - mLine.totalWidth;
      }

      let curX = startX;
      for (const mSpan of mLine.spans) {
        ctx.font = mSpan.fontString;
        ctx.strokeText(mSpan.span.text, curX, lineBaselineY);
        curX += mSpan.width;
      }
      pass1Y += mLine.lineHeight;
    }
    ctx.restore();
  }

  // 6. Render Pass 2: Fill Text on top with exact span colors
  ctx.save();
  // If no stroke was applied, apply shadow directly to fillText if shadow exists
  if (scaledStrokeWidth === 0 && shadowBlur > 0) {
    ctx.shadowBlur = shadowBlur * scale;
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = shadowOffsetX * scale;
    ctx.shadowOffsetY = shadowOffsetY * scale;
  }

  let pass2Y = currentY;
  for (const mLine of measuredLines) {
    const lineBaselineY = pass2Y + mLine.lineHeight * 0.78;
    let startX = scaledPadding + scaledStrokeWidth;

    if (align === 'center') {
      startX = (canvas.width - mLine.totalWidth) / 2;
    } else if (align === 'right') {
      startX = canvas.width - scaledPadding - scaledStrokeWidth - mLine.totalWidth;
    }

    let curX = startX;
    for (const mSpan of mLine.spans) {
      ctx.font = mSpan.fontString;
      ctx.fillStyle = mSpan.span.color;
      ctx.fillText(mSpan.span.text, curX, lineBaselineY);
      curX += mSpan.width;
    }
    pass2Y += mLine.lineHeight;
  }
  ctx.restore();
}

/**
 * Convert Canvas to PNG Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to convert canvas to blob'));
    }, 'image/png');
  });
}

/**
 * Trigger browser file download for a Blob
 */
export function downloadBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy PNG image blob directly to user's system clipboard
 */
export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard || !navigator.clipboard.write) {
    throw new Error('Clipboard API not supported on this browser');
  }

  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
    throw err;
  }
}
