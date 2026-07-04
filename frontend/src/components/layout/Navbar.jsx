import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, LogOut, Package } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) { navigate(`/products?search=${searchQuery}`); setSearchQuery('') }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900">ShopEase</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                placeholder="Search products..." />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Products</Link>
            {isLoggedIn() ? (
              <>
                <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                  <Package className="w-4 h-4" />Orders
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-medium">{cart.itemCount}</span>}
                </Link>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">{user?.name?.[0]?.toUpperCase()}</div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut className="w-4 h-4" /></button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-50">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field text-sm" placeholder="Search products..." />
            <button type="submit" className="btn-primary px-4 py-2 text-sm">Go</button>
          </form>
          <Link to="/products" className="block py-2 text-sm font-medium text-gray-700">Products</Link>
          {isLoggedIn() ? (
            <>
              <Link to="/cart" className="block py-2 text-sm font-medium text-gray-700">Cart ({cart.itemCount})</Link>
              <Link to="/orders" className="block py-2 text-sm font-medium text-gray-700">My Orders</Link>
              <button onClick={handleLogout} className="block py-2 text-sm font-medium text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-sm font-medium text-gray-700">Login</Link>
              <Link to="/register" className="block py-2 text-sm font-medium text-primary-600">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}