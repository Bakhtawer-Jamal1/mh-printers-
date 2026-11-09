import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Box, Gift, Layers3, NotebookPen, PackageCheck, Printer, Search, ShoppingBag, SlidersHorizontal, Sticker, X } from 'lucide-react'
import LocalProductCard from '../components/LocalProductCard.jsx'
import LocalPdfCatalog from '../components/LocalPdfCatalog.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { getLocalProductCategory } from '../data/localCatalog.js'
import { categories, categoryImages, products, whatsappUrl } from '../data/products.js'
import useDeletedSections from '../hooks/useDeletedSections.js'
import useLocalProducts from '../hooks/useLocalProducts.js'

const categoryIcons = {
  ecommerce: PackageCheck,
  paper: Box,
  bags: ShoppingBag,
  stickers: Sticker,
  cards: NotebookPen,
  wedding: Gift,
  gift: Gift,
  accessories: Layers3,
}

export default function Catalog() {
  const deletedSections = useDeletedSections()
  const [params] = useSearchParams()
  const [active, setActive] = useState(params.get('category') || 'All services')
  const [query, setQuery] = useState(params.get('search') || '')
  const { products: localProducts, error: loadError } = useLocalProducts()

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (active === 'All services' || p.category === active) &&
          (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().includes(query.trim().toLowerCase())
      ),
    [active, query]
  )

  const visibleServices = useMemo(
    () => categories.filter((service) => !deletedSections.includes(service.id)).filter((service) =>
      (active === 'All services' || service.name === active) &&
      `${service.name} ${service.note}`.toLowerCase().includes(query.trim().toLowerCase())
    ),
    [active, deletedSections, query]
  )

  const visibleLocalProducts = useMemo(
    () => localProducts.filter((product) =>
      product.type !== 'offers' &&
      (active === 'All services' || getLocalProductCategory(product) === active) &&
      `${product.name} ${getLocalProductCategory(product)} ${product.description || ''}`.toLowerCase().includes(query.trim().toLowerCase())
    ),
    [active, localProducts, query]
  )

  const filters = ['All services', ...categories.filter((c) => !deletedSections.includes(c.id)).map((c) => c.name)]
  const hasFilters = active !== 'All services' || query.trim() !== ''
  const resultCount = visibleProducts.length + visibleServices.length + visibleLocalProducts.length

  const reset = () => {
    setQuery('')
    setActive('All services')
  }

  return (
    <>
      {/* ============ PAGE HERO ============ */}
      <section className="relative overflow-hidden border-b border-line bg-[#eeefeb] py-14 sm:py-16">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />
        {/* grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #183238 1px, transparent 1px), linear-gradient(to bottom, #183238 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto max-w-[1180px] px-5">
          <Reveal direction="left" distance="-translate-x-4" duration={600}>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              THE MH CATALOG
            </span>
          </Reveal>

          <Reveal delay={120} duration={800} blur={3} scale={0.98}>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Find your brand's
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                finishing touch.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={240} blur={2}>
            <p className="mt-3 max-w-md text-sm text-muted">
              From everyday essentials to the big, beautiful unboxing moment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CATALOG ============ */}
      <section className="mx-auto max-w-[1180px] px-5 py-10 sm:py-14">
        {/* ---------- toolbar ---------- */}
        <div className="flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Reveal direction="left" distance="-translate-x-4">
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              MADE TO MAKE AN IMPRESSION
            </span>
            <p className="mt-1 text-xs text-muted">
              <span className="font-semibold text-ink">{resultCount}</span>{' '}
              matching services and products
            </p>
          </Reveal>

          <Reveal delay={120} direction="right" distance="translate-x-4">
            <label className="group flex w-full items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-muted shadow-sm transition-all duration-300 focus-within:border-teal focus-within:shadow-md focus-within:ring-4 focus-within:ring-teal/10 hover:border-teal/60 sm:w-72">
              <Search
                size={16}
                className="transition-transform duration-300 group-focus-within:scale-110 group-focus-within:text-teal"
              />
              <input
                aria-label="Search printing and packaging services"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the catalog"
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/70"
              />
              {/* clear button — appears when query non-empty */}
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className={`grid h-5 w-5 place-items-center rounded-full bg-line text-ink/60 transition-all duration-300 hover:bg-ink hover:text-white ${
                  query ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0'
                }`}
              >
                <X size={11} />
              </button>
            </label>
          </Reveal>
        </div>

        {/* active filter chip */}
        {hasFilters && (
          <Reveal direction="up" distance="translate-y-3" duration={500}>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">Active filters:</span>
              {active !== 'All services' && (
                <button
                  onClick={() => setActive('All services')}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 font-medium text-teal transition-all hover:bg-teal hover:text-white"
                >
                  {active}
                  <X size={11} className="transition-transform group-hover:rotate-90" />
                </button>
              )}
              {query.trim() && (
                <button
                  onClick={() => setQuery('')}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-blue/10 px-3 py-1 font-medium text-blue transition-all hover:bg-blue hover:text-white"
                >
                  "{query}"
                  <X size={11} className="transition-transform group-hover:rotate-90" />
                </button>
              )}
              <button
                onClick={reset}
                className="ml-1 text-[11px] text-muted underline-offset-4 transition hover:text-ink hover:underline"
              >
                Clear all
              </button>
            </div>
          </Reveal>
        )}

        <div className="mt-8 grid gap-7 md:grid-cols-[220px_1fr]">
          {/* ============ FILTERS SIDEBAR ============ */}
          <aside className="md:sticky md:top-24 md:self-start">
            <Reveal direction="left" distance="-translate-x-3">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-ink">
                <SlidersHorizontal
                  size={14}
                  className="text-teal transition-transform duration-300 group-hover:rotate-90"
                />
                Browse by category
              </div>
            </Reveal>

            <div className="flex flex-wrap gap-2 md:flex-col md:gap-1">
              {filters.map((name, i) => {
                const isActive = active === name
                const count =
                  name === 'All services'
                    ? categories.filter((service) => !deletedSections.includes(service.id)).length + products.length
                    : categories.filter((service) => service.name === name).length +
                      products.filter((p) => p.category === name).length +
                      localProducts.filter((product) => getLocalProductCategory(product) === name).length
                return (
                  <Reveal
                    key={name}
                    delay={Math.min(i * 40, 280)}
                    direction="left"
                    distance="-translate-x-2"
                    duration={500}
                  >
                    {name === 'Wedding Cards' ? (
                    <Link
                      to="/wedding-cards"
                      className={`group relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-full px-3.5 py-2 text-xs transition-all duration-300 md:rounded-lg md:px-3 ${
                        'bg-gradient-to-r from-blue/10 to-teal/10 text-ink hover:from-blue/15 hover:to-teal/15'
                      }`}
                    >
                      {/* hover slide accent (desktop) */}
                      <span className="pointer-events-none absolute inset-y-0 left-0 hidden w-[3px] origin-top scale-y-0 rounded-r bg-teal transition-transform duration-300 group-hover:scale-y-100 md:block md:group-data-[active=true]:scale-y-100" />

                      <span className="relative z-10 flex items-center gap-2 truncate">
                        <span
                          className={`hidden h-1.5 w-1.5 rounded-full transition-all duration-300 md:block ${
                            isActive
                              ? 'bg-teal scale-100'
                              : 'bg-muted/40 scale-75 group-hover:scale-100 group-hover:bg-teal/60'
                          }`}
                        />
                        <span className="truncate">{name}</span>
                      </span>

                      <span
                        className={`relative z-10 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums transition-colors ${
                          'bg-blue/10 text-blue'
                        }`}
                      >
                        {count}
                      </span>
                    </Link>
                    ) : (
                    <button
                      onClick={() => setActive(name)}
                      className={`group relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-full px-3.5 py-2 text-xs transition-all duration-300 md:rounded-lg md:px-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#15396f] to-[#0d615c] text-white shadow-md'
                          : 'bg-line/50 text-ink/70 hover:bg-line hover:text-ink md:bg-transparent md:hover:bg-line/40'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2 truncate">
                        <span className={`hidden h-1.5 w-1.5 rounded-full md:block ${isActive ? 'bg-amber-300' : 'bg-muted/40'}`} />
                        <span className="truncate">{name}</span>
                      </span>
                      <span className={`relative z-10 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-muted'}`}>
                        {count}
                      </span>
                    </button>
                    )}
                  </Reveal>
                )
              })}
            </div>

            {/* help card */}
            <Reveal delay={200} direction="up" distance="translate-y-4">
              <div className="glass-panel group relative mt-6 hidden overflow-hidden rounded-xl bg-[#ebe9e2] p-4 md:block">
                {/* top accent */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-teal to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                <b className="text-xs text-ink">Need something specific?</b>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                  Tell us what you're looking for and we'll point you in the
                  right direction.
                </p>
                <a
                  href={whatsappUrl(
                    'Assalam-o-alaikum! I need help finding a printing product.'
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-teal transition-all hover:gap-1.5 hover:text-blue"
                >
                  Ask us on WhatsApp
                  <span className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </div>
            </Reveal>
          </aside>

          {/* ============ RESULTS ============ */}
          <div>
            {loadError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
            {resultCount ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {visibleServices.map((service) => {
                  const Icon = categoryIcons[service.id] ?? Printer
                  const routeHref = service.id === 'wedding'
                    ? '/wedding-cards'
                    : ['ecommerce', 'paper'].includes(service.id)
                      ? '/big-boxes'
                      : null
                  const CardLink = routeHref ? Link : 'a'
                  const linkProps = routeHref
                    ? { to: routeHref }
                    : {
                        href: whatsappUrl(`Assalam-o-alaikum! Please share information about ${service.name}.`),
                        target: '_blank',
                        rel: 'noreferrer',
                      }
                  return (
                  <CardLink
                    key={service.id}
                    {...linkProps}
                    className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-blue/15 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
                  >
                    {categoryImages[service.id] ? (
                      <>
                        <img src={categoryImages[service.id]} alt={`${service.name} example`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#071a32]/95 via-[#071a32]/55 to-[#071a32]/15" />
                      </>
                    ) : (
                      <span className="absolute inset-0 bg-gradient-to-br from-blue/10 via-white to-teal/10" />
                    )}
                    <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-xl shadow-md ${categoryImages[service.id] ? 'border border-white/25 bg-white/15 text-white backdrop-blur-sm' : 'bg-gradient-to-br from-blue to-teal text-white'}`}>
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <h2 className="relative z-10 mt-auto font-display text-base font-semibold text-white">{service.name}</h2>
                    <p className="relative z-10 mt-1 text-xs leading-relaxed text-white/80">{service.note}</p>
                    <span className="relative z-10 inline-flex items-center gap-1 pt-4 text-xs font-semibold text-white">
                      {service.id === 'wedding'
                        ? 'Browse wedding cards'
                        : routeHref
                          ? 'Explore Bidd Boxes'
                          : 'Ask MH about this service'}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </CardLink>
                  )
                })}
                {visibleProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    eager={i < 4}
                    index={i % 6}
                  />
                ))}
                {visibleLocalProducts.filter((product) => !product.pages?.length).map((product, i) => (
                  <LocalProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <Reveal direction="up" distance="translate-y-6" scale={0.97} blur={3}>
                <div className="grid min-h-[300px] place-content-center rounded-2xl border border-dashed border-line bg-white p-8 text-center">
                  {/* animated icon */}
                  <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal/10 text-teal">
                    <span className="absolute inset-0 animate-ping rounded-full bg-teal/20" />
                    <Search size={22} className="relative" />
                  </span>

                  <b className="mt-4 font-display text-lg text-ink">
                    No products found just yet.
                  </b>
                  <p className="mt-1 text-sm text-muted">
                    Try a different search or category, or message MH Printers for current options.
                  </p>

                  <button
                    onClick={reset}
                    className="group relative mx-auto mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-95"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                    <span className="relative z-10">Show all services</span>
                  </button>
                </div>
              </Reveal>
            )}
            {visibleLocalProducts.filter((product) => product.pages?.length).map((product) => (
              <LocalPdfCatalog key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
