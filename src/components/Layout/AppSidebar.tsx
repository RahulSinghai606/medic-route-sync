
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Stethoscope,
  Building2,
  ClipboardList,
  Settings,
  LogOut,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "./logo.jpg";

const AppSidebar = () => {
  const { signOut, profile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emergency">
            <img
              src={logo}
              alt="Your Image Description"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-xl font-bold">TERO</h1>
          <span className="text-xs bg-emergency text-white px-2 py-0.5 rounded">Paramedic</span>
        </div>
        <div className="flex mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            <span>Languages</span>
            <div className="ml-1 flex gap-1">
              <span 
                className={`cursor-pointer px-1 ${language === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </span>
              <span className="text-muted-foreground">|</span>
              <span 
                className={`cursor-pointer px-1 ${language === 'hi' ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                onClick={() => handleLanguageChange('hi')}
              >
                HI
              </span>
              <span className="text-muted-foreground">|</span>
              <span 
                className={`cursor-pointer px-1 ${language === 'bn' ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                onClick={() => handleLanguageChange('bn')}
              >
                BN
              </span>
            </div>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span>Patients</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/assessment"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Stethoscope className="h-5 w-5" />
              <span>Assessment</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/hospitals"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Building2 className="h-5 w-5" />
              <span>Hospitals</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/cases"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <ClipboardList className="h-5 w-4" />
              <span>Cases</span>
            </NavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavLink
              to="/disaster"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Disaster Mode</span>
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-2">
          {profile && (
            <div className="mb-2 px-3 py-2">
              <p className="font-medium">{profile.full_name}</p>
              <p className="text-sm text-gray-500 capitalize">
                {profile.role || "Paramedic"}
              </p>
            </div>
          )}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 mt-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
