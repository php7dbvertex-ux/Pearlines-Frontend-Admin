import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/Login/Auth/LoginPage";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "../pages/Dashboard/DashboardPage";

import UserListPage from "../pages/Users/UserListPage";

import AppointmentPage from "../pages/Appointment/AppointmentPage";
import RevisitAppointmentPage from "../pages/Appointment/RevisitAppointmentPage";
import TodayAppointmentPage from "../pages/Appointment/TodayAppointmentPage";

import DoctorSchedulePage from "../pages/Doctors/DoctorSchedulePage";
import DoctorListPage from "../pages/Doctors/DoctorListPage";

import ChatPage from "../pages/Chat/ChatPage";
import AddBannerPage from "../pages/Banner/AddBannerPage";
import EditBannerPage from "../pages/Banner/EditBannerPage";

import BannerListPage from "../pages/Banner/BannerListPage";

import TipsListPage from "../pages/Tips/TipListPage";
import VideoListPage from "../pages/Video/VideoListPage";
import ServiceListPage from "../pages/Service/ServiceListPage";

import GalleryListPage from "../pages/Gallery/GalleryListPage";

import PaymentPage from "../pages/Payment/PaymentPage";

import NotificationListPage from "../pages/Notification/NotificationListPag";
import CustomNotificationListPage from "../pages/Notification/CustomNotificationListPage";

import PrivacyPolicyPage from "../pages/PrivacyPolicy/PrivacyPolicyPage";
import TermsConditionPage from "../pages/TermsCondition/TermsConditionPage";
import AboutUsPage from "../pages/AboutUs/AboutUsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import ChangePasswordPage from "../pages/Profile/ChangePasswordPage";

import AppointmentDetailPage from "../pages/Appointment/AppointmentDetailPage";

import RevisitAppointmentDetailPage from "../pages/Appointment/RevisitAppointmentDetailPage";
import AddDoctorPage from "../pages/Doctors/AddDoctorPage";
import EditDoctorPage from "../pages/Doctors/EditDoctorPage";
import EditDoctorSchedulePage from "../pages/Doctors/EditDoctorSchedulePage";

import AddDoctorSchedulePage from "../pages/Doctors/AddDoctorSchedulePage";
import FAQListPage from "../pages/Faq/FAQListPage";

import AddTipPage from "../pages/Tips/AddTipPage";
import Edittippage from "../pages/Tips/Edittippage";

import AddFAQPage from "../pages/Faq/AddFAQPage";
import EditFAQPage from "../pages/Faq/EditFAQPage";

import AddVideoPage from "../pages/Video/AddVideoPage";
import EditVideoPage from "../pages/Video/EditVideoPage";

import AddServicePage from "../pages/Service/AddServicePage";
import EditServicePage from "../pages/Service/EditServicePage";

import AddGalleryPage from "../pages/Gallery/AddGalleryPage";
import EditGalleryPage from "../pages/Gallery/EditGalleryPage";

import AddNotificationPage from "../pages/Notification/AddNotificationPage";
import AddCustomNotificationPage from "../pages/Notification/AddCustomNotificationPage";

import EditProfilePage from "../pages/Profile/EditProfilePage";

import CustomPaymentPage from "../pages/Payment/CustomPaymentPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<ProfilePage />} />

        <Route path="appointments/:id" element={<AppointmentDetailPage />} />

        <Route
          path="revisit-appointments/:id"
          element={<RevisitAppointmentDetailPage />}
        />

        <Route path="faq/add" element={<AddFAQPage />} />

        <Route path="edit-profile" element={<EditProfilePage />} />

        <Route path="faq/edit/:id" element={<EditFAQPage />} />

        <Route path="service/add" element={<AddServicePage />} />
        <Route path="service/edit/:id" element={<EditServicePage />} />

        <Route path="doctor-list" element={<DoctorListPage />} />

        <Route path="send-notification/add" element={<AddNotificationPage />} />

        <Route
          path="custom-notification/add"
          element={<AddCustomNotificationPage />}
        />
        <Route path="custom-payment" element={<CustomPaymentPage />} />
        <Route path="doctor/add" element={<AddDoctorPage />} />

        <Route path="tip/add" element={<AddTipPage />} />
        <Route path="tip/edit/:id" element={<Edittippage />} />

        <Route path="gallery-image/add" element={<AddGalleryPage />} />

        <Route path="gallery-image/edit/:id" element={<EditGalleryPage />} />

        <Route path="doctor/edit/:id" element={<EditDoctorPage />} />
        <Route path="banner/add" element={<AddBannerPage />} />

        <Route path="banner/edit/:id" element={<EditBannerPage />} />

        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="users" element={<UserListPage />} />

        <Route path="appointments" element={<AppointmentPage />} />

        <Route
          path="revisit-appointments"
          element={<RevisitAppointmentPage />}
        />

        <Route path="today-appointments" element={<TodayAppointmentPage />} />

        <Route path="doctor-schedule" element={<DoctorSchedulePage />} />

        <Route path="doctor-list" element={<DoctorListPage />} />

        <Route path="doctor-schedule/add" element={<AddDoctorSchedulePage />} />

        <Route
          path="doctor-schedule/edit/:id"
          element={<EditDoctorSchedulePage />}
        />

        <Route path="video/add" element={<AddVideoPage />} />

        <Route path="video/edit/:id" element={<EditVideoPage />} />

        <Route path="chat" element={<ChatPage />} />

        <Route path="banner" element={<BannerListPage />} />

        <Route path="tips" element={<TipsListPage />} />

        <Route path="video" element={<VideoListPage />} />

        <Route path="service" element={<ServiceListPage />} />

        <Route path="gallery-image" element={<GalleryListPage />} />

        <Route path="payment" element={<PaymentPage />} />

        <Route path="send-notification" element={<NotificationListPage />} />

        <Route
          path="custom-notification"
          element={<CustomNotificationListPage />}
        />

        <Route path="faq" element={<FAQListPage />} />

        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

        <Route path="terms-condition" element={<TermsConditionPage />} />

        <Route path="about-us" element={<AboutUsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;