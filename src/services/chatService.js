// src/services/chatService.js

import api from "../config/api";

export const createChat =
  async (data) => {
    const response =
      await api.post(
        "/chats",
        data
      );

    return response.data;
  };

export const getAllChats =
  async () => {
    const response =
      await api.get(
        "/chats"
      );

    return response.data;
  };