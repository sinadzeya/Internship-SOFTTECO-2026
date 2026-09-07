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
    <main data-layout="page-center">
      <header data-layout="top-right-nav">
        <div data-layout="actions-cluster">
          {!isAuthenticated ? (
            <>
              <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </div>
      </header>

      <section data-layout="stack-centered">
        <Badge data-layout="stack-badge" variant="outline">
          Welcome w ConnectHub
        </Badge>

        <h1 data-style="title-prominent">
          Social discovery platform
        </h1>

        <p data-style="subtitle-prominent">
          Find people based on your current passions
        </p>

        <div data-layout="actions-cluster">
          <Button size="lg">
            Start Now
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      <section data-layout="grid-adaptive">
        <Card>
          <CardHeader>
            <CardTitle>Discover Passions</CardTitle>
            <CardDescription>
              Explore interest-based posts and share what inspires you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Find like-minded people across categories like books, travel, art, and music.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Control</CardTitle>
            <CardDescription>
              Decide who you connect with and what you share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Take charge of your profile visibility and choose when to share contact details.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modern Design</CardTitle>
            <CardDescription>
              A clean, clear, and intuitive experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Seamlessly navigate an accessible platform built for genuine social connections.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}