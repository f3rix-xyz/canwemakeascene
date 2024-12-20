"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed this line
import MainLayout from "./components/MainLayout";
import LogoutButton from "./components/LogoutButton";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <LogoutButton />
      <div className="pt-16 lg:pt-8">
        <MainLayout />
      </div>
    </main>
  );
}