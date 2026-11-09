import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import About from './pages/About.jsx'
import Offers from './pages/Offers.jsx'
import Contact from './pages/Contact.jsx'
import BigBoxes from './pages/BigBoxes.jsx'
import Admin from './pages/Admin.jsx'
import RouteMetadata from './components/RouteMetadata.jsx'
import NotFound from './pages/NotFound.jsx'
import { WeddingCardsHome, WeddingCategory } from './pages/WeddingCards.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <RouteMetadata />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wedding-cards" element={<WeddingCardsHome />} />
          <Route path="/wedding-cards/custom" element={<WeddingCategory category="custom" />} />
          <Route path="/wedding-cards/fancy" element={<WeddingCategory category="fancy" />} />
          <Route path="/wedding-cards/normal" element={<WeddingCategory category="normal" />} />
          <Route path="/wedding-cards/special-offers" element={<WeddingCategory category="offer" />} />
          <Route path="/big-boxes" element={<BigBoxes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {import.meta.env.DEV && <Route path="/lala" element={<Admin />} />}
      </Routes>
    </>
  )
}
