import { Info, X } from 'lucide-react';
import { MetricsCards } from './MetricsCards.jsx';
import { DashboardCharts } from './DashboardCharts.jsx';
import { ExportPanel } from './ExportPanel.jsx';
import { BackupRestorePanel } from './BackupRestorePanel.jsx';

export function DashboardView({ 
    stats, thisMonthEarnings, avgDailyEarnings, activeBoundNodes, avgDailyPerDevice, topEarningDevice,
    chartData, earnings, selectedEarningIds, useDashboardSelection, handleClearDashboardFilter,
    onExportJSON, onExportCSV, onExportPDF, onBackup, onImport, onClearAll, backupStatus
}) {
    return (
        <div className="space-y-6">
            {useDashboardSelection && selectedEarningIds.size > 0 && (
                <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Info className="text-blue-400" size={20} />
                            <div>
                                <h3 className="font-semibold text-blue-200">Dashboard Filtered by Selection</h3>
                                <p className="text-sm text-blue-300">Showing {selectedEarningIds.size} selected earnings</p>
                            </div>
                        </div>
                        <button onClick={handleClearDashboardFilter} className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg border border-blue-400/30">
                            <X size={18} />
                            Clear Filter
                        </button>
                    </div>
                </div>
            )}
            
            <MetricsCards stats={stats} thisMonthEarnings={thisMonthEarnings} avgDailyEarnings={avgDailyEarnings} activeBoundNodes={activeBoundNodes} avgDailyPerDevice={avgDailyPerDevice} topEarningDevice={topEarningDevice} />
            <DashboardCharts chartData={chartData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExportPanel earnings={earnings} onExportJSON={onExportJSON} onExportCSV={onExportCSV} onExportPDF={onExportPDF} />
                <BackupRestorePanel onBackup={onBackup} onImport={onImport} onClearAll={onClearAll} backupStatus={backupStatus} />
            </div>
        </div>
    );
}
