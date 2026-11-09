import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ZoomIn } from 'lucide-react'
import { whatsappUrl } from '../data/products.js'
import ImageLightbox from './ImageLightbox.jsx'

/* -------------------------------------------------------------------------- */
/*  Product card (scroll-reveal hook + component — sab ek hi file mein)        */
/* -------------------------------------------------------------------------- */
export default function ProductCard({ product, eager = false, index = 0 }) {
  const message = `Assalam-o-alaikum! I am interested in ${product.name}. Please share details and a quotation.`

  /* ----------------------------- scroll reveal ---------------------------- */
  const ref = useRef(null)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined'
  )
  const [imgLoaded, setImgLoaded] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const closePreview = useCallback(() => setPreviewOpen(false), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* ------------------------------ helpers -------------------------------- */
  const delay = Math.min(index, 8) * 80
  const at = (n) => ({ transitionDelay: `${delay + n * 70}ms` })

  return (
    /* ---------- entrance wrapper (delay lives here so hover stays snappy) -- */
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`h-full transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        inView ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'
      }`}
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line/70 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink/10 hover:ring-teal/40">
        {/* top accent bar — sweeps in from the left on hover */}
        <span className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-teal via-teal to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

        {/* ------------------------------- image ------------------------------ */}
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          aria-label={`View larger image of ${product.name}`}
          aria-haspopup="dialog"
          aria-expanded={previewOpen}
          className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-line/40 text-left"
        >
          {/* skeleton shimmer while loading */}
          <span
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-line/60 via-line/20 to-line/60 transition-opacity duration-700 ${
              imgLoaded ? 'opacity-0' : 'animate-pulse opacity-100'
            }`}
          />

          <img
            src={product.image}
            alt={product.name}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:rotate-[.6deg] group-hover:scale-110 ${
              imgLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-sm'
            }`}
          />

          {/* dark gradient rises on hover */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* glossy shine sweep */}
          <span className="pointer-events-none absolute left-[-60%] top-0 h-full w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-[900ms] ease-out group-hover:left-[120%]" />

          {/* badge — pops in after the card lands */}
          {product.badge && (
            <span
              style={at(2)}
              className={`absolute left-2.5 top-2.5 rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-500 ease-out ${
                inView ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-90 opacity-0'
              }`}
            >
              {product.badge}
            </span>
          )}

          {/* corner arrow — drops + spins in on hover */}
          <span className="absolute right-2.5 top-2.5 grid h-8 w-8 -translate-y-3 scale-75 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-md backdrop-blur transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            <ZoomIn
              size={16}
              className="transition-transform duration-500 group-hover:scale-110"
            />
          </span>
        </button>

        {/* ------------------------------- body ------------------------------- */}
        <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
          <p
            style={at(1)}
            className={`text-[9px] font-semibold uppercase tracking-[.14em] text-muted/80 transition-all duration-500 ease-out ${
              inView ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            }`}
          >
            {product.category}
          </p>

          <div className="flex items-start justify-between gap-2">
            <h3
              style={at(2)}
              className={`line-clamp-2 text-[13px] font-semibold leading-snug transition-all duration-500 ease-out group-hover:text-teal sm:text-sm ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              {product.name}
            </h3>

          </div>

          {/* ------------------------------ footer ---------------------------- */}
          <div
            style={at(4)}
            className={`mt-auto flex items-center justify-between border-t border-line/70 pt-2.5 transition-all duration-500 ease-out ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <small className="text-[10px] text-muted transition-colors duration-300 group-hover:text-ink/70">
              {product.unit}
            </small>

            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="group/btn relative inline-flex items-center gap-1 overflow-hidden rounded-full bg-ink px-3 py-1.5 text-[10px] font-medium text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-95"
            >
              {/* fill sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-teal/80 transition-transform duration-500 ease-out group-hover/btn:translate-x-0" />

              <span className="relative z-10 inline-flex items-center gap-1 transition-all duration-300 group-hover/btn:gap-2">
                Enquire
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:rotate-45"
                />
              </span>
            </a>
          </div>
        </div>
      </article>
      {previewOpen && (
        <ImageLightbox src={product.image} alt={product.name} onClose={closePreview} />
      )}
    </div>
  )
}