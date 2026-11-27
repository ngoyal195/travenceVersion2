import * as THREE from "three";

// Browser-only helpers. These are only ever imported from components that are
// loaded with next/dynamic (ssr: false).

const bezierTo = (ctx, w, h, s, e, c1, c2) => {
  ctx.beginPath();
  ctx.moveTo(s[0] * w, s[1] * h);
  ctx.bezierCurveTo(c1[0] * w, c1[1] * h, c2[0] * w, c2[1] * h, e[0] * w, e[1] * h);
  ctx.stroke();
};

// Draws a rib with a soft raised profile (three stacked strokes).
const rib = (ctx, w, h, k, s, e, c1, c2) => {
  const passes = [
    [11 * k, "#8e8e8e"],
    [7 * k, "#b0b0b0"],
    [3.2 * k, "#dadada"],
  ];
  for (const [lw, col] of passes) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = col;
    bezierTo(ctx, w, h, s, e, c1, c2);
  }
};

// Height map approximating the Atlantis swirl: ribs sweep down-right across the
// upper half, a horizontal band sits just below the middle, and the lower ribs
// swoop toward the compass emblem at the bottom right. Matched by eye to the
// front-on grey photograph.
function drawHeightMap(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const k = w / 1024;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Upper half
  const NU = 34;
  for (let i = 0; i < NU; i++) {
    const t = i / (NU - 1);
    const s = t < 0.5 ? [0.97 - t * 2 * 0.94, 0.0] : [0.0, (t - 0.5) * 2 * 0.44];
    const e = [1.0, 0.04 + t * 0.41];
    const dx = e[0] - s[0];
    const dy = e[1] - s[1];
    rib(ctx, w, h, k, s, e, [s[0] + dx * 0.3, s[1] + dy * 0.85], [e[0] - dx * 0.4, e[1] - dy * 0.12]);
  }

  // Lower half
  const NL = 38;
  for (let i = 0; i < NL; i++) {
    const t = i / (NL - 1);
    const s = [0.0, 0.525 + t * 0.36];
    const e = t < 0.5 ? [1.0, 0.58 + t * 2 * 0.28] : [1 - (t - 0.5) * 2 * 0.82, 0.985];
    const dx = e[0] - s[0];
    const dy = e[1] - s[1];
    rib(ctx, w, h, k, s, e, [s[0] + dx * 0.45, s[1] + dy * 0.05], [e[0] - dx * 0.25, e[1] - dy * 0.5]);
  }

  // Horizontal centre band
  ctx.lineWidth = 18 * k;
  ctx.strokeStyle = "#9c9c9c";
  ctx.beginPath();
  ctx.moveTo(0, 0.5 * h);
  ctx.lineTo(w, 0.5 * h);
  ctx.stroke();
  ctx.lineWidth = 8 * k;
  ctx.strokeStyle = "#c6c6c6";
  ctx.beginPath();
  ctx.moveTo(0, 0.5 * h);
  ctx.lineTo(w, 0.5 * h);
  ctx.stroke();

  // Compass emblem (bottom right): clear the ribs, then emboss ring + star.
  const cx = 0.85 * w;
  const cy = 0.89 * h;
  const r = 0.13 * w;
  ctx.fillStyle = "#808080";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#b4b4b4";
  ctx.lineWidth = 9 * k;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#dcdcdc";
  ctx.lineWidth = 3 * k;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#a8a8a8";
  ctx.lineWidth = 4 * k;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#d2d2d2";
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const rad = i % 4 === 0 ? 0.68 : i % 4 === 2 ? 0.36 : 0.12;
    const x = cx + Math.cos(a) * r * rad;
    const y = cy + Math.sin(a) * r * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Fade ribs to flat toward the edges, where the shell rounds over and the
  // planar projection would otherwise smear the pattern.
  const fade = (x0, y0, x1, y1, rect) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "rgba(128,128,128,1)");
    g.addColorStop(1, "rgba(128,128,128,0)");
    ctx.fillStyle = g;
    ctx.fillRect(...rect);
  };
  const fx = 0.085 * w;
  const fy = 0.055 * h;
  fade(0, 0, fx, 0, [0, 0, fx, h]);
  fade(w, 0, w - fx, 0, [w - fx, 0, fx, h]);
  fade(0, 0, 0, fy, [0, 0, w, fy]);
  fade(0, h, 0, h - fy, [0, h - fy, w, fy]);

  return canvas;
}

function heightToNormalTexture(src, strength) {
  const w = src.width;
  const h = src.height;
  const data = src.getContext("2d").getImageData(0, 0, w, h).data;
  const H = (x, y) => {
    const xx = x < 0 ? 0 : x >= w ? w - 1 : x;
    const yy = y < 0 ? 0 : y >= h ? h - 1 : y;
    return data[(yy * w + xx) * 4] / 255;
  };

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);
  const d = img.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx =
        H(x + 1, y - 1) + 2 * H(x + 1, y) + H(x + 1, y + 1) -
        (H(x - 1, y - 1) + 2 * H(x - 1, y) + H(x - 1, y + 1));
      const dy =
        H(x - 1, y + 1) + 2 * H(x, y + 1) + H(x + 1, y + 1) -
        (H(x - 1, y - 1) + 2 * H(x, y - 1) + H(x + 1, y - 1));
      // canvas y runs down, texture v runs up
      let nx = -dx * strength;
      let ny = dy * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;
      const i = (y * w + x) * 4;
      d[i] = (nx * 0.5 + 0.5) * 255;
      d[i + 1] = (ny * 0.5 + 0.5) * 255;
      d[i + 2] = (nz * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(out);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createShellNormalMap(lite) {
  const w = lite ? 640 : 1024;
  const h = lite ? 1000 : 1600;
  const height = drawHeightMap(w, h);
  return heightToNormalTexture(height, lite ? 2.4 : 2.0);
}

// "TRAVENCE" woven-label style plate seen on the centre band in the photos.
export function createBrandPlateTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0b0f14";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 60px Inter, system-ui, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "6px";
  ctx.fillText("TRAVENCE", 256, 68);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
