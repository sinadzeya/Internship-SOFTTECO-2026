import { api } from '@/lib/axios.ts';

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export const userService = {
  async me(): Promise<UserData> {
    const { data } = await api.get<UserData>("/api/users/me");
    return data;
  },
  async fetchUserInfo(id: string): Promise<UserData> {
    const { data } = await api.get<UserData>(`/api/users/${id}`);
    return data;
  }
};