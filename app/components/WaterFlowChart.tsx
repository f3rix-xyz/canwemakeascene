"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { format, startOfMonth, startOfYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronLeft, ChevronRight } from "lucide-react";

type TimeFilter = "day" | "month" | "year";

interface ReadingData {
  time: string;
  reading: string;
}

export const WaterFlowChart = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("day");
  const [data, setData] = useState<ReadingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );

  const calculateYDomain = (data: ReadingData[]) => {
    if (!data.length) return [0, 100];
    const maxReading = Math.max(
      ...data.map((item) => Number.parseFloat(item.reading)),
    );
    const buffer = maxReading * 0.2;
    return [0, maxReading + buffer];
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    switch (timeFilter) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "year":
        newDate.setFullYear(
          newDate.getFullYear() + (direction === "next" ? 1 : -1),
        );
        break;
    }
    setSelectedDate(newDate);
  };

  const getDisplayDate = () => {
    switch (timeFilter) {
      case "day":
        return format(selectedDate, "dd MMM yyyy");
      case "month":
        return format(selectedDate, "MMMM yyyy");
      case "year":
        return format(selectedDate, "yyyy");
    }
  };
  const fetchData = async () => {
    if (!deviceId) return;

    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_host;
      let url = "";

      switch (timeFilter) {
        case "day":
          url = `${baseUrl}/readingperhour/${deviceId}/daily/${format(selectedDate, "yyyy-MM-dd")}`;
          break;
        case "month":
          url = `${baseUrl}/readingperday/${deviceId}/monthly/${format(selectedDate, "yyyy-MM-dd")}`;
          break;
        case "year":
          url = `${baseUrl}/readingpermonth/${deviceId}/yearly/${format(selectedDate, "yyyy")}`;
          break;
      }

      const response = await fetch(url);
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeFilter, selectedDate, deviceId]);

  const formatXAxisTick = (value: string) => {
    try {
      switch (timeFilter) {
        case "day":
          return value.split(" ")[0];
        case "month":
          const [day, month] = value.split(" ");
          return `${day} ${month}`;
        case "year":
          return value.split(" ")[0];
        default:
          return value;
      }
    } catch (error) {
      return value;
    }
  };

  return (
    <div className="bg-[#FAFBFF] p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-[32px] p-4 sm:p-6 shadow-[0_0_50px_0_rgba(26,41,85,0.05)]">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8 mb-4">
          {/* Title Section */}
          <div>
            <h1 className="text-[#1A2955] font-roboto text-[2rem] sm:text-[2.5rem] font-bold mb-2 sm:mb-4">
              Water Flow Analytics
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-[#686E80]">
              <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500"></span>
              <p className="font-inter font-medium text-sm sm:text-base">
                Device ID: {deviceId}
              </p>
            </div>
          </div>

          {/* Controls Area */}
          <div className="flex flex-col w-full lg:w-auto gap-4">
            {/* Time Filter */}
            <div className="flex bg-[#F6F8FE] p-2 rounded-xl overflow-x-auto">
              {(["day", "month", "year"] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`
                                    flex-1 lg:flex-none px-4 sm:px-6 py-2 sm:py-3
                                    rounded-lg sm:rounded-xl font-inter font-medium text-sm sm:text-base
                                    whitespace-nowrap transition-all
                                    ${
                                      timeFilter === filter
                                        ? "bg-blue-500 text-white shadow-lg"
                                        : "text-[#686E80] hover:bg-white hover:shadow-md"
                                    }
                                `}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Date Navigation */}
            <div className="bg-[#F6F8FE] p-2 rounded-xl">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => navigateDate("prev")}
                  className="p-3 rounded-lg bg-white text-[#1A2955] shadow-md hover:shadow-lg transition-all"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-inter font-medium text-sm sm:text-base
                                        bg-white text-[#1A2955] shadow-md hover:shadow-lg transition-all
                                        min-w-[150px] sm:min-w-[200px] flex items-center justify-center gap-2 sm:gap-3"
                    >
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      {getDisplayDate()}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white rounded-xl shadow-lg border-0"
                    align="center"
                  >
                    <div className="p-2">
                      {timeFilter === "day" ? (
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date: Date | undefined) =>
                            date && setSelectedDate(date)
                          }
                          initialFocus
                          className="rounded-lg bg-white"
                        />
                      ) : timeFilter === "month" ? (
                        <div className="grid grid-cols-3 gap-2 p-2">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              onClick={() => {
                                const newDate = new Date(selectedDate);
                                newDate.setMonth(index);
                                setSelectedDate(startOfMonth(newDate));
                              }}
                              className={`p-2 rounded-lg font-inter text-xs sm:text-sm
                                                            ${
                                                              selectedDate.getMonth() ===
                                                              index
                                                                ? "bg-blue-500 text-white"
                                                                : "hover:bg-blue-50"
                                                            }`}
                            >
                              {month.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 p-2">
                          {years.map((year) => (
                            <button
                              key={year}
                              onClick={() => {
                                const newDate = new Date(selectedDate);
                                newDate.setFullYear(year);
                                setSelectedDate(startOfYear(newDate));
                              }}
                              className={`p-2 rounded-lg font-inter text-xs sm:text-sm
                                                            ${
                                                              selectedDate.getFullYear() ===
                                                              year
                                                                ? "bg-blue-500 text-white"
                                                                : "hover:bg-blue-50"
                                                            }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <button
                  onClick={() => navigateDate("next")}
                  className="p-3 rounded-lg bg-white text-[#1A2955] shadow-md hover:shadow-lg transition-all"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-[#F6F8FE] rounded-xl sm:rounded-[24px] p-[10px] sm:p-[24px] lg:p-[40px] h-[300px] sm:h-[400px] lg:h-[60vh]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-[10px]">
                <div className="w-[60px] h-[60px] border-[3px] border-slate-100 border-t-blue animate-spin rounded-full"></div>
                <span className="text-[#686E80] font-inter font-medium text-sm">
                  Loading data...
                </span>
              </div>
            </div>
          ) : (
            // Chart Rendering Area
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 10, left: 0, bottom: 40 }}
              >
                <CartesianGrid stroke="#E5E9F5" strokeDasharray="8 8" />
                <XAxis
                  dataKey="time"
                  tickFormatter={formatXAxisTick}
                  tick={{ fill: "#1A2955", fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "#E5E9F5", strokeWidth: 1 }}
                  tickLine={{ stroke: "#E5E9F5", strokeWidth: 1 }}
                  interval={"preserveStartEnd"}
                  angle={45}
                  textAnchor="start"
                  height={50}
                />
                <YAxis
                  domain={calculateYDomain(data)}
                  tick={{ fill: "#1A2955", fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: "#E5E9F5", strokeWidth: 1 }}
                  tickLine={{ stroke: "#E5E9F5", strokeWidth: 1 }}
                  width={40}
                  tickFormatter={(value) => `${value}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(26,41,85,0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    color: "#1A2955",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  labelStyle={{
                    color: "#686E80",
                    marginBottom: "6px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `${Number.parseInt(String(value)).toLocaleString()}L`,
                    "Water Flow",
                  ]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E5FF2" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#2E5FF2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="reading"
                  fillOpacity={1}
                  fill="url(#gradient)"
                />
                <Line
                  type="monotone"
                  dataKey="reading"
                  stroke="#2E5FF2"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
