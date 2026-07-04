import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw, HeadphonesIcon } from 'lucide-react'
import { productAPI, categoryAPI } from '../../services/api'
import ProductCard from '../../components/common/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Razorpay protected checkout' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Always here to help you' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([productAPI.getAll(0, 8), categoryAPI.getAll()]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.data.content)
      setCategories(cRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-6">New Season Arrivals</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Shop Smart,<br />Live Better.
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">Discover thousands of products at unbeatable prices. Fast delivery, easy returns, and secure payments.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-full hover:bg-primary-50 transition-colors shadow-lg">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link to="/products" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`}
                className="group relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover:from-primary-100 hover:to-primary-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.productCount} products</p>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}