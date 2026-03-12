import React from 'react';
import { useROICalculatorState } from '../../hooks/useROICalculatorState.js';
import { useROICalculations } from '../../hooks/useROICalculations.js';
import { useRealityCheck } from '../../hooks/useRealityCheck.js';
import { useEarningsTarget } from '../../hooks/useEarningsTarget.js';
import { useScenarios } from '../../hooks/useScenarios.js';
import { generateShareUrl, copyToClipboard } from '../../utils/urlParams.js';
import { exportROIToPDF } from '../../utils/pdfExport.js';
import { generateProfitOverTimeData, generateCostBreakdownData, generateROIComparisonData } from '../../utils/chartDataGenerators.js';
import { rampUpCurves, marketScenarios } from '../../utils/roiConstants.js';
import { formatNumber } from '../../utils/formatters.js';

// TODO: Import all section components when created
// For now, returning placeholder that just renders the header
import HelpTooltip from '../shared/HelpTooltip.jsx';

export default function UnityNodesROICalculator() {
    // Get all state
    const state = useROICalculatorState();

    // Get all calculations
    const calculations = useROICalculations(state);

    // Get reality check data
    const realityCheckData = useRealityCheck({
        ...state,
        ...calculations,
        TOTAL_LICENSES_IN_ECOSYSTEM: calculations.TOTAL_LICENSES_IN_ECOSYSTEM,
        nodePrice: calculations.nodePrice
    });

    // Get earnings target data
    const targetData = useEarningsTarget({
        ...state,
        totalActiveLicenses: calculations.totalActiveLicenses
    });

    // Get scenario management
    const scenarios = useScenarios(state);

    // Generate chart data
    const chartData = {
        profitOverTime: generateProfitOverTimeData({
            initialInvestment: calculations.initialInvestment,
            rampUpEnabled: state.rampUpEnabled,
            calculateRampedRevenue: calculations.calculateRampedRevenue,
            calculateRampedCosts: calculations.calculateRampedCosts,
            totalMonthlyRevenue: calculations.totalMonthlyRevenue,
            totalMonthlyCost: calculations.totalMonthlyCost
        }),
        costBreakdown: generateCostBreakdownData({
            totalNodeCost: calculations.totalNodeCost,
            totalPhoneCost: calculations.totalPhoneCost,
            totalMonthlyCost: calculations.totalMonthlyCost,
            monthlyCreditCost: calculations.monthlyCreditCost
        }),
        roiComparison: generateROIComparisonData({
            roi12Month: calculations.roi12Month,
            roi24Month: calculations.roi24Month,
            netMonthlyProfit: calculations.netMonthlyProfit
        })
    };

    // Share URL handler
    const handleShare = async () => {
        const shareState = {
            numNodes: state.numNodes,
            licensesPerNode: state.licensesPerNode,
            licensesRunBySelf: state.licensesRunBySelf,
            licensesLeased: state.licensesLeased,
            licensesInactive: state.licensesInactive,
            phonePrice: state.phonePrice,
            simMonthly: state.simMonthly,
            monthlyCredits: state.monthlyCredits,
            creditsActive: state.creditsActive,
            nodeOperatorPaysCredits: state.nodeOperatorPaysCredits,
            revenuePerLicense: state.revenuePerLicense,
            leaseSplitToOperator: state.leaseSplitToOperator,
            usdToEur: state.usdToEur,
            marketShareScenario: state.marketShareScenario,
            uptimeSelfRun: state.uptimeSelfRun,
            uptimeLeased: state.uptimeLeased,
            rampUpEnabled: state.rampUpEnabled,
            rampUpDuration: state.rampUpDuration,
            selfRunRampCurve: state.selfRunRampCurve,
            leasedRampCurve: state.leasedRampCurve,
            targetRevenue: state.targetRevenue,
            targetTimePeriod: state.targetTimePeriod,
            activeLicensesCount: state.activeLicensesCount,
            earningsTargetExpanded: state.earningsTargetExpanded
        };

        const url = generateShareUrl(shareState);
        await copyToClipboard(url);
        alert('Shareable URL copied to clipboard!');
    };

    // PDF export handler
    const handleExportPDF = () => {
        exportROIToPDF({
            ...state,
            ...calculations,
            rampUpCurves,
            marketScenarios,
            initialInvestment: calculations.initialInvestment,
            totalMonthlyRevenue: calculations.totalMonthlyRevenue,
            totalMonthlyCost: calculations.totalMonthlyCost,
            netMonthlyProfit: calculations.netMonthlyProfit,
            breakEvenMonths: calculations.breakEvenMonths,
            roi12Month: calculations.roi12Month,
            roi24Month: calculations.roi24Month,
            annualProfit: calculations.annualProfit,
            effectiveLicensesSelfRun: calculations.effectiveLicensesSelfRun,
            effectiveLicensesLeased: calculations.effectiveLicensesLeased
        });
    };

    // Placeholder return while components are being created
    try {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 pb-28 md:pb-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Unity Nodes ROI Calculator</h1>
                                <p className="text-purple-300">Estimate your return on investment for Unity Nodes network participation</p>
                            </div>
                        </div>

                        {/* Summary cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-4">
                                <p className="text-purple-300 text-sm mb-1">Net Monthly Profit</p>
                                <p className="text-2xl font-bold text-white">${formatNumber(calculations.netMonthlyProfit)}</p>
                            </div>
                            <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-4">
                                <p className="text-purple-300 text-sm mb-1">Daily (USD)</p>
                                <p className="text-2xl font-bold text-white">${formatNumber(calculations.dailyNetProfit)}</p>
                            </div>
                            <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-4">
                                <p className="text-purple-300 text-sm mb-1">Break-Even</p>
                                <p className="text-2xl font-bold text-white">{isFinite(calculations.breakEvenMonths) ? formatNumber(calculations.breakEvenMonths, 1) : '∞'} mo</p>
                            </div>
                            <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-4">
                                <p className="text-purple-300 text-sm mb-1">Annual Profit</p>
                                <p className="text-2xl font-bold text-white">${formatNumber(calculations.annualProfit)}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={handleShare}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                📋 Share URL
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                📄 Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Components will be rendered here once created */}
                    <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-6 text-center text-purple-300">
                        <p className="mb-2">🔄 Refactoring in progress...</p>
                        <p className="text-sm">UI components are being created separately</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('ROI Calculator error:', error);
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-red-300">
                    <p className="font-bold">Error loading calculator</p>
                    <p className="text-sm mt-2">{error.message}</p>
                </div>
            </div>
        );
    }
}
