import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import doctorReducer from "../features/doctors/doctorSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    dashboard: dashboardReducer,
  },
});