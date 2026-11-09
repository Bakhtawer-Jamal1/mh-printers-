import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { BUSINESS, whatsappUrl } from '../data/brand.js'

export default function Contact() {
  const onSubmit = (e) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const name = String(d.get('name') ?? '').trim()
    const phone = String(d.get('phone') ?? '').trim()
    const interest = String(d.get('interest') ?? '').trim()
    const details = String(d.get('details') ?? '').trim()
    const text = `Assalam-o-alaikum! I am ${name}.\nPhone: ${phone}\nInterested in: ${interest}\nProject details: ${details}`
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
  }

  const quickContacts = [
    { Icon: Phone, label: 'Call us', value: BUSINESS.phoneDisplay, href: 'tel:' + BUSINESS.phoneE164 },
    { Icon: Mail, label: 'Email', value: BUSINESS.email, href: 'mailto:' + BUSINESS.email },
  ]

  return (
    <>
      {/* ============ HERO ============ */}
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
              WE'RE ALL EARS
            </span>
          </Reveal>

          <Reveal delay={120} duration={800} blur={3} scale={0.98}>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Tell us what you're
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                dreaming up.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={240} blur={2}>
            <p className="mt-3 max-w-md text-sm text-muted">
              Share a few details to help us understand your printing or packaging requirements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-[1fr_.9fr] md:py-20">
        {/* ============================ LEFT ============================ */}
        <div>
          <Reveal direction="left" distance="-translate-x-4" duration={600}>
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-teal">
              LET'S MAKE IT HAPPEN
            </span>
          </Reveal>

          <Reveal delay={100} duration={800} blur={3}>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Tell us a little about
              <br />
              <em className="font-serif font-normal not-italic text-blue">
                your next project.
              </em>
            </h2>
          </Reveal>

          <Reveal delay={220} blur={2}>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Share what you're printing, rough quantities and when you need
              it. Our team will help you figure out the next step.
            </p>
          </Reveal>

          {/* WhatsApp quick card */}
          <Reveal delay={320} direction="up" distance="translate-y-4">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="group relative mt-7 flex max-w-md items-center gap-4 overflow-hidden rounded-2xl bg-[#e6eee9] p-4 transition-all duration-500 hover:-translate-y-1 hover:bg-[#dcebe3] hover:shadow-xl"
            >
              {/* shine sweep */}
              <span className="pointer-events-none absolute left-[-60%] top-0 h-full w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-[left] duration-[900ms] ease-out group-hover:left-[130%]" />

              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg]">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
                <MessageCircle size={20} className="relative" />
              </span>

              <span className="relative flex-1">
                <b className="block text-sm text-ink transition-colors group-hover:text-teal">
                  Message us on WhatsApp
                </b>
                <small className="text-[11px] text-muted">
                  Usually the quickest way to reach us
                </small>
              </span>

              <ArrowUpRight
                size={18}
                className="relative text-teal transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110"
              />
            </a>
          </Reveal>

          {/* quick contacts grid */}
          <div className="mt-7 grid grid-cols-2 gap-4">
            {quickContacts.map(({ Icon, label, value, href }, i) => {
              const Tag = href ? 'a' : 'div'
              return (
                <Reveal
                  key={label}
                  delay={420 + i * 70}
                  direction="up"
                  distance="translate-y-3"
                  duration={600}
                >
                  <Tag
                    href={href}
                    className="group flex items-start gap-3 rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-line/40"
                  >
                    <span className="relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-teal/10 text-teal transition-all duration-300 group-hover:bg-teal group-hover:text-white">
                      <Icon
                        size={14}
                        className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                      />
                    </span>
                    <span className="flex flex-col">
                      <small className="text-[10px] uppercase tracking-wider text-muted">
                        {label}
                      </small>
                      <b className="text-xs font-medium text-ink">{value}</b>
                    </span>
                  </Tag>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* ============================ RIGHT — FORM ============================ */}
        <Reveal delay={200} direction="up" distance="translate-y-6" scale={0.97} duration={800}>
          <form
            onSubmit={onSubmit}
            className="group/form relative overflow-hidden rounded-2xl bg-[#eeefeb] p-6 shadow-sm ring-1 ring-line/60 transition-all duration-500 hover:shadow-lg hover:ring-teal/20"
          >
            {/* top accent bar */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-teal via-teal to-transparent transition-transform duration-700 group-hover/form:scale-x-100" />

            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              Quick project brief
            </h3>
            <p className="mt-1 text-[11px] text-muted">
              We'll open WhatsApp with your details ready to send.
            </p>

            <div className="mt-5 space-y-4">
              <Reveal delay={300} direction="up" distance="translate-y-2">
                <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink/75">
                  Your name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Your name"
                    className="rounded-lg border border-line bg-paper px-3.5 py-2.5 text-xs font-normal text-ink outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-teal focus:ring-4 focus:ring-teal/15"
                  />
                </label>
              </Reveal>

              <Reveal delay={370} direction="up" distance="translate-y-2">
                <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink/75">
                  Phone or WhatsApp
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    maxLength={30}
                    placeholder="+92 3XX XXXXXXX"
                    className="rounded-lg border border-line bg-paper px-3.5 py-2.5 text-xs font-normal text-ink outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-teal focus:ring-4 focus:ring-teal/15"
                  />
                </label>
              </Reveal>

              <Reveal delay={440} direction="up" distance="translate-y-2">
                <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink/75">
                  What are you looking for?
                  <select
                    name="interest"
                    defaultValue=""
                    required
                    className="rounded-lg border border-line bg-paper px-3.5 py-2.5 text-xs font-normal text-ink outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-teal focus:ring-4 focus:ring-teal/15"
                  >
                    <option value="" disabled>Select a service</option>
                    <option>E-commerce boxes</option>
                    <option>Paper boxes</option>
                    <option>Shopping bags</option>
                    <option>Stickers & labels</option>
                    <option>Visiting / business cards</option>
                    <option>Wedding cards</option>
                    <option>Gift boxes & wraps</option>
                    <option>Packaging accessories</option>
                    <option>Something else</option>
                  </select>
                </label>
              </Reveal>

              <Reveal delay={510} direction="up" distance="translate-y-2">
                <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-ink/75">
                  Tell us a little more
                  <textarea
                    name="details"
                    rows="4"
                    maxLength={800}
                    placeholder="Quantity, size, timeline or anything else you have in mind"
                    className="resize-y rounded-lg border border-line bg-paper px-3.5 py-2.5 text-xs font-normal text-ink outline-none transition-all duration-300 focus:-translate-y-0.5 focus:border-teal focus:ring-4 focus:ring-teal/15"
                  />
                </label>
              </Reveal>
            </div>

            <Reveal delay={600} direction="up" distance="translate-y-2">
              <button
                type="submit"
                className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal/30 active:scale-[.98]"
              >
                {/* fill sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-teal to-emerald-500 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                  Continue on WhatsApp
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </span>
              </button>
            </Reveal>

            <small className="mt-3 block text-center text-[10px] text-muted">
              Your details go straight to our team on WhatsApp.
            </small>
          </form>
        </Reveal>
      </section>
    </>
  )
}
