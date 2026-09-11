import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { useCallback, useMemo, useState } from 'react';
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
import {
  POST_CATEGORY_LABELS,
  PostCategory,
  type PostData,
  postService,
  type UpdatePostDto,
} from '@/services/post.service.ts';
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useProfileData } from '@/hooks/useProfileData.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, socialAccounts } = useAppState();

  const queryClient = useQueryClient();

  const {
    loading,
    userInfo,
    userPosts,
    sharedAccesses,
    sharedWithMeAccesses,
    refreshData,
  } = useProfileData(id);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const isUserProfile = Boolean(user?.id && String(user.id) === String(id));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<UpdatePostDto>({
    title: '',
    content: '',
    category: PostCategory.DISCUSSION,
  });

  const requestMutation = useMutation({
    mutationFn: (ownerId: string) => socialAccountService.createRequestToUser({ ownerId }),
    onSuccess: async () => {
      toast.success('Request sent successfully!');
      await queryClient.invalidateQueries({ queryKey: ['socialAccountRequests'] });
      await queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: unknown) => {
      if (isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const message = error.response.data?.message;
        const formattedMessage = Array.isArray(message) ? message.join(', ') : message;

        if (statusCode === 409) {
          toast.warning(formattedMessage || 'A request already exists or access is already granted.');
        } else {
          toast.error('Failed to send request. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    },
  });

  const toggleAccessMutation = useMutation({
    mutationFn: async ({ socialAccountId, currentAccessStatus }: { socialAccountId: string; currentAccessStatus: boolean }) => {
      if (!id) return;

      await socialAccountService.grantOrUpdateAccess({
        clientId: id,
        socialAccountId,
        clientHasAccess: !currentAccessStatus,
      });

      const requests = await socialAccountService.fetchRequestToMe();
      const matchingRequest = requests.find((req) => req.client.id === id && !req.fulfilled);

      if (matchingRequest) {
        await socialAccountService.fulfillRequest(matchingRequest.id);
      }
    },
    onSuccess: async() => {
      toast.success('Access permissions updated successfully!');
      await queryClient.invalidateQueries({ queryKey: ['socialAccountRequests'] });
      await queryClient.invalidateQueries({ queryKey: ['socialAccounts'] });
    },
    onError: (err) => {
      console.error('Error toggling access:', err);
      toast.error('Failed to update access permissions.');
    },
  });

  const isAccountShared = useCallback(
    (socialAccountId: string) => {
      return sharedAccesses.some(
        (acc) =>
          acc.socialAccount.id === socialAccountId &&
          String(acc.client?.id) === String(id) &&
          acc.clientHasAccess
      );
    },
    [sharedAccesses, id]
  );

  const accountsSharedWithMeByThisUser = useMemo(() => {
    return sharedWithMeAccesses.filter(
      (acc) => String(acc.socialAccount?.owner?.id) === String(id) && acc.clientHasAccess
    );
  }, [sharedWithMeAccesses, id]);

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

  const handleToggleAccess = (socialAccountId: string, currentAccessStatus: boolean) => {
    toggleAccessMutation.mutate({ socialAccountId, currentAccessStatus });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during Log Out:", error);
    }
  };

  const handleRequest = () => {
    if (id) {
      requestMutation.mutate(id);
    }
  };

  const handleStartEdit = (post: PostData) => {
    setEditingId(post.id);
    setEditFormData({
      title: post.title,
      content: post.content,
      category: post.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ title: '', content: '', category: PostCategory.DISCUSSION });
  };

  const handleRemove = async (postId: string) => {
    if (!id) return;

    try {
      await postService.deletePost(postId);
      toast.success('Post removed successfully');
      await refreshData();
    } catch (err: unknown) {
      console.error('Error during deletion of the post:', err);

      if (isAxiosError(err) && err.response) {
        const message = err.response.data?.message;
        toast.error(message || 'Failed to delete post.');
      } else {
        toast.error('Failed to delete post. Please try again.');
      }
    }
  };

  const handleSaveEdit = async (postId: string) => {
    if (!id) return;

    try {
      setEditSubmitting(true);
      await postService.updatePost(postId, editFormData);
      toast.success('Post updated successfully!');
      setEditingId(null);
      await refreshData();
    } catch (err: unknown) {
      console.error('Error updating post:', err);
      toast.error('Failed to update post.');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (

    <main data-layout="page-center-dynamic">
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
                disabled={requestMutation.isPending}
                onClick={handleRequest}
              >
                {requestMutation.isPending ? (
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

                  <TabsContent value="shared-with-me" className="flex flex-col gap-3 py-4 max-h-[300px] overflow-y-auto pr-1">
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
                        variant="ghost"
                        className="h-auto w-full whitespace-normal flex flex-col items-center text-sm text-muted-foreground hover:bg-transparent hover:text-muted-foreground hover:underline text-center py-4"
                        disabled={requestMutation.isPending}
                        onClick={handleRequest}
                      >
                        This user hasn't shared any accounts with you yet. Click to send a request.
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="grant-access" className="flex flex-col gap-3 py-4 max-h-[300px] overflow-y-auto pr-1">
                    {socialAccounts.length > 0 ? (
                      socialAccounts.map((account) => {
                        const hasAccess = isAccountShared(account.id);
                        const isPending =
                          toggleAccessMutation.isPending &&
                          toggleAccessMutation.variables?.socialAccountId === account.id;

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
                      <Button
                        variant="ghost"
                        className="h-auto w-full whitespace-normal flex flex-col items-center text-sm text-muted-foreground hover:bg-transparent hover:text-muted-foreground hover:underline text-center py-4"
                        onClick={() => navigate("/access")}
                      >
                        You haven't added any social accounts yet. Click to add your social accounts.
                      </Button>
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
            {userPosts.map((post) => {
              const isEditing = editingId === post.id;

              return (
                <Card key={post.id}>
                  {isEditing ? (

                    <CardContent className="pt-3 space-y-3">

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Title</label>
                        <Textarea
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, title: e.target.value }))
                          }
                          rows={3}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Content</label>
                        <Textarea
                          value={editFormData.content}
                          onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, content: e.target.value }))
                          }
                          rows={6}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Category</label>
                        <Select
                          value={editFormData.category}
                          onValueChange={(value: PostCategory) =>
                            setEditFormData((prev) => ({ ...prev, category: value }))
                          }
                        >
                          <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Select a tag" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {Object.entries(PostCategory).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {POST_CATEGORY_LABELS[value] || value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>


                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          disabled={editSubmitting}
                          onClick={() => handleSaveEdit(post.id)}
                        >
                          {editSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={editSubmitting}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>

                    ) : (
                      <>
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
                        <CardContent className="flex items-center justify-between gap-4">
                          <Badge variant="secondary">{post.category}</Badge>
                          {isUserProfile && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartEdit(post)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemove(post.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </>
                  )}
                </Card>
              );
            })}
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