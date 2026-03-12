import { Save, Upload, RefreshCw } from 'lucide-react';

export function BackupRestorePanel({ onBackup, onImport, onClearAll, backupStatus }) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
            <h3 className="text-purple-300 font-semibold mb-4">Backup & Restore</h3>
            <div className="space-y-3">
                <button onClick={onBackup} className="w-full flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg transition-colors border border-purple-400/30">
                    <Save size={18} />
                    <span>Create Backup</span>
                </button>
                <button onClick={onImport} className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg transition-colors border border-blue-400/30">
                    <Upload size={18} />
                    <span>Import Backup</span>
                </button>
                <button onClick={onClearAll} className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-lg transition-colors border border-red-400/30">
                    <RefreshCw size={18} />
                    <span>Clear All Data</span>
                </button>
            </div>
            {backupStatus && <p className="text-xs text-green-300 mt-2">{backupStatus}</p>}
        </div>
    );
}
