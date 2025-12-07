# Quick Start: Data Table to Dashboard Selection

## 🎯 What Does This Feature Do?

Select specific earnings from the Data Table and analyze them separately in the Dashboard!

## ⚡ Quick Guide (3 Steps)

### Step 1: Select Data
**Location**: Data Table Tab

```
┌─────────────────────────────────────────────────┐
│ Data Table                                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ☐  Date         Node ID      Amount           │
│  ☑  Dec 6, 2025  0x01...a278  $0.07  ← Selected│
│  ☑  Dec 5, 2025  0x01...a278  $0.09  ← Selected│
│  ☐  Dec 4, 2025  0x02...b123  $0.15            │
│                                                 │
│  2 selected   [Select All]  [Clear Selection]  │
│               [Use in Dashboard] ← Click this!  │
└─────────────────────────────────────────────────┘
```

**Actions**:
- ✅ Click checkboxes to select individual items
- ✅ Click "Select All" to select everything
- ✅ Click "Clear Selection" to start over

### Step 2: Apply to Dashboard
**Action**: Click the **"Use in Dashboard"** button

The app will:
- Automatically switch to Dashboard tab
- Show only your selected data
- Display a blue filter banner

### Step 3: Analyze & Clear
**Location**: Dashboard Tab

```
┌─────────────────────────────────────────────────┐
│ Dashboard                                       │
├─────────────────────────────────────────────────┤
│ ℹ️ Dashboard Filtered by Selection              │
│    Showing 2 selected earnings  [Clear Filter] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Total Earnings        This Month              │
│  $0.16                 $0.16                    │
│  2 transactions        December 2025            │
│                                                 │
│  📊 Charts show only selected data              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Actions**:
- ✅ View metrics for selected data only
- ✅ Analyze charts for selected data only
- ✅ Click "Clear Filter" to see all data again

## 📋 Common Use Cases

### Use Case 1: Analyze a Specific Week
```
1. Data Table → Set date range (e.g., Dec 1-7)
2. Click "Select All"
3. Click "Use in Dashboard"
4. See that week's performance!
```

### Use Case 2: Compare Specific Nodes
```
1. Data Table → Search for node ID
2. Select those earnings
3. Click "Use in Dashboard"
4. See just that node's stats!
```

### Use Case 3: Check Top Earners
```
1. Data Table → Sort by Amount (high to low)
2. Select top 10 entries
3. Click "Use in Dashboard"
4. Identify high-earning patterns!
```

## 🎨 Visual Indicators

### When Selection is Active (Data Table)
- ✅ Checkboxes are checked
- ✅ Counter shows "X selected"
- ✅ "Use in Dashboard" button appears (blue)

### When Dashboard is Filtered
- ✅ Blue banner at top
- ✅ "Dashboard Filtered by Selection" message
- ✅ Count of selected items shown
- ✅ "Clear Filter" button visible

### When No Filter is Active (Dashboard)
- ❌ No blue banner
- ✅ All data displayed
- ✅ Normal view

## 🔄 How to Reset

There are **3 ways** to clear and return to viewing all data:

1. **Dashboard**: Click "Clear Filter" button in blue banner
2. **Data Table**: Click "Clear Selection" button
3. **Data Table**: Click header checkbox twice (select all, deselect all)

## 💡 Tips & Tricks

### Tip 1: Combine with Filters
```
Data Table Filters + Selection = Powerful Analysis

Example:
- Filter by License Type: "ULO"
- Filter by Date Range: "Last Month"
- Click "Select All"
- Apply to Dashboard
Result: See only ULO earnings from last month!
```

### Tip 2: Selection Persists
```
You can switch between tabs without losing selection:

Data Table (select items) → Dashboard → Input → Data Table
                ↓
         Selection still there!
```

### Tip 3: Export Selected Data
```
1. Select data in Data Table
2. Click "Use in Dashboard"
3. Use Export buttons (CSV, JSON, PDF)
4. Exported file contains only selected data!
```

## 🚀 Keyboard Workflow (Future)

Currently, use mouse/trackpad for selections.
Future versions may include:
- Ctrl+A: Select All
- Ctrl+D: Clear Selection
- Escape: Clear Dashboard Filter

## ❓ Troubleshooting

### Problem: Can't see "Use in Dashboard" button
**Solution**: You need to select at least 1 item first!

### Problem: Dashboard shows all data, not selection
**Solution**: Did you click "Use in Dashboard"? Blue banner should appear.

### Problem: Selection disappeared
**Solution**: Did you click "Clear Selection" or "Clear Filter"? Just reselect!

### Problem: Wrong data showing
**Solution**: 
1. Go to Data Table
2. Check which items are selected (checkboxes)
3. Click "Use in Dashboard" again

## 📊 What Updates in Dashboard?

When you apply a selection, **EVERYTHING** updates:

### Metrics Cards
- ✅ Total Earnings (sum of selected)
- ✅ This Month (selected items from this month)
- ✅ Average Daily (avg based on selected dates)
- ✅ Active Nodes (unique nodes in selection)

### Charts
- ✅ Cumulative Earnings Over Time (selected data)
- ✅ Daily Earnings (selected data by date)
- ✅ Earnings by License Type (selected data distribution)
- ✅ License Type Breakdown (selected data table)

### Export Functions
- ✅ JSON Export (selected data)
- ✅ CSV Export (selected data)
- ✅ PDF Report (selected data summary)

## 🎓 Learn More

For detailed technical documentation, see:
- `data-table-to-dashboard-selection.md` - Complete feature guide
- `earnings-tracker-feature.md` - Overall tracker documentation
- `IMPLEMENTATION-SUMMARY.md` - Technical implementation details

## ✨ Summary

The Data Table to Dashboard selection feature is:

**Simple**: Just checkboxes and one button click
**Powerful**: Analyze any subset of your data
**Flexible**: Works with all existing filters
**Visual**: Clear indicators when active
**Reversible**: Easy to clear and return to all data

Enjoy analyzing your Unity Nodes earnings! 🎉
