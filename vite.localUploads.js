import { execFile as execFileCallback } from 'node:child_process'
import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, open, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const execFile = promisify(execFileCallback)
const maximumImageSize = 20 * 1024 * 1024
const maximumPdfSize = 75 * 1024 * 1024
const maximumPdfPages = 200
const imageTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
  ['image/gif', '.gif'],
])
const allowedTypes = new Set([
  'ecommerce', 'paper', 'bags', 'stickers', 'cards', 'wedding', 'gift', 'accessories',
  'custom', 'fancy', 'normal', 'offer', 'offers', 'boxes',
])

function sendJson(response, status, value) {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.setHeader('x-content-type-options', 'nosniff')
  response.end(JSON.stringify(value))
}

function isLoopback(address = '') {
  return address === '127.0.0.1' || address === '::1' || address.startsWith('::ffff:127.')
}

function isSameOriginLoopbackRequest(request) {
  const origin = request.headers.origin
  const host = request.headers.host
  if (typeof origin !== 'string' || typeof host !== 'string') return false
  try {
    const originUrl = new URL(origin)
    const hostUrl = new URL(`http://${host}`)
    const hostname = hostUrl.hostname.toLowerCase().replace(/^\[|\]$/g, '')
    return originUrl.protocol === 'http:' && originUrl.origin === hostUrl.origin &&
      ['localhost', '127.0.0.1', '::1'].includes(hostname)
  } catch {
    return false
  }
}

function imageSignatureMatches(buffer, contentType) {
  if (contentType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (contentType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (contentType === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
  if (contentType === 'image/gif') return ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))
  if (contentType === 'image/avif') return buffer.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(buffer.toString('ascii', 8, 12))
  return false
}

function readProductMetadata(request) {
  const header = request.headers['x-product-metadata']
  if (typeof header !== 'string' || header.length > 12_000) {
    throw new Error('Product details are missing or too long.')
  }
  let metadata
  try {
    metadata = JSON.parse(decodeURIComponent(header))
  } catch {
    throw new Error('Product details could not be read.')
  }
  if (
    typeof metadata.id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(metadata.id) ||
    typeof metadata.name !== 'string' ||
    !metadata.name.trim() ||
    metadata.name.length > 100 ||
    !allowedTypes.has(metadata.type)
  ) {
    throw new Error('Product details are invalid.')
  }
  return {
    id: metadata.id,
    name: metadata.name.trim(),
    type: metadata.type,
    category: typeof metadata.category === 'string' ? metadata.category.slice(0, 100) : '',
    unit: typeof metadata.unit === 'string' ? metadata.unit.slice(0, 40) : '',
    description: typeof metadata.description === 'string' ? metadata.description.slice(0, 500) : '',
    createdAt: Number.isFinite(metadata.createdAt) ? metadata.createdAt : Date.now(),
  }
}

async function readManifest(manifestPath) {
  try {
    const saved = JSON.parse(await readFile(manifestPath, 'utf8'))
    if (!Array.isArray(saved)) throw new Error('The local uploads catalog must contain a JSON array.')
    return saved
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeManifest(manifestPath, items) {
  const temporaryPath = `${manifestPath}.${randomUUID()}.tmp`
  await writeFile(temporaryPath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
  await rename(temporaryPath, manifestPath)
}

async function updateManifest(manifestPath, update) {
  const items = await readManifest(manifestPath)
  const nextItems = update(items)
  await writeManifest(manifestPath, nextItems)
  return nextItems
}

function parsePageCount(pdfInfo) {
  const pageCount = Number(pdfInfo.match(/^Pages:\s+(\d+)/m)?.[1])
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > maximumPdfPages) {
    throw new Error(`PDFs must contain between 1 and ${maximumPdfPages} pages.`)
  }
  return pageCount
}

export default function localUploadsPlugin() {
  return {
    name: 'mh-printers-local-public-uploads',
    configureServer(server) {
      const publicDirectory = path.resolve(server.config.root, 'public')
      const uploadDirectory = path.join(publicDirectory, 'uploads')
      const manifestPath = path.join(uploadDirectory, 'catalog.json')

      server.middlewares.use('/uploads', (request, response, next) => {
        const serveUpload = async () => {
          if (request.method !== 'GET' && request.method !== 'HEAD') return next()
          const route = new URL(request.url, 'http://localhost')
          let filePath
          let contentType

          if (route.pathname === '/catalog.json') {
            filePath = manifestPath
            contentType = 'application/json; charset=utf-8'
          } else {
            const match = route.pathname.match(
              /^\/([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/(original\.pdf|image\.(jpg|png|webp|avif|gif)|page-\d+\.jpg)$/i
            )
            if (!match) return next()
            const [, id, filename] = match
            filePath = path.join(uploadDirectory, id, filename)
            contentType = filename.endsWith('.pdf') ? 'application/pdf'
              : filename.endsWith('.png') ? 'image/png'
                : filename.endsWith('.webp') ? 'image/webp'
                  : filename.endsWith('.avif') ? 'image/avif'
                    : filename.endsWith('.gif') ? 'image/gif'
                      : 'image/jpeg'
          }

          try {
            const fileInfo = await stat(filePath)
            response.statusCode = 200
            response.setHeader('content-type', contentType)
            response.setHeader('x-content-type-options', 'nosniff')
            response.setHeader('content-length', fileInfo.size)
            response.setHeader('cache-control', 'no-store')
            if (request.method === 'HEAD') {
              response.end()
              return
            }
            createReadStream(filePath).pipe(response)
          } catch (error) {
            if (error.code === 'ENOENT') {
              response.statusCode = 404
              response.end('Uploaded file not found.')
              return
            }
            next(error)
          }
        }
        serveUpload().catch(next)
      })

      server.middlewares.use('/api/local-uploads', (request, response, next) => {
        const handle = async () => {
          if (!isLoopback(request.socket.remoteAddress)) {
            sendJson(response, 403, { error: 'Local uploads are only available from this computer.' })
            return
          }
          if (['POST', 'DELETE'].includes(request.method) && !isSameOriginLoopbackRequest(request)) {
            sendJson(response, 403, { error: 'Cross-origin local upload requests are not allowed.' })
            request.resume()
            return
          }

          const route = new URL(request.url, 'http://localhost')
          if (request.method === 'GET' && route.pathname === '/') {
            sendJson(response, 200, await readManifest(manifestPath))
            return
          }

          const match = route.pathname.match(/^\/([0-9a-f-]{36})\/(image|pdf)$/i)
          if (!match) {
            sendJson(response, 404, { error: 'Upload route not found.' })
            return
          }
          const [, id, kind] = match
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
            sendJson(response, 400, { error: 'Upload identifier is invalid.' })
            return
          }

          const itemDirectory = path.join(uploadDirectory, id)
          if (request.method === 'DELETE') {
            const existing = (await readManifest(manifestPath)).some((item) => item.id === id)
            if (!existing) {
              sendJson(response, 404, { error: 'Uploaded item was not found.' })
              return
            }
            await rm(itemDirectory, { recursive: true, force: true })
            const items = await updateManifest(manifestPath, (current) => current.filter((item) => item.id !== id))
            sendJson(response, 200, { deleted: id, count: items.length })
            return
          }
          if (request.method !== 'POST') {
            sendJson(response, 405, { error: 'Method not allowed.' })
            return
          }

          let metadata
          let targetPath
          let temporaryPath
          try {
            metadata = readProductMetadata(request)
            if (metadata.id !== id) throw new Error('Upload identifier does not match product details.')
            const contentType = String(request.headers['content-type'] ?? '').split(';')[0].toLowerCase()
            const extension = kind === 'image' ? imageTypes.get(contentType) : '.pdf'
            if (!extension) throw new Error(kind === 'image' ? 'Unsupported image type.' : 'PDF files must be uploaded as application/pdf.')
            const maximumSize = kind === 'image' ? maximumImageSize : maximumPdfSize
            const contentLength = Number(request.headers['content-length'])
            if (Number.isFinite(contentLength) && contentLength > maximumSize) {
              sendJson(response, 413, { error: kind === 'image' ? 'Images must be 20 MB or smaller.' : 'PDF files must be 75 MB or smaller.' })
              request.resume()
              return
            }

            await mkdir(itemDirectory, { recursive: true })
            targetPath = path.join(itemDirectory, kind === 'image' ? `image${extension}` : 'original.pdf')
            temporaryPath = `${targetPath}.${randomUUID()}.tmp`
            let bytes = 0
            const sizeLimit = new Transform({
              transform(chunk, encoding, callback) {
                bytes += chunk.length
                if (bytes > maximumSize) callback(new Error(kind === 'image' ? 'Images must be 20 MB or smaller.' : 'PDF files must be 75 MB or smaller.'))
                else callback(null, chunk)
              },
            })
            await pipeline(request, sizeLimit, createWriteStream(temporaryPath, { flags: 'wx' }))

            if (kind === 'image') {
              const imageHandle = await open(temporaryPath, 'r')
              try {
                const signature = Buffer.alloc(16)
                const { bytesRead } = await imageHandle.read(signature, 0, signature.length, 0)
                if (!imageSignatureMatches(signature.subarray(0, bytesRead), contentType)) {
                  throw new Error('The uploaded image contents do not match the declared image type.')
                }
              } finally {
                await imageHandle.close()
              }
            }

            let itemFiles = kind === 'image'
              ? { imageUrl: `/uploads/${id}/${path.basename(targetPath)}` }
              : { pdfName: decodeURIComponent(String(request.headers['x-file-name'] ?? '')).slice(0, 200) }

            if (kind === 'pdf') {
              const fileHandle = await open(temporaryPath, 'r')
              try {
                const header = Buffer.alloc(1024)
                const { bytesRead } = await fileHandle.read(header, 0, header.length, 0)
                if (!header.subarray(0, bytesRead).includes(Buffer.from('%PDF-'))) {
                  throw new Error('The uploaded file is not a valid PDF.')
                }
              } finally {
                await fileHandle.close()
              }
              await rename(temporaryPath, targetPath)
              temporaryPath = null
              const { stdout: pdfInfo } = await execFile('pdfinfo', [targetPath], { timeout: 30_000, maxBuffer: 1024 * 1024 })
              const pageCount = parsePageCount(pdfInfo)
              await execFile('pdftoppm', [
                '-jpeg', '-jpegopt', 'quality=82', '-scale-to', '900', '-forcenum',
                targetPath, path.join(itemDirectory, 'page'),
              ], { timeout: 180_000, maxBuffer: 2 * 1024 * 1024 })
              const pageFiles = (await readdir(itemDirectory))
                .filter((name) => /^page-\d+\.jpg$/.test(name))
                .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
              if (pageFiles.length !== pageCount) {
                throw new Error('Could not generate previews for every PDF page.')
              }
              itemFiles = {
                ...itemFiles,
                pdfUrl: `/uploads/${id}/original.pdf`,
                pages: pageFiles.map((name, index) => ({
                  pdfPage: index + 1,
                  image: `/uploads/${id}/${name}`,
                })),
              }
            } else {
              await rename(temporaryPath, targetPath)
              temporaryPath = null
            }

            const manifest = await updateManifest(manifestPath, (items) => {
              const previous = items.find((item) => item.id === id) ?? {}
              const savedItem = {
                ...previous,
                ...metadata,
                ...itemFiles,
                source: 'public',
              }
              return [...items.filter((item) => item.id !== id), savedItem]
            })
            sendJson(response, 201, manifest.find((item) => item.id === id))
          } finally {
            if (temporaryPath) await rm(temporaryPath, { force: true })
          }
        }

        handle().catch((error) => {
          if (!response.headersSent) sendJson(response, 400, { error: error.message || 'Could not save this upload.' })
          else next(error)
        })
      })
    },
  }
}
