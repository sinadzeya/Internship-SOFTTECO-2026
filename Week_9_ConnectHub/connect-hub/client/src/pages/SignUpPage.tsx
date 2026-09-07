import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, type RegisterUserDto } from '@/services/auth.service';
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

export function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterUserDto>({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err: unknown) {
      console.error("Error during Sign Up:", err);

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;

        if (Array.isArray(serverMessage)) {
          setError(serverMessage.join(", "));
        } else if (typeof serverMessage === "string") {
          setError(serverMessage);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
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
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to join ConnectHub
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} data-layout="stack-form">
            {error && <div>{error}</div>}

            <div>
              <label htmlFor="name">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Katty Smith"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p>
              Already have an account?{" "}
              <Button variant="link" size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}