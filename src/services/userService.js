import api from "../config/api";

// Get All Users
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Delete User
export const deleteUser = async (id) => {
  const response = await api.delete(
    `/users/${id}`
  );

  return response.data;
};

// Get Single User
export const getUserById = async (id) => {
  const response = await api.get(
    `/users/${id}`
  );

  return response.data;
};