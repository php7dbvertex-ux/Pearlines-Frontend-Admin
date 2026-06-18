// src/services/galleryService.js


import api from "../config/api";
// Get All Gallery Images

export const getAllGallery =
  async () => {
    const response =
      await api.get("/gallery");

    return response.data;
  };

// Get Gallery By Id

export const getGalleryById =
  async (galleryId) => {
    const response =
      await api.get(
        `/gallery/${galleryId}`
      );

    return response.data;
  };

// Create Gallery

export const createGallery =
  async (galleryData) => {
    const response =
      await api.post(
        "/gallery",
        galleryData
      );

    return response.data;
  };

// Update Gallery

export const updateGallery =
  async (
    galleryId,
    galleryData
  ) => {
    const response =
      await api.put(
        `/gallery/${galleryId}`,
        galleryData
      );

    return response.data;
  };

// Delete Gallery

export const deleteGallery =
  async (galleryId) => {
    const response =
      await api.delete(
        `/gallery/${galleryId}`
      );

    return response.data;
  };