// Gera os PNGs do PWA sem depender de nenhuma lib de imagem.
// Desenha o mesmo mark do favicon (quadrado navy + moldura branca + divisor ciano)
// pixel a pixel e codifica um PNG RGBA válido usando só node:zlib.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(OUT, { recursive: true })

const BG = [13, 43, 110, 255] // #0D2B6E
const WHITE = [255, 255, 255, 255]
const CYAN = [0, 174, 239, 255] // #00AEEF

function insideRounded(x, y, n, r) {
  const cx = Math.min(Math.max(x, r), n - r)
  const cy = Math.min(Math.max(y, r), n - r)
  return Math.hypot(x - cx, y - cy) <= r
}

function draw(n, { maskable = false } = {}) {
  const buf = Buffer.alloc(n * n * 4) // RGBA, transparente
  const r = 0.22 * n
  // Moldura: mais recuada no maskable (respeita a safe zone central de 80%).
  const m = (maskable ? 0.34 : 0.3) * n
  const t = 0.045 * n
  const dividerW = 0.04 * n
  const cxBar = n / 2

  const set = (x, y, [rr, gg, bb, aa]) => {
    const i = (y * n + x) * 4
    buf[i] = rr
    buf[i + 1] = gg
    buf[i + 2] = bb
    buf[i + 3] = aa
  }

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // Fundo: quadrado inteiro no maskable; arredondado nos demais.
      if (maskable) set(x, y, BG)
      else if (insideRounded(x, y, n, r)) set(x, y, BG)

      const inFrameBox = x >= m && x <= n - m && y >= m && y <= n - m
      const inFrameHole = x >= m + t && x <= n - m - t && y >= m + t && y <= n - m - t
      if (inFrameBox && !inFrameHole) set(x, y, WHITE)

      // Divisor central (dentro da moldura) — detalhe ciano.
      if (Math.abs(x - cxBar) <= dividerW / 2 && y >= m && y <= n - m) set(x, y, CYAN)
    }
  }
  return buf
}

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return (~c) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

function encodePng(rgba, n) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(n, 0)
  ihdr.writeUInt32BE(n, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const stride = n * 4
  const raw = Buffer.alloc((stride + 1) * n)
  for (let y = 0; y < n; y++) {
    raw[y * (stride + 1)] = 0 // filtro none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const targets = [
  { file: 'pwa-192.png', size: 192 },
  { file: 'pwa-512.png', size: 512 },
  { file: 'pwa-512-maskable.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size, maskable } of targets) {
  const png = encodePng(draw(size, { maskable }), size)
  writeFileSync(join(OUT, file), png)
  console.log(`gerado public/${file} (${size}x${size})`)
}
