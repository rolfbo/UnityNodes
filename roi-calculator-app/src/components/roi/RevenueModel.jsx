import { TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';
import { marketScenarios } from '../../utils/roiConstants.js';
import HelpTooltip from '../shared/HelpTooltip.jsx';

export function RevenueModel({
    marketShareScenario, setMarketShareScenario,
    revenuePerLicense, setRevenuePerLicense,
    leaseSplitToOperator, setLeaseSplitToOperator,
    usdToEur, effectiveLicensesSelfRun, effectiveLicensesLeased,
    totalLicensesRunBySelf, totalLicensesLeased,
    uptimeSelfRun, uptimeLeased, revenueFromSelfRun, revenueFromLeased,
    totalMonthlyRevenue
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-green-400" size={24} />
                <h2 className="text-xl font-bold text-white">Revenue Model</h2>
            </div>

            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-blue-300 font-semibold mb-3">Market Share Scenarios (1.2M Licenses)</h3>
                <p className="text-sm text-blue-200 mb-3">
                    Based on Unity's projected market share of the global telecom TAM ($2 trillion annually)
                    with 1.2 million total licenses. Assumes max capacity of 7GB per device = $208/month revenue.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    {Object.entries(marketScenarios).map(([key, scenario]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setMarketShareScenario(key);
                                setRevenuePerLicense(scenario.revenuePerLicense);
                            }}
                            className={`p-3 rounded-lg transition-all ${marketShareScenario === key
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-blue-200 hover:bg-white/20'
                            }`}
                        >
                            <div className="font-bold text-lg">{scenario.share}% Share</div>
                            <div className="text-sm font-semibold mt-1">${scenario.revenuePerLicense}/mo</div>
                            <div className="text-xs mt-1">{scenario.dataGB}GB per device</div>
                            <div className="text-xs mt-1 text-blue-200">
                                {scenario.totalLicenses}M total licenses
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-white/5 rounded p-3">
                    <div className="text-xs text-blue-200">
                        <strong>Capacity Note:</strong> Each device can handle max 7GB/month traffic generating $208 revenue.
                        Higher market share requires proportionally more licenses to keep per-device earnings stable.
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                    <HelpTooltip content="Monthly revenue earned per active license after the 75% network split (25% goes to network pools). This represents your share of the telecom service fees.">
                        <label className="text-sm text-purple-300 block mb-2">
                            Earnings per Active License ($/month · €/month)
                        </label>
                    </HelpTooltip>
                    <div className="mb-2 text-xs text-purple-200 bg-purple-500/10 rounded p-2">
                        This is the revenue AFTER 75% network split (25% goes to network pools)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {[25, 50, 75, 90].map((value) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setRevenuePerLicense(value);
                                    setMarketShareScenario('custom');
                                }}
                                className={`py-2 px-3 rounded-lg font-semibold transition-all text-center ${revenuePerLicense === value && marketShareScenario === 'custom'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                }`}
                            >
                                ${value}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={parseFloat(revenuePerLicense.toFixed(2))}
                        onChange={(e) => {
                            setRevenuePerLicense(Math.max(0, parseFloat(e.target.value) || 0));
                            setMarketShareScenario('custom');
                        }}
                        step="0.5"
                        className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                        min="0"
                    />
                </div>

                <div className="md:mt-8">
                    <HelpTooltip content="Percentage of license earnings you keep when leasing licenses to others.">
                        <label className="text-sm text-purple-300 block mb-2">
                            My Split from Leased Licenses (%)
                        </label>
                    </HelpTooltip>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {[25, 50, 75, 90].map((value) => (
                            <button
                                key={value}
                                onClick={() => setLeaseSplitToOperator(value)}
                                className={`py-2 px-3 rounded-lg font-semibold transition-all text-center ${leaseSplitToOperator === value
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                }`}
                            >
                                {value}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={leaseSplitToOperator}
                        onChange={(e) => setLeaseSplitToOperator(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h3 className="text-green-300 text-sm font-semibold mb-2">Self-Run Revenue</h3>
                    <div className="space-y-1 text-xs text-green-200 mb-2">
                        <div className="flex justify-between">
                            <span>{formatNumber(effectiveLicensesSelfRun, 1)} effective licenses × ${formatNumber(revenuePerLicense)}</span>
                            <span>${formatNumber(revenueFromSelfRun)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-green-500/30">
                        <span className="text-green-300 font-semibold">Monthly Total</span>
                        <span className="text-xl font-bold text-white">
                            ${formatNumber(revenueFromSelfRun)}
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h3 className="text-blue-300 text-sm font-semibold mb-2">Leased Revenue</h3>
                    <div className="space-y-1 text-xs text-blue-200 mb-2">
                        <div className="flex justify-between">
                            <span>{formatNumber(effectiveLicensesLeased, 1)} effective × {leaseSplitToOperator}%</span>
                            <span>${formatNumber(revenueFromLeased)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-500/30">
                        <span className="text-blue-300 font-semibold">Monthly Total</span>
                        <span className="text-xl font-bold text-white">
                            ${formatNumber(revenueFromLeased)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="text-purple-300 text-sm font-semibold mb-3">Total Revenue Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-purple-300 mb-1">Monthly</div>
                        <div className="text-2xl font-bold text-white">
                            ${formatNumber(totalMonthlyRevenue)}
                        </div>
                        <div className="text-lg font-semibold text-purple-200">
                            €{formatNumber(totalMonthlyRevenue * usdToEur)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-purple-300 mb-1">Quarterly (3 months)</div>
                        <div className="text-2xl font-bold text-white">
                            ${formatNumber(totalMonthlyRevenue * 3)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-purple-300 mb-1">Yearly (12 months)</div>
                        <div className="text-2xl font-bold text-white">
                            ${formatNumber(totalMonthlyRevenue * 12)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
