/**
 * Unity Nodes Earnings Tracker Component
 *
 * This React component provides a comprehensive interface for tracking actual earnings
 * from Unity Nodes. It allows users to paste earnings data, automatically parse it,
 * manage node mappings, and visualize earnings through an interactive dashboard.
 *
 * Key Features:
 * - Paste and parse earnings data from text
 * - Automatic duplicate detection and prevention
 * - Node ID to license type mapping management
 * - Sortable and filterable earnings table
 * - Interactive dashboard with charts and metrics
 * - Export functionality (JSON, CSV, PDF)
 * - Comparison with ROI projections
 *
 * The component manages all earnings data in browser localStorage, making it
 * persistent across sessions while keeping data private on the user's device.
 *
 * @component
 * @returns {JSX.Element} The complete earnings tracker interface
 */

import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import {
    DollarSign,
    Upload,
    Download,
    Trash2,
    Edit2,
    Check,
    X,
    TrendingUp,
    Calendar,
    Hash,
    Filter,
    Search,
    Plus,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Info,
    PieChart as PieChartIcon,
    BarChart3,
    FileDown,
    FileText,
    Database
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
import {
    loadEarnings,
    saveEarnings,
    addEarnings,
    deleteEarning,
    updateEarning,
    clearAllEarnings,
    getNodeMapping,
    updateNodeMapping,
    exportToJSON,
    exportToCSV,
    getEarningsStats
} from './utils/earningsStorage.js';
import { parseEarningsText, getExampleFormat } from './utils/earningsParser.js';
import jsPDF from 'jspdf';

/**
 * Info tooltip component for displaying help text
 */
const InfoTooltip = ({ content }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block ml-1">
            <Info
                size={16}
                className="text-purple-400 cursor-help"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            />
            {show && (
                <div className="absolute z-50 w-64 p-3 bg-slate-800 border border-purple-400/30 rounded-lg shadow-lg text-sm text-purple-200 left-0 top-full mt-1">
                    {content}
                </div>
            )}
        </div>
    );
};

/**
 * Custom styled DatePicker wrapper component
 * Wraps react-datepicker with our custom styling to match the app theme
 * 
 * Styling is defined in datepicker-custom.css which matches the purple/dark theme.
 * The calendar icon is positioned absolutely to the left of the input field.
 * 
 * @param {Date|null} selected - Currently selected date
 * @param {Function} onChange - Callback when date is selected
 * @param {string} placeholderText - Placeholder text for input
 * @param {Object} props - Additional props to pass to DatePicker
 */
const CustomDatePicker = ({ selected, onChange, placeholderText, ...props }) => {
    return (
        <div className="relative w-full">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none z-10" />
            <DatePicker
                selected={selected}
                onChange={onChange}
                placeholderText={placeholderText}
                dateFormat="yyyy-MM-dd"
                className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white hover:border-purple-400/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors cursor-pointer outline-none"
                calendarClassName="custom-datepicker"
                wrapperClassName="w-full"
                popperContainer={({ children }) => {
                    // Create portal to render calendar at document body level
                    // This ensures the calendar appears above all other elements
                    return ReactDOM.createPortal(children, document.body);
                }}
                popperProps={{
                    strategy: 'fixed'
                }}
                {...props}
            />
        </div>
    );
};

/**
 * Main Earnings Tracker App Component
 */
export default function EarningsTrackerApp() {
    // State management
    const [earnings, setEarnings] = useState([]);
    const [nodeMapping, setNodeMapping] = useState({});
    const [pasteText, setPasteText] = useState('');
    const [parseResult, setParseResult] = useState(null);
    const [filterLicenseType, setFilterLicenseType] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showExampleFormat, setShowExampleFormat] = useState(false);
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'table', 'input'

    // Selection state - tracks which earnings are selected in the Data Table
    const [selectedEarningIds, setSelectedEarningIds] = useState(new Set());
    // Dashboard filter state - determines if dashboard should use selected data
    const [useDashboardSelection, setUseDashboardSelection] = useState(false);

    // Load data on mount
    useEffect(() => {
        setEarnings(loadEarnings());
        setNodeMapping(getNodeMapping());
    }, []);

    /**
     * Handle parsing pasted earnings text
     */
    const handleParse = () => {
        const result = parseEarningsText(pasteText);
        setParseResult(result);

        if (result.success && result.earnings.length > 0) {
            // Add earnings to storage
            const addResult = addEarnings(result.earnings);

            // Update state
            setEarnings(loadEarnings());

            // Update parse result with add information
            setParseResult({
                ...result,
                addedCount: addResult.addedCount,
                potentialDuplicates: addResult.potentialDuplicates,
                duplicateCount: addResult.duplicateCount
            });

            // Clear paste text if successful
            if (addResult.addedCount > 0) {
                setPasteText('');
            }

            // Auto-switch to table view to show results
            if (addResult.addedCount > 0) {
                setTimeout(() => setActiveView('table'), 1500);
            }
        }
    };

    /**
     * Handle updating node mapping
     */
    const handleUpdateNodeMapping = (nodeId, licenseType) => {
        updateNodeMapping(nodeId, licenseType);
        setNodeMapping(getNodeMapping());
        setEarnings(loadEarnings()); // Reload to reflect updated license types
    };

    /**
     * Quick date range selection helpers
     */
    const handleQuickDateRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const handleThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    const handleLastMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);

        setFilterDateRange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        });
    };

    /**
     * Handle deleting an earning
     */
    const handleDelete = (earningId) => {
        if (confirm('Are you sure you want to delete this earning?')) {
            deleteEarning(earningId);
            setEarnings(loadEarnings());
        }
    };

    /**
     * Handle starting edit of an earning
     */
    const handleStartEdit = (earning) => {
        setEditingId(earning.id);
        setEditForm({ ...earning });
    };

    /**
     * Handle saving edited earning
     */
    const handleSaveEdit = () => {
        updateEarning(editingId, editForm);
        setEarnings(loadEarnings());
        setEditingId(null);
        setEditForm({});
    };

    /**
     * Handle canceling edit
     */
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    /**
     * Handle clearing all earnings
     */
    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete ALL earnings? This cannot be undone!')) {
            clearAllEarnings();
            setEarnings([]);
        }
    };

    /**
     * Handle exporting data
     */
    const handleExport = (format) => {
        let data, filename, mimeType;

        if (format === 'json') {
            data = exportToJSON();
            filename = `unity-earnings-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
        } else if (format === 'csv') {
            data = exportToCSV();
            filename = `unity-earnings-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
        }

        // Create download link
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    /**
     * Handle PDF export
     */
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const stats = getEarningsStats();

        // Title
        doc.setFontSize(18);
        doc.text('Unity Nodes Earnings Report', 20, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

        // Summary stats
        doc.setFontSize(12);
        doc.text('Summary', 20, 45);
        doc.setFontSize(10);
        doc.text(`Total Earnings: $${stats.total.toFixed(2)}`, 30, 55);
        doc.text(`Number of Transactions: ${stats.count}`, 30, 62);
        doc.text(`Average per Transaction: $${stats.average.toFixed(2)}`, 30, 69);
        doc.text(`Unique Nodes: ${stats.uniqueNodes}`, 30, 76);

        // By license type
        let yPos = 90;
        doc.setFontSize(12);
        doc.text('By License Type', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);

        Object.entries(stats.byLicenseType).forEach(([type, data]) => {
            doc.text(`${type}: $${data.total.toFixed(2)} (${data.count} transactions)`, 30, yPos);
            yPos += 7;
        });

        // Save
        doc.save(`unity-earnings-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    /**
     * Handle selection of individual earnings
     */
    const handleToggleSelection = (earningId) => {
        const newSelection = new Set(selectedEarningIds);
        if (newSelection.has(earningId)) {
            newSelection.delete(earningId);
        } else {
            newSelection.add(earningId);
        }
        setSelectedEarningIds(newSelection);
    };

    /**
     * Handle selecting all filtered earnings
     */
    const handleSelectAll = () => {
        const allIds = new Set(filteredEarnings.map(e => e.id));
        setSelectedEarningIds(allIds);
    };

    /**
     * Handle clearing all selections
     */
    const handleClearSelection = () => {
        setSelectedEarningIds(new Set());
    };

    /**
     * Handle applying selection to dashboard
     */
    const handleApplySelectionToDashboard = () => {
        if (selectedEarningIds.size > 0) {
            setUseDashboardSelection(true);
            setActiveView('dashboard');
        }
    };

    /**
     * Handle clearing dashboard filter
     */
    const handleClearDashboardFilter = () => {
        setUseDashboardSelection(false);
    };

    /**
     * Get filtered and sorted earnings (for Data Table view)
     */
    const filteredEarnings = useMemo(() => {
        let filtered = [...earnings];

        // Filter by license type
        if (filterLicenseType !== 'all') {
            filtered = filtered.filter(e => e.licenseType === filterLicenseType);
        }

        // Filter by date range
        if (filterDateRange.start) {
            filtered = filtered.filter(e => e.date >= filterDateRange.start);
        }
        if (filterDateRange.end) {
            filtered = filtered.filter(e => e.date <= filterDateRange.end);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.nodeId.toLowerCase().includes(query) ||
                (e.licenseType && e.licenseType.toLowerCase().includes(query)) ||
                e.amount.toString().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'amount') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [earnings, filterLicenseType, filterDateRange, searchQuery, sortField, sortDirection]);

    /**
     * Get earnings data for dashboard (respects selection if enabled)
     */
    const dashboardEarnings = useMemo(() => {
        if (useDashboardSelection && selectedEarningIds.size > 0) {
            // Filter to show only selected earnings
            return earnings.filter(e => selectedEarningIds.has(e.id));
        }
        // Show all earnings
        return earnings;
    }, [earnings, useDashboardSelection, selectedEarningIds]);

    /**
     * Get unique license types for filter dropdown
     */
    const licenseTypes = useMemo(() => {
        const types = new Set(earnings.map(e => e.licenseType || 'Unknown'));
        return ['all', ...Array.from(types)];
    }, [earnings]);

    /**
     * Get unique node IDs
     */
    const uniqueNodeIds = useMemo(() => {
        return Array.from(new Set(earnings.map(e => e.nodeId)));
    }, [earnings]);

    /**
     * Calculate statistics (uses dashboardEarnings if selection is active)
     */
    const stats = useMemo(() => {
        // If dashboard is using selected data, calculate stats from selected earnings only
        if (useDashboardSelection && selectedEarningIds.size > 0) {
            // Temporarily save selected earnings and calculate stats
            const selectedEarnings = earnings.filter(e => selectedEarningIds.has(e.id));

            // Calculate stats manually for selected data
            const total = selectedEarnings.reduce((sum, e) => sum + e.amount, 0);
            const count = selectedEarnings.length;
            const average = count > 0 ? total / count : 0;
            const uniqueNodes = new Set(selectedEarnings.map(e => e.nodeId)).size;

            const byLicenseType = {};
            selectedEarnings.forEach(e => {
                const type = e.licenseType || 'Unknown';
                if (!byLicenseType[type]) {
                    byLicenseType[type] = { total: 0, count: 0 };
                }
                byLicenseType[type].total += e.amount;
                byLicenseType[type].count += 1;
            });

            return { total, count, average, uniqueNodes, byLicenseType };
        }

        // Otherwise use all earnings
        return getEarningsStats();
    }, [earnings, useDashboardSelection, selectedEarningIds]);

    /**
     * Prepare data for charts (uses dashboardEarnings if selection is active)
     */
    const chartData = useMemo(() => {
        // Use dashboardEarnings for chart calculations
        const earningsToUse = dashboardEarnings;

        // Cumulative earnings over time
        const sortedEarnings = [...earningsToUse].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        let cumulative = 0;
        const cumulativeData = sortedEarnings.map(e => {
            cumulative += e.amount;
            return {
                date: e.date,
                amount: parseFloat(cumulative.toFixed(2))
            };
        });

        // Group by date for daily earnings
        const dailyMap = {};
        earningsToUse.forEach(e => {
            if (!dailyMap[e.date]) {
                dailyMap[e.date] = 0;
            }
            dailyMap[e.date] += e.amount;
        });

        const dailyData = Object.entries(dailyMap)
            .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // By license type for pie chart
        const pieData = Object.entries(stats.byLicenseType).map(([name, data]) => ({
            name,
            value: parseFloat(data.total.toFixed(2))
        }));

        return { cumulativeData, dailyData, pieData };
    }, [dashboardEarnings, stats]);

    /**
     * Calculate this month's earnings (uses dashboardEarnings if selection is active)
     */
    const thisMonthEarnings = useMemo(() => {
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        return dashboardEarnings
            .filter(e => e.date.startsWith(thisMonth))
            .reduce((sum, e) => sum + e.amount, 0);
    }, [dashboardEarnings]);

    /**
     * Calculate average daily earnings (uses dashboardEarnings if selection is active)
     */
    const avgDailyEarnings = useMemo(() => {
        if (dashboardEarnings.length === 0) return 0;

        const dates = new Set(dashboardEarnings.map(e => e.date));
        const totalDays = dates.size;

        return totalDays > 0 ? stats.total / totalDays : 0;
    }, [dashboardEarnings, stats]);

    /**
     * Calculate average daily earnings per device (node)
     * This calculates the average daily earnings for each device individually,
     * then averages those values together to get an overall per-device average.
     */
    const avgDailyPerDevice = useMemo(() => {
        if (dashboardEarnings.length === 0) return 0;

        // Group earnings by nodeId
        const nodeMap = {};
        dashboardEarnings.forEach(e => {
            if (!nodeMap[e.nodeId]) {
                nodeMap[e.nodeId] = { total: 0, dates: new Set() };
            }
            nodeMap[e.nodeId].total += e.amount;
            nodeMap[e.nodeId].dates.add(e.date);
        });

        // Calculate average daily earnings for each device
        const avgPerDevices = Object.values(nodeMap).map(node =>
            node.total / node.dates.size
        );

        // Return the average of all device averages
        if (avgPerDevices.length === 0) return 0;
        return avgPerDevices.reduce((sum, avg) => sum + avg, 0) / avgPerDevices.length;
    }, [dashboardEarnings]);

    /**
     * Find the top earning device (node) with highest total earnings
     * Returns object with nodeId, licenseType, and total amount
     */
    const topEarningDevice = useMemo(() => {
        if (dashboardEarnings.length === 0) return null;

        // Group earnings by nodeId
        const nodeMap = {};
        dashboardEarnings.forEach(e => {
            if (!nodeMap[e.nodeId]) {
                nodeMap[e.nodeId] = {
                    nodeId: e.nodeId,
                    licenseType: e.licenseType,
                    total: 0
                };
            }
            nodeMap[e.nodeId].total += e.amount;
            // Update license type if available (in case it was added later)
            nodeMap[e.nodeId].licenseType = e.licenseType || nodeMap[e.nodeId].licenseType;
        });

        // Find the node with the highest total earnings
        return Object.values(nodeMap).reduce((top, node) =>
            node.total > (top?.total || 0) ? node : top
            , null);
    }, [dashboardEarnings]);

    // Color palette for charts
    const COLORS = ['#a78bfa', '#818cf8', '#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#f87171'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Unity Nodes Earnings Tracker
                    </h1>
                    <p className="text-purple-200">
                        Track and analyze your actual node earnings
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 border-b border-purple-400/30 pb-2">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'dashboard'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} />
                            <span>Dashboard</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('table')}
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'table'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Database size={18} />
                            <span>Data Table</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveView('input')}
                        className={`px-4 py-2 rounded-t-lg transition-colors ${activeView === 'input'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Upload size={18} />
                            <span>Add Earnings</span>
                        </div>
                    </button>
                </div>

                {/* Dashboard View */}
                {activeView === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Dashboard Filter Indicator */}
                        {useDashboardSelection && selectedEarningIds.size > 0 && (
                            <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Info className="text-blue-400" size={20} />
                                        <div>
                                            <h3 className="font-semibold text-blue-200">
                                                Dashboard Filtered by Selection
                                            </h3>
                                            <p className="text-sm text-blue-300">
                                                Showing {selectedEarningIds.size} selected earning{selectedEarningIds.size !== 1 ? 's' : ''} from Data Table
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClearDashboardFilter}
                                        className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg transition-colors border border-blue-400/30"
                                    >
                                        <X size={18} />
                                        Clear Filter
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Total Earnings */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">Total Earnings</h3>
                                    <DollarSign className="text-green-400" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    ${stats.total.toFixed(2)}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    {stats.count} transactions
                                </p>
                            </div>

                            {/* This Month */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">This Month</h3>
                                    <Calendar className="text-blue-400" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    ${thisMonthEarnings.toFixed(2)}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            {/* Average Daily */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">Avg Daily</h3>
                                    <TrendingUp className="text-purple-400" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    ${avgDailyEarnings.toFixed(2)}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    per active day
                                </p>
                            </div>

                            {/* Active Nodes */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">Active Nodes</h3>
                                    <Hash className="text-orange-400" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    {stats.uniqueNodes}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    unique node IDs
                                </p>
                            </div>

                            {/* Average Daily Per Device */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">Avg/Day/Device</h3>
                                    <TrendingUp className="text-cyan-400" size={20} />
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    ${avgDailyPerDevice.toFixed(2)}
                                </p>
                                <p className="text-xs text-purple-300 mt-1">
                                    per device per day
                                </p>
                            </div>

                            {/* Top Earning Device */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-purple-200 text-sm">Top Earning Device</h3>
                                    <Hash className="text-yellow-400" size={20} />
                                </div>
                                {topEarningDevice ? (
                                    <>
                                        <p className="text-xl font-bold text-white font-mono mb-1">
                                            {topEarningDevice.nodeId}
                                        </p>
                                        <p className="text-2xl font-bold text-green-400">
                                            ${topEarningDevice.total.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-purple-300 mt-1">
                                            {topEarningDevice.licenseType || 'Unknown type'}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-3xl font-bold text-white">
                                            -
                                        </p>
                                        <p className="text-xs text-purple-300 mt-1">
                                            no data
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Charts */}
                        {dashboardEarnings.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Cumulative Earnings Chart */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-purple-200">
                                        Cumulative Earnings Over Time
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={chartData.cumulativeData}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #a78bfa',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#a78bfa"
                                                fillOpacity={1}
                                                fill="url(#colorAmount)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Daily Earnings Bar Chart */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-purple-200">
                                        Daily Earnings
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData.dailyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #a78bfa',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Bar dataKey="amount" fill="#818cf8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Earnings by License Type Pie Chart */}
                                {chartData.pieData.length > 0 && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                        <h3 className="text-xl font-semibold mb-4 text-purple-200">
                                            Earnings by License Type
                                        </h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData.pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, value }) => `${name}: $${value}`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {chartData.pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1e293b',
                                                        border: '1px solid #a78bfa',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* License Type Breakdown Table */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4 text-purple-200">
                                        License Type Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(stats.byLicenseType).map(([type, data]) => (
                                            <div key={type} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-white">{type}</p>
                                                    <p className="text-sm text-purple-300">{data.count} transactions</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-green-400">
                                                        ${data.total.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-purple-300">
                                                        avg ${(data.total / data.count).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-12 text-center">
                                <BarChart3 size={48} className="mx-auto text-purple-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Earnings Data Yet</h3>
                                <p className="text-purple-300 mb-4">
                                    Start by adding your earnings data using the "Add Earnings" tab
                                </p>
                                <button
                                    onClick={() => setActiveView('input')}
                                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                                >
                                    Add Earnings
                                </button>
                            </div>
                        )}

                        {/* Export Buttons */}
                        {dashboardEarnings.length > 0 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-purple-200">
                                    Export Data
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FileDown size={18} />
                                        Export JSON
                                    </button>
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FileText size={18} />
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <FileDown size={18} />
                                        Export PDF Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Data Table View */}
                {activeView === 'table' && (
                    <div className="space-y-6">
                        {/* Filters and Search */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4 text-purple-200 flex items-center gap-2">
                                <Filter size={20} />
                                Filters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm text-purple-200 mb-2">Search</label>
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Node ID, amount..."
                                            className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/50"
                                        />
                                    </div>
                                </div>

                                {/* License Type Filter */}
                                <div>
                                    <label className="block text-sm text-purple-200 mb-2">License Type</label>
                                    <select
                                        value={filterLicenseType}
                                        onChange={(e) => setFilterLicenseType(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white"
                                    >
                                        {licenseTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type === 'all' ? 'All Types' : type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Range Start */}
                                <div>
                                    <label className="block text-sm text-purple-200 mb-2 flex items-center gap-2">
                                        <Calendar size={16} />
                                        From Date
                                    </label>
                                    <CustomDatePicker
                                        selected={filterDateRange.start ? new Date(filterDateRange.start) : null}
                                        onChange={(date) => {
                                            const dateStr = date ? date.toISOString().split('T')[0] : '';
                                            setFilterDateRange({ ...filterDateRange, start: dateStr });
                                        }}
                                        placeholderText="Select start date"
                                        isClearable
                                        maxDate={filterDateRange.end ? new Date(filterDateRange.end) : null}
                                    />
                                </div>

                                {/* Date Range End */}
                                <div>
                                    <label className="block text-sm text-purple-200 mb-2 flex items-center gap-2">
                                        <Calendar size={16} />
                                        To Date
                                    </label>
                                    <CustomDatePicker
                                        selected={filterDateRange.end ? new Date(filterDateRange.end) : null}
                                        onChange={(date) => {
                                            const dateStr = date ? date.toISOString().split('T')[0] : '';
                                            setFilterDateRange({ ...filterDateRange, end: dateStr });
                                        }}
                                        placeholderText="Select end date"
                                        isClearable
                                        minDate={filterDateRange.start ? new Date(filterDateRange.start) : null}
                                    />
                                </div>
                            </div>

                            {/* Quick Date Range Shortcuts */}
                            <div className="mt-4 p-4 bg-slate-900/30 rounded-lg border border-purple-400/20">
                                <h4 className="text-sm text-purple-300 mb-3 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Quick Date Ranges
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleQuickDateRange(7)}
                                        className="px-3 py-1.5 text-sm bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors border border-purple-400/30"
                                    >
                                        Last 7 Days
                                    </button>
                                    <button
                                        onClick={() => handleQuickDateRange(14)}
                                        className="px-3 py-1.5 text-sm bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors border border-purple-400/30"
                                    >
                                        Last 14 Days
                                    </button>
                                    <button
                                        onClick={() => handleQuickDateRange(30)}
                                        className="px-3 py-1.5 text-sm bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors border border-purple-400/30"
                                    >
                                        Last 30 Days
                                    </button>
                                    <button
                                        onClick={handleThisMonth}
                                        className="px-3 py-1.5 text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors border border-blue-400/30"
                                    >
                                        This Month
                                    </button>
                                    <button
                                        onClick={handleLastMonth}
                                        className="px-3 py-1.5 text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors border border-blue-400/30"
                                    >
                                        Last Month
                                    </button>
                                    <button
                                        onClick={() => setFilterDateRange({ start: '', end: '' })}
                                        className="px-3 py-1.5 text-sm bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 rounded-lg transition-colors border border-slate-400/30"
                                    >
                                        Clear Dates
                                    </button>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(filterLicenseType !== 'all' || filterDateRange.start || filterDateRange.end || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setFilterLicenseType('all');
                                        setFilterDateRange({ start: '', end: '' });
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Earnings Table */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-purple-400/30">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-purple-200">
                                        Earnings Data ({filteredEarnings.length} {filteredEarnings.length === 1 ? 'entry' : 'entries'})
                                    </h3>
                                    {earnings.length > 0 && (
                                        <button
                                            onClick={handleClearAll}
                                            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-400/30"
                                        >
                                            <Trash2 size={18} />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Selection Controls */}
                                {filteredEarnings.length > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-purple-300">
                                                {selectedEarningIds.size} selected
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSelectAll}
                                                className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1 rounded bg-purple-600/10 hover:bg-purple-600/20 transition-colors"
                                            >
                                                Select All ({filteredEarnings.length})
                                            </button>
                                            {selectedEarningIds.size > 0 && (
                                                <>
                                                    <button
                                                        onClick={handleClearSelection}
                                                        className="text-sm text-purple-400 hover:text-purple-300 px-3 py-1 rounded bg-purple-600/10 hover:bg-purple-600/20 transition-colors"
                                                    >
                                                        Clear Selection
                                                    </button>
                                                    <button
                                                        onClick={handleApplySelectionToDashboard}
                                                        className="text-sm text-blue-300 hover:text-blue-200 px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 transition-colors font-semibold flex items-center gap-2"
                                                    >
                                                        <BarChart3 size={16} />
                                                        Use in Dashboard
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {filteredEarnings.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-900/50">
                                            <tr>
                                                <th className="px-6 py-3 w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={filteredEarnings.length > 0 && filteredEarnings.every(e => selectedEarningIds.has(e.id))}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                handleSelectAll();
                                                            } else {
                                                                handleClearSelection();
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded border-purple-400/30 bg-slate-900/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800 cursor-pointer"
                                                    />
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200"
                                                    onClick={() => {
                                                        if (sortField === 'date') {
                                                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                        } else {
                                                            setSortField('date');
                                                            setSortDirection('desc');
                                                        }
                                                    }}
                                                >
                                                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200"
                                                    onClick={() => {
                                                        if (sortField === 'nodeId') {
                                                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                        } else {
                                                            setSortField('nodeId');
                                                            setSortDirection('asc');
                                                        }
                                                    }}
                                                >
                                                    Node ID {sortField === 'nodeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200"
                                                    onClick={() => {
                                                        if (sortField === 'licenseType') {
                                                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                        } else {
                                                            setSortField('licenseType');
                                                            setSortDirection('asc');
                                                        }
                                                    }}
                                                >
                                                    License Type {sortField === 'licenseType' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider cursor-pointer hover:text-purple-200"
                                                    onClick={() => {
                                                        if (sortField === 'amount') {
                                                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                                        } else {
                                                            setSortField('amount');
                                                            setSortDirection('desc');
                                                        }
                                                    }}
                                                >
                                                    Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-purple-400/20">
                                            {filteredEarnings.map((earning) => (
                                                <tr key={earning.id} className="hover:bg-slate-900/30 transition-colors">
                                                    {editingId === earning.id ? (
                                                        <>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEarningIds.has(earning.id)}
                                                                    onChange={() => handleToggleSelection(earning.id)}
                                                                    className="w-4 h-4 rounded border-purple-400/30 bg-slate-900/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <CustomDatePicker
                                                                    selected={editForm.date ? new Date(editForm.date) : null}
                                                                    onChange={(date) => {
                                                                        const dateStr = date ? date.toISOString().split('T')[0] : '';
                                                                        setEditForm({ ...editForm, date: dateStr });
                                                                    }}
                                                                    placeholderText="Select date"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="text"
                                                                    value={editForm.nodeId}
                                                                    onChange={(e) => setEditForm({ ...editForm, nodeId: e.target.value })}
                                                                    className="w-full px-2 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="text"
                                                                    value={editForm.licenseType}
                                                                    onChange={(e) => setEditForm({ ...editForm, licenseType: e.target.value })}
                                                                    className="w-full px-2 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={editForm.amount}
                                                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                                                                    className="w-full px-2 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <select
                                                                    value={editForm.status}
                                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                                    className="w-full px-2 py-1 bg-slate-900/50 border border-purple-400/30 rounded text-white"
                                                                >
                                                                    <option value="completed">Completed</option>
                                                                    <option value="pending">Pending</option>
                                                                    <option value="failed">Failed</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={handleSaveEdit}
                                                                        className="text-green-400 hover:text-green-300"
                                                                        title="Save"
                                                                    >
                                                                        <Check size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="text-red-400 hover:text-red-300"
                                                                        title="Cancel"
                                                                    >
                                                                        <X size={18} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEarningIds.has(earning.id)}
                                                                    onChange={() => handleToggleSelection(earning.id)}
                                                                    className="w-4 h-4 rounded border-purple-400/30 bg-slate-900/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-white">
                                                                {new Date(earning.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-mono text-purple-300">
                                                                {earning.nodeId}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded">
                                                                    {earning.licenseType || 'Unknown'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-semibold text-green-400">
                                                                ${earning.amount.toFixed(2)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 rounded ${earning.status === 'completed' ? 'bg-green-600/20 text-green-300' :
                                                                    earning.status === 'pending' ? 'bg-yellow-600/20 text-yellow-300' :
                                                                        'bg-red-600/20 text-red-300'
                                                                    }`}>
                                                                    {earning.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleStartEdit(earning)}
                                                                        className="text-blue-400 hover:text-blue-300"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(earning.id)}
                                                                        className="text-red-400 hover:text-red-300"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-900/50">
                                            <tr>
                                                <td className="px-6 py-3"></td>
                                                <td colSpan="3" className="px-6 py-3 text-sm font-semibold text-purple-200">
                                                    Total ({filteredEarnings.length} entries)
                                                </td>
                                                <td className="px-6 py-3 text-sm font-bold text-green-400">
                                                    ${filteredEarnings.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                                                </td>
                                                <td colSpan="2"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-purple-300">
                                    <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No earnings match your filters</p>
                                </div>
                            )}
                        </div>

                        {/* Node Mapping Management */}
                        {uniqueNodeIds.length > 0 && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-purple-200 flex items-center gap-2">
                                    <Hash size={20} />
                                    Node ID Mapping
                                    <InfoTooltip content="Map each node ID to its license type. This helps categorize your earnings by license." />
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {uniqueNodeIds.map(nodeId => {
                                        // Calculate total earnings for this node
                                        const nodeTotal = earnings
                                            .filter(e => e.nodeId === nodeId)
                                            .reduce((sum, e) => sum + e.amount, 0);

                                        return (
                                            <div key={nodeId} className="flex flex-col gap-2 p-3 bg-slate-900/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm text-purple-300 flex-1">
                                                        {nodeId}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={nodeMapping[nodeId] || ''}
                                                        onChange={(e) => handleUpdateNodeMapping(nodeId, e.target.value)}
                                                        placeholder="License type (e.g., ULO)"
                                                        className="px-3 py-1 bg-slate-800 border border-purple-400/30 rounded text-white text-sm w-40"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <span className="text-sm font-semibold text-green-400">
                                                        Total: ${nodeTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Input/Add Earnings View */}
                {activeView === 'input' && (
                    <div className="space-y-6">
                        {/* Input Section */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4 text-purple-200 flex items-center gap-2">
                                <Upload size={20} />
                                Paste Earnings Data
                                <InfoTooltip content="Paste your earnings data from Unity Nodes. The parser will automatically extract node IDs, amounts, dates, and status." />
                            </h3>

                            {/* Instructions for where to get data */}
                            <div className="mb-4 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                                <p className="text-blue-200 text-sm mb-2">
                                    <strong>Where to get your earnings data:</strong>
                                </p>
                                <ol className="list-decimal list-inside text-blue-200 text-sm space-y-1 ml-2">
                                    <li>Go to <a
                                        href="https://manage.unitynodes.io/rewards/allocation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Unity Nodes Rewards
                                    </a></li>
                                    <li>Select all transactions you want to track</li>
                                    <li>Copy the selected data (Cmd+C or Ctrl+C)</li>
                                    <li>Paste it in the text area below</li>
                                </ol>
                            </div>

                            {/* Example Format Toggle */}
                            <button
                                onClick={() => setShowExampleFormat(!showExampleFormat)}
                                className="mb-4 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                            >
                                <Info size={16} />
                                {showExampleFormat ? 'Hide' : 'Show'} example format
                            </button>

                            {showExampleFormat && (
                                <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-purple-400/20">
                                    <pre className="text-sm text-purple-200 whitespace-pre-wrap">
                                        {getExampleFormat()}
                                    </pre>
                                </div>
                            )}

                            {/* Textarea */}
                            <textarea
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                placeholder="Paste your earnings data here..."
                                className="w-full h-64 px-4 py-3 bg-slate-900/50 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            {/* Parse Button */}
                            <button
                                onClick={handleParse}
                                disabled={!pasteText.trim()}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                            >
                                <Plus size={20} />
                                Parse and Add Earnings
                            </button>
                        </div>

                        {/* Parse Result */}
                        {parseResult && (
                            <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 ${parseResult.success ? 'border-green-400/30' : 'border-red-400/30'
                                }`}>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    {parseResult.success ? (
                                        <><CheckCircle className="text-green-400" size={24} /> Parse Successful</>
                                    ) : (
                                        <><AlertCircle className="text-red-400" size={24} /> Parse Failed</>
                                    )}
                                </h3>

                                <div className="space-y-2 text-sm">
                                    {parseResult.parsedCount > 0 && (
                                        <p className="text-green-300">
                                            ✓ Parsed {parseResult.parsedCount} earning{parseResult.parsedCount !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                    {parseResult.addedCount !== undefined && (
                                        <p className="text-green-300">
                                            ✓ Added {parseResult.addedCount} new earning{parseResult.addedCount !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                    {parseResult.errorCount > 0 && (
                                        <div>
                                            <p className="text-red-300 mb-2">
                                                ✗ {parseResult.errorCount} error{parseResult.errorCount !== 1 ? 's' : ''}:
                                            </p>
                                            <ul className="list-disc list-inside text-red-200 ml-4">
                                                {parseResult.errors.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {parseResult.addedCount > 0 && (
                                    <p className="mt-4 text-purple-300">
                                        View your earnings in the Dashboard or Data Table tabs.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Duplicate Warning Panel */}
                        {parseResult && parseResult.duplicateCount > 0 && (
                            <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-6 mt-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-300">
                                    <AlertTriangle size={24} />
                                    Potential Duplicates Detected ({parseResult.duplicateCount})
                                </h3>

                                <p className="text-yellow-200 mb-4">
                                    These entries match existing data (same node ID, amount, and date).
                                    They have been added, but please review and delete if they are true duplicates.
                                </p>

                                <div className="space-y-2">
                                    {parseResult.potentialDuplicates.map((dup, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-purple-300">{dup.nodeId}</span>
                                                <span className="text-green-400">${dup.amount.toFixed(2)}</span>
                                                <span className="text-blue-300">{dup.date}</span>
                                                <span className="text-yellow-300">{dup.status}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleDelete(dup.id);
                                                    // Update parse result to remove from list
                                                    setParseResult({
                                                        ...parseResult,
                                                        potentialDuplicates: parseResult.potentialDuplicates.filter((_, idx) => idx !== i),
                                                        duplicateCount: parseResult.duplicateCount - 1
                                                    });
                                                    // Refresh earnings list
                                                    setEarnings(loadEarnings());
                                                }}
                                                className="text-red-400 hover:text-red-300"
                                                title="Delete this entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setParseResult({ ...parseResult, duplicateCount: 0 })}
                                    className="mt-4 text-sm text-yellow-300 hover:text-yellow-200"
                                >
                                    Dismiss Warning (keep all entries)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
