import { TOTAL_NODES_IN_ECOSYSTEM, ASSUMED_REVENUE_PER_VERIFICATION, competitiveNetworks } from '../utils/roiConstants.js';
import { formatNumber } from '../utils/formatters.js';

/**
 * Custom hook computing Reality Check ecosystem analysis metrics.
 */
export function useRealityCheck(params) {
    const {
        numNodes, licensesPerNode, revenuePerLicense, phonePrice, simMonthly,
        creditsActive, monthlyCredits, breakEvenMonths,
        totalLicenses, totalNodeCost, totalMonthlyRevenue,
        TOTAL_LICENSES_IN_ECOSYSTEM, nodePrice
    } = params;

    // Ecosystem calculations
    const ecosystemTotalMonthlyRevenue = TOTAL_LICENSES_IN_ECOSYSTEM * revenuePerLicense;
    const ecosystemTotalAnnualRevenue = ecosystemTotalMonthlyRevenue * 12;

    const avgSelfRunLicensesPerNode = licensesPerNode * 0.25;
    const avgLeasedLicensesPerNode = licensesPerNode * 0.50;
    const avgSelfRunRevenuePerNode = avgSelfRunLicensesPerNode * revenuePerLicense;
    const avgLeasedRevenuePerNode = avgLeasedLicensesPerNode * revenuePerLicense * 0.40;
    const avgMonthlyRevenuePerNode = avgSelfRunRevenuePerNode + avgLeasedRevenuePerNode;
    const ecosystemTotalMonthlyRevenueRealistic = TOTAL_NODES_IN_ECOSYSTEM * avgMonthlyRevenuePerNode;

    // User's market share
    const userNodeSharePercent = (numNodes / TOTAL_NODES_IN_ECOSYSTEM) * 100;
    const userLicenseSharePercent = (totalLicenses / TOTAL_LICENSES_IN_ECOSYSTEM) * 100;
    const userRevenueSharePercent = ecosystemTotalMonthlyRevenueRealistic > 0
        ? (totalMonthlyRevenue / ecosystemTotalMonthlyRevenueRealistic) * 100
        : 0;

    // Market capitalization
    const ecosystemTotalInvestment = TOTAL_NODES_IN_ECOSYSTEM * nodePrice;
    const userInvestmentSharePercent = (totalNodeCost / ecosystemTotalInvestment) * 100;

    // Global break-even analysis
    const avgActiveLicensesPerNode = licensesPerNode * 0.75;
    const avgPhonesPerNode = avgSelfRunLicensesPerNode;
    const avgPhoneCostPerNode = avgPhonesPerNode * phonePrice;
    const avgInitialInvestmentPerNode = nodePrice + avgPhoneCostPerNode;
    const ecosystemTotalInitialInvestment = TOTAL_NODES_IN_ECOSYSTEM * avgInitialInvestmentPerNode;

    const avgMonthlySimCostPerNode = avgSelfRunLicensesPerNode * simMonthly;
    const effectiveMonthlyCreditsCost = creditsActive ? monthlyCredits : 0;
    const avgMonthlyCreditCostPerNode = avgActiveLicensesPerNode * effectiveMonthlyCreditsCost;
    const avgMonthlyOperatingCostPerNode = avgMonthlySimCostPerNode + avgMonthlyCreditCostPerNode;
    const ecosystemTotalMonthlyCosts = TOTAL_NODES_IN_ECOSYSTEM * avgMonthlyOperatingCostPerNode;

    const ecosystemMonthlyNetProfit = ecosystemTotalMonthlyRevenueRealistic - ecosystemTotalMonthlyCosts;
    const ecosystemBreakEvenMonths = ecosystemMonthlyNetProfit > 0
        ? ecosystemTotalInitialInvestment / ecosystemMonthlyNetProfit
        : Infinity;

    // Revenue sustainability
    const verificationsNeededPerLicensePerMonth = revenuePerLicense / ASSUMED_REVENUE_PER_VERIFICATION;
    const verificationsNeededPerLicensePerDay = verificationsNeededPerLicensePerMonth / 30;
    const totalEcosystemVerificationsPerMonth = TOTAL_LICENSES_IN_ECOSYSTEM * verificationsNeededPerLicensePerMonth;
    const totalEcosystemVerificationsPerDay = totalEcosystemVerificationsPerMonth / 30;

    // Competitive comparisons
    const unityVsHelium = revenuePerLicense / competitiveNetworks.helium.revenuePerDevice;
    const unityVsNatix = revenuePerLicense / competitiveNetworks.natix.revenuePerDevice;
    const unityVsHivemapper = revenuePerLicense / competitiveNetworks.hivemapper.revenuePerDevice;

    // Reality check warnings
    const realityWarnings = [];

    if (userRevenueSharePercent > 1) {
        realityWarnings.push({
            level: 'warning',
            message: `You control ${formatNumber(userRevenueSharePercent, 2)}% of total ecosystem revenue`,
            detail: 'Significant market concentration - requires large capital investment'
        });
    }

    if (ecosystemTotalInvestment > 100000000) {
        realityWarnings.push({
            level: 'caution',
            message: `Total market cap: $${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M`,
            detail: 'Requires substantial ecosystem-wide investment to reach full capacity'
        });
    }

    if (revenuePerLicense > 3000) {
        realityWarnings.push({
            level: 'alert',
            message: `Revenue per license: $${formatNumber(revenuePerLicense, 0)}/month`,
            detail: 'Very high revenue per license - verify market scenario assumptions'
        });
    }

    if (breakEvenMonths > 24) {
        realityWarnings.push({
            level: 'info',
            message: `Break-even: ${formatNumber(breakEvenMonths, 1)} months`,
            detail: 'Long-term investment horizon - consider cash flow requirements'
        });
    }

    if (verificationsNeededPerLicensePerDay > 10000) {
        realityWarnings.push({
            level: 'alert',
            message: `Requires ${formatNumber(verificationsNeededPerLicensePerDay, 0)} verifications/day per license`,
            detail: 'Very high verification volume needed - verify network capacity'
        });
    }

    if (unityVsHelium > 5) {
        realityWarnings.push({
            level: 'caution',
            message: `Revenue is ${formatNumber(unityVsHelium, 1)}x higher than Helium Mobile`,
            detail: 'Significantly higher than established DePIN networks'
        });
    }

    return {
        ecosystemTotalMonthlyRevenue, ecosystemTotalAnnualRevenue,
        ecosystemTotalMonthlyRevenueRealistic,
        userNodeSharePercent, userLicenseSharePercent, userRevenueSharePercent,
        ecosystemTotalInvestment, userInvestmentSharePercent,
        ecosystemBreakEvenMonths, ecosystemTotalInitialInvestment,
        verificationsNeededPerLicensePerDay, totalEcosystemVerificationsPerDay,
        unityVsHelium, unityVsNatix, unityVsHivemapper,
        realityWarnings
    };
}
