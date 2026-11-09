export const weddingSections = [
  { id: 'custom', path: '/wedding-cards/custom', title: 'Customise cards', description: 'Personalised invitations made around your colours, names and celebration.', image: '/assets/catalog-previews/customise-1/page-01.jpg' },
  { id: 'fancy', path: '/wedding-cards/fancy', title: 'Fancy cards', description: 'Elegant finishes and special details for an unforgettable first impression.', image: '/assets/wedding-cards/ameen-fancy-03.jpg' },
  { id: 'normal', path: '/wedding-cards/normal', title: 'Normal cards', description: 'Classic, beautiful invitation styles for every family and budget.', image: '/assets/wedding-cards/zifaf-01.jpg' },
  { id: 'offer', path: '/wedding-cards/special-offers', title: 'Special offer cards', description: 'Browse current card deals and limited-time wedding packages.' },
]

const renderedPages = (count, folder) =>
  Array.from({ length: count }, (_, index) => {
    const pdfPage = index + 1
    return {
      pdfPage,
      image: `/assets/catalog-previews/${folder}/page-${String(pdfPage).padStart(2, '0')}.jpg`,
    }
  })

export const customisationPdfCatalogs = [
  {
    id: 'customise-card-1',
    title: 'Customise Wedding Card · Collection 1',
    pdf: '/customise%20card%201.pdf',
    pages: renderedPages(48, 'customise-1'),
  },
  {
    id: 'customise-card-2',
    title: 'Customise Wedding Card · Collection 2',
    pdf: '/customise%20card%202.pdf',
    pages: renderedPages(34, 'customise-2'),
  },
]

export const biddBoxesPdfCatalog = {
  id: 'bidd-boxes',
  title: 'Bidd Boxes · Product Catalogue',
  pdf: '/bidd%20boxes.pdf',
  pages: renderedPages(26, 'bidd-boxes'),
}

const cardPages = (from, to, previewPrefix, digits) =>
  Array.from({ length: to - from + 1 }, (_, index) => {
    const pdfPage = from + index
    return {
      pdfPage,
      image: `/assets/wedding-cards/${previewPrefix}-${String(pdfPage).padStart(digits, '0')}.jpg`,
    }
  })

export const weddingPdfCatalogs = {
  normal: [
    {
      id: 'zifaf-simple',
      title: 'MH Simple Wedding Cards · Collection 1',
      pdf: '/Al%20Zifaf%20card%20list%20simple.pdf',
      pages: cardPages(1, 17, 'zifaf', 2),
    },
    {
      id: 'ameen-simple',
      title: 'MH Simple Wedding Cards · Collection 2',
      pdf: '/Ameen%20Cards%20(Simple)%202025%20%26%202026.pdf',
      pages: cardPages(4, 109, 'ameen-simple', 3),
    },
  ],
  fancy: [
    {
      id: 'ameen-fancy',
      title: 'MH Fancy Wedding Cards',
      pdf: '/Ameen%20Cards%20Fancy.pdf',
      pages: cardPages(3, 73, 'ameen-fancy', 2),
    },
  ],
}
