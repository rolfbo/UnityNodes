/**
 * Earnings Storage Utility
 * 
 * This module provides functions for managing Unity Node earnings data in localStorage.
 * It handles data persistence, duplicate detection, and node ID to license type mapping.
 * 
 * Key Features:
 * - Save and load earnings data from localStorage
 * - Add individual earnings with automatic duplicate detection
 * - Manage node ID to license type mappings
 * - Export data in various formats
 * 
 * Data Structure:
 * - Earnings: Array of earning objects with id, nodeId, licenseType, amount, date, status
 * - Node Mapping: Object mapping node IDs to license types
 * 
 * @module earningsStorage
 */

// Storage keys for localStorage
const EARNINGS_KEY = 'unity-nodes-earnings';
const NODE_MAPPING_KEY = 'unity-nodes-node-mapping';

/**
 * Load all earnings from localStorage
 * @returns {Array} Array of earning objects
 */
export function loadEarnings() {
    try {
        const stored = localStorage.getItem(EARNINGS_KEY);
        if (!stored) {
            return [];
        }
        const earnings = JSON.parse(stored);
        // Ensure data integrity - filter out any invalid entries
        return earnings.filter(earning =>
            earning &&
            earning.id &&
            earning.nodeId &&
            earning.amount !== undefined
        );
    } catch (error) {
        console.error('Error loading earnings:', error);
        return [];
    }
}

/**
 * Save earnings array to localStorage
 * @param {Array} earnings - Array of earning objects to save
 */
export function saveEarnings(earnings) {
    try {
        localStorage.setItem(EARNINGS_KEY, JSON.stringify(earnings));
    } catch (error) {
        console.error('Error saving earnings:', error);
        throw new Error('Failed to save earnings. Storage may be full.');
    }
}

/**
 * Check if an earning is a duplicate of any existing earning
 * An earning is considered duplicate if it has the same nodeId, amount, and date
 * 
 * @param {Object} earning - The earning object to check
 * @param {Array} existingEarnings - Array of existing earnings to check against
 * @returns {boolean} True if duplicate exists, false otherwise
 */
export function isDuplicate(earning, existingEarnings) {
    return existingEarnings.some(existing =>
        existing.nodeId === earning.nodeId &&
        existing.amount === earning.amount &&
        existing.date === earning.date
    );
}

/**
 * Add a single earning to the stored earnings
 * Automatically checks for duplicates before adding
 * 
 * @param {Object} earning - The earning object to add
 * @returns {Object} Result object with success status and message
 */
export function addEarning(earning) {
    const existingEarnings = loadEarnings();

    // Check for duplicate
    if (isDuplicate(earning, existingEarnings)) {
        return {
            success: false,
            message: 'Duplicate earning detected',
            duplicate: true
        };
    }

    // Add the new earning
    existingEarnings.push(earning);

    // Save to localStorage
    try {
        saveEarnings(existingEarnings);
        return {
            success: true,
            message: 'Earning added successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Add multiple earnings at once
 * Adds ALL entries and flags potential duplicates for manual review
 * 
 * @param {Array} earnings - Array of earning objects to add
 * @returns {Object} Result with added count and potential duplicates list
 */
export function addEarnings(earnings) {
    const existingEarnings = loadEarnings();
    const added = [];
    const potentialDuplicates = [];

    earnings.forEach(earning => {
        // Check if it's a potential duplicate
        if (isDuplicate(earning, [...existingEarnings, ...added])) {
            potentialDuplicates.push(earning); // Flag it as potential duplicate
        }
        added.push(earning); // ADD IT ANYWAY - this is the key change
    });

    // Save all new earnings
    const allEarnings = [...existingEarnings, ...added];
    saveEarnings(allEarnings);

    return {
        success: true,
        addedCount: added.length,
        potentialDuplicates: potentialDuplicates,
        duplicateCount: potentialDuplicates.length
    };
}

/**
 * Delete an earning by ID
 * @param {string} earningId - The ID of the earning to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteEarning(earningId) {
    const earnings = loadEarnings();
    const filtered = earnings.filter(e => e.id !== earningId);

    if (filtered.length === earnings.length) {
        return false; // Not found
    }

    saveEarnings(filtered);
    return true;
}

/**
 * Update an existing earning
 * @param {string} earningId - The ID of the earning to update
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} True if updated, false if not found
 */
export function updateEarning(earningId, updates) {
    const earnings = loadEarnings();
    const index = earnings.findIndex(e => e.id === earningId);

    if (index === -1) {
        return false; // Not found
    }

    earnings[index] = { ...earnings[index], ...updates };
    saveEarnings(earnings);
    return true;
}

/**
 * Clear all earnings from storage
 */
export function clearAllEarnings() {
    localStorage.removeItem(EARNINGS_KEY);
}

/**
 * Load node ID to license type mapping from localStorage
 * @returns {Object} Mapping object where keys are node IDs and values are license types
 */
export function getNodeMapping() {
    try {
        const stored = localStorage.getItem(NODE_MAPPING_KEY);
        if (!stored) {
            return {};
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error loading node mapping:', error);
        return {};
    }
}

/**
 * Save node mapping to localStorage
 * @param {Object} mapping - Mapping object to save
 */
export function saveNodeMapping(mapping) {
    try {
        localStorage.setItem(NODE_MAPPING_KEY, JSON.stringify(mapping));
    } catch (error) {
        console.error('Error saving node mapping:', error);
        throw new Error('Failed to save node mapping.');
    }
}

/**
 * Update the license type for a specific node ID
 * @param {string} nodeId - The node ID to update
 * @param {string} licenseType - The license type to assign (e.g., 'ULO')
 */
export function updateNodeMapping(nodeId, licenseType) {
    const mapping = getNodeMapping();
    mapping[nodeId] = licenseType;
    saveNodeMapping(mapping);

    // Also update all existing earnings with this nodeId
    const earnings = loadEarnings();
    const updated = earnings.map(earning => {
        if (earning.nodeId === nodeId) {
            return { ...earning, licenseType };
        }
        return earning;
    });
    saveEarnings(updated);
}

/**
 * Get the license type for a node ID
 * @param {string} nodeId - The node ID to look up
 * @returns {string|null} The license type or null if not mapped
 */
export function getLicenseType(nodeId) {
    const mapping = getNodeMapping();
    return mapping[nodeId] || null;
}

/**
 * Export earnings data as JSON string
 * @returns {string} JSON string of all earnings
 */
export function exportToJSON() {
    const earnings = loadEarnings();
    return JSON.stringify(earnings, null, 2);
}

/**
 * Export earnings data as CSV string
 * @returns {string} CSV formatted string
 */
export function exportToCSV() {
    const earnings = loadEarnings();

    if (earnings.length === 0) {
        return 'No data to export';
    }

    // CSV header
    const headers = ['Date', 'Node ID', 'License Type', 'Amount ($)', 'Status'];
    const rows = [headers.join(',')];

    // Add data rows
    earnings.forEach(earning => {
        const row = [
            earning.date,
            earning.nodeId,
            earning.licenseType || 'Unmapped',
            earning.amount.toFixed(2),
            earning.status
        ];
        rows.push(row.join(','));
    });

    return rows.join('\n');
}

/**
 * Import earnings from JSON string
 * Merges with existing data, skipping duplicates
 * @param {string} jsonString - JSON string to import
 * @returns {Object} Result with success status and counts
 */
export function importFromJSON(jsonString) {
    try {
        const imported = JSON.parse(jsonString);

        if (!Array.isArray(imported)) {
            throw new Error('Invalid format: expected an array');
        }

        return addEarnings(imported);
    } catch (error) {
        return {
            success: false,
            message: `Import failed: ${error.message}`
        };
    }
}

/**
 * Get earnings statistics
 * @returns {Object} Statistics object with various metrics
 */
export function getEarningsStats() {
    const earnings = loadEarnings();

    if (earnings.length === 0) {
        return {
            total: 0,
            count: 0,
            average: 0,
            byLicenseType: {},
            uniqueNodes: 0
        };
    }

    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    const count = earnings.length;
    const average = total / count;

    // Group by license type
    const byLicenseType = {};
    earnings.forEach(earning => {
        const type = earning.licenseType || 'Unmapped';
        if (!byLicenseType[type]) {
            byLicenseType[type] = { count: 0, total: 0 };
        }
        byLicenseType[type].count++;
        byLicenseType[type].total += earning.amount;
    });

    // Count unique nodes
    const uniqueNodes = new Set(earnings.map(e => e.nodeId)).size;

    return {
        total,
        count,
        average,
        byLicenseType,
        uniqueNodes
    };
}
