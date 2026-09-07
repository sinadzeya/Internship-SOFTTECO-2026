import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

let memoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

api.interceptors.request.use((config) => {
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }
  return config;
});