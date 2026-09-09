import { useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';

export function CreateSocialAccountsPage() {
  const navigate = useNavigate();

  const { user, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken && user);

  if (!isAuthenticated) return null;

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


      <div>
        CreateSocialAccountsPage
      </div>



    </main>
  )
}