import { loadEarnings, getEarningsStats } from '../utils/earningsStorage.js';

/**
 * Custom hook for the Earnings Target Calculator feature.
 */
export function useEarningsTarget(params) {
    const {
        targetRevenue, targetTimePeriod, activeLicensesCount,
        phonePrice, numNodes, licensesPerNode, totalActiveLicenses,
        simMonthly, monthlyCredits, creditsActive, nodeOperatorPaysCredits
    } = params;

    const calculateGrossEarningsNeeded = (target, licenses, period) => {
        if (licenses <= 0) return 0;
        switch (period) {
            case 'daily':
                return target / licenses;
            case 'monthly':
                return target / licenses;
            case 'yearly':
                return target / licenses / 12;
            default:
                return target / licenses;
        }
    };

    const calculateOperatingCostsPerLicense = (period) => {
        const hardwareCostPerLicenseMonthly = (phonePrice * numNodes * licensesPerNode) / (totalActiveLicenses * 24);
        const simCostPerLicenseMonthly = simMonthly;
        const effectiveCredits = creditsActive ? monthlyCredits : 0;
        const creditsCostPerLicenseMonthly = nodeOperatorPaysCredits ? effectiveCredits : 0;
        const totalMonthlyOpCosts = hardwareCostPerLicenseMonthly + simCostPerLicenseMonthly + creditsCostPerLicenseMonthly;

        switch (period) {
            case 'daily':
                return totalMonthlyOpCosts / 30;
            case 'monthly':
                return totalMonthlyOpCosts;
            case 'yearly':
                return totalMonthlyOpCosts * 12;
            default:
                return totalMonthlyOpCosts;
        }
    };

    const calculateNetEarningsRequired = (target, licenses, period) => {
        const grossNeeded = calculateGrossEarningsNeeded(target, licenses, period);
        const operatingCosts = calculateOperatingCostsPerLicense(period);
        return Math.max(0, grossNeeded + operatingCosts);
    };

    const getActualEarningsComparison = () => {
        try {
            const earningsStats = getEarningsStats();
            const earnings = loadEarnings();

            if (earnings.length === 0) {
                return {
                    hasData: false,
                    currentAveragePerLicense: 0,
                    totalEarnings: 0,
                    transactionCount: 0
                };
            }

            const currentAveragePerLicense = earningsStats.average;
            return {
                hasData: true,
                currentAveragePerLicense,
                totalEarnings: earningsStats.total,
                transactionCount: earningsStats.count,
                uniqueNodes: earningsStats.uniqueNodes
            };
        } catch (error) {
            console.error('Error loading earnings data:', error);
            return {
                hasData: false,
                currentAveragePerLicense: 0,
                totalEarnings: 0,
                transactionCount: 0
            };
        }
    };

    const grossEarningsNeeded = calculateGrossEarningsNeeded(targetRevenue, activeLicensesCount, targetTimePeriod);
    const operatingCostsPerLicense = calculateOperatingCostsPerLicense(targetTimePeriod);
    const netEarningsRequired = calculateNetEarningsRequired(targetRevenue, activeLicensesCount, targetTimePeriod);
    const actualEarningsData = getActualEarningsComparison();

    const calculateDailyEarningsRequired = (netEarningsRequired, period) => {
        switch (period) {
            case 'daily':
                return netEarningsRequired;
            case 'monthly':
                return netEarningsRequired / 30;
            case 'yearly':
                return netEarningsRequired / 365;
            default:
                return netEarningsRequired / 30;
        }
    };

    const dailyEarningsRequiredPerLicense = calculateDailyEarningsRequired(netEarningsRequired, targetTimePeriod);
    const earningsGap = actualEarningsData.hasData ? netEarningsRequired - actualEarningsData.currentAveragePerLicense : 0;
    const progressPercentage = actualEarningsData.hasData && netEarningsRequired > 0 ?
        Math.min(100, (actualEarningsData.currentAveragePerLicense / netEarningsRequired) * 100) : 0;

    return {
        grossEarningsNeeded, operatingCostsPerLicense, netEarningsRequired,
        dailyEarningsRequiredPerLicense, actualEarningsData, earningsGap, progressPercentage
    };
}
