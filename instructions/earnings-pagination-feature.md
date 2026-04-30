# Earnings Data Table Pagination Feature

## Overview

The Earnings Data table now includes comprehensive pagination controls to make it easier to navigate large datasets. Users can choose how many entries to view per page (10, 100, or 1000) and navigate through pages efficiently.

## Purpose

When tracking earnings over time, users can accumulate hundreds or thousands of entries. Pagination:
- **Improves Performance**: Rendering only a subset of entries keeps the page responsive
- **Enhances Usability**: Easier to navigate and review specific entries
- **Maintains Context**: Footer totals always show all filtered results, not just the current page
- **Flexible Viewing**: Users can choose how much data to see at once based on their needs

## Features

### 1. Items Per Page Selection

Users can choose from three preset page sizes:
- **10 entries** (default): Best for detailed review and quick scanning
- **100 entries**: Good balance for most datasets
- **1000 entries**: Show large datasets at once, useful for bulk operations

**Visual Design:**
- Three button selectors with clear numbers
- Active selection highlighted in purple with shadow effect
- Inactive buttons in slate gray with hover effects
- Changes take effect immediately

**Behavior:**
- Clicking a new page size automatically resets to page 1
- Current selection is visually indicated
- Choice persists during the session (resets on page reload)

### 2. Page Navigation Controls

Navigate through pages with four directional buttons:

**First Page (««)**
- Jumps to page 1
- Disabled when already on page 1
- Useful for quick return to start

**Previous Page (‹)**
- Moves back one page
- Disabled when on page 1
- Allows incremental navigation

**Next Page (›)**
- Moves forward one page
- Disabled when on last page
- Allows incremental navigation

**Last Page (»»)**
- Jumps to the final page
- Disabled when already on last page
- Useful for checking most recent entries (when sorted by date descending)

**Visual Feedback:**
- Disabled buttons are grayed out with `cursor-not-allowed`
- Active buttons show hover effects (lighter background, brighter text)
- Smooth transitions on all interactions

### 3. Page Information Display

Two information displays keep users oriented:

**Top Display:**
- Shows "Page X of Y (Z total entries)"
- Updates in real-time as pagination changes
- Helps users understand dataset size

**Bottom Display:**
- Shows "Showing X to Y of Z entries"
- Displays exact range of entries on current page
- Examples:
  - "Showing 1 to 10 of 22 entries" (page 1, 10 per page)
  - "Showing 11 to 20 of 22 entries" (page 2, 10 per page)
  - "Showing 21 to 22 of 22 entries" (page 3, 10 per page)

### 4. Smart Auto-Reset

The pagination automatically resets to page 1 when:
- License type filter changes
- Date range filter changes
- Search query changes
- Sort field or direction changes

**Why?**
- Prevents users from landing on empty pages after filtering
- Ensures consistent behavior
- Reduces confusion when data changes

**Implementation:**
```javascript
useEffect(() => {
    setCurrentPage(1);
}, [filterLicenseType, filterDateRange, searchQuery, sortField, sortDirection]);
```

### 5. Total Preservation

The table footer always shows totals for **all filtered results**, not just the current page:
- Total count of entries
- Total sum of amounts

**Example:**
- If you have 150 filtered entries showing 10 per page
- Footer shows "Total (150 entries)" and sum of all 150 entries
- Even though you're only viewing 10 entries on the current page

This ensures users always have accurate totals for their filtered dataset.

## User Interface

### Layout

The pagination controls appear in a dedicated card below the main table:

```
┌─────────────────────────────────────────────────────────────┐
│  Show: [10] [100] [1000] entries per page                  │
│                                                             │
│  Page 2 of 3 (22 total entries)  [««] [‹] [›] [»»]       │
│                                                             │
│  Showing 11 to 20 of 22 entries                            │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Design

**Desktop (≥640px):**
- Controls displayed side-by-side
- Left side: Items per page selector
- Right side: Page navigation

**Mobile (<640px):**
- Controls stack vertically
- Items per page on top
- Page navigation below
- All text remains readable
- Buttons maintain touch-friendly sizes

## Technical Implementation

### State Management

Two state variables control pagination:

```javascript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
```

### Calculated Values

Three computed values drive the pagination logic:

**1. Total Pages**
```javascript
const totalPages = useMemo(() => {
    return Math.ceil(filteredEarnings.length / itemsPerPage);
}, [filteredEarnings.length, itemsPerPage]);
```

**2. Paginated Earnings**
```javascript
const paginatedEarnings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEarnings.slice(startIndex, endIndex);
}, [filteredEarnings, currentPage, itemsPerPage]);
```

**3. Entry Range Display**
```javascript
// Start of range
Math.min((currentPage - 1) * itemsPerPage + 1, filteredEarnings.length)

// End of range
Math.min(currentPage * itemsPerPage, filteredEarnings.length)
```

### Performance Optimization

- All calculations use `useMemo` to prevent unnecessary recalculations
- Only re-compute when dependencies change
- Table renders only the current page's data
- Filtering and sorting happen on full dataset, pagination on filtered results

## User Workflows

### Basic Navigation

1. User views first 10 entries by default
2. Clicks "Next" (›) to see entries 11-20
3. Clicks "Next" again to see entries 21-22
4. "Next" button is now disabled (on last page)
5. Clicks "First" (««) to return to page 1

### Changing Page Size

1. User starts with 10 entries per page
2. Clicks "100" to see more entries at once
3. Page automatically resets to 1
4. Can now see up to 100 entries per page
5. May have fewer pages to navigate

### Filtering with Pagination

1. User is on page 3 of 10
2. Applies a license type filter
3. Automatically returns to page 1
4. Sees first page of filtered results
5. Total pages recalculated based on filtered data

### Bulk Operations

1. User wants to select all entries for dashboard
2. Clicks "1000" to show maximum entries per page
3. Likely sees all or most entries on one page
4. Selects all visible entries
5. Applies selection to dashboard

## Edge Cases Handled

### 1. Empty Results
- Pagination controls hidden when no earnings data
- Clean empty state message shown instead

### 2. Single Page
- When all entries fit on one page
- Navigation buttons disabled (can't go prev/next)
- Page indicator shows "Page 1 of 1"

### 3. Filter Reduces Results
- Auto-reset to page 1 ensures valid page shown
- Total pages recalculated
- Entry range updated correctly

### 4. Deleting Entries
- If last entry on a page is deleted
- And current page becomes invalid (exceeds total pages)
- User remains on highest valid page
- No jarring jumps or errors

### 5. Exact Page Size Match
- If filtered results = page size (e.g., 10 results, 10 per page)
- Shows "Page 1 of 1"
- All navigation buttons disabled
- Entry range shows "Showing 1 to 10 of 10 entries"

## Best Practices

### For Small Datasets (< 50 entries)
- Default 10 per page works well
- Can increase to 100 to see all at once
- Minimal navigation needed

### For Medium Datasets (50-500 entries)
- Use 10 for detailed review
- Use 100 for quick scanning or bulk operations
- Navigate pages for chronological review

### For Large Datasets (> 500 entries)
- Use filters to narrow down data first
- Then use appropriate page size
- Use 1000 when needing to select many entries
- Combine with sorting for most relevant data first

### When Exporting Data
- Pagination doesn't affect exports
- All filtered data is exported, not just current page
- No need to paginate through all pages before exporting

## Accessibility

- Keyboard navigation supported (tab through buttons)
- Clear visual feedback for disabled states
- Descriptive titles on navigation buttons
- Screen reader friendly text labels
- No color-only indicators (uses text + color)

## Future Enhancements

Potential improvements for future versions:
- Remember pagination settings in localStorage
- Jump to specific page number input
- Keyboard shortcuts (arrow keys for page navigation)
- Custom page size entry
- "Show all" option for advanced users
- URL parameter for deep linking to specific pages

## Related Features

- **Filtering**: Works together with pagination (filters then paginates)
- **Sorting**: Sorts all data, then paginates
- **Selection**: Can select entries across multiple pages
- **Export**: Exports all filtered data regardless of pagination

## Support Notes

**Q: Why do I see fewer entries than my page size?**
A: You're likely on the last page where remaining entries < page size

**Q: My totals don't match the visible entries**
A: The footer shows totals for ALL filtered results, not just current page

**Q: I changed filters and ended up on page 1**
A: This is intentional to prevent landing on empty pages after filtering

**Q: Can I bookmark a specific page?**
A: Not currently - pagination resets on page reload (future enhancement)

## Version History

### v1.5 (December 2025)
- Initial pagination implementation
- Three page size options (10, 100, 1000)
- Full navigation controls
- Auto-reset on filter changes
- Responsive design
- Total preservation in footer
- Dynamic device count in Data Table tab label
  - Shows number of unique devices/nodes in filtered results
  - Updates in real-time as filters change
  - Format: "Data Table (X devices)"
