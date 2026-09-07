import {
  type ReactNode,
  useEffect,
  useReducer,
} from 'react';
import {
  appReducer,
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
import { userService } from '@/services/user.service.ts';
import { StateContext, DispatchContext } from '@/store/useStore.ts';

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
        const{ data }  = await axios.post(
          `${import.meta.env.API_URL || "http://localhost:3000"}/api/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        setAccessToken(data.accessToken);

        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }

        const userData = await userService.me();

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: userData,
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
            <CardDescription>Initialising session...</CardDescription>
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