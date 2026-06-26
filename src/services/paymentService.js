import api from "../config/api";

const ADMIN_TOKEN =
  import.meta.env.VITE_ADMIN_TOKEN;

// Payment History

export const getAllPayments =
  async () => {
    const response =
      await api.get(
        "/payments/all",
        {
          headers: {
            Authorization:
              ADMIN_TOKEN,
          },
        }
      );

    return response.data;
  };

// Create Payment Request

export const createPaymentRequest =
  async (data) => {
    const response =
      await api.post(
        "/payment-request/create",
        data,
        {
          headers: {
            Authorization:
              ADMIN_TOKEN,
          },
        }
      );

    return response.data;
  };

// Get All Payment Requests

export const getAllPaymentRequests =
  async () => {
    const response =
      await api.get(
        "/payment-request/all",
        {
          headers: {
            Authorization:
              ADMIN_TOKEN,
          },
        }
      );

    return response.data;
  };