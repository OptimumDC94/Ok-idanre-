import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // Color palette
  const bgR = 6, bgG = 78, bgB = 59; // #064e3b deep emerald
  const hillR = 4, hillG = 120, hillB = 87; // #047857
  const goldR = 245, goldG = 158, goldB = 11; // #f59e0b
  const whiteR = 255, whiteG = 255, whiteB = 255;

  // Uncompressed RGBA scanlines (width * 4 + 1 filter byte per row)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.35 : 0.42);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: deep emerald
      let r = bgR;
      let g = bgG;
      let b = bgB;
      let a = 255;

      // Outer squircle or circular frame for non-maskable
      if (!isMaskable) {
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
        if (cornerDist > width * 0.48) {
          // rounded corners
          const cxDiff = Math.abs(dx) - width * 0.36;
          const cyDiff = Math.abs(dy) - height * 0.36;
          if (cxDiff > 0 && cyDiff > 0 && Math.sqrt(cxDiff * cxDiff + cyDiff * cyDiff) > width * 0.12) {
            a = 0;
          }
        }
      }

      // Sun disc
      const sunDist = Math.sqrt((x - cx) * (x - cx) + (y - cy * 0.75) * (y - cy * 0.75));
      if (sunDist < width * 0.18) {
        r = goldR;
        g = goldG;
        b = goldB;
      }

      // Left Hill
      const hill1PeakX = width * 0.35;
      const hill1PeakY = height * 0.45;
      if (y > hill1PeakY && y > height * 0.45 + Math.abs(x - hill1PeakX) * 0.9 && y < height * 0.8) {
        r = hillR;
        g = hillG;
        b = hillB;
      }

      // Center High Peak (Oke Idanre)
      const hill2PeakX = width * 0.58;
      const hill2PeakY = height * 0.32;
      if (y > hill2PeakY && y > height * 0.32 + Math.abs(x - hill2PeakX) * 1.1 && y < height * 0.8) {
        r = 2;
        g = 95;
        b = 70; // #025f46
      }

      // Gold bottom badge area
      if (y >= height * 0.75 && y <= height * 0.88 && Math.abs(dx) < width * 0.38) {
        r = goldR;
        g = goldG;
        b = goldB;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Deflate data
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate all mandatory PWA and Apple assets
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('PWA icon assets generated successfully in public/');
