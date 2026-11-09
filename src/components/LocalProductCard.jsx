import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Image as ImageIcon, ZoomIn } from 'lucide-react'
import { whatsappUrl } from '../data/products.js'
import Reveal from './Reveal.jsx'
import ImageLightbox from './ImageLightbox.jsx'

export default function LocalProductCard({ product, index = 0 }) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const closePreview = useCallback(() => setPreviewOpen(false), [])
  const imageUrl = useMemo(
    () => product.imageUrl || (product.imageFile ? URL.createObjectURL(product.imageFile) : ''),
    [product.imageFile, product.imageUrl]
  )
  const pdfUrl = useMemo(
    () => product.pdfUrl || (product.pdfFile ? URL.createObjectURL(product.pdfFile) : ''),
    [product.pdfFile, product.pdfUrl]
  )

  useEffect(() => {
    return () => {
      if (product.imageFile && imageUrl) URL.revokeObjectURL(imageUrl)
      if (product.pdfFile && pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [imageUrl, pdfUrl, product.imageFile, product.pdfFile])

  const message = `Assalam-o-alaikum! I am interested in ${product.name}. Please share details and a quotation.`

  return (
    <Reveal delay={Math.min(index, 6) * 70} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-line/40">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              aria-label={`View larger image of ${product.name}`}
              aria-haspopup="dialog"
              aria-expanded={previewOpen}
              className="group/image relative block h-full w-full cursor-zoom-in text-left"
            >
              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-105" />
              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-md backdrop-blur transition-opacity group-hover/image:opacity-100">
                <ZoomIn size={17} />
              </span>
            </button>
          ) : (
            <div className="grid h-full place-items-center text-muted">
              <ImageIcon size={34} aria-hidden="true" />
            </div>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={!product.pdfUrl ? product.pdfName || `${product.name}.pdf` : undefined}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-md"
            >
              <ArrowDownToLine size={14} /> PDF
            </a>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal">{product.unit || product.category || product.type || 'Design'}</p>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">{product.name}</h2>
          {product.description && <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>}
          <div className="mt-auto flex justify-end border-t border-line pt-4">
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal"
            >
              Enquire <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </article>
      {previewOpen && imageUrl && (
        <ImageLightbox src={imageUrl} alt={product.name} onClose={closePreview} />
      )}
    </Reveal>
  )
}
