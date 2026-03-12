import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardCharts({ chartData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <h3 className="text-purple-300 font-semibold mb-4">Daily Earnings</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData.daily || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Area type="monotone" dataKey="earnings" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
                <h3 className="text-purple-300 font-semibold mb-4">License Type Distribution</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie data={chartData.licenseType || []} cx="50%" cy="50%" dataKey="value" outerRadius={80} fill="#a78bfa">
                                {(chartData.licenseType || []).map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
