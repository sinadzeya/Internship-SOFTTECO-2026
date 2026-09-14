import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';

export function BackButtonHeader() {
  const navigate = useNavigate();

  return (
    <header data-layout="top-left-nav">
      <div data-layout="actions-cluster">
        <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft data-layout="icon-leading" />
          Back
        </Button>
      </div>
    </header>
  );
}