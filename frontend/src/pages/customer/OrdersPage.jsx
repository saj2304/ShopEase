import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { orderAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'

const statusColors = {
  PENDING:'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID:'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING:'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED:'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED:'bg-green-50 text-green-700 border-green-200',
  CANCELLED:'bg-red-50 text-red-700 border-red-200',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    orderAPI.myOrders(page).then(r => {
      const d = r.data.data
      setOrders(d.content); setTotalPages(d.totalPages)
    }).finally(() => setLoading(false))
  }, [page])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card overflow-hidden">
              <div className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge border px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span>
                  {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-3">Shipping to: {order.shippingAddress}</p>
                  <div className="space-y-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                        <span className="font-medium text-gray-900">₹{parseFloat(item.totalPrice).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}