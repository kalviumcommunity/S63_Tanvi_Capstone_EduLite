import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://s63-tanvi-capstone-edulite-3.onrender.com/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
