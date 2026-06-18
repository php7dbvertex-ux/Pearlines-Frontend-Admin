// src/services/notificationService.js

import api from "../config/api";

// Get All Notifications

export const getAllNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};

// Get Notification By Id

export const getNotificationById = async (notificationId) => {
  const response = await api.get(`/notifications/${notificationId}`);

  return response.data;
};

// Create Notification

export const createNotification = async (notificationData) => {
  const response = await api.post("/notifications", notificationData);

  return response.data;
};

// Delete Notification

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);

  return response.data;
};
