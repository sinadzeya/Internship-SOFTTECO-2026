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
import { useAppDispatch, useAppState } from '@/store/useStore.ts';

export function LandingPage() {
  const { accessToken } = useAppState();
  const dispatch = useAppDispatch();
  const isAuthenticated = Boolean(accessToken);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
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

      <section data-layout="stack-centered" className="pt-20 md:pt-0">
        <Badge className="px-4 py-3" data-style="border-accent" variant="outline">
          Welcome w ConnectHub
        </Badge>

        <h1 data-style="title-prominent">
          Social discovery platform
        </h1>

        <p data-style="subtitle">
          Find people based on your current passions
        </p>

        <div data-layout="actions-cluster">
          <Button data-style="button-accent" size="lg" onClick={() => navigate("/home")}>
            Start Now
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
            Learn More
          </Button>
        </div>
      </section>

      <section data-layout="grid-adaptive" className="pb-10 md:pt-0">
        <Card>
          <CardHeader>
            <CardTitle data-style="text-accent">Discover Passions</CardTitle>
            <CardDescription data-style="text-slightly-accent">
              Explore interest-based posts and share what inspires you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Find like-minded people across categories like books, travel, art, and music.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-style="text-accent">Privacy & Control</CardTitle>
            <CardDescription data-style="text-slightly-accent">
              Decide who you connect with and what you share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Take charge of your profile visibility and choose when to share contact details.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-style="text-accent">Modern Design</CardTitle>
            <CardDescription data-style="text-slightly-accent">
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