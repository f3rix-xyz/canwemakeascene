"use client";
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp } from 'lucide-react';

interface MaxFlowData {
    percentage: number;
    totalReadings: number;
    maxFlowAlerts: number;
    date: string;
}

const MaxWaterFlow = () => {
    const [data, setData] = useState<MaxFlowData | null>(null);
    const deviceId = typeof window !== 'undefined'
        ? localStorage.getItem('deviceId')
        : null;
    const baseUrl = process.env.NEXT_PUBLIC_host;

    useEffect(() => {
        const fetchMaxFlow = async () => {
            try {
                const response = await fetch(`${baseUrl}/newWaterReading/${deviceId}/maxflow-percentage`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching max flow:', error);
            }
        };

        fetchMaxFlow();
    }, [deviceId, baseUrl]);

    const pieData = [
        { name: 'Normal Flow', value: data ? 100 - data.percentage : 0 },
        { name: 'Max Flow', value: data ? data.percentage : 0 }
    ];

    const COLORS = ['#3B82F6', '#FCA5A5'];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Max Water Flow</h2>
                <p className="text-gray-500 text-sm mt-1">Yesterday's Analysis</p>
            </div>

            <div className="relative h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={450}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    strokeWidth={0}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-900">
                        {data?.percentage}%
                    </span>
                    <span className="text-sm text-gray-500">Max Flow</span>
                </div>
            </div>

            {/* Legend and Stats */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {pieData.map((item, index) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2 p-3 rounded-lg bg-slate-50"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                                <p className="text-lg font-semibold text-gray-900">{item.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Stats */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Threshold</span>
                        <div className="flex items-center gap-1 text-blue-700">
                            <ArrowUp className="w-4 h-4" />
                            <span>8000 L/h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaxWaterFlow;