
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data || error.message
    );
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );
      const requestUrl =
        error.config?.url || "";

      const isAuthRequest =
        requestUrl.includes(
          "/auth/login"
        ) ||
        requestUrl.includes(
          "/auth/register"
        ) ||
        requestUrl.includes(
          "/auth/google"
        );

      if (!isAuthRequest) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
