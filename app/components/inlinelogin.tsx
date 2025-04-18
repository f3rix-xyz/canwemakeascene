import type { FormEvent, JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, RotateCw, LogOut } from "lucide-react";
import { baseUrl } from "@/api";

export function InlineLoginForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("initialPin");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-[700px] mx-auto bg-white rounded-2xl shadow-lg border border-[#E5E9F5]">
      <div className="px-6 py-8 sm:px-8">
        <form
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const deviceId = formData.get("deviceId") as string;
            const initialPin = formData.get("initialPin") as string;
            try {
              const response = await fetch(`${baseUrl}/device/deviceLogin`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ deviceId, initialPin }),
              });
              const result = await response.json();
              if (result.jwt) {
                localStorage.setItem("token", result.jwt);
                localStorage.setItem("deviceId", deviceId);
                localStorage.setItem("initialPin", initialPin);
                toast.success("Login/Refresh successful");
                // Optionally refresh the page or trigger data refetch instead of push('/')
                // router.push('/'); // Keep or remove based on desired behavior after refresh
                window.location.reload(); // Simple way to refresh data on the current page
              } else {
                toast.error(result.error || "Login failed. Please try again.");
              }
            } catch (error) {
              toast.error("An error occurred. Please try again later.");
            } finally {
              setLoading(false);
            }
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-end gap-6"
        >
          <div className="flex-1">
            <label
              htmlFor="deviceId"
              className="font-inter text-base font-medium text-[#1A2955] mb-3 block"
            >
              Device ID
            </label>
            <Input
              id="deviceId"
              name="deviceId"
              placeholder="Enter your device ID"
              required
              // Optionally pre-fill if deviceId is in localStorage
              defaultValue={
                typeof window !== "undefined"
                  ? (localStorage.getItem("deviceId") ?? "")
                  : ""
              }
              className="h-12 border-[#E5E9F5] rounded-xl w-full
                font-inter text-base font-medium
                placeholder:text-[#686E80] focus:border-blue-500
                transition-colors"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="devicePin"
              className="font-inter text-base font-medium text-[#1A2955] mb-3 block"
            >
              Device PIN
            </label>
            <Input
              id="devicePin"
              name="initialPin"
              type="password"
              placeholder="Enter your device PIN"
              required
              // Optionally pre-fill if initialPin is in localStorage
              defaultValue={
                typeof window !== "undefined"
                  ? (localStorage.getItem("initialPin") ?? "")
                  : ""
              }
              className="h-12 border-[#E5E9F5] rounded-xl w-full
                font-inter text-base font-medium
                placeholder:text-[#686E80] focus:border-blue-500
                transition-colors"
            />
          </div>

          {/* --- Button Group --- */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-6 bg-blue-500 hover:bg-blue-600
                text-white font-inter font-medium text-base
                rounded-xl w-full sm:w-auto transition-colors
                disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RotateCw className="h-5 w-5 animate-spin" />
                  <span>Refreshing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  <span>Refresh</span>
                </div>
              )}
            </Button>

            {/* --- Logout Button (Conditionally Rendered) --- */}
            {isLoggedIn && (
              <Button
                type="button" // Important: Prevents form submission
                onClick={handleLogout}
                variant="outline" // Use outline or secondary for distinction
                className="h-12 px-6 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600
                  font-inter font-medium text-base rounded-xl w-full sm:w-auto transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
