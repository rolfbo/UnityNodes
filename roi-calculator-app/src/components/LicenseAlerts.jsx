/**
 * License Alerts Component
 *
 * This React component displays alerts and notifications for license management
 * including unbound licenses, lease expirations, and optimization recommendations.
 *
 * Key Features:
 * - Critical alerts for unbound licenses
 * - Warning alerts for lease expirations
 * - Revenue loss notifications
 * - Optimization suggestions
 * - Alert filtering and management
 * - Snooze/dismiss functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.licenses - Array of license objects
 * @param {Object} props.stats - License statistics
 * @param {Function} props.onRefresh - Callback to refresh data
 * @returns {JSX.Element} The license alerts interface
 */

import React, { useState, useMemo } from 'react';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    X,
    Clock,
    DollarSign,
    Users,
    Calendar,
    TrendingUp,
    CheckCircle,
    Bell,
    BellOff,
    Filter
} from 'lucide-react';

export default function LicenseAlerts({ licenses, stats, onRefresh }) {
    const [filterType, setFilterType] = useState('all');
    const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

    // Generate alerts based on license data
    const alerts = useMemo(() => {
        const alertList = [];
        const now = new Date();

        licenses.forEach(license => {
            const licenseId = license.licenseId;

            // 1. Unbound license alerts
            if (license.status.startsWith('leased') && !license.bindingInfo?.isBound) {
                let unboundDays = 0;
                let lastActive = null;

                if (license.bindingInfo?.lastActive) {
                    lastActive = new Date(license.bindingInfo.lastActive);
                    unboundDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
                } else {
                    // If never active, consider it critically unbound
                    unboundDays = 999; // Very high number to indicate critical status
                }

                const estimatedDailyRevenue = 5; // $5 per license per day (placeholder)
                const lostRevenue = unboundDays * estimatedDailyRevenue;

                let severity = 'warning';
                let title = '';
                let message = '';
                let icon = AlertTriangle;

                if (unboundDays >= 7) {
                    severity = 'critical';
                    title = 'License Critically Unbound';
                    message = `License has been unbound for ${unboundDays} days, losing $${lostRevenue.toFixed(2)} in potential revenue.`;
                    icon = AlertCircle;
                } else if (unboundDays >= 2) {
                    severity = 'warning';
                    title = 'License Unbound';
                    message = `License has been unbound for ${unboundDays} days. Contact customer to resolve.`;
                    icon = AlertTriangle;
                }

                if (severity !== 'warning' || unboundDays >= 2) {
                    alertList.push({
                        id: `unbound-${licenseId}`,
                        type: 'unbound',
                        severity,
                        title,
                        message,
                        licenseId,
                        customer: license.leaseInfo?.customer || 'Unknown',
                        unboundDays,
                        lostRevenue,
                        icon,
                        timestamp: now,
                        actionable: true
                    });
                }
            }

            // 2. Lease expiry alerts
            if (license.leaseInfo?.startDate && license.leaseInfo?.duration) {
                const startDate = new Date(license.leaseInfo.startDate);
                const duration = license.leaseInfo.durationUnit === 'months' ?
                    license.leaseInfo.duration * 30 : license.leaseInfo.duration;
                const expiryDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
                const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

                if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
                    alertList.push({
                        id: `expiry-${licenseId}`,
                        type: 'expiry',
                        severity: daysUntilExpiry <= 7 ? 'critical' : 'warning',
                        title: 'Lease Expiring Soon',
                        message: `Lease for ${license.leaseInfo.customer} expires in ${daysUntilExpiry} days (${expiryDate.toLocaleDateString()}). Renew or contact customer.`,
                        licenseId,
                        customer: license.leaseInfo.customer,
                        expiryDate,
                        daysUntilExpiry,
                        icon: Calendar,
                        timestamp: now,
                        actionable: true
                    });
                } else if (daysUntilExpiry <= 0) {
                    alertList.push({
                        id: `expired-${licenseId}`,
                        type: 'expiry',
                        severity: 'critical',
                        title: 'Lease Expired',
                        message: `Lease for ${license.leaseInfo.customer} expired ${Math.abs(daysUntilExpiry)} days ago. Take immediate action.`,
                        licenseId,
                        customer: license.leaseInfo.customer,
                        expiryDate,
                        daysUntilExpiry,
                        icon: AlertCircle,
                        timestamp: now,
                        actionable: true
                    });
                }
            }
        });

        // 3. Optimization alerts (not license-specific)
        if (stats.unbound > 0) {
            const totalUnboundRevenue = stats.unbound * 5 * 30; // Assuming $5/day for 30 days
            alertList.push({
                id: 'optimization-high-unbound',
                type: 'optimization',
                severity: 'info',
                title: 'High Unbound License Count',
                message: `${stats.unbound} licenses are currently unbound, potentially losing $${totalUnboundRevenue.toFixed(2)} monthly. Focus on customer support.`,
                icon: TrendingUp,
                timestamp: now,
                actionable: false
            });
        }

        if (stats.total > 0 && (stats.bound / stats.total) < 0.8) {
            alertList.push({
                id: 'optimization-low-utilization',
                type: 'optimization',
                severity: 'info',
                title: 'Low License Utilization',
                message: `Only ${(stats.bound / stats.total * 100).toFixed(1)}% of licenses are bound. Consider reviewing lease terms or customer support processes.`,
                icon: Info,
                timestamp: now,
                actionable: false
            });
        }

        // Sort alerts by severity and timestamp
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return alertList
            .filter(alert => !dismissedAlerts.has(alert.id))
            .sort((a, b) => {
                if (a.severity !== b.severity) {
                    return severityOrder[a.severity] - severityOrder[b.severity];
                }
                return b.timestamp - a.timestamp;
            });
    }, [licenses, stats, dismissedAlerts]);

    // Filter alerts
    const filteredAlerts = alerts.filter(alert => {
        if (filterType === 'all') return true;
        return alert.type === filterType;
    });

    // Alert statistics
    const alertStats = {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length
    };

    // Handle dismiss alert
    const dismissAlert = (alertId) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
    };

    // Handle dismiss all of type
    const dismissAllOfType = (type) => {
        const alertsToDismiss = alerts
            .filter(alert => alert.type === type)
            .map(alert => alert.id);
        setDismissedAlerts(prev => new Set([...prev, ...alertsToDismiss]));
    };

    // Get severity styling
    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-900/20',
                    border: 'border-red-400/30',
                    text: 'text-red-300',
                    icon: 'text-red-400'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-900/20',
                    border: 'border-yellow-400/30',
                    text: 'text-yellow-300',
                    icon: 'text-yellow-400'
                };
            case 'info':
                return {
                    bg: 'bg-blue-900/20',
                    border: 'border-blue-400/30',
                    text: 'text-blue-300',
                    icon: 'text-blue-400'
                };
            default:
                return {
                    bg: 'bg-slate-800/50',
                    border: 'border-purple-400/20',
                    text: 'text-slate-300',
                    icon: 'text-slate-400'
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={24} className="text-red-400" />
                        License Alerts
                    </h2>
                    <p className="text-slate-400">
                        Monitor license status, expirations, and optimization opportunities
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                        {alertStats.total} active alerts
                    </span>
                </div>
            </div>

            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell size={16} className="text-purple-400" />
                        <span className="text-sm text-slate-400">Total Alerts</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{alertStats.total}</p>
                </div>

                <div className="bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-red-400" />
                        <span className="text-sm text-red-400">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-red-300">{alertStats.critical}</p>
                </div>

                <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-yellow-400" />
                        <span className="text-sm text-yellow-400">Warnings</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-300">{alertStats.warning}</p>
                </div>

                <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-blue-400" />
                        <span className="text-sm text-blue-400">Info</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-300">{alertStats.info}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-400">Filter:</span>
                    </div>
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'All Alerts', count: alertStats.total },
                            { value: 'unbound', label: 'Unbound Licenses', count: alerts.filter(a => a.type === 'unbound').length },
                            { value: 'expiry', label: 'Lease Expiry', count: alerts.filter(a => a.type === 'expiry').length },
                            { value: 'optimization', label: 'Optimization', count: alerts.filter(a => a.type === 'optimization').length }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setFilterType(filter.value)}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterType === filter.value
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>
                    {filterType !== 'all' && (
                        <button
                            onClick={() => dismissAllOfType(filterType)}
                            className="ml-auto px-3 py-1 text-sm bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            Dismiss All
                        </button>
                    )}
                </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => {
                        const styles = getSeverityStyles(alert.severity);
                        const Icon = alert.icon;

                        return (
                            <div
                                key={alert.id}
                                className={`${styles.bg} backdrop-blur-sm border ${styles.border} rounded-xl p-4`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <Icon size={20} className={styles.icon} />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white mb-1">
                                                {alert.title}
                                            </h4>
                                            <p className="text-sm text-slate-300 mb-2">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                {alert.customer && (
                                                    <span className="flex items-center gap-1">
                                                        <Users size={12} />
                                                        {alert.customer}
                                                    </span>
                                                )}
                                                {alert.licenseId && (
                                                    <span className="font-mono">
                                                        {alert.licenseId.substring(0, 10)}...
                                                    </span>
                                                )}
                                                {alert.unboundDays && alert.unboundDays < 999 && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {alert.unboundDays} days unbound
                                                    </span>
                                                )}
                                                {alert.lostRevenue && (
                                                    <span className="flex items-center gap-1 text-red-400">
                                                        <DollarSign size={12} />
                                                        ${alert.lostRevenue.toFixed(2)} lost
                                                    </span>
                                                )}
                                                {alert.daysUntilExpiry !== undefined && (
                                                    <span className={`flex items-center gap-1 ${alert.daysUntilExpiry <= 7 ? 'text-red-400' :
                                                            alert.daysUntilExpiry <= 30 ? 'text-yellow-400' : 'text-green-400'
                                                        }`}>
                                                        <Calendar size={12} />
                                                        {alert.daysUntilExpiry > 0
                                                            ? `${alert.daysUntilExpiry} days left`
                                                            : `${Math.abs(alert.daysUntilExpiry)} days overdue`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {alert.actionable && (
                                            <button className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg transition-colors">
                                                Take Action
                                            </button>
                                        )}
                                        <button
                                            onClick={() => dismissAlert(alert.id)}
                                            className="p-1 text-slate-500 hover:text-slate-400 transition-colors"
                                            title="Dismiss alert"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                            <CheckCircle size={24} />
                            <span className="text-lg font-medium">All Clear!</span>
                        </div>
                        <p className="text-slate-400 mb-4">
                            {filterType === 'all'
                                ? "No active alerts. All licenses are properly managed."
                                : `No ${filterType} alerts at this time.`
                            }
                        </p>
                        {stats.total > 0 && (
                            <div className="text-sm text-slate-500">
                                Monitoring {stats.total} licenses • {stats.bound} bound • {stats.unbound} unbound
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            {alertStats.critical > 0 && (
                <div className="bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-400" />
                        <div className="flex-1">
                            <h4 className="font-medium text-red-300">
                                {alertStats.critical} Critical Alert{alertStats.critical > 1 ? 's' : ''} Require{alertStats.critical > 1 ? '' : 's'} Attention
                            </h4>
                            <p className="text-sm text-slate-300">
                                Critical alerts should be addressed immediately to prevent revenue loss.
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm">
                            View Critical Alerts
                        </button>
                    </div>
                </div>
            )}

            {/* Alert Settings */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-purple-400" />
                    Alert Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-white mb-2">Unbound License Alerts</h4>
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Critical: Unbound ≥ 7 days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span>Warning: Unbound ≥ 2 days</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-white mb-2">Lease Expiry Alerts</h4>
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Critical: Expires in ≤ 7 days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span>Warning: Expires in ≤ 30 days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Expired: Past due date</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-purple-400/20">
                    <p className="text-sm text-slate-500">
                        Alerts are automatically generated based on license status and can be dismissed individually.
                        Critical alerts require immediate attention to prevent revenue loss.
                    </p>
                </div>
            </div>
        </div>
    );
}