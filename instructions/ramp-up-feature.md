# Ramp-Up Usage Feature Documentation

## Overview

The Ramp-Up Usage feature models the realistic gradual activation of Unity Node licenses over time. Instead of assuming all licenses go live immediately on day one, this feature allows users to configure different adoption curves for self-run and leased licenses, providing much more accurate financial projections and break-even calculations.

## Why Ramp-Up Matters

Real-world network adoption doesn't happen overnight. Several factors contribute to gradual license activation:

- **Finding License Operators**: Leasing licenses requires finding and onboarding individual operators
- **Device Procurement**: Phones need to be purchased and configured
- **Network Setup**: Technical setup and testing takes time
- **Market Maturity**: Early adopters vs. mainstream adoption patterns
- **Operational Scaling**: Managing larger networks requires time to build processes

## Feature Components

### Ramp-Up Curves

The feature provides five predefined adoption curves:

#### 1. **Immediate** (100% from day 1)
- **Use Case**: Theoretical maximum, for comparison purposes
- **Realism**: Unrealistic for most scenarios

#### 2. **Linear** (Steady growth)
- **Pattern**: Equal percentage activation each month
- **Use Case**: Predictable, structured deployment
- **Example**: 6-month ramp-up = 16.7% activation per month

#### 3. **S-Curve Moderate** (Slow start, accelerates, plateaus)
- **Pattern**: Logistic growth curve (most realistic)
- **Use Case**: Natural market adoption patterns
- **Characteristics**: Slow initial adoption, rapid middle phase, eventual saturation

#### 4. **Aggressive** (Fast initial ramp-up)
- **Pattern**: Accelerated S-curve, shifted left
- **Use Case**: Well-funded operations with strong marketing
- **Characteristics**: Quick initial traction, rapid scaling

#### 5. **Conservative** (Very gradual adoption)
- **Pattern**: Extended S-curve, shifted right
- **Use Case**: Conservative estimates, challenging markets
- **Characteristics**: Very slow initial adoption, prolonged growth phase

### Separate Curves for License Types

The feature allows different adoption patterns for:
- **Self-Run Licenses**: Licenses you operate directly
- **Leased Licenses**: Licenses operated by others

This is important because:
- Self-run licenses depend on your operational capacity
- Leased licenses depend on finding willing operators
- Different markets may have different adoption rates

### Configurable Duration

- **Range**: 1-12 months
- **Default**: 6 months
- **Impact**: Longer durations = more gradual activation = extended break-even periods

### Cost Scaling

Costs are scaled proportionally with license activation:

#### Phone Costs
- **Scaling**: Purchased as licenses become active
- **Logic**: `phoneCost = totalPhoneCost × (activeLicenses / totalLicenses)`
- **Rationale**: Buy phones only when needed

#### SIM Costs
- **Scaling**: Only for active self-run licenses
- **Logic**: `simCost = simMonthly × activeSelfRunLicenses`
- **Rationale**: SIM cards only needed for operational devices

#### Credit Costs
- **Scaling**: Based on active licenses
- **Logic**: If operator pays credits: `creditCost = monthlyCredits × activeLicenses`
- **Rationale**: Credits consumed based on actual network participation

#### Node Costs
- **Scaling**: One-time upfront cost (no scaling)
- **Rationale**: Nodes are purchased regardless of license activation timing

## Financial Impact

### Break-Even Calculations

**With Ramp-Up**: Break-even calculated based on actual monthly cash flows
- Accounts for periods with low/zero revenue during ramp-up
- More realistic timelines (typically 2-6 months longer)

**Without Ramp-Up**: Simple division of initial investment by monthly profit
- Assumes immediate full revenue
- Often overly optimistic

### ROI Calculations

**12-Month ROI**: Based on actual cumulative profits over first 12 months
**24-Month ROI**: Based on actual cumulative profits over first 24 months

### Cash Flow Modeling

The feature provides realistic cash flow projections showing:
- **Initial Period**: Negative cash flow (costs without revenue)
- **Ramp-Up Phase**: Improving cash flow as more licenses activate
- **Full Operation**: Stable cash flow once all licenses are active

## Visual Indicators

### Ramp-Up Preview Chart
- Shows percentage activation over time
- Separate lines for self-run vs leased licenses
- Interactive tooltips with exact percentages

### Profit Over Time Chart
- Updates to show actual ramp-up curve vs. straight-line projection
- Helps visualize the impact of gradual adoption

## Usage Scenarios

### Scenario 1: Conservative Planning
- **Duration**: 9 months
- **Self-run**: Moderate S-curve
- **Leased**: Conservative curve
- **Result**: Realistic break-even, lower risk of disappointment

### Scenario 2: Aggressive Growth
- **Duration**: 3 months
- **Self-run**: Aggressive curve
- **Leased**: Moderate curve
- **Result**: Faster break-even, higher risk if targets not met

### Scenario 3: Mixed Strategy
- **Duration**: 6 months
- **Self-run**: Immediate (you control timing)
- **Leased**: Moderate (depends on finding operators)
- **Result**: Balanced approach acknowledging different constraints

## Best Practices

### Curve Selection Guidelines

**Choose Conservative Curves For:**
- New markets or unproven business models
- Limited marketing budget
- Complex regulatory environments
- First-time network operators

**Choose Aggressive Curves For:**
- Proven business models
- Strong marketing and partnerships
- Competitive advantages
- Experienced operators with established processes

### Duration Recommendations

**Short Duration (1-3 months):**
- High operational capacity
- Existing user base
- Simple market entry

**Medium Duration (4-6 months):**
- Most common scenario
- Balanced risk/reward
- Allows time for learning and adjustment

**Long Duration (7-12 months):**
- Challenging markets
- Complex regulatory requirements
- Conservative financial planning

## Integration with Other Features

### Uptime Multipliers
Ramp-up percentages are multiplied by uptime percentages:
```
Effective Revenue = Base Revenue × Ramp-Up % × Uptime %
```

### Scenario Management
Ramp-up settings are saved with scenarios and included in:
- Scenario comparison tables
- PDF exports
- URL sharing

## Technical Implementation

### Curve Mathematics

**S-Curve Formula**: `percentage = 100 / (1 + e^(-k*(x-x0)))`
- **e**: Euler's number (≈2.718)
- **k**: Steepness factor
- **x0**: Center point of the curve
- **x**: Normalized time (0 to duration)

### Monthly Calculations

For each month in the projection period:
1. Calculate ramp-up percentage for self-run licenses
2. Calculate ramp-up percentage for leased licenses
3. Apply uptime multipliers
4. Calculate effective license counts
5. Calculate revenue and costs for that month
6. Accumulate for financial metrics

## Validation and Testing

The feature has been tested with various scenarios to ensure:

- **Mathematical Accuracy**: Curves integrate properly over time
- **Financial Consistency**: Revenue and costs balance correctly
- **User Experience**: Intuitive controls and clear visualizations
- **Performance**: Calculations complete within acceptable time frames

## Future Enhancements

Potential improvements for future versions:
- Custom curve creation with drag-and-drop interface
- Historical data import for curve calibration
- Market-specific default curves
- Integration with external adoption modeling tools




