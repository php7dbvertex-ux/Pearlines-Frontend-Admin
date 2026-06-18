// src/services/videoService.js

import api from "../config/api";

// Get All Videos

export const getAllVideos =
  async () => {
    const response =
      await api.get("/videos");

    return response.data;
  };

// Get Video By Id

export const getVideoById =
  async (videoId) => {
    const response =
      await api.get(
        `/videos/${videoId}`
      );

    return response.data;
  };

// Create Video

export const createVideo =
  async (videoData) => {
    const response =
      await api.post(
        "/videos",
        videoData
      );

    return response.data;
  };

// Update Video

export const updateVideo =
  async (
    videoId,
    videoData
  ) => {
    const response =
      await api.put(
        `/videos/${videoId}`,
        videoData
      );

    return response.data;
  };

// Delete Video

export const deleteVideo =
  async (videoId) => {
    const response =
      await api.delete(
        `/videos/${videoId}`
      );

    return response.data;
  };