import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const slides = [
  {
    eyebrow: 'WEDDING CARDS',
    title: 'A keepsake for your special day.',
    copy: 'Explore elegant invitation cards for your celebration.',
    image: '/assets/slider-wedding-card-navy.webp',
    alt: 'Navy blue wedding invitation card in a presentation box',
    href: '/wedding-cards',
    action: 'Browse wedding cards',
  },
  {
    eyebrow: 'WEDDING CARDS',
    title: 'Make your invitation unforgettable.',
    copy: 'Browse wedding card styles and find the design for your event.',
    image: '/assets/slider-wedding-card-red.jpg',
    alt: 'Red glitter wedding invitation cards with decorative details',
    href: '/wedding-cards',
    action: 'Browse wedding cards',
  },
  {
    eyebrow: 'E-COMMERCE PACKAGING',
    title: 'Shipping boxes made for your brand.',
    copy: 'Explore custom packaging for online orders and deliveries.',
    image: '/assets/category-ecommerce-boxes.webp',
    alt: 'E-commerce packaging boxes',
    href: '/big-boxes',
    action: 'Explore boxes',
  },
  {
    eyebrow: 'PAPER BOXES',
    title: 'Packaging that makes a great first impression.',
    copy: 'Browse printed paper and rigid box options.',
    image: '/assets/category-paper-box.webp',
    alt: 'Printed paper packaging boxes',
    href: '/big-boxes',
    action: 'Explore boxes',
  },
  {
    eyebrow: 'SHOPPING BAGS',
    title: 'Carry your brand with you.',
    copy: 'Discover custom printed shopping bag styles.',
    image: '/assets/category-shopping-bags.png',
    imageClassName: 'scale-110',
    alt: 'Custom printed shopping bags',
    href: '/catalog?category=Shopping%20Bags',
    action: 'Explore bags',
  },
  {
    eyebrow: 'STICKERS & LABELS',
    title: 'Add a finishing touch to every package.',
    copy: 'Explore product labels and custom sticker printing.',
    image: '/assets/category-stickers-labels.webp',
    alt: 'Printed product stickers and labels',
    href: '/catalog?category=Stickers%20%26%20Labels',
    action: 'Explore labels',
  },
  {
    eyebrow: 'CARDS & STATIONERY',
    title: 'Make every introduction memorable.',
    copy: 'Browse business cards and printed stationery.',
    image: '/assets/category-cards-stationery.jpg',
    alt: 'Business cards and stationery',
    href: '/catalog?category=Cards%20%26%20Stationery',
    action: 'Explore stationery',
  },
  {
    eyebrow: 'GIFT BOXES & WRAPS',
    title: 'Make the unboxing feel special.',
    copy: 'Explore gift packaging and wrapping options.',
    image: '/assets/category-gift-boxes.jpeg',
    alt: 'Gift box and wrapping presentation',
    href: '/catalog?category=Gift%20Boxes%20%26%20Wraps',
    action: 'Explore gift packaging',
  },
  {
    eyebrow: 'PACKAGING ACCESSORIES',
    title: 'Small details, polished packaging.',
    copy: 'See packaging accessories and finishing pieces.',
    image: '/assets/category-packaging-accessories.webp',
    alt: 'Packaging boxes and accessories',
    href: '/catalog?category=Packaging%20Accessories',
    action: 'Explore accessories',
  },
]

export default function HomeShowcaseSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [paused])

  const activeSlide = active % slides.length
  const slide = slides[activeSlide]
  const move = (offset) => setActive((current) => (current + offset + slides.length) % slides.length)

  return (
    <section
      aria-label="MH Printers featured collections"
      className="home-showcase-slider relative z-10 min-w-0 w-full self-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-[#08234f] via-[#134e78] to-[#0d766d] text-white shadow-[0_24px_70px_rgba(4,26,63,.24)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="relative z-10 mx-4 mt-4 flex h-[230px] flex-none items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white p-2 shadow-inner sm:mx-5 sm:h-[280px] md:h-[320px]">
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
            className={`h-full w-full rounded-xl object-cover object-center ${slide.imageClassName ?? ''}`}
          />
        </div>
        <div className="relative z-10 flex flex-col items-start px-6 pb-16 pt-5 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.17em] text-cyan-100 backdrop-blur">
            <Sparkles size={12} aria-hidden="true" /> {slide.eyebrow}
          </span>
          <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-tight sm:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-white/75 sm:text-sm">
            {slide.copy}
          </p>
          <Link
            to={slide.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:brightness-105 sm:text-sm md:px-3 md:text-xs lg:text-sm"
          >
            {slide.action} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 sm:bottom-5 sm:right-6">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous featured item"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <span className="min-w-10 text-center text-[11px] font-semibold tabular-nums text-white/80" aria-live="polite">
            {activeSlide + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next featured item"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-gradient-to-br from-teal to-blue text-white shadow-lg transition hover:brightness-110"
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
