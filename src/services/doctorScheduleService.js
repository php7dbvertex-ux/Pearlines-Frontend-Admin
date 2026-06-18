// src/services/doctorScheduleService.js

import api from "../config/api";
// ============================
// Get All Schedules
// ============================

export const getAllSchedules = async () => {
  const response = await api.get("/doctor-schedules");

  return response.data;
};

// ============================
// Get Schedule By Id
// ============================

export const getScheduleById = async (scheduleId) => {
  const response = await api.get(`/doctor-schedules/${scheduleId}`);

  return response.data;
};

// ============================
// Create Schedule
// ============================

export const createSchedule = async (scheduleData) => {
  const response = await api.post("/doctor-schedules", scheduleData);

  return response.data;
};

// ============================
// Update Schedule
// ============================

export const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(
    `/doctor-schedules/${scheduleId}`,
    scheduleData,
  );

  return response.data;
};

// ============================
// Delete Schedule
// ============================

export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/doctor-schedules/${scheduleId}`);

  return response.data;
};
