import { formatNumber } from '../../utils/formatters.js';

/**
 * Results dashboard - key financial metrics
 */
export function ResultsDashboard({ netMonthlyProfit, breakEvenMonths, annualProfit, usdToEur }) {
    return (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-xl p-6 border border-green-500/30">
                <p className="text-green-300 text-sm font-semibold mb-2">Net Monthly Profit</p>
                <p className="text-3xl font-bold text-white mb-1">${formatNumber(netMonthlyProfit)}</p>
                <p className="text-xs text-green-200">€{formatNumber(netMonthlyProfit * usdToEur)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl p-6 border border-blue-500/30">
                <p className="text-blue-300 text-sm font-semibold mb-2">Break-Even Period</p>
                <p className="text-3xl font-bold text-white">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} months</p>
                <p className="text-xs text-blue-200 mt-1">{isFinite(breakEvenMonths) ? Math.ceil(breakEvenMonths / 12) : '∞'} year(s)</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
                <p className="text-purple-300 text-sm font-semibold mb-2">Annual Profit</p>
                <p className="text-3xl font-bold text-white">${formatNumber(annualProfit)}</p>
                <p className="text-xs text-purple-200">€{formatNumber(annualProfit * usdToEur)}</p>
            </div>
        </div>
    );
}
