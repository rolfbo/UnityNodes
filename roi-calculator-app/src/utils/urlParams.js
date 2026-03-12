/**
 * URL parameter utilities for sharing calculator configurations
 */

/**
 * Read calculator state from URL query parameters
 * @returns {Object} Parsed URL parameters (all values are strings or null)
 */
export const getUrlParams = () => {
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
        creditsActive: params.get('creditsActive'),
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
        leasedRampCurve: params.get('leasedRampCurve'),
        targetRevenue: params.get('targetRevenue'),
        targetTimePeriod: params.get('targetTimePeriod'),
        activeLicensesCount: params.get('activeLicensesCount'),
        earningsTargetExpanded: params.get('earningsTargetExpanded')
    };
};

/**
 * Generate a shareable URL with current calculator state
 * @param {Object} state - All state values to encode in the URL
 * @returns {string} Full URL with query parameters
 */
export const generateShareUrl = (state) => {
    const params = new URLSearchParams();
    Object.entries(state).forEach(([key, value]) => {
        params.set(key, value.toString());
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
    }
};
