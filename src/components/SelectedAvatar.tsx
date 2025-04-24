
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const avatarStyles = [
  { bg: 'bg-primary/10', text: 'text-primary' },
  { bg: 'bg-purple-100', text: 'text-purple-500' },
  { bg: 'bg-blue-100', text: 'text-blue-500' },
  { bg: 'bg-green-100', text: 'text-green-500' },
  { bg: 'bg-yellow-100', text: 'text-yellow-500' },
  { bg: 'bg-red-100', text: 'text-red-500' },
  { bg: 'bg-pink-100', text: 'text-pink-500' },
  { bg: 'bg-orange-100', text: 'text-orange-500' },
  { bg: 'bg-teal-100', text: 'text-teal-500' },
  { bg: 'bg-cyan-100', text: 'text-cyan-500' },
  { bg: 'bg-indigo-100', text: 'text-indigo-500' },
  { bg: 'bg-violet-100', text: 'text-violet-500' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-500' },
  { bg: 'bg-rose-100', text: 'text-rose-500' },
  { bg: 'bg-lime-100', text: 'text-lime-500' },
];

interface SelectedAvatarProps {
  selectedIndex: number;
  userName: string;
  className?: string;
}

const SelectedAvatar = ({ selectedIndex, userName, className }: SelectedAvatarProps) => {
  const style = avatarStyles[selectedIndex];
  
  return (
    <Avatar className={cn("w-24 h-24 border-4 border-white shadow-lg", className)}>
      <AvatarFallback className={cn(style.bg, style.text)}>
        {userName ? userName.charAt(0).toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
  );
};

export default SelectedAvatar;
