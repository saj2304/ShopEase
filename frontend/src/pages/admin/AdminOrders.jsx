import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import { adminAPI } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'

const statusOptions = ['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED']
const statusColors = { PENDING:'bg-yellow-50 text-yellow-700',PAID:'bg-blue-50 text-blue-700',PROCESSING:'bg-purple-50 text-purple-700',SHIPPED:'bg-indigo-50 text-indigo-700',DELIVERED:'bg-green-50 text-green-700',CANCELLED:'bg-red-50 text-red-700' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [expanded, setExpanded] = useState(null)

  const fetch = () => {
    setLoading(true)
    adminAPI.getAllOrders(page).then(r => {
      const d = r.data.data; setOrders(d.content); setTotalPages(d.totalPages)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page])

  const handleStatusChange = async (id, status) => {
    try { await adminAPI.updateStatus(id, status); toast.success('Status updated'); fetch() }
    catch { toast.error('Failed to update') }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and update customer orders</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                      <p className="text-xs text-gray-500 truncate">{order.customerName} · {order.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span>
                    <select value={order.status}
                      onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value) }}
                      onClick={e => e.stopPropagation()}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${statusColors[order.status] || 'bg-gray-50 text-gray-600'}`}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                    {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-3">Shipping: {order.shippingAddress}</p>
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
      </main>
    </div>
  )
}