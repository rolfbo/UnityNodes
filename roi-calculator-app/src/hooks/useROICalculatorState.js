import { useEffect } from 'react';
import { usePersistentState } from '../utils/usePersistentState.js';
import { getUrlParams } from '../utils/urlParams.js';
import { rampUpCurves } from '../utils/roiConstants.js';

/**
 * Custom hook managing all persistent ROI Calculator state.
 * Handles URL parameter loading on mount.
 *
 * IMPORTANT: All localStorage keys must remain identical to preserve user data.
 */
export function useROICalculatorState() {
    // Node Configuration
    const [numNodes, setNumNodes] = usePersistentState('roi_numNodes', 4);
    const [licensesPerNode, setLicensesPerNode] = usePersistentState('roi_licensesPerNode', 200);

    // Exchange rate
    const [usdToEur, setUsdToEur] = usePersistentState('roi_usdToEur', 0.92);

    // License Distribution
    const [licensesRunBySelf, setLicensesRunBySelf] = usePersistentState('roi_licensesRunBySelf', 0);
    const [licensesLeased, setLicensesLeased] = usePersistentState('roi_licensesLeased', 150);
    const [licensesInactive, setLicensesInactive] = usePersistentState('roi_licensesInactive', 50);

    // Costs
    const [phonePrice, setPhonePrice] = usePersistentState('roi_phonePrice', 80);
    const [simMonthly, setSimMonthly] = usePersistentState('roi_simMonthly', 10);
    const [monthlyCredits, setMonthlyCredits] = usePersistentState('roi_monthlyCredits', 1.99);
    const [creditsActive, setCreditsActive] = usePersistentState('roi_creditsActive', false);
    const [nodeOperatorPaysCredits, setNodeOperatorPaysCredits] = usePersistentState('roi_nodeOperatorPaysCredits', true);

    // Revenue Model
    const [revenuePerLicense, setRevenuePerLicense] = usePersistentState('roi_revenuePerLicense', 75);
    const [leaseSplitToOperator, setLeaseSplitToOperator] = usePersistentState('roi_leaseSplitToOperator', 40);

    // Market Share
    const [marketShareScenario, setMarketShareScenario] = usePersistentState('roi_marketShareScenario', 'conservative');

    // Uptime
    const [uptimeSelfRun, setUptimeSelfRun] = usePersistentState('roi_uptimeSelfRun', 95);
    const [uptimeLeased, setUptimeLeased] = usePersistentState('roi_uptimeLeased', 95);

    // Ramp-Up
    const [rampUpEnabled, setRampUpEnabled] = usePersistentState('roi_rampUpEnabled', false);
    const [rampUpDuration, setRampUpDuration] = usePersistentState('roi_rampUpDuration', 6);
    const [selfRunRampCurve, setSelfRunRampCurve] = usePersistentState('roi_selfRunRampCurve', 'moderate');
    const [leasedRampCurve, setLeasedRampCurve] = usePersistentState('roi_leasedRampCurve', 'slow');

    // UI toggles
    const [realityCheckExpanded, setRealityCheckExpanded] = usePersistentState('roi_realityCheckExpanded', true);

    // Earnings Target
    const [targetRevenue, setTargetRevenue] = usePersistentState('roi_targetRevenue', 10000);
    const [targetTimePeriod, setTargetTimePeriod] = usePersistentState('roi_targetTimePeriod', 'monthly');
    const [activeLicensesCount, setActiveLicensesCount] = usePersistentState('roi_activeLicensesCount', 100);
    const [earningsTargetExpanded, setEarningsTargetExpanded] = usePersistentState('roi_earningsTargetExpanded', true);

    // Load from URL params on mount
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
        if (urlParams.creditsActive !== undefined) setCreditsActive(urlParams.creditsActive === 'true');
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
        if (urlParams.targetRevenue) setTargetRevenue(Math.max(0, parseFloat(urlParams.targetRevenue) || 10000));
        if (urlParams.targetTimePeriod) setTargetTimePeriod(urlParams.targetTimePeriod);
        if (urlParams.activeLicensesCount) setActiveLicensesCount(Math.max(1, parseInt(urlParams.activeLicensesCount) || 100));
        if (urlParams.earningsTargetExpanded !== undefined) setEarningsTargetExpanded(urlParams.earningsTargetExpanded === 'true');
    }, []);

    return {
        numNodes, setNumNodes,
        licensesPerNode, setLicensesPerNode,
        usdToEur, setUsdToEur,
        licensesRunBySelf, setLicensesRunBySelf,
        licensesLeased, setLicensesLeased,
        licensesInactive, setLicensesInactive,
        phonePrice, setPhonePrice,
        simMonthly, setSimMonthly,
        monthlyCredits, setMonthlyCredits,
        creditsActive, setCreditsActive,
        nodeOperatorPaysCredits, setNodeOperatorPaysCredits,
        revenuePerLicense, setRevenuePerLicense,
        leaseSplitToOperator, setLeaseSplitToOperator,
        marketShareScenario, setMarketShareScenario,
        uptimeSelfRun, setUptimeSelfRun,
        uptimeLeased, setUptimeLeased,
        rampUpEnabled, setRampUpEnabled,
        rampUpDuration, setRampUpDuration,
        selfRunRampCurve, setSelfRunRampCurve,
        leasedRampCurve, setLeasedRampCurve,
        realityCheckExpanded, setRealityCheckExpanded,
        targetRevenue, setTargetRevenue,
        targetTimePeriod, setTargetTimePeriod,
        activeLicensesCount, setActiveLicensesCount,
        earningsTargetExpanded, setEarningsTargetExpanded
    };
}
