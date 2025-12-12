/**
 * License Storage Utility
 *
 * This module provides functions for managing Unity Node license data in localStorage.
 * It handles license inventory, lease information, binding status, and CRUD operations.
 *
 * Key Features:
 * - Save and load license data from localStorage
 * - Add, update, delete individual licenses
 * - Track lease information and binding status
 * - Validate license addresses and data integrity
 * - Export and import license data
 *
 * Data Structure:
 * - License: Object with licenseId, status, leaseInfo, bindingInfo, createdAt, updatedAt
 *
 * License Status Types:
 * - "self-run": Operator runs this license themselves
 * - "leased-bound": Leased to customer and actively earning
 * - "leased-unbound": Leased to customer but not earning (revenue loss!)
 * - "available": Not leased, available for lease
 *
 * @module licenseStorage
 */

// Storage keys for localStorage
const LICENSES_KEY = 'unity-nodes-licenses';
const LICENSE_HISTORY_KEY = 'unity-nodes-license-history';

/**
 * Validate license address format
 * @param {string} address - The license address to validate
 * @returns {boolean} True if valid format (0x + 64 hex characters)
 */
export function validateLicenseAddress(address) {
    if (!address || typeof address !== 'string') {
        return false;
    }

    // Must start with 0x and be exactly 66 characters (0x + 64 hex chars)
    const addressRegex = /^0x[a-fA-F0-9]{64}$/;
    return addressRegex.test(address.trim());
}

/**
 * Generate truncated license address for display
 * @param {string} address - Full license address
 * @returns {string} Truncated address (e.g., "0x01...a278")
 */
export function truncateLicenseAddress(address) {
    if (!address || address.length < 10) {
        return address;
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Load all licenses from localStorage
 * @returns {Object} Object with licenseIds as keys and license data as values
 */
export function loadLicenses() {
    try {
        const stored = localStorage.getItem(LICENSES_KEY);
        if (!stored) {
            return {};
        }
        const licenses = JSON.parse(stored);

        // Ensure data integrity - filter out any invalid entries
        const validLicenses = {};
        Object.entries(licenses).forEach(([licenseId, license]) => {
            if (license &&
                license.licenseId &&
                validateLicenseAddress(license.licenseId) &&
                license.status) {
                validLicenses[licenseId] = license;
            }
        });

        return validLicenses;
    } catch (error) {
        console.error('Error loading licenses:', error);
        return {};
    }
}

/**
 * Save licenses object to localStorage
 * @param {Object} licenses - Object with licenseIds as keys and license data as values
 */
export function saveLicenses(licenses) {
    try {
        localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
    } catch (error) {
        console.error('Error saving licenses:', error);
        throw new Error('Failed to save licenses. Storage may be full.');
    }
}

/**
 * Create a new license object with default values
 * @param {string} licenseId - The full license address
 * @param {string} status - Initial status ("self-run", "leased-bound", "leased-unbound", "available")
 * @param {Object} options - Additional license data
 * @returns {Object} New license object
 */
export function createLicenseObject(licenseId, status = 'available', options = {}) {
    const now = new Date().toISOString();

    return {
        licenseId: licenseId.trim().toLowerCase(),
        status: status,
        leaseInfo: options.leaseInfo || null,
        bindingInfo: options.bindingInfo || {
            isBound: false,
            phoneId: null,
            lastActive: null,
            downtimeDays: 0
        },
        createdAt: now,
        updatedAt: now,
        notes: options.notes || '',
        ...options
    };
}

/**
 * Check if a license exists
 * @param {string} licenseId - The license address to check
 * @returns {boolean} True if license exists
 */
export function licenseExists(licenseId) {
    const licenses = loadLicenses();
    return !!licenses[licenseId.trim().toLowerCase()];
}

/**
 * Add a single license to the stored licenses
 * @param {string} licenseId - The full license address
 * @param {string} status - License status
 * @param {Object} options - Additional license data
 * @returns {Object} Result object with success status and message
 */
export function addLicense(licenseId, status = 'available', options = {}) {
    const normalizedLicenseId = licenseId.trim().toLowerCase();

    // Validate license address
    if (!validateLicenseAddress(normalizedLicenseId)) {
        return {
            success: false,
            message: 'Invalid license address format. Must be 0x followed by 64 hexadecimal characters.',
            error: 'INVALID_ADDRESS'
        };
    }

    // Check for duplicate
    if (licenseExists(normalizedLicenseId)) {
        return {
            success: false,
            message: 'License already exists in the system.',
            duplicate: true,
            error: 'DUPLICATE_LICENSE'
        };
    }

    // Create license object
    const license = createLicenseObject(normalizedLicenseId, status, options);

    // Add to storage
    const licenses = loadLicenses();
    licenses[normalizedLicenseId] = license;

    try {
        saveLicenses(licenses);
        return {
            success: true,
            message: 'License added successfully',
            license: license
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: 'SAVE_FAILED'
        };
    }
}

/**
 * Update an existing license
 * @param {string} licenseId - The license address to update
 * @param {Object} updates - Object with fields to update
 * @returns {Object} Result object with success status and message
 */
export function updateLicense(licenseId, updates) {
    const normalizedLicenseId = licenseId.trim().toLowerCase();
    const licenses = loadLicenses();

    if (!licenses[normalizedLicenseId]) {
        return {
            success: false,
            message: 'License not found',
            error: 'LICENSE_NOT_FOUND'
        };
    }

    // Update the license
    licenses[normalizedLicenseId] = {
        ...licenses[normalizedLicenseId],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    try {
        saveLicenses(licenses);
        return {
            success: true,
            message: 'License updated successfully',
            license: licenses[normalizedLicenseId]
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            error: 'SAVE_FAILED'
        };
    }
}

/**
 * Delete a license by ID
 * @param {string} licenseId - The license address to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteLicense(licenseId) {
    const normalizedLicenseId = licenseId.trim().toLowerCase();
    const licenses = loadLicenses();

    if (!licenses[normalizedLicenseId]) {
        return false;
    }

    delete licenses[normalizedLicenseId];
    saveLicenses(licenses);
    return true;
}

/**
 * Get a specific license by ID
 * @param {string} licenseId - The license address to retrieve
 * @returns {Object|null} The license object or null if not found
 */
export function getLicense(licenseId) {
    const normalizedLicenseId = licenseId.trim().toLowerCase();
    const licenses = loadLicenses();
    return licenses[normalizedLicenseId] || null;
}

/**
 * Get all licenses as an array
 * @returns {Array} Array of license objects
 */
export function getAllLicenses() {
    const licenses = loadLicenses();
    return Object.values(licenses);
}

/**
 * Update license binding status
 * @param {string} licenseId - The license address
 * @param {boolean} isBound - Whether the license is currently bound
 * @param {string} phoneId - Phone/device ID (optional)
 * @returns {Object} Result object
 */
export function updateBindingStatus(licenseId, isBound, phoneId = null) {
    const updates = {
        bindingInfo: {
            isBound: isBound,
            phoneId: phoneId,
            lastActive: isBound ? new Date().toISOString() : null
        }
    };

    // If becoming unbound, calculate downtime
    if (!isBound) {
        const license = getLicense(licenseId);
        if (license && license.bindingInfo.lastActive) {
            const lastActive = new Date(license.bindingInfo.lastActive);
            const now = new Date();
            const downtimeDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
            updates.bindingInfo.downtimeDays = downtimeDays;
        }
    }

    return updateLicense(licenseId, updates);
}

/**
 * Get license statistics
 * @returns {Object} Statistics object with various metrics
 */
export function getLicenseStats() {
    const licenses = getAllLicenses();

    if (licenses.length === 0) {
        return {
            total: 0,
            byStatus: {},
            bound: 0,
            unbound: 0,
            leased: 0,
            selfRun: 0,
            available: 0,
            revenueLoss: 0
        };
    }

    const stats = {
        total: licenses.length,
        byStatus: {},
        bound: 0,
        unbound: 0,
        leased: 0,
        selfRun: 0,
        available: 0
    };

    licenses.forEach(license => {
        // Count by status
        stats.byStatus[license.status] = (stats.byStatus[license.status] || 0) + 1;

        // Count bound/unbound
        if (license.bindingInfo?.isBound) {
            stats.bound++;
        } else if (license.status === 'leased-unbound') {
            stats.unbound++;
        }

        // Count by category
        if (license.status.startsWith('leased')) {
            stats.leased++;
        } else if (license.status === 'self-run') {
            stats.selfRun++;
        } else if (license.status === 'available') {
            stats.available++;
        }
    });

    return stats;
}

/**
 * Export licenses data as JSON string
 * @returns {string} JSON string of all licenses
 */
export function exportLicensesToJSON() {
    const licenses = loadLicenses();
    return JSON.stringify(licenses, null, 2);
}

/**
 * Export licenses data as CSV string
 * @returns {string} CSV formatted string
 */
export function exportLicensesToCSV() {
    const licenses = getAllLicenses();

    if (licenses.length === 0) {
        return 'No data to export';
    }

    // CSV header
    const headers = [
        'License Address',
        'Status',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Lease Start Date',
        'Lease Duration',
        'Duration Unit',
        'Revenue Split (%)',
        'Monthly Fee ($)',
        'Is Currently Bound',
        'Phone/Device ID',
        'Notes',
        'Created At',
        'Updated At'
    ];

    const rows = [headers.join(',')];

    // Add data rows
    licenses.forEach(license => {
        const row = [
            license.licenseId,
            license.status,
            license.leaseInfo?.customer || '',
            license.leaseInfo?.email || '',
            license.leaseInfo?.phone || '',
            license.leaseInfo?.startDate || '',
            license.leaseInfo?.duration || '',
            license.leaseInfo?.durationUnit || 'months',
            license.leaseInfo?.revenueSplit || '',
            license.leaseInfo?.monthlyFee || '',
            license.bindingInfo?.isBound ? 'Yes' : 'No',
            license.bindingInfo?.phoneId || '',
            license.notes || '',
            license.createdAt,
            license.updatedAt
        ];

        // Escape CSV fields containing commas or quotes
        const escapedRow = row.map(field => {
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        });

        rows.push(escapedRow.join(','));
    });

    return rows.join('\n');
}

/**
 * Import licenses from JSON string
 * @param {string} jsonString - JSON string to import
 * @param {boolean} overwrite - Whether to overwrite existing licenses
 * @returns {Object} Result with success status and counts
 */
export function importLicensesFromJSON(jsonString, overwrite = false) {
    try {
        const imported = JSON.parse(jsonString);

        if (typeof imported !== 'object' || imported === null) {
            throw new Error('Invalid JSON format: expected an object');
        }

        const existingLicenses = loadLicenses();
        const newLicenses = {};
        let added = 0;
        let skipped = 0;
        let updated = 0;

        Object.entries(imported).forEach(([licenseId, license]) => {
            if (!validateLicenseAddress(licenseId)) {
                skipped++;
                return;
            }

            if (existingLicenses[licenseId] && !overwrite) {
                skipped++;
                return;
            }

            newLicenses[licenseId] = {
                ...license,
                licenseId: licenseId,
                updatedAt: new Date().toISOString()
            };

            if (existingLicenses[licenseId]) {
                updated++;
            } else {
                added++;
            }
        });

        // Merge with existing licenses
        const finalLicenses = overwrite ? newLicenses : { ...existingLicenses, ...newLicenses };
        saveLicenses(finalLicenses);

        return {
            success: true,
            message: `Import completed. Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`,
            added,
            updated,
            skipped
        };

    } catch (error) {
        return {
            success: false,
            message: `Import failed: ${error.message}`,
            error: error.message
        };
    }
}

/**
 * Import licenses from CSV string
 * @param {string} csvString - CSV string to import
 * @param {boolean} overwrite - Whether to overwrite existing licenses
 * @returns {Object} Result with success status and counts
 */
export function importLicensesFromCSV(csvString, overwrite = false) {
    try {
        // Parse CSV
        const lines = csvString.split('\n').filter(line => line.trim().length > 0);

        if (lines.length < 2) {
            return {
                success: false,
                message: 'CSV file must have at least a header row and one data row',
                errors: ['File too short']
            };
        }

        // Parse header
        const headerRow = lines[0].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));

        // Expected columns
        const expectedColumns = [
            'License Address',
            'Status',
            'Customer Name',
            'Customer Email',
            'Customer Phone',
            'Lease Start Date',
            'Lease Duration',
            'Duration Unit',
            'Revenue Split (%)',
            'Monthly Fee ($)',
            'Is Currently Bound',
            'Phone/Device ID',
            'Notes'
        ];

        // Create column mapping
        const columnMap = {};
        expectedColumns.forEach(col => {
            const index = headerRow.findIndex(h => h.toLowerCase() === col.toLowerCase());
            if (index !== -1) {
                columnMap[col] = index;
            }
        });

        if (!columnMap['License Address']) {
            return {
                success: false,
                message: 'Required column "License Address" not found',
                errors: ['Missing required License Address column']
            };
        }

        const existingLicenses = loadLicenses();
        const newLicenses = {};
        let added = 0;
        let skipped = 0;
        let updated = 0;
        const errors = [];
        const warnings = [];

        // Process data rows
        for (let i = 1; i < lines.length; i++) {
            try {
                // Parse CSV row (handle quoted values)
                const row = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
                    .map(cell => cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

                const licenseId = row[columnMap['License Address']]?.trim();

                if (!licenseId) {
                    errors.push(`Row ${i + 1}: Missing license address`);
                    continue;
                }

                if (!validateLicenseAddress(licenseId)) {
                    errors.push(`Row ${i + 1}: Invalid license address format: ${licenseId}`);
                    continue;
                }

                if (existingLicenses[licenseId] && !overwrite) {
                    skipped++;
                    continue;
                }

                // Build license object
                const license = createLicenseObject(licenseId, 'available');

                // Status
                const status = row[columnMap['Status']]?.trim();
                if (status && ['self-run', 'leased-bound', 'leased-unbound', 'available'].includes(status)) {
                    license.status = status;
                }

                // Lease info
                const customerName = row[columnMap['Customer Name']]?.trim();
                if (customerName && license.status.startsWith('leased')) {
                    license.leaseInfo = {
                        customer: customerName,
                        email: row[columnMap['Customer Email']]?.trim() || null,
                        phone: row[columnMap['Customer Phone']]?.trim() || null,
                        startDate: row[columnMap['Lease Start Date']]?.trim() || null,
                        duration: parseFloat(row[columnMap['Lease Duration']]?.trim()) || null,
                        durationUnit: row[columnMap['Duration Unit']]?.trim() || 'months',
                        revenueSplit: parseFloat(row[columnMap['Revenue Split (%)']]?.trim()) || 70,
                        monthlyFee: parseFloat(row[columnMap['Monthly Fee ($)']]?.trim()) || null
                    };
                }

                // Binding info
                const isBound = row[columnMap['Is Currently Bound']]?.trim().toLowerCase();
                license.bindingInfo = {
                    isBound: isBound === 'yes' || isBound === 'true',
                    phoneId: row[columnMap['Phone/Device ID']]?.trim() || null,
                    lastActive: null,
                    downtimeDays: 0
                };

                // Notes
                const notes = row[columnMap['Notes']]?.trim();
                if (notes) {
                    license.notes = notes;
                }

                newLicenses[licenseId] = license;

                if (existingLicenses[licenseId]) {
                    updated++;
                } else {
                    added++;
                }

            } catch (error) {
                errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }

        if (Object.keys(newLicenses).length === 0) {
            return {
                success: false,
                message: 'No valid licenses found in CSV',
                errors: errors.length > 0 ? errors : ['All rows failed validation']
            };
        }

        // Merge with existing licenses
        const finalLicenses = overwrite ? newLicenses : { ...existingLicenses, ...newLicenses };
        saveLicenses(finalLicenses);

        const message = `Import completed. Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`;
        const result = {
            success: true,
            message,
            added,
            updated,
            skipped
        };

        if (errors.length > 0) {
            result.errors = errors;
            result.message += `, Errors: ${errors.length}`;
        }

        return result;

    } catch (error) {
        return {
            success: false,
            message: `Import failed: ${error.message}`,
            error: error.message
        };
    }
}

/**
 * Clear all licenses from storage
 */
export function clearAllLicenses() {
    localStorage.removeItem(LICENSES_KEY);
    localStorage.removeItem(LICENSE_HISTORY_KEY);
}