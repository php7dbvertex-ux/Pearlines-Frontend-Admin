// src/services/customNotificationService.js

import api from "../config/api";

// Create Custom Notification

export const createCustomNotification = async (data) => {
  const response = await api.post("/custom-notifications", data);

  return response.data;
};

// Get All Custom Notifications

export const getAllCustomNotifications = async () => {
  const response = await api.get("/custom-notifications");

  return response.data;
};

// Delete Custom Notification

export const deleteCustomNotification = async (id) => {
  const response = await api.delete(`/custom-notifications/${id}`);

  return response.data;
};
