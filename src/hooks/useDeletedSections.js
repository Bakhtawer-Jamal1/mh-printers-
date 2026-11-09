import { useEffect, useState } from 'react'
import { getDeletedSections } from '../data/localCatalog.js'

export default function useDeletedSections() {
  const [deletedSections, setDeletedSections] = useState(getDeletedSections)

  useEffect(() => {
    const refresh = () => setDeletedSections(getDeletedSections())
    window.addEventListener('mh-local-sections-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('mh-local-sections-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return deletedSections
}
