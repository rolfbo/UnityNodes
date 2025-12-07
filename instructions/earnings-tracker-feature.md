# Unity Nodes Earnings Tracker Feature

## Overview

The Earnings Tracker is a comprehensive feature for tracking actual earnings from Unity Nodes. It allows users to paste earnings data, automatically parse it, manage node mappings, visualize earnings through an interactive dashboard, and export data in various formats.

## Purpose

While the ROI Calculator provides projections and estimates for potential earnings, the Earnings Tracker helps users:
- Track actual earnings from their Unity Nodes
- Compare actual performance vs. projections
- Analyze earnings trends over time
- Categorize earnings by license type
- Export data for reporting or further analysis

## Features

### 1. Data Input & Parsing

**Data Source**: Users can get their earnings data from the Unity Nodes Rewards page at https://manage.unitynodes.io/rewards/allocation by selecting all transactions and copying them.

The intelligent parser automatically extracts:
- **Node IDs**: Identifies node addresses (e.g., 0x01...a278)
- **Amounts**: Extracts dollar amounts (e.g., + $0.07)
- **Dates**: Recognizes multiple date formats
- **Status**: Detects transaction status (completed, pending, failed)

#### Supported Input Format

```
0x01...a278
+ $0.07
completed / 06 Dec 2025

0x01...a278
+ $0.09
completed / 05 Dec 2025

0x02...b123
+ $0.15
completed / 07 Dec 2025
```

The parser is flexible and can handle variations in:
- Whitespace and line breaks
- Date formats (DD Mon YYYY, Mon DD YYYY, YYYY-MM-DD, MM/DD/YYYY)
- Amount formats (with or without +, with or without spaces)
- Status keywords (completed, pending, failed, processing)

### 2. Duplicate Detection

The system detects potential duplicate entries by checking:
- Same node ID
- Same amount (exact match)
- Same date

When pasting multiple entries:
- ALL entries are added (nothing is skipped)
- Potential duplicates are flagged and shown in a warning panel
- User can manually review and delete true duplicates
- Legitimate multiple transactions per day are preserved

This manual approach ensures that legitimate earnings (e.g., multiple transactions with the same amount on the same day) are never incorrectly excluded.

### 3. Node ID to License Type Mapping

Users can map each node ID to its license type:
- Manual input for each node
- Auto-detection from previously mapped nodes
- Persistent storage in browser localStorage
- Automatic update of all earnings when mapping changes

#### Example Mappings
- `0x01...a278` → `ULO`
- `0x02...b123` → `Enterprise`
- `0x03...c456` → `Standard`

### 4. Interactive Dashboard

The dashboard provides comprehensive visualization of earnings data:

#### Key Metrics Cards
- **Total Earnings**: All-time cumulative earnings
- **This Month**: Current month's earnings
- **Average Daily**: Average earnings per active day
- **Active Nodes**: Count of unique node IDs

#### Charts
1. **Cumulative Earnings Over Time**
   - Area chart showing total earnings growth
   - X-axis: Date
   - Y-axis: Cumulative amount ($)

2. **Daily Earnings**
   - Bar chart showing daily earning amounts
   - Helps identify patterns and trends
   - Shows which days were most profitable

3. **Earnings by License Type**
   - Pie chart breakdown by license type
   - Shows distribution of earnings across different licenses
   - Helps identify which license types are most profitable

4. **License Type Breakdown Table**
   - Detailed table view by license type
   - Shows count, total, and average per license type

### 5. Data Table

A comprehensive table view with:

#### Features
- **Sortable columns**: Click headers to sort by date, node ID, license type, or amount
- **Filtering**: 
  - By license type
  - By date range (start and end dates)
  - By search query (node ID, amount)
- **Inline editing**: Edit individual entries directly in the table
- **Delete**: Remove individual entries
- **Summary row**: Shows totals for filtered results

#### Columns
- Date
- Node ID
- License Type
- Amount ($)
- Status
- Actions (Edit, Delete)

### 6. Export Functionality

Export earnings data in multiple formats:

#### JSON Export
- Complete data export including all fields
- Useful for backups or data migration
- Can be re-imported later
- Filename: `unity-earnings-YYYY-MM-DD.json`

#### CSV Export
- Spreadsheet-compatible format
- Columns: Date, Node ID, License Type, Amount, Status
- Can be opened in Excel, Google Sheets, etc.
- Filename: `unity-earnings-YYYY-MM-DD.csv`

#### PDF Report Export
- Professional report format
- Includes summary statistics
- Breakdown by license type
- Generated on-demand
- Filename: `unity-earnings-report-YYYY-MM-DD.pdf`

## Data Storage

### Storage Technology
All data is stored in browser localStorage:
- **Benefits**:
  - No server required
  - Data stays private on user's device
  - Persists across browser sessions
  - Fast access

- **Limitations**:
  - Limited to ~5-10MB (browser dependent)
  - Data is not synced across devices
  - Clearing browser data will delete earnings

### Storage Keys
- `unity-nodes-earnings`: Array of all earnings objects
- `unity-nodes-node-mapping`: Object mapping node IDs to license types

### Data Structure

#### Earning Object
```javascript
{
  id: "earning-1701878400000-abc123def",  // Unique identifier
  nodeId: "0x01...a278",                    // Node address
  licenseType: "ULO",                       // License type (from mapping)
  amount: 0.07,                             // Amount in dollars
  date: "2025-12-06",                       // ISO date format
  status: "completed",                      // Transaction status
  timestamp: 1701878400000                  // Unix timestamp for sorting
}
```

#### Node Mapping Object
```javascript
{
  "0x01...a278": "ULO",
  "0x02...b123": "Enterprise",
  "0x03...c456": "Standard"
}
```

## User Workflow

### First-Time Setup
1. Navigate to "Earnings Tracker" tab
2. Click "Add Earnings"
3. Go to https://manage.unitynodes.io/rewards/allocation and copy your earnings data
4. Paste the data and click "Parse and Add Earnings"
5. Go to "Data Table" tab
6. Map node IDs to license types
7. View dashboard to see visualizations

### Regular Use
1. Go to https://manage.unitynodes.io/rewards/allocation
2. Select and copy new earnings data
3. Navigate to "Add Earnings"
4. Paste data and parse
5. Review any flagged potential duplicates and delete if needed
6. View updated dashboard

### Data Management
1. Use "Data Table" to review all entries
2. Edit incorrect entries inline
3. Delete erroneous entries
4. Export data regularly for backup
5. Use filters to analyze specific time periods or license types

## Technical Implementation

### Components
- **EarningsTrackerApp.jsx**: Main component with three views (Dashboard, Table, Input)
- **earningsStorage.js**: Utility for localStorage operations
- **earningsParser.js**: Intelligent text parsing logic

### Key Functions

#### earningsStorage.js
- `loadEarnings()`: Load all earnings from storage
- `saveEarnings(earnings)`: Save earnings array
- `addEarnings(earnings)`: Add multiple with duplicate check
- `deleteEarning(id)`: Remove specific earning
- `updateEarning(id, updates)`: Modify existing earning
- `getNodeMapping()`: Get node-to-license mapping
- `updateNodeMapping(nodeId, licenseType)`: Update mapping
- `exportToJSON()`: Export as JSON string
- `exportToCSV()`: Export as CSV string
- `getEarningsStats()`: Calculate statistics

#### earningsParser.js
- `parseEarningsText(text)`: Main parsing function
- `extractNodeId(line)`: Find node ID in text
- `extractAmount(line)`: Find dollar amount
- `extractDate(line)`: Find and parse date
- `extractStatus(line)`: Find status keyword
- `validateEarning(earning)`: Ensure data validity

### State Management
- Uses React useState for all state
- No external state management library required
- State updates trigger re-renders automatically
- Computed values use useMemo for performance

### Styling
- Tailwind CSS for all styling
- Matches ROI Calculator design
- Dark theme with purple accents
- Fully responsive design
- Lucide React icons throughout

## Best Practices

### Data Entry
- Paste data regularly to avoid losing track
- Review parsed data before confirming
- Map node IDs to license types as soon as possible
- Check for and resolve parsing errors

### Data Management
- Export data monthly for backup
- Verify totals match expected amounts
- Use filters to audit specific time periods
- Delete test entries to keep data clean

### Performance
- System handles thousands of entries efficiently
- Filtering and sorting are client-side (instant)
- Charts update automatically when data changes
- No network requests required

## Troubleshooting

### Parsing Issues

**Problem**: Parser doesn't recognize data
- **Solution**: Check format matches example
- Ensure each entry has node ID, amount, and date
- Try pasting smaller chunks

**Problem**: Dates are wrong
- **Solution**: Use consistent date format
- Supported: "DD Mon YYYY", "YYYY-MM-DD", etc.
- Avoid ambiguous formats like "12/06/25"

### Storage Issues

**Problem**: Data not persisting
- **Solution**: Check browser's localStorage is enabled
- Verify not in incognito/private mode
- Check browser storage isn't full

**Problem**: Same earnings appear multiple times
- **Solution**: System flags potential duplicates (same node ID, amount, and date)
- Check the duplicate warning panel after parsing
- Review and manually delete confirmed duplicates
- Note: Multiple legitimate transactions with same amount on same day are allowed

### Display Issues

**Problem**: Charts not showing
- **Solution**: Ensure there are earnings entries
- Check browser console for errors
- Try clearing filters

**Problem**: Node mapping not updating
- **Solution**: Type license type and press Enter or Tab
- Changes save automatically
- Reload page to verify persistence

## Future Enhancements

Potential features for future development:
- Import/export earnings between devices
- Cloud sync option
- Comparison with ROI projections
- Email/notification of new earnings
- Mobile app version
- Multi-currency support
- Tax reporting features
- Integration with Unity Nodes API

## Support

For issues or questions:
1. Check this documentation
2. Review example format
3. Try with sample data first
4. Check browser console for errors
5. Clear localStorage and start fresh if needed

## Version History

### v1.0 (December 2025)
- Initial release
- Basic parsing and storage
- Dashboard with charts
- Export to JSON, CSV, PDF
- Node mapping management
- Filtering and sorting
- Duplicate detection
