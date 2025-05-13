
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Building2, Users, ClipboardList, LogOut, Settings, Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import logo from './logo.jpg';

const HospitalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Hospital Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <img src={logo} alt="TERO Logo" width={32} height={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold">TERO</h1>
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Hospital</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/hospital-platform"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/hospital-platform/cases"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <ClipboardList className="h-5 w-5" />
                <span>Case Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/hospital-platform/handoffs"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Users className="h-5 w-5" />
                <span>Case Handoffs</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/hospital-platform/departments"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Building2 className="h-5 w-5" />
                <span>Departments</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          {profile && (
            <div className="mb-4">
              <p className="font-medium">{profile.full_name}</p>
              <p className="text-sm text-gray-500 capitalize">Hospital Staff</p>
            </div>
          )}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-gray-700"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Hospital Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hospital Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Hospital Platform</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {profile && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {profile.full_name?.charAt(0) || 'H'}
                </div>
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
