/**
 * Test Suite for Earnings Tracker
 * 
 * This file contains tests to verify the earnings parser and storage functionality.
 * Run these tests to ensure the system works correctly with various data formats.
 * 
 * To run tests:
 * 1. Import this file in browser console
 * 2. Call runTests() function
 * 3. Check console for results
 */

import { parseEarningsText, validateEarning } from './earningsParser.js';
import {
    addEarnings,
    isDuplicate,
    loadEarnings,
    clearAllEarnings,
    getEarningsStats
} from './earningsStorage.js';

/**
 * Sample earnings data for testing
 */
const SAMPLE_DATA = `0x01...a278
+ $0.07
completed / 06 Dec 2025

0x01...a278
+ $0.09
completed / 05 Dec 2025

0x02...b123
+ $0.15
completed / 07 Dec 2025

0x03...c456
+ $0.12
completed / 04 Dec 2025`;

/**
 * Duplicate sample data (same as first entry in SAMPLE_DATA)
 */
const DUPLICATE_DATA = `0x01...a278
+ $0.07
completed / 06 Dec 2025`;

/**
 * Invalid data for testing error handling
 */
const INVALID_DATA = `This is not valid data
No node ID or amount here
Just some random text`;

/**
 * Various date formats to test parsing flexibility
 */
const VARIOUS_DATE_FORMATS = `0x04...d789
+ $0.20
completed / 08 Dec 2025

0x04...d789
+ $0.25
completed / December 9, 2025

0x04...d789
+ $0.30
completed / 2025-12-10

0x04...d789
+ $0.35
completed / 12/11/2025`;

/**
 * Test Results Collector
 */
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

/**
 * Helper function to run a test
 */
function test(name, testFn) {
    try {
        testFn();
        testResults.passed++;
        testResults.tests.push({ name, status: 'PASS' });
        console.log(`✓ ${name}`);
    } catch (error) {
        testResults.failed++;
        testResults.tests.push({ name, status: 'FAIL', error: error.message });
        console.error(`✗ ${name}:`, error.message);
    }
}

/**
 * Helper function for assertions
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

/**
 * Test 1: Parse valid earnings data
 */
function testParseValidData() {
    const result = parseEarningsText(SAMPLE_DATA);

    assert(result.success, 'Parse should succeed');
    assert(result.earnings.length === 4, `Expected 4 earnings, got ${result.earnings.length}`);
    assert(result.errors.length === 0, `Expected no errors, got ${result.errors.length}`);

    // Check first earning
    const first = result.earnings[0];
    assert(first.nodeId === '0x01...a278', `Expected node ID '0x01...a278', got '${first.nodeId}'`);
    assert(first.amount === 0.07, `Expected amount 0.07, got ${first.amount}`);
    assert(first.date === '2025-12-06', `Expected date '2025-12-06', got '${first.date}'`);
    assert(first.status === 'completed', `Expected status 'completed', got '${first.status}'`);
}

/**
 * Test 2: Detect duplicates
 */
function testDuplicateDetection() {
    // Clear any existing data
    clearAllEarnings();

    // Parse and add initial data
    const result1 = parseEarningsText(SAMPLE_DATA);
    const addResult1 = addEarnings(result1.earnings);

    assert(addResult1.addedCount === 4, `Expected 4 added, got ${addResult1.addedCount}`);
    assert(addResult1.skippedCount === 0, `Expected 0 skipped, got ${addResult1.skippedCount}`);

    // Try to add duplicate
    const result2 = parseEarningsText(DUPLICATE_DATA);
    const addResult2 = addEarnings(result2.earnings);

    assert(addResult2.addedCount === 0, `Expected 0 added, got ${addResult2.addedCount}`);
    assert(addResult2.skippedCount === 1, `Expected 1 skipped, got ${addResult2.skippedCount}`);

    // Verify total count is still 4
    const allEarnings = loadEarnings();
    assert(allEarnings.length === 4, `Expected 4 total earnings, got ${allEarnings.length}`);
}

/**
 * Test 3: Handle invalid data gracefully
 */
function testInvalidData() {
    const result = parseEarningsText(INVALID_DATA);

    assert(!result.success || result.earnings.length === 0, 'Should not successfully parse invalid data');
}

/**
 * Test 4: Parse various date formats
 */
function testVariousDateFormats() {
    const result = parseEarningsText(VARIOUS_DATE_FORMATS);

    assert(result.success, 'Should successfully parse various date formats');
    assert(result.earnings.length === 4, `Expected 4 earnings, got ${result.earnings.length}`);

    // All should have valid dates
    result.earnings.forEach((earning, i) => {
        assert(earning.date, `Earning ${i} should have a date`);
        assert(/\d{4}-\d{2}-\d{2}/.test(earning.date), `Earning ${i} date should be in ISO format`);
    });
}

/**
 * Test 5: Validate earning objects
 */
function testEarningValidation() {
    const validEarning = {
        id: 'test-123',
        nodeId: '0x01...a278',
        licenseType: 'ULO',
        amount: 0.07,
        date: '2025-12-06',
        status: 'completed',
        timestamp: Date.now()
    };

    const validResult = validateEarning(validEarning);
    assert(validResult.isValid, 'Valid earning should pass validation');

    const invalidEarning = {
        id: 'test-456',
        // Missing required fields
        amount: -5 // Negative amount
    };

    const invalidResult = validateEarning(invalidEarning);
    assert(!invalidResult.isValid, 'Invalid earning should fail validation');
    assert(invalidResult.errors.length > 0, 'Should have validation errors');
}

/**
 * Test 6: Calculate statistics correctly
 */
function testStatistics() {
    // Clear and add fresh data
    clearAllEarnings();
    const result = parseEarningsText(SAMPLE_DATA);
    addEarnings(result.earnings);

    const stats = getEarningsStats();

    assert(stats.count === 4, `Expected 4 earnings, got ${stats.count}`);
    assert(stats.total === 0.43, `Expected total 0.43, got ${stats.total}`);
    assert(stats.average > 0, `Expected positive average, got ${stats.average}`);
    assert(stats.uniqueNodes >= 1, `Expected at least 1 unique node, got ${stats.uniqueNodes}`);
}

/**
 * Test 7: isDuplicate function
 */
function testIsDuplicateFunction() {
    const earning1 = {
        nodeId: '0x01...a278',
        amount: 0.07,
        date: '2025-12-06'
    };

    const earning2 = {
        nodeId: '0x01...a278',
        amount: 0.07,
        date: '2025-12-06'
    };

    const earning3 = {
        nodeId: '0x01...a278',
        amount: 0.08, // Different amount
        date: '2025-12-06'
    };

    const existingEarnings = [earning1];

    assert(isDuplicate(earning2, existingEarnings), 'Should detect duplicate');
    assert(!isDuplicate(earning3, existingEarnings), 'Should not detect non-duplicate');
}

/**
 * Test 8: Handle empty input
 */
function testEmptyInput() {
    const result1 = parseEarningsText('');
    assert(!result1.success, 'Empty string should not succeed');

    const result2 = parseEarningsText('   \n\n   ');
    assert(!result2.success, 'Whitespace only should not succeed');
}

/**
 * Main test runner
 */
export function runTests() {
    console.log('🧪 Running Earnings Tracker Tests...\n');

    // Reset test results
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.tests = [];

    // Run all tests
    test('Parse valid earnings data', testParseValidData);
    test('Detect duplicate entries', testDuplicateDetection);
    test('Handle invalid data gracefully', testInvalidData);
    test('Parse various date formats', testVariousDateFormats);
    test('Validate earning objects', testEarningValidation);
    test('Calculate statistics correctly', testStatistics);
    test('isDuplicate function works', testIsDuplicateFunction);
    test('Handle empty input', testEmptyInput);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log(`Test Results: ${testResults.passed} passed, ${testResults.failed} failed`);
    console.log('='.repeat(50));

    if (testResults.failed === 0) {
        console.log('✅ All tests passed!');
    } else {
        console.log('❌ Some tests failed. Check details above.');
    }

    // Clean up test data
    clearAllEarnings();

    return testResults;
}

// Export sample data for manual testing
export const testData = {
    SAMPLE_DATA,
    DUPLICATE_DATA,
    INVALID_DATA,
    VARIOUS_DATE_FORMATS
};
