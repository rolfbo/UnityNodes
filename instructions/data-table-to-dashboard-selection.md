# Data Table to Dashboard Selection Feature

## Overview

This feature allows users to select specific earnings from the **Data Table** tab and use that selection to filter the **Dashboard** view. This enables focused analysis of specific subsets of earnings data.

## Purpose

The selection feature helps users:
- Analyze specific time periods or transactions
- Compare different subsets of earnings
- Focus on particular nodes or license types
- Create custom reports for specific data sets
- Investigate anomalies or patterns in selected data

## How It Works

### Step 1: Select Data in Data Table

1. Navigate to the **Data Table** tab
2. Use the checkboxes in the leftmost column to select earnings:
   - **Individual Selection**: Click any checkbox to select/deselect that earning
   - **Select All**: Click "Select All" button to select all currently filtered earnings
   - **Clear Selection**: Click "Clear Selection" button to deselect all

### Step 2: Apply Selection to Dashboard

1. After selecting one or more earnings, click the **"Use in Dashboard"** button
2. The app automatically switches to the **Dashboard** tab
3. All dashboard metrics and charts now reflect only the selected data

### Step 3: View Filtered Dashboard

The Dashboard will display:
- A blue banner at the top indicating the filter is active
- Number of selected earnings being displayed
- All metrics recalculated for selected data only:
  - Total Earnings
  - This Month (filtered)
  - Average Daily (filtered)
  - Active Nodes (filtered)
- All charts showing only selected data:
  - Cumulative Earnings Over Time
  - Daily Earnings
  - Earnings by License Type
  - License Type Breakdown

### Step 4: Clear Dashboard Filter

To return to viewing all earnings:
1. Click the **"Clear Filter"** button in the blue banner, OR
2. Return to Data Table and click "Clear Selection", OR
3. Select different earnings and apply them to the dashboard

## User Interface Elements

### Data Table Components

#### Selection Checkbox Column
- Located as the first column in the table
- Header checkbox: Selects/deselects all filtered earnings
- Row checkboxes: Select/deselect individual earnings

#### Selection Controls Bar
Located below the table header, shows:
- **Selection Counter**: Displays "X selected" where X is the number of selected earnings
- **Select All Button**: Selects all currently filtered/visible earnings
- **Clear Selection Button**: Deselects all selected earnings (appears when selections exist)
- **Use in Dashboard Button**: Applies selection to dashboard and switches to Dashboard tab (appears when selections exist)

### Dashboard Components

#### Filter Status Banner
When dashboard is filtered by selection:
- **Blue banner** appears at the top of the dashboard
- Shows filter is active
- Displays count of selected earnings
- Contains **"Clear Filter"** button to remove filter

#### Metrics Cards
All metrics automatically update to reflect selected data:
- **Total Earnings**: Sum of selected earnings
- **This Month**: Selected earnings from current month only
- **Average Daily**: Average per day (based on unique dates in selection)
- **Active Nodes**: Count of unique node IDs in selection

#### Charts
All charts recalculate to show selected data:
- **Cumulative Earnings**: Shows growth over time for selected earnings
- **Daily Earnings**: Bar chart of selected earnings by date
- **Earnings by License Type**: Pie chart distribution of selected earnings
- **License Type Breakdown**: Table showing selected earnings by license type

## Use Cases

### Analyze Specific Time Period
1. Go to Data Table
2. Filter by date range (use date filters)
3. Click "Select All" to select all earnings in that period
4. Click "Use in Dashboard" to analyze that period

### Compare Specific Nodes
1. Go to Data Table
2. Use search to find specific node IDs
3. Select the relevant earnings
4. Apply to dashboard to see performance metrics

### Investigate High-Earning Days
1. Sort by amount in Data Table
2. Select the top earning entries
3. View in Dashboard to identify patterns

### Create Custom Reports
1. Use filters and search to find specific criteria
2. Select relevant earnings
3. View dashboard with those earnings
4. Export data using Export buttons (PDF, CSV, JSON)

### Analyze by License Type
1. Filter by specific license type in Data Table
2. Select all of that type
3. View detailed breakdown in Dashboard

## Technical Implementation

### State Management

#### Selection State
```javascript
const [selectedEarningIds, setSelectedEarningIds] = useState(new Set());
```
- Stores Set of earning IDs that are currently selected
- Uses Set for O(1) lookup performance
- Persists across tab switches (until cleared)

#### Dashboard Filter State
```javascript
const [useDashboardSelection, setUseDashboardSelection] = useState(false);
```
- Boolean flag indicating if dashboard should use selection
- When `true`, dashboard calculations use selected data
- When `false`, dashboard shows all earnings

### Key Functions

#### Selection Management
- **handleToggleSelection(earningId)**: Toggle individual earning selection
- **handleSelectAll()**: Select all filtered earnings in current view
- **handleClearSelection()**: Clear all selections
- **handleApplySelectionToDashboard()**: Enable dashboard filter and switch to dashboard tab
- **handleClearDashboardFilter()**: Disable dashboard filter (show all data)

#### Data Filtering
- **dashboardEarnings**: Computed property that returns either selected earnings or all earnings
- **stats**: Recalculated based on dashboardEarnings
- **chartData**: Regenerated using dashboardEarnings
- **thisMonthEarnings**: Filtered from dashboardEarnings
- **avgDailyEarnings**: Calculated from dashboardEarnings

### Data Flow

1. User selects checkboxes → Updates `selectedEarningIds` Set
2. User clicks "Use in Dashboard" → Sets `useDashboardSelection = true` and switches to dashboard
3. Dashboard renders → Uses `dashboardEarnings` computed property
4. `dashboardEarnings` checks `useDashboardSelection` flag:
   - If `true`: Filter earnings to only selected IDs
   - If `false`: Return all earnings
5. All calculations (stats, charts, metrics) use `dashboardEarnings`
6. User clicks "Clear Filter" → Sets `useDashboardSelection = false`

## Features and Benefits

### Flexibility
- Select any combination of earnings
- Works with filters (date range, license type, search)
- Maintains selection when switching between tabs

### Visual Feedback
- Selected count always visible
- Clear visual indicator when dashboard is filtered
- Easy one-click clear functionality

### Performance
- Efficient Set-based selection storage
- Optimized React useMemo for recalculations
- Instant updates when selection changes

### Integration
- Works seamlessly with existing filters
- Compatible with sorting and searching
- Integrates with export functionality

## Best Practices

### Data Selection
- Use filters first to narrow down data before selecting
- "Select All" respects current filters (selects visible data only)
- Clear selections when done to avoid confusion

### Analysis Workflow
1. Start with Data Table to find relevant data
2. Use filters and search to narrow down
3. Select specific entries or use "Select All"
4. Apply to Dashboard for visualization
5. Export if needed for further analysis
6. Clear filter when done

### Multiple Selections
- You can modify selection and reapply to dashboard
- Selection persists when switching tabs
- Clear selection before starting new analysis

## Troubleshooting

### Selection Not Showing in Dashboard

**Problem**: Selected earnings but dashboard shows all data

**Solution**: 
- Ensure you clicked "Use in Dashboard" button
- Check that the blue filter banner appears at top of dashboard
- Verify selectedEarningIds.size > 0

### Can't Clear Selection

**Problem**: Unable to deselect earnings

**Solution**:
- Click "Clear Selection" button in Data Table
- Or click "Clear Filter" in Dashboard (also clears selection)
- Or click header checkbox twice (select all, then deselect all)

### Dashboard Showing Wrong Data

**Problem**: Dashboard metrics don't match expectations

**Solution**:
- Check if filter banner is visible (filtered view active)
- Verify which earnings are selected in Data Table
- Clear filter to see all data
- Reselect and reapply to dashboard

### Selection Lost

**Problem**: Selection disappeared

**Solution**:
- Selections are cleared when you click "Clear Selection" or "Clear Filter"
- Check if useDashboardSelection flag is still true
- Re-select data in Data Table

## Future Enhancements

Potential additions to this feature:
- Save named selections for later use
- Compare multiple selections side-by-side
- Export selection criteria
- Keyboard shortcuts for selection (Ctrl+A, etc.)
- Inverse selection (select all except)
- Selection history/undo
- Share selections between sessions (localStorage)

## Version Information

**Version**: 1.1 (December 2025)
**Previous Version**: 1.0 - Basic earnings tracking without selection feature
**Current Version**: 1.1 - Added Data Table to Dashboard selection filtering

## Summary

The Data Table to Dashboard selection feature provides powerful data analysis capabilities by allowing users to:
1. **Select** specific earnings using checkboxes
2. **Filter** the dashboard to show only selected data
3. **Analyze** focused subsets with all dashboard metrics and charts
4. **Export** selected data for reporting
5. **Clear** filters easily to return to full view

This feature transforms the Earnings Tracker from a simple viewer into a powerful analytical tool for understanding Unity Nodes earnings patterns and performance.
