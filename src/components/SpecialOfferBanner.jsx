import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { readBrowserSetting } from '../data/browserStorage.js'

const settingKey = 'mh-special-offer-hidden'

export default function SpecialOfferBanner() {
  const [visible, setVisible] = useState(() => readBrowserSetting(settingKey) !== 'true')

  useEffect(() => {
    const syncVisibility = () => setVisible(readBrowserSetting(settingKey) !== 'true')
    window.addEventListener('storage', syncVisibility)
    window.addEventListener('mh-site-settings', syncVisibility)
    return () => {
      window.removeEventListener('storage', syncVisibility)
      window.removeEventListener('mh-site-settings', syncVisibility)
    }
  }, [])

  if (!visible) return null

  return (
    <section
      aria-labelledby="special-offer-heading"
      className="mx-auto max-w-[1180px] px-4 pt-5 sm:px-5 sm:pt-7"
    >
      <div className="overflow-hidden rounded-2xl border border-amber-300/40 bg-gradient-to-br from-[#08234f] via-[#134e78] to-[#0d766d] p-3 shadow-xl shadow-blue/10 sm:rounded-3xl sm:p-5">
        <h2
          id="special-offer-heading"
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-md"
        >
          <Sparkles size={16} aria-hidden="true" />
          Special offer
        </h2>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src="/post.jpg.jpeg"
            alt="MH Printers winter offer on medicine packaging"
            className="block h-auto w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
