/**
 * Earnings Parser Utility
 * 
 * This module provides intelligent parsing of pasted earnings data from Unity Nodes.
 * It extracts node IDs, amounts, dates, and status from various text formats.
 * 
 * Expected Input Format (example):
 * 
 * 0x01...a278
 * + $0.07
 * completed / 06 Dec 2025
 * 
 * 0x01...a278
 * + $0.09
 * completed / 05 Dec 2025
 * 
 * The parser is flexible and can handle variations in formatting, whitespace,
 * and line breaks. It groups consecutive lines into individual earning records.
 * 
 * @module earningsParser
 */

import { getLicenseType } from './earningsStorage.js';

/**
 * Parse a date string in various formats to ISO date string (YYYY-MM-DD)
 * Handles formats like:
 * - "06 Dec 2025"
 * - "December 6, 2025"
 * - "2025-12-06"
 * - "12/06/2025"
 * 
 * @param {string} dateStr - The date string to parse
 * @returns {string|null} ISO formatted date string or null if parsing fails
 */
function parseDate(dateStr) {
    try {
        // Try parsing the date
        const date = new Date(dateStr);

        // Check if valid date
        if (isNaN(date.getTime())) {
            return null;
        }

        // Return in YYYY-MM-DD format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error parsing date:', dateStr, error);
        return null;
    }
}

/**
 * Extract node ID from a line of text
 * Looks for patterns like: 0x01...a278, 0xAB...CD12, etc.
 * 
 * @param {string} line - The line of text to search
 * @returns {string|null} The node ID or null if not found
 */
function extractNodeId(line) {
    // Pattern for node IDs: 0x followed by hex chars, ..., then more hex chars
    const pattern = /0x[0-9a-fA-F]{2,}\.{2,}[0-9a-fA-F]{2,}/;
    const match = line.match(pattern);
    return match ? match[0] : null;
}

/**
 * Extract amount from a line of text
 * Looks for patterns like: + $0.07, +$1.23, $0.50, etc.
 * 
 * @param {string} line - The line of text to search
 * @returns {number|null} The amount as a number or null if not found
 */
function extractAmount(line) {
    // Pattern for amounts: optional +, optional space, $, then number with decimals
    const pattern = /\+?\s*\$\s*(\d+\.?\d*)/;
    const match = line.match(pattern);

    if (match && match[1]) {
        const amount = parseFloat(match[1]);
        return isNaN(amount) ? null : amount;
    }

    return null;
}

/**
 * Extract date from a line of text
 * Looks for patterns like: completed / 06 Dec 2025, 05 Dec 2025, etc.
 * 
 * @param {string} line - The line of text to search
 * @returns {string|null} ISO formatted date string or null if not found
 */
function extractDate(line) {
    // Try to find a date pattern
    // Pattern 1: DD Mon YYYY (e.g., "06 Dec 2025")
    const pattern1 = /(\d{1,2}\s+\w{3,}\s+\d{4})/;
    const match1 = line.match(pattern1);

    if (match1) {
        return parseDate(match1[1]);
    }

    // Pattern 2: Mon DD, YYYY (e.g., "Dec 06, 2025")
    const pattern2 = /(\w{3,}\s+\d{1,2},?\s+\d{4})/;
    const match2 = line.match(pattern2);

    if (match2) {
        return parseDate(match2[1]);
    }

    // Pattern 3: YYYY-MM-DD
    const pattern3 = /(\d{4}-\d{2}-\d{2})/;
    const match3 = line.match(pattern3);

    if (match3) {
        return match3[1];
    }

    // Pattern 4: MM/DD/YYYY or DD/MM/YYYY
    const pattern4 = /(\d{1,2}\/\d{1,2}\/\d{4})/;
    const match4 = line.match(pattern4);

    if (match4) {
        return parseDate(match4[1]);
    }

    return null;
}

/**
 * Extract status from a line of text
 * Looks for keywords like: completed, pending, failed, processing, etc.
 * 
 * @param {string} line - The line of text to search
 * @returns {string} The status (defaults to 'completed' if not found)
 */
function extractStatus(line) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes('completed') || lowerLine.includes('complete')) {
        return 'completed';
    }
    if (lowerLine.includes('pending')) {
        return 'pending';
    }
    if (lowerLine.includes('failed') || lowerLine.includes('error')) {
        return 'failed';
    }
    if (lowerLine.includes('processing')) {
        return 'processing';
    }

    // Default to completed
    return 'completed';
}

/**
 * Generate a unique ID for an earning based on timestamp and random value
 * @returns {string} Unique ID
 */
function generateId() {
    return `earning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse a single earning entry from an array of lines
 * Expects the lines to contain node ID, amount, and date information
 * 
 * @param {Array<string>} lines - Array of lines that make up one earning entry
 * @returns {Object|null} Earning object or null if parsing fails
 */
function parseEarningEntry(lines) {
    let nodeId = null;
    let amount = null;
    let date = null;
    let status = 'completed';

    // Search through all lines for each piece of information
    for (const line of lines) {
        if (!nodeId) {
            nodeId = extractNodeId(line);
        }
        if (amount === null) {
            amount = extractAmount(line);
        }
        if (!date) {
            date = extractDate(line);
        }
        // Extract status from any line that contains it
        const extractedStatus = extractStatus(line);
        if (extractedStatus !== 'completed') {
            status = extractedStatus;
        }
    }

    // Validate that we have the minimum required information
    if (!nodeId || amount === null || !date) {
        return null;
    }

    // Try to get license type from stored mapping
    const licenseType = getLicenseType(nodeId);

    // Create the earning object
    return {
        id: generateId(),
        nodeId,
        licenseType: licenseType || 'Unknown',
        amount,
        date,
        status,
        timestamp: new Date(date).getTime()
    };
}

/**
 * Main parsing function - parses earnings text into array of earning objects
 * 
 * This function takes raw pasted text and intelligently extracts earnings data.
 * It handles multiple entries separated by blank lines or grouped by similarity.
 * 
 * @param {string} text - The raw pasted text containing earnings data
 * @returns {Object} Result object with parsed earnings and parsing statistics
 */
export function parseEarningsText(text) {
    if (!text || typeof text !== 'string') {
        return {
            success: false,
            earnings: [],
            errors: ['No text provided']
        };
    }

    // Split text into lines and clean them
    const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    if (lines.length === 0) {
        return {
            success: false,
            earnings: [],
            errors: ['No valid lines found in text']
        };
    }

    const earnings = [];
    const errors = [];
    let currentEntry = [];

    // Group lines into entries
    // An entry typically has 3 lines: node ID, amount, date/status
    // We detect new entries by finding node IDs
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const hasNodeId = extractNodeId(line) !== null;

        // If this line has a node ID and we already have lines in current entry,
        // parse the current entry and start a new one
        if (hasNodeId && currentEntry.length > 0) {
            const earning = parseEarningEntry(currentEntry);
            if (earning) {
                earnings.push(earning);
            } else {
                errors.push(`Failed to parse entry: ${currentEntry.join(' | ')}`);
            }
            currentEntry = [line];
        } else {
            currentEntry.push(line);
        }
    }

    // Don't forget to parse the last entry
    if (currentEntry.length > 0) {
        const earning = parseEarningEntry(currentEntry);
        if (earning) {
            earnings.push(earning);
        } else {
            errors.push(`Failed to parse entry: ${currentEntry.join(' | ')}`);
        }
    }

    return {
        success: earnings.length > 0,
        earnings,
        errors,
        parsedCount: earnings.length,
        errorCount: errors.length
    };
}

/**
 * Validate an earning object to ensure it has all required fields
 * 
 * @param {Object} earning - The earning object to validate
 * @returns {Object} Validation result with isValid flag and error messages
 */
export function validateEarning(earning) {
    const errors = [];

    if (!earning) {
        return { isValid: false, errors: ['Earning object is null or undefined'] };
    }

    if (!earning.nodeId || typeof earning.nodeId !== 'string') {
        errors.push('Node ID is missing or invalid');
    }

    if (earning.amount === undefined || earning.amount === null || typeof earning.amount !== 'number') {
        errors.push('Amount is missing or invalid');
    }

    if (earning.amount < 0) {
        errors.push('Amount cannot be negative');
    }

    if (!earning.date || typeof earning.date !== 'string') {
        errors.push('Date is missing or invalid');
    }

    if (!earning.status || typeof earning.status !== 'string') {
        errors.push('Status is missing or invalid');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Get example text format for user guidance
 * @returns {string} Example text showing the expected format
 */
export function getExampleFormat() {
    return `Example format:

0x01...a278
+ $0.07
completed / 06 Dec 2025

0x01...a278
+ $0.09
completed / 05 Dec 2025

0x02...b123
+ $0.15
completed / 07 Dec 2025

Each entry should include:
- Node ID (e.g., 0x01...a278)
- Amount (e.g., + $0.07)
- Date and status (e.g., completed / 06 Dec 2025)

Entries can be separated by blank lines or consecutive.`;
}
