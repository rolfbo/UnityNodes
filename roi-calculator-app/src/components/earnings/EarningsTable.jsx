import { Edit2, Trash2, Check, X } from 'lucide-react';

export function EarningsTable({ 
    paginatedEarnings, editingId, editForm, setEditForm,
    handleStartEdit, handleSaveEdit, handleCancelEdit, handleDelete,
    selectedEarningIds, toggleSelect, toggleSelectAll
}) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-purple-600/20 border-b border-purple-400/30">
                    <tr>
                        <th className="px-4 py-3 text-left"><input type="checkbox" onChange={toggleSelectAll} className="w-4 h-4" /></th>
                        <th className="px-4 py-3 text-left text-purple-300 font-semibold text-sm">Date</th>
                        <th className="px-4 py-3 text-left text-purple-300 font-semibold text-sm">Node ID</th>
                        <th className="px-4 py-3 text-left text-purple-300 font-semibold text-sm">License</th>
                        <th className="px-4 py-3 text-right text-purple-300 font-semibold text-sm">Amount</th>
                        <th className="px-4 py-3 text-center text-purple-300 font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-purple-400/20">
                    {paginatedEarnings.map(earning => (
                        <tr key={earning.id} className={`hover:bg-white/5 ${editingId === earning.id ? 'bg-purple-600/10' : ''}`}>
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedEarningIds.has(earning.id)} onChange={() => toggleSelect(earning.id)} className="w-4 h-4" /></td>
                            <td className="px-4 py-3 text-white text-sm">{editingId === earning.id ? <input type="date" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} className="px-2 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white" /> : earning.date}</td>
                            <td className="px-4 py-3 text-white font-mono text-sm">{earning.nodeId}</td>
                            <td className="px-4 py-3 text-purple-300 text-sm">{earning.licenseType || 'Unknown'}</td>
                            <td className="px-4 py-3 text-right text-white font-semibold text-sm">${earning.amount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center flex justify-center gap-2">
                                {editingId === earning.id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(earning.id)} className="text-green-400 hover:text-green-300"><Check size={18} /></button>
                                        <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300"><X size={18} /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleStartEdit(earning)} className="text-blue-400 hover:text-blue-300"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(earning.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
