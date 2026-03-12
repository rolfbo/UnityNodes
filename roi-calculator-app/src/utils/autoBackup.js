/**
 * Auto-Backup Utility
 * 
 * This module provides automatic backup functionality for earnings data.
 * It can trigger backups based on various conditions:
 * - After N changes (additions/edits/deletions)
 * - On a time interval (daily, weekly)
 * - Manual trigger
 * 
 * The auto-backup feature is designed to be non-intrusive and user-friendly,
 * providing visual feedback when backups occur while keeping the app responsive.
 * 
 * Key Features:
 * - Configurable backup frequency
 * - Change counter tracking
 * - Last backup timestamp
 * - Enable/disable toggle
 * - Manual backup trigger
 * - Automatic file download
 * 
 * @module autoBackup
 */

// Storage key for auto-backup settings
const AUTO_BACKUP_SETTINGS_KEY = 'unity-nodes-auto-backup-settings';
const AUTO_BACKUP_COUNTER_KEY = 'unity-nodes-backup-counter';

/**
 * Default auto-backup settings
 */
const DEFAULT_SETTINGS = {
    enabled: false,
    frequency: 'every_10_changes', // Options: 'every_10_changes', 'every_25_changes', 'daily', 'weekly', 'manual'
    changeThreshold: 10,
    lastBackupTimestamp: null,
    lastBackupChangeCount: 0,
    totalBackups: 0
};

/**
 * Load auto-backup settings from localStorage
 * @returns {Object} Settings object
 */
export function loadBackupSettings() {
    try {
        const stored = localStorage.getItem(AUTO_BACKUP_SETTINGS_KEY);
        if (!stored) {
            return { ...DEFAULT_SETTINGS };
        }
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (error) {
        console.error('Error loading auto-backup settings:', error);
        return { ...DEFAULT_SETTINGS };
    }
}

/**
 * Save auto-backup settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export function saveBackupSettings(settings) {
    try {
        localStorage.setItem(AUTO_BACKUP_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving auto-backup settings:', error);
    }
}

/**
 * Get current change counter
 * @returns {number} Number of changes since last backup
 */
export function getChangeCounter() {
    try {
        const stored = localStorage.getItem(AUTO_BACKUP_COUNTER_KEY);
        return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
        console.error('Error loading change counter:', error);
        return 0;
    }
}

/**
 * Increment the change counter
 * @returns {number} New counter value
 */
export function incrementChangeCounter() {
    const current = getChangeCounter();
    const newValue = current + 1;
    try {
        localStorage.setItem(AUTO_BACKUP_COUNTER_KEY, newValue.toString());
    } catch (error) {
        console.error('Error incrementing change counter:', error);
    }
    return newValue;
}

/**
 * Reset the change counter to zero
 */
export function resetChangeCounter() {
    try {
        localStorage.setItem(AUTO_BACKUP_COUNTER_KEY, '0');
    } catch (error) {
        console.error('Error resetting change counter:', error);
    }
}

/**
 * Check if a backup should be triggered based on current settings
 * @returns {boolean} True if backup should be triggered
 */
export function shouldTriggerBackup() {
    const settings = loadBackupSettings();

    // If disabled, never trigger
    if (!settings.enabled) {
        return false;
    }

    // Check based on frequency type
    switch (settings.frequency) {
        case 'every_10_changes':
            return getChangeCounter() >= 10;

        case 'every_25_changes':
            return getChangeCounter() >= 25;

        case 'every_50_changes':
            return getChangeCounter() >= 50;

        case 'daily': {
            if (!settings.lastBackupTimestamp) {
                return true; // First backup
            }
            const lastBackup = new Date(settings.lastBackupTimestamp);
            const now = new Date();
            const hoursSinceLastBackup = (now - lastBackup) / (1000 * 60 * 60);
            return hoursSinceLastBackup >= 24;
        }

        case 'weekly': {
            if (!settings.lastBackupTimestamp) {
                return true; // First backup
            }
            const lastBackup = new Date(settings.lastBackupTimestamp);
            const now = new Date();
            const daysSinceLastBackup = (now - lastBackup) / (1000 * 60 * 60 * 24);
            return daysSinceLastBackup >= 7;
        }

        case 'manual':
        default:
            return false; // Manual mode never auto-triggers
    }
}

/**
 * Perform an automatic backup
 * @param {Function} exportFunction - Function to call to get backup data (should return JSON string)
 * @returns {Object} Result with success status and message
 */
export function performAutoBackup(exportFunction) {
    try {
        // Get backup data
        const backupData = exportFunction();

        // Create download
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `unity-earnings-backup-${timestamp}.json`;

        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        // Update settings
        const settings = loadBackupSettings();
        settings.lastBackupTimestamp = Date.now();
        settings.lastBackupChangeCount = getChangeCounter();
        settings.totalBackups = (settings.totalBackups || 0) + 1;
        saveBackupSettings(settings);

        // Reset counter
        resetChangeCounter();

        return {
            success: true,
            message: `Auto-backup saved: ${filename}`,
            filename,
            timestamp: settings.lastBackupTimestamp
        };
    } catch (error) {
        console.error('Auto-backup failed:', error);
        return {
            success: false,
            message: `Auto-backup failed: ${error.message}`,
            error
        };
    }
}

/**
 * Toggle auto-backup on/off
 * @param {boolean} enabled - Whether to enable or disable
 * @returns {Object} Updated settings
 */
export function toggleAutoBackup(enabled) {
    const settings = loadBackupSettings();
    settings.enabled = enabled;

    // If enabling for the first time, reset counters
    if (enabled && !settings.lastBackupTimestamp) {
        resetChangeCounter();
    }

    saveBackupSettings(settings);
    return settings;
}

/**
 * Update auto-backup frequency
 * @param {string} frequency - New frequency setting
 * @returns {Object} Updated settings
 */
export function updateBackupFrequency(frequency) {
    const settings = loadBackupSettings();
    settings.frequency = frequency;

    // Update change threshold based on frequency
    switch (frequency) {
        case 'every_10_changes':
            settings.changeThreshold = 10;
            break;
        case 'every_25_changes':
            settings.changeThreshold = 25;
            break;
        case 'every_50_changes':
            settings.changeThreshold = 50;
            break;
        default:
            settings.changeThreshold = 0; // Time-based or manual
    }

    saveBackupSettings(settings);
    return settings;
}

/**
 * Get human-readable status of auto-backup
 * @returns {Object} Status information
 */
export function getBackupStatus() {
    const settings = loadBackupSettings();
    const changeCount = getChangeCounter();

    let statusMessage = '';
    let nextBackupInfo = '';

    if (!settings.enabled) {
        statusMessage = 'Auto-backup is disabled';
    } else {
        switch (settings.frequency) {
            case 'every_10_changes':
                statusMessage = `Auto-backup every 10 changes`;
                nextBackupInfo = `${changeCount}/10 changes`;
                break;
            case 'every_25_changes':
                statusMessage = `Auto-backup every 25 changes`;
                nextBackupInfo = `${changeCount}/25 changes`;
                break;
            case 'every_50_changes':
                statusMessage = `Auto-backup every 50 changes`;
                nextBackupInfo = `${changeCount}/50 changes`;
                break;
            case 'daily':
                statusMessage = 'Auto-backup daily';
                if (settings.lastBackupTimestamp) {
                    const lastBackup = new Date(settings.lastBackupTimestamp);
                    const hoursSince = (Date.now() - lastBackup) / (1000 * 60 * 60);
                    nextBackupInfo = `${Math.floor(24 - hoursSince)} hours until next backup`;
                } else {
                    nextBackupInfo = 'No backup yet';
                }
                break;
            case 'weekly':
                statusMessage = 'Auto-backup weekly';
                if (settings.lastBackupTimestamp) {
                    const lastBackup = new Date(settings.lastBackupTimestamp);
                    const daysSince = (Date.now() - lastBackup) / (1000 * 60 * 60 * 24);
                    nextBackupInfo = `${Math.floor(7 - daysSince)} days until next backup`;
                } else {
                    nextBackupInfo = 'No backup yet';
                }
                break;
            case 'manual':
                statusMessage = 'Manual backup only';
                nextBackupInfo = 'Backup when you click the button';
                break;
        }
    }

    return {
        enabled: settings.enabled,
        frequency: settings.frequency,
        statusMessage,
        nextBackupInfo,
        changeCount,
        lastBackupTimestamp: settings.lastBackupTimestamp,
        lastBackupDate: settings.lastBackupTimestamp
            ? new Date(settings.lastBackupTimestamp).toLocaleString()
            : 'Never',
        totalBackups: settings.totalBackups || 0
    };
}

/**
 * Reset all auto-backup data (for testing or cleanup)
 */
export function resetAutoBackup() {
    localStorage.removeItem(AUTO_BACKUP_SETTINGS_KEY);
    localStorage.removeItem(AUTO_BACKUP_COUNTER_KEY);
}
