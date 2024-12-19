"use client";
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
    AlertCircle,
    ArrowUpRight,
    Droplets,
    Snowflake,
    RotateCcw,
    Bell
} from 'lucide-react';

interface Alert {
    alert: string;
    timestamp: string;
}

const getAlertConfig = (alertType: string) => {
    switch (alertType) {
        case 'ContiFlow':
            return {
                icon: Droplets,
                bg: 'bg-indigo-50',
                border: 'border-indigo-100',
                text: 'text-indigo-700',
                iconColor: 'text-indigo-500',
                message: 'Continuous flow detected'
            };
        case 'ReverseFlow':
            return {
                icon: RotateCcw,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                text: 'text-emerald-700',
                iconColor: 'text-emerald-500',
                message: 'Negative flow detected'
            };
        case 'BurstPipe':
            return {
                icon: ArrowUpRight,
                bg: 'bg-rose-50',
                border: 'border-rose-100',
                text: 'text-rose-700',
                iconColor: 'text-rose-500',
                message: 'Sudden pressure drop detected'
            };
        case 'EmptyPipe':
            return {
                icon: AlertCircle,
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                text: 'text-amber-700',
                iconColor: 'text-amber-500',
                message: 'No water flow detected'
            };
        case 'Freeze':
            return {
                icon: Snowflake,
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                text: 'text-blue-700',
                iconColor: 'text-blue-500',
                message: 'Temperature below freezing point'
            };
        default:
            return {
                icon: AlertCircle,
                bg: 'bg-gray-50',
                border: 'border-gray-100',
                text: 'text-gray-700',
                iconColor: 'text-gray-500',
                message: 'System alert'
            };
    }
};

const AlertBox = ({ alert, timestamp }: Alert) => {
    const config = getAlertConfig(alert);
    const Icon = config.icon;

    return (
        <div className={`
            group flex items-center justify-between p-4 rounded-xl border
            transition-all duration-200 hover:shadow-md
            ${config.bg} ${config.border}
        `}>
            <div className="flex items-center gap-4">
                <div className={`
                    p-2 rounded-lg ${config.bg} 
                    group-hover:scale-110 transition-transform
                `}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div>
                    <p className={`font-medium ${config.text}`}>{alert}</p>
                    <p className="text-sm text-gray-500">{config.message}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-medium ${config.text}`}>
                    {format(parseISO(timestamp), 'HH:mm')}
                </p>
                <p className="text-sm text-gray-500">
                    {format(parseISO(timestamp), 'dd/MM/yyyy')}
                </p>
            </div>
        </div>
    );
};

const Alerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const deviceId = typeof window !== 'undefined'
        ? localStorage.getItem('deviceId')
        : null;
    const baseUrl = process.env.NEXT_PUBLIC_host;

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch(`${baseUrl}/newWaterReading/${deviceId}/alerts`);
                const data = await response.json();
                setAlerts(data);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };

        fetchAlerts();

        // Refresh alerts every minute
        const interval = setInterval(fetchAlerts, 60000);
        return () => clearInterval(interval);
    }, [deviceId, baseUrl]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Alerts</h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time notifications</p>
                </div>
                <div className="relative">
                    <Bell className="w-6 h-6 text-gray-400" />
                    {alerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {alerts.length}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {alerts.map((alert, index) => (
                    <AlertBox key={index} {...alert} />
                ))}

                {alerts.length === 0 && (
                    <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No active alerts</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alerts;