import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, Mail, MapPin, Moon, Phone, Sun } from 'lucide-react'
import { BUSINESS, whatsappUrl } from '../data/brand.js'
import Reveal from './Reveal.jsx'
import useDeletedSections from '../hooks/useDeletedSections.js'
import { readBrowserSetting, writeBrowserSetting } from '../data/browserStorage.js'

const links = [
  ['Home', '/'],
  ['Catalog', '/catalog'],
  ['Wedding cards', '/wedding-cards'],
  ['Bidd Boxes', '/big-boxes'],
  ['About us', '/about'],
  ['Offers', '/offers'],
  ['Contact us', '/contact'],
]

export default function SiteLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [darkMode, setDarkMode] = useState(() => readBrowserSetting('mh-theme') === 'dark')
  const { pathname } = useLocation()
  const deletedSections = useDeletedSections()
  const visibleLinks = links.filter(([, path]) => {
    if (path === '/wedding-cards') return !deletedSections.includes('wedding')
    if (path === '/big-boxes') return !deletedSections.includes('boxes')
    if (path === '/offers') return !deletedSections.includes('offers')
    return true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    writeBrowserSetting('mh-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  /* sticky header + scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 12
      setScrolled(isScrolled)
      if (isScrolled && headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* lock body scroll while drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ============ SCROLL PROGRESS BAR ============ */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-teal via-teal to-emerald-400 shadow-[0_0_8px_rgba(20,184,166,.6)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ============ ANNOUNCEMENT ============ */}
      <Reveal direction="down" distance="-translate-y-4" duration={600}>
        <div className="glass-announcement relative overflow-hidden bg-ink text-white">
          {/* moving shine */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
          {/* subtle marquee-ish glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,.15),transparent_60%)]" />

          <div className="relative mx-auto flex max-w-[1180px] flex-col items-center justify-center gap-1 px-4 py-2 text-center text-[10px] sm:flex-row sm:gap-3 sm:py-2.5 sm:text-xs">
            <span className="tracking-wide">Thoughtful printing, made for your business</span>
            <a
              href={whatsappUrl('Assalam-o-alaikum! Please share your current printing offers.')}
              target="_blank" rel="noreferrer"
              className="group hidden items-center gap-1 text-white/80 transition-colors hover:text-white sm:inline-flex"
            >
              Need a quick quote?
              <b className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4">
                Chat with us
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </b>
            </a>
          </div>
        </div>
      </Reveal>

      {/* ============ HEADER ============ */}
      {scrolled && <div aria-hidden="true" style={{ height: headerHeight }} />}
      <header
        ref={headerRef}
        className={`site-header ${scrolled ? 'is-scrolled fixed inset-x-0 top-0 z-50' : 'sticky top-0 z-40'} border-b transition-[border-color,box-shadow] duration-500 ${
          scrolled
            ? 'border-line bg-paper/90 shadow-sm'
            : 'border-transparent bg-paper/70'
        }`}
      >
        <div
          className={`mobile-header-inner mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 transition-all duration-500 ${
            scrolled ? 'py-2.5' : 'py-3.5 sm:py-4'
          }`}
        >
          {/* logo */}
          <div className="brand-logo-frame">
            <img src="/assets/mh-printers-logo.png" alt="MH Printers & Enterprises" />
          </div>

          <NavLink
            to="/catalog"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `mobile-catalog-link ml-auto inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold transition lg:hidden ${
                isActive ? 'is-active' : ''
              }`
            }
          >
            Catalog <ArrowUpRight size={13} aria-hidden="true" />
          </NavLink>

          {/* mobile toggle */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="mobile-menu-toggle relative z-50 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink shadow-sm transition-all duration-300 hover:bg-ink hover:text-white active:scale-90 lg:hidden"
          >
            <span className={`mobile-menu-glyph${open ? ' is-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map(([name, href], i) => (
              <NavLink
                key={href}
                to={href}
                end={href === '/'}
                style={{ animationDelay: `${i * 60}ms` }}
                className={({ isActive }) =>
                  `group relative overflow-hidden rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300 lg:px-4 ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* hover pill background */}
                    <span
                      className={`absolute inset-0 rounded-full bg-[#fff3c4] transition-all duration-300 ${
                        isActive
                          ? 'scale-100 opacity-100'
                          : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                      }`}
                    />
                    {/* label */}
                    <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                      {name}
                    </span>
                    {/* underline */}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-ink transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:bg-line"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="group relative ml-2 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:gap-2.5 hover:shadow-md active:scale-95"
            >
              {/* fill sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 inline-flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5">
                Get a quote
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </a>
          </nav>
        </div>

        {/* ============ MOBILE DRAWER ============ */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        <nav
          className={`fixed right-0 top-0 z-40 flex h-full w-[82%] max-w-sm flex-col gap-1 overflow-y-auto border-l border-line bg-white p-5 pt-24 shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {visibleLinks.map(([name, href], i) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/'}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                  open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                } ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-ink/80 hover:bg-line/40 hover:translate-x-1'
                }`
              }
            >
              {name}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            className="mt-2 inline-flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-line/40"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          </button>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${100 + links.length * 60}ms` : '0ms' }}
            className={`mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg active:scale-95 ${
              open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
            }`}
          >
            <MessageCircle size={18} /> Get a quote on WhatsApp
          </a>
        </nav>
      </header>

      {/* ============ MAIN — page transition wrapper ============ */}
      <main key={pathname} className="animate-page-in">
        <Outlet />
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="mt-16 border-t border-white/10 bg-ink text-neutral-300">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-3 md:py-16">
          {/* brand */}
          <Reveal direction="up" duration={700}>
            <div className="flex flex-col gap-4">
              <img
                src="/assets/mh-printers-logo.png"
                alt="MH Printers & Enterprises"
                className="footer-brand-logo"
              />
              <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
                Better print. Better packaging. Better first impressions.
              </p>
            </div>
          </Reveal>

          {/* explore */}
          <Reveal delay={120} direction="up" duration={700}>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">
                Explore
              </h4>
              {links.slice(1, 5).map(([name, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="group inline-flex w-fit items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-white"
                >
                  <span className="relative">
                    {name}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </Reveal>

          {/* contact */}
          <Reveal delay={240} direction="up" duration={700}>
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">
                Get in touch
              </h4>
              <a
                href={'tel:' + BUSINESS.phoneE164}
                className="group inline-flex items-center gap-2 text-sm text-neutral-300 transition-all hover:translate-x-0.5 hover:text-white"
              >
                <Phone size={14} className="transition-transform duration-300 group-hover:rotate-12" />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={'mailto:' + BUSINESS.email}
                className="group inline-flex items-center gap-2 text-sm text-neutral-300 transition-all hover:translate-x-0.5 hover:text-white"
              >
                <Mail size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                {BUSINESS.email}
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-neutral-400">
                <MapPin size={14} /> Pakistan
              </span>
            </div>
          </Reveal>
        </div>

        {/* CTA strip */}
        <div className="mx-auto max-w-[1180px] px-5 pb-10">
          <Reveal direction="up" distance="translate-y-6" duration={800}>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[.99] sm:px-6 sm:py-5"
            >
              {/* shine sweep */}
              <span className="pointer-events-none absolute left-[-40%] top-0 h-full w-[30%] -skew-x-12 bg-white/20 transition-[left] duration-700 ease-out group-hover:left-[120%]" />
              <span className="relative inline-flex items-center gap-3 text-sm font-semibold sm:text-base">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 backdrop-blur transition-transform duration-500 group-hover:rotate-12 sm:h-10 sm:w-10">
                  <MessageCircle size={18} />
                </span>
                Start a conversation
              </span>
              <ArrowUpRight
                size={20}
                className="relative shrink-0 transition-transform duration-500 group-hover:rotate-45"
              />
            </a>
          </Reveal>
        </div>

        {/* bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-2 px-5 py-5 text-center text-[11px] text-neutral-500 sm:flex-row sm:text-left">
            <span>© {new Date().getFullYear()} MH Printers & Enterprises (Pvt) Ltd.</span>
            <span>Made for brands growing in Pakistan.</span>
          </div>
        </div>
      </footer>

      {/* ============ WHATSAPP FLOAT ============ */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
        className="group fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:gap-3 hover:bg-emerald-600 hover:shadow-emerald-500/50 active:scale-95 sm:bottom-6 sm:right-6 sm:px-5"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-75" />
          <MessageCircle
            size={20}
            className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
          />
        </span>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 group-hover:max-w-[180px] sm:inline">
          Order on WhatsApp
        </span>
      </a>
    </>
  )
}
