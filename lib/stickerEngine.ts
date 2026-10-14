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

export type BackgroundTheme = 'transparent' | 'banglish-theme' | 'dark-aurora';

export interface StickerRenderOptions {
  lines: TextSpan[][];
  bgTheme: BackgroundTheme;
  customBgColor?: string; // Optional
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

let cachedThemeImage: HTMLImageElement | null = null;

export function getThemeImage(): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  if (!cachedThemeImage) {
    cachedThemeImage = new Image();
    cachedThemeImage.src = '/assets/banglish-card-bg.jpg';
  }
  return cachedThemeImage;
}

/**
 * Draw themed backgrounds onto canvas
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: BackgroundTheme
) {
  if (theme === 'transparent') {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  if (theme === 'banglish-theme') {
    // Procedural Banglish Theme: 1:1 Square Card with soft ambient, subtle grids, and low-opacity Bangla letters
    const baseGrad = ctx.createLinearGradient(0, 0, width, height);
    baseGrad.addColorStop(0, '#f9fdfa');
    baseGrad.addColorStop(0.5, '#ffffff');
    baseGrad.addColorStop(1, '#f2faf5');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, width, height);

    // 1. Soft Emerald Ambient Glows (Top-left & Bottom-right)
    const radTL = ctx.createRadialGradient(width * 0.08, height * 0.08, 10, width * 0.08, height * 0.08, width * 0.65);
    radTL.addColorStop(0, 'rgba(52, 211, 153, 0.16)');
    radTL.addColorStop(0.6, 'rgba(52, 211, 153, 0.04)');
    radTL.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radTL;
    ctx.fillRect(0, 0, width, height);

    const radBR = ctx.createRadialGradient(width * 0.92, height * 0.92, 10, width * 0.92, height * 0.92, width * 0.6);
    radBR.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
    radBR.addColorStop(0.6, 'rgba(16, 185, 129, 0.03)');
    radBR.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radBR;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Grid Lines (Low Transparency)
    const gridStep = Math.max(18, Math.round(width / 24));
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.035)'; // Very subtle low transparency
    ctx.lineWidth = Math.max(0.75, width * 0.001);

    for (let x = gridStep; x < width; x += gridStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = gridStep; y < height; y += gridStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
    ctx.restore();

    // 3. Bangla Alphabet Watermarks with Low Transparency ('অ', 'আ', 'ক', 'খ', 'গ')
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.042)'; // Low transparency watermark
    ctx.font = `600 ${Math.round(width * 0.11)}px 'Hind Siliguri', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('অ', width * 0.12, height * 0.16);
    ctx.fillText('আ', width * 0.12, height * 0.76);
    ctx.fillText('গ', width * 0.86, height * 0.26);
    ctx.fillText('ক', width * 0.88, height * 0.53);
    ctx.fillText('খ', width * 0.86, height * 0.78);
    ctx.restore();

    // 4. Stylized 3D Glass Water Droplets (Top-Right & Bottom-Left)
    // Top-Right Glass Droplet Blob
    ctx.save();
    ctx.beginPath();
    const trX = width * 0.93;
    const trY = height * 0.07;
    const trR = width * 0.055;
    ctx.arc(trX, trY, trR, 0, Math.PI * 2);
    const dropGradTR = ctx.createLinearGradient(trX - trR, trY - trR, trX + trR, trY + trR);
    dropGradTR.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    dropGradTR.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
    dropGradTR.addColorStop(1, 'rgba(6, 182, 212, 0.20)');
    ctx.fillStyle = dropGradTR;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = Math.max(1, width * 0.002);
    ctx.fill();
    ctx.stroke();

    // Specular Highlight
    ctx.beginPath();
    ctx.arc(trX - trR * 0.35, trY - trR * 0.35, trR * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();

    // Mini companion bead
    ctx.beginPath();
    ctx.arc(trX - trR * 0.95, trY + trR * 0.7, trR * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.fill();
    ctx.stroke();

    // Bottom-Left Glass Droplet Blob
    const blX = width * 0.07;
    const blY = height * 0.94;
    const blR = width * 0.045;
    ctx.beginPath();
    ctx.arc(blX, blY, blR, 0, Math.PI * 2);
    const dropGradBL = ctx.createLinearGradient(blX - blR, blY - blR, blX + blR, blY + blR);
    dropGradBL.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    dropGradBL.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
    ctx.fillStyle = dropGradBL;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = Math.max(1, width * 0.002);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Subtle Card Frame Border
    ctx.save();
    const frameInset = Math.max(8, Math.round(width * 0.015));
    ctx.beginPath();
    ctx.roundRect(frameInset, frameInset, width - frameInset * 2, height - frameInset * 2, Math.min(28, width * 0.035));
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.lineWidth = Math.max(1.5, width * 0.0025);
    ctx.stroke();
    ctx.restore();

    return;
  }

  if (theme === 'dark-aurora') {
    // Theme 1: Banglish Dark Aurora Glass
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

  if (bgTheme !== 'transparent') {
    // 1:1 Square Card Always (As requested: "1:1 e hobe only")
    const squareSize = Math.max(targetWidth, targetHeight, 512 * scale);
    targetWidth = squareSize;
    targetHeight = squareSize;
  }

  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);

  // 3. Draw Background
  drawBackground(ctx, canvas.width, canvas.height, bgTheme);

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
