/**
 * License Manager Component
 *
 * This React component provides the main interface for managing Unity Node licenses.
 * It includes multiple tabs for different license management views and integrates
 * with the license storage system.
 *
 * Key Features:
 * - Tabbed interface with 4 main sections
 * - License inventory dashboard
 * - Interactive license table with filtering
 * - Revenue loss analysis with charts
 * - Alert system for license management
 * - Add license functionality
 * - Real-time updates and statistics
 *
 * @component
 * @returns {JSX.Element} The complete license manager interface
 */

import React, { useState, useEffect } from 'react';
import {
    Database,
    Table,
    TrendingUp,
    AlertTriangle,
    Plus,
    RefreshCw,
    FileDown,
    FileUp,
    Settings,
    Info
} from 'lucide-react';
import AddLicenseForm from './AddLicenseForm.jsx';
import LicenseInventoryDashboard from './LicenseInventoryDashboard.jsx';
import LicenseTable from './LicenseTable.jsx';
import RevenueLossAnalysis from './RevenueLossAnalysis.jsx';
import LicenseAlerts from './LicenseAlerts.jsx';
import {
    getAllLicenses,
    getLicenseStats,
    exportLicensesToJSON,
    exportLicensesToCSV,
    importLicensesFromJSON,
    importLicensesFromCSV
} from '../utils/licenseStorage.js';

export default function LicenseManager() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [licenses, setLicenses] = useState([]);
    const [stats, setStats] = useState({});
    const [isAddLicenseOpen, setIsAddLicenseOpen] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Load licenses and stats on component mount and when needed
    const refreshData = () => {
        const allLicenses = getAllLicenses();
        const licenseStats = getLicenseStats();
        setLicenses(allLicenses);
        setStats(licenseStats);
        setLastUpdate(new Date());
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showExportMenu && !event.target.closest('.export-dropdown')) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showExportMenu]);

    // Handle license added successfully
    const handleLicenseAdded = (newLicense) => {
        refreshData();
    };

    // Handle export licenses
    const handleExport = (format = 'json') => {
        try {
            let data, mimeType, extension;

            if (format === 'csv') {
                data = exportLicensesToCSV();
                mimeType = 'text/csv';
                extension = 'csv';
            } else {
                data = exportLicensesToJSON();
                mimeType = 'application/json';
                extension = 'json';
            }

            const blob = new Blob([data], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `unity-nodes-licenses-${new Date().toISOString().split('T')[0]}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            // TODO: Show error toast
        }
    };

    // Handle import licenses
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target.result;
                let result;

                if (fileExtension === 'csv') {
                    result = importLicensesFromCSV(data);
                } else {
                    result = importLicensesFromJSON(data);
                }

                if (result.success) {
                    refreshData();
                    // TODO: Show success toast with import stats
                    console.log('Import successful:', result.message);
                } else {
                    // TODO: Show error toast
                    console.error('Import failed:', result.message);
                    if (result.errors) {
                        console.error('Import errors:', result.errors);
                    }
                }
            } catch (error) {
                console.error('Import failed:', error);
                // TODO: Show error toast
            }
        };

        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    };

    const tabs = [
        {
            id: 'inventory',
            label: 'Inventory',
            icon: Database,
            description: 'License overview and status dashboard'
        },
        {
            id: 'table',
            label: 'License Table',
            icon: Table,
            description: 'Detailed license list with filtering and editing'
        },
        {
            id: 'analysis',
            label: 'Revenue Analysis',
            icon: TrendingUp,
            description: 'Revenue loss analysis and optimization insights'
        },
        {
            id: 'alerts',
            label: 'Alerts',
            icon: AlertTriangle,
            description: 'License alerts and notifications'
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'inventory':
                return (
                    <LicenseInventoryDashboard
                        licenses={licenses}
                        stats={stats}
                        onRefresh={refreshData}
                    />
                );
            case 'table':
                return (
                    <LicenseTable
                        licenses={licenses}
                        stats={stats}
                        onRefresh={refreshData}
                        onLicenseUpdate={refreshData}
                    />
                );
            case 'analysis':
                return (
                    <RevenueLossAnalysis
                        licenses={licenses}
                        stats={stats}
                        onRefresh={refreshData}
                    />
                );
            case 'alerts':
                return (
                    <LicenseAlerts
                        licenses={licenses}
                        stats={stats}
                        onRefresh={refreshData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-purple-400/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Database size={20} className="text-purple-400" />
                                License Manager
                            </h1>
                            <p className="text-sm text-slate-400">
                                Track and manage your Unity Node licenses
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Last Update Indicator */}
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <RefreshCw size={12} />
                                Updated: {lastUpdate.toLocaleTimeString()}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                {/* Import Button */}
                                <label className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-purple-400/20">
                                    <FileUp size={14} />
                                    Import
                                    <input
                                        type="file"
                                        accept=".json,.csv"
                                        onChange={handleImport}
                                        className="hidden"
                                    />
                                </label>

                                {/* Export Dropdown */}
                                <div className="relative export-dropdown">
                                    <button
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-lg transition-colors border border-purple-400/20"
                                    >
                                        <FileDown size={14} />
                                        Export
                                    </button>
                                    {showExportMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-purple-400/30 rounded-lg shadow-lg z-10">
                                            <button
                                                onClick={() => { handleExport('json'); setShowExportMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors rounded-t-lg"
                                            >
                                                Export as JSON
                                            </button>
                                            <button
                                                onClick={() => { handleExport('csv'); setShowExportMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors rounded-b-lg"
                                            >
                                                Export as CSV
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Add License Button */}
                                <button
                                    onClick={() => setIsAddLicenseOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus size={14} />
                                    Add License
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-slate-900/30 backdrop-blur-sm border-b border-purple-400/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${isActive
                                            ? 'text-purple-300 border-b-2 border-purple-400'
                                            : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                    title={tab.description}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {tab.id === 'alerts' && stats.unbound > 0 && (
                                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                            {stats.unbound}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {renderTabContent()}
            </div>

            {/* Add License Modal */}
            <AddLicenseForm
                isOpen={isAddLicenseOpen}
                onClose={() => setIsAddLicenseOpen(false)}
                onSave={handleLicenseAdded}
            />

            {/* Info Panel */}
            <div className="fixed bottom-4 right-4 max-w-sm">
                <div className="bg-slate-800/90 backdrop-blur-sm border border-purple-400/30 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Info size={12} className="text-purple-400" />
                        <span>
                            Total Licenses: <span className="text-white font-medium">{stats.total || 0}</span>
                            {stats.unbound > 0 && (
                                <>
                                    {' • '}
                                    <span className="text-red-400">
                                        {stats.unbound} unbound
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}