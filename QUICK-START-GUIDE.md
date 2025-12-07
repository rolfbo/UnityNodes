# Quick Start Guide - Unity Nodes Earnings Tracker

## 🚀 Getting Started

### 1. Start the Application

```bash
cd roi-calculator-app
npm run dev
```

The app will open at `http://localhost:5174` (or another port if 5174 is in use).

### 2. Navigate to Earnings Tracker

Click the **"Earnings Tracker"** button in the top navigation.

## 📊 Adding Your First Earnings

### Step 1: Prepare Your Data

Get your earnings data from Unity Nodes:

1. Go to https://manage.unitynodes.io/rewards/allocation
2. Select all transactions you want to track
3. Copy the selected data (Cmd+C or Ctrl+C)

The copied data should look like this:

```
0x01...a278
+ $0.07
completed / 06 Dec 2025

0x01...a278
+ $0.09
completed / 05 Dec 2025
```

### Step 2: Paste and Parse

1. Click the **"Add Earnings"** tab
2. Paste your data into the text area
3. Click **"Parse and Add Earnings"**
4. The system will show you:
   - How many entries were parsed ✅
   - How many were added ✅
   - Any potential duplicates flagged ⚠️
5. If duplicates are detected, review the warning panel and delete confirmed duplicates

### Step 3: Map Node IDs to License Types

1. Go to the **"Data Table"** tab
2. Scroll down to **"Node ID Mapping"**
3. For each node ID, enter its license type (e.g., "ULO", "Enterprise", etc.)
4. Changes save automatically

### Step 4: View Your Dashboard

1. Click the **"Dashboard"** tab
2. See your earnings visualized:
   - **Total Earnings** - All time
   - **This Month** - Current month total
   - **Average Daily** - Average per day
   - **Active Nodes** - Number of unique nodes
   - **Charts** - Visual representations of your data

## 🔄 Daily Workflow

Each time you receive new earnings:

1. Copy the earnings data
2. Go to **"Add Earnings"**
3. Paste and parse
4. Review and delete any flagged duplicate warnings
5. View updated dashboard

## 📤 Exporting Data

From the **Dashboard** tab:

- **Export JSON** - For backup or data migration
- **Export CSV** - For spreadsheets (Excel, Google Sheets)
- **Export PDF Report** - Professional report with summary

## 🎯 Tips

### Managing Duplicates
The system detects potential duplicates based on:
- Same node ID
- Same amount
- Same date

When duplicates are detected:
- All entries are added (nothing is skipped)
- A warning panel shows potential duplicates
- You manually review and delete confirmed duplicates
- Multiple legitimate transactions per day are preserved

### Organizing Data
- Map all node IDs to license types for better analytics
- Use filters in the Data Table to analyze specific periods
- Export regularly for backup

### Understanding Charts
- **Cumulative Earnings** - Shows total growth over time
- **Daily Earnings** - Shows which days were most profitable
- **License Type Breakdown** - Shows which licenses earn most

## 🛠️ Troubleshooting

### Data Not Parsing?
1. Check the format matches the example (click "Show example format")
2. Ensure each entry has: Node ID, Amount, and Date
3. Try pasting smaller chunks

### Data Not Saving?
1. Make sure browser localStorage is enabled
2. Not in incognito/private mode
3. Browser storage not full

### Charts Not Showing?
1. Make sure you have earnings entries
2. Try clearing filters in Data Table
3. Refresh the page

## 📁 Your Data

All data is stored locally in your browser:
- **Location**: Browser localStorage
- **Privacy**: Never leaves your device
- **Backup**: Use export functions regularly
- **Sync**: Not synced across devices (export/import to transfer)

## 🎓 Learn More

For detailed documentation, see:
- `instructions/earnings-tracker-feature.md` - Complete feature guide
- `README.md` - Project overview
- `EARNINGS-TRACKER-IMPLEMENTATION-SUMMARY.md` - Technical details

## ✅ You're All Set!

Start tracking your Unity Nodes earnings today! 🎉

---

**Need Help?**
- Check the example format in the "Add Earnings" tab
- Review the documentation files
- Check browser console for error messages
