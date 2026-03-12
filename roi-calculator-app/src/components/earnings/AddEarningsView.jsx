import { Upload, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export function AddEarningsView({ 
    pasteText, setPasteText, parseResult, showExampleFormat, setShowExampleFormat,
    handleParse, getExampleFormat
}) {
    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <h3 className="text-purple-300 font-semibold mb-4 flex items-center gap-2"><Upload size={20} /> Add Earnings</h3>
                <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Paste earnings data here..." rows={8} className="w-full px-4 py-3 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white font-mono text-sm placeholder-purple-400/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20" />
                <div className="mt-4 flex gap-3">
                    <button onClick={handleParse} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
                        <Upload size={18} />
                        Parse Data
                    </button>
                    <button onClick={() => setShowExampleFormat(!showExampleFormat)} className="bg-slate-700 hover:bg-slate-600 text-purple-300 px-4 py-2 rounded-lg transition-colors text-sm">
                        {showExampleFormat ? 'Hide Example' : 'Show Example'}
                    </button>
                </div>
            </div>

            {showExampleFormat && (
                <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-6">
                    <h4 className="text-blue-300 font-semibold mb-3">Example Format</h4>
                    <pre className="bg-slate-900/50 border border-blue-400/30 rounded p-4 text-blue-200 text-xs overflow-x-auto whitespace-pre-wrap break-words">
                        {getExampleFormat?.()}
                    </pre>
                </div>
            )}

            {parseResult && (
                <div className={`border rounded-xl p-6 ${parseResult.success ? 'bg-green-900/20 border-green-400/30' : 'bg-red-900/20 border-red-400/30'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        {parseResult.success ? (
                            <>
                                <CheckCircle className="text-green-400" size={24} />
                                <h4 className="text-green-300 font-semibold text-lg">Success!</h4>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="text-red-400" size={24} />
                                <h4 className="text-red-300 font-semibold text-lg">Error</h4>
                            </>
                        )}
                    </div>
                    <p className={`text-sm ${parseResult.success ? 'text-green-200' : 'text-red-200'}`}>
                        {parseResult.message}
                    </p>
                </div>
            )}
        </div>
    );
}
