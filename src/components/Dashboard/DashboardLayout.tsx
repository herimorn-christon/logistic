import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  Truck, 
  Navigation, 
  Package, 
  Users, 
  Wrench, 
  Fuel, 
  UserCheck, 
  MessageSquare,
  BarChart3,
  FileText,
  Shield,
  MapPin,
  DollarSign,
  Calendar,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  Leaf
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Fleet Management', href: '/fleet', icon: Truck },
    { name: 'Route Optimization', href: '/routes', icon: Navigation },
    { name: 'Deliveries', href: '/deliveries', icon: Package },
    { name: 'Drivers', href: '/drivers', icon: Users },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Cargo Monitoring', href: '/cargo', icon: Package },
    { name: 'Fuel Management', href: '/fuel', icon: Fuel },
    { name: 'Customer Management', href: '/customers', icon: UserCheck },
    { name: 'AI Assistant', href: '/chatbot', icon: MessageSquare },
    { name: 'Pricing Engine', href: '/pricing', icon: DollarSign },
    { name: 'Geo-Fencing', href: '/geofencing', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Tracking', href: '/tracking', icon: MapPin },
    { name: 'Contracts', href: '/contracts', icon: FileText },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Invoices', href: '/invoices', icon: DollarSign },
    { name: 'Compliance', href: '/compliance', icon: Shield },
    { name: 'Cold Chain', href: '/coldchain', icon: Package },
    { name: 'Forecasting', href: '/forecasting', icon: BarChart3 },
    { name: 'Integrations', href: '/integrations', icon: Settings },
    { name: 'Sustainability', href: '/sustainability', icon: Leaf },
    { name: 'Roles & Permissions', href: '/roles', icon: Shield },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FleetForge</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="mt-4 px-4 space-y-1 max-h-screen overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-white shadow-sm border-r">
          <div className="flex items-center p-4 border-b">
            <Truck className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FleetForge</span>
          </div>
          <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;