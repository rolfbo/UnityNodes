/**
 * Constants and configuration data for the ROI Calculator
 */

// Node pricing
export const NODE_PRICE = 5000;

// Ecosystem-Wide Constants
export const TOTAL_NODES_IN_ECOSYSTEM = 6000;

// Market share scenarios based on the table (using 1.2M license row)
// Assuming $208/month = 7GB per device (max capacity)
// Revenue scales linearly with data traffic
export const marketScenarios = {
    conservative: { share: 1, revenuePerLicense: 208, dataGB: 7, totalLicenses: 1.2, label: "1% Market Share" },
    moderate: { share: 5, revenuePerLicense: 1042, dataGB: 35, totalLicenses: 6.0, label: "5% Market Share" },
    optimistic: { share: 10, revenuePerLicense: 2083, dataGB: 70, totalLicenses: 12.0, label: "10% Market Share" }
};

// Ramp-up curves for license activation over time
export const rampUpCurves = {
    immediate: {
        name: "Immediate",
        description: "All licenses active from day 1",
        getPercentage: (month, duration) => 100
    },
    linear: {
        name: "Linear",
        description: "Steady growth each month",
        getPercentage: (month, duration) => Math.min(100, (month / duration) * 100)
    },
    moderate: {
        name: "S-Curve Moderate",
        description: "Slow start, accelerates, then plateaus",
        getPercentage: (month, duration) => {
            const x = (month / duration) * 12 - 6; // Scale to -6 to 6
            return Math.min(100, Math.max(0, 100 / (1 + Math.exp(-x))));
        }
    },
    aggressive: {
        name: "Aggressive",
        description: "Fast initial ramp-up",
        getPercentage: (month, duration) => {
            const x = (month / duration) * 8 - 2; // Shifted S-curve
            return Math.min(100, Math.max(0, 100 / (1 + Math.exp(-x))));
        }
    },
    slow: {
        name: "Conservative",
        description: "Very gradual adoption",
        getPercentage: (month, duration) => {
            const x = (month / duration) * 16 - 10; // Stretched S-curve
            return Math.min(100, Math.max(0, 100 / (1 + Math.exp(-x))));
        }
    }
};

// DePIN competitor reference data
export const competitiveNetworks = {
    helium: { name: "Helium Mobile", revenuePerDevice: 30, description: "5G hotspot network" },
    natix: { name: "NATIX Network", revenuePerDevice: 50, description: "AI camera network" },
    hivemapper: { name: "Hivemapper", revenuePerDevice: 40, description: "Decentralized mapping" }
};

// Revenue per verification assumption
export const ASSUMED_REVENUE_PER_VERIFICATION = 0.005;
