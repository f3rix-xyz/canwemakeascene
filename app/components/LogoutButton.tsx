// components/LogoutButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Desktop/Tablet Button */}
      <button
        onClick={handleLogout}
        className="hidden lg:flex items-center gap-3 px-6 py-3 
                    bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl 
                    transition-all duration-300 fixed top-6 right-6 xl:top-8 xl:right-8
                    text-gray-700 hover:text-gray-900 text-lg z-50"
      >
        <LogOut className="w-6 h-6" />
        <span className="font-medium">Logout</span>
      </button>

      {/* Mobile/Tablet Menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="fixed top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm 
                        rounded-lg shadow-md hover:shadow-lg transition-all"
          style={{ position: "fixed" }} // Ensure fixed positioning
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div
            className="fixed top-16 right-4 bg-white rounded-xl shadow-lg py-2 z-50"
            onClick={() => setShowMobileMenu(false)} // Close menu on click
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3
                                text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LogoutButton;
