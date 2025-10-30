/**
 * Unity Nodes ROI Calculator Component
 *
 * This React component provides an interactive web-based calculator for estimating
 * Return on Investment (ROI) for Unity Nodes network participation. It allows users
 * to input various parameters and calculates potential revenue streams, costs, and
 * profitability metrics for running Unity Nodes.
 *
 * Key Features:
 * - Interactive parameter input with real-time calculations
 * - Multiple market share scenarios (conservative, moderate, optimistic)
 * - License distribution management (self-run vs leased)
 * - Cost analysis including hardware, SIM cards, and credits
 * - Revenue projections with different earning models
 * - Visual dashboard with charts and key metrics
 * - Comprehensive disclaimer for financial considerations
 *
 * The calculator helps users understand the financial implications of participating
 * in the Unity Nodes network by modeling different operational strategies and
 * market conditions.
 *
 * @component
 * @returns {JSX.Element} The complete ROI calculator interface
 */

import React, { useState } from 'react';
import { DollarSign, Smartphone, CreditCard, Package, TrendingUp, Users } from 'lucide-react';

export default function UnityNodesROICalculator() {
    // Number formatting function for proper locale formatting
    const formatNumber = (number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    };

    // Node Configuration
    const [numNodes, setNumNodes] = useState(4);
    const nodePrice = 5000;
    const [licensesPerNode, setLicensesPerNode] = useState(200);

    // Exchange rate
    const [usdToEur, setUsdToEur] = useState(0.92); // Conservative EUR/USD rate

    // License Distribution
    const [licensesRunBySelf, setLicensesRunBySelf] = useState(0); // Per node
    const [licensesLeased, setLicensesLeased] = useState(150); // Per node
    const [licensesInactive, setLicensesInactive] = useState(50); // Per node

    // Costs per phone/license
    const [phonePrice, setPhonePrice] = useState(80);
    const [simMonthly, setSimMonthly] = useState(10);
    const [monthlyCredits, setMonthlyCredits] = useState(1.99);
    const [nodeOperatorPaysCredits, setNodeOperatorPaysCredits] = useState(true); // Toggle who pays credits

    // Revenue Model
    const [revenuePerLicense, setRevenuePerLicense] = useState(75); // Monthly revenue per active license
    const [leaseSplitToOperator, setLeaseSplitToOperator] = useState(40); // Node operator gets 40% when leasing

    // Market Share Scenario
    const [marketShareScenario, setMarketShareScenario] = useState('conservative'); // conservative, moderate, optimistic

    // Market share scenarios based on the table (using 1.2M license row)
    // Assuming $208/month = 7GB per device (max capacity)
    // Revenue scales linearly with data traffic
    const marketScenarios = {
        conservative: { share: 1, revenuePerLicense: 208, dataGB: 7, totalLicenses: 1.2, label: "1% Market Share" },
        moderate: { share: 5, revenuePerLicense: 1042, dataGB: 35, totalLicenses: 6.0, label: "5% Market Share" },
        optimistic: { share: 10, revenuePerLicense: 2083, dataGB: 70, totalLicenses: 12.0, label: "10% Market Share" }
    };

    // Calculate totals
    const totalLicensesRunBySelf = numNodes * licensesRunBySelf;
    const totalLicensesLeased = numNodes * licensesLeased;
    const totalLicensesInactive = numNodes * licensesInactive;
    const totalActiveLicenses = totalLicensesRunBySelf + totalLicensesLeased;

    // Initial Investment
    const totalNodeCost = numNodes * nodePrice;
    const phonesNeeded = totalLicensesRunBySelf; // Only need phones for licenses we run
    const totalPhoneCost = phonesNeeded * phonePrice;
    const initialInvestment = totalNodeCost + totalPhoneCost;

    // Monthly costs
    const monthlySimCost = totalLicensesRunBySelf * simMonthly;

    // Credit costs depend on who pays
    const monthlyCreditCostSelfRun = totalLicensesRunBySelf * monthlyCredits;
    const monthlyCreditCostLeased = nodeOperatorPaysCredits ? (totalLicensesLeased * monthlyCredits) : 0;
    const monthlyCreditCost = monthlyCreditCostSelfRun + monthlyCreditCostLeased;

    const totalMonthlyCost = monthlySimCost + monthlyCreditCost;

    // Monthly revenue calculations
    const totalLicenses = numNodes * licensesPerNode;
    const grossMonthlyRevenue = totalLicenses * revenuePerLicense;

    // Revenue split based on leasing
    // revenuePerLicense is already the 75% after network fees
    // So for self-run: you get the full revenuePerLicense amount
    // For leased: you split the revenuePerLicense with the license operator
    const revenueFromSelfRun = totalLicensesRunBySelf * revenuePerLicense;

    // For leased licenses: split the revenue with license operator
    const revenueFromLeased = totalLicensesLeased * revenuePerLicense * (leaseSplitToOperator / 100);

    const totalMonthlyRevenue = revenueFromSelfRun + revenueFromLeased;
    const netMonthlyProfit = totalMonthlyRevenue - totalMonthlyCost;
    const annualProfit = netMonthlyProfit * 12;

    // ROI calculations
    const breakEvenMonths = initialInvestment / netMonthlyProfit;
    const roi12Month = ((netMonthlyProfit * 12) / initialInvestment) * 100;
    const roi24Month = ((netMonthlyProfit * 24) / initialInvestment) * 100;

    // Validation
    const totalLicensesAllocated = licensesRunBySelf + licensesLeased + licensesInactive;
    const isValidAllocation = totalLicensesAllocated === licensesPerNode;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 pb-28 md:pb-6">
            <div className="max-w-7xl mx-auto">
                {/* Sticky Summary (Desktop) */}
                <div className="hidden md:block sticky top-0 z-30 bg-slate-900/60 backdrop-blur border-b border-white/10 mb-6">
                    <div className="px-6 py-2 text-sm flex gap-6 justify-center">
                        <span className="text-green-300">Net: ${formatNumber(netMonthlyProfit)} · €{formatNumber(netMonthlyProfit * usdToEur)}</span>
                        <span className="text-blue-300">Break-Even: {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</span>
                        <span className="text-purple-300">Annual: ${formatNumber(annualProfit)} · €{formatNumber(annualProfit * usdToEur)}</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Unity Nodes ROI Calculator</h1>
                    <p className="text-purple-300">Calculate returns based on self-run and leased licenses</p>

                    <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                        <label className="text-sm text-purple-300">
                            USD to EUR Rate:
                        </label>
                        <input
                            type="number"
                            value={usdToEur}
                            onChange={(e) => setUsdToEur(Math.max(0, parseFloat(e.target.value) || 0.92))}
                            step="0.01"
                            className="w-20 bg-white/5 border border-purple-400/30 rounded px-2 py-1 text-white text-sm"
                            min="0"
                        />
                    </div>
                </div>

                {/* Node Configuration */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="text-purple-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Node Configuration</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-purple-300 block mb-2">
                                Number of Unity Nodes
                            </label>
                            <input
                                type="number"
                                value={numNodes}
                                onChange={(e) => setNumNodes(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                min="1"
                            />
                            <p className="text-xs text-purple-300 mt-1">
                                ${nodePrice.toLocaleString()} per node × {numNodes} = ${totalNodeCost.toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-purple-300 block mb-2">
                                Licenses per Node
                            </label>
                            <input
                                type="number"
                                value={licensesPerNode}
                                onChange={(e) => {
                                    const newValue = Math.max(1, parseInt(e.target.value) || 200);
                                    setLicensesPerNode(newValue);
                                    // Reset license distribution when changing total licenses
                                    const defaultSelfRun = Math.floor(newValue * 0.25);
                                    const defaultLeased = Math.floor(newValue * 0.5);
                                    const defaultInactive = newValue - defaultSelfRun - defaultLeased;
                                    setLicensesRunBySelf(defaultSelfRun);
                                    setLicensesLeased(defaultLeased);
                                    setLicensesInactive(defaultInactive);
                                }}
                                className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                min="1"
                            />
                            <p className="text-xs text-purple-300 mt-1">
                                Total licenses available: {numNodes * licensesPerNode}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h3 className="text-blue-300 font-semibold mb-2">What's Included Per Node:</h3>
                            <ul className="text-sm text-blue-200 space-y-1">
                                <li>• {licensesPerNode} Unity License NFTs</li>
                                <li>• $1,875 MNTx staked (24mo lock)</li>
                                <li>• $1,875 WMTx staked (24mo lock)</li>
                                <li>• NFTs are transferable & sellable</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* License Distribution */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-purple-400" size={24} />
                        <h2 className="text-xl font-bold text-white">License Distribution (Per Node)</h2>
                        {!isValidAllocation && (
                            <span className="text-red-400 text-sm ml-auto">
                                ⚠️ Must total {licensesPerNode} licenses
                            </span>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                            <label className="text-sm text-white block mb-2 font-semibold">
                                Licenses Run by Me
                            </label>
                            <div className="flex gap-2 mb-3">
                                {[0, 25, 50, 75, 100].map((percentage) => {
                                    const licenseCount = Math.floor(licensesPerNode * percentage / 100);
                                    return (
                                        <button
                                            key={percentage}
                                            onClick={() => setLicensesRunBySelf(licenseCount)}
                                            className={`flex-1 py-2 px-2 rounded-lg font-semibold text-sm transition-all ${licensesRunBySelf === licenseCount
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/10 text-green-200 hover:bg-white/20'
                                                }`}
                                        >
                                            {percentage}% ({licenseCount})
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setLicensesRunBySelf(Math.max(0, licensesPerNode - licensesLeased - licensesInactive))}
                                className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                            >
                                Calculate
                            </button>
                            <input
                                type="number"
                                value={licensesRunBySelf}
                                onChange={(e) => setLicensesRunBySelf(Math.max(0, Math.min(licensesPerNode, parseInt(e.target.value) || 0)))}
                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white mb-2"
                                min="0"
                                max={licensesPerNode}
                            />
                            <p className="text-xs text-green-200">
                                Total: {totalLicensesRunBySelf} licenses
                            </p>
                            <p className="text-xs text-green-200">
                                I pay all costs & earn 100% of license earnings
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                            <label className="text-sm text-white block mb-2 font-semibold">
                                Licenses Leased Out
                            </label>
                            <div className="flex gap-2 mb-3">
                                {[0, 25, 50, 75, 100].map((percentage) => {
                                    const licenseCount = Math.floor(licensesPerNode * percentage / 100);
                                    return (
                                        <button
                                            key={percentage}
                                            onClick={() => setLicensesLeased(licenseCount)}
                                            className={`flex-1 py-2 px-2 rounded-lg font-semibold text-sm transition-all ${licensesLeased === licenseCount
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                                }`}
                                        >
                                            {percentage}% ({licenseCount})
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setLicensesLeased(Math.max(0, licensesPerNode - licensesRunBySelf - licensesInactive))}
                                className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                            >
                                Calculate
                            </button>
                            <input
                                type="number"
                                value={licensesLeased}
                                onChange={(e) => setLicensesLeased(Math.max(0, Math.min(licensesPerNode, parseInt(e.target.value) || 0)))}
                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white mb-2"
                                min="0"
                                max={licensesPerNode}
                            />
                            <p className="text-xs text-blue-200">
                                Total: {totalLicensesLeased} licenses
                            </p>
                            <p className="text-xs text-blue-200">
                                Operator pays costs, I earn split
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
                            <label className="text-sm text-white block mb-2 font-semibold">
                                Inactive Licenses
                            </label>
                            <div className="flex gap-2 mb-3">
                                {[0, 5, 12.5, 25, 50].map((percentage) => {
                                    const licenseCount = Math.floor(licensesPerNode * percentage / 100);
                                    return (
                                        <button
                                            key={percentage}
                                            onClick={() => setLicensesInactive(licenseCount)}
                                            className={`flex-1 py-2 px-2 rounded-lg font-semibold text-sm transition-all ${licensesInactive === licenseCount
                                                    ? 'bg-gray-500 text-white'
                                                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                                                }`}
                                        >
                                            {percentage}% ({licenseCount})
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setLicensesInactive(Math.max(0, licensesPerNode - licensesRunBySelf - licensesLeased))}
                                className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                            >
                                Calculate
                            </button>
                            <input
                                type="number"
                                value={licensesInactive}
                                onChange={(e) => setLicensesInactive(Math.max(0, Math.min(licensesPerNode, parseInt(e.target.value) || 0)))}
                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white mb-2"
                                min="0"
                                max={licensesPerNode}
                            />
                            <p className="text-xs text-gray-300">
                                Total: {numNodes * licensesInactive} licenses
                            </p>
                            <p className="text-xs text-gray-300">
                                Not generating revenue
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Allocated per node:</span>
                            <span className={`font-semibold ${isValidAllocation ? 'text-green-400' : 'text-red-400'}`}>
                                {totalLicensesAllocated} / {licensesPerNode}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Costs for Self-Run Licenses */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Smartphone className="text-purple-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Operating Costs</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-purple-300 block mb-2">
                                Phone Cost per License (One-time CapEx)
                            </label>
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
                            <label className="text-sm text-purple-300 block mb-2">
                                SIM Monthly Cost per Phone
                            </label>
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
                            <label className="text-sm text-purple-300 block mb-2">
                                Monthly Credits per Phone in $
                            </label>
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setMonthlyCredits(1.99)}
                                    className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 1.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                        }`}
                                >
                                    $1.99
                                </button>
                                <button
                                    onClick={() => setMonthlyCredits(2.99)}
                                    className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 2.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                        }`}
                                >
                                    $2.99
                                </button>
                                <button
                                    onClick={() => setMonthlyCredits(3.99)}
                                    className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 3.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                        }`}
                                >
                                    $3.99
                                </button>
                            </div>
                            <input
                                type="number"
                                value={monthlyCredits.toFixed(2)}
                                onChange={(e) => setMonthlyCredits(Math.max(0, parseFloat(e.target.value) || 0))}
                                step="0.01"
                                className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white mb-2"
                                min="0"
                            />

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

                            <p className="text-xs text-purple-300 mt-2">
                                {nodeOperatorPaysCredits
                                    ? `Paying for all ${totalActiveLicenses} licenses: $${formatNumber(monthlyCreditCost)}/mo`
                                    : `Paying only for ${totalLicensesRunBySelf} self-run: $${formatNumber(monthlyCreditCost)}/mo`
                                }
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
                                Nodes: ${totalNodeCost.toLocaleString()} + Phones (one-time): ${totalPhoneCost.toLocaleString()}
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
                            <p className="text-xs text-orange-200">
                                {nodeOperatorPaysCredits
                                    ? `(Credits for all ${totalActiveLicenses} active licenses)`
                                    : `(Credits only for ${totalLicensesRunBySelf} self-run licenses)`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Revenue Model */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Revenue Model</h2>
                    </div>

                    {/* Market Share Scenarios */}
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
                                At 1% share, 1.2M licenses handle the load. At 5% share (35GB/device worth of traffic),
                                the network would need 6M total licenses (5x more) to distribute the load back to 7GB per device.
                                At 10% share (70GB/device), 12M licenses (10x more) would be needed.
                                Your 200 licenses per node represent your fixed share of this growing network capacity.
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-purple-300 block mb-2">
                                Earnings per Active License ($/month)
                            </label>
                            <div className="mb-2 text-xs text-purple-200 bg-purple-500/10 rounded p-2">
                                This is the revenue AFTER 75% network split (25% goes to network pools)
                            </div>
                            <div className="flex gap-2 mb-3">
                                {[25, 50, 75, 90].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => {
                                            setRevenuePerLicense(value);
                                            setMarketShareScenario('custom');
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${revenuePerLicense === value && marketShareScenario === 'custom'
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
                                value={revenuePerLicense}
                                onChange={(e) => {
                                    setRevenuePerLicense(Math.max(0, parseFloat(e.target.value) || 0));
                                    setMarketShareScenario('custom');
                                }}
                                step="0.5"
                                className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                min="0"
                            />
                            <p className="text-xs text-purple-300 mt-1">
                                {marketShareScenario === 'custom'
                                    ? 'Custom earnings estimate'
                                    : `Based on ${marketScenarios[marketShareScenario].label}`}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-purple-300 block mb-2">
                                My Split from Leased Licenses (%)
                            </label>
                            <div className="flex gap-2 mb-3">
                                {[25, 50, 75, 90].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setLeaseSplitToOperator(value)}
                                        className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${leaseSplitToOperator === value
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
                            <p className="text-xs text-purple-300 mt-1">
                                License operator keeps {100 - leaseSplitToOperator}% (and pays their costs)
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <h3 className="text-green-300 text-sm font-semibold mb-2">Self-Run Revenue</h3>
                            <div className="space-y-1 text-xs text-green-200 mb-2">
                                <div className="flex justify-between">
                                    <span>{totalLicensesRunBySelf} licenses × ${formatNumber(revenuePerLicense)}</span>
                                    <span>${formatNumber(totalLicensesRunBySelf * revenuePerLicense)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-green-500/30 mb-2">
                                <span className="text-green-300 font-semibold">Monthly Total</span>
                                <span className="text-xl font-bold text-white">
                                    ${formatNumber(revenueFromSelfRun)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-green-500/20 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-green-200">Per license I earn:</span>
                                    <span className="text-green-100 font-semibold">
                                        ${formatNumber(revenuePerLicense)}/mo
                                    </span>
                                </div>
                                <div className="text-xs text-green-200">
                                    (100% - I run & keep all earnings)
                                </div>
                                <div className="pt-2 border-t border-green-500/20">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-green-200">Quarterly:</span>
                                        <span className="text-green-100 font-semibold">
                                            ${formatNumber(revenueFromSelfRun * 3)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-green-200">Yearly:</span>
                                        <span className="text-green-100 font-semibold">
                                            ${formatNumber(revenueFromSelfRun * 12)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h3 className="text-blue-300 text-sm font-semibold mb-2">Leased Revenue</h3>
                            <div className="space-y-1 text-xs text-blue-200 mb-2">
                                <div className="flex justify-between">
                                    <span>{totalLicensesLeased} licenses × ${formatNumber(revenuePerLicense)}</span>
                                    <span>${formatNumber(totalLicensesLeased * revenuePerLicense)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>× {leaseSplitToOperator}% (my split)</span>
                                    <span></span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-blue-500/30 mb-2">
                                <span className="text-blue-300 font-semibold">Monthly Total</span>
                                <span className="text-xl font-bold text-white">
                                    ${formatNumber(revenueFromLeased)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-blue-500/20 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-blue-200">Per license I earn:</span>
                                    <span className="text-blue-100 font-semibold">
                                        ${formatNumber(revenuePerLicense * (leaseSplitToOperator / 100))}/mo
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-blue-200">License operator earns:</span>
                                    <span className="text-blue-100 font-semibold">
                                        ${formatNumber(revenuePerLicense * ((100 - leaseSplitToOperator) / 100))}/mo
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-blue-500/20">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-200">Quarterly:</span>
                                        <span className="text-blue-100 font-semibold">
                                            ${formatNumber(revenueFromLeased * 3)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-blue-200">Yearly:</span>
                                        <span className="text-blue-100 font-semibold">
                                            ${formatNumber(revenueFromLeased * 12)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Revenue Summary */}
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
                                <div className="text-lg font-semibold text-purple-200">
                                    €{formatNumber(totalMonthlyRevenue * 3 * usdToEur)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-purple-300 mb-1">Yearly (12 months)</div>
                                <div className="text-2xl font-bold text-white">
                                    ${formatNumber(totalMonthlyRevenue * 12)}
                                </div>
                                <div className="text-lg font-semibold text-purple-200">
                                    €{formatNumber(totalMonthlyRevenue * 12 * usdToEur)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Dashboard */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/30">
                        <h3 className="text-sm text-green-300 mb-2">Net Monthly Profit</h3>
                        <div className="mb-2">
                            <p className="text-3xl font-bold text-white">
                                ${formatNumber(netMonthlyProfit)}
                            </p>
                            <p className="text-xl font-semibold text-green-200">
                                €{formatNumber(netMonthlyProfit * usdToEur)}
                            </p>
                        </div>
                        <p className="text-xs text-green-300">
                            Revenue: ${formatNumber(totalMonthlyRevenue)} / €{formatNumber(totalMonthlyRevenue * usdToEur)}
                        </p>
                        <p className="text-xs text-green-300">
                            Costs: ${formatNumber(totalMonthlyCost)} / €{formatNumber(totalMonthlyCost * usdToEur)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30">
                        <h3 className="text-sm text-blue-300 mb-2">Break-Even Period</h3>
                        <p className="text-3xl font-bold text-white mb-1">
                            {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} months
                        </p>
                        <p className="text-sm text-blue-300">
                            {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths / 12, 1) : '∞'} years
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                        <h3 className="text-sm text-purple-300 mb-2">Annual Profit</h3>
                        <div className="mb-1">
                            <p className="text-3xl font-bold text-white">
                                ${formatNumber(annualProfit)}
                            </p>
                            <p className="text-xl font-semibold text-purple-200">
                                €{formatNumber(annualProfit * usdToEur)}
                            </p>
                        </div>
                        <p className="text-sm text-purple-300">
                            Year 1 net profit
                        </p>
                    </div>
                </div>

                {/* ROI Analysis */}
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
                            <h3 className="text-yellow-300 font-semibold mb-2">Key Assumptions:</h3>
                            <ul className="text-sm text-yellow-200 space-y-1">
                                <li>• Each node includes {licensesPerNode} Unity License NFTs</li>
                                <li>• Market share scenarios based on 1.2M total licenses</li>
                                <li>• Max device capacity: 7GB = $208/month revenue</li>
                                <li>• 1% share = 7GB | 5% = 35GB (~5x licenses) | 10% = 70GB (~10x licenses)</li>
                                <li>• Current: {marketShareScenario === 'custom' ? 'custom' : marketScenarios[marketShareScenario].label}</li>
                                <li>• Self-run licenses: You keep 100% of license earnings</li>
                                <li>• Leased licenses: Split earnings based on your % split</li>
                                <li>• Tokens locked for 24 months</li>
                                <li>• Your {numNodes * licensesPerNode} licenses represent your fixed share of network capacity</li>
                                <li>• Token appreciation not included in ROI</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sticky Summary (Mobile) */}
                <div className="fixed bottom-0 inset-x-0 z-50 md:hidden pointer-events-none">
                    <div className="pointer-events-auto mx-auto max-w-7xl px-4 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                        <div className="rounded-t-xl bg-white/10 backdrop-blur-lg border border-white/20 p-3 shadow-lg">
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="text-green-300 font-semibold">Net Monthly Profit</div>
                                    <div className="text-white font-bold">${formatNumber(netMonthlyProfit)}</div>
                                    <div className="text-green-200">€{formatNumber(netMonthlyProfit * usdToEur)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-blue-300 font-semibold">Break-Even</div>
                                    <div className="text-white font-bold">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-purple-300 font-semibold">Annual Profit</div>
                                    <div className="text-white font-bold">${formatNumber(annualProfit)}</div>
                                    <div className="text-purple-200">€{formatNumber(annualProfit * usdToEur)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-sm text-red-200">
                        <strong>Disclaimer:</strong> This calculator is for illustrative purposes only and does not constitute financial advice.
                        Actual returns may vary significantly based on network performance, market conditions, license operator activity, token prices,
                        and other factors. Cryptocurrency investments carry substantial risk. The revenue per license is a conservative estimate
                        and may be higher or lower in practice. Always conduct thorough research and consult financial professionals before making
                        investment decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}