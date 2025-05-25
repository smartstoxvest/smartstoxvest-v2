import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // ✅ Adjust if backend is hosted elsewhere
});

export default api;
