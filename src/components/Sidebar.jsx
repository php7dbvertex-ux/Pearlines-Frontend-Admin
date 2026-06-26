import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  MessageCircle,
  Image,
  CreditCard,
  Bell,
  CircleHelp,
  Lock,
  Scale,
  Info,
} from "lucide-react";

import logo from "../assets/logo.png";

import { getAllChats } from "../services/chatService";

const Sidebar = ({
  onClose,
}) => {
  const [unreadChatCount, setUnreadChatCount] =
    useState(0);

  // -----------------------------
  // Poll unread chat count
  // -----------------------------

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await getAllChats();

        const chats = response.data || [];

        const total = chats.reduce(
          (sum, chat) => sum + (chat.unreadCount || 0),
          0
        );

        setUnreadChatCount(total);
      } catch (error) {
        console.error(error);
      }
    };

    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className="
        w-[230px]
    bg-[#1f2d3d]
    text-white
    h-full
    flex
    flex-col
    overflow-hidden
      "
    >
      {/* Logo */}

      <div
        className="
          hidden
    lg:flex
    h-[56px]
    bg-white
    items-center
    justify-center
    overflow-hidden
    shrink-0
        "
      >
        <img
          src={logo}
          alt="logo"
          className="
            w-[210px]
            h-auto
            object-contain
          "
        />
      </div>

      {/* Navigation */}

      <ul
        className="
          flex-1
          overflow-y-auto
          pb-4
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        <SidebarLink
          to="/admin/dashboard"
          icon={
            <LayoutDashboard size={18} />
          }
          text="Dashboard"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/users"
          icon={<Users size={18} />}
          text="User List"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/appointments"
          icon={
            <Calendar size={18} />
          }
          text="Appointment"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/revisit-appointments"
          icon={
            <Calendar size={18} />
          }
          text="Revisit Appointment"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/today-appointments"
          icon={
            <Calendar size={18} />
          }
          text="Today Appointment"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/doctor-schedule"
          icon={
            <Stethoscope size={18} />
          }
          text="Doctor Schedule"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/doctor-list"
          icon={<Users size={18} />}
          text="Doctor List"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/chat"
          icon={
            <MessageCircle size={18} />
          }
          text="Chat"
          badge={unreadChatCount}
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/banner"
          icon={<Image size={18} />}
          text="Banner"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/tips"
          icon={<Image size={18} />}
          text="Tips"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/video"
          icon={<Image size={18} />}
          text="Video"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/service"
          icon={<Image size={18} />}
          text="Service"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/gallery-image"
          icon={<Image size={18} />}
          text="Gallery Image"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/payment"
          icon={
            <CreditCard size={18} />
          }
          text="Payment"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/send-notification"
          icon={<Bell size={18} />}
          text="Send Notification"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/custom-notification"
          icon={<Bell size={18} />}
          text="Custom Notification"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/faq"
          icon={
            <CircleHelp size={18} />
          }
          text="Faqs"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/privacy-policy"
          icon={<Lock size={18} />}
          text="Privacy Policy"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/terms-condition"
          icon={<Scale size={18} />}
          text="Terms & Condition"
          onClose={onClose}
        />

        <SidebarLink
          to="/admin/about-us"
          icon={<Info size={18} />}
          text="About Us"
          onClose={onClose}
        />
      </ul>
    </aside>
  );
};

const SidebarLink = ({
  to,
  icon,
  text,
  badge,
  onClose,
}) => {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          `
          flex
          items-center
          gap-3
          px-4
          py-3
          text-[15px]
          transition
          ${
            isActive
              ? "bg-[#3c8dbc]"
              : "hover:bg-[#243545]"
          }
        `
        }
      >
        {icon}
        <span className="flex-1">{text}</span>

        {badge > 0 && (
          <span
            className="
              bg-red-500
              text-white
              text-[11px]
              font-semibold
              rounded-full
              min-w-[20px]
              h-[20px]
              px-1.5
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar;