import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  FileText,
  Settings,
  Bell,
  Home
} from 'lucide-react';

const Navbar = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  

  // Scroll effect
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
     localStorage.removeItem('user');
     localStorage.removeItem('token');
     navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 bg-white transition-all duration-200 ${
      scrolled ? 'nav-border elevated-shadow' : 'nav-border'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Clickable to home */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#1e40af"/>
              <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
              <rect x="10" y="21" width="12" height="2" fill="white"/>
            </svg>
            <div>
              <div className="text-lg font-semibold text-slate-900 tracking-tight">eSeva</div>
              <div className="text-xs text-slate-500 -mt-0.5">Digital Certificate Portal</div>
            </div>
          </div>
          
          {/* Navigation Links - Show for non-citizens or when logged out */}
          {(!user || user.role !== 'CITIZEN') && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Services</a>
              <a href="#process" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Process</a>
              <a href="#analytics" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Analytics</a>
              <a href="#support" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">Support</a>
            </div>
          )}

          {/* Citizen Quick Links - Show only for citizens */}
          {user?.role === 'CITIZEN' && (
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate(`/citizen/dashboard/${user.id}`)}
                className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => navigate(`/citizen/my-applications/${user.id}`)}
                className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Applications</span>
              </button>
              <button 
                onClick={() => navigate(`/citizen/new-application/${user.id}`)}
                className="text-sm font-medium bg-blue-50 text-blue-700 px-4 py-1.5 rounded hover:bg-blue-100 transition-colors"
              >
                + New Application
              </button>
            </div>
          )}
          
          {/* Conditional Rendering: Auth Buttons vs Profile Menu */}
          <div className="flex items-center space-x-3">
            {!user ? (
              /* Not Logged In - Show Auth Buttons */
              <>
                <button 
                  onClick={() => navigate("/login")} 
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/signup")} 
                  className="text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded transition-colors"
                >
                  Register
                </button>
              </>
            ) : (
              /* Logged In - Show Profile Menu */
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Profile Icon with Initial */}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role?.toLowerCase().replace('_', ' ') || 'Citizen'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        {user.mobile && (
                          <p className="text-xs text-gray-500 mt-0.5">{user.mobile}</p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {/* Citizen Dashboard Link - Only for citizens */}
                        {user.role === 'CITIZEN' && (
                          <>
                            <button
                              onClick={() => {
                                navigate(`/citizen/dashboard/${user.id}`);
                                setShowProfileMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-500" />
                              <span>Dashboard</span>
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/citizen/my-applications/${user.id}`);
                                setShowProfileMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span>My Applications</span>
                            </button>
                          </>
                        )}

                        {/* Common Menu Items */}
                        <button
                          onClick={() => {
                            navigate(`citizen//profile/${user.id}`);
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Profile Settings</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate('/notifications');
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Bell className="w-4 h-4 text-gray-500" />
                          <span>Notifications</span>
                        </button>

                        <hr className="my-1 border-gray-100" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;