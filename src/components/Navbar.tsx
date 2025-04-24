
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Map, Camera, LogOut, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Prediction', path: '/prediction', icon: Map },
    // { name: 'Detection', path: '/detection', icon: Camera }
    { name: 'Detection', path: 'http://localhost/detect.html', icon: Camera }

  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-crime-dark">Ulinzi Kitaa</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <TooltipProvider key={item.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.path) 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground/60 hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <UserAvatar />
          <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
