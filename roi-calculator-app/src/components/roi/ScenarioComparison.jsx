import { TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';

export function ScenarioComparison({
    savedScenarios, scenarioName, setScenarioName,
    saveCurrentScenario, loadScenario, deleteScenario,
    netMonthlyProfit, breakEvenMonths, roi12Month, uptimeSelfRun, uptimeLeased, initialInvestment
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Scenario Comparison</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-white/10 bg-blue-500/10">
                                    <td className="px-4 py-2 text-white font-medium">Current</td>
                                    <td className="px-4 py-2 text-right text-green-400">${formatNumber(netMonthlyProfit)}</td>
                                    <td className="px-4 py-2 text-right text-blue-400">{isFinite(breakEvenMonths) ? formatNumber(breakEvenMonths, 1) + ' mo' : '∞'}</td>
                                    <td className="px-4 py-2 text-right text-purple-400">{formatNumber(roi12Month, 1)}%</td>
                                </tr>
                                {savedScenarios.map(scenario => (
                                    <tr key={scenario.id} className="border-t border-white/10">
                                        <td className="px-4 py-2 text-white font-medium">{scenario.name}</td>
                                        <td className="px-4 py-2 text-right text-green-400">${formatNumber(scenario.netMonthlyProfit)}</td>
                                        <td className="px-4 py-2 text-right text-blue-400">{isFinite(scenario.breakEvenMonths) ? formatNumber(scenario.breakEvenMonths, 1) + ' mo' : '∞'}</td>
                                        <td className="px-4 py-2 text-right text-purple-400">{formatNumber(scenario.roi12Month, 1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
