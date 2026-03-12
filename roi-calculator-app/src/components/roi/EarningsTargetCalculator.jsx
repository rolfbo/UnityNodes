import { TrendingUp, ChevronUp, ChevronDown, Clock, Info, BarChart3 } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';
import HelpTooltip from '../shared/HelpTooltip.jsx';

export function EarningsTargetCalculator({
    earningsTargetExpanded, setEarningsTargetExpanded,
    targetRevenue, setTargetRevenue,
    activeLicensesCount, setActiveLicensesCount,
    targetTimePeriod, setTargetTimePeriod,
    grossEarningsNeeded, operatingCostsPerLicense, netEarningsRequired,
    dailyEarningsRequiredPerLicense, actualEarningsData, earningsGap, progressPercentage,
    phonePrice, numNodes, licensesPerNode, totalActiveLicenses, simMonthly, monthlyCredits,
    nodeOperatorPaysCredits, totalLicensesRunBySelf
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" />
                    Earnings Target Calculator
                </h2>
                <button
                    onClick={() => setEarningsTargetExpanded(!earningsTargetExpanded)}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                    {earningsTargetExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {earningsTargetExpanded && (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-purple-300 font-medium">
                                Target Revenue ($)
                            </label>
                            <input
                                type="number"
                                value={targetRevenue}
                                onChange={(e) => setTargetRevenue(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="10000"
                                min="0"
                                step="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-purple-300 font-medium">
                                Active Licenses
                            </label>
                            <input
                                type="number"
                                value={activeLicensesCount}
                                onChange={(e) => setActiveLicensesCount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder={totalActiveLicenses.toString()}
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-purple-300 font-medium">
                                Time Period
                            </label>
                            <select
                                value={targetTimePeriod}
                                onChange={(e) => setTargetTimePeriod(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/40 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={24} className="text-yellow-400" />
                                    <h3 className="text-xl font-bold text-yellow-300">Daily Earnings Required</h3>
                                </div>
                                <div className="text-yellow-200 text-sm mb-1">per license per day</div>
                                <div className="text-white text-3xl font-bold">${formatNumber(dailyEarningsRequiredPerLicense, 3)}</div>
                                <div className="text-yellow-200 text-xs mt-1">
                                    Each phone needs to earn this much daily
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-yellow-300 text-sm font-medium">
                                    Based on {targetTimePeriod} target
                                </div>
                                <div className="text-yellow-200 text-xs mt-1">
                                    Converted from ${formatNumber(netEarningsRequired)} {targetTimePeriod.slice(0, -2)} requirement
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-green-400/30">
                            <div className="text-green-300 text-sm font-medium mb-1">Target Summary</div>
                            <div className="text-white text-lg font-bold">${formatNumber(targetRevenue)}</div>
                            <div className="text-green-200 text-xs">
                                {targetTimePeriod} with {activeLicensesCount} licenses
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                            <div className="text-blue-300 text-sm font-medium mb-1">Gross Earnings Needed</div>
                            <div className="text-white text-lg font-bold">${formatNumber(grossEarningsNeeded)}</div>
                            <div className="text-blue-200 text-xs">
                                per license per {targetTimePeriod.slice(0, -2)}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-orange-400/30">
                            <div className="text-orange-300 text-sm font-medium mb-1">Operating Costs</div>
                            <div className="text-white text-lg font-bold">${formatNumber(operatingCostsPerLicense)}</div>
                            <div className="text-orange-200 text-xs">
                                per license per {targetTimePeriod.slice(0, -2)}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-purple-400/30">
                            <div className="text-purple-300 text-sm font-medium mb-1">Net Earnings Required</div>
                            <div className="text-white text-xl font-bold">${formatNumber(netEarningsRequired)}</div>
                            <div className="text-purple-200 text-xs">
                                per license per {targetTimePeriod.slice(0, -2)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                        <h3 className="text-white font-semibold mb-3">Cost Breakdown per License</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-purple-200">Hardware Amortization:</div>
                                <div className="text-white font-semibold">
                                    ${formatNumber((phonePrice * numNodes * licensesPerNode) / (totalActiveLicenses * 24), 2)}/month
                                </div>
                            </div>
                            <div>
                                <div className="text-purple-200">SIM Card:</div>
                                <div className="text-white font-semibold">${formatNumber(simMonthly)}/month</div>
                            </div>
                            <div>
                                <div className="text-purple-200">Unity Credits:</div>
                                <div className="text-white font-semibold">
                                    ${formatNumber(nodeOperatorPaysCredits ? monthlyCredits : 0)}/month
                                </div>
                            </div>
                        </div>
                    </div>

                    {actualEarningsData.hasData && (
                        <div className="bg-white/5 rounded-lg p-4 border border-cyan-400/30">
                            <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                                <BarChart3 size={16} />
                                Actual Earnings Comparison
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-cyan-200 text-sm">Current Average:</div>
                                    <div className="text-white font-bold">${formatNumber(actualEarningsData.currentAveragePerLicense)}</div>
                                    <div className="text-cyan-200 text-xs">per transaction</div>
                                </div>
                                <div>
                                    <div className="text-cyan-200 text-sm">Gap to Target:</div>
                                    <div className={`font-bold ${earningsGap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        ${formatNumber(Math.abs(earningsGap))} {earningsGap > 0 ? 'short' : 'surplus'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-cyan-200 text-sm">Progress:</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-bold text-xs">{formatNumber(progressPercentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Info className="text-blue-400 mt-0.5" size={16} />
                            <div className="text-blue-200 text-sm">
                                <strong>How to use:</strong> Set your desired revenue target and see exactly how much each license needs to earn.
                                The calculator automatically factors in your operational costs. Compare with your actual earnings data to track progress toward your goals.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
