import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Activity className="w-6 h-6" />
            <span className="font-heading text-xl tracking-wider">GYM NEXT GEN</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                  {user.role === 'Admin' && <Link to="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link>}
                  {user.role === 'Coach' && <Link to="/coach" className="hover:text-primary transition-colors">Coach Dashboard</Link>}
                  {user.role === 'Customer' && (
                    <>
                      <Link to="/store" className="hover:text-primary transition-colors">Store</Link>
                      <Link to="/oracle" className="text-secondary hover:text-secondary/80 transition-colors">AI Oracle</Link>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="flex items-center gap-2">
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50" />
                    <span className="text-sm font-medium hidden md:block">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
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
