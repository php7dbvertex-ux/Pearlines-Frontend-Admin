// src/services/userService.js

import api from "../config/api";

const ADMIN_TOKEN = "my-secret-admin-token";

export const getAllUsers = async () => {
  const response = await api.get(
    "/admin/users",
    {
      headers: {
        Authorization: ADMIN_TOKEN,
      },
    }
  );

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(
    `/admin/users/${id}`,
    {
      headers: {
        Authorization: ADMIN_TOKEN,
      },
    }
  );

  return response.data;
};