import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function ImageLightbox({ src, alt, onClose }) {
  const closeButton = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Image preview: ${alt}`}
      onClick={onClose}
    >
      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white shadow-xl backdrop-blur-xl transition hover:rotate-90 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-3rem)] max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[calc(100dvh-5rem)]"
      />
    </div>,
    document.body
  )
}
