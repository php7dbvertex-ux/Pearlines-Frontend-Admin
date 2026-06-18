// src/services/serviceService.js

import api from "../config/api";

// ============================
// Get All Services
// ============================

export const getAllServices =
  async () => {
    const response =
      await api.get("/services");

    return response.data;
  };

// ============================
// Get Service By Id
// ============================

export const getServiceById =
  async (serviceId) => {
    const response =
      await api.get(
        `/services/${serviceId}`
      );

    return response.data;
  };

// ============================
// Create Service
// ============================

export const createService =
  async (serviceData) => {
    const response =
      await api.post(
        "/services",
        serviceData
      );

    return response.data;
  };

// ============================
// Update Service
// ============================

export const updateService =
  async (
    serviceId,
    serviceData
  ) => {
    const response =
      await api.put(
        `/services/${serviceId}`,
        serviceData
      );

    return response.data;
  };

// ============================
// Delete Service
// ============================

export const deleteService =
  async (serviceId) => {
    const response =
      await api.delete(
        `/services/${serviceId}`
      );

    return response.data;
  };