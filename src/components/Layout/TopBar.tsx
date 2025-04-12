
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, MessageSquare, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarContext } from '@/components/ui/sidebar';
import StatusToggle from '../StatusToggle';

const TopBar = () => {
  const { user } = useAuth();
  const { isOpen, toggle } = useSidebarContext();
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          className="mr-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <div className="h-8 w-8 bg-emergency rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold">TERO</h1>
            <p className="text-xs text-muted-foreground">Triage and Emergency Routing Optimization</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <StatusToggle />
        
        <div className="relative hidden md:block">
          <Bell className="h-5 w-5 text-gray-600" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Paramedic</p>
          </div>
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
