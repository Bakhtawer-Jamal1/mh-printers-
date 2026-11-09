import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  Check,
  FilePlus2,
  ImagePlus,
  LockKeyhole,
  Layers3,
  LogOut,
  Settings,
  ShieldAlert,
  Trash2,
  Upload,
} from 'lucide-react'
import LocalProductCard from '../components/LocalProductCard.jsx'
import {
  changeLocalAdminPassword,
  createLocalAdminPassword,
  hasLocalAdminPassword,
  verifyLocalAdminPassword,
} from '../data/adminAuth.js'
import { readBrowserSetting, writeBrowserSetting } from '../data/browserStorage.js'
import {
  deleteLocalSection,
  deleteLocalSectionProducts,
  deleteLocalProducts,
  getLocalProducts,
  restoreLocalSections,
  saveLocalProduct,
  setWeddingCardHidden,
} from '../data/localCatalog.js'
import { categories } from '../data/products.js'
import { weddingPdfCatalogs } from '../data/wedding.js'
import useDeletedSections from '../hooks/useDeletedSections.js'
import useHiddenWeddingCards from '../hooks/useHiddenWeddingCards.js'

const productTypes = [
  ...categories.map(({ id, name }) => [id, name]),
  ['custom', 'Wedding cards — Custom'],
  ['fancy', 'Wedding cards — Fancy'],
  ['normal', 'Wedding cards — Simple'],
  ['offer', 'Wedding cards — Offers'],
  ['offers', 'Offers page'],
  ['boxes', 'Bidd Boxes'],
]

const managedSections = [
  ...categories.map(({ id, name }) => ({ id, name, types: [id] })),
  { id: 'custom', name: 'Wedding cards — Custom', types: ['custom'] },
  { id: 'fancy', name: 'Wedding cards — Fancy', types: ['fancy'] },
  { id: 'normal', name: 'Wedding cards — Simple', types: ['normal'] },
  { id: 'offer', name: 'Wedding cards — Offers', types: ['offer'] },
  { id: 'offers', name: 'Offers page', types: ['offers'] },
  { id: 'boxes', name: 'Bidd Boxes', types: ['boxes', 'ecommerce', 'paper'] },
]

const maximumImageSize = 20 * 1024 * 1024
const maximumPdfSize = 75 * 1024 * 1024
const posterSettingKey = 'mh-special-offer-hidden'

function isImageFile(file) {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'].includes(file.type)
}

function getCategoryLabel(type) {
  if (['custom', 'fancy', 'normal', 'offer'].includes(type)) return 'Wedding Cards'
  if (type === 'offers') return 'Offers'
  if (type === 'boxes') return 'Paper Boxes'
  return categories.find((category) => category.id === type)?.name ?? type
}

function LocalAdminGate({ onAuthenticated }) {
  const [passwordReady, setPasswordReady] = useState(() => hasLocalAdminPassword())
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = event.currentTarget
    const data = new FormData(form)
    const password = String(data.get('password') ?? '')

    try {
      if (!passwordReady) {
        if (password !== data.get('confirmPassword')) {
          setError('The passwords do not match.')
          return
        }
        await createLocalAdminPassword(password)
        setPasswordReady(true)
        form.reset()
        onAuthenticated()
        return
      }

      const result = await verifyLocalAdminPassword(password)
      if (result.valid) {
        form.reset()
        onAuthenticated()
      } else if (result.lockedUntil > Date.now()) {
        setError(`Too many attempts. Try again after ${new Date(result.lockedUntil).toLocaleTimeString()}.`)
      } else {
        setError('That password is not correct.')
      }
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-5 py-12">
      <div className="rounded-3xl border border-white/20 bg-[#08234f]/90 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-9">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#15396f] text-amber-200">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-amber-200">MH PRINTERS · LOCAL ADMIN</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          {passwordReady ? 'Admin sign in' : 'Set up your admin password'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-blue-100/85">
          {passwordReady
            ? 'Sign in to manage items saved in this browser.'
            : 'Create a password with at least 12 characters for this browser.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold">
            {passwordReady ? 'Password' : 'Initial password'}
            <input
              name="password"
              type="password"
              autoComplete={passwordReady ? 'current-password' : 'new-password'}
              minLength={passwordReady ? undefined : 12}
              required
              className="mt-1.5 w-full rounded-xl border border-white/20 bg-[#061a3a] px-4 py-3 text-sm text-white placeholder:text-blue-100/50"
              placeholder="Enter your password"
            />
          </label>
          {!passwordReady && (
            <label className="block text-xs font-semibold">
              Confirm password
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-[#061a3a] px-4 py-3 text-sm text-white placeholder:text-blue-100/50"
                placeholder="Enter it again"
              />
            </label>
          )}
          {error && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-sm text-red-100">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12356d] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0d615c] disabled:cursor-wait disabled:opacity-60"
          >
            <LockKeyhole size={16} />
            {busy ? 'Checking…' : passwordReady ? 'Unlock admin' : 'Save password and continue'}
          </button>
        </form>

        <div className="mt-6 flex gap-3 rounded-xl border border-amber-200/25 bg-amber-100/10 p-4 text-xs leading-relaxed text-amber-50">
          <ShieldAlert className="mt-0.5 shrink-0 text-amber-200" size={17} />
          <p>
            This is a local-browser lock, not server security. Password verification is hashed, but anyone with access to this browser can inspect its local data. Uploads are not published or synced to other devices.
          </p>
        </div>
      </div>
    </main>
  )
}

function PasswordSettings() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const changePassword = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    const form = event.currentTarget
    const data = new FormData(form)
    const newPassword = String(data.get('newPassword') ?? '')
    if (newPassword !== data.get('confirmPassword')) {
      setError('The new passwords do not match.')
      return
    }

    setBusy(true)
    try {
      const result = await changeLocalAdminPassword(
        String(data.get('currentPassword') ?? ''),
        newPassword
      )
      if (!result.valid) {
        setError(result.lockedUntil > Date.now()
          ? `Too many attempts. Try again after ${new Date(result.lockedUntil).toLocaleTimeString()}.`
          : 'The current password is not correct.')
        return
      }
      form.reset()
      setMessage('Password updated for this browser.')
    } catch (changeError) {
      setError(changeError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={changePassword} className="max-w-xl space-y-4 rounded-2xl border border-white/15 bg-[#0b2b62]/70 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-white">Change admin password</h2>
      <label className="block text-xs font-semibold text-blue-50">
        Current password
        <input name="currentPassword" type="password" autoComplete="current-password" required className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" />
      </label>
      <label className="block text-xs font-semibold text-blue-50">
        New password (at least 12 characters)
        <input name="newPassword" type="password" autoComplete="new-password" minLength={12} required className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" />
      </label>
      <label className="block text-xs font-semibold text-blue-50">
        Confirm new password
        <input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-sm text-red-100">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-950/50 p-3 text-sm text-emerald-100">{message}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#12356d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d615c] disabled:opacity-60">
        <Check size={16} /> {busy ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [items, setItems] = useState([])
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [activeTab, setActiveTab] = useState('products')
  const [itemSectionFilter, setItemSectionFilter] = useState('all')
  const [showPoster, setShowPoster] = useState(() => readBrowserSetting(posterSettingKey) !== 'true')
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedWeddingCatalogId, setSelectedWeddingCatalogId] = useState('ameen-fancy')
  const [weddingCardSearch, setWeddingCardSearch] = useState('')
  const deletedSections = useDeletedSections()
  const hiddenWeddingCards = useHiddenWeddingCards()
  const builtInWeddingPdfs = Object.entries(weddingPdfCatalogs).flatMap(([section, catalogs]) =>
    catalogs.map((catalog) => ({ ...catalog, section }))
  )
  const selectedWeddingCatalog = builtInWeddingPdfs.find((catalog) => catalog.id === selectedWeddingCatalogId)
  const visibleWeddingCards = selectedWeddingCatalog?.pages.filter((card) =>
    !weddingCardSearch || String(card.pdfPage) === weddingCardSearch.trim()
  ) ?? []
  const filteredItems = itemSectionFilter === 'all'
    ? items
    : items.filter((item) => item.type === itemSectionFilter)

  const refreshItems = useCallback(async () => {
    const savedItems = await getLocalProducts()
    setItems(savedItems.sort((a, b) => b.createdAt - a.createdAt))
    setSelectedIds(new Set())
    setLoadError('')
  }, [])

  useEffect(() => {
    if (!authenticated) return undefined
    const refresh = () => refreshItems().catch((error) => setLoadError(error.message))
    const refreshFromStorage = (event) => {
      if (event.key === 'mh-local-products-version') refresh()
    }
    refresh()
    window.addEventListener('mh-local-products-changed', refresh)
    window.addEventListener('storage', refreshFromStorage)
    return () => {
      window.removeEventListener('mh-local-products-changed', refresh)
      window.removeEventListener('storage', refreshFromStorage)
    }
  }, [authenticated, refreshItems])

  const addProduct = async (event) => {
    event.preventDefault()
    setFormError('')
    const form = event.currentTarget
    const data = new FormData(form)
    const imageValue = data.get('image')
    const pdfValue = data.get('pdf')
    const imageFile = imageValue instanceof File && imageValue.size ? imageValue : null
    const pdfFile = pdfValue instanceof File && pdfValue.size ? pdfValue : null

    if (!imageFile && !pdfFile) {
      setFormError('Choose an image, a PDF, or both.')
      return
    }
    if (imageFile && !isImageFile(imageFile)) {
      setFormError('Choose a JPG, PNG, WebP, AVIF or GIF image.')
      return
    }
    if (pdfFile && pdfFile.type !== 'application/pdf' && !pdfFile.name.toLowerCase().endsWith('.pdf')) {
      setFormError('The document must be a PDF file.')
      return
    }
    if (imageFile && imageFile.size > maximumImageSize) {
      setFormError('Images must be 20 MB or smaller.')
      return
    }
    if (pdfFile && pdfFile.size > maximumPdfSize) {
      setFormError('PDF files must be 75 MB or smaller.')
      return
    }

    const type = String(data.get('type'))
    setSaving(true)
    try {
      await saveLocalProduct({
        id: crypto.randomUUID(),
        name: String(data.get('name') ?? '').trim(),
        type,
        category: getCategoryLabel(type),
        unit: String(data.get('unit') ?? '').trim(),
        description: String(data.get('description') ?? '').trim(),
        imageFile,
        pdfFile,
        pdfName: pdfFile?.name ?? '',
        createdAt: Date.now(),
      })
      await refreshItems()
      form.reset()
    } catch (error) {
      await refreshItems().catch(() => {})
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const removeSelected = async () => {
    if (!selectedIds.size) return
    if (!window.confirm(`Permanently delete ${selectedIds.size} selected item${selectedIds.size === 1 ? '' : 's'} from this project?`)) return

    try {
      await deleteLocalProducts([...selectedIds])
      await refreshItems()
    } catch (error) {
      await refreshItems().catch(() => {})
      setLoadError(error.message)
    }
  }

  const removeItem = async (item) => {
    if (!window.confirm(`Permanently delete "${item.name}" from this project? This cannot be undone.`)) return
    try {
      await deleteLocalProducts([item.id])
      await refreshItems()
    } catch (error) {
      await refreshItems().catch(() => {})
      setLoadError(error.message)
    }
  }

  const toggleWeddingCard = (catalog, card) => {
    const hidden = (hiddenWeddingCards[catalog.id] ?? []).includes(card.pdfPage)
    if (!window.confirm(`${hidden ? 'Restore' : 'Hide'} card ${card.pdfPage} in "${catalog.title}" on this browser? The original PDF file will not be changed.`)) return
    try {
      setWeddingCardHidden(catalog.id, card.pdfPage, !hidden)
    } catch (error) {
      setLoadError(error.message)
    }
  }

  const removeSection = async (section) => {
    if (deletedSections.includes(section.id)) return
    const confirmed = window.confirm(
      `Delete the "${section.name}" section and all its uploaded items from this project? Uploaded items cannot be restored.`
    )
    if (!confirmed) return

    try {
      await deleteLocalSectionProducts(section)
      deleteLocalSection(section.id)
      if (section.id === 'wedding') {
        for (const id of ['custom', 'fancy', 'normal', 'offer']) deleteLocalSection(id)
      }
      if (section.id === 'boxes') {
        for (const id of ['ecommerce', 'paper']) deleteLocalSection(id)
      }
      await refreshItems()
    } catch (error) {
      await refreshItems().catch(() => {})
      setLoadError(error.message)
    }
  }

  const restoreSection = (section) => {
    const relatedSections = section.id === 'wedding'
      ? ['wedding', 'custom', 'fancy', 'normal', 'offer']
      : section.id === 'boxes'
        ? ['boxes', 'ecommerce', 'paper']
        : [section.id]
    try {
      restoreLocalSections(relatedSections)
      setLoadError('')
    } catch (error) {
      setLoadError(error.message)
    }
  }

  const toggleItem = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const togglePoster = (event) => {
    const visible = event.target.checked
    setShowPoster(visible)
    writeBrowserSetting(posterSettingKey, visible ? 'false' : 'true')
    window.dispatchEvent(new Event('mh-site-settings'))
  }

  if (!authenticated) {
    return <LocalAdminGate onAuthenticated={() => setAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-200">MH PRINTERS · LOCAL ADMIN</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Admin panel</h1>
          </div>
          <button type="button" onClick={() => setAuthenticated(false)} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#08234f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15396f]">
            <LogOut size={16} /> Sign out
          </button>
        </header>

        <div className="mt-6 flex gap-3 rounded-xl border border-amber-200/25 bg-amber-100/10 p-4 text-sm leading-relaxed text-amber-50">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-200" size={18} />
          <p>
            Uploads are written to this project’s public/uploads folder; PDF pages are automatically converted to images. Changes appear in this local project and require a new deployment to reach the live website. The password screen is a browser-local lock, not server-side authentication.
          </p>
        </div>

        <nav className="mt-7 flex flex-wrap gap-2" aria-label="Admin sections">
          <button type="button" onClick={() => setActiveTab('products')} aria-current={activeTab === 'products' ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'products' ? 'bg-[#12356d] text-white shadow-lg' : 'border border-white/15 bg-[#08234f] text-blue-100 hover:bg-[#15396f]'}`}>
            <Upload size={16} /> Products
          </button>
          <button type="button" onClick={() => setActiveTab('sections')} aria-current={activeTab === 'sections' ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'sections' ? 'bg-[#12356d] text-white shadow-lg' : 'border border-white/15 bg-[#08234f] text-blue-100 hover:bg-[#15396f]'}`}>
            <Layers3 size={16} /> Sections
          </button>
          <button type="button" onClick={() => setActiveTab('delete-items')} aria-current={activeTab === 'delete-items' ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'delete-items' ? 'bg-[#7e1d2b] text-white shadow-lg' : 'border border-white/15 bg-[#08234f] text-blue-100 hover:bg-[#15396f]'}`}>
            <Trash2 size={16} /> Delete products
          </button>
          <button type="button" onClick={() => setActiveTab('settings')} aria-current={activeTab === 'settings' ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'settings' ? 'bg-[#12356d] text-white shadow-lg' : 'border border-white/15 bg-[#08234f] text-blue-100 hover:bg-[#15396f]'}`}>
            <Settings size={16} /> Settings
          </button>
        </nav>

        {activeTab === 'settings' ? (
          <section className="mt-6 space-y-6">
            <div className="max-w-xl rounded-2xl border border-white/15 bg-[#0b2b62]/70 p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold">Home and Offers poster</h2>
              <p className="mt-1 text-sm text-blue-100/80">Show or hide the supplied offer image on the Home and Offers pages.</p>
              <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
                <input type="checkbox" checked={showPoster} onChange={togglePoster} className="h-4 w-4 accent-amber-300" />
                Show the poster
              </label>
            </div>
            <PasswordSettings />
          </section>
        ) : activeTab === 'sections' ? (
          <section className="mt-6 rounded-2xl border border-white/15 bg-[#0b2b62]/70 p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Delete sections</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-blue-100/80">
              Deleting a section removes its uploaded items and hides its built-in content. Restore brings the built-in content back; removed uploads stay deleted. To remove one design, use Products.
            </p>
            {loadError && <p role="alert" className="mt-4 rounded-xl bg-red-950/60 p-4 text-sm text-red-100">{loadError}</p>}
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {managedSections.map((section) => {
                const deleted = deletedSections.includes(section.id)
                const savedCount = items.filter((item) => section.types.includes(item.type)).length
                return (
                  <div key={section.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#061a3a]/70 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{section.name}</p>
                      <p className="mt-0.5 text-xs text-blue-100/70">{deleted ? 'Deleted' : `${savedCount} saved item${savedCount === 1 ? '' : 's'}`}</p>
                    </div>
                    {deleted ? (
                      <button type="button" onClick={() => restoreSection(section)} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#12356d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0d615c]">
                        Restore section
                      </button>
                    ) : (
                      <button type="button" onClick={() => removeSection(section)} aria-label={`Delete ${section.name} section`} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#7e1d2b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a32435]">
                        <Trash2 size={14} /> Delete section
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ) : activeTab === 'delete-items' ? (
          <section className="mt-6 rounded-2xl border border-white/15 bg-[#0b2b62]/70 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Delete products or individual wedding cards</h2>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-blue-100/80">
                  Choose a section, then delete only the specific saved product you want. Other products and the section stay unchanged.
                </p>
              </div>
              <label className="block min-w-52 text-xs font-semibold text-blue-50">
                Product section
                <select value={itemSectionFilter} onChange={(event) => setItemSectionFilter(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white">
                  <option value="all">All uploaded items ({items.length})</option>
                  {productTypes.map(([value, label]) => {
                    const count = items.filter((item) => item.type === value).length
                    return <option key={value} value={value}>{label} ({count})</option>
                  })}
                </select>
              </label>
            </div>
            {loadError && <p role="alert" className="mt-4 rounded-xl bg-red-950/60 p-4 text-sm text-red-100">{loadError}</p>}
            <section className="mt-6 rounded-xl border border-white/10 bg-[#061a3a]/55 p-4 sm:p-5">
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-60 flex-1 text-xs font-semibold text-blue-50">
                  Wedding PDF collection
                  <select
                    value={selectedWeddingCatalogId}
                    onChange={(event) => {
                      setSelectedWeddingCatalogId(event.target.value)
                      setWeddingCardSearch('')
                    }}
                    className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white"
                  >
                    {builtInWeddingPdfs.map((catalog) => (
                      <option key={catalog.id} value={catalog.id}>
                        {catalog.section === 'normal' ? 'Simple' : 'Fancy'} — {catalog.title} ({catalog.pages.length} cards)
                      </option>
                    ))}
                  </select>
                </label>
                <label className="w-full text-xs font-semibold text-blue-50 sm:w-44">
                  Find card number
                  <input
                    type="search"
                    inputMode="numeric"
                    value={weddingCardSearch}
                    onChange={(event) => setWeddingCardSearch(event.target.value.replace(/\D/g, ''))}
                    placeholder="For example: 14"
                    className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white placeholder:text-blue-100/45"
                  />
                </label>
              </div>
              {selectedWeddingCatalog && (
                <>
                  <p className="mt-3 text-xs leading-relaxed text-blue-100/75">
                    Hide or restore one card image at a time. This only changes the card previews on the website; it does not edit or delete the original PDF.
                  </p>
                  {visibleWeddingCards.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {visibleWeddingCards.map((card) => {
                        const hidden = (hiddenWeddingCards[selectedWeddingCatalog.id] ?? []).includes(card.pdfPage)
                        return (
                          <article key={card.pdfPage} className={`overflow-hidden rounded-xl border bg-[#08234f] ${hidden ? 'border-amber-300/50 opacity-70' : 'border-white/10'}`}>
                            <div className="flex aspect-square items-center justify-center bg-white p-2">
                              <img
                                src={card.image}
                                alt={`${selectedWeddingCatalog.title}, card ${card.pdfPage}`}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5">
                              <p className="text-xs font-semibold text-white">Card {card.pdfPage}{hidden ? ' · Hidden' : ''}</p>
                              <button
                                type="button"
                                onClick={() => toggleWeddingCard(selectedWeddingCatalog, card)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition ${hidden ? 'bg-[#12356d] hover:bg-[#0d615c]' : 'bg-[#7e1d2b] hover:bg-[#a32435]'}`}
                              >
                                {hidden ? 'Restore' : 'Hide card'}
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg border border-dashed border-white/15 p-5 text-center text-sm text-blue-100/70">
                      No card matches that number in this collection.
                    </p>
                  )}
                </>
              )}
            </section>
            {filteredItems.length ? (
              <ul className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#061a3a]/60">
                {filteredItems.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-xs text-blue-100/70">
                        {productTypes.find(([value]) => value === item.type)?.[1] ?? item.category ?? item.type}
                        {item.pdfName ? ` · ${item.pdfName}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#7e1d2b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a32435]"
                    >
                      <Trash2 size={14} /> Delete this product
                    </button>
                  </li>
                ))}
              </ul>
            ) : !loadError ? (
              <div className="mt-5 rounded-xl border border-dashed border-white/20 px-5 py-10 text-center text-sm text-blue-100/75">
                No uploaded products in this section. Wedding PDF card images can be managed above.
              </div>
            ) : null}
          </section>
        ) : (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <form onSubmit={addProduct} className="space-y-4 rounded-2xl border border-white/15 bg-[#0b2b62]/70 p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold">Add a product or design</h2>
              <label className="block text-xs font-semibold text-blue-50">
                Section
                <select name="type" className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" required>
                  {productTypes
                    .filter(([value]) => !managedSections.some((section) =>
                      deletedSections.includes(section.id) && section.types.includes(value)
                    ))
                    .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="block text-xs font-semibold text-blue-50">
                Product name
                <input name="name" required maxLength={100} className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" placeholder="Enter design or product name" />
              </label>
              <label className="block text-xs font-semibold text-blue-50">
                Product format (optional)
                <input name="unit" maxLength={40} className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" placeholder="Printed card, box, bag..." />
              </label>
              <label className="block text-xs font-semibold text-blue-50">
                Description (optional)
                <textarea name="description" rows="3" maxLength={500} className="mt-1.5 w-full resize-y rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white" placeholder="Add product details" />
              </label>
              <label className="block text-xs font-semibold text-blue-50">
                <span className="inline-flex items-center gap-1.5"><ImagePlus size={15} /> Product image (optional)</span>
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="mt-1.5 block w-full rounded-lg border border-white/20 bg-[#061a3a] p-2 text-xs text-white file:mr-3 file:rounded-md file:border-0 file:bg-[#12356d] file:px-3 file:py-2 file:text-white" />
              </label>
              <label className="block text-xs font-semibold text-blue-50">
                <span className="inline-flex items-center gap-1.5"><FilePlus2 size={15} /> PDF file (optional)</span>
                <input name="pdf" type="file" accept="application/pdf,.pdf" className="mt-1.5 block w-full rounded-lg border border-white/20 bg-[#061a3a] p-2 text-xs text-white file:mr-3 file:rounded-md file:border-0 file:bg-[#12356d] file:px-3 file:py-2 file:text-white" />
              </label>
              <p className="text-[11px] leading-relaxed text-blue-100/75">Images up to 20 MB and PDFs up to 75 MB are saved in public/uploads. PDFs are kept as originals and converted to page images for the website (up to 200 pages).</p>
              {formError && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-xs text-red-100">{formError}</p>}
              <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12356d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d615c] disabled:cursor-wait disabled:opacity-60">
                <Upload size={16} /> {saving ? 'Saving to public folder…' : 'Save item to public folder'}
              </button>
            </form>

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">Saved products and designs</h2>
                  <p className="mt-1 text-xs text-blue-100/70">Filter by section, then delete one item or select several.</p>
                </div>
                <label className="block min-w-48 text-xs font-semibold text-blue-50">
                  Show section
                  <select value={itemSectionFilter} onChange={(event) => {
                    setItemSectionFilter(event.target.value)
                    setSelectedIds(new Set())
                  }} className="mt-1.5 w-full rounded-lg border border-white/20 bg-[#061a3a] px-3 py-2.5 text-sm text-white">
                    <option value="all">All sections ({items.length})</option>
                    {productTypes.filter(([value]) => !managedSections.some((section) =>
                      deletedSections.includes(section.id) && section.types.includes(value)
                    )).map(([value, label]) => {
                      const count = items.filter((item) => item.type === value).length
                      return <option key={value} value={value}>{label} ({count})</option>
                    })}
                  </select>
                </label>
                {items.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setSelectedIds(new Set(filteredItems.map((item) => item.id)))} className="rounded-lg border border-white/20 bg-[#08234f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#15396f]">Select shown</button>
                    <button type="button" onClick={() => setSelectedIds(new Set())} className="rounded-lg border border-white/20 bg-[#08234f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#15396f]">Clear</button>
                    <button type="button" onClick={removeSelected} disabled={!selectedIds.size} className="inline-flex items-center gap-1.5 rounded-lg bg-[#7e1d2b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a32435] disabled:cursor-not-allowed disabled:opacity-45">
                      <Trash2 size={14} /> Delete selected ({selectedIds.size})
                    </button>
                  </div>
                )}
              </div>
              {loadError && <p role="alert" className="mb-4 rounded-xl bg-red-950/60 p-4 text-sm text-red-100">{loadError}</p>}
              {filteredItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-blue-50">
                          <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleItem(item.id)} className="h-4 w-4 accent-amber-300" />
                          Select item
                        </label>
                        <button type="button" onClick={() => removeItem(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#7e1d2b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a32435]">
                          <Trash2 size={14} /> Delete item
                        </button>
                      </div>
                      <LocalProductCard product={item} index={index} />
                    </div>
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[#0b2b62]/50 px-5 py-10 text-center text-sm text-blue-100/75">
                  No saved items in this section.
                </div>
              ) : !loadError ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[#0b2b62]/50 px-5 py-10 text-center text-sm text-blue-100/75">
                  No uploaded products found. Admin uploads are tied to this exact browser address; switch back to the address used when they were added (for example, localhost versus 127.0.0.1).
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
