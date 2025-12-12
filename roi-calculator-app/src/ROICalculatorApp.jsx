/**
 * Unity Nodes ROI Calculator Component
 *
 * This React component provides an interactive web-based calculator for estimating
 * Return on Investment (ROI) for Unity Nodes network participation. It allows users
 * to input various parameters and calculates potential revenue streams, costs, and
 * profitability metrics for running Unity Nodes.
 *
 * Key Features:
 * - Interactive parameter input with real-time calculations
 * - Multiple market share scenarios (conservative, moderate, optimistic)
 * - License distribution management (self-run vs leased)
 * - Cost analysis including hardware, SIM cards, and credits
 * - Revenue projections with different earning models
 * - Visual dashboard with charts and key metrics
 * - Comprehensive disclaimer for financial considerations
 *
 * The calculator helps users understand the financial implications of participating
 * in the Unity Nodes network by modeling different operational strategies and
 * market conditions.
 *
 * @component
 * @returns {JSX.Element} The complete ROI calculator interface
 */

import React, { useState, useEffect } from 'react';
import { DollarSign, Smartphone, CreditCard, Package, TrendingUp, Users, BarChart3, PieChart, HelpCircle, Info, Share2, Download, Clock, AlertTriangle, Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { usePersistentState } from './utils/usePersistentState.js';
import { loadEarnings, getEarningsStats } from './utils/earningsStorage.js';
import { getAllLicenses, getLicenseStats } from './utils/licenseStorage.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Tooltip component for help text
const HelpTooltip = ({ content, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="inline-flex items-center cursor-help"
            >
                {children}
                <HelpCircle size={14} className="ml-1 text-purple-400 hover:text-purple-300" />
            </div>
            {show && (
                <div className="absolute z-50 w-64 p-3 bg-slate-800 border border-purple-400/30 rounded-lg shadow-lg text-sm text-purple-200 left-0 top-full mt-1">
                    {content}
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-purple-400/30 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

export default function UnityNodesROICalculator() {

    // Number formatting function for proper locale formatting
    const formatNumber = (number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    };

    // URL parameter handling
    const getUrlParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            numNodes: params.get('numNodes'),
            licensesPerNode: params.get('licensesPerNode'),
            licensesRunBySelf: params.get('licensesRunBySelf'),
            licensesLeased: params.get('licensesLeased'),
            licensesInactive: params.get('licensesInactive'),
            phonePrice: params.get('phonePrice'),
            simMonthly: params.get('simMonthly'),
            monthlyCredits: params.get('monthlyCredits'),
            nodeOperatorPaysCredits: params.get('nodeOperatorPaysCredits'),
            revenuePerLicense: params.get('revenuePerLicense'),
            leaseSplitToOperator: params.get('leaseSplitToOperator'),
            usdToEur: params.get('usdToEur'),
            marketShareScenario: params.get('marketShareScenario'),
            uptimeSelfRun: params.get('uptimeSelfRun'),
            uptimeLeased: params.get('uptimeLeased'),
            rampUpEnabled: params.get('rampUpEnabled'),
            rampUpDuration: params.get('rampUpDuration'),
            selfRunRampCurve: params.get('selfRunRampCurve'),
            leasedRampCurve: params.get('leasedRampCurve')
        };
    };

    const generateShareUrl = () => {
        const params = new URLSearchParams();
        params.set('numNodes', numNodes.toString());
        params.set('licensesPerNode', licensesPerNode.toString());
        params.set('licensesRunBySelf', licensesRunBySelf.toString());
        params.set('licensesLeased', licensesLeased.toString());
        params.set('licensesInactive', licensesInactive.toString());
        params.set('phonePrice', phonePrice.toString());
        params.set('simMonthly', simMonthly.toString());
        params.set('monthlyCredits', monthlyCredits.toString());
        params.set('nodeOperatorPaysCredits', nodeOperatorPaysCredits.toString());
        params.set('revenuePerLicense', revenuePerLicense.toString());
        params.set('leaseSplitToOperator', leaseSplitToOperator.toString());
        params.set('usdToEur', usdToEur.toString());
        params.set('marketShareScenario', marketShareScenario);
        params.set('uptimeSelfRun', uptimeSelfRun.toString());
        params.set('uptimeLeased', uptimeLeased.toString());
        params.set('rampUpEnabled', rampUpEnabled.toString());
        params.set('rampUpDuration', rampUpDuration.toString());
        params.set('selfRunRampCurve', selfRunRampCurve);
        params.set('leasedRampCurve', leasedRampCurve);

        // Earnings Target Calculator parameters
        params.set('targetRevenue', targetRevenue.toString());
        params.set('targetTimePeriod', targetTimePeriod);
        params.set('activeLicensesCount', activeLicensesCount.toString());
        params.set('earningsTargetExpanded', earningsTargetExpanded.toString());

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    // Load from URL params on component mount
    useEffect(() => {
        const urlParams = getUrlParams();

        if (urlParams.numNodes) setNumNodes(Math.max(1, parseInt(urlParams.numNodes) || 1));
        if (urlParams.licensesPerNode) setLicensesPerNode(Math.max(1, parseInt(urlParams.licensesPerNode) || 200));
        if (urlParams.licensesRunBySelf) setLicensesRunBySelf(Math.max(0, parseFloat(urlParams.licensesRunBySelf) || 0));
        if (urlParams.licensesLeased) setLicensesLeased(Math.max(0, parseFloat(urlParams.licensesLeased) || 0));
        if (urlParams.licensesInactive) setLicensesInactive(Math.max(0, parseFloat(urlParams.licensesInactive) || 0));
        if (urlParams.phonePrice) setPhonePrice(Math.max(0, parseInt(urlParams.phonePrice) || 0));
        if (urlParams.simMonthly) setSimMonthly(Math.max(0, parseInt(urlParams.simMonthly) || 0));
        if (urlParams.monthlyCredits) setMonthlyCredits(Math.max(0, parseFloat(urlParams.monthlyCredits) || 0));
        if (urlParams.nodeOperatorPaysCredits) setNodeOperatorPaysCredits(urlParams.nodeOperatorPaysCredits === 'true');
        if (urlParams.revenuePerLicense) setRevenuePerLicense(Math.max(0, parseFloat(urlParams.revenuePerLicense) || 0));
        if (urlParams.leaseSplitToOperator) setLeaseSplitToOperator(Math.min(100, Math.max(0, parseInt(urlParams.leaseSplitToOperator) || 0)));
        if (urlParams.usdToEur) setUsdToEur(Math.max(0, parseFloat(urlParams.usdToEur) || 0.92));
        if (urlParams.marketShareScenario) setMarketShareScenario(urlParams.marketShareScenario);
        if (urlParams.uptimeSelfRun) setUptimeSelfRun(Math.min(100, Math.max(0, parseFloat(urlParams.uptimeSelfRun) || 95)));
        if (urlParams.uptimeLeased) setUptimeLeased(Math.min(100, Math.max(0, parseFloat(urlParams.uptimeLeased) || 95)));
        if (urlParams.rampUpEnabled !== undefined) setRampUpEnabled(urlParams.rampUpEnabled === 'true');
        if (urlParams.rampUpDuration) setRampUpDuration(Math.min(12, Math.max(1, parseInt(urlParams.rampUpDuration) || 6)));
        if (urlParams.selfRunRampCurve && rampUpCurves[urlParams.selfRunRampCurve]) setSelfRunRampCurve(urlParams.selfRunRampCurve);
        if (urlParams.leasedRampCurve && rampUpCurves[urlParams.leasedRampCurve]) setLeasedRampCurve(urlParams.leasedRampCurve);

        // Earnings Target Calculator parameters
        if (urlParams.targetRevenue) setTargetRevenue(Math.max(0, parseFloat(urlParams.targetRevenue) || 10000));
        if (urlParams.targetTimePeriod) setTargetTimePeriod(urlParams.targetTimePeriod);
        if (urlParams.activeLicensesCount) setActiveLicensesCount(Math.max(1, parseInt(urlParams.activeLicensesCount) || 100));
        if (urlParams.earningsTargetExpanded !== undefined) setEarningsTargetExpanded(urlParams.earningsTargetExpanded === 'true');
    }, []);

    // Node Configuration
    const [numNodes, setNumNodes] = usePersistentState('roi_numNodes', 4);
    const nodePrice = 5000;
    const [licensesPerNode, setLicensesPerNode] = usePersistentState('roi_licensesPerNode', 200);

    // Ecosystem-Wide Constants for Reality Check
    // These represent the total maximum capacity of the Unity Nodes network
    const TOTAL_NODES_IN_ECOSYSTEM = 6000; // Maximum nodes available in the ecosystem
    const TOTAL_LICENSES_IN_ECOSYSTEM = TOTAL_NODES_IN_ECOSYSTEM * licensesPerNode; // Total licenses across all nodes

    // Exchange rate
    const [usdToEur, setUsdToEur] = usePersistentState('roi_usdToEur', 0.92); // Conservative EUR/USD rate

    // License Distribution
    const [licensesRunBySelf, setLicensesRunBySelf] = usePersistentState('roi_licensesRunBySelf', 0); // Per node
    const [licensesLeased, setLicensesLeased] = usePersistentState('roi_licensesLeased', 150); // Per node
    const [licensesInactive, setLicensesInactive] = usePersistentState('roi_licensesInactive', 50); // Per node

    // Costs per phone/license
    const [phonePrice, setPhonePrice] = usePersistentState('roi_phonePrice', 80);
    const [simMonthly, setSimMonthly] = usePersistentState('roi_simMonthly', 10);
    const [monthlyCredits, setMonthlyCredits] = usePersistentState('roi_monthlyCredits', 1.99);
    const [nodeOperatorPaysCredits, setNodeOperatorPaysCredits] = usePersistentState('roi_nodeOperatorPaysCredits', true); // Toggle who pays credits

    // Revenue Model
    const [revenuePerLicense, setRevenuePerLicense] = usePersistentState('roi_revenuePerLicense', 75); // Monthly revenue per active license
    const [leaseSplitToOperator, setLeaseSplitToOperator] = usePersistentState('roi_leaseSplitToOperator', 40); // Node operator gets 40% when leasing

    // Market Share Scenario
    const [marketShareScenario, setMarketShareScenario] = usePersistentState('roi_marketShareScenario', 'conservative'); // conservative, moderate, optimistic

    // Expected Uptime (percentage of time licenses are active)
    const [uptimeSelfRun, setUptimeSelfRun] = usePersistentState('roi_uptimeSelfRun', 95); // Percentage for self-run licenses
    const [uptimeLeased, setUptimeLeased] = usePersistentState('roi_uptimeLeased', 95); // Percentage for leased licenses

    // Ramp-Up Configuration
    const [rampUpEnabled, setRampUpEnabled] = usePersistentState('roi_rampUpEnabled', false); // Enable ramp-up modeling - TEMPORARILY DISABLED
    const [rampUpDuration, setRampUpDuration] = usePersistentState('roi_rampUpDuration', 6); // Duration in months (1-12)
    const [selfRunRampCurve, setSelfRunRampCurve] = usePersistentState('roi_selfRunRampCurve', 'moderate'); // Curve type for self-run licenses
    const [leasedRampCurve, setLeasedRampCurve] = usePersistentState('roi_leasedRampCurve', 'slow'); // Curve type for leased licenses

    // Reality Check UI State
    const [realityCheckExpanded, setRealityCheckExpanded] = usePersistentState('roi_realityCheckExpanded', true); // Show/hide Reality Check section

    // License Utilization UI State
    const [licenseUtilizationExpanded, setLicenseUtilizationExpanded] = usePersistentState('roi_licenseUtilizationExpanded', true); // Show/hide License Utilization section

    // Earnings Target Calculator State
    const [targetRevenue, setTargetRevenue] = usePersistentState('roi_targetRevenue', 10000); // Target revenue amount ($)
    const [targetTimePeriod, setTargetTimePeriod] = usePersistentState('roi_targetTimePeriod', 'monthly'); // daily, monthly, yearly
    const [activeLicensesCount, setActiveLicensesCount] = usePersistentState('roi_activeLicensesCount', 100); // Number of active licenses
    const [earningsTargetExpanded, setEarningsTargetExpanded] = usePersistentState('roi_earningsTargetExpanded', true); // Show/hide Earnings Target Calculator section

    // Market share scenarios based on the table (using 1.2M license row)
    // Assuming $208/month = 7GB per device (max capacity)
    // Revenue scales linearly with data traffic
    const marketScenarios = {
        conservative: { share: 1, revenuePerLicense: 208, dataGB: 7, totalLicenses: 1.2, label: "1% Market Share" },
        moderate: { share: 5, revenuePerLicense: 1042, dataGB: 35, totalLicenses: 6.0, label: "5% Market Share" },
        optimistic: { share: 10, revenuePerLicense: 2083, dataGB: 70, totalLicenses: 12.0, label: "10% Market Share" }
    };

    // Ramp-up curves for license activation over time
    const rampUpCurves = {
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

    // Calculate ramped costs for a specific month
    const calculateRampedCosts = (month) => {
        if (!rampUpEnabled) {
            // Return standard costs if ramp-up is disabled
            return totalMonthlyCost;
        }

        const selfRunPercent = getRampUpPercentage(month, selfRunRampCurve, 'selfRun') / 100;
        const leasedPercent = getRampUpPercentage(month, leasedRampCurve, 'leased') / 100;

        // Phone costs: Scale with self-run licenses (phones are purchased as needed)
        const phonesActive = Math.ceil(totalLicensesRunBySelf * selfRunPercent);
        const rampedPhoneCost = (phonesActive / totalLicensesRunBySelf) * totalPhoneCost;

        // SIM costs: Scale with active self-run licenses
        const rampedSimCost = totalLicensesRunBySelf * selfRunPercent * simMonthly;

        // Credit costs: Scale with active licenses (self-run and leased if operator pays)
        const totalActiveLicenses = (totalLicensesRunBySelf * selfRunPercent) + (totalLicensesLeased * leasedPercent);
        const rampedCreditCost = nodeOperatorPaysCredits ?
            totalActiveLicenses * monthlyCredits :
            (totalLicensesRunBySelf * selfRunPercent * monthlyCredits);

        // Node costs remain upfront (one-time), so only include in month 1
        const nodeCost = month === 1 ? totalNodeCost : 0;

        return rampedPhoneCost + rampedSimCost + rampedCreditCost + nodeCost;
    };

    // Calculate ramped revenue for a specific month
    const calculateRampedRevenue = (month) => {
        if (!rampUpEnabled) {
            // Return standard revenue if ramp-up is disabled
            return totalMonthlyRevenue;
        }

        const selfRunPercent = getRampUpPercentage(month, selfRunRampCurve, 'selfRun') / 100;
        const leasedPercent = getRampUpPercentage(month, leasedRampCurve, 'leased') / 100;

        // Calculate effective licenses with ramp-up and uptime
        const effectiveSelfRun = totalLicensesRunBySelf * selfRunPercent * (uptimeSelfRun / 100);
        const effectiveLeased = totalLicensesLeased * leasedPercent * (uptimeLeased / 100);

        // Calculate revenue
        const revenueSelfRun = effectiveSelfRun * revenuePerLicense;
        const revenueLeased = effectiveLeased * revenuePerLicense * (leaseSplitToOperator / 100);

        return revenueSelfRun + revenueLeased;
    };

    // Get ramp-up percentage for a specific month
    const getRampUpPercentage = (month, curveType, licenseType) => {
        const curve = rampUpCurves[curveType];
        if (!curve) return 100; // Default to 100% if curve not found

        const duration = rampUpDuration;
        if (month >= duration) return 100; // Full activation after ramp-up period

        return curve.getPercentage(month, duration);
    };

    // Calculate totals
    const totalLicensesRunBySelf = numNodes * licensesRunBySelf;
    const totalLicensesLeased = numNodes * licensesLeased;
    const totalLicensesInactive = numNodes * licensesInactive;
    const totalActiveLicenses = totalLicensesRunBySelf + totalLicensesLeased;

    // Initial Investment
    const totalNodeCost = numNodes * nodePrice;
    const phonesNeeded = totalLicensesRunBySelf; // Only need phones for licenses we run
    const totalPhoneCost = phonesNeeded * phonePrice;
    const initialInvestment = totalNodeCost + totalPhoneCost;

    // Monthly costs
    const monthlySimCost = totalLicensesRunBySelf * simMonthly;

    // Credit costs depend on who pays
    const monthlyCreditCostSelfRun = totalLicensesRunBySelf * monthlyCredits;
    const monthlyCreditCostLeased = nodeOperatorPaysCredits ? (totalLicensesLeased * monthlyCredits) : 0;
    const monthlyCreditCost = monthlyCreditCostSelfRun + monthlyCreditCostLeased;

    const totalMonthlyCost = monthlySimCost + monthlyCreditCost;

    // Monthly revenue calculations
    const totalLicenses = numNodes * licensesPerNode;
    const grossMonthlyRevenue = totalLicenses * revenuePerLicense;

    // Revenue split based on leasing
    // revenuePerLicense is already the 75% after network fees
    // So for self-run: you get the full revenuePerLicense amount
    // For leased: you split the revenuePerLicense with the license operator
    // Apply uptime multipliers to account for device downtime
    const revenueFromSelfRun = totalLicensesRunBySelf * revenuePerLicense * (uptimeSelfRun / 100);

    // For leased licenses: split the revenue with license operator
    const revenueFromLeased = totalLicensesLeased * revenuePerLicense * (leaseSplitToOperator / 100) * (uptimeLeased / 100);

    const totalMonthlyRevenue = revenueFromSelfRun + revenueFromLeased;
    const netMonthlyProfit = totalMonthlyRevenue - totalMonthlyCost;

    // Effective licenses (accounting for uptime)
    const effectiveLicensesSelfRun = totalLicensesRunBySelf * (uptimeSelfRun / 100);
    const effectiveLicensesLeased = totalLicensesLeased * (uptimeLeased / 100);
    const totalEffectiveLicenses = effectiveLicensesSelfRun + effectiveLicensesLeased;

    // ROI calculations (accounting for ramp-up if enabled)
    const calculateRampUpMetrics = () => {
        if (!rampUpEnabled) {
            // Use simple calculations if ramp-up is disabled
            const breakEvenMonths = netMonthlyProfit > 0 ? initialInvestment / netMonthlyProfit : Infinity;
            const roi12Month = initialInvestment > 0 ? ((netMonthlyProfit * 12) / initialInvestment) * 100 : 0;
            const roi24Month = initialInvestment > 0 ? ((netMonthlyProfit * 24) / initialInvestment) * 100 : 0;
            const annualProfit = netMonthlyProfit * 12;
            const annualRevenue = totalMonthlyRevenue * 12;
            return { breakEvenMonths, roi12Month, roi24Month, annualProfit, annualRevenue };
        }

        // Calculate cumulative cash flow with ramp-up
        let cumulativeCashFlow = -initialInvestment;
        let breakEvenMonths = Infinity;
        let totalProfit12Month = 0;
        let totalProfit24Month = 0;
        let totalRevenue12Month = 0;
        let totalRevenue24Month = 0;

        // Simulate up to 36 months to find break-even and calculate ROIs
        for (let month = 1; month <= 36; month++) {
            const monthlyRevenue = calculateRampedRevenue(month);
            const monthlyCosts = calculateRampedCosts(month);
            const monthlyProfit = monthlyRevenue - monthlyCosts;

            cumulativeCashFlow += monthlyProfit;

            // Track break-even
            if (cumulativeCashFlow >= 0 && breakEvenMonths === Infinity) {
                breakEvenMonths = month;
            }

            // Accumulate for ROI calculations
            if (month <= 12) {
                totalProfit12Month += monthlyProfit;
                totalRevenue12Month += monthlyRevenue;
            }
            if (month <= 24) {
                totalProfit24Month += monthlyProfit;
                totalRevenue24Month += monthlyRevenue;
            }
        }

        const roi12Month = initialInvestment > 0 ? (totalProfit12Month / initialInvestment) * 100 : 0;
        const roi24Month = initialInvestment > 0 ? (totalProfit24Month / initialInvestment) * 100 : 0;
        const annualProfit = totalProfit12Month; // Annual profit (12 months)
        const annualRevenue = totalRevenue12Month;

        return { breakEvenMonths, roi12Month, roi24Month, annualProfit, annualRevenue };
    };

    const rampUpMetrics = calculateRampUpMetrics();
    const breakEvenMonths = rampUpMetrics.breakEvenMonths;
    const roi12Month = rampUpMetrics.roi12Month;
    const roi24Month = rampUpMetrics.roi24Month;
    const annualProfit = rampUpMetrics.annualProfit;
    const annualRevenue = rampUpMetrics.annualRevenue;

    // Daily calculations (30-day month basis)
    const dailyNetProfit = netMonthlyProfit / 30;
    const dailyNetProfitEur = dailyNetProfit * usdToEur;

    // ==========================================
    // REALITY CHECK CALCULATIONS
    // ==========================================
    // These calculations provide a sanity check by analyzing the entire Unity Nodes ecosystem
    // and comparing the user's position to the total market potential

    // 1. Total Ecosystem Market Potential
    // Calculate the total revenue potential across all 6000 nodes in the ecosystem
    const ecosystemTotalMonthlyRevenue = TOTAL_LICENSES_IN_ECOSYSTEM * revenuePerLicense;
    const ecosystemTotalAnnualRevenue = ecosystemTotalMonthlyRevenue * 12;

    // 1b. Calculate realistic ecosystem revenue (used for break-even and comparisons)
    // Assumes average operator runs 25% self, 50% leased, 25% inactive
    const avgSelfRunLicensesPerNode = licensesPerNode * 0.25;
    const avgLeasedLicensesPerNode = licensesPerNode * 0.50;
    const avgSelfRunRevenuePerNode = avgSelfRunLicensesPerNode * revenuePerLicense;
    const avgLeasedRevenuePerNode = avgLeasedLicensesPerNode * revenuePerLicense * 0.40; // 40% split
    const avgMonthlyRevenuePerNode = avgSelfRunRevenuePerNode + avgLeasedRevenuePerNode;
    const ecosystemTotalMonthlyRevenueRealistic = TOTAL_NODES_IN_ECOSYSTEM * avgMonthlyRevenuePerNode;

    // 2. User's Market Share
    // Calculate what percentage of the total ecosystem this user represents
    const userNodeSharePercent = (numNodes / TOTAL_NODES_IN_ECOSYSTEM) * 100;
    const userLicenseSharePercent = (totalLicenses / TOTAL_LICENSES_IN_ECOSYSTEM) * 100;
    // Compare user's actual revenue to ecosystem's realistic revenue (both use actual distributions)
    const userRevenueSharePercent = ecosystemTotalMonthlyRevenueRealistic > 0
        ? (totalMonthlyRevenue / ecosystemTotalMonthlyRevenueRealistic) * 100
        : 0;

    // 3. Total Market Capitalization Required
    // How much total investment would be needed if all 6000 nodes were purchased
    const ecosystemTotalInvestment = TOTAL_NODES_IN_ECOSYSTEM * nodePrice;
    const userInvestmentSharePercent = (totalNodeCost / ecosystemTotalInvestment) * 100;

    // 4. Global Break-Even Analysis
    // Estimate when ALL operators collectively would break even
    // Assumptions: 
    // - Average operator runs 25% self, 50% leased, 25% inactive (like current defaults)
    // - Average phone cost per active license
    // - Average operating costs per license
    const avgActiveLicensesPerNode = licensesPerNode * 0.75; // 75% active (25% self + 50% leased)
    // avgSelfRunLicensesPerNode already declared at line 426, reusing it here
    const avgPhonesPerNode = avgSelfRunLicensesPerNode;
    const avgPhoneCostPerNode = avgPhonesPerNode * phonePrice;
    const avgInitialInvestmentPerNode = nodePrice + avgPhoneCostPerNode;
    const ecosystemTotalInitialInvestment = TOTAL_NODES_IN_ECOSYSTEM * avgInitialInvestmentPerNode;

    // Average monthly costs per node
    const avgMonthlySimCostPerNode = avgSelfRunLicensesPerNode * simMonthly;
    const avgMonthlyCreditCostPerNode = avgActiveLicensesPerNode * monthlyCredits; // Assume someone pays for all active
    const avgMonthlyOperatingCostPerNode = avgMonthlySimCostPerNode + avgMonthlyCreditCostPerNode;
    const ecosystemTotalMonthlyCosts = TOTAL_NODES_IN_ECOSYSTEM * avgMonthlyOperatingCostPerNode;

    // Global break-even calculation (uses ecosystemTotalMonthlyRevenueRealistic calculated above)
    const ecosystemMonthlyNetProfit = ecosystemTotalMonthlyRevenueRealistic - ecosystemTotalMonthlyCosts;
    const ecosystemBreakEvenMonths = ecosystemMonthlyNetProfit > 0
        ? ecosystemTotalInitialInvestment / ecosystemMonthlyNetProfit
        : Infinity;

    // 5. Revenue Sustainability Analysis
    // How many verification tasks are needed to support this revenue?
    // Assumptions based on typical DePIN networks:
    // - Each verification task pays a small amount (e.g., $0.001 - $0.01)
    // - Licenses verify multiple tasks per day
    const assumedRevenuePerVerification = 0.005; // $0.005 per verification (middle estimate)
    const verificationsNeededPerLicensePerMonth = revenuePerLicense / assumedRevenuePerVerification;
    const verificationsNeededPerLicensePerDay = verificationsNeededPerLicensePerMonth / 30;
    const totalEcosystemVerificationsPerMonth = TOTAL_LICENSES_IN_ECOSYSTEM * verificationsNeededPerLicensePerMonth;
    const totalEcosystemVerificationsPerDay = totalEcosystemVerificationsPerMonth / 30;

    // 6. Competitive Landscape Comparisons
    // Compare Unity Nodes revenue to similar DePIN networks
    const competitiveNetworks = {
        helium: { name: "Helium Mobile", revenuePerDevice: 30, description: "5G hotspot network" },
        natix: { name: "NATIX Network", revenuePerDevice: 50, description: "AI camera network" },
        hivemapper: { name: "Hivemapper", revenuePerDevice: 40, description: "Decentralized mapping" },
        unity: { name: "Unity Nodes", revenuePerDevice: revenuePerLicense, description: "Current scenario" }
    };

    // Calculate how Unity compares (as a multiplier)
    const unityVsHelium = revenuePerLicense / competitiveNetworks.helium.revenuePerDevice;
    const unityVsNatix = revenuePerLicense / competitiveNetworks.natix.revenuePerDevice;
    const unityVsHivemapper = revenuePerLicense / competitiveNetworks.hivemapper.revenuePerDevice;

    // 7. Reality Check Warning Flags
    // Automatically detect potentially unrealistic scenarios
    const realityWarnings = [];

    if (userRevenueSharePercent > 1) {
        realityWarnings.push({
            level: 'warning',
            message: `You control ${formatNumber(userRevenueSharePercent, 2)}% of total ecosystem revenue`,
            detail: 'Significant market concentration - requires large capital investment'
        });
    }

    if (ecosystemTotalInvestment > 100000000) {
        realityWarnings.push({
            level: 'caution',
            message: `Total market cap: $${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M`,
            detail: 'Requires substantial ecosystem-wide investment to reach full capacity'
        });
    }

    if (revenuePerLicense > 3000) {
        realityWarnings.push({
            level: 'alert',
            message: `Revenue per license: $${formatNumber(revenuePerLicense, 0)}/month`,
            detail: 'Very high revenue per license - verify market scenario assumptions'
        });
    }

    if (breakEvenMonths > 24) {
        realityWarnings.push({
            level: 'info',
            message: `Break-even: ${formatNumber(breakEvenMonths, 1)} months`,
            detail: 'Long-term investment horizon - consider cash flow requirements'
        });
    }

    if (verificationsNeededPerLicensePerDay > 10000) {
        realityWarnings.push({
            level: 'alert',
            message: `Requires ${formatNumber(verificationsNeededPerLicensePerDay, 0)} verifications/day per license`,
            detail: 'Very high verification volume needed - verify network capacity'
        });
    }

    if (unityVsHelium > 5) {
        realityWarnings.push({
            level: 'caution',
            message: `Revenue is ${formatNumber(unityVsHelium, 1)}x higher than Helium Mobile`,
            detail: 'Significantly higher than established DePIN networks'
        });
    }

    // ==========================================
    // EARNINGS TARGET CALCULATOR FUNCTIONS
    // ==========================================

    /**
     * Calculate the gross earnings needed per license to reach the target revenue
     * @param {number} target - Target revenue amount
     * @param {number} licenses - Number of active licenses
     * @param {string} period - Time period ('daily', 'monthly', 'yearly')
     * @returns {number} Earnings needed per license per period
     */
    const calculateGrossEarningsNeeded = (target, licenses, period) => {
        if (licenses <= 0) return 0;

        switch (period) {
            case 'daily':
                return target / licenses; // Target is already daily
            case 'monthly':
                return target / licenses; // Target is monthly
            case 'yearly':
                return target / licenses / 12; // Convert yearly target to monthly per license
            default:
                return target / licenses;
        }
    };

    /**
     * Calculate operating costs per license per period
     * @param {string} period - Time period ('daily', 'monthly', 'yearly')
     * @returns {number} Operating costs per license per period
     */
    const calculateOperatingCostsPerLicense = (period) => {
        // Hardware amortization (spread over 24 months)
        const hardwareCostPerLicenseMonthly = (phonePrice * numNodes * licensesPerNode) / (totalActiveLicenses * 24);

        // SIM card costs
        const simCostPerLicenseMonthly = simMonthly;

        // Unity credits costs (if operator pays)
        const creditsCostPerLicenseMonthly = nodeOperatorPaysCredits ? monthlyCredits : 0;

        // Total monthly operating costs per license
        const totalMonthlyOpCosts = hardwareCostPerLicenseMonthly + simCostPerLicenseMonthly + creditsCostPerLicenseMonthly;

        switch (period) {
            case 'daily':
                return totalMonthlyOpCosts / 30;
            case 'monthly':
                return totalMonthlyOpCosts;
            case 'yearly':
                return totalMonthlyOpCosts * 12;
            default:
                return totalMonthlyOpCosts;
        }
    };

    /**
     * Calculate net earnings required per license (accounting for costs)
     * @param {number} target - Target revenue amount
     * @param {number} licenses - Number of active licenses
     * @param {string} period - Time period ('daily', 'monthly', 'yearly')
     * @returns {number} Net earnings required per license per period
     */
    const calculateNetEarningsRequired = (target, licenses, period) => {
        const grossNeeded = calculateGrossEarningsNeeded(target, licenses, period);
        const operatingCosts = calculateOperatingCostsPerLicense(period);
        return Math.max(0, grossNeeded + operatingCosts); // Add costs (operating costs are expenses)
    };

    /**
     * Get actual earnings data from the Earnings Tracker
     * @returns {Object} Earnings statistics and comparison data
     */
    const getActualEarningsComparison = () => {
        try {
            const earningsStats = getEarningsStats();
            const earnings = loadEarnings();

            if (earnings.length === 0) {
                return {
                    hasData: false,
                    currentAveragePerLicense: 0,
                    totalEarnings: 0,
                    transactionCount: 0
                };
            }

            // Calculate average per license based on available data
            // This is a simplified calculation - in reality, we'd need to know how many licenses were active during the period
            const currentAveragePerLicense = earningsStats.average;

            return {
                hasData: true,
                currentAveragePerLicense,
                totalEarnings: earningsStats.total,
                transactionCount: earningsStats.count,
                uniqueNodes: earningsStats.uniqueNodes
            };
        } catch (error) {
            console.error('Error loading earnings data:', error);
            return {
                hasData: false,
                currentAveragePerLicense: 0,
                totalEarnings: 0,
                transactionCount: 0
            };
        }
    };

    // Earnings Target Calculator Results
    const grossEarningsNeeded = calculateGrossEarningsNeeded(targetRevenue, activeLicensesCount, targetTimePeriod);
    const operatingCostsPerLicense = calculateOperatingCostsPerLicense(targetTimePeriod);
    const netEarningsRequired = calculateNetEarningsRequired(targetRevenue, activeLicensesCount, targetTimePeriod);
    const actualEarningsData = getActualEarningsComparison();

    // Calculate daily earnings required per license (always shown)
    const calculateDailyEarningsRequired = (netEarningsRequired, period) => {
        switch (period) {
            case 'daily':
                return netEarningsRequired;
            case 'monthly':
                return netEarningsRequired / 30; // 30-day month
            case 'yearly':
                return netEarningsRequired / 365; // Calendar year
            default:
                return netEarningsRequired / 30;
        }
    };

    const dailyEarningsRequiredPerLicense = calculateDailyEarningsRequired(netEarningsRequired, targetTimePeriod);

    // Calculate progress toward target (if we have actual data)
    const earningsGap = actualEarningsData.hasData ? netEarningsRequired - actualEarningsData.currentAveragePerLicense : 0;
    const progressPercentage = actualEarningsData.hasData && netEarningsRequired > 0 ?
        Math.min(100, (actualEarningsData.currentAveragePerLicense / netEarningsRequired) * 100) : 0;

    // Validation
    const totalLicensesAllocated = licensesRunBySelf + licensesLeased + licensesInactive;
    const isValidAllocation = Math.abs(totalLicensesAllocated - licensesPerNode) < 0.1;

    // Scenario comparison feature
    const [savedScenarios, setSavedScenarios] = useState([]);
    const [scenarioName, setScenarioName] = useState('');

    const saveCurrentScenario = () => {
        if (!scenarioName.trim()) return;

        const scenario = {
            id: Date.now(),
            name: scenarioName.trim(),
            numNodes,
            licensesPerNode,
            licensesRunBySelf,
            licensesLeased,
            licensesInactive,
            phonePrice,
            simMonthly,
            monthlyCredits,
            nodeOperatorPaysCredits,
            revenuePerLicense,
            leaseSplitToOperator,
            usdToEur,
            marketShareScenario,
            uptimeSelfRun,
            uptimeLeased,
            rampUpEnabled,
            rampUpDuration,
            selfRunRampCurve,
            leasedRampCurve,
            // Calculated values
            netMonthlyProfit,
            breakEvenMonths,
            roi12Month,
            roi24Month,
            totalMonthlyRevenue,
            annualProfit,
            initialInvestment,
            totalMonthlyCost
        };

        setSavedScenarios(prev => [...prev, scenario]);
        setScenarioName('');
    };

    const loadScenario = (scenario) => {
        setNumNodes(scenario.numNodes);
        setLicensesPerNode(scenario.licensesPerNode);
        setLicensesRunBySelf(scenario.licensesRunBySelf);
        setLicensesLeased(scenario.licensesLeased);
        setLicensesInactive(scenario.licensesInactive);
        setPhonePrice(scenario.phonePrice);
        setSimMonthly(scenario.simMonthly);
        setMonthlyCredits(scenario.monthlyCredits);
        setNodeOperatorPaysCredits(scenario.nodeOperatorPaysCredits);
        setRevenuePerLicense(scenario.revenuePerLicense);
        setLeaseSplitToOperator(scenario.leaseSplitToOperator);
        setUsdToEur(scenario.usdToEur);
        setMarketShareScenario(scenario.marketShareScenario);
        setUptimeSelfRun(scenario.uptimeSelfRun ?? 95); // Default to 95% if not in scenario
        setUptimeLeased(scenario.uptimeLeased ?? 95); // Default to 95% if not in scenario
        setRampUpEnabled(scenario.rampUpEnabled ?? false); // Default to false if not in scenario
        setRampUpDuration(scenario.rampUpDuration ?? 6); // Default to 6 months if not in scenario
        setSelfRunRampCurve(scenario.selfRunRampCurve ?? 'moderate'); // Default to moderate if not in scenario
        setLeasedRampCurve(scenario.leasedRampCurve ?? 'slow'); // Default to slow if not in scenario
    };

    const deleteScenario = (id) => {
        setSavedScenarios(prev => prev.filter(s => s.id !== id));
    };

    // PDF Export functionality
    const exportToPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add title
        pdf.setFontSize(20);
        pdf.text('Unity Nodes ROI Calculator Report', 20, 30);

        // Add generation date
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 40);

        let yPosition = 60;

        // Configuration Summary
        pdf.setFontSize(14);
        pdf.text('Configuration Summary', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        const configData = [
            `Number of Nodes: ${numNodes}`,
            `Licenses per Node: ${licensesPerNode}`,
            `Self-run Licenses: ${licensesRunBySelf}`,
            `Leased Licenses: ${licensesLeased}`,
            `Inactive Licenses: ${licensesInactive}`,
            `Phone Price: $${phonePrice}`,
            `SIM Monthly: $${simMonthly}`,
            `Monthly Credits: $${monthlyCredits.toFixed(2)}`,
            `Revenue per License: $${revenuePerLicense.toFixed(2)}`,
            `Lease Split: ${leaseSplitToOperator}%`,
            `Self-run Uptime: ${uptimeSelfRun}%`,
            `Leased Uptime: ${uptimeLeased}%`,
            `Effective Self-run Licenses: ${formatNumber(effectiveLicensesSelfRun, 1)}`,
            `Effective Leased Licenses: ${formatNumber(effectiveLicensesLeased, 1)}`,
            `Ramp-up Enabled: ${rampUpEnabled ? 'Yes' : 'No'}`,
            ...(rampUpEnabled ? [
                `Ramp-up Duration: ${rampUpDuration} months`,
                `Self-run Curve: ${rampUpCurves[selfRunRampCurve].name}`,
                `Leased Curve: ${rampUpCurves[leasedRampCurve].name}`
            ] : []),
            `USD to EUR: ${usdToEur}`,
            `Market Scenario: ${marketShareScenario === 'custom' ? 'Custom' : marketScenarios[marketShareScenario].label}`
        ];

        configData.forEach(line => {
            pdf.text(line, 20, yPosition);
            yPosition += 6;
        });

        yPosition += 10;

        // Financial Results
        pdf.setFontSize(14);
        pdf.text('Financial Results', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        const financialData = [
            `Initial Investment: $${formatNumber(initialInvestment)} (€${formatNumber(initialInvestment * usdToEur)})`,
            `Monthly Revenue: $${formatNumber(totalMonthlyRevenue)} (€${formatNumber(totalMonthlyRevenue * usdToEur)})`,
            `Monthly Costs: $${formatNumber(totalMonthlyCost)} (€${formatNumber(totalMonthlyCost * usdToEur)})`,
            `Net Monthly Profit: $${formatNumber(netMonthlyProfit)} (€${formatNumber(netMonthlyProfit * usdToEur)})`,
            `Break-even Period: ${isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) + ' months' : 'Never'}`,
            `12-Month ROI: ${formatNumber(roi12Month, 1)}%`,
            `24-Month ROI: ${formatNumber(roi24Month, 1)}%`,
            `Annual Profit: $${formatNumber(annualProfit)} (€${formatNumber(annualProfit * usdToEur)})`
        ];

        financialData.forEach(line => {
            pdf.text(line, 20, yPosition);
            yPosition += 6;
        });

        // Add disclaimer
        yPosition += 20;
        pdf.setFontSize(8);
        pdf.text('Disclaimer: This calculator is for illustrative purposes only and does not constitute financial advice.', 20, yPosition);
        yPosition += 5;
        pdf.text('Actual returns may vary significantly based on network performance, market conditions, and other factors.', 20, yPosition);

        // Save the PDF
        pdf.save(`unity-nodes-roi-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Chart data preparation
    const generateProfitOverTimeData = () => {
        const data = [];
        let cumulativeProfit = -initialInvestment;
        let cumulativeRevenue = 0;
        let cumulativeCosts = 0;

        for (let month = 0; month <= 36; month++) {
            if (month > 0) {
                // Use ramp-up calculations if enabled, otherwise use standard calculations
                const monthlyRevenue = rampUpEnabled ? calculateRampedRevenue(month) : totalMonthlyRevenue;
                const monthlyCosts = rampUpEnabled ? calculateRampedCosts(month) : totalMonthlyCost;
                const monthlyProfit = monthlyRevenue - monthlyCosts;

                cumulativeProfit += monthlyProfit;
                cumulativeRevenue += monthlyRevenue;
                cumulativeCosts += monthlyCosts;
            }

            data.push({
                month,
                profit: cumulativeProfit,
                revenue: cumulativeRevenue,
                costs: cumulativeCosts + (month === 0 ? initialInvestment : 0),
                netProfit: cumulativeProfit
            });
        }
        return data;
    };

    const costBreakdownData = [
        { name: 'Node Cost', value: totalNodeCost, color: '#8b5cf6' },
        { name: 'Phones', value: totalPhoneCost, color: '#06b6d4' },
        { name: 'Monthly SIM', value: totalMonthlyCost, color: '#10b981' },
        { name: 'Credits', value: monthlyCreditCost, color: '#f59e0b' }
    ].filter(item => item.value > 0);

    const roiComparisonData = [
        { scenario: '12 Month', roi: roi12Month, profit: netMonthlyProfit * 12 },
        { scenario: '24 Month', roi: roi24Month, profit: netMonthlyProfit * 24 }
    ];

    const profitOverTimeData = generateProfitOverTimeData();



    try {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 pb-28 md:pb-6">
                <div className="max-w-7xl mx-auto">
                    {/* Sticky Summary - Always visible at top when scrolling, below the main navigation header */}
                    <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border-b border-purple-400/30 mb-6 shadow-lg shadow-purple-900/20">
                        <div className="px-3 md:px-6 py-3 text-base md:text-xl flex flex-wrap gap-3 md:gap-6 justify-center items-center">
                            <span className="text-green-300 font-semibold">Net: ${formatNumber(netMonthlyProfit)} · €{formatNumber(netMonthlyProfit * usdToEur)}</span>
                            <span className="text-yellow-300 font-semibold">Daily: ${formatNumber(dailyNetProfit)} · €{formatNumber(dailyNetProfitEur)}</span>
                            <span className="text-blue-300 font-semibold">Break-Even: {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</span>
                            <span className="text-purple-300 font-semibold">Annual: ${formatNumber(annualRevenue)} · €{formatNumber(annualRevenue * usdToEur)}</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Unity Nodes ROI Calculator</h1>
                        <p className="text-purple-300">Calculate returns based on self-run and leased licenses</p>

                        <div className="mt-4 inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-purple-300">
                                    USD to EUR Rate:
                                </label>
                                <input
                                    type="number"
                                    value={parseFloat(usdToEur.toFixed(2))}
                                    onChange={(e) => setUsdToEur(Math.max(0, parseFloat(e.target.value) || 0.92))}
                                    step="0.01"
                                    className="w-20 bg-white/5 border border-purple-400/30 rounded px-2 py-1 text-white text-sm"
                                    min="0"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(generateShareUrl())}
                                    className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded px-3 py-1 text-purple-200 hover:text-purple-100 transition-colors text-sm"
                                    title="Copy shareable URL with current calculator settings"
                                >
                                    <Share2 size={14} />
                                    Share
                                </button>

                                <button
                                    onClick={exportToPDF}
                                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded px-3 py-1 text-green-200 hover:text-green-100 transition-colors text-sm"
                                    title="Export current results to PDF"
                                >
                                    <Download size={14} />
                                    PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Node Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Node Configuration</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <HelpTooltip content="The number of Unity Nodes you want to purchase and operate. Each node costs $5,000 and comes with 200 Unity License NFTs.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        Number of Unity Nodes
                                    </label>
                                </HelpTooltip>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => setNumNodes(Math.max(1, numNodes - 1))}
                                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                                    >
                                        -1
                                    </button>
                                    <input
                                        type="number"
                                        value={numNodes}
                                        onChange={(e) => setNumNodes(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="flex-1 bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setNumNodes(numNodes + 1)}
                                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                                    >
                                        +1
                                    </button>
                                </div>
                                <p className="text-xs text-purple-300 mt-1">
                                    ${nodePrice.toLocaleString()} per node × {numNodes} = ${totalNodeCost.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <HelpTooltip content="Each Unity Node comes with 200 Unity License NFTs by default. These licenses can be activated on smartphones to participate in the network and earn revenue.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        Licenses per Node
                                    </label>
                                </HelpTooltip>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => {
                                            const newValue = Math.max(1, licensesPerNode - 200);
                                            setLicensesPerNode(newValue);
                                            const defaultSelfRun = newValue * 0.25;
                                            const defaultLeased = newValue * 0.5;
                                            const defaultInactive = newValue - defaultSelfRun - defaultLeased;
                                            setLicensesRunBySelf(defaultSelfRun);
                                            setLicensesLeased(defaultLeased);
                                            setLicensesInactive(defaultInactive);
                                        }}
                                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                                    >
                                        -200
                                    </button>
                                    <input
                                        type="number"
                                        value={licensesPerNode}
                                        onChange={(e) => {
                                            const newValue = Math.max(1, parseInt(e.target.value) || 200);
                                            setLicensesPerNode(newValue);
                                            // Reset license distribution when changing total licenses
                                            const defaultSelfRun = newValue * 0.25;
                                            const defaultLeased = newValue * 0.5;
                                            const defaultInactive = newValue - defaultSelfRun - defaultLeased;
                                            setLicensesRunBySelf(defaultSelfRun);
                                            setLicensesLeased(defaultLeased);
                                            setLicensesInactive(defaultInactive);
                                        }}
                                        className="flex-1 bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => {
                                            const newValue = licensesPerNode + 200;
                                            setLicensesPerNode(newValue);
                                            const defaultSelfRun = newValue * 0.25;
                                            const defaultLeased = newValue * 0.5;
                                            const defaultInactive = newValue - defaultSelfRun - defaultLeased;
                                            setLicensesRunBySelf(defaultSelfRun);
                                            setLicensesLeased(defaultLeased);
                                            setLicensesInactive(defaultInactive);
                                        }}
                                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-200 hover:text-purple-100 transition-colors"
                                    >
                                        +200
                                    </button>
                                </div>
                                <p className="text-xs text-purple-300 mt-1">
                                    Total licenses available: {numNodes * licensesPerNode}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <h3 className="text-blue-300 font-semibold mb-2">What's Included Per Node:</h3>
                                <ul className="text-sm text-blue-200 space-y-1">
                                    <li>• {licensesPerNode} Unity License NFTs</li>
                                    <li>• $1,875 MNTx staked (24mo lock)</li>
                                    <li>• $1,875 WMTx staked (24mo lock)</li>
                                    <li>• NFTs are transferable & sellable</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Reality Check Section */}
                    <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30 mb-6">
                        <div
                            className="flex items-center gap-2 mb-4 cursor-pointer"
                            onClick={() => setRealityCheckExpanded(!realityCheckExpanded)}
                        >
                            <AlertTriangle className="text-orange-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Reality Check: Ecosystem Analysis</h2>
                            <button className="ml-auto text-orange-300 hover:text-orange-200 transition-colors">
                                {realityCheckExpanded ? '▼' : '▶'}
                            </button>
                        </div>

                        {realityCheckExpanded && (
                            <>
                                <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                    <p className="text-orange-200 text-sm">
                                        <strong>Financial Guru Insight:</strong> This section analyzes the entire Unity Nodes ecosystem
                                        to provide context for your investment. We're looking at all 6,000 nodes and {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM / 1000000, 2)}M
                                        licenses to see if the numbers make sense at scale.
                                    </p>
                                </div>

                                {/* Warning Flags */}
                                {realityWarnings.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
                                            <AlertTriangle size={18} />
                                            Reality Flags
                                        </h3>
                                        <div className="space-y-2">
                                            {realityWarnings.map((warning, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border ${warning.level === 'alert' ? 'bg-red-500/10 border-red-500/30' :
                                                        warning.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                            warning.level === 'caution' ? 'bg-orange-500/10 border-orange-500/30' :
                                                                'bg-blue-500/10 border-blue-500/30'
                                                        }`}
                                                >
                                                    <div className={`font-semibold text-sm ${warning.level === 'alert' ? 'text-red-300' :
                                                        warning.level === 'warning' ? 'text-yellow-300' :
                                                            warning.level === 'caution' ? 'text-orange-300' :
                                                                'text-blue-300'
                                                        }`}>
                                                        {warning.message}
                                                    </div>
                                                    <div className={`text-xs mt-1 ${warning.level === 'alert' ? 'text-red-200' :
                                                        warning.level === 'warning' ? 'text-yellow-200' :
                                                            warning.level === 'caution' ? 'text-orange-200' :
                                                                'text-blue-200'
                                                        }`}>
                                                        {warning.detail}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Two-Column Layout: Ecosystem vs Your Position */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* Left Column: Ecosystem Totals */}
                                    <div className="space-y-4">
                                        <h3 className="text-purple-300 font-semibold text-lg flex items-center gap-2">
                                            <Globe size={20} />
                                            Ecosystem Totals
                                        </h3>

                                        {/* Total Nodes */}
                                        <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                            <div className="text-purple-300 text-xs mb-1">Total Nodes Available</div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)}
                                            </div>
                                            <div className="text-purple-200 text-xs mt-1">Maximum network capacity</div>
                                        </div>

                                        {/* Total Licenses */}
                                        <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                            <div className="text-purple-300 text-xs mb-1">Total Licenses</div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM, 0)}
                                            </div>
                                            <div className="text-purple-200 text-xs mt-1">
                                                {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM / 1000000, 2)}M licenses @ {licensesPerNode} per node
                                            </div>
                                        </div>

                                        {/* Total Market Revenue Potential */}
                                        <div className="bg-white/5 border border-green-400/30 rounded-lg p-4">
                                            <div className="text-green-300 text-xs mb-1">
                                                Ecosystem Revenue (Realistic)
                                            </div>
                                            <div className="text-white text-2xl font-bold">
                                                ${formatNumber(ecosystemTotalMonthlyRevenueRealistic / 1000000, 1)}M/mo
                                            </div>
                                            <div className="text-green-200 text-xs mt-1">
                                                ${formatNumber(ecosystemTotalMonthlyRevenueRealistic * 12 / 1000000, 1)}M annually
                                            </div>
                                            <div className="text-green-300 text-xs mt-2 opacity-70">
                                                Theoretical max: ${formatNumber(ecosystemTotalMonthlyRevenue / 1000000, 1)}M/mo
                                            </div>
                                            <div className="text-green-200 text-xs opacity-60">
                                                Assumes avg 25% self-run, 50% leased, 25% inactive
                                            </div>
                                        </div>

                                        {/* Total Market Cap */}
                                        <div className={`border rounded-lg p-4 ${ecosystemTotalInvestment > 100000000
                                            ? 'bg-orange-500/10 border-orange-400/30'
                                            : 'bg-white/5 border-blue-400/30'
                                            }`}>
                                            <div className={`text-xs mb-1 ${ecosystemTotalInvestment > 100000000 ? 'text-orange-300' : 'text-blue-300'
                                                }`}>
                                                Total Investment Required (Nodes Only)
                                            </div>
                                            <div className="text-white text-2xl font-bold">
                                                ${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M
                                            </div>
                                            <div className={`text-xs mt-1 ${ecosystemTotalInvestment > 100000000 ? 'text-orange-200' : 'text-blue-200'
                                                }`}>
                                                6,000 nodes × $5,000 each
                                            </div>
                                        </div>

                                        {/* Global Break-Even */}
                                        <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                            <div className="text-purple-300 text-xs mb-1">Ecosystem Break-Even Timeline</div>
                                            <div className="text-white text-2xl font-bold">
                                                {ecosystemBreakEvenMonths < 100
                                                    ? `${formatNumber(ecosystemBreakEvenMonths, 1)} months`
                                                    : 'Not profitable'
                                                }
                                            </div>
                                            <div className="text-purple-200 text-xs mt-1">
                                                When all 6,000 operators collectively break even
                                            </div>
                                            <div className="text-purple-200 text-xs mt-1 opacity-60">
                                                Based on realistic revenue distribution above
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Your Position */}
                                    <div className="space-y-4">
                                        <h3 className="text-green-300 font-semibold text-lg flex items-center gap-2">
                                            <Users size={20} />
                                            Your Position
                                        </h3>

                                        {/* Your Node Share */}
                                        <div className={`border rounded-lg p-4 ${userNodeSharePercent > 5
                                            ? 'bg-yellow-500/10 border-yellow-400/30'
                                            : 'bg-white/5 border-green-400/30'
                                            }`}>
                                            <div className={`text-xs mb-1 ${userNodeSharePercent > 5 ? 'text-yellow-300' : 'text-green-300'
                                                }`}>
                                                Your Node Share
                                            </div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(userNodeSharePercent, 2)}%
                                            </div>
                                            <div className={`text-xs mt-1 ${userNodeSharePercent > 5 ? 'text-yellow-200' : 'text-green-200'
                                                }`}>
                                                {numNodes} of {formatNumber(TOTAL_NODES_IN_ECOSYSTEM, 0)} nodes
                                            </div>
                                            {/* Progress bar */}
                                            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${userNodeSharePercent > 5 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min(userNodeSharePercent, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Your License Share */}
                                        <div className="bg-white/5 border border-green-400/30 rounded-lg p-4">
                                            <div className="text-green-300 text-xs mb-1">Your License Share</div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(userLicenseSharePercent, 2)}%
                                            </div>
                                            <div className="text-green-200 text-xs mt-1">
                                                {formatNumber(totalLicenses, 0)} of {formatNumber(TOTAL_LICENSES_IN_ECOSYSTEM, 0)} licenses
                                            </div>
                                            {/* Progress bar */}
                                            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min(userLicenseSharePercent, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Your Revenue Share */}
                                        <div className={`border rounded-lg p-4 ${userRevenueSharePercent > 1
                                            ? 'bg-orange-500/10 border-orange-400/30'
                                            : 'bg-white/5 border-green-400/30'
                                            }`}>
                                            <div className={`text-xs mb-1 ${userRevenueSharePercent > 1 ? 'text-orange-300' : 'text-green-300'
                                                }`}>
                                                Your Revenue vs. Ecosystem (Realistic)
                                            </div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(userRevenueSharePercent, 2)}%
                                            </div>
                                            <div className={`text-xs mt-1 ${userRevenueSharePercent > 1 ? 'text-orange-200' : 'text-green-200'
                                                }`}>
                                                ${formatNumber(totalMonthlyRevenue, 0)} of ${formatNumber(ecosystemTotalMonthlyRevenueRealistic / 1000000, 1)}M
                                            </div>
                                        </div>

                                        {/* Your Investment Share */}
                                        <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                            <div className="text-blue-300 text-xs mb-1">Your Investment Share</div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(userInvestmentSharePercent, 2)}%
                                            </div>
                                            <div className="text-blue-200 text-xs mt-1">
                                                ${formatNumber(totalNodeCost, 0)} of ${formatNumber(ecosystemTotalInvestment / 1000000, 0)}M
                                            </div>
                                        </div>

                                        {/* Comparison: Your vs Global Break-Even */}
                                        <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                            <div className="text-purple-300 text-xs mb-1">Your Break-Even vs. Ecosystem</div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <div className="text-white text-lg font-bold">
                                                        {breakEvenMonths < 100
                                                            ? `${formatNumber(breakEvenMonths, 1)}mo`
                                                            : 'N/A'
                                                        }
                                                    </div>
                                                    <div className="text-purple-200 text-xs">You</div>
                                                </div>
                                                <div>
                                                    <div className="text-white text-lg font-bold">
                                                        {ecosystemBreakEvenMonths < 100
                                                            ? `${formatNumber(ecosystemBreakEvenMonths, 1)}mo`
                                                            : 'N/A'
                                                        }
                                                    </div>
                                                    <div className="text-purple-200 text-xs">Ecosystem Avg</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue Sustainability Analysis */}
                                <div className="mb-6">
                                    <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                                        <BarChart3 size={18} />
                                        Revenue Sustainability Analysis
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                            <div className="text-blue-300 text-xs mb-1">Verifications Per License/Day</div>
                                            <div className={`text-2xl font-bold ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-400' : 'text-white'
                                                }`}>
                                                {formatNumber(verificationsNeededPerLicensePerDay, 0)}
                                            </div>
                                            <div className="text-blue-200 text-xs mt-1">
                                                @ ${assumedRevenuePerVerification.toFixed(3)}/verification
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-blue-400/30 rounded-lg p-4">
                                            <div className="text-blue-300 text-xs mb-1">Ecosystem Daily Verifications</div>
                                            <div className="text-white text-2xl font-bold">
                                                {formatNumber(totalEcosystemVerificationsPerDay / 1000000, 1)}M
                                            </div>
                                            <div className="text-blue-200 text-xs mt-1">
                                                {formatNumber(totalEcosystemVerificationsPerMonth / 1000000, 0)}M monthly
                                            </div>
                                        </div>

                                        <div className={`border rounded-lg p-4 ${verificationsNeededPerLicensePerDay > 10000
                                            ? 'bg-orange-500/10 border-orange-400/30'
                                            : 'bg-green-500/10 border-green-400/30'
                                            }`}>
                                            <div className={`text-xs mb-1 ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-300' : 'text-green-300'
                                                }`}>
                                                Network Capacity Check
                                            </div>
                                            <div className={`text-lg font-bold ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-400' : 'text-green-400'
                                                }`}>
                                                {verificationsNeededPerLicensePerDay > 10000 ? '⚠️ High' : '✓ Reasonable'}
                                            </div>
                                            <div className={`text-xs mt-1 ${verificationsNeededPerLicensePerDay > 10000 ? 'text-orange-200' : 'text-green-200'
                                                }`}>
                                                {verificationsNeededPerLicensePerDay > 10000
                                                    ? 'Very high verification volume needed'
                                                    : 'Achievable verification volume'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Competitive Landscape */}
                                <div>
                                    <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp size={18} />
                                        Competitive Landscape Comparison
                                    </h3>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        {Object.entries(competitiveNetworks).map(([key, network]) => (
                                            <div
                                                key={key}
                                                className={`border rounded-lg p-4 ${key === 'unity'
                                                    ? 'bg-purple-500/20 border-purple-400/50'
                                                    : 'bg-white/5 border-gray-400/30'
                                                    }`}
                                            >
                                                <div className={`text-xs mb-1 ${key === 'unity' ? 'text-purple-300' : 'text-gray-300'
                                                    }`}>
                                                    {network.name}
                                                </div>
                                                <div className="text-white text-xl font-bold">
                                                    ${formatNumber(network.revenuePerDevice, 0)}/mo
                                                </div>
                                                <div className={`text-xs mt-1 ${key === 'unity' ? 'text-purple-200' : 'text-gray-400'
                                                    }`}>
                                                    {network.description}
                                                </div>
                                                {key !== 'unity' && (
                                                    <div className="text-xs mt-2 text-blue-300">
                                                        Unity is {formatNumber(network.revenuePerDevice > 0 ? revenuePerLicense / network.revenuePerDevice : 0, 1)}x
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-blue-200 text-sm">
                                            <strong>Note:</strong> Competitive data represents typical monthly earnings for similar DePIN (Decentralized Physical Infrastructure)
                                            networks. Higher multiples may indicate optimistic projections or unique value propositions that should be validated.
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* License Utilization Reality Check */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 mb-6">
                        <div
                            className="flex items-center gap-2 mb-4 cursor-pointer"
                            onClick={() => setLicenseUtilizationExpanded(!licenseUtilizationExpanded)}
                        >
                            <Database className="text-blue-400" size={24} />
                            <h2 className="text-xl font-bold text-white">License Utilization Reality Check</h2>
                            <button className="ml-auto text-blue-300 hover:text-blue-200 transition-colors">
                                {licenseUtilizationExpanded ? '▼' : '▶'}
                            </button>
                        </div>

                        {licenseUtilizationExpanded && (
                            <>
                                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-200 text-sm">
                                        <strong>License Manager Integration:</strong> This section compares your projected license utilization
                                        with actual license binding data from your License Manager. It helps identify revenue loss from
                                        unbound leased licenses.
                                    </p>
                                </div>

                                {/* Load License Data */}
                                {(() => {
                                    const licenses = getAllLicenses();
                                    const licenseStats = getLicenseStats();
                                    const earningsStats = getEarningsStats();

                                    // Calculate projected vs actual utilization
                                    const projectedUtilization = totalLicensesAllocated > 0 ?
                                        (licensesRunBySelf / totalLicensesAllocated) * 100 : 0;
                                    const actualUtilization = licenseStats.total > 0 ?
                                        (licenseStats.bound / licenseStats.total) * 100 : 0;

                                    // Calculate revenue loss from unbound licenses
                                    const estimatedDailyRevenue = 5; // $5 per bound license per day (placeholder)
                                    const unboundRevenueLoss = licenseStats.unbound * estimatedDailyRevenue;

                                    return (
                                        <div className="space-y-6">
                                            {/* License Status Overview */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white/5 border border-green-400/30 rounded-lg p-4">
                                                    <div className="text-green-300 text-xs mb-1">Projected Utilization</div>
                                                    <div className="text-white text-2xl font-bold">
                                                        {formatNumber(projectedUtilization, 1)}%
                                                    </div>
                                                    <div className="text-green-200 text-xs mt-1">
                                                        Based on your calculator settings
                                                    </div>
                                                </div>

                                                <div className={`border rounded-lg p-4 ${actualUtilization >= projectedUtilization ?
                                                        'bg-green-500/10 border-green-400/30' :
                                                        'bg-red-500/10 border-red-400/30'
                                                    }`}>
                                                    <div className={`text-xs mb-1 ${actualUtilization >= projectedUtilization ? 'text-green-300' : 'text-red-300'
                                                        }`}>
                                                        Actual Utilization
                                                    </div>
                                                    <div className="text-white text-2xl font-bold">
                                                        {formatNumber(actualUtilization, 1)}%
                                                    </div>
                                                    <div className={`text-xs mt-1 ${actualUtilization >= projectedUtilization ? 'text-green-200' : 'text-red-200'
                                                        }`}>
                                                        {licenseStats.bound} of {licenseStats.total} licenses bound
                                                    </div>
                                                </div>

                                                <div className={`border rounded-lg p-4 ${unboundRevenueLoss > 0 ? 'bg-red-500/10 border-red-400/30' : 'bg-green-500/10 border-green-400/30'
                                                    }`}>
                                                    <div className={`text-xs mb-1 ${unboundRevenueLoss > 0 ? 'text-red-300' : 'text-green-300'}`}>
                                                        Daily Revenue Loss
                                                    </div>
                                                    <div className="text-white text-2xl font-bold">
                                                        ${formatNumber(unboundRevenueLoss, 2)}
                                                    </div>
                                                    <div className={`text-xs mt-1 ${unboundRevenueLoss > 0 ? 'text-red-200' : 'text-green-200'}`}>
                                                        From {licenseStats.unbound} unbound licenses
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Utilization Comparison Chart */}
                                            <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                                <h3 className="text-purple-300 font-semibold mb-3">Projected vs Actual Utilization</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-green-300">Projected</span>
                                                            <span className="text-white">{formatNumber(projectedUtilization, 1)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                                            <div
                                                                className="bg-green-500 h-3 rounded-full"
                                                                style={{ width: `${Math.min(projectedUtilization, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-blue-300">Actual</span>
                                                            <span className="text-white">{formatNumber(actualUtilization, 1)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                                            <div
                                                                className={`h-3 rounded-full ${actualUtilization >= projectedUtilization ? 'bg-blue-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${Math.min(actualUtilization, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* License Status Breakdown */}
                                            {licenseStats.total > 0 && (
                                                <div className="bg-white/5 border border-purple-400/30 rounded-lg p-4">
                                                    <h3 className="text-purple-300 font-semibold mb-3">License Status Breakdown</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                        <div>
                                                            <div className="text-2xl font-bold text-blue-300">{licenseStats.selfRun}</div>
                                                            <div className="text-xs text-slate-400">Self-run</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-green-300">{licenseStats.bound - licenseStats.selfRun}</div>
                                                            <div className="text-xs text-slate-400">Leased & Bound</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-red-300">{licenseStats.unbound}</div>
                                                            <div className="text-xs text-slate-400">Leased & Unbound</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-2xl font-bold text-purple-300">{licenseStats.available}</div>
                                                            <div className="text-xs text-slate-400">Available</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Items */}
                                            <div className="space-y-3">
                                                {licenseStats.unbound > 0 && (
                                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                                                            <AlertTriangle size={16} />
                                                            Revenue Loss Alert
                                                        </h4>
                                                        <p className="text-red-200 text-sm mb-3">
                                                            You have {licenseStats.unbound} leased licenses that are not generating revenue,
                                                            resulting in a daily loss of ${formatNumber(unboundRevenueLoss, 2)}.
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                // Navigate to License Manager
                                                                const licenseTab = document.querySelector('[data-tab="licenses"]');
                                                                if (licenseTab) licenseTab.click();
                                                            }}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                                                        >
                                                            View in License Manager
                                                        </button>
                                                    </div>
                                                )}

                                                {actualUtilization < projectedUtilization && (
                                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-yellow-300 mb-2">
                                                            Utilization Gap Detected
                                                        </h4>
                                                        <p className="text-yellow-200 text-sm mb-3">
                                                            Your actual license utilization ({formatNumber(actualUtilization, 1)}%) is
                                                            {formatNumber(projectedUtilization - actualUtilization, 1)}% lower than projected.
                                                            Consider reviewing customer relationships or license deployment.
                                                        </p>
                                                    </div>
                                                )}

                                                {licenseStats.total === 0 && (
                                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-blue-300 mb-2">
                                                            License Manager Not Set Up
                                                        </h4>
                                                        <p className="text-blue-200 text-sm mb-3">
                                                            Add your licenses to the License Manager to enable utilization tracking
                                                            and revenue loss analysis.
                                                        </p>
                                                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                                                            Go to License Manager
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                        )}
                    </div>

                    {/* License Distribution */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">License Distribution</h2>
                            {!isValidAllocation && (
                                <span className="text-red-400 text-sm ml-auto">
                                    ⚠️ Must total {totalLicenses} licenses
                                </span>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                                <label className="text-sm text-white block mb-2 font-semibold">
                                    Licenses Run by Me
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                    {[0, 25, 50, 75, 100].map((percentage) => {
                                        const totalLicenseCount = totalLicenses * percentage / 100;
                                        const perNodeCount = totalLicenseCount / numNodes;
                                        return (
                                            <button
                                                key={percentage}
                                                onClick={() => setLicensesRunBySelf(perNodeCount)}
                                                className={`py-2 px-2 rounded-lg font-semibold text-sm transition-all text-center ${licensesRunBySelf === perNodeCount
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/10 text-green-200 hover:bg-white/20'
                                                    }`}
                                            >
                                                {percentage}% ({formatNumber(totalLicenseCount, 0)})
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setLicensesRunBySelf(Math.max(0, licensesPerNode - licensesLeased - licensesInactive))}
                                    className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                                >
                                    Calculate Remaining
                                </button>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="text-xs text-green-200 block mb-1">Total Licenses</label>
                                        <input
                                            type="number"
                                            value={totalLicensesRunBySelf}
                                            onChange={(e) => setLicensesRunBySelf(Math.max(0, (parseFloat(e.target.value) || 0) / numNodes))}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={totalLicenses}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-green-200 block mb-1">Equivalent Nodes</label>
                                        <input
                                            type="number"
                                            value={parseFloat((licensesRunBySelf / licensesPerNode * numNodes).toFixed(2))}
                                            onChange={(e) => {
                                                const nodes = parseFloat(e.target.value) || 0;
                                                setLicensesRunBySelf((nodes * licensesPerNode) / numNodes);
                                            }}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={numNodes}
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-green-200">
                                    Per node: {formatNumber(licensesRunBySelf, 1)} | Share: {formatNumber(licensesRunBySelf / licensesPerNode * 100, 1)}%
                                </p>
                                <p className="text-xs text-green-200">
                                    I pay all costs & earn 100% of license earnings
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                                <label className="text-sm text-white block mb-2 font-semibold">
                                    Licenses Leased Out
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                    {[0, 25, 50, 75, 100].map((percentage) => {
                                        const totalLicenseCount = totalLicenses * percentage / 100;
                                        const perNodeCount = totalLicenseCount / numNodes;
                                        return (
                                            <button
                                                key={percentage}
                                                onClick={() => setLicensesLeased(perNodeCount)}
                                                className={`py-2 px-2 rounded-lg font-semibold text-sm transition-all text-center ${licensesLeased === perNodeCount
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                                    }`}
                                            >
                                                {percentage}% ({formatNumber(totalLicenseCount, 0)})
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setLicensesLeased(Math.max(0, licensesPerNode - licensesRunBySelf - licensesInactive))}
                                    className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                                >
                                    Calculate Remaining
                                </button>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="text-xs text-blue-200 block mb-1">Total Licenses</label>
                                        <input
                                            type="number"
                                            value={totalLicensesLeased}
                                            onChange={(e) => setLicensesLeased(Math.max(0, (parseFloat(e.target.value) || 0) / numNodes))}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={totalLicenses}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-blue-200 block mb-1">Equivalent Nodes</label>
                                        <input
                                            type="number"
                                            value={parseFloat((licensesLeased / licensesPerNode * numNodes).toFixed(2))}
                                            onChange={(e) => {
                                                const nodes = parseFloat(e.target.value) || 0;
                                                setLicensesLeased((nodes * licensesPerNode) / numNodes);
                                            }}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={numNodes}
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-blue-200">
                                    Per node: {formatNumber(licensesLeased, 1)} | Share: {formatNumber(licensesLeased / licensesPerNode * 100, 1)}%
                                </p>
                                <p className="text-xs text-blue-200">
                                    Operator pays costs, I earn split
                                </p>
                            </div>

                            <div className={`p-4 rounded-lg ${!isValidAllocation ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-500/10 border border-gray-500/30'}`}>
                                <label className="text-sm text-white block mb-2 font-semibold">
                                    Inactive Licenses
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                    {[0, 5, 12.5, 25, 50].map((percentage) => {
                                        const totalLicenseCount = totalLicenses * percentage / 100;
                                        const perNodeCount = totalLicenseCount / numNodes;
                                        return (
                                            <button
                                                key={percentage}
                                                onClick={() => setLicensesInactive(perNodeCount)}
                                                className={`py-2 px-2 rounded-lg font-semibold text-sm transition-all text-center ${licensesInactive === perNodeCount
                                                    ? 'bg-gray-500 text-white'
                                                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                                                    }`}
                                            >
                                                {percentage}% ({formatNumber(totalLicenseCount, 0)})
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setLicensesInactive(Math.max(0, licensesPerNode - licensesRunBySelf - licensesLeased))}
                                    className="w-full mb-3 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 border border-orange-500/30"
                                >
                                    Calculate Remaining
                                </button>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="text-xs text-gray-300 block mb-1">Total Licenses</label>
                                        <input
                                            type="number"
                                            value={totalLicensesInactive}
                                            onChange={(e) => setLicensesInactive(Math.max(0, (parseFloat(e.target.value) || 0) / numNodes))}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={totalLicenses}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-300 block mb-1">Equivalent Nodes</label>
                                        <input
                                            type="number"
                                            value={parseFloat((licensesInactive / licensesPerNode * numNodes).toFixed(2))}
                                            onChange={(e) => {
                                                const nodes = parseFloat(e.target.value) || 0;
                                                setLicensesInactive((nodes * licensesPerNode) / numNodes);
                                            }}
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                                            min="0"
                                            max={numNodes}
                                            step="0.1"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-300">
                                    Per node: {formatNumber(licensesInactive, 1)} | Share: {formatNumber(licensesInactive / licensesPerNode * 100, 1)}%
                                </p>
                                <p className="text-xs text-gray-300">
                                    Not generating revenue
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-300">Unallocated / Remaining:</span>
                                <span className={`font-semibold ${(totalLicenses - licensesRunBySelf - licensesLeased) === 0 ? 'text-green-400' : (totalLicenses - licensesRunBySelf - licensesLeased) < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {formatNumber(totalLicenses - licensesRunBySelf - licensesLeased, 0)} / {formatNumber(totalLicenses, 0)} licenses ({formatNumber(((totalLicenses - licensesRunBySelf - licensesLeased) / totalLicenses) * 100, 1)}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Expected Uptime */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Expected Uptime</h2>
                        </div>

                        <p className="text-sm text-purple-300 mb-6">
                            Not all licenses verify at all times due to device downtime, maintenance, or network issues.
                            Adjust the expected uptime percentage to account for real-world reliability.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <HelpTooltip content="Expected uptime percentage for licenses you run yourself. This affects revenue calculations by applying a multiplier to your self-run licenses.">
                                    <label className="text-sm text-white block mb-2 font-semibold">
                                        Self-Run License Uptime (%)
                                    </label>
                                </HelpTooltip>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    {[90, 95, 98, 99.5].map((percentage) => (
                                        <button
                                            key={percentage}
                                            onClick={() => setUptimeSelfRun(percentage)}
                                            className={`py-2 px-2 rounded-lg font-semibold text-sm transition-all text-center ${uptimeSelfRun === percentage
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white/10 text-green-200 hover:bg-white/20'
                                                }`}
                                        >
                                            {percentage}%
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={parseFloat(uptimeSelfRun.toFixed(1))}
                                    onChange={(e) => setUptimeSelfRun(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                    step="0.1"
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white mb-2"
                                    min="0"
                                    max="100"
                                />
                                <p className="text-xs text-green-200">
                                    Effective: {formatNumber(effectiveLicensesSelfRun, 1)} of {totalLicensesRunBySelf} licenses
                                </p>
                                <p className="text-xs text-green-200">
                                    Revenue impact: {((uptimeSelfRun / 100) * 100).toFixed(1)}% of full potential
                                </p>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <HelpTooltip content="Expected uptime percentage for licenses leased to others. This affects revenue calculations by applying a multiplier to your leased license earnings.">
                                    <label className="text-sm text-white block mb-2 font-semibold">
                                        Leased License Uptime (%)
                                    </label>
                                </HelpTooltip>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    {[90, 95, 98, 99.5].map((percentage) => (
                                        <button
                                            key={percentage}
                                            onClick={() => setUptimeLeased(percentage)}
                                            className={`py-2 px-2 rounded-lg font-semibold text-sm transition-all text-center ${uptimeLeased === percentage
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                                }`}
                                        >
                                            {percentage}%
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={parseFloat(uptimeLeased.toFixed(1))}
                                    onChange={(e) => setUptimeLeased(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                    step="0.1"
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white mb-2"
                                    min="0"
                                    max="100"
                                />
                                <p className="text-xs text-blue-200">
                                    Effective: {formatNumber(effectiveLicensesLeased, 1)} of {totalLicensesLeased} licenses
                                </p>
                                <p className="text-xs text-blue-200">
                                    Revenue impact: {((uptimeLeased / 100) * 100).toFixed(1)}% of full potential
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-300">Total Effective Licenses:</span>
                                <span className="text-white font-semibold">
                                    {formatNumber(totalEffectiveLicenses, 1)} of {totalActiveLicenses} active licenses
                                </span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-purple-200">Combined uptime impact:</span>
                                <span className="text-purple-100">
                                    {totalActiveLicenses > 0 ? formatNumber((totalEffectiveLicenses / totalActiveLicenses) * 100, 1) : 0}% of full revenue potential
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ramp-Up Configuration */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Ramp-Up Configuration</h2>
                        </div>

                        <p className="text-sm text-purple-300 mb-6">
                            Not all licenses activate immediately. Model realistic growth patterns for license adoption over time.
                            This creates more accurate cash flow projections and break-even calculations.
                        </p>

                        {/* Enable/Disable Toggle */}
                        <div className="mb-6 p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Enable Ramp-Up Modeling</h3>
                                    <p className="text-sm text-purple-300">
                                        {rampUpEnabled ? "Ramp-up enabled - licenses activate gradually" : "Ramp-up disabled - all licenses active from day 1"}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rampUpEnabled}
                                        onChange={(e) => setRampUpEnabled(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </div>

                        {rampUpEnabled && (
                            <>
                                {/* Duration Control */}
                                <div className="mb-6">
                                    <label className="text-sm text-purple-300 block mb-3">
                                        Ramp-Up Duration (months): {rampUpDuration}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="12"
                                        value={rampUpDuration}
                                        onChange={(e) => setRampUpDuration(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                                    />
                                    <div className="flex justify-between text-xs text-purple-400 mt-1">
                                        <span>1 month</span>
                                        <span>6 months (default)</span>
                                        <span>12 months</span>
                                    </div>
                                </div>

                                {/* Curve Selection */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <label className="text-sm text-white block mb-3 font-semibold">
                                            Self-Run Licenses Curve
                                        </label>
                                        <div className="space-y-2">
                                            {Object.entries(rampUpCurves).map(([key, curve]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelfRunRampCurve(key)}
                                                    className={`w-full p-2 rounded-lg text-left transition-all ${selfRunRampCurve === key
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-white/10 text-green-200 hover:bg-white/20'
                                                        }`}
                                                >
                                                    <div className="font-medium">{curve.name}</div>
                                                    <div className="text-xs opacity-80">{curve.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <label className="text-sm text-white block mb-3 font-semibold">
                                            Leased Licenses Curve
                                        </label>
                                        <div className="space-y-2">
                                            {Object.entries(rampUpCurves).map(([key, curve]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setLeasedRampCurve(key)}
                                                    className={`w-full p-2 rounded-lg text-left transition-all ${leasedRampCurve === key
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                                        }`}
                                                >
                                                    <div className="font-medium">{curve.name}</div>
                                                    <div className="text-xs opacity-80">{curve.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Curve Preview Chart */}
                                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                                    <h4 className="text-purple-300 font-semibold mb-3">Ramp-Up Preview</h4>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                            <LineChart>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#9ca3af"
                                                    tick={{ fontSize: 10 }}
                                                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                                                />
                                                <YAxis
                                                    stroke="#9ca3af"
                                                    tick={{ fontSize: 10 }}
                                                    label={{ value: '% Active', angle: -90, position: 'insideLeft' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1f2937',
                                                        border: '1px solid #374151',
                                                        borderRadius: '8px'
                                                    }}
                                                    labelStyle={{ color: '#e5e7eb' }}
                                                    formatter={(value, name) => [
                                                        `${formatNumber(value)}%`,
                                                        name === 'selfRun' ? 'Self-Run Licenses' : 'Leased Licenses'
                                                    ]}
                                                />
                                                <Line
                                                    data={Array.from({ length: rampUpDuration }, (_, i) => ({
                                                        month: i + 1,
                                                        selfRun: getRampUpPercentage(i + 1, selfRunRampCurve, 'selfRun'),
                                                        leased: getRampUpPercentage(i + 1, leasedRampCurve, 'leased')
                                                    }))}
                                                    type="monotone"
                                                    dataKey="selfRun"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    name="selfRun"
                                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                                                />
                                                <Line
                                                    data={Array.from({ length: rampUpDuration }, (_, i) => ({
                                                        month: i + 1,
                                                        selfRun: getRampUpPercentage(i + 1, selfRunRampCurve, 'selfRun'),
                                                        leased: getRampUpPercentage(i + 1, leasedRampCurve, 'leased')
                                                    }))}
                                                    type="monotone"
                                                    dataKey="leased"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    name="leased"
                                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2 text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-green-400">Self-Run ({rampUpCurves[selfRunRampCurve].name})</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-blue-400">Leased ({rampUpCurves[leasedRampCurve].name})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-300">Ramp-up Configuration:</span>
                                        <span className="text-white font-semibold">
                                            {rampUpDuration} months - Self: {rampUpCurves[selfRunRampCurve].name} - Leased: {rampUpCurves[leasedRampCurve].name}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Costs for Self-Run Licenses */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Operating Costs</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <HelpTooltip content="The cost of each smartphone needed to run licenses. You only need phones for licenses you run yourself. Leased licenses are operated by others.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        Phone Cost per License (One-time CapEx)
                                    </label>
                                </HelpTooltip>
                                <input
                                    type="number"
                                    value={phonePrice}
                                    onChange={(e) => setPhonePrice(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                    min="0"
                                />
                                <p className="text-xs text-purple-300 mt-1">
                                    {phonesNeeded} phones needed = ${totalPhoneCost.toLocaleString()}
                                </p>
                                <p className="text-xs text-purple-200 mt-1">
                                    One-time capital expenditure
                                </p>
                            </div>

                            <div>
                                <HelpTooltip content="Monthly cost for SIM cards. Each self-run license requires a SIM card for data connectivity to participate in network verification tasks.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        SIM Monthly Cost per Phone
                                    </label>
                                </HelpTooltip>
                                <input
                                    type="number"
                                    value={simMonthly}
                                    onChange={(e) => setSimMonthly(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                    min="0"
                                />
                                <p className="text-xs text-purple-300 mt-1">
                                    Monthly SIM: ${monthlySimCost.toLocaleString()}
                                </p>
                                <p className="text-xs text-purple-200 mt-1">
                                    Only for self-run licenses
                                </p>
                            </div>

                            <div>
                                <HelpTooltip content="Monthly credit cost for each active license. Credits are required to participate in network verification tasks. You can choose to pay for leased licenses or require license operators to pay their own.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        Monthly Credits per Phone in $
                                    </label>
                                </HelpTooltip>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => setMonthlyCredits(1.99)}
                                        className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 1.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                            }`}
                                    >
                                        $1.99
                                    </button>
                                    <button
                                        onClick={() => setMonthlyCredits(2.99)}
                                        className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 2.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                            }`}
                                    >
                                        $2.99
                                    </button>
                                    <button
                                        onClick={() => setMonthlyCredits(3.99)}
                                        className={`flex-1 py-1 px-2 rounded text-xs font-semibold transition-all ${monthlyCredits === 3.99
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                            }`}
                                    >
                                        $3.99
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    value={monthlyCredits.toFixed(2)}
                                    onChange={(e) => setMonthlyCredits(Math.max(0, parseFloat(e.target.value) || 0))}
                                    step="0.01"
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white mb-2"
                                    min="0"
                                />

                                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                                    <label className="flex items-center gap-2 text-xs text-blue-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={nodeOperatorPaysCredits}
                                            onChange={(e) => setNodeOperatorPaysCredits(e.target.checked)}
                                            className="w-3 h-3"
                                        />
                                        <span>I (Node Operator) pay credits for leased licenses too</span>
                                    </label>
                                </div>

                                <p className="text-xs text-purple-300 mt-2">
                                    {nodeOperatorPaysCredits
                                        ? `Paying for all ${totalActiveLicenses} licenses: $${formatNumber(monthlyCreditCost)}/mo`
                                        : `Paying only for ${totalLicensesRunBySelf} self-run: $${formatNumber(monthlyCreditCost)}/mo`
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-red-300 font-semibold">Initial Investment</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">
                                            ${initialInvestment.toLocaleString()}
                                        </div>
                                        <div className="text-lg font-semibold text-red-200">
                                            €{(initialInvestment * usdToEur).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-red-200 mt-1">
                                    Nodes: ${totalNodeCost.toLocaleString()} + Phones (one-time): ${totalPhoneCost.toLocaleString()}
                                </p>
                            </div>

                            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-orange-300 font-semibold">Monthly Operating Costs</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">
                                            ${totalMonthlyCost.toLocaleString()}
                                        </div>
                                        <div className="text-lg font-semibold text-orange-200">
                                            €{(totalMonthlyCost * usdToEur).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-orange-200 mt-1">
                                    SIM: ${formatNumber(monthlySimCost)} + Credits: ${formatNumber(monthlyCreditCost)}
                                </p>
                                <p className="text-xs text-orange-200">
                                    {nodeOperatorPaysCredits
                                        ? `(Credits for all ${totalActiveLicenses} active licenses)`
                                        : `(Credits only for ${totalLicensesRunBySelf} self-run licenses)`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Model */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-green-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Revenue Model</h2>
                        </div>

                        {/* Market Share Scenarios */}
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h3 className="text-blue-300 font-semibold mb-3">Market Share Scenarios (1.2M Licenses)</h3>
                            <p className="text-sm text-blue-200 mb-3">
                                Based on Unity's projected market share of the global telecom TAM ($2 trillion annually)
                                with 1.2 million total licenses. Assumes max capacity of 7GB per device = $208/month revenue.
                            </p>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {Object.entries(marketScenarios).map(([key, scenario]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setMarketShareScenario(key);
                                            setRevenuePerLicense(scenario.revenuePerLicense);
                                        }}
                                        className={`p-3 rounded-lg transition-all ${marketShareScenario === key
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/10 text-blue-200 hover:bg-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-lg">{scenario.share}% Share</div>
                                        <div className="text-sm font-semibold mt-1">${scenario.revenuePerLicense}/mo</div>
                                        <div className="text-xs mt-1">{scenario.dataGB}GB per device</div>
                                        <div className="text-xs mt-1 text-blue-200">
                                            {scenario.totalLicenses}M total licenses
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white/5 rounded p-3">
                                <div className="text-xs text-blue-200">
                                    <strong>Capacity Note:</strong> Each device can handle max 7GB/month traffic generating $208 revenue.
                                    At 1% share, 1.2M licenses handle the load. At 5% share (35GB/device worth of traffic),
                                    the network would need 6M total licenses (5x more) to distribute the load back to 7GB per device.
                                    At 10% share (70GB/device), 12M licenses (10x more) would be needed.
                                    Your 200 licenses per node represent your fixed share of this growing network capacity.
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            <div>
                                <HelpTooltip content="Monthly revenue earned per active license after the 75% network split (25% goes to network pools). This represents your share of the telecom service fees.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        Earnings per Active License ($/month · €/month)
                                    </label>
                                </HelpTooltip>
                                <div className="mb-2 text-xs text-purple-200 bg-purple-500/10 rounded p-2">
                                    This is the revenue AFTER 75% network split (25% goes to network pools)
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    {[25, 50, 75, 90].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => {
                                                setRevenuePerLicense(value);
                                                setMarketShareScenario('custom');
                                            }}
                                            className={`py-2 px-3 rounded-lg font-semibold transition-all text-center ${revenuePerLicense === value && marketShareScenario === 'custom'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                                }`}
                                        >
                                            ${value} · €{formatNumber(value * usdToEur)}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={parseFloat(revenuePerLicense.toFixed(2))}
                                    onChange={(e) => {
                                        setRevenuePerLicense(Math.max(0, parseFloat(e.target.value) || 0));
                                        setMarketShareScenario('custom');
                                    }}
                                    step="0.5"
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                    min="0"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            setRevenuePerLicense(Math.max(0, (revenuePerLicense || 0) - 5));
                                            setMarketShareScenario('custom');
                                        }}
                                        className="px-3 py-1 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition-colors text-sm font-medium"
                                        aria-label="Decrease earnings by $5/€{formatNumber(5 * usdToEur)}"
                                    >
                                        −$5 · €{formatNumber(5 * usdToEur)}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRevenuePerLicense((revenuePerLicense || 0) + 5);
                                            setMarketShareScenario('custom');
                                        }}
                                        className="px-3 py-1 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition-colors text-sm font-medium"
                                        aria-label="Increase earnings by $5/€{formatNumber(5 * usdToEur)}"
                                    >
                                        +$5 · €{formatNumber(5 * usdToEur)}
                                    </button>
                                </div>
                                <div className="mt-3 pt-2 border-t border-white/10">
                                    <label className="text-xs text-purple-300 block mb-1">
                                        Equivalent Daily Earnings per ULO ($/day)
                                    </label>
                                    <input
                                        type="number"
                                        value={parseFloat((revenuePerLicense / 30).toFixed(2))}
                                        onChange={(e) => {
                                            const daily = Math.max(0, parseFloat(e.target.value) || 0);
                                            setRevenuePerLicense(daily * 30);
                                            setMarketShareScenario('custom');
                                        }}
                                        step="0.01"
                                        className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                        min="0"
                                    />
                                </div>
                                <p className="text-xs text-purple-300 mt-1">
                                    {marketShareScenario === 'custom'
                                        ? 'Custom earnings estimate'
                                        : `Based on ${marketScenarios[marketShareScenario].label}`}
                                </p>
                            </div>

                            <div className="md:mt-8">
                                <HelpTooltip content="Percentage of license earnings you keep when leasing licenses to others. The remaining percentage goes to the license operator who runs the phone and pays operating costs.">
                                    <label className="text-sm text-purple-300 block mb-2">
                                        My Split from Leased Licenses (%)
                                    </label>
                                </HelpTooltip>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    {[25, 50, 75, 90].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setLeaseSplitToOperator(value)}
                                            className={`py-2 px-3 rounded-lg font-semibold transition-all text-center ${leaseSplitToOperator === value
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/10 text-purple-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {value}%
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={leaseSplitToOperator}
                                    onChange={(e) => setLeaseSplitToOperator(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-full bg-white/5 border border-purple-400/30 rounded-lg px-4 py-2 text-white"
                                    min="0"
                                    max="100"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => setLeaseSplitToOperator(Math.max(0, (leaseSplitToOperator || 0) - 5))}
                                        className="px-3 py-1 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition-colors text-sm font-medium"
                                        aria-label="Decrease split by 5%"
                                    >
                                        −5%
                                    </button>
                                    <button
                                        onClick={() => setLeaseSplitToOperator(Math.min(100, (leaseSplitToOperator || 0) + 5))}
                                        className="px-3 py-1 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition-colors text-sm font-medium"
                                        aria-label="Increase split by 5%"
                                    >
                                        +5%
                                    </button>
                                </div>
                                <p className="text-xs text-purple-300 mt-1">
                                    License operator keeps {100 - leaseSplitToOperator}% (and pays their costs)
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <h3 className="text-green-300 text-sm font-semibold mb-2">Self-Run Revenue</h3>
                                <div className="space-y-1 text-xs text-green-200 mb-2">
                                    <div className="flex justify-between">
                                        <span>{formatNumber(effectiveLicensesSelfRun, 1)} effective licenses × ${formatNumber(revenuePerLicense)}</span>
                                        <span>${formatNumber(revenueFromSelfRun)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span>({totalLicensesRunBySelf} total licenses × {uptimeSelfRun}% uptime)</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-green-500/30 mb-2">
                                    <span className="text-green-300 font-semibold">Monthly Total</span>
                                    <span className="text-xl font-bold text-white">
                                        ${formatNumber(revenueFromSelfRun)}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-green-500/20 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-green-200">Per license I earn:</span>
                                        <span className="text-green-100 font-semibold">
                                            ${formatNumber(revenuePerLicense)}/mo
                                        </span>
                                    </div>
                                    <div className="text-xs text-green-200">
                                        (100% - I run & keep all earnings)
                                    </div>
                                    <div className="pt-2 border-t border-green-500/20">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-green-200">Quarterly:</span>
                                            <span className="text-green-100 font-semibold">
                                                ${formatNumber(revenueFromSelfRun * 3)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-green-200">Yearly:</span>
                                            <span className="text-green-100 font-semibold">
                                                ${formatNumber(revenueFromSelfRun * 12)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <h3 className="text-blue-300 text-sm font-semibold mb-2">Leased Revenue</h3>
                                <div className="space-y-1 text-xs text-blue-200 mb-2">
                                    <div className="flex justify-between">
                                        <span>{formatNumber(effectiveLicensesLeased, 1)} effective licenses × ${formatNumber(revenuePerLicense)}</span>
                                        <span>${formatNumber(effectiveLicensesLeased * revenuePerLicense)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>× {leaseSplitToOperator}% (my split)</span>
                                        <span>${formatNumber(revenueFromLeased)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span>({totalLicensesLeased} total licenses × {uptimeLeased}% uptime × {leaseSplitToOperator}% split)</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-blue-500/30 mb-2">
                                    <span className="text-blue-300 font-semibold">Monthly Total</span>
                                    <span className="text-xl font-bold text-white">
                                        ${formatNumber(revenueFromLeased)}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-blue-500/20 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-200">Per license I earn:</span>
                                        <span className="text-blue-100 font-semibold">
                                            ${formatNumber(revenuePerLicense * (leaseSplitToOperator / 100))}/mo
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-200">License operator earns:</span>
                                        <span className="text-blue-100 font-semibold">
                                            ${formatNumber(revenuePerLicense * ((100 - leaseSplitToOperator) / 100))}/mo
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-blue-500/20">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-blue-200">Quarterly:</span>
                                            <span className="text-blue-100 font-semibold">
                                                ${formatNumber(revenueFromLeased * 3)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-blue-200">Yearly:</span>
                                            <span className="text-blue-100 font-semibold">
                                                ${formatNumber(revenueFromLeased * 12)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Revenue Summary */}
                        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <h3 className="text-purple-300 text-sm font-semibold mb-3">Total Revenue Summary</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-purple-300 mb-1">Monthly</div>
                                    <div className="text-2xl font-bold text-white">
                                        ${formatNumber(totalMonthlyRevenue)}
                                    </div>
                                    <div className="text-lg font-semibold text-purple-200">
                                        €{formatNumber(totalMonthlyRevenue * usdToEur)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-purple-300 mb-1">Quarterly (3 months)</div>
                                    <div className="text-2xl font-bold text-white">
                                        ${formatNumber(totalMonthlyRevenue * 3)}
                                    </div>
                                    <div className="text-lg font-semibold text-purple-200">
                                        €{formatNumber(totalMonthlyRevenue * 3 * usdToEur)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-purple-300 mb-1">Yearly (12 months)</div>
                                    <div className="text-2xl font-bold text-white">
                                        ${formatNumber(totalMonthlyRevenue * 12)}
                                    </div>
                                    <div className="text-lg font-semibold text-purple-200">
                                        €{formatNumber(totalMonthlyRevenue * 12 * usdToEur)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Dashboard */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/30">
                            <h3 className="text-sm text-green-300 mb-2">Net Monthly Profit</h3>
                            <div className="mb-2">
                                <p className="text-3xl font-bold text-white">
                                    ${formatNumber(netMonthlyProfit)}
                                </p>
                                <p className="text-xl font-semibold text-green-200">
                                    €{formatNumber(netMonthlyProfit * usdToEur)}
                                </p>
                            </div>
                            <p className="text-xs text-green-300">
                                Revenue: ${formatNumber(totalMonthlyRevenue)} / €{formatNumber(totalMonthlyRevenue * usdToEur)}
                            </p>
                            <p className="text-xs text-green-300">
                                Costs: ${formatNumber(totalMonthlyCost)} / €{formatNumber(totalMonthlyCost * usdToEur)}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30">
                            <h3 className="text-sm text-blue-300 mb-2">Break-Even Period</h3>
                            <p className="text-3xl font-bold text-white mb-1">
                                {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} months
                            </p>
                            <p className="text-sm text-blue-300">
                                {isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths / 12, 1) : '∞'} years
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                            <h3 className="text-sm text-purple-300 mb-2">Annual Profit</h3>
                            <div className="mb-1">
                                <p className="text-3xl font-bold text-white">
                                    ${formatNumber(annualProfit)}
                                </p>
                                <p className="text-xl font-semibold text-purple-200">
                                    €{formatNumber(annualProfit * usdToEur)}
                                </p>
                            </div>
                            <p className="text-sm text-purple-300">
                                Year 1 net profit
                            </p>
                        </div>
                    </div>

                    {/* Visual Charts */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Financial Charts & Visualizations</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Profit Over Time Chart */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-purple-300 font-semibold mb-3">Profit Over Time</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <AreaChart data={profitOverTimeData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#9ca3af"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) => formatNumber(value, 0)}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: '1px solid #374151',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#e5e7eb' }}
                                                formatter={(value, name) => [
                                                    `$${formatNumber(value)}`,
                                                    name === 'netProfit' ? 'Cumulative Net Profit' : name
                                                ]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="netProfit"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.3}
                                                name="Cumulative Profit"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-xs text-purple-300 mt-2">
                                    Shows cumulative profit over 36 months, including initial investment
                                </p>
                            </div>

                            {/* Cost Breakdown Chart */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-purple-300 font-semibold mb-3">Cost Breakdown</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={costBreakdownData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {costBreakdownData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: '1px solid #374151',
                                                    borderRadius: '8px'
                                                }}
                                                formatter={(value) => [`$${formatNumber(value)}`, 'Cost']}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-xs text-purple-300 mt-2">
                                    Breakdown of all costs: initial investment and monthly operating costs
                                </p>
                            </div>
                        </div>

                        {/* ROI Comparison Chart */}
                        <div className="bg-white/5 rounded-lg p-4">
                            <h3 className="text-purple-300 font-semibold mb-3">ROI Comparison</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={roiComparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="scenario" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                        <YAxis
                                            stroke="#9ca3af"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value, name) => [
                                                name === 'roi' ? `${formatNumber(value, 1)}%` : `$${formatNumber(value)}`,
                                                name === 'roi' ? 'ROI Percentage' : 'Total Profit'
                                            ]}
                                        />
                                        <Bar dataKey="roi" fill="#8b5cf6" name="roi" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-purple-300 mt-2">
                                Compares 12-month and 24-month ROI percentages
                            </p>
                        </div>
                    </div>

                    {/* Scenario Comparison */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-purple-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Scenario Comparison</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Save Current Scenario */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-purple-300 font-semibold mb-3">Save Current Scenario</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={scenarioName}
                                        onChange={(e) => setScenarioName(e.target.value)}
                                        placeholder="Enter scenario name..."
                                        className="w-full bg-white/10 border border-purple-400/30 rounded-lg px-4 py-2 text-white placeholder-purple-400"
                                    />
                                    <button
                                        onClick={saveCurrentScenario}
                                        disabled={!scenarioName.trim()}
                                        className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Save Scenario
                                    </button>
                                </div>
                                <p className="text-xs text-purple-300 mt-2">
                                    Save your current configuration to compare with other scenarios
                                </p>
                            </div>

                            {/* Saved Scenarios List */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h3 className="text-purple-300 font-semibold mb-3">Saved Scenarios ({savedScenarios.length})</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {savedScenarios.length === 0 ? (
                                        <p className="text-purple-400 text-sm">No saved scenarios yet</p>
                                    ) : (
                                        savedScenarios.map(scenario => (
                                            <div key={scenario.id} className="flex items-center justify-between bg-white/10 rounded p-2">
                                                <div className="flex-1">
                                                    <div className="text-white font-medium text-sm">{scenario.name}</div>
                                                    <div className="text-purple-300 text-xs">
                                                        ${formatNumber(scenario.netMonthlyProfit)}/mo · ROI: {formatNumber(scenario.roi12Month, 1)}%
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => loadScenario(scenario)}
                                                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                                                    >
                                                        Load
                                                    </button>
                                                    <button
                                                        onClick={() => deleteScenario(scenario.id)}
                                                        className="text-red-400 hover:text-red-300 text-xs font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        {savedScenarios.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-purple-300 font-semibold mb-3">Scenario Comparison</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full bg-white/5 rounded-lg overflow-hidden">
                                        <thead className="bg-purple-500/20">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-purple-300 font-semibold text-sm">Scenario</th>
                                                <th className="px-4 py-2 text-right text-purple-300 font-semibold text-sm">Monthly Profit</th>
                                                <th className="px-4 py-2 text-right text-purple-300 font-semibold text-sm">Break-Even</th>
                                                <th className="px-4 py-2 text-right text-purple-300 font-semibold text-sm">12M ROI</th>
                                                <th className="px-4 py-2 text-right text-purple-300 font-semibold text-sm">Uptime Self/Leased</th>
                                                <th className="px-4 py-2 text-right text-purple-300 font-semibold text-sm">Initial Invest</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Current scenario */}
                                            <tr className="border-t border-white/10 bg-blue-500/10">
                                                <td className="px-4 py-2 text-white font-medium">Current</td>
                                                <td className="px-4 py-2 text-right text-green-400">${formatNumber(netMonthlyProfit)}</td>
                                                <td className="px-4 py-2 text-right text-blue-400">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) + ' mo' : '∞'}</td>
                                                <td className="px-4 py-2 text-right text-purple-400">{formatNumber(roi12Month, 1)}%</td>
                                                <td className="px-4 py-2 text-right text-cyan-400">{uptimeSelfRun}%/{uptimeLeased}%</td>
                                                <td className="px-4 py-2 text-right text-orange-400">${formatNumber(initialInvestment)}</td>
                                            </tr>
                                            {/* Saved scenarios */}
                                            {savedScenarios.map(scenario => (
                                                <tr key={scenario.id} className="border-t border-white/10">
                                                    <td className="px-4 py-2 text-white font-medium">{scenario.name}</td>
                                                    <td className="px-4 py-2 text-right text-green-400">${formatNumber(scenario.netMonthlyProfit)}</td>
                                                    <td className="px-4 py-2 text-right text-blue-400">{isFinite(scenario.breakEvenMonths) ? formatNumber(scenario.breakEvenMonths, 1) + ' mo' : '∞'}</td>
                                                    <td className="px-4 py-2 text-right text-purple-400">{formatNumber(scenario.roi12Month, 1)}%</td>
                                                    <td className="px-4 py-2 text-right text-cyan-400">{scenario.uptimeSelfRun ?? 95}%/{scenario.uptimeLeased ?? 95}%</td>
                                                    <td className="px-4 py-2 text-right text-orange-400">${formatNumber(scenario.initialInvestment)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ROI Analysis */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <h2 className="text-xl font-bold text-white mb-4">ROI Analysis</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-purple-300">12-Month ROI</span>
                                        <span className={`text-2xl font-bold ${roi12Month > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {formatNumber(roi12Month, 1)}%
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-white/20">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-purple-200">Total Profit:</span>
                                            <span className="text-white font-semibold">
                                                ${formatNumber(netMonthlyProfit * 12)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-purple-200">In EUR:</span>
                                            <span className="text-purple-100">
                                                €{formatNumber(netMonthlyProfit * 12 * usdToEur)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-purple-300">24-Month ROI (Token Unlock)</span>
                                        <span className={`text-2xl font-bold ${roi24Month > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {formatNumber(roi24Month, 1)}%
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-white/20">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-purple-200">Total Profit:</span>
                                            <span className="text-white font-semibold">
                                                ${formatNumber(netMonthlyProfit * 24)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-purple-200">In EUR:</span>
                                            <span className="text-purple-100">
                                                €{formatNumber(netMonthlyProfit * 24 * usdToEur)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                    <p className="text-xs text-purple-200">
                                        <strong>Token Value:</strong> At unlock, you'll also have access to the staked tokens
                                        (${(numNodes * 1875).toLocaleString()} MNTx + ${(numNodes * 1875).toLocaleString()} WMTx),
                                        which could add significant value depending on token prices.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="text-yellow-400" size={18} />
                                    <h3 className="text-yellow-300 font-semibold">Key Assumptions & Help</h3>
                                </div>
                                <ul className="text-sm text-yellow-200 space-y-1">
                                    <li>• Each node includes {licensesPerNode} Unity License NFTs</li>
                                    <li>• Market share scenarios based on 1.2M total licenses</li>
                                    <li>• Max device capacity: 7GB = $208/month revenue</li>
                                    <li>• 1% share = 7GB | 5% = 35GB (~5x licenses) | 10% = 70GB (~10x licenses)</li>
                                    <li>• Current: {marketShareScenario === 'custom' ? 'custom' : marketScenarios[marketShareScenario].label}</li>
                                    <li>• Self-run licenses: You keep 100% of license earnings</li>
                                    <li>• Leased licenses: Split earnings based on your % split</li>
                                    <li>• Uptime accounts for device downtime, maintenance, and network issues</li>
                                    <li>• Self-run uptime: {uptimeSelfRun}% | Leased uptime: {uptimeLeased}% (effective: {formatNumber(totalEffectiveLicenses, 1)} of {totalActiveLicenses} licenses)</li>
                                    <li>• Tokens locked for 24 months</li>
                                    <li>• Your {numNodes * licensesPerNode} licenses represent your fixed share of network capacity</li>
                                    <li>• Token appreciation not included in ROI</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Target Calculator */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-green-400" />
                                Earnings Target Calculator
                            </h2>
                            <button
                                onClick={() => setEarningsTargetExpanded(!earningsTargetExpanded)}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                {earningsTargetExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>

                        {earningsTargetExpanded && (
                            <div className="space-y-6">
                                {/* Input Controls */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-purple-300 font-medium">
                                            Target Revenue ($)
                                            <HelpTooltip content="The total revenue amount you want to achieve">
                                                <span></span>
                                            </HelpTooltip>
                                        </label>
                                        <input
                                            type="number"
                                            value={targetRevenue}
                                            onChange={(e) => setTargetRevenue(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            placeholder="10000"
                                            min="0"
                                            step="100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-purple-300 font-medium">
                                            Active Licenses
                                            <HelpTooltip content="Number of licenses that are actively running and earning">
                                                <span></span>
                                            </HelpTooltip>
                                        </label>
                                        <input
                                            type="number"
                                            value={activeLicensesCount}
                                            onChange={(e) => setActiveLicensesCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            placeholder={totalActiveLicenses.toString()}
                                            min="1"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-purple-300 font-medium">
                                            Time Period
                                            <HelpTooltip content="The time period for the earnings calculation">
                                                <span></span>
                                            </HelpTooltip>
                                        </label>
                                        <select
                                            value={targetTimePeriod}
                                            onChange={(e) => setTargetTimePeriod(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/10 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="daily">Daily</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Daily Earnings Display - Always Visible */}
                                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/40 rounded-xl p-6 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock size={24} className="text-yellow-400" />
                                                <h3 className="text-xl font-bold text-yellow-300">Daily Earnings Required</h3>
                                            </div>
                                            <div className="text-yellow-200 text-sm mb-1">per license per day</div>
                                            <div className="text-white text-3xl font-bold">${formatNumber(dailyEarningsRequiredPerLicense, 3)}</div>
                                            <div className="text-yellow-200 text-xs mt-1">
                                                Each phone needs to earn this much daily
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-yellow-300 text-sm font-medium">
                                                Based on {targetTimePeriod} target
                                            </div>
                                            <div className="text-yellow-200 text-xs mt-1">
                                                Converted from ${formatNumber(netEarningsRequired)} {targetTimePeriod.slice(0, -2)} requirement
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Display */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Target Summary */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-green-400/30">
                                        <div className="text-green-300 text-sm font-medium mb-1">Target Summary</div>
                                        <div className="text-white text-lg font-bold">${formatNumber(targetRevenue)}</div>
                                        <div className="text-green-200 text-xs">
                                            {targetTimePeriod} with {activeLicensesCount} licenses
                                        </div>
                                    </div>

                                    {/* Gross Earnings Needed */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                                        <div className="text-blue-300 text-sm font-medium mb-1">Gross Earnings Needed</div>
                                        <div className="text-white text-lg font-bold">${formatNumber(grossEarningsNeeded)}</div>
                                        <div className="text-blue-200 text-xs">
                                            per license per {targetTimePeriod.slice(0, -2)}
                                        </div>
                                    </div>

                                    {/* Operating Costs */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-orange-400/30">
                                        <div className="text-orange-300 text-sm font-medium mb-1">Operating Costs</div>
                                        <div className="text-white text-lg font-bold">${formatNumber(operatingCostsPerLicense)}</div>
                                        <div className="text-orange-200 text-xs">
                                            per license per {targetTimePeriod.slice(0, -2)}
                                        </div>
                                    </div>

                                    {/* Net Earnings Required */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-purple-400/30">
                                        <div className="text-purple-300 text-sm font-medium mb-1">Net Earnings Required</div>
                                        <div className="text-white text-xl font-bold">${formatNumber(netEarningsRequired)}</div>
                                        <div className="text-purple-200 text-xs">
                                            per license per {targetTimePeriod.slice(0, -2)}
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                                    <h3 className="text-white font-semibold mb-3">Cost Breakdown per License</h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-purple-200">Hardware Amortization:</div>
                                            <div className="text-white font-semibold">
                                                ${formatNumber((phonePrice * numNodes * licensesPerNode) / (totalActiveLicenses * 24), 2)}/month
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-purple-200">SIM Card:</div>
                                            <div className="text-white font-semibold">${formatNumber(simMonthly)}/month</div>
                                        </div>
                                        <div>
                                            <div className="text-purple-200">Unity Credits:</div>
                                            <div className="text-white font-semibold">
                                                ${formatNumber(nodeOperatorPaysCredits ? monthlyCredits : 0)}/month
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actual Earnings Comparison */}
                                {actualEarningsData.hasData && (
                                    <div className="bg-white/5 rounded-lg p-4 border border-cyan-400/30">
                                        <h3 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                                            <BarChart3 size={16} />
                                            Actual Earnings Comparison
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-cyan-200 text-sm">Current Average:</div>
                                                <div className="text-white font-bold">${formatNumber(actualEarningsData.currentAveragePerLicense)}</div>
                                                <div className="text-cyan-200 text-xs">per transaction</div>
                                            </div>
                                            <div>
                                                <div className="text-cyan-200 text-sm">Gap to Target:</div>
                                                <div className={`font-bold ${earningsGap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                    ${formatNumber(Math.abs(earningsGap))} {earningsGap > 0 ? 'short' : 'surplus'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-cyan-200 text-sm">Progress:</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-white/10 rounded-full h-2">
                                                        <div
                                                            className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${progressPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-white font-bold text-xs">{formatNumber(progressPercentage)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Information Note */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <Info className="text-blue-400 mt-0.5" size={16} />
                                        <div className="text-blue-200 text-sm">
                                            <strong>How to use:</strong> Set your desired revenue target and see exactly how much each license needs to earn.
                                            The calculator automatically factors in your operational costs. Compare with your actual earnings data to track progress toward your goals.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Summary (Mobile) */}
                    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden pointer-events-none">
                        <div className="pointer-events-auto mx-auto max-w-7xl px-4 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                            <div className="rounded-t-xl bg-white/10 backdrop-blur-lg border border-white/20 p-3 shadow-lg">
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <div>
                                        <div className="text-green-300 font-semibold">Net Monthly Profit</div>
                                        <div className="text-white font-bold">${formatNumber(netMonthlyProfit)}</div>
                                        <div className="text-green-200">€{formatNumber(netMonthlyProfit * usdToEur)}</div>
                                        <div className="text-yellow-300 font-semibold mt-1">Daily</div>
                                        <div className="text-white font-bold">${formatNumber(dailyNetProfit)}</div>
                                        <div className="text-yellow-200">€{formatNumber(dailyNetProfitEur)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-blue-300 font-semibold">Break-Even</div>
                                        <div className="text-white font-bold">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) : '∞'} mo</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-purple-300 font-semibold">Annual</div>
                                        <div className="text-white font-bold">${formatNumber(annualRevenue)}</div>
                                        <div className="text-purple-200">€{formatNumber(annualRevenue * usdToEur)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-red-200">
                            <strong>Disclaimer:</strong> This calculator is for illustrative purposes only and does not constitute financial advice.
                            Actual returns may vary significantly based on network performance, market conditions, license operator activity, token prices,
                            and other factors. Cryptocurrency investments carry substantial risk. The revenue per license is a conservative estimate
                            and may be higher or lower in practice. Always conduct thorough research and consult financial professionals before making
                            investment decisions.
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error rendering UnityNodesROICalculator:', error);
        return (
            <div className="min-h-screen bg-red-900 p-6 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Calculator</h1>
                    <p className="text-gray-700 mb-4">
                        There was an error loading the Unity Nodes ROI Calculator.
                    </p>
                    <p className="text-sm text-gray-500">
                        Error: {error.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}