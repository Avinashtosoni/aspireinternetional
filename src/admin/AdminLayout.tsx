import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, MessageSquare, LogOut, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check real Supabase session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // navigate and state update are handled by the onAuthStateChange listener or manually
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (isAuthenticated === null) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated && location.pathname !== '/admin/login') return <Navigate to="/admin/login" replace />;
  if (isAuthenticated && location.pathname === '/admin/login') return <Navigate to="/admin" replace />;

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Manage Team', icon: Users, path: '/admin/team' },
    { label: 'Facilities', icon: Building2, path: '/admin/facilities' },
    { label: 'Notices', icon: MessageSquare, path: '/admin/notices' },
    { label: 'Events', icon: Building2, path: '/admin/events' },
    { label: 'Blogs/News', icon: LayoutDashboard, path: '/admin/blogs' },
    { label: 'Testimonials', icon: Users, path: '/admin/testimonials' },
    { label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-indigo-400">Aspire CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find((n) => n.path === location.pathname)?.label || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Logged in as <strong>Admin</strong></span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
