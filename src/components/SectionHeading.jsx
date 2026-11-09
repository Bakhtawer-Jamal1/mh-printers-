import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal.jsx'

export default function SectionHeading({ eyebrow, title, copy, link }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {/* ---------------------------- eyebrow ---------------------------- */}
        {eyebrow && (
          <Reveal direction="left" distance="-translate-x-3" duration={600}>
            <span className="group/eb inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-teal/80">
              {/* pulsing dot accent */}
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              {eyebrow}
            </span>
          </Reveal>
        )}

        {/* ----------------------------- title ----------------------------- */}
        {title && (
          <Reveal delay={100} direction="up" scale={0.97} blur={3} duration={800}>
            <h2 className="mt-2 mb-1 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {title}
            </h2>
          </Reveal>
        )}

        {/* ----------------------------- copy ------------------------------ */}
        {copy && (
          <Reveal delay={200} direction="up" blur={2}>
            <p className="max-w-xl text-xs text-muted sm:text-sm">{copy}</p>
          </Reveal>
        )}
      </div>

      {/* ------------------------------ link ------------------------------ */}
      {link && (
        <Reveal delay={300} direction="right" distance="translate-x-4">
          <Link
            to={link.href}
            className="group/lnk relative inline-flex items-center gap-2 pb-1 text-xs text-teal transition-colors duration-300 hover:text-blue"
          >
            {/* label with sliding underline */}
            <span className="relative">
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-blue transition-transform duration-500 ease-out group-hover/lnk:origin-left group-hover/lnk:scale-x-100" />
            </span>

            {/* arrow — nudges + rotates on hover */}
            <span className="grid h-5 w-5 place-items-center rounded-full transition-all duration-300 group-hover/lnk:bg-blue/10">
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover/lnk:-translate-y-0.5 group-hover/lnk:translate-x-0.5 group-hover/lnk:rotate-45"
              />
            </span>

            {/* static bottom border (kept subtle) */}
            <span className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-px bg-line" />
          </Link>
        </Reveal>
      )}
    </header>
  )
}