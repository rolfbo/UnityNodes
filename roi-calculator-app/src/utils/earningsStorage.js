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
 * @param {Function} updateLicenseBinding - Optional callback to update license binding status
 * @returns {Object} Result with added count and potential duplicates list
 */
export function addEarnings(earnings, updateLicenseBinding = null) {
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

    // Update license binding status for newly earning licenses
    if (updateLicenseBinding) {
        const uniqueNodeIds = [...new Set(added.map(e => e.nodeId))];
        uniqueNodeIds.forEach(nodeId => {
            try {
                updateLicenseBinding(nodeId, true);
            } catch (error) {
                console.warn(`Failed to update binding status for ${nodeId}:`, error);
            }
        });
    }

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
 * Import earnings from JSON string with enhanced validation and merge strategies
 * @param {string} jsonString - JSON string to import
 * @param {string} mergeStrategy - How to handle duplicates: 'skip', 'add-all', or 'replace-all'
 * @returns {Object} Result with success status, counts, validation details, and preview
 */
export function importFromJSON(jsonString, mergeStrategy = 'skip') {
    try {
        // Import validation utilities
        const { validateJSONImport, checkForDuplicates, sanitizeEarning, generateImportPreview } =
            require('./importValidator.js');

        // Parse JSON
        const imported = JSON.parse(jsonString);

        // Validate structure
        if (!Array.isArray(imported)) {
            throw new Error('Invalid format: expected an array of earnings');
        }

        if (imported.length === 0) {
            return {
                success: false,
                message: 'Import file contains no earnings data',
                errors: ['File is empty']
            };
        }

        // Validate all earnings
        const validation = validateJSONImport(imported);

        if (!validation.isValid) {
            return {
                success: false,
                message: `Validation failed: ${validation.invalidCount} invalid entries`,
                errors: validation.errors,
                warnings: validation.warnings,
                validCount: validation.validCount,
                invalidCount: validation.invalidCount,
                totalCount: validation.totalCount
            };
        }

        // Sanitize all earnings (normalize formats, add IDs, etc.)
        const sanitizedEarnings = imported.map(e => sanitizeEarning(e));

        // Get existing earnings for duplicate checking
        const existingEarnings = loadEarnings();

        // Check for duplicates
        const duplicateCheck = checkForDuplicates(sanitizedEarnings, existingEarnings);

        // Generate preview
        const preview = generateImportPreview(sanitizedEarnings);

        // Handle different merge strategies
        let earningsToAdd = [];
        let message = '';

        switch (mergeStrategy) {
            case 'replace-all':
                // Replace all existing data
                saveEarnings(sanitizedEarnings);
                return {
                    success: true,
                    message: `Replaced all data with ${sanitizedEarnings.length} imported earnings`,
                    addedCount: sanitizedEarnings.length,
                    replacedCount: existingEarnings.length,
                    duplicateCount: 0,
                    totalCount: sanitizedEarnings.length,
                    preview
                };

            case 'add-all':
                // Add all, even duplicates
                earningsToAdd = sanitizedEarnings;
                message = `Added ${sanitizedEarnings.length} earnings (including ${duplicateCheck.duplicateCount} potential duplicates)`;
                break;

            case 'skip':
            default:
                // Skip duplicates (default behavior)
                earningsToAdd = duplicateCheck.uniqueEarnings;
                message = duplicateCheck.duplicateCount > 0
                    ? `Added ${duplicateCheck.uniqueCount} new earnings, skipped ${duplicateCheck.duplicateCount} duplicates`
                    : `Added ${duplicateCheck.uniqueCount} new earnings`;
                break;
        }

        // Add the earnings
        if (earningsToAdd.length > 0) {
            const allEarnings = [...existingEarnings, ...earningsToAdd];
            saveEarnings(allEarnings);
        }

        return {
            success: true,
            message,
            addedCount: earningsToAdd.length,
            duplicateCount: duplicateCheck.duplicateCount,
            skippedCount: mergeStrategy === 'skip' ? duplicateCheck.duplicateCount : 0,
            totalCount: imported.length,
            warnings: validation.warnings,
            preview
        };

    } catch (error) {
        return {
            success: false,
            message: `Import failed: ${error.message}`,
            errors: [error.message]
        };
    }
}

/**
 * Import earnings from CSV string
 * @param {string} csvString - CSV string to import
 * @param {Object} options - Import options
 * @returns {Object} Result with success status and counts
 */
export function importFromCSV(csvString, options = {}) {
    try {
        // Import validation utilities
        const { validateCSVRow, detectCSVColumns, checkForDuplicates, generateImportPreview } =
            require('./importValidator.js');

        // Parse CSV into rows
        const lines = csvString.split('\n').filter(line => line.trim().length > 0);

        if (lines.length < 2) {
            return {
                success: false,
                message: 'CSV file must have at least a header row and one data row',
                errors: ['File too short']
            };
        }

        // Parse header row
        const headerRow = lines[0].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));

        // Detect or use provided column mapping
        let columnMap = options.columnMap || detectCSVColumns(headerRow);

        if (!columnMap) {
            return {
                success: false,
                message: 'Could not detect required columns (Date, Node ID, Amount)',
                errors: ['Missing required columns'],
                expectedColumns: ['Date', 'Node ID', 'Amount', 'Status (optional)', 'License Type (optional)'],
                foundColumns: headerRow
            };
        }

        // Parse data rows
        const earnings = [];
        const errors = [];
        const warnings = [];

        for (let i = 1; i < lines.length; i++) {
            // Parse CSV row (handle quoted values)
            const row = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
                .map(cell => cell.trim().replace(/^"|"$/g, ''));

            const validation = validateCSVRow(row, columnMap, i);

            if (validation.isValid && validation.earning) {
                // Generate unique ID
                validation.earning.id = `earning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                earnings.push(validation.earning);
            }

            errors.push(...validation.errors);
            warnings.push(...validation.warnings);
        }

        if (earnings.length === 0) {
            return {
                success: false,
                message: 'No valid earnings found in CSV',
                errors: errors.length > 0 ? errors : ['All rows failed validation'],
                warnings
            };
        }

        // Check for duplicates
        const existingEarnings = loadEarnings();
        const duplicateCheck = checkForDuplicates(earnings, existingEarnings);

        // Generate preview
        const preview = generateImportPreview(earnings);

        // Add unique earnings (skip duplicates by default)
        const earningsToAdd = options.addDuplicates ? earnings : duplicateCheck.uniqueEarnings;

        if (earningsToAdd.length > 0) {
            const allEarnings = [...existingEarnings, ...earningsToAdd];
            saveEarnings(allEarnings);
        }

        const message = duplicateCheck.duplicateCount > 0
            ? `Imported ${duplicateCheck.uniqueCount} earnings, skipped ${duplicateCheck.duplicateCount} duplicates`
            : `Imported ${earnings.length} earnings`;

        return {
            success: true,
            message,
            addedCount: earningsToAdd.length,
            duplicateCount: duplicateCheck.duplicateCount,
            totalCount: earnings.length,
            errors: errors.length > 0 ? errors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined,
            preview,
            columnMap
        };

    } catch (error) {
        return {
            success: false,
            message: `CSV import failed: ${error.message}`,
            errors: [error.message]
        };
    }
}

/**
 * Export earnings data as Markdown formatted table
 * @param {Object} options - Export options (includeAll, maxRows, etc.)
 * @returns {string} Markdown formatted string
 */
export function exportToMarkdown(options = {}) {
    const earnings = loadEarnings();
    const stats = getEarningsStats();

    if (earnings.length === 0) {
        return '# Unity Nodes Earnings Report\n\nNo earnings data available.\n';
    }

    const {
        includeAll = false,
        maxRows = 20,
        groupByLicense = true
    } = options;

    // Build markdown document
    let markdown = '';

    // Header
    markdown += '# Unity Nodes Earnings Report\n\n';
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    markdown += '---\n\n';

    // Summary Statistics
    markdown += '## Summary\n\n';
    markdown += `- **Total Earnings:** $${stats.total.toFixed(2)}\n`;
    markdown += `- **Number of Transactions:** ${stats.count}\n`;
    markdown += `- **Average per Transaction:** $${stats.average.toFixed(2)}\n`;
    markdown += `- **Active Nodes (ULOs):** ${stats.uniqueNodes}\n`;

    // Date range
    const dates = earnings.map(e => e.date).sort();
    if (dates.length > 0) {
        markdown += `- **Date Range:** ${dates[0]} to ${dates[dates.length - 1]}\n`;
    }
    markdown += '\n';

    // Earnings by License Type
    if (groupByLicense && Object.keys(stats.byLicenseType).length > 0) {
        markdown += '## Earnings by License Type\n\n';
        markdown += '| License Type | Count | Total | Average |\n';
        markdown += '|--------------|------:|------:|--------:|\n';

        Object.entries(stats.byLicenseType)
            .sort((a, b) => b[1].total - a[1].total)
            .forEach(([type, data]) => {
                const avg = data.total / data.count;
                markdown += `| ${type} | ${data.count} | $${data.total.toFixed(2)} | $${avg.toFixed(2)} |\n`;
            });
        markdown += '\n';
    }

    // Recent Transactions Table
    const rowsToShow = includeAll ? earnings.length : Math.min(maxRows, earnings.length);
    const sortedEarnings = [...earnings].sort((a, b) => new Date(b.date) - new Date(a.date));

    markdown += `## ${includeAll ? 'All' : 'Recent'} Transactions${!includeAll && earnings.length > maxRows ? ` (showing ${rowsToShow} of ${earnings.length})` : ''}\n\n`;
    markdown += '| Date | Node ID | License Type | Amount | Status |\n';
    markdown += '|------|---------|--------------|-------:|--------|\n';

    sortedEarnings.slice(0, rowsToShow).forEach(earning => {
        const shortNodeId = earning.nodeId.length > 15
            ? `${earning.nodeId.substring(0, 6)}...${earning.nodeId.substring(earning.nodeId.length - 4)}`
            : earning.nodeId;
        markdown += `| ${earning.date} | ${shortNodeId} | ${earning.licenseType || 'Unknown'} | $${earning.amount.toFixed(2)} | ${earning.status} |\n`;
    });
    markdown += '\n';

    // Footer
    markdown += '---\n\n';
    markdown += '*This report was generated by Unity Nodes Earnings Tracker*\n';

    return markdown;
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

/**
 * Check if a license is currently earning (bound)
 * A license is considered bound if it has generated earnings within the last 24 hours
 *
 * @param {string} licenseId - The license address to check
 * @returns {boolean} True if the license is currently bound
 */
export function isLicenseBound(licenseId) {
    const earnings = loadEarnings();
    const normalizedLicenseId = licenseId.trim().toLowerCase();
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check if there are any earnings for this license in the last 24 hours
    return earnings.some(earning => {
        const earningDate = new Date(earning.date);
        return earning.nodeId.toLowerCase() === normalizedLicenseId &&
            earningDate >= twentyFourHoursAgo &&
            earning.amount > 0;
    });
}

/**
 * Update license binding status based on recent earnings
 * This function should be called when new earnings are added
 *
 * @param {string} licenseId - The license address that earned
 * @param {Function} updateLicenseBinding - Callback to update license binding status (from licenseStorage)
 */
export function updateLicenseBindingFromEarnings(licenseId, updateLicenseBinding) {
    if (!updateLicenseBinding) return;

    try {
        // Mark this license as bound since it just earned
        updateLicenseBinding(licenseId, true);
    } catch (error) {
        console.warn('Failed to update license binding status:', error);
    }
}

/**
 * Get licenses that haven't earned in the specified number of days
 * Used for detecting potentially unbound licenses
 *
 * @param {number} days - Number of days without earnings to check for
 * @returns {Array} Array of license IDs that haven't earned in the specified period
 */
export function getUnboundLicenses(days = 2) {
    const earnings = loadEarnings();
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Get all unique node IDs that have earned recently
    const recentlyEarningNodes = new Set(
        earnings
            .filter(earning => new Date(earning.date) >= cutoffDate)
            .map(earning => earning.nodeId.toLowerCase())
    );

    // Get all unique node IDs from all earnings
    const allNodes = new Set(
        earnings.map(earning => earning.nodeId.toLowerCase())
    );

    // Return nodes that exist but haven't earned recently
    return Array.from(allNodes).filter(nodeId => !recentlyEarningNodes.has(nodeId));
}

/**
 * Get license earning patterns for analysis
 * @param {string} licenseId - The license address to analyze
 * @param {number} days - Number of days to look back
 * @returns {Object} Earning pattern analysis
 */
export function getLicenseEarningPattern(licenseId, days = 30) {
    const earnings = loadEarnings();
    const normalizedLicenseId = licenseId.trim().toLowerCase();
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const licenseEarnings = earnings.filter(earning =>
        earning.nodeId.toLowerCase() === normalizedLicenseId &&
        new Date(earning.date) >= startDate
    );

    const totalEarned = licenseEarnings.reduce((sum, earning) => sum + earning.amount, 0);
    const earningDays = new Set(licenseEarnings.map(e => e.date)).size;
    const averageDaily = earningDays > 0 ? totalEarned / earningDays : 0;

    return {
        licenseId: normalizedLicenseId,
        totalEarned,
        earningDays,
        nonEarningDays: days - earningDays,
        averageDaily,
        lastEarning: licenseEarnings.length > 0 ?
            new Date(Math.max(...licenseEarnings.map(e => new Date(e.date)))) : null,
        isCurrentlyBound: isLicenseBound(normalizedLicenseId)
    };
}
