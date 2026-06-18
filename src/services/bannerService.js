// src/services/bannerService.js

import api from "../config/api";

// ============================
// Get All Banners
// ============================

export const getAllBanners =
  async () => {
    const response =
      await api.get("/banners");

    return response.data;
  };

// ============================
// Get Banner By Id
// ============================

export const getBannerById =
  async (bannerId) => {
    const response =
      await api.get(
        `/banners/${bannerId}`
      );

    return response.data;
  };

// ============================
// Create Banner
// ============================

export const createBanner =
  async (bannerData) => {
    const response =
      await api.post(
        "/banners",
        bannerData
      );

    return response.data;
  };

// ============================
// Update Banner
// ============================

export const updateBanner =
  async (
    bannerId,
    bannerData
  ) => {
    const response =
      await api.put(
        `/banners/${bannerId}`,
        bannerData
      );

    return response.data;
  };

// ============================
// Delete Banner
// ============================

export const deleteBanner =
  async (bannerId) => {
    const response =
      await api.delete(
        `/banners/${bannerId}`
      );

    return response.data;
  };