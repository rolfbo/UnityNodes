# Backup & Restore Feature Documentation

## Overview

The Unity Nodes Earnings Tracker now includes comprehensive backup and restore functionality to help you keep your earnings data safe and portable across devices.

## What's New

### 1. Enhanced Data Persistence
- **JSON Import/Export** - Full backup with all data and settings
- **CSV Import/Export** - Spreadsheet-compatible format
- **Markdown Export** - Beautiful reports for documentation
- **Auto-Backup** - Automatic backups based on your preferences
- **Smart Validation** - Prevents data corruption during imports

### 2. User-Friendly Backup System
- **One-Click Backup** - Create a complete backup instantly
- **Drag & Drop Restore** - Import backups with ease
- **Duplicate Detection** - Automatically skips duplicate entries
- **Clear Feedback** - Always know what's happening with your data

## Key Features

### 📦 Backup Your Data

**Full Backup (JSON)**
- Contains all earnings data
- Includes node mappings
- Preserves all metadata
- Perfect for complete backups

**CSV Export**
- Compatible with Excel/Google Sheets
- Easy to view and analyze
- Great for sharing with others
- Note: Some metadata may be lost

**Markdown Export**
- Beautiful formatted reports
- Summary statistics included
- Perfect for documentation
- Easy to share on GitHub, Notion, etc.

### 🔄 Restore Your Data

**JSON Import**
- Full data restoration
- Validation before import
- Duplicate detection
- Merge or replace options

**CSV Import**
- Automatic column detection
- Row-by-row validation
- Clear error messages
- Preview before importing

### ⚡ Auto-Backup

Never lose your data with automatic backups!

**Frequency Options:**
- After every 10 changes
- After every 25 changes
- After every 50 changes
- Once per day
- Once per week
- Manual only

**What Counts as a Change:**
- Adding new earnings
- Editing existing earnings
- Deleting earnings
- Importing data

**Visual Indicators:**
- Real-time change counter
- "Next backup in X changes" display
- Success notifications when backup occurs
- Total backup count

## How to Use

### Creating a Backup

1. Go to the **Dashboard** tab
2. Scroll to the **Backup & Restore** section
3. Click **"Create Backup (JSON)"**
4. File downloads automatically with date in filename
5. Save it somewhere safe!

**Filename Format:** `unity-earnings-backup-2025-12-11.json`

### Restoring from Backup

1. Go to the **Dashboard** tab
2. Find the **Backup & Restore** section
3. Click **"Import JSON or CSV"**
4. Select your backup file
5. Review the import result
6. Your data is restored!

**What Happens:**
- ✅ Validates the file before importing
- ✅ Checks for duplicates
- ✅ Shows preview of what will be imported
- ✅ Gives clear success/error messages

### Enabling Auto-Backup

1. Go to **Dashboard** → **Backup & Restore**
2. Click **"Settings"** to expand options
3. Toggle **"Enable Auto-Backup"** to ON
4. Choose your preferred **Backup Frequency**
5. That's it! Backups happen automatically

**Auto-Backup Status:**
- Blue panel shows when enabled
- Displays current change count
- Shows time until next backup
- Notifies you when backup occurs

### Exporting for Analysis

**Export as CSV for Spreadsheets:**
1. Use the existing **"Export CSV"** button
2. Open in Excel, Google Sheets, or Numbers
3. Analyze, sort, filter your data
4. Can be imported back later

**Export as Markdown for Reports:**
1. Click **"Export Markdown"** button
2. Beautiful formatted report downloads
3. Open in any text editor or markdown viewer
4. Perfect for sharing summaries

## Understanding Import Results

When you import a file, you'll see a result panel with:

### ✅ Success Message
- "Imported X earnings, skipped Y duplicates"
- Shows how many were added
- Shows how many were skipped (if any)

### ⚠️ Warnings (Yellow)
- Non-critical issues found
- Data was imported but check these items
- Example: "Amount is zero"

### ❌ Errors (Red)
- Critical issues prevented import
- Data was NOT imported
- Clear explanation of what's wrong
- Lists specific problems found

## Data Validation

The system validates all imported data to prevent corruption:

### Required Fields
- **Node ID** - Must be present and valid format
- **Amount** - Must be a positive number
- **Date** - Must be valid date in YYYY-MM-DD format

### Optional Fields
- **Status** - Defaults to "completed" if missing
- **License Type** - Defaults to "Unknown" if missing
- **ID** - Generated automatically if missing

### Validation Checks
- ✅ No negative amounts
- ✅ Valid date formats
- ✅ Proper data types
- ✅ No corrupted entries
- ✅ Duplicate detection

## Best Practices

### 🎯 Regular Backups
- Enable auto-backup for peace of mind
- Create manual backups before major changes
- Keep multiple backup versions

### 📁 Backup Storage
- Store backups in cloud storage (Google Drive, Dropbox, etc.)
- Keep local copies on your computer
- Email yourself important backups

### 🔄 Before Browser Maintenance
- Create backup before clearing browser data
- Create backup before switching browsers
- Create backup before system updates

### 📊 Data Analysis
- Export CSV for detailed analysis
- Use spreadsheet pivot tables
- Share CSV with accountants/tax advisors

### 📝 Documentation
- Export Markdown for status reports
- Share reports with team members
- Keep historical records

## Transferring Data Between Devices

**From Device A:**
1. Create a backup (JSON)
2. Send file to yourself (email, cloud, USB, etc.)

**To Device B:**
1. Open Unity Nodes Earnings Tracker
2. Import the JSON file
3. All data is now on Device B!

**Note:** Data is stored locally in each browser, so transfers must be done manually.

## Troubleshooting

### Import Failed - Invalid Format
- **Problem:** File is not valid JSON or CSV
- **Solution:** Make sure file hasn't been edited incorrectly
- **Tip:** Try exporting again from source

### Import Failed - Missing Columns
- **Problem:** CSV doesn't have required columns
- **Solution:** Ensure CSV has Date, Node ID, and Amount columns
- **Tip:** Check the header row

### Duplicate Entries After Import
- **Problem:** Same data imported twice
- **Solution:** Import skips duplicates by default
- **Tip:** Check the import result message

### Auto-Backup Not Triggering
- **Problem:** Enabled but no backups happening
- **Solution:** Check that you're making changes (adding/editing data)
- **Tip:** Verify frequency setting matches your expectations

### Can't Find Downloaded Backup
- **Problem:** File downloaded but can't find it
- **Solution:** Check your browser's Downloads folder
- **Tip:** Look for filename starting with "unity-earnings-backup"

### Import Says Zero Duplicates But I Have Data
- **Problem:** Confused about duplicate detection
- **Explanation:** Duplicates are only when exact same entry exists (same node ID, amount, and date)
- **Tip:** Different dates or amounts are not considered duplicates

## Technical Details

### Data Storage
- Primary storage: Browser localStorage
- Backup format: JSON (JavaScript Object Notation)
- Alternative format: CSV (Comma-Separated Values)
- Settings storage: localStorage

### File Formats

**JSON Structure:**
```json
[
  {
    "id": "earning-1234567890-abc123",
    "nodeId": "0x01...a278",
    "licenseType": "ULO",
    "amount": 0.07,
    "date": "2025-12-06",
    "status": "completed",
    "timestamp": 1733529600000
  }
]
```

**CSV Structure:**
```csv
Date,Node ID,License Type,Amount ($),Status
2025-12-06,0x01...a278,ULO,0.07,completed
```

### Browser Compatibility
- Works in all modern browsers
- Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled
- Requires localStorage access

### Storage Limits
- localStorage typically: 5-10 MB per domain
- JSON is very efficient
- Can store thousands of earnings
- Large datasets: Consider periodic cleanup

## Privacy & Security

### Your Data is Private
- ✅ All data stored locally in YOUR browser
- ✅ No data sent to any server
- ✅ No tracking or analytics
- ✅ You control all backups

### Recommendations
- Keep backups in secure locations
- Don't share backup files publicly
- Node IDs may contain sensitive information
- Use encrypted cloud storage for sensitive data

## Feature Roadmap

### Possible Future Enhancements
- Cloud sync (optional)
- Encrypted backups
- Scheduled auto-backups
- Backup to cloud directly
- Version history
- Backup compression
- Email backup reminders

## Support

### Need Help?
1. Read this documentation thoroughly
2. Check the Testing Guide for examples
3. Review browser console for errors
4. Check that JavaScript is enabled

### Reporting Issues
If you encounter bugs:
- Document steps to reproduce
- Note browser and version
- Check console for error messages
- Save problematic backup file for analysis

## Summary

The new Backup & Restore system provides:
- ✅ **Safety** - Never lose your earnings data
- ✅ **Portability** - Move data between devices easily
- ✅ **Flexibility** - Multiple formats for different uses
- ✅ **Automation** - Set it and forget it with auto-backup
- ✅ **Reliability** - Validation prevents data corruption
- ✅ **Simplicity** - One-click backups and restores

**Start protecting your data today by enabling auto-backup!**
