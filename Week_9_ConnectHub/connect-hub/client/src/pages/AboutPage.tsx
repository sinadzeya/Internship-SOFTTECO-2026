import { Button } from '@/components/ui/button.tsx';
import { useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, Lightbulb, ShieldUser } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';


export function AboutPage() {
  const navigate = useNavigate();

  const { user, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken && user);

  return (
    <main data-layout="page-center">
      <header data-layout="top-left-nav">
        <div
          data-layout="actions-cluster"
          className="flex flex-col md:flex-row items-start md:items-center gap-3"
        >
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft data-layout="icon-leading" />
            Back
          </Button>
        </div>
      </header>

      <div className="w-full text-center max-w-xl pt-25 pb-10">
        <Card className="border-0 border-none outline-none ring-0 shadow-none flex flex-col items-center p-6 space-y-6">
          <CardHeader className="w-full flex flex-col items-center text-center p-0 space-y-1">
            <CardTitle data-style="title-prominent">ConnectHub</CardTitle>
            <CardDescription className="text-sm">
              Discover & Connect
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 ">
            A social discovery platform where current passions turn into
            meaningful conversations.
          </CardContent>

          <div className="flex flex-row items-center gap-3">
            <Lightbulb className="h-5 w-5" />
            <HeartHandshake className="h-5 w-5" />
            <ShieldUser className="h-5 w-5" />
          </div>
          <CardContent className="space-y-4 ">
            Share what drives you and find like-minded people safely.
          </CardContent>

          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-semibold">Ready to find your circle?</h2>
              <p className="text-xs text-muted-foreground">
                Join ConnectHub today and start sharing your passions
              </p>
            </div>
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate('/home')}>
                Get Started
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            )}
          </Card>
          <Badge variant="secondary">
            <a
              href="https://linkedin.com/in/nadzeya-silchankava"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Created by: Nadzeya Silchankava
            </a>
          </Badge>
        </Card>
      </div>
    </main>
  );
}