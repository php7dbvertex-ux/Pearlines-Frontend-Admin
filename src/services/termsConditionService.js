import api from "../config/api";

export const getTermsCondition = async () => {
  const response = await api.get("/terms-conditions");

  return response.data;
};

export const updateTermsCondition = async (data) => {
  const response = await api.put("/terms-conditions", data);

  return response.data;
};
