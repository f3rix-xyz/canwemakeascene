"use client";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Battery, BatteryLow, ActivitySquare, CheckCircle2 } from "lucide-react";

interface StatusChange {
    timestamp: string;
    status: {
        LowBat: boolean;
    };
}

const StatusChanges = () => {
    const [statusChanges, setStatusChanges] = useState<StatusChange[]>([]);
    const deviceId = 'AEX4004';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Device Status</h2>
                    <p className="text-gray-500 text-sm mt-1">System health monitoring</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700">System Online</span>
                </div>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

                <div className="space-y-6">
                    {statusChanges.map((change, index) => {
                        const date = parseISO(change.timestamp);
                        return (
                            <div
                                key={index}
                                className="relative flex gap-6 items-start ml-6"
                            >
                                {/* Timeline dot */}
                                <div className={`
                                    absolute -left-6 w-3 h-3 rounded-full top-6
                                    ${change.status.LowBat ? 'bg-amber-400' : 'bg-emerald-400'}
                                `} />

                                <div className={`
                                    flex-grow p-6 rounded-xl border
                                    ${change.status.LowBat
                                        ? 'bg-amber-50 border-amber-100'
                                        : 'bg-emerald-50 border-emerald-100'
                                    }
                                `}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                p-3 rounded-lg
                                                ${change.status.LowBat ? 'bg-amber-100' : 'bg-emerald-100'}
                                            `}>
                                                {change.status.LowBat ? (
                                                    <BatteryLow className="w-6 h-6 text-amber-600" />
                                                ) : (
                                                    <Battery className="w-6 h-6 text-emerald-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`
                                                    font-medium text-lg
                                                    ${change.status.LowBat ? 'text-amber-700' : 'text-emerald-700'}
                                                `}>
                                                    {change.status.LowBat ? 'Low Battery Warning' : 'Battery Status Normal'}
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

                                        {change.status.LowBat && (
                                            <span className="px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
                                                Action Required
                                            </span>
                                        )}
                                    </div>

                                    {change.status.LowBat && (
                                        <div className="mt-4 p-3 bg-white/50 rounded-lg">
                                            <p className="text-sm text-amber-600">
                                                Battery level critical. Please replace the battery soon to ensure continuous monitoring.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {statusChanges.length === 0 && (
                <div className="text-center py-12">
                    <ActivitySquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No status changes recorded</p>
                </div>
            )}
        </div>
    );
};

export default StatusChanges;