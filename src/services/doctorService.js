// src/services/doctorService.js

import api from "../config/api";

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");

  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);

  return response.data;
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);

  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.put(`/doctors/${doctorId}`, doctorData);

  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await api.delete(`/doctors/${doctorId}`);

  return response.data;
};
