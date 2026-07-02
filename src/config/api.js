import axios from "axios";

const LOCAL_URL = "http://localhost:5000/api";
const LIVE_URL = "https://pearlines.onrender.com/api";

const api = axios.create({
  baseURL: LIVE_URL, // Change to LOCAL_URL when developing locally
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;