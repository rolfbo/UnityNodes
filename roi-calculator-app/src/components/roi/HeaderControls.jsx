import { Share2, Download } from 'lucide-react';

/**
 * Header with USD/EUR exchange rate and export controls
 */
export function HeaderControls({ usdToEur, setUsdToEur, onShare, onExportPDF }) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-purple-300 mb-2">USD to EUR Exchange Rate</label>
                <input
                    type="number"
                    step="0.01"
                    value={usdToEur}
                    onChange={(e) => setUsdToEur(Math.max(0, parseFloat(e.target.value) || 0.92))}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onShare}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Share2 size={18} />
                    Share URL
                </button>
                <button
                    onClick={onExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Download size={18} />
                    Export PDF
                </button>
            </div>
        </div>
    );
}
