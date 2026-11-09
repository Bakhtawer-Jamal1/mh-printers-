import { useEffect, useRef, useState } from 'react'

const offsets = {
  '-translate-x-2': [-8, 0],
  '-translate-x-3': [-12, 0],
  '-translate-x-4': [-16, 0],
  '-translate-x-6': [-24, 0],
  'translate-x-4': [16, 0],
  'translate-x-6': [24, 0],
  '-translate-y-4': [0, -16],
  'translate-y-2': [0, 8],
  'translate-y-3': [0, 12],
  'translate-y-4': [0, 16],
  'translate-y-6': [0, 24],
}

const directionOffsets = {
  down: [0, -16],
  left: [16, 0],
  right: [-16, 0],
  up: [0, 16],
}

export default function Reveal({
  as: Element = 'div',
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance,
  duration = 700,
  scale = 0.96,
  blur = 0,
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined'
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const [x, y] = offsets[distance] ?? directionOffsets[direction] ?? directionOffsets.up

  return (
    <Element
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translate3d(0, 0, 0) scale(1)'
          : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        filter: `blur(${visible ? 0 : blur}px)`,
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Element>
  )
}
