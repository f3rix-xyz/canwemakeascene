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
        <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-6">
            {/* Header Row */}
            <div className="flex items-center justify-between w-full pb-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Device Status</h2>
                    <p className="text-xs sm:text-sm text-gray-500">System health monitoring</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-emerald-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    <span className="text-xs sm:text-sm font-medium text-emerald-700">System Online</span>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="relative w-full">
                <div className="absolute left-0 sm:left-6 top-0 bottom-0 w-px bg-gray-200" />

                <div className="space-y-2 sm:space-y-6">
                    {statusChanges.map((change, index) => {
                        const date = parseISO(change.timestamp);
                        const config = getStatusConfig(change.status);

                        return (
                            <div
                                key={index}
                                className="relative flex items-center sm:items-start pl-4 sm:pl-12"
                            >
                                {/* Timeline dot */}
                                <div className={`
                                    absolute -left-1 sm:left-5 w-2 sm:w-3 h-2 sm:h-3 rounded-full 
                                    top-1/2 sm:top-6 -translate-y-1/2 sm:translate-y-0
                                    ${config.iconColor}
                                `} />

                                {/* Mobile View */}
                                <div className="sm:hidden w-full flex items-center justify-between py-2 px-3 rounded-lg border gap-3
                                    ${config.bg} ${config.border}">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`flex-shrink-0 p-1.5 rounded-md ${config.iconBg}`}>
                                            <config.icon className={`w-4 h-4 ${config.iconColor}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`font-medium text-sm ${config.text} truncate`}>
                                                {config.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-500">
                                                    {format(date, 'HH:mm')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(date, 'dd MMM yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden sm:block w-full">
                                    <div className={`p-6 rounded-xl border ${config.bg} ${config.border}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${config.iconBg}`}>
                                                    <config.icon className={`w-6 h-6 ${config.iconColor}`} />
                                                </div>
                                                <div>
                                                    <h3 className={`font-medium text-lg ${config.text}`}>
                                                        {config.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            {format(date, 'HH:mm')}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {format(date, 'dd MMM yyyy')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {config.actionRequired && (
                                                <span className={`
                                                    px-3 py-1 text-sm font-medium
                                                    ${config.iconBg} ${config.text} rounded-full
                                                `}>
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

            {statusChanges.length === 0 && (
                <div className="text-center py-4 sm:py-8">
                    <ActivitySquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">No status changes recorded</p>
                </div>
            )}
        </div>
    );

};

export default StatusChanges;