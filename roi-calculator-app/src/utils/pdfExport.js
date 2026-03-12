import jsPDF from 'jspdf';
import { formatNumber } from './formatters.js';

/**
 * Export ROI Calculator results to PDF
 * @param {Object} data - All data needed for the PDF report
 */
export const exportROIToPDF = (data) => {
    const {
        numNodes, licensesPerNode, licensesRunBySelf, licensesLeased, licensesInactive,
        phonePrice, simMonthly, monthlyCredits, creditsActive, revenuePerLicense,
        leaseSplitToOperator, uptimeSelfRun, uptimeLeased,
        effectiveLicensesSelfRun, effectiveLicensesLeased,
        rampUpEnabled, rampUpDuration, selfRunRampCurve, leasedRampCurve,
        usdToEur, marketShareScenario,
        initialInvestment, totalMonthlyRevenue, totalMonthlyCost,
        netMonthlyProfit, breakEvenMonths, roi12Month, roi24Month, annualProfit,
        rampUpCurves, marketScenarios
    } = data;

    const pdf = new jsPDF('p', 'mm', 'a4');

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
        `Monthly Credits: $${monthlyCredits.toFixed(2)} ${creditsActive ? '(Active)' : '(Inactive)'}`,
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
        `Market Scenario: ${marketShareScenario === 'custom' ? 'Custom' : marketScenarios[marketShareScenario]?.label || 'Unknown'}`
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
