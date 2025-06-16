
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Globe, Contrast, VolumeX } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

const TopBar = () => {
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const { language, setLanguage, t } = useLanguage();
  const [highContrast, setHighContrast] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  React.useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2 lg:hidden"
          aria-label={t('toggle.sidebar')}
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
      
      <div className="flex items-center gap-2">
        <StatusToggle />
        
        {/* Accessibility Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1" aria-label="Accessibility Options">
              <Contrast className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-popover">
            <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm">High Contrast</span>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm">Sound Alerts</span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Enhanced Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 min-w-[100px]" aria-label="Select Language">
              <span className="text-lg">{currentLanguage?.flag}</span>
              <span className="hidden sm:inline text-xs font-medium">{currentLanguage?.name}</span>
              <Globe className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-popover">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('language.select')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => setLanguage(lang.code as Language)}
                className={`${language === lang.code ? "bg-accent font-medium" : ""} cursor-pointer flex items-center gap-3`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ThemeToggle />
        
        <div className="relative hidden md:block">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
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
