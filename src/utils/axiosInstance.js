import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://quick-blog-backend-alym.onrender.com/api",
});
