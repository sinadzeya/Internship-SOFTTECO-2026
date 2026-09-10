import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  type AddSocialAccountDto,
  type SocialAccountData,
  socialAccountService,
  type UpdateSocialAccountDto,
} from '@/services/social-account.service.ts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function SocialAccountsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, socialAccounts, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken && user);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AddSocialAccountDto>({
    platform: "",
    accountName: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<UpdateSocialAccountDto>({
    platform: '',
    accountName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddSocialAccess = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      await socialAccountService.addAccount(formData);
      await loadData();
      setFormData({ platform: '', accountName: '' });
    } catch (err: unknown) {
      console.error('Error during creation:', err);
      setError('Failed to add contact data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (socialAccountId: string) => {
    try {
      await socialAccountService.removeAccount(socialAccountId);

      toast.success('Social account removed successfully');

      await loadData();
    } catch (err: unknown) {
      console.error('Error during deletion of the social account:', err);

      if (isAxiosError(err) && err.response) {
        const message = err.response.data?.message;
        toast.error(message || 'Failed to delete social account.');
      } else {
        toast.error('Failed to delete social account. Please try again.');
      }
    }
  };

  const handleStartEdit = (account: SocialAccountData) => {
    setEditingId(account.id);
    setEditFormData({
      platform: account.platform,
      accountName: account.accountName,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ platform: '', accountName: '' });
  };

  const handleSaveEdit = async (socialAccountId: string) => {
    try {
      setEditSubmitting(true);
      await socialAccountService.updateAccount(socialAccountId, editFormData);
      toast.success('Social account updated successfully!');
      setEditingId(null);
      await loadData();
    } catch (err: unknown) {
      console.error('Error updating account:', err);
      toast.error('Failed to update account.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {

      const myAccountsRes = await socialAccountService.fetchMyAccounts();

      if (myAccountsRes) {
        const freshAccounts = myAccountsRes || [];
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
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadData();
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

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

      {user ? (
        <div className="w-full max-w-xl pt-20 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-md space-y-4">
            <CardHeader>
              <CardTitle>Add Social Account</CardTitle>
              <CardDescription>
                Add contact details for your social profiles so others can request access.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAddSocialAccess} data-layout="stack-form">
                <div className="flex flex-col gap-2">
                  <label htmlFor="platform" className="block text-sm font-medium">
                    Platform
                  </label>
                  <Input
                    id="platform"
                    name="platform"
                    type="text"
                    placeholder="Instagram"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="accountName" className="block text-sm font-medium">
                    Your Account Name
                  </label>
                  <Input
                    id="accountName"
                    name="accountName"
                    type="text"
                    placeholder={user.username}
                    value={formData.accountName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="w-full max-w-xl pt-5 pb-10">
              {socialAccounts?.length > 0 ? (
                <ul className="flex flex-col justify-center gap-4">
                  {socialAccounts.map((account) => {
                    const isEditing = editingId === account.id;

                    return (
                      <Card key={account.id}>
                        {isEditing ? (

                          <CardContent className="pt-3 space-y-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium">Platform</label>
                              <Input
                                value={editFormData.platform}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, platform: e.target.value }))
                                }
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium">Account Name</label>
                              <Input
                                value={editFormData.accountName}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({ ...prev, accountName: e.target.value }))
                                }
                              />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                disabled={editSubmitting}
                                onClick={() => handleSaveEdit(account.id)}
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
                              <CardTitle>{account.platform}</CardTitle>
                              <CardDescription>{account.accountName}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStartEdit(account)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemove(account.id)}
                              >
                                Remove
                              </Button>
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
                  <AlertTitle>No data</AlertTitle>
                  <AlertDescription>No social accounts found.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load user data.</AlertDescription>
        </Alert>
      )}
    </main>
  );
}