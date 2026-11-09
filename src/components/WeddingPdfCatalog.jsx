import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react'
import ImageLightbox from './ImageLightbox.jsx'

const PAGE_SIZE = 12

export default function WeddingPdfCatalog({ catalog }) {
  const [page, setPage] = useState(0)
  const [selectedCard, setSelectedCard] = useState(null)
  const pageCount = Math.ceil(catalog.pages.length / PAGE_SIZE)
  const visibleCards = catalog.pages.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const closePreview = useCallback(() => setSelectedCard(null), [])

  return (
    <section className="mb-12 last:mb-0" aria-labelledby={`${catalog.id}-heading`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id={`${catalog.id}-heading`} className="font-display text-2xl font-semibold text-ink">
            {catalog.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Original catalog card previews · {catalog.pages.length} cards shown
          </p>
          <p className="mt-1 text-xs text-muted">
            Card images hidden in the gallery may still appear in the original PDF.
          </p>
        </div>
        <a
          href={catalog.pdf}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#15396f] to-[#0d615c] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue/20 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <FileText size={16} aria-hidden="true" />
          Open original PDF
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visibleCards.map((card) => {
          const alt = `${catalog.title}, original PDF page ${card.pdfPage}`
          return (
            <button
              key={card.pdfPage}
              type="button"
              onClick={() => setSelectedCard({ ...card, alt })}
              aria-label={`Preview card from page ${card.pdfPage}`}
              className="group overflow-hidden rounded-2xl border border-blue/20 bg-gradient-to-br from-blue/10 via-teal/10 to-amber-100/70 p-2 text-left shadow-md shadow-blue/10 transition duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg hover:shadow-teal/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              <span className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/80">
                <img
                  src={card.image}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.025]"
                />
              </span>
              <span className="block px-1 pb-1 pt-3 text-xs font-semibold text-ink">
                PDF page {card.pdfPage}
              </span>
              <span className="block px-1 pb-1 text-[11px] text-muted">Tap to enlarge</span>
            </button>
          )
        })}
      </div>

      {pageCount > 1 && (
        <nav className="mt-5 flex items-center justify-between gap-3" aria-label={`${catalog.title} pagination`}>
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className="inline-flex items-center gap-1 rounded-full bg-[#15396f] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue/20 transition hover:bg-[#0d615c] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft size={17} aria-hidden="true" /> Previous
          </button>
          <span className="text-center text-xs text-muted" aria-live="polite">
            Page {page + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            className="inline-flex items-center gap-1 rounded-full bg-[#0d615c] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal/20 transition hover:bg-[#15396f] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next <ChevronRight size={17} aria-hidden="true" />
          </button>
        </nav>
      )}

      {selectedCard && (
        <ImageLightbox
          src={selectedCard.image}
          alt={selectedCard.alt}
          onClose={closePreview}
        />
      )}
    </section>
  )
}
