// src/services/aboutUsService.js

import api from "../config/api";

export const getAboutUs = async () => {
  const response = await api.get("/about-us");

  return response.data;
};

export const updateAboutUs = async (data) => {
  const response = await api.put("/about-us", data);

  return response.data;
};
