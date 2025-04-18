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
    <div className="w-auto bg-white rounded-2xl shadow-lg border border-[#E5E9F5]">
      {/* Reduced padding slightly for a more compact look in the header */}
      <div className="px-4 py-4 sm:px-6 sm:py-6">
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
                window.location.reload();
              } else {
                toast.error(result.error || "Login failed. Please try again.");
              }
            } catch (error) {
              toast.error("An error occurred. Please try again later.");
            } finally {
              setLoading(false);
            }
          }}
          className="flex flex-col md:flex-row items-stretch md:items-end gap-3 md:gap-4"
        >
          {/* Adjusted input containers */}
          <div className="flex-grow md:flex-grow-0 md:w-48">
            {" "}
            {/* Example: Fixed width on medium screens */}
            <label
              htmlFor="deviceId"
              className="font-inter text-sm font-medium text-[#1A2955] mb-2 block" // Reduced font size/margin
            >
              Device ID
            </label>
            <Input
              id="deviceId"
              name="deviceId"
              placeholder="Device ID" // Shorter placeholder
              required
              defaultValue={
                typeof window !== "undefined"
                  ? (localStorage.getItem("deviceId") ?? "")
                  : ""
              }
              // Adjusted input style for potentially smaller size
              className="h-10 border-[#E5E9F5] rounded-lg w-full
                font-inter text-sm font-medium
                placeholder:text-[#686E80] focus:border-blue-500
                transition-colors"
            />
          </div>

          <div className="flex-grow md:flex-grow-0 md:w-48">
            {" "}
            {/* Example: Fixed width on medium screens */}
            <label
              htmlFor="devicePin"
              className="font-inter text-sm font-medium text-[#1A2955] mb-2 block" // Reduced font size/margin
            >
              Device PIN
            </label>
            <Input
              id="devicePin"
              name="initialPin"
              type="password"
              placeholder="PIN" // Shorter placeholder
              required
              defaultValue={
                typeof window !== "undefined"
                  ? (localStorage.getItem("initialPin") ?? "")
                  : ""
              }
              // Adjusted input style for potentially smaller size
              className="h-10 border-[#E5E9F5] rounded-lg w-full
                font-inter text-sm font-medium
                placeholder:text-[#686E80] focus:border-blue-500
                transition-colors"
            />
          </div>

          {/* --- Button Group --- */}
          {/* Adjusted button group layout */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end mt-2 md:mt-0">
            <Button
              type="submit"
              disabled={loading}
              // Adjusted button style for potentially smaller size
              className="h-10 px-4 bg-blue-500 hover:bg-blue-600
                text-white font-inter font-medium text-sm
                rounded-lg w-full sm:w-auto transition-colors
                disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-1">
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Refreshing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </div>
              )}
            </Button>

            {isLoggedIn && (
              <Button
                type="button"
                onClick={handleLogout}
                variant="outline"
                // Adjusted button style for potentially smaller size
                className="h-10 px-4 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600
                  font-inter font-medium text-sm rounded-lg w-full sm:w-auto transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <LogOut className="h-4 w-4" />
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
