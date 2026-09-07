import type { AppAction, AppState } from '@/store/context.tsx';
import { createContext, type Dispatch, useContext } from 'react';

export const StateContext = createContext<AppState | undefined>(undefined);
export const DispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

export const useAppState = (): AppState => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState should be used inside StoreProvider");
  }
  return context;
};

export const useAppDispatch = (): Dispatch<AppAction> => {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error("useAppDispatch should be used inside StoreProvider");
  }
  return context;
};