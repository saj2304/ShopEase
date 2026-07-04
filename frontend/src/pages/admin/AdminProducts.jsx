import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { adminAPI, categoryAPI } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'

const empty = { name:'', description:'', price:'', discountPrice:'', stock:'', imageUrl:'', categoryId:'' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const fetchProducts = () => {
    setLoading(true)
    adminAPI.dashboard().then(() => {})
    import('../../services/api').then(({ productAPI }) =>
      productAPI.getAll(page).then(r => {
        const d = r.data.data; setProducts(d.content); setTotalPages(d.totalPages)
      })
    ).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [page])
  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.data)) }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (p) => { setEditing(p.id); setForm({ name:p.name, description:p.description||'', price:p.price, discountPrice:p.discountPrice||'', stock:p.stock, imageUrl:p.imageUrl||'', categoryId:p.categoryId }); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await adminAPI.updateProduct(editing, form); toast.success('Product updated') }
      else { await adminAPI.createProduct(form); toast.success('Product created') }
      setModal(false); fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await adminAPI.deleteProduct(id); toast.success('Deleted'); fetchProducts()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your product catalog</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product','Category','Price','Stock','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg" onError={e=>e.target.style.display='none'} />}
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{p.description?.slice(0,50)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.categoryName}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">₹{parseFloat(p.discountPrice||p.price).toLocaleString('en-IN')}</span>
                      {p.discountPrice && <span className="text-xs text-gray-400 line-through ml-1">₹{parseFloat(p.price).toLocaleString('en-IN')}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {[['name','Product Name','text',true],['price','Price (₹)','number',true],['discountPrice','Discount Price (₹)','number',false],['stock','Stock','number',true],['imageUrl','Image URL','url',false]].map(([key,label,type,req]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} required={req} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="input-field text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select required value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} className="input-field text-sm">
                    <option value="">Select category</option>
                    {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="input-field text-sm resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}