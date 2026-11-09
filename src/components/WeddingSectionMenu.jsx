import { Link } from 'react-router-dom'
import { weddingSections } from '../data/wedding.js'
import useDeletedSections from '../hooks/useDeletedSections.js'

export default function WeddingSectionMenu() {
  const deletedSections = useDeletedSections()
  const visibleWeddingSections = deletedSections.includes('wedding')
    ? []
    : weddingSections.filter((section) => !deletedSections.includes(section.id))
  return (
    <details className="group relative z-20">
      <summary
        aria-label="Switch wedding card section"
        className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl border border-amber-300/70 bg-gradient-to-br from-[#08234f] to-[#0d615c] text-white shadow-lg shadow-black/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 [&::-webkit-details-marker]:hidden"
      >
        <span className="mobile-menu-glyph" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <nav
        aria-label="Wedding card sections"
        style={{ backgroundColor: '#071b3d' }}
        className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-amber-200/30 bg-[#071b3d] p-2 text-white shadow-2xl shadow-black/50"
      >
        <Link
          to="/wedding-cards"
          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14386e] hover:text-amber-200"
        >
          All wedding cards
        </Link>
        {visibleWeddingSections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="block rounded-xl px-3 py-2.5 text-sm text-blue-100 transition hover:bg-[#14386e] hover:text-amber-200"
          >
            {section.title}
          </Link>
        ))}
      </nav>
    </details>
  )
}
