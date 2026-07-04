import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  const handleRemove = async (pid) => {
    await removeFromCart(pid); toast.success('Removed from cart')
  }
  const handleQty = async (pid, qty) => {
    if (qty < 1) return; await updateQuantity(pid, qty)
  }

  if (cart.items?.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2">Browse Products <ArrowRight className="w-4 h-4" /></Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {cart.items?.map(item => (
            <div key={item.productId} className="card p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-200"><ShoppingBag className="w-6 h-6" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-primary-600 font-bold mt-1">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => handleQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">−</button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => handleQty(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50">+</button>
                </div>
                <button onClick={() => handleRemove(item.productId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {cart.items?.map(item => (
              <div key={item.productId} className="flex justify-between text-gray-600">
                <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium whitespace-nowrap">₹{parseFloat(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span className="text-primary-600">₹{parseFloat(cart.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full btn-primary mt-5 py-3 text-sm font-semibold flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
          <Link to="/products" className="block text-center text-xs text-gray-400 hover:text-primary-600 mt-3 transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}