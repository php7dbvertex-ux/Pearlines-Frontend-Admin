// src/services/paymentService.js

import api from "../config/api";

// Get All Payments

export const getAllPayments =
  async () => {
    const response =
      await api.get(
        "/payments"
      );

    return response.data;
  };