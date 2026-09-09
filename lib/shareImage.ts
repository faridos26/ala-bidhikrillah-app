// Renders a shareable 1080x1080 image card for a piece of content, using the
// same fonts already loaded on the page (via next/font) so the image matches
// the app's identity instead of falling back to a generic system font.

function resolveFontFamily(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return value || fallback;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
  return lines.length;
}

export async function createShareImage({
  text,
  reference,
  brand = "سكينة برو",
}: {
  text: string;
  reference: string;
  brand?: string;
}): Promise<string> {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Wait for the page's Arabic webfonts to be ready before measuring/drawing text.
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      // continue with fallback fonts
    }
  }

  const quranFont = resolveFontFamily("--font-amiri", "serif");
  const uiFont = resolveFontFamily("--font-tajawal", "sans-serif");

  // Background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#1f5c42");
  gradient.addColorStop(1, "#122f22");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Faint 8-point star watermark, top area
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#ffffff";
  ctx.translate(size / 2, 190);
  for (const angle of [0, 45]) {
    ctx.save();
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillRect(-90, -90, 180, 180);
    ctx.restore();
  }
  ctx.restore();

  // Quote marks
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.fillStyle = "#d8b578";
  ctx.font = `64px ${uiFont}`;
  ctx.fillText("﴾", size / 2, 320);

  // Main text
  ctx.fillStyle = "#f5f6ef";
  ctx.font = `52px ${quranFont}`;
  wrapText(ctx, text, size / 2, size / 2, size - 200, 78);

  // Reference
  ctx.font = `30px ${uiFont}`;
  ctx.fillStyle = "#d8b578";
  ctx.fillText(reference, size / 2, size - 190);

  // Divider
  ctx.strokeStyle = "rgba(245,246,239,0.25)";
  ctx.beginPath();
  ctx.moveTo(size / 2 - 60, size - 150);
  ctx.lineTo(size / 2 + 60, size - 150);
  ctx.stroke();

  // Brand
  ctx.font = `26px ${uiFont}`;
  ctx.fillStyle = "rgba(245,246,239,0.75)";
  ctx.fillText(brand, size / 2, size - 100);

  return canvas.toDataURL("image/png");
}

export async function shareOrDownloadImage(dataUrl: string, filename: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  if (typeof navigator !== "undefined" && navigator.canShare) {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "سكينة برو" });
        return "shared" as const;
      } catch {
        // user cancelled — fall through to download
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return "downloaded" as const;
}
