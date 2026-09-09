import { setAccessToken } from '@/lib/axios.ts';
import type { PostData } from '@/services/post.service.ts';
import type { UserData } from '@/services/user.service.ts';
import type { SocialAccountData } from '@/services/social-account.service.ts';

export interface AppState {
  user: UserData | null;
  posts: PostData[];
  socialAccounts: SocialAccountData[];
  accessToken: string | null;
  loading: boolean;
  isInitializing: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: UserData, accessToken: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "INIT_FINISH" }
  | { type: "LOGOUT" }
  | { type: "SET_POSTS"; payload: PostData[] }
  | { type: "SET_USER_SOCIAL_ACCOUNTS"; payload: SocialAccountData[] };

export const initialState: AppState = {
  user: null,
  posts: [],
  socialAccounts: [],
  accessToken: null,
  loading: false,
  isInitializing: true,
  error: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      setAccessToken(action.payload.accessToken);
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        isInitializing: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isInitializing: false,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "INIT_FINISH":
      return { ...state, isInitializing: false };
    case "LOGOUT":
      setAccessToken(null);
      return {
        ...state,
        accessToken: null,
        isInitializing: false };
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "SET_USER_SOCIAL_ACCOUNTS":
      return {
        ...state,
        socialAccounts: action.payload,
      };
    default:
      return state;
  }
}