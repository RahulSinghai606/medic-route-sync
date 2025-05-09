
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import StatusToggle from '../StatusToggle';
import ThemeToggle from '../ThemeToggle';

const TopBar = () => {
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
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
        
        <ThemeToggle />
        
        <div className="relative hidden md:block">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Paramedic</p>
          </div>
          <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
