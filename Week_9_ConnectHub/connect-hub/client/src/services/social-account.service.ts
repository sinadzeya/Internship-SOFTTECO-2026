import { api } from '@/lib/axios.ts';
import type { UserData } from '@/services/user.service.ts';

export interface SocialAccountData {
  id: string;
  platform: string;
  accountName: string;
  createdAt: string;
}

export interface AddSocialAccountDto {
  platform: string;
  accountName: string;
}

export interface GrantAccessDto {
  clientId: string;
  socialAccountId: string;
  clientHasAccess: boolean;
}

export interface CreateSocialAccountRequestDto {
  ownerId: string;
}

export interface SocialAccountRequestDto {
  id: string;
  owner: UserData;
  client: UserData;
  fulfilled: boolean;
  createdAt: string;
}

export interface SocialAccountAccessDto {
  id: string;
  clientHasAccess: boolean;
  createdAt: string;
  client: UserData;
  socialAccount: {
    id: string;
    platform: string;
    accountName: string;
    owner?: UserData;
  };
}

export const socialAccountService = {
  async addAccount(dto: AddSocialAccountDto): Promise<SocialAccountData> {
    const { data } = await api.post<SocialAccountData>('/api/social-accounts', dto);
    return data;
  },
  async fetchMyAccounts(): Promise<SocialAccountData[]> {
    const { data } = await api.get<SocialAccountData[]>("/api/social-accounts/my");
    return data;
  },
  async grantOrUpdateAccess(dto: GrantAccessDto): Promise<SocialAccountAccessDto> {
    const { data } = await api.post<SocialAccountAccessDto>("/api/social-accounts/access", dto);
    return data;
  },
  async fetchSharedWithMe(): Promise<SocialAccountAccessDto[]> {
    const { data } = await api.get<SocialAccountAccessDto[]>('/api/social-accounts/shared-with-me',);
    return data;
  },
  async fetchSharedByMe(): Promise<SocialAccountAccessDto[]> {
    const { data } = await api.get<SocialAccountAccessDto[]>("/api/social-accounts/shared-by-me");
    return data;
  },
  async createRequestToUser(dto: CreateSocialAccountRequestDto): Promise<SocialAccountRequestDto> {
    const { data } = await api.post<SocialAccountRequestDto>("/api/social-accounts/requests", dto);
    return data;
  },
  async fetchRequestToMe(): Promise<SocialAccountRequestDto[]> {
    const { data } = await api.get<SocialAccountRequestDto[]>("/api/social-accounts/requests-to-me");
    return data;
  },
  async fulfillRequest(requestId: string): Promise<SocialAccountRequestDto> {
    const { data } = await api.patch<SocialAccountRequestDto>(`/api/social-accounts/requests/${requestId}/fulfill`);
    return data;
  }
}
