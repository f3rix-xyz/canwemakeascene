"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { CheckCircle2 } from "lucide-react";

const LeakageChart = () => {
    const [data, setData] = useState<{ [key: string]: number }>({});
    const deviceId = typeof window !== 'undefined'
        ? localStorage.getItem('deviceId')
        : null;
    const baseUrl = process.env.NEXT_PUBLIC_host;

    useEffect(() => {
        const fetchLeakage = async () => {
            try {
                const response = await fetch(`${baseUrl}/newWaterReading/${deviceId}/leakage-analysis`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching leakage:', error);
            }
        };
        fetchLeakage();
    }, [deviceId, baseUrl]);

    const chartData = Object.entries(data).map(([date, value]) => {
        const dateObj = new Date(date);
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const day = dateObj.getDate();
        return {
            date: `${day} ${month}`,
            value: Number(value)
        };
    }).reverse();

    const maxValue = Math.max(...chartData.map(item => item.value));
    const allZeros = maxValue === 0;

    if (allZeros) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Estimated Leakage</h2>
                        <p className="text-gray-500 mt-1">Last 10 days analysis</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-lg">
                        <span className="text-blue-700 font-medium">0L</span>
                        <span className="text-blue-600/60 ml-2">Peak</span>
                    </div>
                </div>

                <div className="h-[400px] w-full flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 rounded-xl border border-blue-100">
                    <div className="text-center space-y-4 px-6 py-8 rounded-xl">
                        <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                        <h3 className="text-2xl font-semibold text-blue-900">
                            No Leakage Detected
                        </h3>
                        <p className="text-blue-600 text-lg max-w-md">
                            Your system has been running efficiently with no detected leaks for the past 10 days.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Estimated Leakage</h2>
                    <p className="text-gray-500 mt-1">Last 10 days analysis</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">
                        {maxValue.toLocaleString()}L
                    </span>
                    <span className="text-blue-600/60 ml-2">Peak</span>
                </div>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                        barSize={40}
                    >
                        <defs>
                            <linearGradient id="leakageGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="rgb(147, 197, 253)" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dx={-10}
                            tickFormatter={(value) => `${value}L`}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-100">
                                            <p className="text-gray-600">{payload[0].payload.date}</p>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {`${payload[0].value?.toLocaleString()}L`}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="url(#leakageGradient)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LeakageChart;