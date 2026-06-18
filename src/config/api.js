import axios from "axios";

const api = axios.create({
  baseURL: "https://pearlines.onrender.com/api",
});

export default api;
