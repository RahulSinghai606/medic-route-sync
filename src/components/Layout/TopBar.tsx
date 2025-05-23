
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import StatusToggle from '../StatusToggle';
import ThemeToggle from '../ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const TopBar = () => {
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const { language, setLanguage, t } = useLanguage();
  
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' }
  ];

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
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <StatusToggle />
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Languages</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-popover">
            <DropdownMenuLabel>{t('language.select')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => setLanguage(lang.code as Language)}
                className={`${language === lang.code ? "bg-accent" : ""} cursor-pointer`}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative hidden md:block">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
            3
          </Badge>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{t('paramedic')}</p>
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
