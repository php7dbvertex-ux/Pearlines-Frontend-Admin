import api from "../config/api";

// Get All Tips

export const getAllTips =
  async () => {
    const response =
      await api.get("/tips");

    return response.data;
  };

// Get Tip By Id

export const getTipById =
  async (tipId) => {
    const response =
      await api.get(
        `/tips/${tipId}`
      );

    return response.data;
  };

// Create Tip

export const createTip =
  async (tipData) => {
    const response =
      await api.post(
        "/tips",
        tipData
      );

    return response.data;
  };

// Update Tip

export const updateTip =
  async (
    tipId,
    tipData
  ) => {
    const response =
      await api.put(
        `/tips/${tipId}`,
        tipData
      );

    return response.data;
  };

// Delete Tip

export const deleteTip =
  async (tipId) => {
    const response =
      await api.delete(
        `/tips/${tipId}`
      );

    return response.data;
  };