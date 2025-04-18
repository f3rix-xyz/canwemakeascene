"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed this line
import { InlineLoginForm } from "./components/inlinelogin";
import { WaterFlowChart } from "./components/WaterFlowChart";
import { LeakageChart } from "./components/LeakageChart";
import { MaxWaterFlow } from "./components/MaxWaterFlow";
import { NoConsumption } from "./components/NoConsumption";
import { Alerts } from "./components/Alerts";
import { StatusChanges } from "./components/StatusChanges";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-16 lg:pt-8">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-50">
          {/* Main Content */}
          <div className="container mx-auto p-4 md:p-6 lg:p-8 xl:p-10 max-w-[2000px]">
            {/* Water Flow Chart Section */}
            <div className="mb-14 w-full">
              {" "}
              {/* Reduced mb-8 to mb-6 and made it w-full */}
              <InlineLoginForm />
            </div>

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
      </div>
    </main>
  );
}
