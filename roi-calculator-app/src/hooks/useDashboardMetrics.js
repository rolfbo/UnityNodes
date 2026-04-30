import { useMemo } from 'react';
import { getEarningsStats } from '../utils/earningsStorage.js';

/**
 * Hook computing all dashboard metrics and chart data
 */
export function useDashboardMetrics(earnings, nodeMapping = {}, selectedEarningIds, useDashboardSelection) {
    // Filter to bound nodes only (if nodeMapping is available)
    const dashboardEarnings = useMemo(() => {
        let data = [...earnings];

        // Filter to bound nodes (skip if no mapping or empty mapping)
        if (nodeMapping && Object.keys(nodeMapping).length > 0) {
            data = data.filter(e => {
                const bound = nodeMapping[e.nodeId]?.bound;
                return bound === true || bound === 'true';
            });
        }

        // If dashboard selection enabled, further filter to selected
        if (useDashboardSelection && selectedEarningIds.size > 0) {
            data = data.filter(e => selectedEarningIds.has(e.id));
        }

        return data;
    }, [earnings, nodeMapping, useDashboardSelection, selectedEarningIds]);

    const stats = useMemo(() => {
        if (dashboardEarnings.length === 0) {
            return {
                total: 0, count: 0, average: 0,
                uniqueNodes: 0, byLicenseType: {}
            };
        }

        const total = dashboardEarnings.reduce((sum, e) => sum + (e.amount || 0), 0);
        const average = total / dashboardEarnings.length;
        const uniqueNodes = new Set(dashboardEarnings.map(e => e.nodeId)).size;

        const byLicenseType = {};
        dashboardEarnings.forEach(e => {
            if (!byLicenseType[e.licenseType]) {
                byLicenseType[e.licenseType] = { count: 0, total: 0 };
            }
            byLicenseType[e.licenseType].count += 1;
            byLicenseType[e.licenseType].total += e.amount || 0;
        });

        return { total, count: dashboardEarnings.length, average, uniqueNodes, byLicenseType };
    }, [dashboardEarnings]);

    const thisMonthEarnings = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return dashboardEarnings
            .filter(e => {
                const eDate = new Date(e.date);
                return eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + (e.amount || 0), 0);
    }, [dashboardEarnings]);

    const avgDailyEarnings = useMemo(() => {
        if (dashboardEarnings.length === 0) return 0;
        const uniqueDates = new Set(dashboardEarnings.map(e => e.date)).size;
        return stats.total / Math.max(uniqueDates, 1);
    }, [dashboardEarnings, stats.total]);

    // Rolling 3-day average
    const avgDailyPerDevice = useMemo(() => {
        if (dashboardEarnings.length === 0) return 0;

        const uniqueDates = [...new Set(dashboardEarnings.map(e => e.date))].sort().reverse();
        const last3Dates = uniqueDates.slice(0, 3);

        if (last3Dates.length === 0) return 0;

        const dataInLast3Days = dashboardEarnings.filter(e => last3Dates.includes(e.date));
        const byNode = {};

        dataInLast3Days.forEach(e => {
            if (!byNode[e.nodeId]) byNode[e.nodeId] = [];
            byNode[e.nodeId].push(e.amount || 0);
        });

        const perDeviceAvgs = Object.values(byNode).map(amounts => {
            return amounts.reduce((a, b) => a + b, 0) / amounts.length;
        });

        return perDeviceAvgs.length > 0
            ? perDeviceAvgs.reduce((a, b) => a + b, 0) / perDeviceAvgs.length
            : 0;
    }, [dashboardEarnings]);

    const topEarningDevice = useMemo(() => {
        if (dashboardEarnings.length === 0) {
            return { nodeId: 'N/A', licenseType: 'N/A', total: 0 };
        }

        const byNode = {};
        dashboardEarnings.forEach(e => {
            if (!byNode[e.nodeId]) {
                byNode[e.nodeId] = { licenseType: e.licenseType, total: 0 };
            }
            byNode[e.nodeId].total += e.amount || 0;
        });

        const sorted = Object.entries(byNode).sort((a, b) => b[1].total - a[1].total);
        return sorted.length > 0
            ? { nodeId: sorted[0][0], licenseType: sorted[0][1].licenseType, total: sorted[0][1].total }
            : { nodeId: 'N/A', licenseType: 'N/A', total: 0 };
    }, [dashboardEarnings]);

    const activeBoundNodes = useMemo(() => {
        return new Set(dashboardEarnings.map(e => e.nodeId)).size;
    }, [dashboardEarnings]);

    const chartData = useMemo(() => {
        const byDate = {};
        dashboardEarnings.forEach(e => {
            if (!byDate[e.date]) byDate[e.date] = { daily: 0, byLicense: {} };
            byDate[e.date].daily += e.amount || 0;
            if (!byDate[e.date].byLicense[e.licenseType]) {
                byDate[e.date].byLicense[e.licenseType] = 0;
            }
            byDate[e.date].byLicense[e.licenseType] += e.amount || 0;
        });

        const sortedDates = Object.keys(byDate).sort();
        let cumulative = 0;

        const cumulativeData = sortedDates.map(date => {
            cumulative += byDate[date].daily;
            return { date, earnings: cumulative };
        });

        const dailyData = sortedDates.map(date => ({
            date, earnings: byDate[date].daily
        }));

        const licenseTypeData = {};
        dashboardEarnings.forEach(e => {
            if (!licenseTypeData[e.licenseType]) licenseTypeData[e.licenseType] = 0;
            licenseTypeData[e.licenseType] += e.amount || 0;
        });

        const pieData = Object.entries(licenseTypeData).map(([type, amount], idx) => ({
            name: type, value: amount,
            color: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][idx % 5]
        }));

        return { cumulativeData, dailyData, pieData };
    }, [dashboardEarnings]);

    return {
        dashboardEarnings, stats, thisMonthEarnings, avgDailyEarnings,
        avgDailyPerDevice, topEarningDevice, activeBoundNodes, chartData
    };
}
