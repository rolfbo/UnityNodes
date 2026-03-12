import { formatNumber } from '../../utils/formatters.js';

/**
 * Sticky summary bars - top and mobile bottom
 */
export function StickyBars({ netMonthlyProfit, dailyNetProfit, breakEvenMonths, annualRevenue, usdToEur, dailyNetProfitEur }) {
    return (
        <>
            {/* Top sticky bar */}
            <div className="hidden md:block sticky top-16 bg-gradient-to-r from-purple-900/95 to-slate-900/95 backdrop-blur-sm border-b border-purple-400/30 z-40 py-3">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-purple-300">Monthly</p>
                        <p className="text-lg font-bold text-white">${formatNumber(netMonthlyProfit)}</p>
                    </div>
                    <div>
                        <p className="text-purple-300">Daily (USD)</p>
                        <p className="text-lg font-bold text-white">${formatNumber(dailyNetProfit)}</p>
                    </div>
                    <div>
                        <p className="text-purple-300">Break-Even</p>
                        <p className="text-lg font-bold text-white">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</p>
                    </div>
                    <div>
                        <p className="text-purple-300">Annual Revenue</p>
                        <p className="text-lg font-bold text-white">${formatNumber(annualRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* Mobile bottom sticky bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-purple-400/30 px-4 py-3 z-40">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <p className="text-purple-300 text-xs">Monthly Profit</p>
                        <p className="font-bold text-white">${formatNumber(netMonthlyProfit)}</p>
                    </div>
                    <div>
                        <p className="text-purple-300 text-xs">Break-Even</p>
                        <p className="font-bold text-white">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</p>
                    </div>
                </div>
            </div>
        </>
    );
}
