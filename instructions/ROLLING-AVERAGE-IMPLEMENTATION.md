# Rolling 3-Day Average Implementation for Avg/Day/Device Metric

## Overview
This document explains the implementation of the rolling 3-day average calculation for the "Avg/Day/Device" metric in the Unity Nodes Earnings Tracker application.

## What Changed

### 1. Avg/Day/Device Metric - Rolling 3-Day Average
The **Avg/Day/Device** metric now displays a **rolling 3-day average** instead of an all-time average. This provides a more recent and responsive view of device performance.

### 2. Active ULOs Metric - Bound Nodes Only
The **Active ULOs** metric now counts **only nodes marked as "Bound to phone"** instead of all unique node IDs. This provides an accurate count of your currently active devices.

## Why This Matters
A rolling average is more useful than an all-time average because:
- **More Responsive**: It reflects recent performance changes rather than being heavily influenced by old data
- **Better for Decision Making**: Users can see if their devices are performing better or worse in recent days
- **Trend Detection**: Makes it easier to spot improving or declining performance patterns

## How It Works

### Previous Calculation (All-Time Average)
Before this change, the metric calculated:
1. For each device: total earnings ÷ total days active = device average
2. Average all device averages together = final metric

This meant if you had 30 days of data, all 30 days influenced the average equally.

### New Calculation (Rolling 3-Day Average)
Now the metric calculates:
1. **Filter to bound nodes only** - Only includes earnings from nodes marked as "Bound to phone" (this happens automatically via `dashboardEarnings`)
2. **Identify the last 3 dates** with earning data in the dataset
3. **Filter earnings** to only include those last 3 dates
4. For each device: total earnings (last 3 days) ÷ days active (last 3 days) = device rolling average
5. Average all device rolling averages together = final metric

### Important: Bound Nodes Filter
**The calculation ONLY includes nodes marked as "Bound to phone"**. This is crucial because:
- Only bound nodes are actively connected to phones and generating earnings
- The metric reflects your currently active devices, not inactive/disconnected ones
- You control which nodes are included by checking/unchecking the "Bound to phone" checkbox in the Data Table → Node ID Mapping section

### Example
Let's say you have data from Dec 20, 21, 22, 23, and 24:

**Old method** would use all 5 days:
- Device A: ($10 + $10 + $10 + $15 + $15) ÷ 5 days = $12/day

**New method** uses only the last 3 days (Dec 22, 23, 24):
- Device A: ($10 + $15 + $15) ÷ 3 days = $13.33/day

The new method shows Device A is earning more recently!

## Implementation Details

### File Modified
- `roi-calculator-app/src/EarningsTrackerApp.jsx`

### Code Location
Lines 833-873 (approximately) - the `avgDailyPerDevice` useMemo hook

### Key Implementation Steps

1. **Extract and sort unique dates**
```javascript
const uniqueDates = [...new Set(dashboardEarnings.map(e => e.date))].sort();
```

2. **Get last 3 dates**
```javascript
const last3Dates = uniqueDates.slice(-3);
```

3. **Filter to recent earnings only**
```javascript
const recentEarnings = dashboardEarnings.filter(e => last3Dates.includes(e.date));
```

4. **Calculate per-device averages** using only the recent 3-day window
5. **Average all device averages** for the final metric

### UI Updates

**Avg/Day/Device Card:**
- Old subtitle: "per device per day"
- New subtitle: "last 3 days rolling avg"
- Clearly communicates it's a recent rolling average

**Active ULOs Card:**
- Old subtitle: "unique node IDs"
- New subtitle: "bound devices"
- Clearly communicates it only counts bound nodes

## Edge Cases Handled

### Less Than 3 Days of Data
If the user has less than 3 days of earnings data:
- The calculation uses all available days (e.g., if only 2 days exist, it uses those 2 days)
- The `.slice(-3)` method automatically handles this gracefully

### No Data
If there are no earnings:
- Returns 0
- No errors or crashes

### Devices Active Only Some Days
If a device was only active 1 or 2 of the last 3 days:
- It averages over only the days it was active
- This prevents artificially low averages for devices that weren't earning on all 3 days

## Testing Recommendations

To verify this feature works correctly:

1. **Test with bound nodes only**: 
   - Go to Data Table → Node ID Mapping
   - Mark some nodes as "Bound to phone" (checked)
   - Leave others as unbound (unchecked)
   - Verify the Avg/Day/Device metric only counts bound nodes
   
2. **Test with 3+ days of data**: Verify the metric only uses the last 3 days

3. **Test with <3 days of data**: Verify it uses all available days without errors

4. **Test with no data**: Verify it shows $0.00

5. **Test binding/unbinding**: 
   - Uncheck a high-earning bound node
   - Watch the Avg/Day/Device metric decrease (excluding that node)
   - Re-check it and watch the metric increase again

6. **Test with date selection**: Verify that when filtering by date range, it still takes the last 3 days from the filtered range

7. **Compare before/after**: If you have historical data, compare the old all-time average with the new 3-day average to see the difference

## Benefits for Users

1. **Real-time Performance Tracking**: See how devices are performing right now, not averaged over weeks
2. **Quick Problem Detection**: If a device's earnings drop, you'll see it in the metric within 3 days
3. **Performance Improvements Visible**: If earnings increase, the metric reflects it quickly
4. **Better Planning**: Make decisions based on recent trends rather than historical averages

## Related Files
- Main app file: `EarningsTrackerApp.jsx`
- This implementation uses React's `useMemo` hook for performance optimization

## Future Enhancements (Optional)
Potential improvements that could be made:
- Make the rolling window configurable (3, 7, or 30 days)
- Show both all-time and rolling averages side-by-side
- Add a trend indicator (↑ or ↓) showing if the 3-day average is better or worse than the 7-day average
- Add a chart showing the rolling average over time

---

**Implementation Date**: December 24, 2025  
**Modified By**: AI Assistant  
**Status**: Complete ✅
