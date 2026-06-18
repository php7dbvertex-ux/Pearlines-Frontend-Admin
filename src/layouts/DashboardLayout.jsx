import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`
    flex
    h-screen
    bg-[#ecf0f5]
    overflow-hidden
    ${isSidebarOpen ? "fixed inset-0 lg:static" : ""}
  `}
    >
      {/* Mobile Overlay */}

      {isSidebarOpen && (
        <div
          className="
            fixed
      inset-0
      bg-black/50
      z-40
      lg:hidden
      touch-none
          "
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

     

      {/* Sidebar */}
      <div
        className={`
    fixed
    lg:static
    top-[56px]
    lg:top-0
    bottom-0
    left-0
    z-40
    transform
    transition-transform
    duration-300
    ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main
          className="
            flex-1
            overflow-y-auto
            p-3
            sm:p-5
          "
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
