import { Hash, Save } from 'lucide-react';

export function NodeMappingPanel({ nodeMapping, uniqueNodeIds, handleUpdateNodeMapping, handleUpdateNodeBound }) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
            <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2"><Hash size={20} /> Node Mapping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueNodeIds.map(nodeId => (
                    <div key={nodeId} className="bg-slate-900/50 border border-purple-400/30 rounded-lg p-4">
                        <p className="text-white font-mono text-sm mb-3">{nodeId}</p>
                        <select value={nodeMapping[nodeId]?.licenseType || 'self-run'} onChange={(e) => handleUpdateNodeMapping(nodeId, e.target.value)} className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded text-white text-sm mb-2">
                            <option value="self-run">Self-Run</option>
                            <option value="leased">Leased</option>
                            <option value="unknown">Unknown</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm text-purple-300 cursor-pointer">
                            <input type="checkbox" checked={nodeMapping[nodeId]?.isBound || false} onChange={(e) => handleUpdateNodeBound(nodeId, e.target.checked)} className="w-4 h-4" />
                            <span>Bound Device</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
