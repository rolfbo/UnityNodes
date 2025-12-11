# Earnings Target Calculator

## Overview

The Earnings Target Calculator is a new feature in the Unity Nodes ROI Calculator that helps users determine exactly how much each active node license needs to earn to achieve a specific revenue goal. This calculator automatically factors in operational costs and integrates with both the ROI Calculator parameters and actual earnings data from the Earnings Tracker.

## Purpose

When running Unity Nodes, operators often want to know:
- How much revenue do I want to generate per month/year?
- How many licenses do I have active?
- What does each license need to earn to reach my revenue target?
- How do my current earnings compare to my target?

The Earnings Target Calculator answers these questions by calculating the required earnings per license while accounting for all operational costs.

## How It Works

### Input Parameters

1. **Target Revenue ($)**: The total revenue amount you want to achieve
   - Example: $10,000 per month
   - Can be any positive number

2. **Active Licenses**: Number of licenses that are actively running and earning
   - This defaults to your total active licenses from the ROI Calculator
   - Can be adjusted independently for "what-if" scenarios

3. **Time Period**: The time frame for the calculation
   - **Monthly**: Target is monthly revenue
   - **Yearly**: Target is annual revenue
   - **Daily**: Target is daily revenue

### Calculation Logic

The calculator performs the following calculations:

#### 1. Gross Earnings Needed
```
Gross Earnings Needed = Target Revenue ÷ Number of Active Licenses
```
This is the pure revenue each license needs to generate before costs.

#### 2. Operating Costs Per License
The calculator automatically pulls cost data from your ROI Calculator setup:
- **Hardware Amortization**: Your phone/device costs spread over 24 months
- **SIM Card Costs**: Monthly SIM card fees
- **Unity Credits**: Monthly credit costs (if you pay them)

#### 3. Net Earnings Required
```
Net Earnings Required = Gross Earnings Needed + Operating Costs Per License
```
This is the actual earnings each license needs to generate after accounting for costs.

### Cost Breakdown Details

**Hardware Amortization:**
- Formula: `(Phone Price × Number of Nodes × Licenses per Node) ÷ (Total Active Licenses × 24)`
- Spreads hardware costs over 2 years (24 months)

**SIM Card Costs:**
- Direct monthly cost per license
- Usually $10/month per device

**Unity Credits:**
- Only included if "Node Operator Pays Credits" is enabled in ROI Calculator
- Typically $1.99/month per license

## Integration Features

### ROI Calculator Integration

The Earnings Target Calculator automatically uses your current ROI Calculator settings:
- Number of nodes and licenses per node
- Hardware costs and SIM card costs
- Unity credits configuration
- License distribution (self-run vs leased)

**Benefits:**
- No need to re-enter cost data
- Automatically syncs when you change ROI parameters
- Consistent calculations across the entire app

### Earnings Tracker Integration

If you have earnings data in the Earnings Tracker, the calculator shows:

**Current Average Earnings:**
- Your actual average earnings per transaction from historical data

**Gap Analysis:**
- How much more (or less) you're currently earning compared to target
- Shows if you're over or under-performing

**Progress Indicator:**
- Visual progress bar showing percentage toward your target
- Helps track improvement over time

## User Interface

### Main Display Cards

The calculator shows results in four main cards:

1. **Target Summary**: Shows your input parameters
2. **Gross Earnings Needed**: Revenue required before costs
3. **Operating Costs**: Total costs per license per period
4. **Net Earnings Required**: Final amount each license needs to earn

### Daily Earnings Display (Always Visible)

**Prominent Header Card:**
- **Daily Earnings Required**: Always shows the daily amount each license needs to earn
- **Conversion Logic**: Automatically converts from your selected time period:
  - Monthly target ÷ 30 days
  - Yearly target ÷ 365 days
  - Daily target shown as-is
- **Visual Design**: Yellow/amber gradient card with clock icon for prominence
- **Context**: Shows both daily amount and original period reference

**Why Always Visible:**
- Daily earnings are the most practical metric for node operators
- Helps with day-to-day planning and performance tracking
- Provides immediate understanding regardless of target period chosen

### Cost Breakdown Section

Detailed breakdown of how costs are calculated:
- Hardware amortization amount
- SIM card costs
- Unity credits costs
- All shown per license per month

### Actual Earnings Comparison (if data available)

When earnings data exists:
- Current average earnings display
- Gap to target (positive = shortfall, negative = surplus)
- Progress bar with percentage completion

## Usage Examples

### Example 1: Monthly Revenue Target
- **Target Revenue**: $10,000 per month
- **Active Licenses**: 100
- **Time Period**: Monthly
- **Result**: Each license needs to earn $100/month after costs

### Example 2: Yearly Revenue Goal
- **Target Revenue**: $50,000 per year
- **Active Licenses**: 50
- **Time Period**: Yearly
- **Result**: Each license needs to earn ~$833/month after costs

### Example 3: Daily Earnings Check
- **Target Revenue**: $100 per day
- **Active Licenses**: 20
- **Time Period**: Daily
- **Result**: Each license needs to earn $5/day after costs

## Important Notes

### Cost Assumptions

- Hardware costs are amortized over 24 months
- SIM costs are monthly recurring
- Unity credits are only included if you pay them
- Leased licenses are handled correctly (you only get your split)

### Data Accuracy

- Calculations are based on your ROI Calculator parameters
- Actual earnings may vary due to network conditions
- Hardware costs assume linear depreciation
- SIM costs assume consistent monthly billing

### Integration Limitations

- Earnings comparison is simplified (uses transaction averages)
- Does not account for license uptime variations
- Assumes costs are evenly distributed across licenses

## Troubleshooting

### No Earnings Data Showing
- Make sure you have data in the Earnings Tracker
- Check that earnings are properly parsed and mapped to license types
- Refresh the page if data doesn't appear

### Incorrect Cost Calculations
- Verify your ROI Calculator parameters are correct
- Check that hardware costs, SIM costs, and credits are properly set
- Ensure license distribution adds up correctly

### Unrealistic Results
- Very high earnings requirements may indicate unrealistic targets
- Check your market share scenario in the ROI Calculator
- Consider adjusting your target or adding more licenses

## Future Enhancements

Potential improvements for future versions:
- More sophisticated cost allocation models
- License uptime integration
- Historical trend analysis
- Goal tracking over time
- Export functionality for reports
- Integration with tax calculations