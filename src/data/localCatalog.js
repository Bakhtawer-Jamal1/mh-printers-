const DATABASE = 'mh-printers-local-catalog'
const STORE = 'products'
const DELETED_SECTIONS_KEY = 'mh-deleted-local-sections'
const HIDDEN_WEDDING_CARDS_KEY = 'mh-hidden-wedding-cards'
const PRODUCT_CHANGE_KEY = 'mh-local-products-version'

export function notifyLocalProductsChanged() {
  window.dispatchEvent(new Event('mh-local-products-changed'))
  try {
    localStorage.setItem(PRODUCT_CHANGE_KEY, String(Date.now()))
  } catch {
    // The same-tab event still refreshes the current page when storage is disabled.
  }
}

export function getDeletedSections() {
  try {
    const savedSections = JSON.parse(localStorage.getItem(DELETED_SECTIONS_KEY) ?? '[]')
    return Array.isArray(savedSections) ? savedSections.filter((section) => typeof section === 'string') : []
  } catch (error) {
    console.error('Could not read deleted local sections.', error)
    return []
  }
}

export function deleteLocalSection(sectionId) {
  const deletedSections = new Set(getDeletedSections())
  deletedSections.add(sectionId)
  localStorage.setItem(DELETED_SECTIONS_KEY, JSON.stringify([...deletedSections]))
  window.dispatchEvent(new Event('mh-local-sections-changed'))
}

export function restoreLocalSections(sectionIds) {
  const deletedSections = new Set(getDeletedSections())
  sectionIds.forEach((sectionId) => deletedSections.delete(sectionId))
  localStorage.setItem(DELETED_SECTIONS_KEY, JSON.stringify([...deletedSections]))
  window.dispatchEvent(new Event('mh-local-sections-changed'))
}

export function getHiddenWeddingCards() {
  try {
    const savedCards = JSON.parse(localStorage.getItem(HIDDEN_WEDDING_CARDS_KEY) ?? '{}')
    if (!savedCards || typeof savedCards !== 'object' || Array.isArray(savedCards)) return {}
    return Object.fromEntries(
      Object.entries(savedCards).map(([catalogId, pages]) => [
        catalogId,
        Array.isArray(pages) ? pages.filter((page) => Number.isInteger(page) && page > 0) : [],
      ])
    )
  } catch (error) {
    console.error('Could not read hidden wedding cards.', error)
    return {}
  }
}

export function setWeddingCardHidden(catalogId, pdfPage, hidden) {
  const hiddenCards = getHiddenWeddingCards()
  const hiddenPages = new Set(hiddenCards[catalogId] ?? [])
  if (hidden) hiddenPages.add(pdfPage)
  else hiddenPages.delete(pdfPage)
  if (hiddenPages.size) hiddenCards[catalogId] = [...hiddenPages]
  else delete hiddenCards[catalogId]
  localStorage.setItem(HIDDEN_WEDDING_CARDS_KEY, JSON.stringify(hiddenCards))
  window.dispatchEvent(new Event('mh-wedding-cards-changed'))
}

async function getPublicProducts() {
  const response = await fetch('/uploads/catalog.json', { cache: 'no-store' })
  if (response.status === 404) return []
  if (!response.ok) throw new Error('Could not load products saved in the project public folder.')
  const products = await response.json()
  if (!Array.isArray(products)) throw new Error('The public uploads catalog is invalid.')
  return products
}

async function getIndexedProducts() {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    request.onsuccess = () => {
      database.close()
      resolve(request.result)
    }
    request.onerror = () => {
      database.close()
      reject(request.error ?? new Error('Could not load saved products.'))
    }
  })
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support local file storage.'))
      return
    }

    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'))
  })
}

export async function getLocalProducts() {
  const [indexedResult, publicResult] = await Promise.allSettled([getIndexedProducts(), getPublicProducts()])
  if (indexedResult.status === 'rejected' && publicResult.status === 'rejected') {
    throw new Error('Could not read saved products from this browser or the project upload folder.')
  }
  const indexedProducts = indexedResult.status === 'fulfilled' ? indexedResult.value : []
  const publicProducts = publicResult.status === 'fulfilled' ? publicResult.value : []
  const publicIds = new Set(publicProducts.map((product) => product.id))
  return [
    ...publicProducts,
    ...indexedProducts.filter((product) => !publicIds.has(product.id)),
  ]
}

export async function saveLocalProduct(product) {
  const { imageFile, pdfFile, ...metadata } = product
  const uploads = [
    imageFile && ['image', imageFile],
    pdfFile && ['pdf', pdfFile],
  ].filter(Boolean)

  if (!uploads.length) throw new Error('Choose an image or PDF to upload.')

  let savedOneOrMore = false
  try {
    for (const [kind, file] of uploads) {
      let response
      try {
        response = await fetch(`/api/local-uploads/${encodeURIComponent(product.id)}/${kind}`, {
          method: 'POST',
          headers: {
            'content-type': kind === 'pdf' ? 'application/pdf' : file.type,
            'x-file-name': encodeURIComponent(file.name),
            'x-product-metadata': encodeURIComponent(JSON.stringify(metadata)),
          },
          body: file,
        })
      } catch (error) {
        throw new Error(
          `Could not connect to the local upload server. Start the website with npm run dev. ${error.message}`,
          { cause: error }
        )
      }
      let result = {}
      try {
        result = await response.json()
      } catch {
        // The static site has no upload API; report that clearly below.
      }
      if (!response.ok) {
        const message = result.error ?? (response.status === 404
          ? 'The upload server is not running. Start this project with npm run dev, then use its /lala admin page.'
          : 'Could not save this upload.')
        throw new Error(message)
      }
      savedOneOrMore = true
    }
  } finally {
    if (savedOneOrMore) notifyLocalProductsChanged()
  }
}

export async function deleteLocalProduct(id) {
  return deleteLocalProducts([id])
}

export async function deleteLocalProducts(ids) {
  if (!ids.length) return
  const publicProducts = await getPublicProducts()
  const publicIds = new Set(publicProducts.map((product) => product.id))
  for (const id of ids.filter((productId) => publicIds.has(productId))) {
    const response = await fetch(`/api/local-uploads/${encodeURIComponent(id)}/pdf`, { method: 'DELETE' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? 'Could not delete the uploaded product from public.')
    notifyLocalProductsChanged()
  }

  const indexedIds = ids.filter((id) => !publicIds.has(id))
  if (!indexedIds.length) return
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readwrite')
    const store = transaction.objectStore(STORE)
    indexedIds.forEach((id) => store.delete(id))
    transaction.oncomplete = () => {
      database.close()
      notifyLocalProductsChanged()
      resolve()
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error ?? new Error('Could not delete the selected products.'))
    }
  })
}

export async function deleteLocalSectionProducts(section) {
  const [indexedResult, publicResult] = await Promise.allSettled([getIndexedProducts(), getPublicProducts()])
  if (indexedResult.status === 'rejected' || publicResult.status === 'rejected') {
    throw new Error('Could not verify every product store, so the section was left unchanged. Try again from the same browser address used for uploads.')
  }
  const publicIds = new Set(publicResult.value.map((product) => product.id))
  const products = [
    ...publicResult.value,
    ...indexedResult.value.filter((product) => !publicIds.has(product.id)),
  ]
  const matchingProducts = products.filter((product) => section.types.includes(product.type))
  await deleteLocalProducts(matchingProducts.map((product) => product.id))
}

export function getLocalProductCategory(product) {
  if (product.category) return product.category

  const categoryByType = {
    custom: 'Wedding Cards',
    fancy: 'Wedding Cards',
    normal: 'Wedding Cards',
    offer: 'Wedding Cards',
    offers: 'Offers',
    boxes: 'Paper Boxes',
    ecommerce: 'E-commerce Boxes',
    paper: 'Paper Boxes',
    bags: 'Shopping Bags',
    stickers: 'Stickers & Labels',
    cards: 'Cards & Stationery',
    gift: 'Gift Boxes & Wraps',
    accessories: 'Packaging Accessories',
  }
  return categoryByType[product.type] ?? ''
}
