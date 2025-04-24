
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, AlertTriangle, CheckCircle, Shield, Info } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'alert' | 'notification' | 'system' | 'success';
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMarkAsRead,
  onDelete,
  onClearAll
}) => {
  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-crime-high" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-crime-low" />;
      case 'system':
        return <Shield className="h-5 w-5 text-crime-dark" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBgColor = (type: Message['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-crime-high/10';
      case 'success':
        return 'bg-crime-low/10';
      case 'system':
        return 'bg-crime-dark/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Messages</h3>
          {messages.filter(m => !m.read).length > 0 && (
            <Badge className="ml-2 bg-primary">
              {messages.filter(m => !m.read).length} new
            </Badge>
          )}
        </div>
        
        {messages.length > 0 && onClearAll && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map(message => (
              <Card 
                key={message.id} 
                className={`p-3 relative ${!message.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${getBgColor(message.type)}`}>
                    {getIcon(message.type)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                      
                      <div className="flex space-x-2">
                        {!message.read && onMarkAsRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => onMarkAsRead(message.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs text-crime-high hover:text-crime-high/80 hover:bg-crime-high/10"
                            onClick={() => onDelete(message.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!message.read && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full m-2" />
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Bell className="h-10 w-10 text-muted-foreground opacity-20 mb-2" />
            <h4 className="font-medium">No messages</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You don't have any messages yet
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MessageList;
