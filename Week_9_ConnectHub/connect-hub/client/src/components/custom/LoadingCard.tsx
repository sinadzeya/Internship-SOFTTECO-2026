import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Loader2 } from 'lucide-react';

interface LoadingCardProps {
  description?: string;
}

export function LoadingCard({
                              description = 'Loading data...',
                            }: LoadingCardProps) {
  return (
    <div data-layout="page-center">
      <Card data-layout="elements-full-width">
        <CardHeader>
          <CardTitle>ConnectHub</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    </div>
  );
}