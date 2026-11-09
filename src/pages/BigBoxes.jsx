import LocalProductCard from '../components/LocalProductCard.jsx'
import LocalPdfCatalog from '../components/LocalPdfCatalog.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import WeddingPdfCatalog from '../components/WeddingPdfCatalog.jsx'
import { products, whatsappUrl } from '../data/products.js'
import { biddBoxesPdfCatalog } from '../data/wedding.js'
import useDeletedSections from '../hooks/useDeletedSections.js'
import useLocalProducts from '../hooks/useLocalProducts.js'

export default function BigBoxes() {
  const deletedSections = useDeletedSections()
  const { products: uploadedProducts, error: loadError } = useLocalProducts()
  const localProducts = uploadedProducts.filter((item) => ['boxes', 'ecommerce', 'paper'].includes(item.type))

  const boxProducts = products.filter((item) =>
    ['E-commerce Boxes', 'Paper Boxes'].includes(item.category)
  )
  const sectionDeleted = deletedSections.includes('boxes')

  return (
    <>
      {sectionDeleted ? (
        <section className="mx-auto max-w-[1180px] px-5 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">This section has been deleted.</h1>
        </section>
      ) : (
        <>
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:py-16">
        {loadError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {boxProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index % 4} />
          ))}
          {localProducts.filter((product) => !product.pages?.length).map((product, index) => (
            <LocalProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="mt-10">
          <WeddingPdfCatalog catalog={biddBoxesPdfCatalog} />
          {localProducts.filter((product) => product.pages?.length).map((product) => (
            <LocalPdfCatalog key={product.id} product={product} />
          ))}
        </div>
        <Reveal delay={150}>
          <a
            href={whatsappUrl('Assalam-o-alaikum! I need a quotation for custom Bidd Boxes.')}
            target="_blank"
            rel="noreferrer"
            className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#e2ebe7] p-6 sm:flex-row sm:items-center"
          >
            <span>
              <b className="block font-display text-lg text-ink">Need a larger or custom box?</b>
              <small className="mt-1 block text-sm text-muted">Tell us the dimensions and quantity for a quotation.</small>
            </span>
            <span className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Get a quote</span>
          </a>
        </Reveal>
      </section>
        </>
      )}
    </>
  )
}
