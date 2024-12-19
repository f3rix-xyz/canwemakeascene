"use client";
import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area
} from 'recharts';
import { format, startOfMonth, startOfYear } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TimeFilter = 'day' | 'month' | 'year';

interface ReadingData {
    time: string;
    reading: string;
}

const WaterFlowChart = () => {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
    const [data, setData] = useState<ReadingData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const deviceId = typeof window !== 'undefined'
        ? localStorage.getItem('deviceId')
        : null;



    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    const calculateYDomain = (data: ReadingData[]) => {
        if (!data.length) return [0, 100];
        const maxReading = Math.max(...data.map(item => parseFloat(item.reading)));
        const buffer = maxReading * 0.2;
        return [0, maxReading + buffer];
    };

    const fetchData = async () => {
        if (!deviceId) return;

        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_host;
            let url = '';

            switch (timeFilter) {
                case 'day':
                    url = `${baseUrl}/readingperhour/${deviceId}/daily/${format(selectedDate, 'yyyy-MM-dd')}`;
                    break;
                case 'month':
                    url = `${baseUrl}/readingperday/${deviceId}/monthly/${format(selectedDate, 'yyyy-MM-dd')}`;
                    break;
                case 'year':
                    url = `${baseUrl}/readingpermonth/${deviceId}/yearly/${format(selectedDate, 'yyyy')}`;
                    break;
            }

            const response = await fetch(url);
            const newData = await response.json();
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                case 'day':
                    return value.split(' ')[0];
                case 'month':
                    const [day, month] = value.split(' ');
                    return `${day} ${month}`;
                case 'year':
                    return value.split(' ')[0];
                default:
                    return value;
            }
        } catch (error) {
            return value;
        }
    };

    return (
        <div className="bg-[#FAFBFF] p-4 sm:p-6">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-[32px] p-4 sm:p-6 
        shadow-[0_0_50px_0_rgba(26,41,85,0.05)]"
            >
                {/* Header Area */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8 mb-4">
                    {/* Title Section */}
                    <div>
                        <h1 className="text-[#1A2955] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-2 sm:mb-4">
                            Water Flow Analytics
                        </h1>
                        <div className="flex items-center gap-2 sm:gap-3 text-[#686E80]">
                            <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500"></span>
                            <p className="text-lg sm:text-xl lg:text-2xl">Device ID: {deviceId}</p>
                        </div>
                    </div>

                    {/* Controls Area */}
                    <div className="flex flex-col w-full lg:w-auto gap-4">
                        {/* Time Filter */}
                        <div className="flex bg-[#F6F8FE] p-2 rounded-xl overflow-x-auto">
                            {(['day', 'month', 'year'] as TimeFilter[]).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`
                                        flex-1 lg:flex-none px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4
                                        rounded-lg sm:rounded-xl text-base sm:text-lg whitespace-nowrap
                                        font-medium transition-all
                                        ${timeFilter === filter
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'text-[#686E80] hover:bg-white hover:shadow-md'
                                        }
                                    `}
                                >
                                    {filter.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Date Controls */}
                        <div className="bg-[#F6F8FE] p-2 rounded-xl">
                            {timeFilter === 'day' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4
                                            rounded-lg text-base sm:text-lg
                                            bg-white text-[#1A2955] shadow-md hover:shadow-lg
                                            transition-all flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-3">
                                                <CalendarIcon className="w-5 h-5 text-blue-500" />
                                                {format(selectedDate, 'dd MMM yyyy')}
                                            </span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 bg-white rounded-xl shadow-lg border-0"
                                        align="start"
                                    >
                                        <div className="p-2">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                                                initialFocus
                                                className="rounded-lg bg-white"
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : timeFilter === 'month' ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Select
                                        value={format(selectedDate, 'MM')}
                                        onValueChange={(value) => {
                                            const newDate = new Date(selectedDate);
                                            newDate.setMonth(parseInt(value) - 1);
                                            setSelectedDate(startOfMonth(newDate));
                                        }}
                                    >
                                        <SelectTrigger className="px-4 sm:px-6 py-3 sm:py-4 
                                            rounded-lg text-base sm:text-lg
                                            bg-white text-[#1A2955] shadow-md hover:shadow-lg
                                            border-0 min-w-[120px] sm:min-w-[200px]"
                                        >
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white rounded-xl border-0 shadow-lg min-w-[200px]"
                                            position="popper"
                                        >
                                            {months.map((month, index) => (
                                                <SelectItem
                                                    key={month}
                                                    value={(index + 1).toString().padStart(2, '0')}
                                                    className="text-lg py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                >
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={format(selectedDate, 'yyyy')}
                                        onValueChange={(value) => {
                                            const newDate = new Date(selectedDate);
                                            newDate.setFullYear(parseInt(value));
                                            setSelectedDate(startOfMonth(newDate));
                                        }}
                                    >
                                        <SelectTrigger className="px-4 sm:px-6 py-3 sm:py-4
                                            rounded-lg text-base sm:text-lg
                                            bg-white text-[#1A2955] shadow-md hover:shadow-lg
                                            border-0 min-w-[120px] sm:min-w-[160px]"
                                        >
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white rounded-xl border-0 shadow-lg min-w-[160px]"
                                            position="popper"
                                        >
                                            {years.map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year.toString()}
                                                    className="text-lg py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <Select
                                    value={format(selectedDate, 'yyyy')}
                                    onValueChange={(value) => {
                                        const newDate = new Date(selectedDate);
                                        newDate.setFullYear(parseInt(value));
                                        setSelectedDate(startOfYear(newDate));
                                    }}
                                >
                                    <SelectTrigger className="w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4
                                        rounded-lg text-base sm:text-lg
                                        bg-white text-[#1A2955] shadow-md hover:shadow-lg
                                        border-0 min-w-[120px] sm:min-w-[200px]"
                                    >
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white rounded-xl border-0 shadow-lg min-w-[160px]"
                                        position="popper"
                                    >
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                                className="text-lg py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="bg-[#F6F8FE] rounded-xl sm:rounded-2xl p-2 sm:p-6 lg:p-10 h-[350px] sm:h-[450px] lg:h-[60vh]">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 
                                    border-4 border-slate-100 border-t-blue-500 
                                    rounded-full animate-spin"
                                />
                                <div className="text-[#686E80] text-lg sm:text-xl lg:text-2xl">
                                    Loading data...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 10,
                                    left: 0,
                                    bottom: 40
                                }}
                            >
                                <CartesianGrid stroke="#E5E9F5" strokeDasharray="8 8" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={formatXAxisTick}
                                    tick={{
                                        fill: '#1A2955',
                                        fontSize: 10,
                                        fontWeight: 500
                                    }}
                                    axisLine={{ stroke: '#E5E9F5', strokeWidth: 1 }}
                                    tickLine={{ stroke: '#E5E9F5', strokeWidth: 1 }}
                                    interval={'preserveStartEnd'}
                                    angle={45}
                                    textAnchor="start"
                                    height={50}
                                    padding={{ left: 10, right: 10 }}
                                    minTickGap={5}
                                    scale="band"
                                />
                                <YAxis
                                    domain={calculateYDomain(data)}
                                    tick={{
                                        fill: '#1A2955',
                                        fontSize: 10,
                                        fontWeight: 500
                                    }}
                                    axisLine={{ stroke: '#E5E9F5', strokeWidth: 1 }}
                                    tickLine={{ stroke: '#E5E9F5', strokeWidth: 1 }}
                                    width={40}
                                    tickFormatter={(value) => `${value}L`}
                                    padding={{ top: 20, bottom: 20 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(26,41,85,0.1)',
                                        padding: '12px',
                                    }}
                                    itemStyle={{
                                        color: '#1A2955',
                                        fontSize: '12px',
                                        fontWeight: 500
                                    }}
                                    labelStyle={{
                                        color: '#686E80',
                                        marginBottom: '6px',
                                        fontSize: '10px'
                                    }}
                                    formatter={(value: string) => [
                                        `${parseInt(value).toLocaleString()}L`,
                                        'Water Flow'
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
                                    stroke="none"
                                    fill="url(#gradient)"
                                    fillOpacity={1}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="reading"
                                    stroke="#2E5FF2"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 6,
                                        fill: '#2E5FF2',
                                        stroke: 'white',
                                        strokeWidth: 2
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WaterFlowChart;