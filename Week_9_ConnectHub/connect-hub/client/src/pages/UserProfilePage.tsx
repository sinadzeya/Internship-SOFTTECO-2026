import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Loader2, Mail, UserIcon } from 'lucide-react';
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
  const [isSharedWithMeDialogOpen, setIsSharedWithMeDialogOpen] = useState<boolean>(false);

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
          {!isUserProfile && (
          <>
            <Dialog open={isSharedWithMeDialogOpen} onOpenChange={setIsSharedWithMeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="relative">
                  <Mail className="h-4 w-4" />
                  {accountsSharedWithMeByThisUser.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  {accountsSharedWithMeByThisUser.length}
                </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Shared Contacts</DialogTitle>
                  <DialogDescription>
                    Social accounts shared with you by {userInfo?.username}.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-4">
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
                        <Badge variant="outline">Accessible</Badge>
                      </div>
                    ))
                  ) : (
                      <Link className="text-sm text-muted-foreground hover:underline" to={`/request-access/${id}`}>
                        This user hasn't shared any accounts with you yet. Click to sent a request.
                      </Link>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Manage Contacts
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Share Social Accounts</DialogTitle>
                  <DialogDescription>
                    Select which platforms you want to grant or revoke access to for {userInfo?.username}.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-4">
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
                              'Revoke'
                            ) : (
                              'Grant Access'
                            )}
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <Link className="text-sm text-muted-foreground hover:underline" to={"/access"}>
                      You haven't added any social accounts yet.  Click to add your social accounts.
                    </Link>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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