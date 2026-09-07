import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authService,
  type LoginUserDto,
} from '@/services/auth.service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { setAccessToken } from '@/lib/axios.ts';
import { userService } from '@/services/user.service.ts';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';

export function SignInPage() {
  const navigate = useNavigate();

  const { loading, error } = useAppState();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<LoginUserDto>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e: React.SubmitEvent) => {
    e.preventDefault();

    dispatch({ type: "AUTH_START" });

    try {
      const response = await authService.login(formData);

      setAccessToken(response.accessToken);

      const userData = await userService.me();

      sessionStorage.setItem("refreshToken", response.refreshToken);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: userData,
          accessToken: response.accessToken
        },
      });

      navigate("/home");
    } catch (err: unknown) {
      console.error('Error during Sign Up:', err);

      let errorMessage = 'An unexpected error occurred.';

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;

        if (Array.isArray(serverMessage)) {
          errorMessage = serverMessage.join(', ');
        } else if (typeof serverMessage === 'string') {
          errorMessage = serverMessage;
        } else {
          errorMessage = 'Login failed. Please try again.';
        }
      }

      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
    }
  };

  return (

    <main data-layout="page-center">
      <header data-layout="top-left-nav">
        <div data-layout="actions-cluster">
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft data-layout="icon-leading"/>
            Back
          </Button>
        </div>
      </header>

      <div data-layout="elements-full-width">
      {error && (
        <Alert variant="destructive">
          <AlertCircle/>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card data-layout="auth-card">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Login to find your people with ConnectHub
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} data-layout="stack-form">

            <div>
              <label htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="smith.k@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </form>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}