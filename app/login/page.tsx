"use client";
import { FormEvent, JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";

export default function LoginPage(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_host;

    useEffect(() => {
        if (localStorage.getItem("token")) router.push("/");
    }, [router]);

    return (
        <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="flex w-full items-center">
                {/* Left side - Hero Section */}
                <div className="hidden lg:flex w-3/5 h-screen bg-blue-600 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />

                    <div className="relative z-10 flex flex-col items-center text-white p-12 max-w-2xl">
                        <div className="w-64 h-16 relative mb-12">
                            <Image
                                src="/logo.svg"
                                alt="Company Logo"
                                fill
                                className="object-contain brightness-0 invert"
                                priority
                            />
                        </div>

                        <div className="w-full h-[500px] relative mb-8">
                            <Image
                                src="/illustration.svg"
                                alt="Login Illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <h1 className="text-4xl font-bold text-center mb-4">
                            Welcome to Your Device Portal
                        </h1>
                        <p className="text-lg text-blue-100 text-center max-w-md">
                            Monitor and manage your devices securely from anywhere in the world
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-800 to-transparent opacity-30" />
                </div>

                {/* Right side - Login Form */}
                <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
                    <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-8">
                            <div className="w-40 h-10 relative mb-8 lg:hidden">
                                <Image
                                    src="/logo.svg"
                                    alt="Company Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <CardTitle className="text-3xl font-bold text-gray-900">
                                Device Login
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-base">
                                Securely access your device management portal
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form
                                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                                    event.preventDefault();
                                    setLoading(true);
                                    const formData = new FormData(event.currentTarget);
                                    const deviceId = formData.get("deviceId") as string;
                                    const initialPin = formData.get("initialPin") as string;
                                    try {
                                        const response = await fetch(
                                            `${baseUrl}/device/deviceLogin`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ deviceId, initialPin }),
                                            }
                                        );
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
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="deviceId" className="text-gray-700 text-sm font-medium">
                                        Device ID
                                    </Label>
                                    <Input
                                        id="deviceId"
                                        name="deviceId"
                                        placeholder="Enter your device ID"
                                        required
                                        className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="initialPin" className="text-gray-700 text-sm font-medium">
                                        Device PIN
                                    </Label>
                                    <Input
                                        id="initialPin"
                                        name="initialPin"
                                        type="password"
                                        placeholder="Enter your device PIN"
                                        required
                                        className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <Button
                                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                                    )}
                                    {loading ? "Logging in..." : "Log in"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}