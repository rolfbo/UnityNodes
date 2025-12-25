# Bound Nodes Feature

## Overview

The Bound Nodes feature allows users to mark which Unity Nodes are "bound" to an active phone connection, and automatically filters the dashboard to show only earnings from those bound nodes. This is useful for tracking only active nodes that are currently generating earnings.

## What is a "Bound" Node?

A **bound node** is a Unity Node that has an active phone connected to it. Only nodes with active phone connections can generate earnings, so this feature helps users focus on their active, earning nodes.

## Key Features

### 1. Node Binding Management

**Location**: Data Table view → Node ID Mapping section

Each node in your earnings data can be marked as "bound" or "unbound":

- **Bound** (✅ checked): Node has an active phone connected
- **Unbound** (☐ unchecked): Node does not have an active phone connected

### 2. Visual Indicators

Bound nodes are visually distinguished in the Node ID Mapping section:

- **Bound nodes**: Green border with light green background (`bg-green-900/20 border-green-400/50`)
- **Unbound nodes**: Gray border with dark background (`bg-slate-900/50 border-slate-700`)
- **Checkbox label**: Changes color when bound
  - Bound: Green text with bold font (`text-green-400 font-semibold`)
  - Unbound: Gray text (`text-slate-300`)

### 3. Dashboard Filtering

**Automatic Filter**: The dashboard **only shows earnings from bound nodes**.

This means:
- Total Earnings: Only counts earnings from bound nodes
- This Month: Only counts bound node earnings
- Average Daily: Only calculates from bound nodes
- Charts: Only visualize bound node data
- Top Earning Device: Only considers bound nodes

### 4. Selection Feature Compatibility

The bound filter works seamlessly with the "Data Table to Dashboard Selection" feature:

**Filter Order**:
1. First: Apply selection filter (if enabled)
2. Then: Filter to bound nodes only

This allows you to:
- Select specific date ranges from the data table
- See how your bound nodes performed during that period

## Technical Implementation

### Data Structure

**Old Format** (migrated automatically):
```javascript
{
  "0x123...abc": "ULO",
  "0x456...def": "Enterprise"
}
```

**New Format**:
```javascript
{
  "0x123...abc": {
    licenseType: "ULO",
    bound: true
  },
  "0x456...def": {
    licenseType: "Enterprise",
    bound: false
  }
}
```

### Storage Functions

**`getBoundStatus(nodeId)`**
- Returns: `boolean` - Whether the node is bound
- Default: `false` if node not found

**`getNodeInfo(nodeId)`**
- Returns: `{ licenseType, bound }` object or `null`

**`updateNodeMapping(nodeId, licenseType, bound)`**
- Updates license type and/or bound status
- Pass `null` for parameters you don't want to update
- Example: `updateNodeMapping(nodeId, null, true)` - only update bound status

### Dashboard Filter Logic

```javascript
const dashboardEarnings = useMemo(() => {
    let filteredEarnings = earnings;

    // First apply selection filter if enabled
    if (useDashboardSelection && selectedEarningIds.size > 0) {
        filteredEarnings = earnings.filter(e => selectedEarningIds.has(e.id));
    }

    // Then filter to only show earnings from bound nodes
    return filteredEarnings.filter(e => getBoundStatus(e.nodeId));
}, [earnings, useDashboardSelection, selectedEarningIds]);
```

### Migration

When loading node mappings, the system automatically migrates old format to new format:

1. Detects if value is a string (old format)
2. Converts to object with `{ licenseType: value, bound: false }`
3. Saves migrated data back to localStorage
4. Returns the migrated mapping

This ensures backward compatibility with existing user data.

## User Workflow

### Initial Setup

1. Go to **Data Table** view
2. Scroll to **Bound Node ID Mapping** section
3. For each node, check if it has an active phone connected
4. Check the **"Bound to phone"** checkbox for active nodes
5. Enter the license type (e.g., "ULO") if not already set

### Daily Use

1. View the **Dashboard** - it automatically shows only bound nodes
2. When you disconnect a phone from a node:
   - Go to Data Table → Node ID Mapping
   - Uncheck that node's "Bound to phone" checkbox
   - Dashboard will immediately update to exclude it
3. When you connect a phone to a new node:
   - Check that node's "Bound to phone" checkbox
   - Dashboard will immediately include its earnings

### Example Scenario

**You have 5 nodes:**
- Node A: Has phone, earning daily ✅
- Node B: Has phone, earning daily ✅
- Node C: Phone disconnected, not earning ☐
- Node D: Has phone, earning daily ✅
- Node E: No phone yet ☐

**Dashboard shows:**
- Only earnings from Nodes A, B, and D
- Total earnings: Sum of A + B + D
- Charts: Only plot A, B, and D data
- Top Earning Device: Highest of A, B, or D

## UI Components

### Node ID Mapping Card

Each node displays:
```
┌─────────────────────────────────────────┐
│ [Node ID]              [License Type]   │  ← Input for license type
│                                          │
│ ☐ Bound to phone       Total: $X.XX    │  ← Checkbox and total
└─────────────────────────────────────────┘
```

When bound (checked):
- Green border and background
- "Bound to phone" text in green and bold

When unbound (unchecked):
- Gray border and background
- "Bound to phone" text in gray

## Tooltip Information

**Heading Tooltip**:
> "Map each node ID to its license type and mark which nodes are bound to active phones. Dashboard shows only bound nodes."

This helps users understand:
- What to do in this section (map and mark)
- The impact on dashboard (filtering)

## Benefits

### 1. Focus on Active Earnings
Only see data from nodes that are actually generating earnings

### 2. Accurate Projections
Calculate average daily earnings based only on active nodes

### 3. Easy Management
Simple checkbox to add/remove nodes from dashboard

### 4. Visual Clarity
Immediately see which nodes are bound (green highlight)

### 5. Historical Tracking
Can temporarily unbind nodes without losing historical data

## Limitations

### Data Table View
The Data Table view shows **all earnings**, regardless of bound status. Only the Dashboard is filtered.

**Reason**: Users need to see all historical data for:
- Reviewing when nodes were earning
- Identifying patterns
- Manual data cleanup
- Export of complete data

### Export Functions
Exports include **all data**, not just bound nodes.

**Reason**: Complete data export for:
- Backup purposes
- External analysis
- Sharing complete history

### Quick Access
To see only bound node data in the table:
1. Use "Data Table to Dashboard Selection" feature
2. Filter table as needed
3. Select desired entries
4. Click "Use selection in Dashboard"
5. Dashboard will show selected entries from bound nodes only

## Troubleshooting

### Dashboard Shows No Data

**Possible Causes**:
1. No nodes are marked as bound
2. Bound nodes have no earnings yet
3. Date range filter excludes bound node earnings

**Solution**:
1. Go to Data Table → Node ID Mapping
2. Check that at least one node has "Bound to phone" checked
3. Verify that bound nodes have earnings in the data table
4. Clear any date filters that might be excluding data

### Changes Not Reflected

**Solution**: Checkbox changes are immediate. If dashboard doesn't update:
1. Refresh the page
2. Check browser console for errors
3. Verify localStorage is enabled

### All Nodes Missing After Update

**Solution**: The migration should preserve your license types and default all nodes to `bound: false`. To restore:
1. Check the nodes you want to track
2. Dashboard will update automatically

## Future Enhancements

Potential additions for this feature:

1. **Bind History**: Track when nodes were bound/unbound
2. **Bulk Actions**: "Mark all as bound" / "Mark all as unbound" buttons
3. **Auto-Detection**: Automatically detect bound status from recent earnings
4. **Separate Views**: Toggle between "All Nodes" and "Bound Nodes" view
5. **Export Option**: Export bound nodes only
6. **Statistics**: Show count of bound vs unbound nodes

## Version History

- **v1.0** (December 2025) - Initial implementation
  - Checkbox UI in Node ID Mapping
  - Dashboard filtering for bound nodes
  - Automatic data migration
  - Visual indicators (green highlight)
  - Storage functions (getBoundStatus, getNodeInfo)

## Related Features

- **Node ID Mapping**: Core feature for license type assignment
- **Data Table to Dashboard Selection**: Works with bound filter
- **Dashboard Metrics**: All metrics respect bound filter
- **Export Functions**: Export all data including bound status

## Summary

The Bound Nodes feature provides a simple, effective way to focus your earnings dashboard on only the nodes that are actively connected to phones and generating earnings. The green visual indicators and automatic filtering make it easy to manage and track your active Unity Nodes portfolio.
