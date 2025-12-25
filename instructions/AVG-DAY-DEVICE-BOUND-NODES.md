# Avg/Day/Device Metric with Bound Nodes Filter

## 📊 What This Feature Does

The dashboard metrics now show **only bound nodes** data:

### **Avg/Day/Device** Metric
- ✅ A **rolling 3-day average** (not all-time average)
- ✅ **Only includes nodes marked as "Bound to phone"**

### **Active ULOs** Metric
- ✅ Shows **count of unique bound node IDs** only
- ✅ Updates instantly when you bind/unbind nodes

This gives you the most accurate, real-time picture of your currently active devices' performance.

## 🎯 Why This Matters

### Problem Before
Imagine you have 5 nodes:
- **Node A, B, C**: Active with phones, earning $15/day each (last 3 days)
- **Node D, E**: Disconnected, earned $5/day weeks ago but $0 recently

**Old metric would show**: ~$8/day per device (includes all 5 nodes, all historical data)
- This is misleading! It doesn't show your current performance

**New metric shows**: $15/day per device (only A, B, C; only last 3 days)
- This is accurate! It shows what your active nodes are earning RIGHT NOW

## 🔧 How It Works

### Step 1: Filter to Bound Nodes Only
The calculation **automatically filters** to only include nodes you've marked as "Bound to phone":

```
All Earnings → Filter to Bound Nodes → Use for calculation
```

This filtering happens in the code at line 716:
```javascript
return filteredEarnings.filter(e => getBoundStatus(e.nodeId));
```

### Step 2: Calculate Rolling 3-Day Average
From the bound nodes' earnings, it:
1. Finds the **last 3 dates** with earning data
2. Filters to only those 3 days
3. For each bound device: total (last 3 days) ÷ days active = device average
4. Averages all device averages = final metric

### Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  All Earnings in Database                                   │
│  (All nodes, all dates, all time)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Filter #1: Selection Filter (if enabled)                   │
│  → Only show selected date ranges/entries                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Filter #2: Bound Nodes Filter (ALWAYS APPLIED)            │
│  → Only nodes marked as "Bound to phone" ✅                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓  (This becomes "dashboardEarnings")
┌─────────────────────────────────────────────────────────────┐
│  Find Last 3 Dates with Earning Data                       │
│  Example: Dec 22, 23, 24                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Filter #3: Rolling 3-Day Window                            │
│  → Only earnings from last 3 dates                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Calculate Per-Device Averages                              │
│  For each bound device in those 3 days:                    │
│  → Device avg = total ÷ days active                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Final Metric: Avg/Day/Device                               │
│  → Average of all device averages                          │
│  → Displayed with "last 3 days rolling avg" subtitle       │
└─────────────────────────────────────────────────────────────┘
```

## 📱 How to Use This Feature

### Initial Setup (One-Time)

1. **Go to Data Table tab**
   - Click "Data Table" in the navigation

2. **Scroll down to "Bound Node ID Mapping" section**
   - You'll see all your node IDs listed

3. **Mark Active Nodes**
   - For each node that has an **active phone connection**:
     - ☑️ Check the "Bound to phone" checkbox
   - For disconnected/inactive nodes:
     - ☐ Leave unchecked

4. **Visual Confirmation**
   - Bound nodes: **Green border** with green background
   - Unbound nodes: Gray border with dark background

### Daily Management

#### When You Connect a Phone to a Node
1. Go to Data Table → Node ID Mapping
2. Find that node ID
3. ✅ Check "Bound to phone"
4. Dashboard updates instantly

#### When You Disconnect a Phone from a Node
1. Go to Data Table → Node ID Mapping
2. Find that node ID
3. ☐ Uncheck "Bound to phone"
4. Dashboard excludes it instantly

#### Viewing Performance
1. Go to **Dashboard tab**
2. Look at the **Avg/Day/Device** metric card
3. The number shows: average earnings per device per day, for the last 3 days, for bound nodes only

## 📈 Real-World Example

### Your Node Setup
You have 4 Unity Nodes:

| Node ID | Status | Earnings Last 5 Days |
|---------|--------|---------------------|
| 0x01...abc | 🟢 Bound to phone | $12, $15, $14, $16, $15 |
| 0x02...def | 🟢 Bound to phone | $10, $13, $12, $14, $13 |
| 0x03...ghi | 🔴 Phone disconnected | $8, $7, $0, $0, $0 |
| 0x04...jkl | 🔴 No phone yet | $0, $0, $0, $0, $0 |

### Dashboard Shows (for last 3 days)

**Bound Nodes Only (0x01...abc and 0x02...def):**

**Node 0x01...abc:**
- Last 3 days: $14, $16, $15
- Average: ($14 + $16 + $15) ÷ 3 = **$15/day**

**Node 0x02...def:**
- Last 3 days: $12, $14, $13
- Average: ($12 + $14 + $13) ÷ 3 = **$13/day**

**Dashboard Metrics:**
- **Avg/Day/Device**: ($15 + $13) ÷ 2 = **$14.00**
- **Active ULOs**: **2** (only counts bound nodes: 0x01...abc and 0x02...def)

**Nodes 0x03 and 0x04 are NOT included** in either metric because they're not marked as "Bound to phone"!

## 🎨 Visual Indicators in the App

### Dashboard Metric Cards

**Avg/Day/Device Card:**
```
┌──────────────────────────────────────┐
│ Avg/Day/Device          [📈]         │
│                                       │
│        $14.00                         │
│                                       │
│ last 3 days rolling avg              │ ← Rolling average label
└──────────────────────────────────────┘
```

**Active ULOs Card:**
```
┌──────────────────────────────────────┐
│ Active ULOs             [#]          │
│                                       │
│          2                            │
│                                       │
│ bound devices                        │ ← Only counts bound nodes!
└──────────────────────────────────────┘
```

### Node ID Mapping (Bound Node)
```
┌────────────────────────────────────────┐
│ 🟢 Green Border & Background           │
│                                        │
│ 0x01...abc         [ULO        ]      │
│                                        │
│ ☑️ Bound to phone    Total: $155.25   │
│    (Green text, bold)                  │
└────────────────────────────────────────┘
```

### Node ID Mapping (Unbound Node)
```
┌────────────────────────────────────────┐
│ ⚫ Gray Border & Background             │
│                                        │
│ 0x03...ghi         [ULO        ]      │
│                                        │
│ ☐ Bound to phone    Total: $45.00     │
│    (Gray text, normal)                 │
└────────────────────────────────────────┘
```

## ✅ Benefits of This Combined Feature

### 1. **Focus on Active Earnings**
Only see metrics from nodes actually generating income right now

### 2. **Real-Time Performance**
3-day rolling average shows current trends, not history

### 3. **Quick Problem Detection**
If a bound node's earnings drop, you'll see it within 3 days

### 4. **Accurate Projections**
Make financial decisions based on current active nodes

### 5. **Easy Management**
One checkbox per node - that's it!

### 6. **No Data Loss**
Unbound nodes' historical data is preserved, just filtered from dashboard

## 🔍 Troubleshooting

### Problem: Dashboard Shows $0.00
**Possible Causes:**
- No nodes are marked as "Bound to phone"
- Bound nodes have no recent earnings (last 3 days)

**Solution:**
1. Go to Data Table → Node ID Mapping
2. Check that at least one node has ✅ "Bound to phone" checked
3. Verify those nodes have earnings in the last 3 days

### Problem: Metric Seems Too Low/High
**Check:**
1. Are the right nodes bound? (active ones should be checked)
2. Do you have at least 3 days of data? (metric uses available days if less)
3. Are you looking at the right date range?

**Remember:** The metric is VERY responsive. If yesterday was a bad day, the 3-day average will reflect that immediately!

### Problem: Changes Not Showing
**Solution:**
1. Changes are instant - if not updating, refresh the page
2. Check browser console for errors
3. Verify localStorage is enabled in your browser

## 🧪 Testing the Feature

### Test 1: Verify Bound Filter Works
1. Mark 2 nodes as bound, 2 as unbound
2. Go to Dashboard
3. Check that "Active ULOs" shows **2** (not 4)
4. Check that "Top Earning Device" only shows bound nodes
5. Total Earnings should only count bound nodes

### Test 2: Verify Rolling Average
1. Have at least 5 days of data for a bound node
2. Note the earnings for the last 3 days
3. Calculate manually: (day1 + day2 + day3) ÷ 3
4. Compare with dashboard metric

### Test 3: Verify Binding/Unbinding Impact
1. Note current Avg/Day/Device value and Active ULOs count
2. Unbind your highest-earning node
3. Watch both metrics update:
   - Avg/Day/Device should decrease
   - Active ULOs should decrease by 1
4. Re-bind it, watch both metrics return to original values

## 📝 Technical Implementation Details

### Code Location
- **File:** `roi-calculator-app/src/EarningsTrackerApp.jsx`
- **Bound Filter:** Lines ~707-717 (`dashboardEarnings` useMemo)
- **Rolling Average:** Lines ~833-871 (`avgDailyPerDevice` useMemo)
- **Active ULOs Count:** Lines ~900-910 (`activeBoundNodes` useMemo)
- **UI Display - Avg/Day/Device:** Lines ~1044-1056 (Dashboard metric card)
- **UI Display - Active ULOs:** Lines ~1030-1042 (Dashboard metric card)

### Data Storage
Bound status is stored in localStorage as:
```javascript
{
  "0x01...abc": {
    licenseType: "ULO",
    bound: true  // ← This property
  }
}
```

### Dependencies
The rolling average calculation depends on:
- `dashboardEarnings` (already filtered to bound nodes)
- React's `useMemo` for performance optimization
- Automatic re-calculation when data changes

## 🚀 Best Practices

### 1. Keep Bound Status Updated
Update binding status whenever you connect/disconnect phones

### 2. Review Weekly
Check your bound nodes list weekly to ensure accuracy

### 3. Monitor Trends
Use the 3-day average to spot trends:
- Increasing: Nodes performing better
- Decreasing: Investigate potential issues

### 4. Combine with Other Metrics
Look at:
- Total Earnings (overall performance)
- Avg Daily (general trend)
- Avg/Day/Device (per-node efficiency)
- Top Earning Device (best performer)

### 5. Export Regularly
Create backups to preserve historical data including bound status

## 📚 Related Documentation

- `bound-nodes-feature.md` - Complete bound nodes feature documentation
- `ROLLING-AVERAGE-IMPLEMENTATION.md` - Technical rolling average details
- `QUICK-START-GUIDE.md` - General app quick start

## 🔮 Future Enhancements (Ideas)

- Make rolling window configurable (3, 7, 14, or 30 days)
- Add trend indicators (↑ improving, ↓ declining)
- Auto-detect inactive nodes (no earnings for X days)
- Bulk actions ("Mark all as bound")
- Bind history timeline
- Comparison view (3-day vs 7-day vs all-time)

## 📊 Summary

Your dashboard metrics are now **accurate real-time performance indicators**:

### Avg/Day/Device Metric
1. ✅ **Only counts active nodes** (bound to phones)
2. ✅ **Only looks at recent performance** (last 3 days)
3. ✅ **Updates instantly** when you bind/unbind nodes
4. ✅ **Reflects current reality** not historical averages

### Active ULOs Metric
1. ✅ **Shows only bound devices** count
2. ✅ **Updates instantly** when you bind/unbind nodes
3. ✅ **Accurate active node count** not all-time total

This helps you make better decisions about your Unity Nodes investment based on what's actually happening right now!

---

**Last Updated:** December 24, 2025  
**Status:** ✅ Implemented and Active  
**Version:** 2.0
