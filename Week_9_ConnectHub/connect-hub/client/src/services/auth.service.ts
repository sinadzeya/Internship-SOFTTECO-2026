import { api, setAccessToken } from '@/lib/axios';
import axios from 'axios';

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refreshToken");

        const { data } = await axios.post(
          `${import.meta.env.API_URL || "http://localhost:3000"}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        setAccessToken(data.accessToken);

        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("refreshToken");
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async register(dto: RegisterUserDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/register", dto);
    return data;
  },

  async login(dto: LoginUserDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/login", dto);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } finally {
      sessionStorage.removeItem("refreshToken");
    }
  },
};