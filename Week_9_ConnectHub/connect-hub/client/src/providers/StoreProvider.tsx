import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  type AppAction,
  appReducer,
  type AppState,
  initialState,
} from '@/store/context.tsx';
import axios from 'axios';
import { setAccessToken } from '@/lib/axios.ts';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';

const StateContext = createContext<AppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {

    const restoreSession = async () => {
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        dispatch({ type: "INIT_FINISH" });
        return;
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.API_URL || "http://localhost:3000"}/api/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            accessToken: data.accessToken
          },
        });
      } catch {
        sessionStorage.removeItem("refreshToken");
        setAccessToken(null);
        dispatch({ type: "INIT_FINISH" });
      }
    };

    restoreSession();

  }, []);

  if (state.isInitializing) {
    return (
      <div data-layout="page-center">
        <Card data-layout="elements-full-width">
          <CardHeader>
            <CardTitle>ConnectHub</CardTitle>
            <CardDescription>Initializing session...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

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