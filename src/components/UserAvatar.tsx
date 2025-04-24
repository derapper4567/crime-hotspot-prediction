
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserAvatarProps {
  imageUrl?: string;
  userName?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  imageUrl = '/placeholder.svg', 
  userName = 'User'
}) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLogout = () => {
    // For now, just navigate to login page
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border-2 border-primary transition-all hover:border-primary/80">
          <AvatarImage 
            src={imageUrl} 
            className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
            onLoad={() => setIsLoaded(true)}
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
