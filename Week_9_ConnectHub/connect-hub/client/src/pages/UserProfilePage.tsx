import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Mail,
  UserIcon,
  UserPlus,
} from 'lucide-react';
import {
  Card,
  CardContent, CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { type UserData, userService } from '@/services/user.service.ts';
import { type PostData, postService } from '@/services/post.service.ts';
import {
  type SocialAccountAccessDto,
  socialAccountService,
} from '@/services/social-account.service.ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { authService } from '@/services/auth.service.ts';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export function UserProfilePage() {

  const { id } = useParams<{ id: string }>();
  const { user, socialAccounts, accessToken } = useAppState();

  const [userInfo, setUserInfo] = useState<UserData>();
  const [userPosts, setUsersPosts] = useState<PostData[]>([]);

  const [sharedAccesses, setSharedAccesses] = useState<SocialAccountAccessDto[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingAccess, setUpdatingAccess] = useState<string | null>(null);
  const [sharedWithMeAccesses, setSharedWithMeAccesses] = useState<SocialAccountAccessDto[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = Boolean(accessToken);
  const isUserProfile = Boolean(user?.id && String(user.id) === String(id));

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loadData = async (profileId: string) => {
    setLoading(true);
    try {
      const [userRes, postsRes, myAccountsRes, sharedRes, sharedWithMeRes] = await Promise.allSettled([
        userService.fetchUserInfo(profileId),
        postService.fetchPostByUserId(profileId),
        socialAccountService.fetchMyAccounts(),
        socialAccountService.fetchSharedByMe(),
        socialAccountService.fetchSharedWithMe(),
      ]);

      if (userRes.status === 'fulfilled') setUserInfo(userRes.value);
      if (postsRes.status === 'fulfilled') setUsersPosts(postsRes.value || []);
      if (sharedRes.status === 'fulfilled') setSharedAccesses(sharedRes.value || []);
      if (sharedWithMeRes.status === 'fulfilled') setSharedWithMeAccesses(sharedWithMeRes.value || []);

      if (myAccountsRes.status === 'fulfilled') {
        const freshAccounts = myAccountsRes.value || [];
        dispatch({
          type: "SET_USER_SOCIAL_ACCOUNTS",
          payload: freshAccounts,
        });
      }

    } catch (err: unknown) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadData(id);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div data-layout="page-center">
        <Card data-layout="elements-full-width">
          <CardHeader>
            <CardTitle>ConnectHub</CardTitle>
            <CardDescription>Loading user data...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleToggleAccess = async (socialAccountId: string, currentAccessStatus: boolean) => {
    if (!id) return;
    setUpdatingAccess(socialAccountId);

    try {
      await socialAccountService.grantOrUpdateAccess({
        clientId: id,
        socialAccountId: socialAccountId,
        clientHasAccess: !currentAccessStatus,
      });

      const requests = await socialAccountService.fetchRequestToMe();

      const matchingRequest = requests.find(
        (req) => req.client.id === id && !req.fulfilled
      );

      if (matchingRequest) {
        await socialAccountService.fulfillRequest(matchingRequest.id);
      }

      const updatedShared = await socialAccountService.fetchSharedByMe();
      setSharedAccesses(updatedShared);
    } catch (err) {
      console.error('Error toggling access:', err);
    } finally {
      setUpdatingAccess(null);
    }
  };

  const isAccountShared = (socialAccountId: string) => {
    return sharedAccesses.some(
      (acc) =>
        acc.socialAccount.id === socialAccountId &&
        String(acc.client?.id) === String(id) &&
        acc.clientHasAccess,
    );
  };

  const accountsSharedWithMeByThisUser = sharedWithMeAccesses.filter(
    (acc) =>
      String(acc.socialAccount?.owner?.id) === String(id) &&
      acc.clientHasAccess
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during Log Out:", error);
    }
  };

  const handleRequest = async () => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await socialAccountService.createRequestToUser({ ownerId: id });
      toast.success('Request sent successfully!');
    } catch (error: unknown) {
      console.error("Error during creation:", error);

      if (isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message;

        const formattedMessage = Array.isArray(message)
          ? message.join(', ')
          : message;

        if (statusCode === 409) {
          toast.warning(formattedMessage || 'A request already exists or access is already granted.');
        } else {
          toast.error('Failed to send request. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <main data-layout="page-center-dymanic">
      <header data-layout="top-left-nav">
        <div data-layout="actions-cluster">
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft data-layout="icon-leading"/>
            Back
          </Button>
        </div>
      </header>

      <header data-layout="top-right-nav">
        <div data-layout="actions-cluster">
          {!isUserProfile ? (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleRequest}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Manage Contacts
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Social Connections</DialogTitle>
                  <DialogDescription>
                    Manage access rights and shared accounts with {userInfo?.username}.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="shared-with-me" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="shared-with-me">
                      Shared with Me ({accountsSharedWithMeByThisUser.length})
                    </TabsTrigger>
                    <TabsTrigger value="grant-access">
                      Grant Access
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="shared-with-me" className="flex flex-col gap-3 py-4">
                    {accountsSharedWithMeByThisUser.length > 0 ? (
                      accountsSharedWithMeByThisUser.map((acc) => (
                        <div
                          key={acc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{acc.socialAccount.platform}</p>
                            <p className="text-xs text-muted-foreground">
                              {acc.socialAccount.accountName}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" disabled className="opacity-100 cursor-default">
                            Accessible
                          </Button>
                        </div>
                      ))
                    ) : (
                      <Button
                        className="text-sm text-muted-foreground hover:underline text-center py-4"
                        disabled={isSubmitting}
                        onClick={handleRequest}
                      >
                        This user hasn't shared any accounts with you yet. Click to send a request.
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="grant-access" className="flex flex-col gap-3 py-4">
                    {socialAccounts.length > 0 ? (
                      socialAccounts.map((account) => {
                        const hasAccess = isAccountShared(account.id);
                        const isPending = updatingAccess === account.id;

                        return (
                          <div
                            key={account.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-semibold">{account.platform}</p>
                              <p className="text-xs text-muted-foreground">{account.accountName}</p>
                            </div>

                            <Button
                              size="sm"
                              variant={hasAccess ? 'destructive' : 'default'}
                              disabled={isPending}
                              onClick={() => handleToggleAccess(account.id, hasAccess)}
                            >
                              {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : hasAccess ? (
                                'Revoke Access'
                              ) : (
                                'Grant Access'
                              )}
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <Link
                        className="text-sm text-muted-foreground hover:underline text-center py-4"
                        to={"/access"}
                      >
                        You haven't added any social accounts yet. Click to add your social accounts.
                      </Link>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => navigate("/access")}>
                Contact data
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          )}
        </div>
      </header>


      {userInfo ? (
        <div className="w-full max-w-xl md:pt-25 pt-15">
          <Card className="shadow-md">
            <CardHeader>
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {userInfo.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold">{userInfo.username}</CardTitle>
                  <Badge variant="secondary">User</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{userInfo.email}</p>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4 text-primary" />
                <span>Username:</span>
                <span className="font-medium text-foreground">{userInfo.username}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>E-mail:</span>
                <span className="font-medium text-foreground">{userInfo.email}</span>
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

      <div className="w-full max-w-xl pb-10">
        {userPosts?.length > 0 ? (
          <ul className="flex flex-col justify-center gap-10">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    <Link
                      to={`/profile/${post.user.id}`}
                      className="hover:underline hover:text-primary cursor-pointer transition-colors"
                    >
                      {post.user.username}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>{post.content}</CardContent>
                <CardContent>
                  <Badge variant="secondary">{post.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <Alert>
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No posts available.</AlertDescription>
          </Alert>
        )}
      </div>

    </main>
  );
}