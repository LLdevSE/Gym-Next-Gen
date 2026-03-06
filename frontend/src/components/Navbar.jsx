import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard, Users, ShoppingBag, Zap, Shield, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dashboard link per role
  const dashboardPath = user?.role === 'Admin'
    ? '/admin'
    : user?.role === 'Coach'
    ? '/coach'
    : '/customer';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Activity className="w-6 h-6" />
            <span className="font-heading text-xl tracking-wider">GYM NEXT GEN</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-1 text-sm font-medium">

                  {/* Dashboard - all roles */}
                  <Link to={dashboardPath}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {/* Customer links */}
                  {user.role === 'Customer' && (
                    <>
                      <Link to="/coaches"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all">
                        <Dumbbell className="w-4 h-4" />
                        Coaches
                      </Link>
                      <Link to="/store"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all">
                        <ShoppingBag className="w-4 h-4" />
                        Store
                      </Link>
                      <Link to="/oracle"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-secondary hover:text-secondary/80 hover:bg-secondary/5 transition-all">
                        <Zap className="w-4 h-4" />
                        AI Oracle
                      </Link>
                    </>
                  )}

                  {/* Coach links */}
                  {user.role === 'Coach' && (
                    <Link to="/coaches"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all">
                      <Users className="w-4 h-4" />
                      Coach Directory
                    </Link>
                  )}

                  {/* Admin links */}
                  {user.role === 'Admin' && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                      <Shield className="w-3.5 h-3.5" />
                      Admin Mode
                    </span>
                  )}
                </div>

                {/* User info + logout */}
                <div className="flex items-center gap-3 border-l border-white/10 pl-5">
                  <Link to={dashboardPath} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
                    <span className="text-sm font-medium hidden md:block text-white">{user.name}</span>
                  </Link>
                  <button onClick={handleLogout} title="Log out"
                    className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
