import { Search, Filter } from 'lucide-react';

export function FiltersPanel({ searchQuery, setSearchQuery, filterLicenseType, setFilterLicenseType, licenseTypes }) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm text-purple-300 block mb-2">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search node ID..." className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white" />
                    </div>
                </div>
                <div>
                    <label className="text-sm text-purple-300 block mb-2">License Type</label>
                    <select value={filterLicenseType} onChange={(e) => setFilterLicenseType(e.target.value)} className="w-full px-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white">
                        <option value="all">All Types</option>
                        {licenseTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
