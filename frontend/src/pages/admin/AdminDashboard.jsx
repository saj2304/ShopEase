import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, IndianRupee, TrendingUp, Clock } from 'lucide-react'
import { adminAPI } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const statusColors = { PENDING:'bg-yellow-50 text-yellow-700', PAID:'bg-blue-50 text-blue-700', DELIVERED:'bg-green-50 text-green-700', CANCELLED:'bg-red-50 text-red-700', PROCESSING:'bg-purple-50 text-purple-700', SHIPPED:'bg-indigo-50 text-indigo-700' }

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { adminAPI.dashboard().then(r => setData(r.data.data)).finally(() => setLoading(false)) }, [])

  const stats = data ? [
    { label:'Total Revenue', value:`₹${parseFloat(data.totalRevenue||0).toLocaleString('en-IN')}`, icon:IndianRupee, color:'text-green-600', bg:'bg-green-50' },
    { label:'Total Orders', value:data.totalOrders, icon:ShoppingCart, color:'text-blue-600', bg:'bg-blue-50' },
    { label:'Total Products', value:data.totalProducts, icon:Package, color:'text-purple-600', bg:'bg-purple-50' },
    { label:'Total Users', value:data.totalUsers, icon:Users, color:'text-orange-600', bg:'bg-orange-50' },
    { label:'Pending Orders', value:data.pendingOrders, icon:Clock, color:'text-yellow-600', bg:'bg-yellow-50' },
    { label:'Delivered Orders', value:data.deliveredOrders, icon:TrendingUp, color:'text-teal-600', bg:'bg-teal-50' },
  ] : []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {stats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {data.recentOrders?.map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-50 text-gray-600'}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}