import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { productAPI, categoryAPI } from '../../services/api'
import ProductCard from '../../components/common/ProductCard'
import Pagination from '../../components/common/Pagination'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('category') || ''

  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data.data)) }, [])

  useEffect(() => {
    setLoading(true)
    const fetch = search
      ? productAPI.search(search, page)
      : categoryId
        ? productAPI.getByCategory(categoryId, page)
        : productAPI.getAll(page)
    fetch.then(r => {
      const d = r.data.data
      setProducts(d.content)
      setPagination({ totalPages: d.totalPages, totalElements: d.totalElements })
    }).finally(() => setLoading(false))
  }, [search, categoryId, page])

  const clearFilter = () => { setSearchParams({}); setPage(0) }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Categories</h3>
            </div>
            <ul className="space-y-1">
              <li>
                <button onClick={clearFilter}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!categoryId && !search ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button onClick={() => { setSearchParams({ category: cat.id }); setPage(0) }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${categoryId == cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat.name}
                    <span className="float-right text-xs text-gray-400">{cat.productCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">
                {search ? `Results for "${search}"` : categoryId ? categories.find(c=>c.id==categoryId)?.name || 'Products' : 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{pagination.totalElements} products found</p>
            </div>
            {(search || categoryId) && (
              <button onClick={clearFilter} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors">
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
          </div>

          {loading ? <LoadingSpinner /> : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
              <button onClick={clearFilter} className="mt-4 btn-primary text-sm">Browse all products</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}