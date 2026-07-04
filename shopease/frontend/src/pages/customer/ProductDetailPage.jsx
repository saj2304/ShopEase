import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Package, Tag } from 'lucide-react'
import { productAPI } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    productAPI.getById(id).then(r => setProduct(r.data.data)).finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isLoggedIn()) { navigate('/login'); return }
    setAdding(true)
    try {
      await addToCart(product.id, qty)
      toast.success('Added to cart!')
    } catch { toast.error('Failed to add') } finally { setAdding(false) }
  }

  if (loading) return <LoadingSpinner />
  if (!product) return <div className="text-center py-20"><p className="text-gray-500">Product not found</p></div>

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : null
  const finalPrice = product.discountPrice || product.price

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="card overflow-hidden bg-gray-50 aspect-square">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-200"><Package className="w-20 h-20" /></div>
          }
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />{product.categoryName}
              </span>
              {discount && <span className="badge bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">-{discount}% OFF</span>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">₹{parseFloat(finalPrice).toLocaleString('en-IN')}</span>
            {product.discountPrice && <span className="text-lg text-gray-400 line-through">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>}
          </div>

          {product.description && <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg font-light transition-colors">−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg font-light transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 text-sm font-semibold disabled:opacity-60">
                <ShoppingCart className="w-4 h-4" />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          <div className="border-t border-gray-100 pt-5 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div><span className="font-medium text-gray-700">Category</span><br/>{product.categoryName}</div>
            <div><span className="font-medium text-gray-700">Stock</span><br/>{product.stock} units</div>
          </div>
        </div>
      </div>
    </div>
  )
}