"use client";
import Alerts from "./Alerts";
import LeakageChart from "./LeakageChart";
import MaxWaterFlow from "./MaxWaterFlow";
import NoConsumption from "./NoConsumption";
import StatusChanges from "./StatusChanges";
import WaterFlowChart from "./WaterFlowChart";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-50">
            {/* Main Content */}
            <div className="container mx-auto p-4 md:p-6 lg:p-8 xl:p-10 max-w-[2000px]">
                {/* Water Flow Chart Section */}
                <div className="mb-8">
                    <WaterFlowChart />
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                    {/* Left Section */}
                    <div className="md:col-span-2 lg:col-span-8 space-y-6">
                        {/* Leakage Chart */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100">
                            <LeakageChart />
                        </div>

                        {/* Max Flow & No Consumption Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100">
                                <MaxWaterFlow />
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100">
                                <NoConsumption />
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Alerts */}
                    <div className="md:col-span-2 lg:col-span-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100 sticky top-6">
                            <Alerts />
                        </div>
                    </div>

                    {/* Bottom Section - Status */}
                    <div className="col-span-full">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100">
                            <StatusChanges />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;