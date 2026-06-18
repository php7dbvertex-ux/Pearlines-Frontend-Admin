import { Users, CalendarDays } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getAllUsers } from "../../services/userService";

import {
  getAllAppointments,
  getTodayAppointments,
  getRevisitAppointments,
} from "../../services/appointmentService";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);

  const [appointmentCount, setAppointmentCount] = useState(0);

  const [todayCount, setTodayCount] = useState(0);

  const [revisitCount, setRevisitCount] = useState(0);

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersRes, appointmentsRes, todayRes, revisitRes] =
          await Promise.all([
            getAllUsers(),
            getAllAppointments(),
            getTodayAppointments(),
            getRevisitAppointments(),
          ]);

        const users = usersRes.data || [];

        const appointments = appointmentsRes.data || [];

        const todayAppointments = todayRes.data || [];

        const revisitAppointments = revisitRes.data || [];

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
            onClick={() => navigate(card.route)}
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
