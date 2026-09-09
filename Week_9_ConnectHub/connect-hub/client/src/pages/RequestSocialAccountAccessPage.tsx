import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@/store/useStore.ts';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';


export function  RequestSocialAccountAccessPage() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

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
        RequestSocialAccountAccessPage - {id}
      </div>


    </main>
  )
}