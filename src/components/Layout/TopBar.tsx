
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  MessageSquare,
  Menu 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import StatusToggle from '../StatusToggle';
import { useAuth } from '@/contexts/AuthContext';

const TopBar = () => {
  const { profile } = useAuth();
  
  return (
    <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
        <StatusToggle />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 bg-emergency text-white text-xs h-5 w-5 flex items-center justify-center p-0">
            3
          </Badge>
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Paramedic'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
