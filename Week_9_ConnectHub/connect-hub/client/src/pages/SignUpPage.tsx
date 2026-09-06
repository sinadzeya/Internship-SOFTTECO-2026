import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

      {error && (
        <div data-slot="form-error" data-style="error-message">
          {error}
        </div>
      )}

      <Card data-slot="auth-card" data-style="card-elevated">
        <CardHeader data-slot="card-header">
          <CardTitle data-slot="card-title">Sign Up</CardTitle>
          <CardDescription data-slot="card-desc">
            Create an account to join ConnectHub
          </CardDescription>
        </CardHeader>

        <CardContent data-slot="card-body">
          <form onSubmit={handleSignUp} data-layout="stack-form">
            {error && <div data-style="error-message">{error}</div>}

            <div data-layout="field-group">
              <label htmlFor="name" data-style="label">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div data-layout="field-group">
              <label htmlFor="email" data-style="label">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div data-layout="field-group">
              <label htmlFor="password" data-style="label">
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
              data-slot="primary-action"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p data-style="auth-footer-text">
              Already have an account?{" "}
              <Button variant="link" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}