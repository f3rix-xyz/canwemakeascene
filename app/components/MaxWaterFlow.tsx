"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowUp } from "lucide-react";

interface MaxFlowData {
  percentage: number;
  totalReadings: number;
  maxFlowAlerts: number;
  date: string;
}

const MaxWaterFlow = () => {
  const [data, setData] = useState<MaxFlowData | null>(null);
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
  const baseUrl = process.env.NEXT_PUBLIC_host;

  useEffect(() => {
    const fetchMaxFlow = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/newWaterReading/${deviceId}/maxflow-percentage`,
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching max flow:", error);
      }
    };

    fetchMaxFlow();
  }, [deviceId, baseUrl]);

  const pieData = [
    { name: "Normal Flow", value: data ? 100 - data.percentage : 0 },
    { name: "Max Flow", value: data ? data.percentage : 0 },
  ];

  const COLORS = ["#3B82F6", "#FCA5A5"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-roboto text-2xl font-semibold text-[#1A2955] mb-2">
          Max Water Flow
        </h2>
        <p className="font-inter text-base font-medium text-[#686E80]">
          Yesterday's Analysis
        </p>
      </div>

      <div className="relative h-[240px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={450}
              paddingAngle={3}
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
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
          <span className="font-roboto text-[2.5rem] font-bold text-[#1A2955]">
            {data?.percentage}%
          </span>
          <span className="font-inter text-base font-medium text-[#686E80]">
            Max Flow
          </span>
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {pieData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#F6F8FE]"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <div>
                <p className="font-inter text-base font-medium text-[#686E80] mb-1">
                  {item.name}
                </p>
                <p className="font-roboto text-xl font-semibold text-[#1A2955]">
                  {item.value}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-inter text-base font-medium text-blue-700">
              Threshold
            </span>
            <div className="flex items-center gap-2 text-blue-700">
              <ArrowUp className="w-5 h-5" />
              <span className="font-inter text-base font-medium">8000 L/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaxWaterFlow;
