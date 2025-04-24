
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

interface AvatarSelectorProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  userName: string;
}

const AvatarSelector = ({ selectedIndex, onSelect, userName }: AvatarSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-4 max-w-sm mx-auto">
      {avatarStyles.map((style, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className="relative"
        >
          <Avatar className={cn(
            "w-12 h-12 border-2",
            selectedIndex === index ? "border-primary" : "border-transparent",
            "hover:border-primary/50 transition-colors"
          )}>
            <AvatarFallback className={cn(style.bg, style.text)}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          {selectedIndex === index && (
            <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default AvatarSelector;
