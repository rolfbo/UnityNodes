/**
 * Number formatting utility for locale-formatted display
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};
