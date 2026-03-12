import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({ currentPage, totalPages, itemsPerPage, setItemsPerPage, setCurrentPage }) {
    return (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-slate-800/50 border border-purple-400/30 rounded-xl">
            <div className="flex items-center gap-2">
                <label className="text-sm text-purple-300">Items per page:</label>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))} className="px-3 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white text-sm">
                    {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 hover:bg-purple-600/20 disabled:opacity-50 rounded">
                    <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-purple-300">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 hover:bg-purple-600/20 disabled:opacity-50 rounded">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
