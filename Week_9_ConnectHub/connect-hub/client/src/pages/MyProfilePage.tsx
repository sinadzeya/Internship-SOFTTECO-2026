import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Mail, UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useAppState } from '@/store/useStore.ts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';

export function MyProfilePage() {
  const { user, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  if (!isAuthenticated) {
    return null;
  }

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

        {user ? (
          <div data-layout="page-center">
            <Card className="w-full max-w-md shadow-md">
              <CardHeader>
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                    <Badge variant="secondary">User</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>Username:</span>
                  <span className="font-medium text-foreground">{user.username}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>E-mail:</span>
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
              </CardContent>

            </Card>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load user data.</AlertDescription>
          </Alert>
        )}

    </main>
  );
}