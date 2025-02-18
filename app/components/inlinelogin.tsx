import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, RotateCw } from "lucide-react";

export default function InlineLoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_host;

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
                toast.success("Login successful");
                router.push("/");
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
              className="h-12 border-[#E5E9F5] rounded-xl w-full
                font-inter text-base font-medium
                placeholder:text-[#686E80] focus:border-blue-500
                transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-8 bg-blue-500 hover:bg-blue-600 
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
        </form>
      </div>
    </div>
  );
}
