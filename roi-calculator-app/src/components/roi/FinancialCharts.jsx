import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/formatters.js';

export function FinancialCharts({ profitOverTimeData, costBreakdownData, roiComparisonData }) {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-purple-400" size={24} />
                <h2 className="text-xl font-bold text-white">Financial Charts & Visualizations</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                                    formatter={(value) => [`$${formatNumber(value)}`, 'Cumulative Net Profit']}
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
                                formatter={(value) => `${formatNumber(value, 1)}%`}
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
    );
}
