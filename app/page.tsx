// FILE: app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      {/* Removed pt-8 from here, will add padding/margin within the container */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-slate-50">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 xl:p-10 max-w-[2000px]">
          {/* Header Section */}
          {/* Changed items-center to items-start, adjusted padding/margin */}
          <header className="flex justify-between items-start mb-8 pt-6">
            {" "}
            {/* Align tops, Added pt-6 */}
            {/* Logo - Increased Size */}
            {/* Adjusted h/w values - Increase further if needed */}
            <div className="relative h-16 w-64">
              {" "}
              {/* Increased size (e.g., h-16 w-64) */}
              <Image
                src="/logo.svg"
                alt="Sustainico Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Inline Login Form */}
            <div className="pt-1">
              {" "}
              {/* Add small padding top to visually align form content */}
              <InlineLoginForm />
            </div>
          </header>

          {/* Main Content */}
          {/* Removed mb-8 from WaterFlowChart's wrapper, header provides spacing */}
          <div>
            <WaterFlowChart />
          </div>

          {/* Dashboard Grid - Added some top margin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mt-8">
            {" "}
            {/* Added mt-8 */}
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
    </main>
  );
}
