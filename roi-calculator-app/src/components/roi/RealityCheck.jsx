import { AlertTriangle, Globe, Users, BarChart3, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';
import { competitiveNetworks, TOTAL_NODES_IN_ECOSYSTEM } from '../../utils/roiConstants.js';

/**
 * Reality Check - ecosystem analysis and warnings
 */
export function RealityCheck({
    realityCheckExpanded, setRealityCheckExpanded,
    realityWarnings, ecosystemTotalMonthlyRevenue, ecosystemTotalMonthlyRevenueRealistic,
    TOTAL_LICENSES_IN_ECOSYSTEM, licensesPerNode, ecosystemTotalInvestment, ecosystemBreakEvenMonths,
    numNodes, totalLicenses, userNodeSharePercent, userLicenseSharePercent, userRevenueSharePercent,
    userInvestmentSharePercent, totalNodeCost, totalMonthlyRevenue,
    verificationsNeededPerLicensePerDay, totalEcosystemVerificationsPerDay, totalEcosystemVerificationsPerMonth,
    revenuePerLicense, breakEvenMonths
}) {
    return (
        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30 mb-6">
            <div
                className="flex items-center gap-2 mb-4 cursor-pointer"
                onClick={() => setRealityCheckExpanded(!realityCheckExpanded)}
            >
                <AlertTriangle className="text-orange-400" size={24} />
                <h2 className="text-xl font-bold text-white">Reality Check: Ecosystem Analysis</h2>
                <button className="ml-auto text-orange-300 hover:text-orange-200 transition-colors">
                    {realityCheckExpanded ? '▼' : '▶'}
                </button>
            </div>

            {realityCheckExpanded && (
                <>
                    <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <p className="text-orange-200 text-sm">
                            <strong>Financial Guru Insight:</strong> This section analyzes the entire Unity Nodes ecosystem
                            to provide context for your investment. We're looking at all {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)} nodes and {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM / 1000000, 2)}M
                            licenses to see if the numbers make sense at scale.
                        </p>
                    </div>

                    {realityWarnings.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Reality Flags
                            </h3>
                            <div className="space-y-2">
                                {realityWarnings.map((warning, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border ${warning.level === 'alert' ? 'bg-red-500/10 border-red-500/30' :
                                            warning.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                warning.level === 'caution' ? 'bg-orange-500/10 border-orange-500/30' :
                                                    'bg-blue-500/10 border-blue-500/30'
                                            }`}
                                    >
                                        <div className={`font-semibold text-sm ${warning.level === 'alert' ? 'text-red-300' :
                                            warning.level === 'warning' ? 'text-yellow-300' :
                                                warning.level === 'caution' ? 'text-orange-300' :
                                                    'text-blue-300'
                                            }`}>
                                            {warning.message}
                                        </div>
                                        <div className={`text-xs mt-1 ${warning.level === 'alert' ? 'text-red-200' :
                                            warning.level === 'warning' ? 'text-yellow-200' :
                                                warning.level === 'caution' ? 'text-orange-200' :
                                                    'text-blue-200'
                                            }`}>
                                            {warning.detail}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <h3 className="text-purple-300 font-semibold text-lg flex items-center gap-2">
                                <Globe size={20} />
                                Ecosystem Totals
                            </h3>

                            <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                <div className="text-purple-300 text-xs mb-1">Total Nodes Available</div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)}
                                </div>
                                <div className="text-purple-200 text-xs mt-1">Maximum network capacity</div>
                            </div>

                            <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                <div className="text-purple-300 text-xs mb-1">Total Licenses</div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM, 0)}
                                </div>
                                <div className="text-purple-200 text-xs mt-1">
                                    {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM / 1000000, 2)}M licenses @ {licensesPerNode} per node
                                </div>
                            </div>

                            <div className="bg-white/5 border border-green-400/30 rounded-lg p-4">
                                <div className="text-green-300 text-xs mb-1">Ecosystem Revenue (Realistic)</div>
                                <div className="text-white text-2xl font-bold">
                                    ${formatNumber(ecosystemTotalMonthlyRevenueRealistic / 1000000, 1)}M/mo
                                </div>
                                <div className="text-green-200 text-xs mt-1">
                                    ${formatNumber(ecosystemTotalMonthlyRevenueRealistic * 12 / 1000000, 1)}M annually
                                </div>
                                <div className="text-green-300 text-xs mt-2 opacity-70">
                                    Theoretical max: ${formatNumber(ecosystemTotalMonthlyRevenue / 1000000, 1)}M/mo
                                </div>
                            </div>

                            <div className={`border rounded-lg p-4 ${ecosystemTotalInvestment > 100000000
                                ? 'bg-orange-500/10 border-orange-400/30'
                                : 'bg-white/5 border-blue-400/30'
                                }`}>
                                <div className={`text-xs mb-1 ${ecosystemTotalInvestment > 100000000 ? 'text-orange-300' : 'text-blue-300'
                                    }`}>
                                    Total Investment Required (Nodes Only)
                                </div>
                                <div className="text-white text-2xl font-bold">
                                    ${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M
                                </div>
                                <div className={`text-xs mt-1 ${ecosystemTotalInvestment > 100000000 ? 'text-orange-200' : 'text-blue-200'
                                    }`}>
                                    {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)} nodes × $5,000 each
                                </div>
                            </div>

                            <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                <div className="text-purple-300 text-xs mb-1">Ecosystem Break-Even Timeline</div>
                                <div className="text-white text-2xl font-bold">
                                    {ecosystemBreakEvenMonths < 100
                                        ? `${formatNumber(ecosystemBreakEvenMonths, 1)} months`
                                        : 'Not profitable'
                                    }
                                </div>
                                <div className="text-purple-200 text-xs mt-1">
                                    When all {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)} operators collectively break even
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-green-300 font-semibold text-lg flex items-center gap-2">
                                <Users size={20} />
                                Your Position
                            </h3>

                            <div className={`border rounded-lg p-4 ${userNodeSharePercent > 5
                                ? 'bg-yellow-500/10 border-yellow-400/30'
                                : 'bg-white/5 border-green-400/30'
                                }`}>
                                <div className={`text-xs mb-1 ${userNodeSharePercent > 5 ? 'text-yellow-300' : 'text-green-300'
                                    }`}>
                                    Your Node Share
                                </div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(userNodeSharePercent, 2)}%
                                </div>
                                <div className={`text-xs mt-1 ${userNodeSharePercent > 5 ? 'text-yellow-200' : 'text-green-200'
                                    }`}>
                                    {numNodes} of {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)} nodes
                                </div>
                                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${userNodeSharePercent > 5 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${Math.min(userNodeSharePercent, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-green-400/30 rounded-lg p-4">
                                <div className="text-green-300 text-xs mb-1">Your License Share</div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(userLicenseSharePercent, 2)}%
                                </div>
                                <div className="text-green-200 text-xs mt-1">
                                    {formatNumber(totalLicenses, 0)} of {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM, 0)} licenses
                                </div>
                                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${Math.min(userLicenseSharePercent, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className={`border rounded-lg p-4 ${userRevenueSharePercent > 1
                                ? 'bg-orange-500/10 border-orange-400/30'
                                : 'bg-white/5 border-green-400/30'
                                }`}>
                                <div className={`text-xs mb-1 ${userRevenueSharePercent > 1 ? 'text-orange-300' : 'text-green-300'
                                    }`}>
                                    Your Revenue vs. Ecosystem (Realistic)
                                </div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(userRevenueSharePercent, 2)}%
                                </div>
                                <div className={`text-xs mt-1 ${userRevenueSharePercent > 1 ? 'text-orange-200' : 'text-green-200'
                                    }`}>
                                    ${formatNumber(totalMonthlyRevenue, 0)} of ${formatNumber(ecosystemTotalMonthlyRevenueRealistic / 1000000, 1)}M
                                </div>
                            </div>

                            <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                <div className="text-blue-300 text-xs mb-1">Your Investment Share</div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(userInvestmentSharePercent, 2)}%
                                </div>
                                <div className="text-blue-200 text-xs mt-1">
                                    ${formatNumber(totalNodeCost, 0)} of ${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M
                                </div>
                            </div>

                            <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                <div className="text-purple-300 text-xs mb-1">Your Break-Even vs. Ecosystem</div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <div className="text-white text-lg font-bold">
                                            {breakEvenMonths < 100 ? `${formatNumber(breakEvenMonths, 1)}mo` : 'N/A'}
                                        </div>
                                        <div className="text-purple-200 text-xs">You</div>
                                    </div>
                                    <div>
                                        <div className="text-white text-lg font-bold">
                                            {ecosystemBreakEvenMonths < 100 ? `${formatNumber(ecosystemBreakEvenMonths, 1)}mo` : 'N/A'}
                                        </div>
                                        <div className="text-purple-200 text-xs">Ecosystem Avg</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 size={18} />
                            Revenue Sustainability Analysis
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                <div className="text-blue-300 text-xs mb-1">Verifications Per License/Day</div>
                                <div className={`text-2xl font-bold ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-400' : 'text-white'
                                    }`}>
                                    {formatNumber(verificationsNeededPerLicensePerDay, 0)}
                                </div>
                                <div className="text-blue-200 text-xs mt-1">
                                    @ $0.005/verification
                                </div>
                            </div>

                            <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                <div className="text-blue-300 text-xs mb-1">Ecosystem Daily Verifications</div>
                                <div className="text-white text-2xl font-bold">
                                    {formatNumber(totalEcosystemVerificationsPerDay / 1000000, 1)}M
                                </div>
                                <div className="text-blue-200 text-xs mt-1">
                                    {formatNumber(totalEcosystemVerificationsPerMonth / 1000000, 0)}M monthly
                                </div>
                            </div>

                            <div className={`border rounded-lg p-4 ${verificationsNeededPerLicensePerDay > 10000
                                ? 'bg-orange-500/10 border-orange-400/30'
                                : 'bg-green-500/10 border-green-400/30'
                                }`}>
                                <div className={`text-xs mb-1 ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-300' : 'text-green-300'
                                    }`}>
                                    Network Capacity Check
                                </div>
                                <div className={`text-lg font-bold ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-400' : 'text-green-400'
                                    }`}>
                                    {verificationsNeededPerLicensePerDay > 10000 ? '⚠️ High' : '✓ Reasonable'}
                                </div>
                                <div className={`text-xs mt-1 ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-200' : 'text-green-200'
                                    }`}>
                                    {verificationsNeededPerLicensePerDay > 10000
                                        ? 'Very high verification volume needed'
                                        : 'Achievable verification volume'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp size={18} />
                            Competitive Landscape Comparison
                        </h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            {Object.entries(competitiveNetworks).map(([key, network]) => (
                                <div
                                    key={key}
                                    className={`border rounded-lg p-4 ${key === 'unity'
                                        ? 'bg-purple-500/20 border-purple-400/50'
                                        : 'bg-white/5 border-gray-400/30'
                                        }`}
                                >
                                    <div className={`text-xs mb-1 ${key === 'unity' ? 'text-purple-300' : 'text-gray-300'
                                        }`}>
                                        {network.name}
                                    </div>
                                    <div className="text-white text-xl font-bold">
                                        ${formatNumber(network.revenuePerDevice, 0)}/mo
                                    </div>
                                    <div className={`text-xs mt-1 ${key === 'unity' ? 'text-purple-200' : 'text-gray-400'
                                        }`}>
                                        {network.description}
                                    </div>
                                    {key !== 'unity' && (
                                        <div className="text-xs mt-2 text-blue-300">
                                            Unity is {formatNumber(network.revenuePerDevice > 0 ? revenuePerLicense / network.revenuePerDevice : 0, 1)}x
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-200 text-sm">
                                <strong>Note:</strong> Competitive data represents typical monthly earnings for similar DePIN (Decentralized Physical Infrastructure)
                                networks. Higher multiples may indicate optimistic projections or unique value propositions that should be validated.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
