/**
 * Revenue Loss Analysis Component
 *
 * This React component provides comprehensive analysis of revenue loss
 * from unbound licenses with interactive charts and detailed calculations.
 *
 * Key Features:
 * - Revenue loss calculations (days unbound × estimated daily revenue)
 * - Interactive charts showing loss over time
 * - Customer performance analysis
 * - Timeline view of binding/unbinding events
 * - Optimization recommendations
 * - Exportable reports
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.licenses - Array of license objects
 * @param {Object} props.stats - License statistics
 * @param {Function} props.onRefresh - Callback to refresh data
 * @returns {JSX.Element} The revenue loss analysis interface
 */

import React, { useState, useMemo } from 'react';
import {
    TrendingDown,
    DollarSign,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon,
    AlertTriangle,
    Download,
    RefreshCw,
    Info,
    Users,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

export default function RevenueLossAnalysis({ licenses, stats, onRefresh }) {
    const [timeRange, setTimeRange] = useState('30'); // days
    const [estimatedDailyRevenue, setEstimatedDailyRevenue] = useState(5); // $ per license per day

    // Calculate revenue loss data
    const revenueLossData = useMemo(() => {
        const now = new Date();
        const rangeDays = parseInt(timeRange);
        const rangeStart = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);

        // Group losses by customer
        const customerLosses = {};
        let totalLostRevenue = 0;
        let totalUnboundDays = 0;

        licenses.forEach(license => {
            // Only calculate for leased licenses that are currently unbound
            if (license.status === 'leased-unbound' || (license.status.startsWith('leased') && !license.bindingInfo?.isBound)) {
                const customer = license.leaseInfo?.customer || 'Unknown Customer';

                if (!customerLosses[customer]) {
                    customerLosses[customer] = {
                        customer,
                        unboundLicenses: 0,
                        totalLostRevenue: 0,
                        totalUnboundDays: 0,
                        licenses: []
                    };
                }

                // Calculate unbound days
                let unboundDays = 0;
                if (license.bindingInfo?.lastActive) {
                    const lastActive = new Date(license.bindingInfo.lastActive);
                    if (lastActive >= rangeStart) {
                        unboundDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
                    }
                } else {
                    // If never been active, assume unbound for the entire range
                    unboundDays = rangeDays;
                }

                const lostRevenue = unboundDays * estimatedDailyRevenue;

                customerLosses[customer].unboundLicenses++;
                customerLosses[customer].totalLostRevenue += lostRevenue;
                customerLosses[customer].totalUnboundDays += unboundDays;
                customerLosses[customer].licenses.push({
                    licenseId: license.licenseId,
                    unboundDays,
                    lostRevenue,
                    lastActive: license.bindingInfo?.lastActive
                });

                totalLostRevenue += lostRevenue;
                totalUnboundDays += unboundDays;
            }
        });

        // Convert to arrays for charts
        const customerLossArray = Object.values(customerLosses).sort((a, b) => b.totalLostRevenue - a.totalLostRevenue);

        // Daily loss timeline (simplified - would need historical data for accuracy)
        const dailyLossData = [];
        for (let i = rangeDays - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayUnboundLicenses = licenses.filter(license => {
                if (!license.status.startsWith('leased') || license.bindingInfo?.isBound) return false;

                const lastActive = license.bindingInfo?.lastActive ?
                    new Date(license.bindingInfo.lastActive) : new Date(0);

                return lastActive <= date;
            }).length;

            dailyLossData.push({
                date: date.toISOString().split('T')[0],
                unboundLicenses: dayUnboundLicenses,
                lostRevenue: dayUnboundLicenses * estimatedDailyRevenue
            });
        }

        return {
            totalLostRevenue,
            totalUnboundDays,
            averageLossPerDay: totalUnboundDays > 0 ? totalLostRevenue / totalUnboundDays : 0,
            customerLosses: customerLossArray,
            dailyLossData,
            potentialRevenue: stats.total * estimatedDailyRevenue * rangeDays,
            actualRevenue: (stats.total - (stats.unbound || 0)) * estimatedDailyRevenue * rangeDays,
            efficiency: stats.total > 0 ? ((stats.total - (stats.unbound || 0)) / stats.total) * 100 : 0
        };
    }, [licenses, stats, timeRange, estimatedDailyRevenue]);

    // Colors for charts
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

    // Format currency
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Export analysis report
    const exportReport = () => {
        const reportData = {
            generatedAt: new Date().toISOString(),
            timeRange: `${timeRange} days`,
            estimatedDailyRevenue: `$${estimatedDailyRevenue}`,
            summary: {
                totalLostRevenue: formatCurrency(revenueLossData.totalLostRevenue),
                totalUnboundDays: revenueLossData.totalUnboundDays,
                averageLossPerDay: formatCurrency(revenueLossData.averageLossPerDay),
                revenueEfficiency: `${revenueLossData.efficiency.toFixed(1)}%`
            },
            customerBreakdown: revenueLossData.customerLosses.map(customer => ({
                customer: customer.customer,
                unboundLicenses: customer.unboundLicenses,
                totalLostRevenue: formatCurrency(customer.totalLostRevenue),
                totalUnboundDays: customer.totalUnboundDays,
                licenses: customer.licenses.map(license => ({
                    licenseId: license.licenseId.substring(0, 10) + '...',
                    unboundDays: license.unboundDays,
                    lostRevenue: formatCurrency(license.lostRevenue)
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `revenue-loss-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <TrendingDown size={24} className="text-red-400" />
                        Revenue Loss Analysis
                    </h2>
                    <p className="text-slate-400">
                        Analyze revenue loss from unbound licenses and identify optimization opportunities
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors border border-purple-400/20"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <button
                        onClick={exportReport}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Analysis Time Range
                        </label>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="180">Last 180 days</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Est. Daily Revenue per License
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={estimatedDailyRevenue}
                                onChange={(e) => setEstimatedDailyRevenue(parseFloat(e.target.value) || 0)}
                                className="flex-1 px-3 py-2 bg-slate-800/50 border border-purple-400/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-colors outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="w-full p-3 bg-slate-800/30 rounded-lg border border-purple-400/20">
                            <div className="text-xs text-slate-500">Revenue Efficiency</div>
                            <div className="text-lg font-bold text-white">
                                {revenueLossData.efficiency.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500">
                                {stats.total - (stats.unbound || 0)} / {stats.total} licenses bound
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={20} className="text-red-400" />
                        <span className="text-xs text-red-400 font-medium">LOST REVENUE</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(revenueLossData.totalLostRevenue)}
                        </p>
                        <p className="text-sm text-slate-400">
                            In the last {timeRange} days
                        </p>
                    </div>
                </div>

                <div className="bg-orange-900/20 backdrop-blur-sm border border-orange-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Clock size={20} className="text-orange-400" />
                        <span className="text-xs text-orange-400 font-medium">UNBOUND DAYS</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {revenueLossData.totalUnboundDays}
                        </p>
                        <p className="text-sm text-slate-400">
                            Total days licenses were unbound
                        </p>
                    </div>
                </div>

                <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingDown size={20} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">AVG LOSS/DAY</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(revenueLossData.averageLossPerDay)}
                        </p>
                        <p className="text-sm text-slate-400">
                            Average loss per unbound license
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 size={20} className="text-purple-400" />
                        <span className="text-xs text-purple-400 font-medium">IMPACT</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">
                            {((revenueLossData.totalLostRevenue / (revenueLossData.potentialRevenue || 1)) * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-slate-400">
                            Of potential revenue lost
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Loss Timeline */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-purple-400" />
                        Daily Revenue Loss Timeline
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueLossData.dailyLossData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    tickFormatter={formatDate}
                                />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: '1px solid #7c3aed',
                                        borderRadius: '8px'
                                    }}
                                    labelFormatter={(label) => `Date: ${formatDate(label)}`}
                                    formatter={(value, name) => [
                                        name === 'lostRevenue' ? formatCurrency(value) : value,
                                        name === 'lostRevenue' ? 'Lost Revenue' : 'Unbound Licenses'
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="lostRevenue"
                                    stackId="1"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Loss Breakdown */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <PieChartIcon size={18} className="text-purple-400" />
                        Loss by Customer
                    </h3>
                    {revenueLossData.customerLosses.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueLossData.customerLosses.slice(0, 6)}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="totalLostRevenue"
                                        label={({ customer, percent }) => `${customer}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {revenueLossData.customerLosses.slice(0, 6).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #7c3aed',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                                <PieChartIcon size={48} className="mx-auto text-slate-600 mb-4" />
                                <p className="text-slate-400">No revenue loss data</p>
                                <p className="text-sm text-slate-500">All licenses are currently bound</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Details Table */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users size={18} className="text-purple-400" />
                    Customer Revenue Loss Details
                </h3>

                {revenueLossData.customerLosses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-purple-400/20">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Unbound Licenses</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Total Unbound Days</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Lost Revenue</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Avg Loss/Day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueLossData.customerLosses.map((customer, index) => (
                                    <tr key={customer.customer} className="border-b border-purple-400/10">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="text-white font-medium">{customer.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{customer.unboundLicenses}</td>
                                        <td className="px-4 py-3 text-slate-300">{customer.totalUnboundDays}</td>
                                        <td className="px-4 py-3 text-red-400 font-medium">
                                            {formatCurrency(customer.totalLostRevenue)}
                                        </td>
                                        <td className="px-4 py-3 text-yellow-400">
                                            {formatCurrency(customer.totalLostRevenue / (customer.totalUnboundDays || 1))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                            <Info size={20} />
                            <span className="font-medium">No Revenue Loss</span>
                        </div>
                        <p className="text-slate-400">All leased licenses are currently bound and generating revenue</p>
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-yellow-400" />
                    Optimization Recommendations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {revenueLossData.totalLostRevenue > 0 ? (
                        <>
                            <div className="p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
                                <h4 className="font-medium text-yellow-300 mb-2">High Priority</h4>
                                <p className="text-sm text-slate-300">
                                    Contact customers with the highest revenue loss to resolve binding issues.
                                    {revenueLossData.customerLosses[0] && (
                                        <span className="font-medium text-white">
                                            {' '}{revenueLossData.customerLosses[0].customer}
                                        </span>
                                    )} has lost {formatCurrency(revenueLossData.customerLosses[0]?.totalLostRevenue || 0)}.
                                </p>
                            </div>

                            <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                                <h4 className="font-medium text-blue-300 mb-2">Monitor Trends</h4>
                                <p className="text-sm text-slate-300">
                                    Set up alerts for licenses unbound for more than 2 days.
                                    Currently losing {formatCurrency(revenueLossData.averageLossPerDay)} per unbound license per day.
                                </p>
                            </div>

                            <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
                                <h4 className="font-medium text-purple-300 mb-2">Revenue Optimization</h4>
                                <p className="text-sm text-slate-300">
                                    Consider adjusting lease terms or providing technical support to customers
                                    with consistently unbound licenses to improve utilization rates.
                                </p>
                            </div>

                            <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
                                <h4 className="font-medium text-green-300 mb-2">Success Metrics</h4>
                                <p className="text-sm text-slate-300">
                                    Track binding rates over time. Aim for 95%+ license utilization.
                                    Current efficiency: {revenueLossData.efficiency.toFixed(1)}%
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="col-span-2 p-6 bg-green-900/20 border border-green-400/30 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                                <Info size={20} />
                                <span className="font-medium">Excellent Performance!</span>
                            </div>
                            <p className="text-slate-300">
                                All leased licenses are currently bound and generating revenue.
                                Continue monitoring and consider expanding your license portfolio.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}