import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}
        className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => onPageChange(i)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${i === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:border-primary-500 hover:text-primary-600'}`}>
          {i + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-lg border border-gray-200 hover:border-primary-500 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}