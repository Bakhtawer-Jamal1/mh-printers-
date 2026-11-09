import { ArrowUpRight, BadgePercent } from 'lucide-react'
import LocalProductCard from '../components/LocalProductCard.jsx'
import LocalPdfCatalog from '../components/LocalPdfCatalog.jsx'
import Reveal from '../components/Reveal.jsx'
import SpecialOfferBanner from '../components/SpecialOfferBanner.jsx'
import { whatsappUrl } from '../data/products.js'
import useDeletedSections from '../hooks/useDeletedSections.js'
import useLocalProducts from '../hooks/useLocalProducts.js'

export default function Offers() {
  const deletedSections = useDeletedSections()
  const { products, error: loadError } = useLocalProducts()
  const offers = products.filter((item) => item.type === 'offers')
  const sectionDeleted = deletedSections.includes('offers')

  return (
    <>
      {sectionDeleted ? (
        <section className="mx-auto max-w-[1180px] px-5 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">This section has been deleted.</h1>
        </section>
      ) : (
        <>
      <section className="border-b border-line bg-[#eeefeb] py-14 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5">
          <Reveal>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-teal">MH PRINTERS</span>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Current printing<br />
              <em className="font-serif font-normal not-italic text-blue">offers.</em>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              Offers and discounts change. Contact MH Printers for the latest confirmed details.
            </p>
          </Reveal>
        </div>
      </section>

      <SpecialOfferBanner />

      <section className="mx-auto max-w-[1180px] px-5 py-14">
        {loadError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
        {offers.filter((offer) => offer.pages?.length).map((offer) => <LocalPdfCatalog key={offer.id} product={offer} />)}
        {offers.some((offer) => !offer.pages?.length) && (
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.filter((offer) => !offer.pages?.length).map((offer, index) => <LocalProductCard key={offer.id} product={offer} index={index} />)}
          </div>
        )}
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-blue/15 bg-gradient-to-br from-blue/10 via-white to-teal/10 px-6 py-12 text-center shadow-lg sm:px-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue to-teal text-white shadow-lg">
              <BadgePercent size={26} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Ask about current offers</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              We do not list unconfirmed discounts or sample bundle prices. Message us to check what is available for your print or packaging order.
            </p>
            <a
              href={whatsappUrl('Assalam-o-alaikum! Please share MH Printers’ current offers for printing and packaging.')}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12356d] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue/20 transition hover:-translate-y-0.5 hover:bg-[#0d615c]"
            >
              Message MH Printers <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>
        </>
      )}
    </>
  )
}
