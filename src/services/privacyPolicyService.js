import api from "../config/api";

export const getPrivacyPolicy = async () => {
  const response = await api.get("/privacy-policy");

  return response.data;
};

export const updatePrivacyPolicy = async (data) => {
  const response = await api.put("/privacy-policy", data);

  return response.data;
};
