/**
 * License Inventory Dashboard Component
 *
 * This React component displays an overview dashboard of license inventory
 * with status cards, revenue metrics, and key performance indicators.
 *
 * Key Features:
 * - Status overview cards (total, bound, unbound, available)
 * - Revenue impact metrics (potential vs actual)
 * - License utilization percentage
 * - Recent activity summary
 * - Quick action buttons
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.licenses - Array of license objects
 * @param {Object} props.stats - License statistics object
 * @param {Function} props.onRefresh - Callback to refresh data
 * @returns {JSX.Element} The inventory dashboard interface
 */

import React from 'react';
import {
    Database,
    CheckCircle,
    AlertTriangle,
    Clock,
    DollarSign,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Plus,
    Eye,
    AlertCircle
} from 'lucide-react';

export default function LicenseInventoryDashboard({ licenses, stats, onRefresh }) {
    // Calculate additional metrics
    const boundPercentage = stats.total > 0 ? Math.round((stats.bound / stats.total) * 100) : 0;
    const unboundPercentage = stats.total > 0 ? Math.round((stats.unbound / stats.total) * 100) : 0;
    const leasedPercentage = stats.total > 0 ? Math.round((stats.leased / stats.total) * 100) : 0;

    // Revenue calculations (placeholder - will be enhanced with actual ROI data later)
    const estimatedDailyRevenue = 5; // $5 per bound license per day (placeholder)
    const potentialDailyRevenue = stats.total * estimatedDailyRevenue;
    const actualDailyRevenue = stats.bound * estimatedDailyRevenue;
    const lostDailyRevenue = (stats.unbound + (stats.total - stats.bound - stats.unbound)) * estimatedDailyRevenue;

    const revenueImpact = {
        potential: potentialDailyRevenue,
        actual: actualDailyRevenue,
        lost: lostDailyRevenue,
        efficiency: potentialDailyRevenue > 0 ? Math.round((actualDailyRevenue / potentialDailyRevenue) * 100) : 0
    };

    const statusCards = [
        {
            title: 'Total Licenses',
            value: stats.total || 0,
            icon: Database,
            color: 'blue',
            description: 'All licenses in your inventory'
        },
        {
            title: 'Bound & Earning',
            value: stats.bound || 0,
            percentage: boundPercentage,
            icon: CheckCircle,
            color: 'green',
            description: 'Licenses actively generating revenue'
        },
        {
            title: 'Leased but Unbound',
            value: stats.unbound || 0,
            percentage: unboundPercentage,
            icon: AlertTriangle,
            color: 'red',
            description: 'Revenue loss - leased but not earning',
            highlight: stats.unbound > 0
        },
        {
            title: 'Available',
            value: stats.available || 0,
            icon: Clock,
            color: 'purple',
            description: 'Not currently leased'
        }
    ];

    const revenueCards = [
        {
            title: 'Potential Daily Revenue',
            value: `$${revenueImpact.potential.toFixed(2)}`,
            icon: TrendingUp,
            color: 'blue',
            description: 'If all licenses were bound'
        },
        {
            title: 'Actual Daily Revenue',
            value: `$${revenueImpact.actual.toFixed(2)}`,
            icon: DollarSign,
            color: 'green',
            description: 'From currently bound licenses'
        },
        {
            title: 'Lost Daily Revenue',
            value: `$${revenueImpact.lost.toFixed(2)}`,
            icon: TrendingDown,
            color: 'red',
            description: 'From unbound licenses',
            highlight: revenueImpact.lost > 0
        },
        {
            title: 'Revenue Efficiency',
            value: `${revenueImpact.efficiency}%`,
            icon: Database,
            color: 'purple',
            description: 'Actual vs potential revenue'
        }
    ];

    // Get recent licenses (last 5 added/modified)
    const recentLicenses = licenses
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">License Inventory</h2>
                    <p className="text-slate-400">
                        Overview of your Unity Node license portfolio
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors border border-purple-400/20"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statusCards.map((card, index) => {
                    const Icon = card.icon;
                    const colorClasses = {
                        blue: 'text-blue-400 bg-blue-900/20 border-blue-400/30',
                        green: 'text-green-400 bg-green-900/20 border-green-400/30',
                        red: 'text-red-400 bg-red-900/20 border-red-400/30',
                        purple: 'text-purple-400 bg-purple-900/20 border-purple-400/30'
                    };

                    return (
                        <div
                            key={index}
                            className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 ${card.highlight ? 'ring-2 ring-red-400/50' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon size={20} className={colorClasses[card.color]} />
                                {card.percentage !== undefined && (
                                    <span className="text-xs text-slate-500">
                                        {card.percentage}%
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-white">
                                    {card.value}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {card.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Impact Section */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign size={20} className="text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Revenue Impact</h3>
                    <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
                        Estimated daily revenue
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {revenueCards.map((card, index) => {
                        const Icon = card.icon;
                        const colorClasses = {
                            blue: 'text-blue-400',
                            green: 'text-green-400',
                            red: 'text-red-400',
                            purple: 'text-purple-400'
                        };

                        return (
                            <div
                                key={index}
                                className={`bg-slate-800/50 border rounded-lg p-4 ${card.highlight ? 'ring-2 ring-red-400/50' : 'border-purple-400/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Icon size={16} className={colorClasses[card.color]} />
                                    {card.title === 'Revenue Efficiency' && (
                                        <span className={`text-xs px-2 py-1 rounded ${revenueImpact.efficiency >= 80 ? 'bg-green-900/20 text-green-400' :
                                                revenueImpact.efficiency >= 50 ? 'bg-yellow-900/20 text-yellow-400' :
                                                    'bg-red-900/20 text-red-400'
                                            }`}>
                                            {revenueImpact.efficiency >= 80 ? 'Good' :
                                                revenueImpact.efficiency >= 50 ? 'Fair' : 'Poor'}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-white">
                                        {card.value}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {card.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Revenue Efficiency Bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                        <span>Revenue Efficiency</span>
                        <span>{revenueImpact.efficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${revenueImpact.efficiency >= 80 ? 'bg-green-500' :
                                    revenueImpact.efficiency >= 50 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}
                            style={{ width: `${Math.min(revenueImpact.efficiency, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Licenses</h3>
                    <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        View All →
                    </button>
                </div>

                {recentLicenses.length > 0 ? (
                    <div className="space-y-3">
                        {recentLicenses.map((license, index) => (
                            <div
                                key={license.licenseId}
                                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-purple-400/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${license.status === 'leased-bound' ? 'bg-green-400' :
                                            license.status === 'leased-unbound' ? 'bg-red-400' :
                                                license.status === 'self-run' ? 'bg-blue-400' :
                                                    'bg-purple-400'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {license.licenseId.substring(0, 6)}...{license.licenseId.substring(license.licenseId.length - 4)}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {license.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            {license.leaseInfo?.customer && ` • ${license.leaseInfo.customer}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                        {new Date(license.updatedAt || license.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {license.bindingInfo?.isBound ? (
                                            <CheckCircle size={12} className="text-green-400" />
                                        ) : (
                                            <AlertCircle size={12} className="text-red-400" />
                                        )}
                                        <span className="text-xs text-slate-400">
                                            {license.bindingInfo?.isBound ? 'Bound' : 'Unbound'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Database size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">No licenses added yet</p>
                        <p className="text-sm text-slate-500 mt-1">
                            Add your first license to get started
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors border border-purple-400/20 text-left">
                        <Plus size={20} className="text-purple-400" />
                        <div>
                            <p className="text-sm font-medium text-white">Add License</p>
                            <p className="text-xs text-slate-400">Import or manually add</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors border border-purple-400/20 text-left">
                        <Eye size={20} className="text-blue-400" />
                        <div>
                            <p className="text-sm font-medium text-white">View Table</p>
                            <p className="text-xs text-slate-400">Detailed license list</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors border border-purple-400/20 text-left">
                        <TrendingUp size={20} className="text-green-400" />
                        <div>
                            <p className="text-sm font-medium text-white">Revenue Analysis</p>
                            <p className="text-xs text-slate-400">Loss analysis & insights</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors border border-purple-400/20 text-left">
                        <AlertTriangle size={20} className="text-red-400" />
                        <div>
                            <p className="text-sm font-medium text-white">Check Alerts</p>
                            <p className="text-xs text-slate-400">Unbound license alerts</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}