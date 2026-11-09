import { ArrowUpRight, Palette, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

const pillars = [
  {
    Icon: Sparkles,
    t: 'Print and packaging',
    d: 'Share the item you need, your preferred finish and the quantity you have in mind.',
  },
  {
    Icon: Palette,
    t: 'Custom requirements',
    d: 'Ask our team about available sizes, colours and customization for your project.',
  },
  {
    Icon: ShieldCheck,
    t: 'Clear order details',
    d: 'Discuss the artwork, materials and order details with us before confirming a print job.',
  },
  {
    Icon: Truck,
    t: 'Delivery information',
    d: 'Contact MH Printers to confirm delivery options for your location.',
  },
]

export default function About() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-line bg-[#eeefeb] py-14 sm:py-16">
        {/* soft ambient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />
        {/* subtle grid overlay */}
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
              MH PRINTERS
            </span>
          </Reveal>

          <Reveal delay={100} duration={800} blur={3} scale={0.98}>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Printing and packaging for your
              <br />
              <em className="font-serif font-normal not-italic text-blue">business.</em>
            </h1>
          </Reveal>

          <Reveal delay={220} duration={700} blur={2}>
            <p className="mt-3 max-w-md text-sm text-muted">
              MH Printers & Enterprises provides printing and packaging services for businesses in Pakistan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ IMAGE + STORY ============ */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-20">
        {/* image with zoom-on-hover + rising shine */}
        <Reveal direction="left" distance="-translate-x-6" duration={800} scale={0.97}>
          <div className="relative grid h-[300px] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#08234f] via-[#134e78] to-[#0d766d] shadow-xl ring-1 ring-line/60 sm:h-[420px]">
            <span className="absolute -left-10 -top-10 h-48 w-48 rounded-full border border-white/20 bg-white/10" />
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
              PRINTING SERVICES
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Made with care,
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                finished with pride.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              MH Printers & Enterprises works with customers on printing and
              packaging requirements. Browse the available wedding-card
              catalogs or contact the team about a custom order.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The right options depend on the product, artwork, quantity and
              delivery location. Contact us to confirm the details for your order.
            </p>
          </Reveal>

          {/* stats strip */}
          <Reveal delay={420} direction="up" distance="translate-y-4">
            <div className="mt-7 grid grid-cols-3 gap-4 border-y border-line/70 py-5">
              {pillars.slice(0, 3).map(({ t, Icon }) => (
                <div key={t} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                  <Icon size={18} className="text-teal" aria-hidden="true" />
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{t}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={520} direction="up">
            <Link
              to="/catalog"
              className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                See what we make
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ PILLARS ============ */}
      <section className="relative overflow-hidden bg-[#eeefeb] py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-teal/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1180px] px-5">
          <Reveal direction="left" distance="-translate-x-4" duration={600}>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              WHAT WE STAND FOR
            </span>
          </Reveal>

          <Reveal delay={120} duration={800} blur={3}>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Four things we never
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                compromise on.
              </em>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ Icon, t, d }, i) => (
              <Reveal
                key={t}
                delay={i * 90}
                direction="up"
                distance="translate-y-6"
                scale={0.96}
                duration={700}
              >
                <article className="group relative h-full overflow-hidden rounded-2xl bg-paper p-5 shadow-sm ring-1 ring-line/70 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:ring-teal/30">
                  {/* top accent */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-teal to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                  {/* icon */}
                  <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal transition-all duration-500 group-hover:scale-110 group-hover:bg-teal group-hover:text-white">
                    <Icon
                      size={18}
                      className="transition-transform duration-500 group-hover:rotate-[8deg]"
                    />
                    {/* ring pulse on hover */}
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-teal/0 transition-all duration-500 group-hover:ring-teal/20" />
                  </span>

                  <h3 className="mt-4 text-sm font-semibold text-ink transition-colors group-hover:text-teal">
                    {t}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{d}</p>

                  {/* corner arrow — slides in on hover */}
                  <span className="absolute right-4 top-4 grid h-6 w-6 -translate-y-2 place-items-center rounded-full bg-teal/10 text-teal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={12} />
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}