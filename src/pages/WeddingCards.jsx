import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import LocalProductCard from '../components/LocalProductCard.jsx'
import LocalPdfCatalog from '../components/LocalPdfCatalog.jsx'
import Reveal from '../components/Reveal.jsx'
import WeddingPdfCatalog from '../components/WeddingPdfCatalog.jsx'
import WeddingSectionMenu from '../components/WeddingSectionMenu.jsx'
import { whatsappUrl } from '../data/products.js'
import { customisationPdfCatalogs, weddingPdfCatalogs, weddingSections } from '../data/wedding.js'
import useDeletedSections from '../hooks/useDeletedSections.js'
import useHiddenWeddingCards from '../hooks/useHiddenWeddingCards.js'
import useLocalProducts from '../hooks/useLocalProducts.js'

const pageContent = {
  custom: {
    eyebrow: 'MADE PERSONAL',
    title: 'Customise your wedding cards.',
    copy: 'Share your wording, colours and preferred style. Browse the available designs, or ask us to create something just for you.',
  },
  fancy: {
    eyebrow: 'A LITTLE EXTRA MAGIC',
    title: 'Fancy wedding cards.',
    copy: 'Explore statement invitations and refined designs for a celebration worth remembering.',
  },
  normal: {
    eyebrow: 'TIMELESS BY DESIGN',
    title: 'Normal wedding cards.',
    copy: 'Browse the original simple-card designs straight from our printed catalogs.',
  },
  offer: {
    eyebrow: 'LIMITED-TIME COLLECTION',
    title: 'Wedding card special offers.',
    copy: 'See the latest wedding card deals. New offers and product details can be added from the local admin panel.',
  },
}

export function WeddingCardsHome() {
  const deletedSections = useDeletedSections()
  const { products, error: loadError } = useLocalProducts()
  const uploadedWeddingProducts = products.filter((product) => product.type === 'wedding')
  const visibleWeddingSections = weddingSections.filter((section) => !deletedSections.includes(section.id))
  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        {loadError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
        <div className="mb-4 flex justify-end">
          <WeddingSectionMenu />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleWeddingSections.map((section, index) => (
            <Reveal key={section.id} delay={index * 70}>
              <Link to={section.path} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue/15 to-teal/15">
                  {section.image && <img src={section.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-[#08234f]/75 text-amber-200 shadow-lg backdrop-blur-md">
                    <Sparkles size={19} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{section.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal">
                  Browse designs <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {uploadedWeddingProducts.some((product) => product.pages?.length) && (
          <div className="mt-10 space-y-8">
            {uploadedWeddingProducts.filter((product) => product.pages?.length).map((product) => (
              <LocalPdfCatalog key={product.id} product={product} />
            ))}
          </div>
        )}
        {uploadedWeddingProducts.some((product) => !product.pages?.length) && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedWeddingProducts.filter((product) => !product.pages?.length).map((product, index) => (
              <LocalProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export function WeddingCategory({ category }) {
  const deletedSections = useDeletedSections()
  const hiddenCards = useHiddenWeddingCards()
  const content = pageContent[category]
  const { products: uploadedProducts, error: loadError } = useLocalProducts()
  const localProducts = uploadedProducts.filter((item) => item.type === category)

  const sectionDeleted = deletedSections.includes('wedding') || deletedSections.includes(category)
  const customPdfs = category === 'custom' && !sectionDeleted ? customisationPdfCatalogs : []
  const catalogs = sectionDeleted
    ? []
    : (weddingPdfCatalogs[category] ?? []).map((catalog) => ({
      ...catalog,
      pages: catalog.pages.filter((card) => !(hiddenCards[catalog.id] ?? []).includes(card.pdfPage)),
    }))

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#eeefeb] py-14 sm:py-16">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1180px] items-start justify-between gap-4 px-5">
          <Reveal>
            <Link to="/wedding-cards" className="text-xs font-semibold text-teal hover:text-blue">
              Wedding cards / All styles
            </Link>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-teal">{content.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{content.title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{content.copy}</p>
          </Reveal>
          <WeddingSectionMenu />
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        {loadError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
        {customPdfs.map((catalog) => <WeddingPdfCatalog key={catalog.id} catalog={catalog} />)}
        {catalogs.map((catalog) => <WeddingPdfCatalog key={catalog.id} catalog={catalog} />)}
        {localProducts.filter((product) => product.pages?.length).map((product) => (
          <LocalPdfCatalog key={product.id} product={product} />
        ))}
        {localProducts.some((product) => !product.pages?.length) && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {localProducts.filter((product) => !product.pages?.length).map((product, index) => <LocalProductCard key={product.id} product={product} index={index} />)}
          </div>
        )}
        {!catalogs.length && !customPdfs.length && !localProducts.length && !loadError && (
          <Reveal>
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
              <Sparkles className="mx-auto text-teal" size={24} />
              <h2 className="mt-4 font-display text-xl font-semibold text-ink">Let us help you find the right card</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Tell us about your event and we’ll share the available designs and options with you.
              </p>
              <a href={whatsappUrl('Assalam-o-alaikum! Please share your wedding card designs and current offers.')} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-teal">
                Ask about wedding cards
              </a>
            </div>
          </Reveal>
        )}
      </section>
    </>
  )
}
