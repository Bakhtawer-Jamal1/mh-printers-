import { useEffect, useState } from 'react'
import { getHiddenWeddingCards } from '../data/localCatalog.js'

export default function useHiddenWeddingCards() {
  const [hiddenCards, setHiddenCards] = useState(getHiddenWeddingCards)

  useEffect(() => {
    const refresh = () => setHiddenCards(getHiddenWeddingCards())
    window.addEventListener('mh-wedding-cards-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('mh-wedding-cards-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return hiddenCards
}
