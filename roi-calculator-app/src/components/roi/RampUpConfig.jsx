import { TrendingUp } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/formatters.js';
import { rampUpCurves } from '../../utils/roiConstants.js';

export function RampUpConfig({
    rampUpEnabled, setRampUpEnabled,
    rampUpDuration, setRampUpDuration,
    selfRunRampCurve, setSelfRunRampCurve,
    leasedRampCurve, setLeasedRampCurve,
    getRampUpPercentage
}) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Ramp-Up Configuration</h2>
            </div>

            <p className="text-sm text-purple-300 mb-6">
                Not all licenses activate immediately. Model realistic growth patterns for license adoption over time.
                This creates more accurate cash flow projections and break-even calculations.
            </p>

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

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                                        formatter={(value) => `${formatNumber(value)}%`}
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
                    </div>
                </>
            )}
        </div>
    );
}
