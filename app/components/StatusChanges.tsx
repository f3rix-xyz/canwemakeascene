"use client";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Battery, BatteryLow, ActivitySquare, CheckCircle2 } from "lucide-react";
import { Waves, Wind, Thermometer, Activity, } from 'lucide-react';

interface StatusChange {
    timestamp: string;
    status: {
        Motion?: boolean;
        LowBat?: boolean;
        BadTemp?: boolean;
        AirBubbles?: boolean;
    };
}

const getStatusConfig = (status: StatusChange['status']) => {
    if (status.Motion) {
        return {
            icon: Activity,
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            text: 'text-purple-700',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            title: 'Motion Detected',
            message: 'Unusual movement detected in the device',
            actionRequired: true
        };
    }
    if (status.LowBat) {
        return {
            icon: BatteryLow,
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            text: 'text-amber-700',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            title: 'Low Battery Warning',
            message: 'Battery level critical. Please replace the battery soon to ensure continuous monitoring.',
            actionRequired: true
        };
    }
    if (status.BadTemp) {
        return {
            icon: Thermometer,
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            text: 'text-rose-700',
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600',
            title: 'Temperature Warning',
            message: 'Device temperature outside optimal range',
            actionRequired: true
        };
    }
    if (status.AirBubbles) {
        return {
            icon: Waves,
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-700',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: 'Air Bubbles Detected',
            message: 'Air bubbles detected in water flow',
            actionRequired: true
        };
    }
    return {
        icon: CheckCircle2,
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        title: 'System Normal',
        message: 'All systems functioning normally',
        actionRequired: false
    };
};


const StatusChanges = () => {
    const [statusChanges, setStatusChanges] = useState<StatusChange[]>([]);
    const deviceId = typeof window !== 'undefined'
        ? localStorage.getItem('deviceId')
        : null;
    const baseUrl = process.env.NEXT_PUBLIC_host;

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(`${baseUrl}/newWaterReading/${deviceId}/status-changes`);
                const data = await response.json();
                setStatusChanges(data);
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };
        fetchStatus();
    }, [deviceId, baseUrl]);


return (
    <div className="w-full space-y-6 px-4 sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pb-4 gap-4">
            <div>
                <h2 className="font-roboto text-xl sm:text-2xl font-semibold text-[#1A2955] mb-2">
                    Device Status
                </h2>
                <p className="font-inter text-sm sm:text-base font-medium text-[#686E80]">
                    System health monitoring
                </p>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 rounded-xl whitespace-nowrap">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-inter text-sm sm:text-base font-medium text-emerald-700">
                    System Online
                </span>
            </div>
        </div>

        {/* Timeline Section */}
        <div className="relative w-full">
            {/* Vertical Line */}
            <div className="absolute left-[18px] sm:left-6 top-0 bottom-0 w-px bg-[#E5E9F5]" />

            <div className="space-y-6">
                {statusChanges.map((change, index) => {
                    const date = parseISO(change.timestamp);
                    const config = getStatusConfig(change.status);

                    return (
                        <div
                            key={index}
                            className="relative flex items-start pl-[52px] sm:pl-[72px]"
                        >
                            {/* Timeline dot */}
                            <div
                                className={`
                                    absolute left-[14px] sm:left-[22px] w-3 h-3 rounded-full 
                                    top-[28px] 
                                    ${config.iconColor}
                                `}
                            />

                            {/* Content Card */}
                            <div className="w-full">
                                <div
                                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border ${config.bg} ${config.border}`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${config.iconBg}`}
                                            >
                                                <config.icon
                                                    className={`w-5 h-5 sm:w-6 sm:h-6 ${config.iconColor}`}
                                                />
                                            </div>
                                            <div>
                                                <h3
                                                    className={`font-roboto text-lg sm:text-xl font-semibold ${config.text}`}
                                                >
                                                    {config.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-[6px]">
                                                    <p className="font-inter text-sm sm:text-base font-medium text-[#686E80]">
                                                        {format(date, 'HH:mm')}
                                                    </p>
                                                    <p className="font-inter text-sm sm:text-base font-medium text-[#686E80]">
                                                        {format(date, 'dd MMM yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {config.actionRequired && (
                                            <span
                                                className={`
                                                    px-[10px] py-[6px] sm:px-[16px] sm:py-[8px]
                                                    font-inter text-sm sm:text-base font-medium
                                                    ${config.iconBg} ${config.text} rounded-lg sm:rounded-xl
                                                `}
                                            >
                                                Action Required
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* No Status Changes */}
        {statusChanges.length === 0 && (
            <div className="text-center py-8">
                <ActivitySquare className="w-10 h-10 sm:w-12 sm:h-12 text-[#E5E9F5] mx-auto mb-3" />
                <p className="font-inter text-sm sm:text-base font-medium text-[#686E80]">
                    No status changes recorded
                </p>
            </div>
        )}
    </div>
);
};

export default StatusChanges;
