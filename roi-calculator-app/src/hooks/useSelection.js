import { useState } from 'react';

/**
 * Hook managing row selection and dashboard filtering
 */
export function useSelection(filteredEarnings) {
    const [selectedEarningIds, setSelectedEarningIds] = useState(new Set());
    const [useDashboardSelection, setUseDashboardSelection] = useState(false);

    const handleToggleSelection = (earningId) => {
        const newSelected = new Set(selectedEarningIds);
        if (newSelected.has(earningId)) {
            newSelected.delete(earningId);
        } else {
            newSelected.add(earningId);
        }
        setSelectedEarningIds(newSelected);
    };

    const handleSelectAll = () => {
        setSelectedEarningIds(new Set(filteredEarnings.map(e => e.id)));
    };

    const handleClearSelection = () => {
        setSelectedEarningIds(new Set());
    };

    const handleApplySelectionToDashboard = () => {
        if (selectedEarningIds.size > 0) {
            setUseDashboardSelection(true);
        }
    };

    const handleClearDashboardFilter = () => {
        setUseDashboardSelection(false);
    };

    return {
        selectedEarningIds, setSelectedEarningIds,
        useDashboardSelection, setUseDashboardSelection,
        handleToggleSelection, handleSelectAll, handleClearSelection,
        handleApplySelectionToDashboard, handleClearDashboardFilter
    };
}
