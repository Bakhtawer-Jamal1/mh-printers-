import { useCallback, useEffect, useState } from 'react'
import { getLocalProducts } from '../data/localCatalog.js'

export default function useLocalProducts() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const savedProducts = await getLocalProducts()
      setProducts(savedProducts)
      setError('')
    } catch (loadError) {
      setProducts([])
      setError(loadError.message || 'Could not load saved products.')
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(refresh)
    const onProductsChanged = () => refresh()
    const onStorageChanged = (event) => {
      if (event.key === 'mh-local-products-version') refresh()
    }
    window.addEventListener('mh-local-products-changed', onProductsChanged)
    window.addEventListener('storage', onStorageChanged)
    return () => {
      window.removeEventListener('mh-local-products-changed', onProductsChanged)
      window.removeEventListener('storage', onStorageChanged)
    }
  }, [refresh])

  return { products, error, refresh }
}
