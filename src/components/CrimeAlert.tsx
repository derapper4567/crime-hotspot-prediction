
import React from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AlertType = 'warning' | 'info' | 'success';

interface CrimeAlertProps {
  type?: AlertType;
  title: string;
  message: string;
  timestamp?: string;
  onClose?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const CrimeAlert: React.FC<CrimeAlertProps> = ({
  type = 'info',
  title,
  message,
  timestamp,
  onClose,
  onAction,
  actionLabel,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-crime-high" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-crime-low" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-crime-high/10';
      case 'success':
        return 'bg-crime-low/10';
      default:
        return 'bg-primary/10';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return 'border-crime-high/30';
      case 'success':
        return 'border-crime-low/30';
      default:
        return 'border-primary/30';
    }
  };

  return (
    <Card className={cn(
      'border',
      getBgColor(),
      getBorderColor(),
      'animate-fade-in',
      className
    )}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-full bg-white bg-opacity-50">
              {getIcon()}
            </div>
            
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
              {timestamp && (
                <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
              )}
            </div>
          </div>
          
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {onAction && actionLabel && (
          <div className="mt-3 flex justify-end">
            <Button
              variant={type === 'warning' ? 'destructive' : 'default'}
              size="sm"
              onClick={onAction}
              className="text-xs"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CrimeAlert;
