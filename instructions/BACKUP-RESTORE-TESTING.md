# Backup & Restore Feature - Testing Guide

This document provides comprehensive testing instructions for the new Backup & Restore functionality in the Unity Nodes Earnings Tracker.

## Overview of New Features

### 1. **Enhanced Data Persistence**
- ✅ JSON import with validation and merge strategies
- ✅ CSV import with column detection and validation
- ✅ Markdown export for reports and documentation
- ✅ Auto-backup functionality with configurable frequency
- ✅ Comprehensive validation utilities

### 2. **User Interface Additions**
- New "Backup & Restore" panel in Dashboard tab
- Auto-backup status indicators
- Import result notifications
- Auto-backup settings (collapsible)
- Visual feedback for all operations

## Test Plan

### Test 1: JSON Export/Import Round-Trip

**Purpose:** Verify that data exported as JSON can be imported back without loss.

**Steps:**
1. Add some sample earnings data (at least 10 entries)
2. Map some node IDs to license types
3. Go to Dashboard tab
4. Click "Create Backup (JSON)"
5. Verify the download completes
6. Clear all earnings data
7. Click "Import JSON or CSV" and select the downloaded file
8. Verify all data is restored correctly
9. Check that node mappings are preserved

**Expected Result:**
- All earnings should be restored exactly as they were
- Node mappings should be intact
- No errors should appear
- Success notification should display

### Test 2: CSV Export/Import Round-Trip

**Purpose:** Verify CSV export and import functionality.

**Steps:**
1. Add sample earnings data (10-20 entries)
2. Export as CSV (use existing export button)
3. Clear some data
4. Import the CSV file
5. Verify data is restored

**Expected Result:**
- CSV should contain all earnings in readable format
- Import should successfully parse CSV columns
- Data should be restored (note: new IDs may be generated)
- Duplicates should be detected if data wasn't cleared

### Test 3: Duplicate Detection

**Purpose:** Verify that duplicate detection works correctly.

**Steps:**
1. Add 5 earnings entries
2. Export as JSON
3. Import the same JSON file without clearing data
4. Check the import result notification

**Expected Result:**
- Import should report "skipped 5 duplicates"
- No duplicate entries should be added
- Original data should remain unchanged

### Test 4: Auto-Backup Functionality

**Purpose:** Test automatic backup triggers.

**Steps:**
1. Go to Dashboard → Backup & Restore section
2. Click "Settings" to expand settings
3. Enable Auto-Backup
4. Set frequency to "After every 10 changes"
5. Add 10 new earnings entries one by one
6. Verify auto-backup triggers after the 10th entry

**Expected Result:**
- Backup counter should increment with each addition
- After 10 changes, automatic backup should trigger
- Success notification should appear
- Backup file should download automatically
- Counter should reset to 0

### Test 5: Auto-Backup Frequency Options

**Purpose:** Test different backup frequency settings.

**Test Cases:**
- **Every 10 changes:** Add 10 entries, verify backup triggers
- **Every 25 changes:** Add 25 entries, verify backup triggers
- **Every 50 changes:** Add 50 entries, verify backup triggers
- **Manual only:** Add entries, verify no auto-backup occurs
- **Daily/Weekly:** Enable and verify status message updates

### Test 6: Validation - Invalid JSON

**Purpose:** Test error handling for invalid JSON files.

**Steps:**
1. Create a text file with invalid JSON content:
   ```
   This is not valid JSON {{{
   ```
2. Save as `invalid.json`
3. Try to import it
4. Verify error message appears

**Expected Result:**
- Import should fail gracefully
- Clear error message should explain the problem
- App should remain functional

### Test 7: Validation - Invalid CSV

**Purpose:** Test error handling for invalid CSV files.

**Steps:**
1. Create a CSV with wrong columns:
   ```
   Name,Age,City
   John,25,NYC
   ```
2. Try to import it
3. Verify error message

**Expected Result:**
- Import should fail with message about missing required columns
- Expected columns should be listed in error
- No data should be corrupted

### Test 8: Validation - Malformed Data

**Purpose:** Test validation of individual earning entries.

**Steps:**
1. Create a JSON file with invalid entries:
   ```json
   [
     {
       "nodeId": "0x123...abc",
       "amount": -5.00,
       "date": "invalid-date"
     },
     {
       "nodeId": "0x456...def",
       "amount": 1.23,
       "date": "2025-12-11"
     }
   ]
   ```
2. Try to import it

**Expected Result:**
- Validation should catch the negative amount
- Validation should catch the invalid date
- Error messages should clearly explain issues
- Valid entry might be imported (if partial import is supported)

### Test 9: Large Dataset

**Purpose:** Test performance with large datasets.

**Steps:**
1. Import or create a large dataset (500+ entries)
2. Export as JSON
3. Clear data
4. Import the JSON file
5. Monitor performance

**Expected Result:**
- Export should complete in < 2 seconds
- Import should complete in < 5 seconds
- UI should remain responsive
- All data should be accurately imported

### Test 10: Markdown Export

**Purpose:** Test markdown export functionality.

**Steps:**
1. Add sample data with multiple license types
2. Go to Dashboard
3. Click "Export Markdown"
4. Open the downloaded .md file in a text editor

**Expected Result:**
- File should be valid markdown
- Should include summary statistics
- Should have properly formatted tables
- License type breakdown should be included
- Recent transactions should be listed

### Test 11: Empty State Handling

**Purpose:** Test behavior with no data.

**Steps:**
1. Clear all earnings data
2. Try to create a backup
3. Try to export CSV
4. Try to export Markdown

**Expected Result:**
- Backup should work (creates empty array JSON)
- CSV export should show "No data to export"
- Markdown export should show "No earnings data available"
- No errors should occur

### Test 12: Import Preview (if implemented)

**Purpose:** Verify import preview functionality.

**Steps:**
1. Create a JSON backup with 20 entries
2. Import it
3. Check if preview information is shown

**Expected Result:**
- Preview should show total count
- Preview should show date range
- Preview should show unique nodes count
- User should see summary before confirming

### Test 13: Change Tracking

**Purpose:** Verify that changes are tracked correctly for auto-backup.

**Test Scenarios:**
- Add new earning → counter should increment
- Edit existing earning → counter should increment
- Delete earning → counter should increment
- Import data → counter should increment by number imported

**Expected Result:**
- All data modifications should be tracked
- Counter display should update in real-time
- Auto-backup should trigger at threshold

### Test 14: Settings Persistence

**Purpose:** Verify auto-backup settings persist across sessions.

**Steps:**
1. Enable auto-backup
2. Set frequency to "Every 25 changes"
3. Reload the page
4. Check if settings are still enabled

**Expected Result:**
- Settings should persist in localStorage
- Frequency should be preserved
- Change counter should be preserved
- Last backup timestamp should be preserved

### Test 15: Mixed Import Formats

**Purpose:** Test importing different file formats in sequence.

**Steps:**
1. Export as JSON
2. Export as CSV
3. Clear all data
4. Import JSON
5. Import CSV (should detect duplicates)

**Expected Result:**
- Both imports should work
- Duplicates should be detected on second import
- No data corruption should occur

## Edge Cases to Test

### Edge Case 1: Very Large Node IDs
- Test with full-length node IDs (not shortened)
- Verify they display and import correctly

### Edge Case 2: Special Characters in License Types
- Use license types like "ULO/Premium" or "Test-Node"
- Verify they export/import correctly

### Edge Case 3: Very Small Amounts
- Test with amounts like $0.01 or $0.001
- Verify precision is maintained

### Edge Case 4: Date Edge Cases
- Test with dates far in past (2020-01-01)
- Test with dates far in future (2030-12-31)
- Verify sorting and filtering still work

### Edge Case 5: Browser Storage Limits
- Test with very large datasets (2000+ entries)
- Verify localStorage doesn't overflow
- Check for graceful error handling

## Manual Testing Checklist

Use this checklist when testing:

- [ ] Test 1: JSON Round-Trip
- [ ] Test 2: CSV Round-Trip
- [ ] Test 3: Duplicate Detection
- [ ] Test 4: Auto-Backup Basic
- [ ] Test 5: Auto-Backup Frequencies
- [ ] Test 6: Invalid JSON
- [ ] Test 7: Invalid CSV
- [ ] Test 8: Malformed Data
- [ ] Test 9: Large Dataset
- [ ] Test 10: Markdown Export
- [ ] Test 11: Empty States
- [ ] Test 12: Import Preview
- [ ] Test 13: Change Tracking
- [ ] Test 14: Settings Persistence
- [ ] Test 15: Mixed Formats
- [ ] Edge Case 1: Large Node IDs
- [ ] Edge Case 2: Special Characters
- [ ] Edge Case 3: Small Amounts
- [ ] Edge Case 4: Date Ranges
- [ ] Edge Case 5: Storage Limits

## Automated Testing Recommendations

For future development, consider adding automated tests for:

1. **Unit Tests**
   - `importValidator.js` functions
   - `autoBackup.js` functions
   - CSV parsing logic
   - Date validation

2. **Integration Tests**
   - Full export/import cycles
   - Auto-backup triggers
   - State management

3. **E2E Tests**
   - User workflow scenarios
   - Cross-browser compatibility
   - Performance benchmarks

## Known Limitations

1. **localStorage Limits:** Browser localStorage is typically limited to 5-10MB. Very large datasets may hit this limit.

2. **CSV Format:** CSV import may lose some metadata (like original IDs) compared to JSON.

3. **No Cloud Sync:** All data is local to the device. Users must manually transfer backup files between devices.

4. **No Versioning:** Importing a backup completely replaces or merges with existing data. No built-in version control.

## Bug Reporting

If you find issues during testing, please document:
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Browser and version**
- **Console errors** (if any)
- **Sample data** that caused the issue (if applicable)

## Success Criteria

The implementation is successful if:
- ✅ All 15 tests pass without errors
- ✅ Data integrity is maintained through export/import cycles
- ✅ User-friendly error messages appear for all failure cases
- ✅ Auto-backup triggers reliably
- ✅ Performance is acceptable (< 5 seconds for operations)
- ✅ UI remains responsive during all operations
- ✅ No data loss or corruption occurs
