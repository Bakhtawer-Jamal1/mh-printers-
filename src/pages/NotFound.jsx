import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-20 text-center sm:py-28">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-teal">404 · PAGE NOT FOUND</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl">We couldn’t find that page.</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">The link may be outdated or the address may be incorrect.</p>
      <Link to="/" className="mt-7 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal">Back to home</Link>
    </main>
  )
}
