// src/services/messageService.js

import api from "../config/api";

export const createMessage =
  async (data) => {
    const response =
      await api.post(
        "/messages",
        data
      );

    return response.data;
  };

export const getMessagesByChatId =
  async (chatId) => {
    const response =
      await api.get(
        `/messages/${chatId}`
      );

    return response.data;
  };