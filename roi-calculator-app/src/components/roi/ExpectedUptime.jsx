import { Smartphone } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';

/**
 * Expected uptime configuration
 */
export function ExpectedUptime({
    uptimeSelfRun, setUptimeSelfRun,
    uptimeLeased, setUptimeLeased,
    effectiveLicensesSelfRun, effectiveLicensesLeased, totalEffectiveLicenses
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Smartphone className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Expected Uptime</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label className="text-sm text-purple-300 block mb-2">Self-Run Licenses Uptime (%)</label>
                    <div className="flex gap-2 mb-2">
                        {[75, 85, 95, 100].map(val => (
                            <button
                                key={val}
                                onClick={() => setUptimeSelfRun(val)}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                    uptimeSelfRun === val
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
                                }`}
                            >
                                {val}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={uptimeSelfRun}
                        onChange={(e) => setUptimeSelfRun(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="text-sm text-purple-300 block mb-2">Leased Licenses Uptime (%)</label>
                    <div className="flex gap-2 mb-2">
                        {[75, 85, 95, 100].map(val => (
                            <button
                                key={val}
                                onClick={() => setUptimeLeased(val)}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                    uptimeLeased === val
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
                                }`}
                            >
                                {val}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={uptimeLeased}
                        onChange={(e) => setUptimeLeased(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-cyan-300 font-semibold mb-2">Effective Active Licenses</p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-cyan-200">Self-Run</p>
                        <p className="font-bold text-white">{formatNumber(effectiveLicensesSelfRun, 1)}</p>
                    </div>
                    <div>
                        <p className="text-cyan-200">Leased</p>
                        <p className="font-bold text-white">{formatNumber(effectiveLicensesLeased, 1)}</p>
                    </div>
                    <div>
                        <p className="text-cyan-200">Total</p>
                        <p className="font-bold text-white">{formatNumber(totalEffectiveLicenses, 1)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
