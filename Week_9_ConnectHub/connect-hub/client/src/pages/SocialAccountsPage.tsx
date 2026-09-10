import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  type AddSocialAccountDto,
  socialAccountService,
} from '@/services/social-account.service.ts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';

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
                <ul className="flex flex-col justify-center gap-5">
                  {socialAccounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader>
                        <CardTitle>{account.platform}</CardTitle>
                        <CardDescription>{account.accountName}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
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