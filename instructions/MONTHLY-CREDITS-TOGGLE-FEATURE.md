# Monthly Credits Toggle Feature

## Overview
This document explains the Monthly Credits toggle feature that allows users to indicate whether Unity Network credits are currently active and need to be paid for their phones/licenses.

## Purpose
Monthly credits are fees required to participate in network verification tasks. However, these credits may not always be active or required. When credits are inactive, there's no need to pay these fees, so they should not be included in cost calculations. This feature gives users control over whether credit costs are applied in their ROI calculations.

## How It Works

### User Interface
Located in the "Operating Costs per Phone/License" section, users will see:

1. **Credits Active/Inactive Toggle**
   - A prominent checkbox with amber/yellow highlighting
   - When **CHECKED**: Credits are ACTIVE (fees apply)
   - When **UNCHECKED**: Credits are INACTIVE (no fees)
   - Clear visual indicator shows the current status

2. **Credit Amount Controls**
   - Quick-select buttons for common values ($1.99, $2.99, $3.99)
   - Custom input field for any amount
   - These controls are **disabled** when credits are inactive (visual opacity reduced)

3. **Who Pays Credits** (only visible when credits are active)
   - Checkbox to specify if the node operator pays credits for leased licenses
   - Hidden when credits are inactive since it's not relevant

4. **Cost Summary**
   - Shows total monthly credit costs when active
   - Shows "$0/mo (no credit fees being paid)" when inactive

### Backend Calculation Logic

#### State Management
- New state variable: `creditsActive` (boolean, defaults to `false`)
- Persisted in localStorage as `roi_creditsActive`
- Included in URL sharing parameters
- Saved/loaded with scenario presets

#### Effective Credits Calculation
Throughout all calculations, an "effective credits" value is used:

```javascript
const effectiveMonthlyCredits = creditsActive ? monthlyCredits : 0;
```

This means:
- **When credits are active**: Normal credit amount is used in calculations
- **When credits are inactive**: $0 is used, eliminating all credit costs

#### Affected Calculations

1. **Monthly Credit Costs**
   ```javascript
   const monthlyCreditCostSelfRun = totalLicensesRunBySelf * effectiveMonthlyCredits;
   const monthlyCreditCostLeased = nodeOperatorPaysCredits ? (totalLicensesLeased * effectiveMonthlyCredits) : 0;
   ```

2. **Ramp-Up Costs** (during scaling period)
   ```javascript
   const rampedCreditCost = nodeOperatorPaysCredits ?
       totalActiveLicenses * effectiveMonthlyCredits :
       (totalLicensesRunBySelf * selfRunPercent * effectiveMonthlyCredits);
   ```

3. **Average Costs Per Node** (for ecosystem calculations)
   ```javascript
   const avgMonthlyCreditCostPerNode = avgActiveLicensesPerNode * effectiveMonthlyCreditsCost;
   ```

4. **Operating Costs Per License**
   ```javascript
   const effectiveCredits = creditsActive ? monthlyCredits : 0;
   const creditsCostPerLicenseMonthly = nodeOperatorPaysCredits ? effectiveCredits : 0;
   ```

## User Experience

### Default Behavior
- Credits start as **INACTIVE** (unchecked) by default
- This reflects the common scenario where credits may not yet be required
- Users must actively check the box to include credit costs

### Visual Feedback
- **Amber/yellow color scheme** makes the toggle highly visible
- Disabled state (when inactive) clearly shows which controls are not applicable
- Real-time cost updates show immediate impact of toggling credits on/off

### Data Persistence
The credits active state is:
- Saved in browser localStorage (persists between sessions)
- Included in shareable URLs (allows sharing scenarios with specific credit states)
- Saved with scenario presets (load complete configurations including credit status)

## PDF Export
When exporting calculations to PDF, the Monthly Credits line shows:
- `Monthly Credits: $X.XX (Active)` - when credits are enabled
- `Monthly Credits: $X.XX (Inactive)` - when credits are disabled

This ensures the PDF clearly indicates whether credit costs are included in the analysis.

## Use Cases

### Scenario 1: Credits Not Yet Available
If Unity Network credits are not yet launched or available:
- Keep the checkbox **UNCHECKED**
- All calculations will show $0 for credit costs
- You can still set the expected credit amount for future planning

### Scenario 2: Credits Became Active
When credits become active:
- **CHECK** the box
- Credit costs immediately apply to all calculations
- Choose who pays (node operator for all, or license operators for leased ones)

### Scenario 3: Comparing Scenarios
Create and compare two scenarios:
- Scenario A: Credits inactive (current state)
- Scenario B: Credits active (future state)
- See the financial impact of credits being introduced

## Technical Implementation Details

### Files Modified
- `roi-calculator-app/src/ROICalculatorApp.jsx`

### New State Variable
```javascript
const [creditsActive, setCreditsActive] = usePersistentState('roi_creditsActive', false);
```

### Key Functions Updated
1. Monthly cost calculations (line ~340)
2. Ramp-up cost calculations (line ~280)
3. Average per-node costs (line ~480)
4. Operating costs per license (line ~610)
5. URL parameter handling (lines ~80, ~105, ~147)
6. Scenario save/load (lines ~732, ~769)
7. PDF export (line ~817)

## Testing Recommendations

1. **Toggle Test**: Switch the checkbox on/off and verify costs update correctly
2. **Persistence Test**: Refresh the page and verify the toggle state is remembered
3. **URL Sharing Test**: Share a URL and verify the credits state is preserved
4. **Scenario Test**: Save and load scenarios with different credit states
5. **Calculation Accuracy**: Verify that when inactive, all credit costs show as $0
6. **PDF Export Test**: Generate PDFs with both active and inactive states

## Beginner-Friendly Explanation

Think of this feature like a light switch for monthly credit fees:

- **Switch OFF** (unchecked): The credit fees don't exist yet, so you pay $0
- **Switch ON** (checked): The credit fees are now active, and you must pay them

When you turn the switch off, everything related to credits either disappears or shows as $0. This way, your calculations only include costs that you're actually paying right now.

The amount you set (like $1.99 or $2.99) is saved even when credits are inactive, so when you turn them back on, your preferred amount is already there. This makes it easy to plan for the future without cluttering your current calculations.

## Version History
- **v1.0** (December 25, 2024) - Initial implementation of credits toggle feature
