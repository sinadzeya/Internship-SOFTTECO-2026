import { api } from "@/lib/axios";

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
  user: {
    id: string;
    email: string;
  };
}

export const authService = {
  async register(dto: RegisterUserDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/register", dto);
    return data;
  },

  async login(dto: LoginUserDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/login", dto);
    if (data.accessToken) {
      localStorage.setItem("access_token", data.accessToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
    }
  },
};