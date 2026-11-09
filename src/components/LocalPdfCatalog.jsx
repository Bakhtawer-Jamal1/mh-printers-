import WeddingPdfCatalog from './WeddingPdfCatalog.jsx'

export default function LocalPdfCatalog({ product }) {
  return (
    <WeddingPdfCatalog
      catalog={{
        id: `uploaded-${product.id}`,
        title: product.name,
        pdf: product.pdfUrl,
        pages: product.pages,
      }}
    />
  )
}
