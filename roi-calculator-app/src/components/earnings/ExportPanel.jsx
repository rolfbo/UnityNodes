import { FileJson, FileSpreadsheet, FileText } from 'lucide-react';

export function ExportPanel({ earnings, onExportJSON, onExportCSV, onExportPDF }) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
            <h3 className="text-purple-300 font-semibold mb-4">Export Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={onExportJSON} disabled={earnings.length === 0} className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 disabled:bg-gray-600/20 text-green-300 disabled:text-gray-400 px-4 py-2 rounded-lg transition-colors border border-green-400/30">
                    <FileJson size={18} />
                    <span>JSON</span>
                </button>
                <button onClick={onExportCSV} disabled={earnings.length === 0} className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-600/20 text-blue-300 disabled:text-gray-400 px-4 py-2 rounded-lg transition-colors border border-blue-400/30">
                    <FileSpreadsheet size={18} />
                    <span>CSV</span>
                </button>
                <button onClick={onExportPDF} disabled={earnings.length === 0} className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 disabled:bg-gray-600/20 text-red-300 disabled:text-gray-400 px-4 py-2 rounded-lg transition-colors border border-red-400/30">
                    <FileText size={18} />
                    <span>PDF</span>
                </button>
            </div>
        </div>
    );
}
