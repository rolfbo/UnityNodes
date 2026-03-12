import { useState } from 'react';
import { loadBackupSettings, saveBackupSettings, toggleAutoBackup, updateBackupFrequency, getChangeCounter, incrementChangeCounter, resetChangeCounter, shouldTriggerBackup, performAutoBackup, getBackupStatus } from '../utils/autoBackup.js';
import { exportToJSON, exportToCSV } from '../utils/earningsStorage.js';
import { importFromJSON, importFromCSV } from '../utils/earningsStorage.js';

/**
 * Hook managing backup/restore state and handlers
 */
export function useBackup() {
    const [backupSettings, setBackupSettings] = useState(() => loadBackupSettings());
    const [importResult, setImportResult] = useState(null);
    const [showImportPreview, setShowImportPreview] = useState(false);
    const [importPreviewData, setImportPreviewData] = useState(null);
    const [showBackupSettings, setShowBackupSettings] = useState(false);
    const [backupStatus, setBackupStatus] = useState(() => getBackupStatus());
    const [lastBackupNotification, setLastBackupNotification] = useState(null);

    const handleToggleAutoBackup = (enabled) => {
        const newSettings = toggleAutoBackup(enabled);
        setBackupSettings(newSettings);
        setBackupStatus(getBackupStatus());
    };

    const handleUpdateBackupFrequency = (frequency) => {
        const newSettings = updateBackupFrequency(frequency);
        setBackupSettings(newSettings);
        setBackupStatus(getBackupStatus());
    };

    const handleManualBackup = () => {
        const exportFn = () => exportToJSON();
        const result = performAutoBackup(exportFn);
        setLastBackupNotification({
            type: result.success ? 'success' : 'error',
            message: result.message
        });
    };

    const checkAndTriggerAutoBackup = () => {
        if (backupSettings.enabled && shouldTriggerBackup()) {
            const exportFn = () => exportToJSON();
            performAutoBackup(exportFn);
            setBackupStatus(getBackupStatus());
        }
    };

    const trackChange = () => {
        if (backupSettings.enabled) {
            incrementChangeCounter();
            checkAndTriggerAutoBackup();
        }
    };

    const handleImportFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string') return;

                let result;
                if (file.name.endsWith('.csv')) {
                    result = importFromCSV(content);
                } else {
                    result = importFromJSON(content);
                }

                setImportResult(result);
                if (result.preview) {
                    setImportPreviewData(result.preview);
                    setShowImportPreview(true);
                }
            } catch (error) {
                setImportResult({ success: false, message: 'Import failed', errors: [error.message] });
            }
        };
        reader.readAsText(file);
    };

    return {
        backupSettings, setBackupSettings,
        importResult, setImportResult,
        showImportPreview, setShowImportPreview,
        importPreviewData, setImportPreviewData,
        showBackupSettings, setShowBackupSettings,
        backupStatus, setBackupStatus,
        lastBackupNotification, setLastBackupNotification,
        handleToggleAutoBackup, handleUpdateBackupFrequency, handleManualBackup,
        checkAndTriggerAutoBackup, trackChange, handleImportFile
    };
}
