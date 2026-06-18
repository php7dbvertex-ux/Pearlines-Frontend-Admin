// src/services/faqService.js

import api from "../config/api";

// ============================
// Get All FAQs
// ============================

export const getAllFAQs = async () => {
  const response = await api.get("/faqs");

  return response.data;
};

// ============================
// Get FAQ By Id
// ============================

export const getFAQById = async (faqId) => {
  const response = await api.get(`/faqs/${faqId}`);

  return response.data;
};

// ============================
// Create FAQ
// ============================

export const createFAQ = async (faqData) => {
  const response = await api.post("/faqs", faqData);

  return response.data;
};

// ============================
// Update FAQ
// ============================

export const updateFAQ = async (faqId, faqData) => {
  const response = await api.put(`/faqs/${faqId}`, faqData);

  return response.data;
};

// ============================
// Delete FAQ
// ============================

export const deleteFAQ = async (faqId) => {
  const response = await api.delete(`/faqs/${faqId}`);

  return response.data;
};
