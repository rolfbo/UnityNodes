import { DollarSign, Calendar, TrendingUp, Hash, AlertCircle } from 'lucide-react';

export function MetricsCards({ stats, thisMonthEarnings, avgDailyEarnings, activeBoundNodes, avgDailyPerDevice, topEarningDevice }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">Total Earnings</h3>
                    <DollarSign className="text-green-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">${stats.total.toFixed(2)}</p>
                <p className="text-xs text-purple-300 mt-1">{stats.count} transactions</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">This Month</h3>
                    <Calendar className="text-blue-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">${thisMonthEarnings.toFixed(2)}</p>
                <p className="text-xs text-purple-300 mt-1">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">Avg Daily</h3>
                    <TrendingUp className="text-purple-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">${avgDailyEarnings.toFixed(2)}</p>
                <p className="text-xs text-purple-300 mt-1">per active day</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">Active ULOs</h3>
                    <Hash className="text-orange-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">{activeBoundNodes}</p>
                <p className="text-xs text-purple-300 mt-1">bound devices</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">Avg/Day/Device</h3>
                    <TrendingUp className="text-cyan-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white">${avgDailyPerDevice.toFixed(2)}</p>
                <p className="text-xs text-purple-300 mt-1">last 3 days rolling avg</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-purple-200 text-sm">Top Device</h3>
                    <Hash className="text-yellow-400" size={20} />
                </div>
                {topEarningDevice ? (
                    <>
                        <p className="text-xl font-bold text-white font-mono mb-1">{topEarningDevice.nodeId}</p>
                        <p className="text-xs text-purple-300">${topEarningDevice.total.toFixed(2)}</p>
                    </>
                ) : (
                    <p className="text-xs text-purple-300">No data</p>
                )}
            </div>
        </div>
    );
}
