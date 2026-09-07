import { setAccessToken } from '@/lib/axios.ts';

export interface User {
  id: string;
  email: string;
}

export interface AppState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isInitializing: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { accessToken: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "INIT_FINISH" }
  | { type: "LOGOUT" };

export const initialState: AppState = {
  user: null,
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
        user: null,
        accessToken: null,
        isInitializing: false };
    default:
      return state;
  }
}