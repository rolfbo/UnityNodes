import { Info } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';

export function ROIAnalysis({
    roi12Month, roi24Month, netMonthlyProfit, usdToEur,
    numNodes, licensesPerNode, marketShareScenario, marketScenarios,
    totalEffectiveLicenses, totalActiveLicenses, uptimeSelfRun, uptimeLeased
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">ROI Analysis</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300">12-Month ROI</span>
                            <span className={`text-2xl font-bold ${roi12Month > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatNumber(roi12Month, 1)}%
                            </span>
                        </div>
                        <div className="pt-2 border-t border-white/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-200">Total Profit:</span>
                                <span className="text-white font-semibold">
                                    ${formatNumber(netMonthlyProfit * 12)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-purple-200">In EUR:</span>
                                <span className="text-purple-100">
                                    €{formatNumber(netMonthlyProfit * 12 * usdToEur)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300">24-Month ROI (Token Unlock)</span>
                            <span className={`text-2xl font-bold ${roi24Month > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatNumber(roi24Month, 1)}%
                            </span>
                        </div>
                        <div className="pt-2 border-t border-white/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-200">Total Profit:</span>
                                <span className="text-white font-semibold">
                                    ${formatNumber(netMonthlyProfit * 24)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-purple-200">In EUR:</span>
                                <span className="text-purple-100">
                                    €{formatNumber(netMonthlyProfit * 24 * usdToEur)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p className="text-xs text-purple-200">
                            <strong>Token Value:</strong> At unlock, you'll also have access to the staked tokens
                            (${(numNodes * 1875).toLocaleString()} MNTx + ${(numNodes * 1875).toLocaleString()} WMTx),
                            which could add significant value depending on token prices.
                        </p>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="text-yellow-400" size={18} />
                        <h3 className="text-yellow-300 font-semibold">Key Assumptions & Help</h3>
                    </div>
                    <ul className="text-sm text-yellow-200 space-y-1">
                        <li>• Each node includes {licensesPerNode} Unity License NFTs</li>
                        <li>• Market share scenarios based on 1.2M total licenses</li>
                        <li>• Max device capacity: 7GB = $208/month revenue</li>
                        <li>• Current: {marketShareScenario === 'custom' ? 'custom' : marketScenarios[marketShareScenario]?.label}</li>
                        <li>• Self-run licenses: You keep 100% of license earnings</li>
                        <li>• Leased licenses: Split earnings based on your % split</li>
                        <li>• Uptime accounts for device downtime, maintenance, and network issues</li>
                        <li>• Self-run uptime: {uptimeSelfRun}% | Leased uptime: {uptimeLeased}% (effective: {formatNumber(totalEffectiveLicenses, 1)} of {totalActiveLicenses} licenses)</li>
                        <li>• Tokens locked for 24 months</li>
                        <li>• Your {numNodes * licensesPerNode} licenses represent your fixed share of network capacity</li>
                        <li>• Token appreciation not included in ROI</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
