import { Users, CalendarDays } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getAllUsers } from "../../services/userService";

import {
  getAllAppointments,
  getTodayAppointments,
  getRevisitAppointments,
} from "../../services/appointmentService";

// Helper: safely pull an array out of a response no matter how it's shaped
// Handles: response.data, response.data.data, or response already being an array
const extractArray = (response) => {
  if (Array.isArray(response)) return response;

  // New backend users response
  if (Array.isArray(response?.users)) return response.users;

  // Old API responses
  if (Array.isArray(response?.data)) return response.data;

  if (Array.isArray(response?.data?.data))
    return response.data.data;

  return [];
};

const DashboardPage = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);

  const [appointmentCount, setAppointmentCount] = useState(0);

  const [todayCount, setTodayCount] = useState(0);

  const [revisitCount, setRevisitCount] = useState(0);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [usersRes, appointmentsRes, todayRes, revisitRes] =
          await Promise.allSettled([
            getAllUsers(),
            getAllAppointments(),
            getTodayAppointments(),
            getRevisitAppointments(),
          ]);

        if (!isMounted) return;

        // Log any individual failures instead of letting them silently
        // wipe out the whole dashboard like Promise.all would
        if (usersRes.status === "rejected") {
          console.error("getAllUsers failed:", usersRes.reason);
        }
        if (appointmentsRes.status === "rejected") {
          console.error("getAllAppointments failed:", appointmentsRes.reason);
        }
        if (todayRes.status === "rejected") {
          console.error("getTodayAppointments failed:", todayRes.reason);
        }
        if (revisitRes.status === "rejected") {
          console.error("getRevisitAppointments failed:", revisitRes.reason);
        }

        const users =
          usersRes.status === "fulfilled" ? extractArray(usersRes.value) : [];

        const appointments =
          appointmentsRes.status === "fulfilled"
            ? extractArray(appointmentsRes.value)
            : [];

        const todayAppointments =
          todayRes.status === "fulfilled" ? extractArray(todayRes.value) : [];

        const revisitAppointments =
          revisitRes.status === "fulfilled"
            ? extractArray(revisitRes.value)
            : [];

        setUserCount(users.length);

        setAppointmentCount(appointments.length);

        setTodayCount(todayAppointments.length);

        setRevisitCount(revisitAppointments.length);

        setPendingCount(
          appointments.filter((item) => item.status === "Pending").length,
        );
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      count: userCount,
      title: "Users",
      color: "bg-[#0073b7]",
      footerColor: "bg-[#00669f]",
      icon: <Users size={58} />,
      route: "/admin/users",
    },

    {
      count: appointmentCount,
      title: "Appointment",
      color: "bg-[#00a65a]",
      footerColor: "bg-[#009551]",
      icon: <CalendarDays size={58} />,
      route: "/admin/appointments",
    },

    {
      count: todayCount,
      title: "Today Appointment",
      color: "bg-[#f39c12]",
      footerColor: "bg-[#dd8d10]",
      icon: <CalendarDays size={58} />,
      route: "/admin/today-appointments",
    },

    {
      count: pendingCount,
      title: "Pending Appointment",
      color: "bg-[#dd4b39]",
      footerColor: "bg-[#c94535]",
      icon: <CalendarDays size={58} />,
      route: "/admin/appointments",
      // This tells the Appointment page to pre-filter to only
      // "Pending" status appointments when arriving from this card.
      state: { statusFilter: "Pending" },
    },

    {
      count: revisitCount,
      title: "Revisit Appointment",
      color: "bg-[#f39c12]",
      footerColor: "bg-[#dd8d10]",
      icon: <CalendarDays size={58} />,
      route: "/admin/revisit-appointments",
    },
  ];

  return (
    <div>
      {/* Heading */}

      <div className="mb-6">
        <h1
          className="
            text-[28px]
            sm:text-[38px]
            font-light
            text-[#444]
            text-center
            sm:text-left
          "
        >
          Dashboard
        </h1>
      </div>

      {/* Cards */}

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-4
          sm:gap-5
        "
      >
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route, { state: card.state })}
            className="
                rounded-md
                overflow-hidden
                cursor-pointer
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
          >
            {/* Top */}

            <div
              className={`
                  ${card.color}
                  relative
                  h-[100px]
                  sm:h-[105px]
                  px-3
                  sm:px-4
                  py-3
                  text-white
                  overflow-hidden
                `}
            >
              <h2
                className="
                    text-[36px]
                    sm:text-[42px]
                    font-bold
                    leading-none
                  "
              >
                {card.count}
              </h2>

              <p
                className="
                    mt-1
                    sm:mt-2
                    text-[13px]
                    sm:text-[16px]
                    font-medium
                    leading-tight
                  "
              >
                {card.title}
              </p>

              <div
                className="
                    absolute
                    right-2
                    top-4
                    opacity-20
                  "
              >
                <span className="hidden sm:block">{card.icon}</span>

                <span className="block sm:hidden">
                  <CalendarDays size={44} />
                </span>
              </div>
            </div>

            {/* Footer */}

            <div
              className={`
                  ${card.footerColor}
                  py-2
                  text-center
                  text-white
                  text-[12px]
                  sm:text-[14px]
                  font-medium
                  tracking-wide
                `}
            >
              More Info →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;