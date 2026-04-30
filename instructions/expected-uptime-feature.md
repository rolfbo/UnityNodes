# Expected Uptime Feature Documentation

## Overview

The Expected Uptime feature has been added to the Unity Nodes ROI Calculator to account for the realistic scenario where not all licenses verify at all times. This feature allows users to adjust for device downtime, maintenance, and network issues that can reduce actual revenue compared to theoretical maximums.

## What is Uptime?

Uptime in the context of Unity Nodes refers to the percentage of time that licenses are actively participating in network verification tasks and generating revenue. Real-world factors can cause devices to be offline:

- **Device Downtime**: Hardware failures, power outages, or device restarts
- **Maintenance**: Scheduled updates, software patches, or troubleshooting
- **Network Issues**: Connectivity problems, SIM card issues, or network outages
- **User Management**: Manual intervention required for leased licenses

## Feature Implementation

### User Interface

The Expected Uptime section is located between the License Distribution and Operating Costs sections. It contains:

- **Self-Run License Uptime**: Controls uptime for licenses you operate yourself
- **Leased License Uptime**: Controls uptime for licenses leased to others
- **Quick-select buttons**: Common uptime percentages (90%, 95%, 98%, 99.5%, 100%)
- **Manual input**: Precise percentage control (0-100%)
- **Effective license display**: Shows actual effective licenses after uptime adjustment

### Technical Details

#### State Management
- `uptimeSelfRun`: Percentage (0-100) for self-operated licenses
- `uptimeLeased`: Percentage (0-100) for leased licenses
- Both default to 95% and are persisted using `usePersistentState`

#### Revenue Calculations
Uptime multipliers are applied to revenue calculations:

```javascript
revenueFromSelfRun = totalLicensesRunBySelf * revenuePerLicense * (uptimeSelfRun / 100);
revenueFromLeased = totalLicensesLeased * revenuePerLicense * (leaseSplitToOperator / 100) * (uptimeLeased / 100);
```

#### URL Sharing
Uptime parameters are included in shareable URLs:
- `uptimeSelfRun`: Self-run uptime percentage
- `uptimeLeased`: Leased uptime percentage

#### Scenario Management
Uptime settings are saved with scenarios and displayed in comparison tables.

#### PDF Export
Uptime information is included in PDF reports with:
- Self-run and leased uptime percentages
- Effective license counts
- Revenue impact calculations

## Typical Uptime Scenarios

### Conservative Estimates (90%)
- **Description**: Accounts for regular maintenance, occasional network issues
- **Use Case**: Conservative financial planning
- **Impact**: 10% reduction in revenue compared to 100% uptime

### Moderate Estimates (95%)
- **Description**: Default setting, reasonable for well-maintained operations
- **Use Case**: Most real-world scenarios
- **Impact**: 5% reduction in revenue compared to 100% uptime

### Optimistic Estimates (98%)
- **Description**: High uptime for professional operations with redundancy
- **Use Case**: Enterprise-grade setups with monitoring and backup systems
- **Impact**: 2% reduction in revenue compared to 100% uptime

### Enterprise Estimates (99.5%)
- **Description**: Very high uptime with automated monitoring and failover
- **Use Case**: Large-scale operations with dedicated technical staff
- **Impact**: 0.5% reduction in revenue compared to 100% uptime

### Perfect Uptime (100%)
- **Description**: Theoretical maximum, no downtime
- **Use Case**: Academic calculations or comparison baselines
- **Impact**: No reduction in revenue

## Impact on ROI Calculations

Uptime directly affects all ROI calculations by reducing effective revenue:

- **Monthly Revenue**: Reduced by uptime percentage
- **Break-even Period**: Extended due to lower monthly profits
- **ROI Percentage**: Lower due to reduced returns
- **Annual Profit**: Reduced proportionally to uptime

## Visual Indicators

The calculator displays effective license counts throughout the interface:

- **Revenue Breakdown Cards**: Show effective vs. total licenses
- **Uptime Section Summary**: Combined uptime impact
- **Key Assumptions**: Current uptime settings and effective license counts
- **Scenario Comparison**: Uptime values in comparison tables

## Best Practices

1. **Start Conservative**: Begin with 95% uptime for realistic planning
2. **Monitor Performance**: Track actual uptime over time and adjust accordingly
3. **Account for Leasing**: Leased licenses may have different uptime than self-run licenses
4. **Factor in Scale**: Larger operations may achieve higher uptime through redundancy
5. **Regular Updates**: Reassess uptime assumptions as your operation matures

## Implementation Notes

- Uptime affects revenue only, not costs (costs are fixed regardless of uptime)
- Separate controls allow for different reliability expectations between self-run and leased operations
- All calculations update in real-time as uptime values change
- Uptime settings are preserved between sessions and shared via URLs

