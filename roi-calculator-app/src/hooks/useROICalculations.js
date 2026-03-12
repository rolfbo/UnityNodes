import { NODE_PRICE, TOTAL_NODES_IN_ECOSYSTEM, rampUpCurves } from '../utils/roiConstants.js';

/**
 * Custom hook that computes all derived financial metrics from ROI state.
 * Pure calculations -- no side effects.
 * @param {Object} state - All state values from useROICalculatorState
 * @returns {Object} All computed financial metrics
 */
export function useROICalculations(state) {
    const {
        numNodes, licensesPerNode, usdToEur,
        licensesRunBySelf, licensesLeased, licensesInactive,
        phonePrice, simMonthly, monthlyCredits, creditsActive, nodeOperatorPaysCredits,
        revenuePerLicense, leaseSplitToOperator,
        uptimeSelfRun, uptimeLeased,
        rampUpEnabled, rampUpDuration, selfRunRampCurve, leasedRampCurve
    } = state;

    const nodePrice = NODE_PRICE;
    const TOTAL_LICENSES_IN_ECOSYSTEM = TOTAL_NODES_IN_ECOSYSTEM * licensesPerNode;

    // Totals
    const totalLicenses = numNodes * licensesPerNode;
    const totalLicensesRunBySelf = numNodes * licensesRunBySelf;
    const totalLicensesLeased = numNodes * licensesLeased;
    const totalLicensesInactive = numNodes * licensesInactive;
    const totalActiveLicenses = totalLicensesRunBySelf + totalLicensesLeased;

    // Initial Investment
    const totalNodeCost = numNodes * nodePrice;
    const phonesNeeded = totalLicensesRunBySelf;
    const totalPhoneCost = phonesNeeded * phonePrice;
    const initialInvestment = totalNodeCost + totalPhoneCost;

    // Monthly costs
    const monthlySimCost = totalLicensesRunBySelf * simMonthly;
    const effectiveMonthlyCredits = creditsActive ? monthlyCredits : 0;
    const monthlyCreditCostSelfRun = totalLicensesRunBySelf * effectiveMonthlyCredits;
    const monthlyCreditCostLeased = nodeOperatorPaysCredits ? (totalLicensesLeased * effectiveMonthlyCredits) : 0;
    const monthlyCreditCost = monthlyCreditCostSelfRun + monthlyCreditCostLeased;
    const totalMonthlyCost = monthlySimCost + monthlyCreditCost;

    // Revenue
    const grossMonthlyRevenue = totalLicenses * revenuePerLicense;
    const revenueFromSelfRun = totalLicensesRunBySelf * revenuePerLicense * (uptimeSelfRun / 100);
    const revenueFromLeased = totalLicensesLeased * revenuePerLicense * (leaseSplitToOperator / 100) * (uptimeLeased / 100);
    const totalMonthlyRevenue = revenueFromSelfRun + revenueFromLeased;
    const netMonthlyProfit = totalMonthlyRevenue - totalMonthlyCost;

    // Effective licenses
    const effectiveLicensesSelfRun = totalLicensesRunBySelf * (uptimeSelfRun / 100);
    const effectiveLicensesLeased = totalLicensesLeased * (uptimeLeased / 100);
    const totalEffectiveLicenses = effectiveLicensesSelfRun + effectiveLicensesLeased;

    // Ramp-up functions
    const getRampUpPercentage = (month, curveType) => {
        const curve = rampUpCurves[curveType];
        if (!curve) return 100;
        if (month >= rampUpDuration) return 100;
        return curve.getPercentage(month, rampUpDuration);
    };

    const calculateRampedCosts = (month) => {
        if (!rampUpEnabled) return totalMonthlyCost;
        const selfRunPercent = getRampUpPercentage(month, selfRunRampCurve) / 100;
        const leasedPercent = getRampUpPercentage(month, leasedRampCurve) / 100;
        const phonesActive = Math.ceil(totalLicensesRunBySelf * selfRunPercent);
        const rampedPhoneCost = totalLicensesRunBySelf > 0 ? (phonesActive / totalLicensesRunBySelf) * totalPhoneCost : 0;
        const rampedSimCost = totalLicensesRunBySelf * selfRunPercent * simMonthly;
        const totalActiveLicensesRamped = (totalLicensesRunBySelf * selfRunPercent) + (totalLicensesLeased * leasedPercent);
        const rampedCreditCost = nodeOperatorPaysCredits ?
            totalActiveLicensesRamped * effectiveMonthlyCredits :
            (totalLicensesRunBySelf * selfRunPercent * effectiveMonthlyCredits);
        const nodeCost = month === 1 ? totalNodeCost : 0;
        return rampedPhoneCost + rampedSimCost + rampedCreditCost + nodeCost;
    };

    const calculateRampedRevenue = (month) => {
        if (!rampUpEnabled) return totalMonthlyRevenue;
        const selfRunPercent = getRampUpPercentage(month, selfRunRampCurve) / 100;
        const leasedPercent = getRampUpPercentage(month, leasedRampCurve) / 100;
        const effectiveSelfRun = totalLicensesRunBySelf * selfRunPercent * (uptimeSelfRun / 100);
        const effectiveLeased = totalLicensesLeased * leasedPercent * (uptimeLeased / 100);
        const revSelfRun = effectiveSelfRun * revenuePerLicense;
        const revLeased = effectiveLeased * revenuePerLicense * (leaseSplitToOperator / 100);
        return revSelfRun + revLeased;
    };

    // ROI metrics (with or without ramp-up)
    const calculateRampUpMetrics = () => {
        if (!rampUpEnabled) {
            const breakEvenMonths = netMonthlyProfit > 0 ? initialInvestment / netMonthlyProfit : Infinity;
            const roi12Month = initialInvestment > 0 ? ((netMonthlyProfit * 12) / initialInvestment) * 100 : 0;
            const roi24Month = initialInvestment > 0 ? ((netMonthlyProfit * 24) / initialInvestment) * 100 : 0;
            return { breakEvenMonths, roi12Month, roi24Month, annualProfit: netMonthlyProfit * 12, annualRevenue: totalMonthlyRevenue * 12 };
        }
        let cumulativeCashFlow = -initialInvestment;
        let breakEvenMonths = Infinity;
        let totalProfit12 = 0, totalProfit24 = 0, totalRevenue12 = 0;
        for (let month = 1; month <= 36; month++) {
            const rev = calculateRampedRevenue(month);
            const cost = calculateRampedCosts(month);
            const profit = rev - cost;
            cumulativeCashFlow += profit;
            if (cumulativeCashFlow >= 0 && breakEvenMonths === Infinity) breakEvenMonths = month;
            if (month <= 12) { totalProfit12 += profit; totalRevenue12 += rev; }
            if (month <= 24) { totalProfit24 += profit; }
        }
        return {
            breakEvenMonths,
            roi12Month: initialInvestment > 0 ? (totalProfit12 / initialInvestment) * 100 : 0,
            roi24Month: initialInvestment > 0 ? (totalProfit24 / initialInvestment) * 100 : 0,
            annualProfit: totalProfit12,
            annualRevenue: totalRevenue12
        };
    };

    const rampUpMetrics = calculateRampUpMetrics();
    const { breakEvenMonths, roi12Month, roi24Month, annualProfit, annualRevenue } = rampUpMetrics;
    const dailyNetProfit = netMonthlyProfit / 30;
    const dailyNetProfitEur = dailyNetProfit * usdToEur;

    // Validation
    const totalLicensesAllocated = licensesRunBySelf + licensesLeased + licensesInactive;
    const isValidAllocation = Math.abs(totalLicensesAllocated - licensesPerNode) < 0.1;

    return {
        nodePrice, TOTAL_LICENSES_IN_ECOSYSTEM,
        totalLicenses, totalLicensesRunBySelf, totalLicensesLeased, totalLicensesInactive, totalActiveLicenses,
        totalNodeCost, phonesNeeded, totalPhoneCost, initialInvestment,
        monthlySimCost, effectiveMonthlyCredits, monthlyCreditCost, monthlyCreditCostSelfRun, monthlyCreditCostLeased, totalMonthlyCost,
        grossMonthlyRevenue, revenueFromSelfRun, revenueFromLeased, totalMonthlyRevenue, netMonthlyProfit,
        effectiveLicensesSelfRun, effectiveLicensesLeased, totalEffectiveLicenses,
        getRampUpPercentage, calculateRampedCosts, calculateRampedRevenue,
        breakEvenMonths, roi12Month, roi24Month, annualProfit, annualRevenue,
        dailyNetProfit, dailyNetProfitEur,
        isValidAllocation, totalLicensesAllocated
    };
}
