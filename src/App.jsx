import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import FragPage from './pages/FragPage'
import CategoryPage from './pages/CategoryPage'
import AccountPage from './pages/AccountPage'
import AboutPage from './pages/AboutPage'
import StockFormPage from './pages/StockFormPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="app">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="shop-main">
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/frags/:id" element={<FragPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stockroom/new" element={<StockFormPage />} />
          <Route path="/stockroom/:id/edit" element={<StockFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
