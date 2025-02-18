"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

export const NoConsumption = () => {
  const [data, setData] = useState<{
    [key: string]: string;
  }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
  const baseUrl = process.env.NEXT_PUBLIC_host;

  useEffect(() => {
    const fetchConsumption = async () => {
      if (!deviceId) return;
      try {
        const month = format(currentMonth, "M");
        const year = format(currentMonth, "yyyy");
        const response = await fetch(
          `${baseUrl}/newWaterReading/${deviceId}/consumption-analysis?month=${month}&year=${year}`,
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching consumption:", error);
      }
    };

    fetchConsumption();
  }, [deviceId, currentMonth, baseUrl]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const noConsumptionDays = Object.values(data).filter(
    (v) => v === "no-consumption",
  ).length;

  const renderCalendar = () => {
    const days = Object.entries(data).map(([date, status]) => ({
      date: parseISO(date),
      hasConsumption: status === "consumption",
    }));

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-gray-500 p-2 text-center"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center rounded-lg text-sm
              ${!day.hasConsumption ? "bg-green-100 text-green-700 font-medium" : "text-gray-700 hover:bg-slate-50"}`}
          >
            {format(day.date, "d")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section - Aligned horizontally */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-roboto text-2xl font-semibold text-[#1A2955]">
            No Consumption
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full whitespace-nowrap">
            <CalendarIcon className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-700 font-inter">
              {noConsumptionDays} days
            </span>
          </div>
        </div>
        <p className="font-inter text-base font-medium text-[#686E80]">
          Days without water usage
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
            )
          }
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-base font-medium text-gray-900 font-inter">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() =>
            setCurrentMonth(
              (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
            )
          }
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {renderCalendar()}
    </div>
  );
};
