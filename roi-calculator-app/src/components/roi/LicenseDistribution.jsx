import { DollarSign, formatNumber } from 'lucide-react';
import { formatNumber as fmt } from '../../utils/formatters.js';

/**
 * License distribution among self-run, leased, and inactive
 */
export function LicenseDistribution({
    licensesPerNode, numNodes,
    licensesRunBySelf, setLicensesRunBySelf,
    licensesLeased, setLicensesLeased,
    licensesInactive, setLicensesInactive,
    isValidAllocation, totalLicensesAllocated
}) {
    const totalLicenses = numNodes * licensesPerNode;

    const setPercentage = (type, percent) => {
        const value = (licensesPerNode * percent) / 100;
        if (type === 'self') {
            setLicensesRunBySelf(value);
            const remaining = licensesPerNode - value - licensesInactive;
            setLicensesLeased(Math.max(0, remaining));
        } else if (type === 'leased') {
            setLicensesLeased(value);
            const remaining = licensesPerNode - value - licensesInactive;
            setLicensesRunBySelf(Math.max(0, remaining));
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">License Distribution (per node)</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Self-Run */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 font-semibold mb-3">Self-Run Licenses</p>
                    <div className="flex gap-1 mb-3">
                        {[0, 25, 50, 75, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => setPercentage('self', pct)}
                                className="flex-1 px-2 py-1 text-xs rounded bg-green-500/20 hover:bg-green-500/30 text-green-200 transition-colors"
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={Math.round(licensesRunBySelf)}
                        onChange={(e) => setLicensesRunBySelf(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-green-500/20 border border-green-500/30 rounded px-3 py-2 text-white text-sm mb-2"
                    />
                    <p className="text-xs text-green-200">Total: {fmt(numNodes * licensesRunBySelf)}</p>
                </div>

                {/* Leased */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 font-semibold mb-3">Leased Licenses</p>
                    <div className="flex gap-1 mb-3">
                        {[0, 25, 50, 75, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => setPercentage('leased', pct)}
                                className="flex-1 px-2 py-1 text-xs rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 transition-colors"
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={Math.round(licensesLeased)}
                        onChange={(e) => setLicensesLeased(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-blue-500/20 border border-blue-500/30 rounded px-3 py-2 text-white text-sm mb-2"
                    />
                    <p className="text-xs text-blue-200">Total: {fmt(numNodes * licensesLeased)}</p>
                </div>

                {/* Inactive */}
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                    <p className="text-gray-300 font-semibold mb-3">Inactive Licenses</p>
                    <div className="flex gap-1 mb-3">
                        {[0, 25, 50, 75, 100].map(pct => (
                            <button
                                key={pct}
                                onClick={() => setLicensesInactive(Math.max(0, (licensesPerNode * pct) / 100))}
                                className="flex-1 px-2 py-1 text-xs rounded bg-gray-500/20 hover:bg-gray-500/30 text-gray-200 transition-colors"
                            >
                                {pct}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={Math.round(licensesInactive)}
                        onChange={(e) => setLicensesInactive(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-gray-500/20 border border-gray-500/30 rounded px-3 py-2 text-white text-sm mb-2"
                    />
                    <p className="text-xs text-gray-200">Total: {fmt(numNodes * licensesInactive)}</p>
                </div>
            </div>

            <div className={`p-4 rounded-lg ${isValidAllocation ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                <p className={`text-sm ${isValidAllocation ? 'text-green-300' : 'text-red-300'}`}>
                    {isValidAllocation
                        ? `✓ Distribution valid: ${fmt(totalLicensesAllocated)} / ${licensesPerNode} licenses allocated per node`
                        : `✗ Invalid: ${fmt(totalLicensesAllocated)} / ${licensesPerNode} licenses allocated per node`
                    }
                </p>
            </div>
        </div>
    );
}
