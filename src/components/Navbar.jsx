import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  UserCircle2,
  ChevronDown,
  User,
  Lock,
  LogOut,
} from "lucide-react";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const [apiStatus, setApiStatus] = useState(true);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  return (
    <header

  className="
    h-[56px]
    bg-[#3c8dbc]
    sticky
    top-0
    z-[50]
    flex
    items-center
    justify-between
    px-4
    shrink-0
    shadow-sm
  "
>
      {/* Left Side */}

      <button
        className="
          text-white
          p-1
          -ml-1
        "
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Right Side */}

      <div className="flex items-center gap-3 sm:gap-6">
        {/* API Toggle */}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setApiStatus(!apiStatus)}
            className={`
              relative
              w-11
              sm:w-12
              h-6
              rounded-full
              transition-all
              duration-300
              ${apiStatus ? "bg-green-500" : "bg-red-500"}
            `}
          >
            <span
              className={`
                absolute
                top-[2px]
                h-5
                w-5
                rounded-full
                bg-white
                transition-all
                duration-300
                ${apiStatus ? "left-[24px] sm:left-[26px]" : "left-[2px]"}
              `}
            />
          </button>

          <span className="hidden sm:inline text-white text-sm font-medium">
            API: {apiStatus ? "ON" : "OFF"}
          </span>
        </div>

        {/* Profile */}

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="
              flex
              items-center
              gap-1
              sm:gap-2
              text-white
              px-2
              py-1
              rounded
              hover:bg-white/10
              transition
            "
          >
            <UserCircle2 size={28} />

            <span className="hidden sm:inline text-sm font-medium">Admin</span>

            <ChevronDown size={16} />
          </button>

          {isProfileOpen && (
            <>
              {/* Overlay */}

              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />

              {/* Dropdown */}

              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-[220px]
                  bg-white
                  rounded-md
                  shadow-xl
                  overflow-hidden
                  z-50
                "
              >
                <button
                  onClick={() => {
                    navigate("/admin/profile");

                    setIsProfileOpen(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-gray-700
                    hover:bg-gray-100
                    transition
                    text-sm
                  "
                >
                  <User size={16} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/change-password");

                    setIsProfileOpen(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-gray-700
                    hover:bg-gray-100
                    transition
                    text-sm
                  "
                >
                  <Lock size={16} />
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-red-500
                    hover:bg-red-50
                    transition
                    text-sm
                  "
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
