
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users, ClipboardList, LogOut, Settings, Bell, Home, BedDouble, ListChecks, Activity, ChevronDown, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import logo from './logo.jpg';

const HospitalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950">
      {/* Hospital Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <img src={logo} alt="TERO Logo" width={32} height={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold">TERO</h1>
              <div className="flex items-center">
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Hospital</span>
                <span className="text-xs text-muted-foreground ml-1">Platform</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
          </div>
        </div>
        
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground px-3 py-2">Main</p>
          <NavLink
            to="/hospital-platform"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/hospital-platform/cases"
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive || location.pathname.includes('/cases')
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5" />
              <span>Case Management</span>
            </div>
            <Badge variant="outline" className="text-xs">3</Badge>
          </NavLink>
          <NavLink
            to="/hospital-platform/handoffs"
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <span>Case Handoffs</span>
            </div>
            <Badge variant="outline" className="text-xs">7</Badge>
          </NavLink>
          <NavLink
            to="/hospital-platform/departments"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600"
              }`
            }
          >
            <Building2 className="h-5 w-5" />
            <span>Departments</span>
          </NavLink>

          <p className="text-xs font-medium text-muted-foreground px-3 py-2 mt-6">Hospital Operations</p>
          <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <BedDouble className="h-5 w-5" />
              <span>Bed Management</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <ListChecks className="h-5 w-5" />
              <span>Resource Allocation</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5" />
              <span>Analytics</span>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">New</Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              <span>Ambulance Tracking</span>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t dark:border-gray-800 mt-auto">
          {profile && (
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent flex items-center gap-2 text-left">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {profile.full_name?.charAt(0)?.toUpperCase() || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">Hospital Staff</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>
      
      {/* Hospital Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hospital Header */}
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Hospital Platform</h2>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">New Incoming Case</p>
                      <span className="text-xs text-muted-foreground">10m ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Critical cardiac case arriving in 5 minutes</p>
                  </div>
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">ICU Alert</p>
                      <span className="text-xs text-muted-foreground">25m ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Only 1 ICU bed remaining. Prioritize cases.</p>
                  </div>
                  <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">Shift Change Reminder</p>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">ED shift change at 19:00. Complete handoffs.</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {profile && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline-block">{profile.full_name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {profile.full_name?.charAt(0)?.toUpperCase() || 'H'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </header>
        
        {/* Hospital Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;
