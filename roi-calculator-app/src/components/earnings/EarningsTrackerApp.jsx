/**
 * Earnings Tracker App - Orchestrator Component
 * 
 * Composes all earnings tracker sub-components and manages state through custom hooks
 */

import React, { useState, useEffect } from 'react';
import { EarningsNav } from './EarningsNav.jsx';
import { DashboardView } from './DashboardView.jsx';
import { DataTableView } from './DataTableView.jsx';
import { AddEarningsView } from './AddEarningsView.jsx';
import { 
    useEarningsTracker, 
    useEarningsFilters, 
    useDashboardMetrics, 
    useBackup, 
    useSelection 
} from '../../hooks/index.js';
import { getExampleFormat } from '../../utils/earningsParser.js';

export default function EarningsTrackerApp() {
    const [activeView, setActiveView] = useState('dashboard');
    
    // Core earnings state and handlers from hooks
    const {
        earnings, setEarnings,
        nodeMapping, setNodeMapping,
        pasteText, setPasteText,
        parseResult, setParseResult,
        editingId, setEditingId,
        editForm, setEditForm,
        handleParse,
        handleDelete,
        handleStartEdit,
        handleSaveEdit,
        handleCancelEdit,
        handleClearAll,
        handleUpdateNodeMapping,
        handleUpdateNodeBound
    } = useEarningsTracker();

    // Filters and pagination from hooks
    const {
        filterLicenseType, setFilterLicenseType,
        filterDateRange, setFilterDateRange,
        searchQuery, setSearchQuery,
        sortField, setSortField,
        sortDirection, setSortDirection,
        currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        filteredEarnings,
        filteredDeviceCount,
        totalPages,
        paginatedEarnings,
        licenseTypes,
        uniqueNodeIds
    } = useEarningsFilters(earnings);

    // Dashboard metrics from hooks
    const {
        stats,
        thisMonthEarnings,
        avgDailyEarnings,
        avgDailyPerDevice,
        topEarningDevice,
        activeBoundNodes,
        chartData
    } = useDashboardMetrics(earnings);

    // Backup and restore handlers
    const {
        backupSettings,
        importResult,
        backupStatus,
        handleBackup,
        handleImport,
        handleExportJSON,
        handleExportCSV,
        handleExportPDF
    } = useBackup();

    // Selection state and handlers
    const {
        selectedEarningIds,
        useDashboardSelection,
        handleToggleSelect,
        handleToggleSelectAll,
        handleApplyToDashboard,
        handleClearDashboardFilter
    } = useSelection(filteredEarnings);

    const [showExampleFormat, setShowExampleFormat] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Earnings Tracker
                    </h1>
                    <p className="text-purple-300">Track and analyze your actual earnings from Unity Nodes</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-purple-400/30 p-6 md:p-8">
                    {/* Navigation Tabs */}
                    <EarningsNav 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                        filteredDeviceCount={filteredDeviceCount}
                    />

                    {/* Dashboard View */}
                    {activeView === 'dashboard' && (
                        <DashboardView 
                            stats={stats}
                            thisMonthEarnings={thisMonthEarnings}
                            avgDailyEarnings={avgDailyEarnings}
                            activeBoundNodes={activeBoundNodes}
                            avgDailyPerDevice={avgDailyPerDevice}
                            topEarningDevice={topEarningDevice}
                            chartData={chartData}
                            earnings={earnings}
                            selectedEarningIds={selectedEarningIds}
                            useDashboardSelection={useDashboardSelection}
                            handleClearDashboardFilter={handleClearDashboardFilter}
                            onExportJSON={handleExportJSON}
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            onBackup={handleBackup}
                            onImport={handleImport}
                            onClearAll={handleClearAll}
                            backupStatus={backupStatus}
                        />
                    )}

                    {/* Data Table View */}
                    {activeView === 'table' && (
                        <DataTableView 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterLicenseType={filterLicenseType}
                            setFilterLicenseType={setFilterLicenseType}
                            licenseTypes={licenseTypes}
                            paginatedEarnings={paginatedEarnings}
                            editingId={editingId}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            handleStartEdit={handleStartEdit}
                            handleSaveEdit={handleSaveEdit}
                            handleCancelEdit={handleCancelEdit}
                            handleDelete={handleDelete}
                            selectedEarningIds={selectedEarningIds}
                            toggleSelect={handleToggleSelect}
                            toggleSelectAll={handleToggleSelectAll}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            setCurrentPage={setCurrentPage}
                            nodeMapping={nodeMapping}
                            uniqueNodeIds={uniqueNodeIds}
                            handleUpdateNodeMapping={handleUpdateNodeMapping}
                            handleUpdateNodeBound={handleUpdateNodeBound}
                        />
                    )}

                    {/* Add Earnings View */}
                    {activeView === 'input' && (
                        <AddEarningsView 
                            pasteText={pasteText}
                            setPasteText={setPasteText}
                            parseResult={parseResult}
                            showExampleFormat={showExampleFormat}
                            setShowExampleFormat={setShowExampleFormat}
                            handleParse={handleParse}
                            getExampleFormat={getExampleFormat}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
