import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    if (!address.trim()) { toast.error('Please enter shipping address'); return }
    setLoading(true)
    try {
      const items = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      const res = await orderAPI.place({ items, shippingAddress: address })
      const { razorpayOrderId, amount, keyId, orderId } = res.data.data

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        name: 'ShopEase',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await orderAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            await clearCart()
            toast.success('Payment successful! Order placed.')
            navigate('/orders')
          } catch { toast.error('Payment verification failed') }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#0284c7' },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={4}
              className="input-field resize-none"
              placeholder="House/Flat No., Street, Area, City, State, PIN Code" />
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Payment</h2>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-5 h-5" onError={e=>e.target.style.display='none'} />
              <div>
                <p className="text-sm font-medium text-gray-900">Razorpay — Secure Payment</p>
                <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Test card: 4111 1111 1111 1111 | Exp: Any | CVV: Any</p>
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-gray-900">Order Summary</h2>
          </div>
          <div className="space-y-3 mb-4">
            {cart.items?.map(item => (
              <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{parseFloat(item.subtotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="text-primary-600 text-lg">₹{parseFloat(cart.total).toLocaleString('en-IN')}</span>
          </div>
          <button onClick={handlePlaceOrder} disabled={loading || !cart.items?.length}
            className="w-full btn-primary mt-5 py-3.5 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">Secured by Razorpay</p>
        </div>
      </div>
    </div>
  )
}