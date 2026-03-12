import { BarChart3, Database, Upload } from 'lucide-react';

export function EarningsNav({ activeView, setActiveView, filteredDeviceCount }) {
    return (
        <div className="flex gap-2 mb-6 border-b border-purple-400/30 pb-2">
            <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'dashboard'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                }`}
            >
                <div className="flex items-center gap-2">
                    <BarChart3 size={18} />
                    <span>Dashboard</span>
                </div>
            </button>
            <button
                onClick={() => setActiveView('table')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'table'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Database size={18} />
                    <span>Data Table {filteredDeviceCount > 0 && `(${filteredDeviceCount} ${filteredDeviceCount === 1 ? 'device' : 'devices'})`}</span>
                </div>
            </button>
            <button
                onClick={() => setActiveView('input')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'input'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Upload size={18} />
                    <span>Add Earnings</span>
                </div>
            </button>
        </div>
    );
}
