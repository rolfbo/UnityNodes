import { Smartphone } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';
import HelpTooltip from '../shared/HelpTooltip.jsx';

export function OperatingCosts({
    phonePrice, setPhonePrice,
    simMonthly, setSimMonthly,
    monthlyCredits, setMonthlyCredits,
    creditsActive, setCreditsActive,
    nodeOperatorPaysCredits, setNodeOperatorPaysCredits,
    phonesNeeded, totalPhoneCost, monthlySimCost, monthlyCreditCost,
    totalMonthlyCost, initialInvestment, usdToEur, totalActiveLicenses, totalLicensesRunBySelf
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Smartphone className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Operating Costs</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <HelpTooltip content="The cost of each smartphone needed to run licenses. You only need phones for licenses you run yourself. Leased licenses are operated by others.">
                        <label className="text-sm text-purple-300 block mb-2">
                            Phone Cost per License (One-time CapEx)
                        </label>
                    </HelpTooltip>
                    <input
                        type="number"
                        value={phonePrice}
                        onChange={(e) => setPhonePrice(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                        min="0"
                    />
                    <p className="text-xs text-purple-300 mt-1">
                        {phonesNeeded} phones needed = ${totalPhoneCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">
                        One-time capital expenditure
                    </p>
                </div>

                <div>
                    <HelpTooltip content="Monthly cost for SIM cards. Each self-run license requires a SIM card for data connectivity to participate in network verification tasks.">
                        <label className="text-sm text-purple-300 block mb-2">
                            SIM Monthly Cost per Phone
                        </label>
                    </HelpTooltip>
                    <input
                        type="number"
                        value={simMonthly}
                        onChange={(e) => setSimMonthly(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                        min="0"
                    />
                    <p className="text-xs text-purple-300 mt-1">
                        Monthly SIM: ${monthlySimCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">
                        Only for self-run licenses
                    </p>
                </div>

                <div>
                    <HelpTooltip content="Monthly credit cost for each active license. Credits are required to participate in network verification tasks.">
                        <label className="text-sm text-purple-300 block mb-2">
                            Monthly Credits per Phone in $
                        </label>
                    </HelpTooltip>

                    <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded">
                        <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={creditsActive}
                                onChange={(e) => setCreditsActive(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="font-semibold">
                                {creditsActive 
                                    ? '✓ Credits are ACTIVE (fees apply)' 
                                    : '✗ Credits are INACTIVE (no fees)'
                                }
                            </span>
                        </label>
                    </div>

                    <div className={`transition-opacity ${creditsActive ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="flex gap-2 mb-2">
                            {[1.99, 2.99, 3.99].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setMonthlyCredits(val)}
                                    disabled={!creditsActive}
                                    className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === val && creditsActive
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                    } ${!creditsActive ? 'cursor-not-allowed' : ''}`}
                                >
                                    ${val.toFixed(2)}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            value={monthlyCredits.toFixed(2)}
                            onChange={(e) => setMonthlyCredits(Math.max(0, parseFloat(e.target.value) || 0))}
                            disabled={!creditsActive}
                            step="0.01"
                            className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white mb-2 disabled:cursor-not-allowed"
                            min="0"
                        />
                    </div>

                    {creditsActive && (
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                            <label className="flex items-center gap-2 text-xs text-blue-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={nodeOperatorPaysCredits}
                                    onChange={(e) => setNodeOperatorPaysCredits(e.target.checked)}
                                    className="w-3 h-3"
                                />
                                <span>I (Node Operator) pay credits for leased licenses too</span>
                            </label>
                        </div>
                    )}

                    <p className="text-xs text-purple-300 mt-2">
                        {creditsActive ? (
                            nodeOperatorPaysCredits
                                ? `Paying for all ${totalActiveLicenses} licenses: $${formatNumber(monthlyCreditCost)}/mo`
                                : `Paying only for ${totalLicensesRunBySelf} self-run: $${formatNumber(monthlyCreditCost)}/mo`
                        ) : (
                            `Credits inactive: $0/mo (no credit fees being paid)`
                        )}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-red-300 font-semibold">Initial Investment</span>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                ${initialInvestment.toLocaleString()}
                            </div>
                            <div className="text-lg font-semibold text-red-200">
                                €{(initialInvestment * usdToEur).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-red-200 mt-1">
                        Nodes + Phones (one-time)
                    </p>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-orange-300 font-semibold">Monthly Operating Costs</span>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                ${totalMonthlyCost.toLocaleString()}
                            </div>
                            <div className="text-lg font-semibold text-orange-200">
                                €{(totalMonthlyCost * usdToEur).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-orange-200 mt-1">
                        SIM: ${formatNumber(monthlySimCost)} + Credits: ${formatNumber(monthlyCreditCost)}
                    </p>
                </div>
            </div>
        </div>
    );
}
