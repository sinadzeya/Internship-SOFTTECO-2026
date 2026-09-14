import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';

interface StatusAlertProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

export function StatusAlert({
                              title,
                              description,
                              variant = 'default',
                              icon,
                            }: StatusAlertProps) {
  const IconToRender = icon || (variant === 'destructive' ? <AlertCircle /> : <Info />);

  return (
    <Alert variant={variant}>
      {IconToRender}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}