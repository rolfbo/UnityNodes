/**
 * Chart data generation functions for ROI Calculator visualizations
 */

/**
 * Generate profit-over-time chart data for 36 months
 * @param {Object} params - Calculation parameters
 * @returns {Array} Chart data array
 */
export const generateProfitOverTimeData = ({
    initialInvestment, rampUpEnabled,
    calculateRampedRevenue, calculateRampedCosts,
    totalMonthlyRevenue, totalMonthlyCost
}) => {
    const data = [];
    let cumulativeProfit = -initialInvestment;
    let cumulativeRevenue = 0;
    let cumulativeCosts = 0;

    for (let month = 0; month <= 36; month++) {
        if (month > 0) {
            const monthlyRevenue = rampUpEnabled ? calculateRampedRevenue(month) : totalMonthlyRevenue;
            const monthlyCosts = rampUpEnabled ? calculateRampedCosts(month) : totalMonthlyCost;
            const monthlyProfit = monthlyRevenue - monthlyCosts;

            cumulativeProfit += monthlyProfit;
            cumulativeRevenue += monthlyRevenue;
            cumulativeCosts += monthlyCosts;
        }

        data.push({
            month,
            profit: cumulativeProfit,
            revenue: cumulativeRevenue,
            costs: cumulativeCosts + (month === 0 ? initialInvestment : 0),
            netProfit: cumulativeProfit
        });
    }
    return data;
};

/**
 * Generate cost breakdown pie chart data
 */
export const generateCostBreakdownData = ({
    totalNodeCost, totalPhoneCost, totalMonthlyCost, monthlyCreditCost
}) => {
    return [
        { name: 'Node Cost', value: totalNodeCost, color: '#8b5cf6' },
        { name: 'Phones', value: totalPhoneCost, color: '#06b6d4' },
        { name: 'Monthly SIM', value: totalMonthlyCost, color: '#10b981' },
        { name: 'Credits', value: monthlyCreditCost, color: '#f59e0b' }
    ].filter(item => item.value > 0);
};

/**
 * Generate ROI comparison chart data
 */
export const generateROIComparisonData = ({
    roi12Month, roi24Month, netMonthlyProfit
}) => {
    return [
        { scenario: '12 Month', roi: roi12Month, profit: netMonthlyProfit * 12 },
        { scenario: '24 Month', roi: roi24Month, profit: netMonthlyProfit * 24 }
    ];
};
