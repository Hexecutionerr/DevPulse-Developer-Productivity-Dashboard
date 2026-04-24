import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast('3 New PRs waiting for your review!', {
      icon: '🔔',
      style: {
        borderRadius: '12px',
        background: '#1E293B',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  const handleProfileClick = () => {
    toast('Felix (Senior Developer) - Profile settings coming soon.', {
      icon: '👤',
      style: {
        borderRadius: '12px',
        background: '#2563EB',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    toast.success('Entering System Configuration Mode');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">DevPulse</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === '/'}>Dashboard</NavLink>
          <NavLink to="/team" active={location.pathname === '/team'}>Team</NavLink>
          <NavLink to="/reports" active={location.pathname === '/reports'}>Reports</NavLink>
          <button 
            onClick={handleSettingsClick}
            className={`text-sm font-bold tracking-wide transition-all ${
              location.pathname === '/settings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleNotificationClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative active:scale-90"
          >
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <div 
            onClick={handleProfileClick}
            className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all active:scale-90"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link 
    to={to} 
    className={`text-sm font-bold tracking-wide transition-all ${
      active 
      ? 'text-blue-600' 
      : 'text-gray-400 hover:text-gray-900'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
