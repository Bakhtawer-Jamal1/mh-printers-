import { ArrowRight, ArrowUpRight, Box, Gift, Layers3, MessageCircle, NotebookPen, PackageCheck, Printer, ShoppingBag, Sticker } from 'lucide-react'
import { Link } from 'react-router-dom'
import HomeShowcaseSlider from '../components/HomeShowcaseSlider.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/Reveal.jsx'
import SpecialOfferBanner from '../components/SpecialOfferBanner.jsx'
import { categories, categoryImages, whatsappUrl } from '../data/products.js'
import useDeletedSections from '../hooks/useDeletedSections.js'

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

export default function Home() {
  const deletedSections = useDeletedSections()
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="home-hero relative mx-auto grid max-w-[1180px] items-center gap-10 overflow-hidden px-5 pb-16 pt-10 md:grid-cols-2 md:pt-14">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />

        <div className="home-hero-copy relative">
          {/* eyebrow with pulsing amber dot */}
          <Reveal direction="left" distance="-translate-x-3" duration={600}>
            <span className="inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              <span className="relative h-2 w-2 rounded-full bg-amber-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/60" />
              </span>
              PRINTING WITH PURPOSE · MADE IN PAKISTAN
            </span>
          </Reveal>

          <Reveal delay={100} duration={900} blur={4} scale={0.98}>
            <h1 className="home-hero-title mt-5 mb-4 font-display text-[42px] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-[56px] lg:text-[62px]">
              Packaging that makes
              <br />
              your brand{' '}
              <em className="font-serif font-normal not-italic text-blue">
                unforgettable.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={220} blur={2}>
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-[15px]">
              From the first hello to the final unboxing, we make custom printing
              and packaging that brings your brand to life.
            </p>
          </Reveal>

          <Reveal delay={340} direction="up" distance="translate-y-4">
            <div className="home-hero-actions mt-7 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-95"
              >
                {/* teal fill sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                  Explore the catalog
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-white hover:shadow-md active:scale-95"
              >
                <MessageCircle
                  size={16}
                  className="text-emerald-500 transition-transform duration-300 group-hover:rotate-12"
                />
                Talk to our team
              </a>
            </div>
          </Reveal>

          {/* social proof */}
          <Reveal delay={460} direction="up" distance="translate-y-3">
            <div className="home-hero-proof mt-8 flex items-center gap-3 text-xs text-muted">
              <div className="grid h-9 w-9 place-items-center rounded-full border border-teal/20 bg-teal/10 text-teal">
                <Printer size={16} aria-hidden="true" />
              </div>
              <span>
                Printing and packaging for
                <br />
                <b className="text-ink">businesses in Pakistan</b>
              </span>
            </div>
          </Reveal>
        </div>

        <HomeShowcaseSlider />
      </section>

      <SpecialOfferBanner />

      {/* ================= TRUST STRIP ================= */}
      <section className="border-y border-line bg-[#eaece6]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 items-center gap-4 px-5 py-5 text-[11px] text-teal md:grid-cols-4 md:py-6">
          {[
            [Printer, 'Printing'],
            [Box, 'Packaging'],
            [Gift, 'Wedding cards'],
            [Layers3, 'Custom projects'],
          ].map(([Icon, label], i) => (
            <Reveal
              key={label}
              delay={i * 90}
              direction="up"
              distance="translate-y-3"
              duration={600}
            >
              <div className="group flex items-center gap-2.5 transition-colors duration-300 hover:text-blue">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal transition-all duration-300 group-hover:bg-teal group-hover:text-white">
                  <Icon size={13} className="transition-transform duration-500 group-hover:rotate-[8deg]" />
                </span>
                <span>{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section id="shop" className="relative mx-auto max-w-[1180px] overflow-hidden px-5 py-20">
        {/* ambient blob */}
        <div className="pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />

        <Reveal>
          <SectionHeading
            eyebrow="THE GOOD STUFF"
            title="A little something for every brand."
            copy="Choose a printing or packaging service to explore."
            link={{ href: '/catalog', label: 'View all services' }}
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.filter((item) => !deletedSections.includes(item.id)).map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 70}
              direction="up"
              distance="translate-y-6"
              scale={0.96}
              duration={700}
            >
              <Link
                to={item.id === 'wedding'
                  ? '/wedding-cards'
                  : ['ecommerce', 'paper'].includes(item.id)
                    ? '/big-boxes'
                    : '/catalog?category=' + encodeURIComponent(item.name)}
                className="group relative block aspect-[5/4] overflow-hidden rounded-2xl bg-line shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-ink/10"
              >
                  {categoryImages[item.id] ? (
                    <>
                      <img
                        src={categoryImages[item.id]}
                        alt={`${item.name} example`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071a32]/90 via-[#071a32]/25 to-[#071a32]/10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue/90 via-indigo-800 to-teal/90" />
                  )}
                  <div className="absolute -right-7 -top-8 h-36 w-36 rounded-full border border-white/15 bg-white/10 transition-transform duration-700 group-hover:scale-125" />
                  <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-amber-200 shadow-lg backdrop-blur-md">
                    {(() => {
                      const Icon = categoryIcons[item.id] ?? Printer
                      return <Icon size={22} aria-hidden="true" />
                    })()}
                  </span>

                  {/* shine sweep */}
                <span className="pointer-events-none absolute left-[-60%] top-0 h-full w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-[left] duration-[900ms] ease-out group-hover:left-[130%]" />

                <div className="absolute inset-x-3 bottom-3 text-white">
                  <p className="font-display text-sm font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-base">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/75">{item.note}</p>
                </div>

                <span className="absolute right-2.5 top-2.5 grid h-8 w-8 -translate-y-2 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-md backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f0efeb] py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5">
          <Reveal>
            <SectionHeading
              eyebrow="PRINTING & PACKAGING"
              title="Tell us what your business needs."
              copy="Explore the service categories or message MH Printers for current options and a tailored quote."
              link={{ href: '/catalog', label: 'Explore services' }}
            />
          </Reveal>
        </div>
      </section>

      {/* ================= STUDIO ================= */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-24">
        <Reveal direction="left" distance="-translate-x-6" duration={800} scale={0.97}>
          <div className="relative grid h-[300px] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#08234f] via-[#134e78] to-[#0d766d] shadow-xl ring-1 ring-line/60 sm:h-[380px] md:h-[420px]">
            <span className="absolute -left-10 -top-10 h-48 w-48 rounded-full border border-white/20 bg-white/10 blur-sm" />
            <span className="absolute -bottom-12 -right-8 h-56 w-56 rounded-full border border-amber-200/30 bg-amber-200/10" />
            <img
              src="/assets/mh-printers-logo.png"
              alt="MH Printers & Enterprises"
              className="relative z-10 w-[72%] max-w-[360px] drop-shadow-[0_5px_20px_rgba(255,255,255,.48)]"
            />
          </div>
        </Reveal>

        <div>
          <Reveal direction="up" delay={80} blur={2}>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              A PARTNER IN YOUR CORNER
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Small business today.
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                Big brand energy.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              You bring the idea. We'll help it show up beautifully. Our team
              makes the process simple, from choosing the right stock and
              finish to getting every last detail just right.
            </p>
          </Reveal>

          <ul className="mt-6 space-y-1">
            {[
              "Tell us what you're making",
              "We'll help shape the details",
              'Approve your proof with confidence',
              'Get it delivered, ready to impress',
            ].map((t, i) => (
              <Reveal
                key={t}
                delay={320 + i * 90}
                as="li"
                direction="left"
                distance="-translate-x-3"
                duration={600}
              >
                <div className="group flex items-center gap-3 border-b border-line py-3 text-sm text-ink/80 transition-all duration-300 hover:pl-2 hover:text-teal">
                  <span className="text-[11px] font-semibold text-teal/70 transition-colors group-hover:text-teal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t}
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={700} direction="up">
            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 border-b border-line pb-1 text-xs text-teal transition-all duration-300 hover:border-blue hover:text-blue"
            >
              A little more about us
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-[#e7eeea]">
        {/* floating rings */}
        <span className="pointer-events-none absolute -right-40 -top-24 h-[470px] w-[470px] animate-floatY rounded-full border border-emerald-700/15" />
        <span className="pointer-events-none absolute -right-16 -top-6 h-[340px] w-[340px] animate-floatY rounded-full border border-emerald-700/10 [animation-delay:-2s]" />
        {/* ambient glow */}
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <Reveal direction="left" distance="-translate-x-4" duration={700} blur={2}>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              YOUR NEXT GREAT IDEA STARTS HERE
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[42px]">
              Let's make something
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                worth remembering.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={180} direction="right" distance="translate-x-4" className="max-w-sm">
            <p className="text-sm leading-relaxed text-muted">
              Share a little about your project. Our team will help you find
              the right print, finish and quantity.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="group relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                Get a custom quote
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </a>
            <small className="mt-3 block text-[11px] text-muted">
              Friendly humans. Helpful answers. No pressure.
            </small>
          </Reveal>
        </div>
      </section>
    </>
  )
}
