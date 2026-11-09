/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#183238',
        teal: 'var(--theme-teal)',
        blue: 'var(--theme-blue)',
        paper: 'var(--theme-paper)',
        muted: 'var(--theme-muted)',
        line: 'var(--theme-line)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      keyframes: {
        /* ---------- existing ---------- */
        fadeUp:     { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: 0 }, to: { opacity: 1 } },
        floatY:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shine:      { '0%': { transform: 'translateX(-120%)' }, '100%': { transform: 'translateX(120%)' } },
        pulseRing:  { '0%': { transform: 'scale(.85)', opacity: .7 }, '100%': { transform: 'scale(1.9)', opacity: 0 } },
        bounceArrow:{ '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(4px)' } },

        /* ---------- new ---------- */
        // page route transition — fade + subtle rise
        pageIn:     { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },

        // generic slide-ins (Reveal ke liye optional backup)
        slideInLeft:  { '0%': { opacity: 0, transform: 'translateX(-18px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(18px)' },  '100%': { opacity: 1, transform: 'translateX(0)' } },

        // pop-in (badge / chip ke liye)
        popIn:      { '0%': { opacity: 0, transform: 'scale(.85)' }, '60%': { opacity: 1, transform: 'scale(1.04)' }, '100%': { opacity: 1, transform: 'scale(1)' } },

        // soft glow pulse (progress bar / accent ke liye)
        glowPulse:  { '0%,100%': { opacity: .6 }, '50%': { opacity: 1 } },

        // slow gradient shift (CTA strips ke liye)
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        /* ---------- existing ---------- */
        fadeUp:      'fadeUp .9s cubic-bezier(.22,1,.36,1) both',
        fadeIn:      'fadeIn 1s ease both',
        floatY:      'floatY 6s ease-in-out infinite',
        shine:       'shine 4.5s linear infinite',
        pulseRing:   'pulseRing 2.2s ease-out infinite',
        bounceArrow: 'bounceArrow 2s ease-in-out infinite',

        /* ---------- new ---------- */
        'page-in':      'pageIn .5s cubic-bezier(.22,1,.36,1) both',
        'slide-in-left':  'slideInLeft .6s cubic-bezier(.22,1,.36,1) both',
        'slide-in-right': 'slideInRight .6s cubic-bezier(.22,1,.36,1) both',
        'pop-in':       'popIn .5s cubic-bezier(.22,1,.36,1) both',
        'glow-pulse':   'glowPulse 2.4s ease-in-out infinite',
        'gradient-shift':'gradientShift 6s ease infinite',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [],
}