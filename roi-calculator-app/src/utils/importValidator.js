/**
 * Import Validator Utility
 * 
 * This module provides comprehensive validation for imported data files.
 * It validates JSON and CSV imports to ensure data integrity before adding
 * earnings to the system. This helps non-technical users understand what
 * went wrong if their import fails.
 * 
 * Key Features:
 * - Schema validation for JSON imports
 * - Row-by-row validation for CSV imports
 * - User-friendly error messages
 * - Preview data generation
 * - Duplicate detection
 * 
 * @module importValidator
 */

/**
 * Validate a single earning object against the expected schema
 * @param {Object} earning - The earning object to validate
 * @param {number} index - Index of the earning (for error messages)
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateEarning(earning, index = 0) {
    const errors = [];
    const warnings = [];

    // Check if earning exists
    if (!earning || typeof earning !== 'object') {
        return {
            isValid: false,
            errors: [`Entry ${index + 1}: Not a valid object`],
            warnings: []
        };
    }

    // Required field: nodeId
    if (!earning.nodeId) {
        errors.push(`Entry ${index + 1}: Missing node ID`);
    } else if (typeof earning.nodeId !== 'string') {
        errors.push(`Entry ${index + 1}: Node ID must be a string`);
    } else if (!earning.nodeId.match(/^0x[0-9a-fA-F]/)) {
        warnings.push(`Entry ${index + 1}: Node ID format looks unusual: ${earning.nodeId}`);
    }

    // Required field: amount
    if (earning.amount === undefined || earning.amount === null) {
        errors.push(`Entry ${index + 1}: Missing amount`);
    } else if (typeof earning.amount !== 'number') {
        errors.push(`Entry ${index + 1}: Amount must be a number, got ${typeof earning.amount}`);
    } else if (earning.amount < 0) {
        errors.push(`Entry ${index + 1}: Amount cannot be negative`);
    } else if (earning.amount === 0) {
        warnings.push(`Entry ${index + 1}: Amount is zero`);
    }

    // Required field: date
    if (!earning.date) {
        errors.push(`Entry ${index + 1}: Missing date`);
    } else if (typeof earning.date !== 'string') {
        errors.push(`Entry ${index + 1}: Date must be a string`);
    } else {
        // Validate date format (YYYY-MM-DD)
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(earning.date)) {
            errors.push(`Entry ${index + 1}: Date must be in YYYY-MM-DD format, got ${earning.date}`);
        } else {
            // Check if date is valid
            const dateObj = new Date(earning.date);
            if (isNaN(dateObj.getTime())) {
                errors.push(`Entry ${index + 1}: Invalid date: ${earning.date}`);
            }
        }
    }

    // Optional field: status (default to 'completed' if missing)
    if (earning.status && typeof earning.status !== 'string') {
        errors.push(`Entry ${index + 1}: Status must be a string`);
    }

    // Optional field: licenseType
    if (earning.licenseType !== undefined && typeof earning.licenseType !== 'string') {
        errors.push(`Entry ${index + 1}: License type must be a string`);
    }

    // Optional field: id (will be generated if missing)
    if (earning.id && typeof earning.id !== 'string') {
        warnings.push(`Entry ${index + 1}: ID should be a string, will be regenerated`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validate an array of earnings for JSON import
 * @param {Array} earnings - Array of earning objects
 * @returns {Object} Validation result with detailed statistics
 */
export function validateJSONImport(earnings) {
    if (!Array.isArray(earnings)) {
        return {
            isValid: false,
            errors: ['Import data must be an array of earnings'],
            warnings: [],
            validCount: 0,
            invalidCount: 0,
            totalCount: 0
        };
    }

    if (earnings.length === 0) {
        return {
            isValid: false,
            errors: ['Import data is empty'],
            warnings: [],
            validCount: 0,
            invalidCount: 0,
            totalCount: 0
        };
    }

    const allErrors = [];
    const allWarnings = [];
    let validCount = 0;
    let invalidCount = 0;

    earnings.forEach((earning, index) => {
        const validation = validateEarning(earning, index);

        if (validation.isValid) {
            validCount++;
        } else {
            invalidCount++;
        }

        allErrors.push(...validation.errors);
        allWarnings.push(...validation.warnings);
    });

    return {
        isValid: invalidCount === 0,
        errors: allErrors,
        warnings: allWarnings,
        validCount,
        invalidCount,
        totalCount: earnings.length
    };
}

/**
 * Parse and validate a CSV row
 * @param {Array} row - CSV row as array of values
 * @param {Object} columnMap - Mapping of column indices to field names
 * @param {number} rowIndex - Index of the row (for error messages)
 * @returns {Object} Parsed earning object with validation result
 */
export function validateCSVRow(row, columnMap, rowIndex) {
    const errors = [];
    const warnings = [];

    // Extract values based on column mapping
    const nodeId = row[columnMap.nodeId]?.trim();
    const amountStr = row[columnMap.amount]?.trim();
    const dateStr = row[columnMap.date]?.trim();
    const status = row[columnMap.status]?.trim() || 'completed';
    const licenseType = row[columnMap.licenseType]?.trim() || 'Unknown';

    // Validate node ID
    if (!nodeId) {
        errors.push(`Row ${rowIndex + 1}: Missing node ID`);
    }

    // Validate and parse amount
    let amount = null;
    if (!amountStr) {
        errors.push(`Row ${rowIndex + 1}: Missing amount`);
    } else {
        // Remove currency symbols and parse
        const cleanAmount = amountStr.replace(/[$,]/g, '');
        amount = parseFloat(cleanAmount);

        if (isNaN(amount)) {
            errors.push(`Row ${rowIndex + 1}: Invalid amount: ${amountStr}`);
        } else if (amount < 0) {
            errors.push(`Row ${rowIndex + 1}: Amount cannot be negative`);
        } else if (amount === 0) {
            warnings.push(`Row ${rowIndex + 1}: Amount is zero`);
        }
    }

    // Validate date
    if (!dateStr) {
        errors.push(`Row ${rowIndex + 1}: Missing date`);
    } else {
        // Try to parse date
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) {
            errors.push(`Row ${rowIndex + 1}: Invalid date: ${dateStr}`);
        }
    }

    // Create earning object if valid
    const earning = errors.length === 0 ? {
        nodeId,
        amount,
        date: dateStr,
        status,
        licenseType
    } : null;

    return {
        earning,
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Detect column mapping from CSV header row
 * @param {Array} headerRow - First row of CSV (header)
 * @returns {Object|null} Column mapping object or null if detection failed
 */
export function detectCSVColumns(headerRow) {
    if (!Array.isArray(headerRow) || headerRow.length === 0) {
        return null;
    }

    const mapping = {
        date: -1,
        nodeId: -1,
        licenseType: -1,
        amount: -1,
        status: -1
    };

    // Normalize headers and search for matches
    headerRow.forEach((header, index) => {
        const normalized = header.toLowerCase().trim();

        // Date column
        if (normalized.includes('date') || normalized === 'day') {
            mapping.date = index;
        }
        // Node ID column
        else if (normalized.includes('node') || normalized.includes('id')) {
            mapping.nodeId = index;
        }
        // License Type column
        else if (normalized.includes('license') || normalized.includes('type')) {
            mapping.licenseType = index;
        }
        // Amount column
        else if (normalized.includes('amount') || normalized.includes('$') || normalized === 'earnings') {
            mapping.amount = index;
        }
        // Status column
        else if (normalized.includes('status')) {
            mapping.status = index;
        }
    });

    // Check if we found at least the required columns (date, nodeId, amount)
    const hasRequiredColumns = mapping.date !== -1 && mapping.nodeId !== -1 && mapping.amount !== -1;

    if (!hasRequiredColumns) {
        return null;
    }

    return mapping;
}

/**
 * Generate a preview summary of import data
 * @param {Array} earnings - Array of earnings to preview
 * @param {number} previewCount - Number of items to show in preview
 * @returns {Object} Preview object with summary statistics
 */
export function generateImportPreview(earnings, previewCount = 5) {
    if (!Array.isArray(earnings) || earnings.length === 0) {
        return {
            totalCount: 0,
            previewItems: [],
            totalAmount: 0,
            dateRange: { start: null, end: null },
            uniqueNodes: 0,
            licenseTypes: []
        };
    }

    // Calculate summary statistics
    const totalAmount = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
    const uniqueNodes = new Set(earnings.map(e => e.nodeId)).size;
    const licenseTypes = [...new Set(earnings.map(e => e.licenseType || 'Unknown'))];

    // Find date range
    const dates = earnings.map(e => e.date).filter(d => d).sort();
    const dateRange = {
        start: dates[0] || null,
        end: dates[dates.length - 1] || null
    };

    // Get preview items (first N items)
    const previewItems = earnings.slice(0, previewCount);

    return {
        totalCount: earnings.length,
        previewItems,
        totalAmount,
        dateRange,
        uniqueNodes,
        licenseTypes
    };
}

/**
 * Check for duplicate earnings in imported data
 * @param {Array} newEarnings - Array of earnings to import
 * @param {Array} existingEarnings - Array of existing earnings
 * @returns {Object} Duplicate analysis with details
 */
export function checkForDuplicates(newEarnings, existingEarnings) {
    const duplicates = [];
    const uniqueNewEarnings = [];

    newEarnings.forEach((newEarning) => {
        // Check if this earning already exists
        const isDuplicate = existingEarnings.some((existing) =>
            existing.nodeId === newEarning.nodeId &&
            existing.amount === newEarning.amount &&
            existing.date === newEarning.date
        );

        if (isDuplicate) {
            duplicates.push(newEarning);
        } else {
            uniqueNewEarnings.push(newEarning);
        }
    });

    return {
        duplicateCount: duplicates.length,
        duplicates,
        uniqueCount: uniqueNewEarnings.length,
        uniqueEarnings: uniqueNewEarnings
    };
}

/**
 * Sanitize and normalize an earning object
 * Ensures all fields are in the correct format and adds missing defaults
 * @param {Object} earning - Earning object to sanitize
 * @returns {Object} Sanitized earning object
 */
export function sanitizeEarning(earning) {
    // Generate ID if missing
    const id = earning.id || `earning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Normalize date format
    let date = earning.date;
    if (date && !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            date = `${year}-${month}-${day}`;
        }
    }

    // Create sanitized earning
    return {
        id,
        nodeId: earning.nodeId?.trim(),
        licenseType: earning.licenseType || 'Unknown',
        amount: parseFloat(earning.amount),
        date,
        status: earning.status || 'completed',
        timestamp: new Date(date).getTime()
    };
}
