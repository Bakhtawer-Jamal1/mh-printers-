import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BUSINESS } from '../data/brand.js'

const pages = {
  '/': ['Printing & Packaging in Pakistan', 'Custom printing, packaging boxes, shopping bags, labels and wedding cards from MH Printers & Enterprises in Lahore.'],
  '/catalog': ['Printing & Packaging Catalog', 'Browse MH Printers services: custom boxes, shopping bags, labels, cards and packaging accessories.'],
  '/about': ['About MH Printers', 'Learn about MH Printers & Enterprises and our printing and packaging services in Lahore, Pakistan.'],
  '/offers': ['Printing & Packaging Offers', 'Explore current printing and packaging offers from MH Printers & Enterprises. Contact us to confirm availability.'],
  '/contact': ['Contact MH Printers', 'Contact MH Printers & Enterprises in Lahore for printing, packaging, wedding cards and custom quotations.'],
  '/wedding-cards': ['Wedding Cards & Invitations', 'Browse wedding invitation cards and printed designs from MH Printers & Enterprises.'],
  '/wedding-cards/custom': ['Custom Wedding Cards', 'Explore customizable wedding cards and invitation designs from MH Printers.'],
  '/wedding-cards/fancy': ['Fancy Wedding Cards', 'Browse fancy wedding invitation cards and premium printed designs from MH Printers.'],
  '/wedding-cards/normal': ['Wedding Card Designs', 'Browse classic wedding invitation card designs from MH Printers.'],
  '/wedding-cards/special-offers': ['Wedding Card Offers', 'See wedding card collections and ask MH Printers about current offers.'],
  '/big-boxes': ['Custom Packaging & Bidd Boxes', 'Explore custom shipping and rigid packaging boxes from MH Printers & Enterprises.'],
}

function setMeta(name, content, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.append(element)
  }
  element.setAttribute('content', content)
}

export default function RouteMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const [pageTitle, description] = pages[pathname] ?? ['Page not found', 'The requested page could not be found on the MH Printers website.']
    const title = `${pageTitle} | ${BUSINESS.name}`
    const canonicalUrl = new URL(pathname, window.location.origin).href
    document.title = title
    setMeta('description', description)
    setMeta('og:type', 'website', 'property')
    setMeta('og:site_name', BUSINESS.name, 'property')
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:image', new URL('/assets/mh-printers-logo.png', window.location.origin).href, 'property')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = canonicalUrl

    let structuredData = document.getElementById('mh-business-schema')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'mh-business-schema'
      structuredData.type = 'application/ld+json'
      document.head.append(structuredData)
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
      url: window.location.origin,
      telephone: BUSINESS.phoneE164,
      email: BUSINESS.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressCountry: 'PK',
      },
      description: 'Printing, packaging and wedding card services in Lahore, Pakistan.',
    })
  }, [pathname])

  return null
}
