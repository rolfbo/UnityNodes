# Quick Start: Bound Nodes Feature

## What Are Bound Nodes?

**Bound nodes** = Unity Nodes that have an active phone connected to them.

Only bound nodes generate earnings, so the dashboard filters to show only these active nodes.

## 5-Minute Setup

### Step 1: Open Node ID Mapping
1. Click **"Data Table"** tab
2. Scroll down to **"Bound Node ID Mapping"** section

### Step 2: Mark Your Active Nodes
For each node in the list:

✅ **Has a phone connected?** → Check the "Bound to phone" checkbox
☐ **No phone connected?** → Leave unchecked

```
Example:
┌─────────────────────────────────────────┐
│ 0x01...a278        [ULO          ]     │
│ ✅ Bound to phone   Total: $45.67      │  ← This node IS bound
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 0x02...b389        [Enterprise   ]     │
│ ☐ Bound to phone    Total: $0.00       │  ← This node is NOT bound
└─────────────────────────────────────────┘
```

### Step 3: View Dashboard
1. Click **"Dashboard"** tab
2. See earnings from **only bound nodes**

**That's it!** The dashboard now tracks only your active, earning nodes.

## Visual Guide

### Bound Node (Green)
```
┌━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ← Green border
┃ 0x01...a278        [ULO          ]     ┃
┃                                         ┃  ← Green background
┃ ✅ Bound to phone   Total: $45.67      ┃  ← Green text, bold
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Unbound Node (Gray)
```
┌─────────────────────────────────────────┐  ← Gray border
│ 0x02...b389        [Enterprise   ]     │
│                                         │  ← Dark background
│ ☐ Bound to phone    Total: $0.00       │  ← Gray text
└─────────────────────────────────────────┘
```

## What the Dashboard Shows

### With 3 Bound Nodes and 2 Unbound Nodes

**Dashboard includes:**
- ✅ Earnings from the 3 bound nodes
- ✅ Charts showing bound node performance
- ✅ Metrics calculated from bound nodes only

**Dashboard excludes:**
- ❌ Earnings from the 2 unbound nodes
- ❌ Historical data from nodes before they were bound

**Data Table shows:**
- ✅ ALL earnings (both bound and unbound)
- ℹ️ The table is not filtered - you see everything

## Common Scenarios

### 🔧 Adding a New Phone to a Node

1. Connect phone to the node
2. Go to **Data Table** → **Node ID Mapping**
3. Find the node ID
4. ✅ Check "Bound to phone"
5. Dashboard immediately includes it

### 🔌 Disconnecting a Phone

1. Disconnect phone from node
2. Go to **Data Table** → **Node ID Mapping**
3. Find the node ID
4. ☐ Uncheck "Bound to phone"
5. Dashboard immediately excludes it

### 🆕 First Time Setup

You probably want to:
1. Check all nodes that currently have phones
2. Leave unchecked any nodes without phones
3. Dashboard will show only active nodes

## Tips

### Tip 1: Review Regularly
Check your Node ID Mapping weekly to ensure bound status is accurate.

### Tip 2: Use License Types Too
Fill in license types (ULO, Enterprise, etc.) to get better analytics.

### Tip 3: Don't Delete Old Nodes
If you disconnect a phone, just uncheck it. Historical data is preserved.

### Tip 4: Check the Dashboard
After marking nodes, always check the dashboard to confirm the data looks right.

## Troubleshooting

### Dashboard Shows $0.00

**Problem**: No nodes are marked as bound

**Solution**:
1. Go to Data Table → Node ID Mapping
2. Check at least one node
3. Dashboard updates automatically

### Dashboard Missing Recent Earnings

**Problem**: Node earned but isn't marked as bound

**Solution**:
1. Find the node in Node ID Mapping
2. ✅ Check "Bound to phone"
3. Earnings appear immediately

### Can't See Historical Data

**Correct**: Dashboard only shows bound node data

**To see all data**:
- Go to **Data Table** (shows all earnings)
- Or use **Export** functions (export all data)

## Quick Reference

| Action | Location | Effect |
|--------|----------|--------|
| ✅ Check box | Node ID Mapping | Add node to dashboard |
| ☐ Uncheck box | Node ID Mapping | Remove node from dashboard |
| View all data | Data Table | Shows all earnings |
| View bound only | Dashboard | Shows bound nodes only |
| Export | Dashboard → Export | Exports all data |

## FAQ

**Q: Does unchecking delete my data?**
A: No! All earnings are preserved. Unchecking only hides them from the dashboard.

**Q: Can I see both bound and unbound data?**
A: Data Table shows all. Dashboard shows bound only. Export includes all.

**Q: What if I forget to mark a node?**
A: Its earnings won't show on dashboard, but they're saved. Just check the box when you remember.

**Q: How do I know which nodes to mark?**
A: Mark only nodes that currently have a phone connected and are actively earning.

**Q: Does this affect my exports?**
A: No. Exports include ALL data regardless of bound status.

## Summary

1. ✅ = Phone connected = Bound = Shows in dashboard
2. ☐ = No phone = Unbound = Hidden from dashboard
3. Green border = Bound node (easy to spot!)
4. Data Table = See everything
5. Dashboard = See bound nodes only

---

**Next Steps**: After marking your bound nodes, explore the [full Bound Nodes Feature documentation](bound-nodes-feature.md) for advanced usage.
