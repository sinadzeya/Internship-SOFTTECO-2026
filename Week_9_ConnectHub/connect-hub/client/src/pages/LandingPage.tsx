import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service.ts';

export function LandingPage() {
  const isAuthenticated = false;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error during Log Out:", error);
    }
  };

  return (
    <main
      data-layout="page-center"
    >
      <header data-layout="top-nav">
        <div data-layout="actions-cluster" data-slot="auth-group">
          {!isAuthenticated ? (
            <>
              <Button data-slot="secondary-action" size="sm" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button data-slot="secondary-action" size="sm" variant="outline" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button data-slot="danger-action" size="sm" variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </div>
      </header>

      <section
        data-layout="stack-centered"
      >
        <Badge data-slot="stack-badge" variant="outline">
          Welcome w ConnectHub
        </Badge>

        <h1
          data-style="title-prominent"
        >
          Social discovery platform
        </h1>

        <p
          data-style="subtitle-prominent"
        >
          Find people based on your current passions
        </p>

        <div
          data-layout="actions-cluster"
        >
          <Button data-slot="primary-action" size="lg">
            Start Now
          </Button>
          <Button data-slot="secondary-action" size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      <section
        data-slot="features-grid"
        data-layout="grid-adaptive"
      >
        <Card data-slot="feature-card" data-style="card-elevated">
          <CardHeader data-slot="card-header">
            <CardTitle data-slot="card-title">Discover Passions</CardTitle>
            <CardDescription data-slot="card-desc">
              Explore interest-based posts and share what inspires you.
            </CardDescription>
          </CardHeader>
          <CardContent data-slot="card-body">
            Find like-minded people across categories like books, travel, art, and music.
          </CardContent>
        </Card>

        <Card data-slot="feature-card" data-style="card-elevated">
          <CardHeader data-slot="card-header">
            <CardTitle data-slot="card-title">Privacy & Control</CardTitle>
            <CardDescription data-slot="card-desc">
              Decide who you connect with and what you share.
            </CardDescription>
          </CardHeader>
          <CardContent data-slot="card-body">
            Take charge of your profile visibility and choose when to share contact details.
          </CardContent>
        </Card>

        <Card data-slot="feature-card" data-style="card-elevated">
          <CardHeader data-slot="card-header">
            <CardTitle data-slot="card-title">Modern Design</CardTitle>
            <CardDescription data-slot="card-desc">
              A clean, clear, and intuitive experience.
            </CardDescription>
          </CardHeader>
          <CardContent data-slot="card-body">
            Seamlessly navigate an accessible platform built for genuine social connections.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}