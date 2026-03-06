import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Zap, ShoppingBag, Bell, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/bookings/mybookings', config);
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const newNotifCount = confirmedBookings.length; // Each confirmed booking counts as a notification

  const statusConfig = {
    Confirmed: { color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/30', icon: CheckCircle },
    Pending:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock },
    Declined:  { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: XCircle },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 glass-card p-8 bg-gradient-to-r from-surface to-primary/5 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
        <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full border-2 border-primary object-cover z-10" />
        <div className="flex-1 z-10">
          <p className="text-xs text-primary font-medium tracking-widest uppercase mb-1">Gym Member</p>
          <h1 className="text-3xl font-heading text-white">WELCOME, {user.name.toUpperCase()}</h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-medium">{confirmedBookings.length} Confirmed Sessions</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">{pendingBookings.length} Pending</span>
            </div>
          </div>
        </div>

        {/* Bell notification icon */}
        <button onClick={() => setShowNotif(!showNotif)}
          className="relative z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Bell className={`w-6 h-6 ${newNotifCount > 0 ? 'text-primary' : 'text-gray-400'}`} />
          {newNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
              {newNotifCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotif && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-card border-primary/30 overflow-hidden">
            <div className="p-5 border-b border-white/10 bg-primary/5 flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-white">Booking Notifications</h3>
              <span className="ml-auto text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowNotif(false)}>Close</span>
            </div>
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {confirmedBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No confirmed sessions yet.</div>
              ) : (
                confirmedBookings.map(b => (
                  <div key={b._id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        ✅ <span className="text-secondary">{b.coachId?.name || 'Your Coach'}</span> confirmed your session!
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(b.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {b.sessionPeriod}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link to="/oracle" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all group cursor-pointer border-secondary/20 hover:border-secondary/50">
          <Zap className="w-10 h-10 text-secondary mb-3 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg font-heading text-white">AI ORACLE</h2>
          <p className="text-xs text-gray-400 mt-1">Get your AI fitness blueprint</p>
        </Link>

        <Link to="/coaches" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all group cursor-pointer hover:border-primary/50">
          <User className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg font-heading text-white">BOOK A COACH</h2>
          <p className="text-xs text-gray-400 mt-1">Browse & book a trainer</p>
        </Link>

        <Link to="/store" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all group cursor-pointer hover:border-white/20">
          <ShoppingBag className="w-10 h-10 text-gray-400 mb-3 group-hover:scale-110 transition-transform" />
          <h2 className="text-lg font-heading text-white">GYM STORE</h2>
          <p className="text-xs text-gray-400 mt-1">Supplements & training gear</p>
        </Link>
      </div>

      {/* Sessions Panel */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-surface/50 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-heading">My Training Sessions</h2>
          <span className="ml-auto text-sm text-gray-400">{bookings.length} total</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading sessions...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">You have no training sessions yet.</p>
            <Link to="/coaches" className="px-5 py-2 bg-primary text-background text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              Browse Coaches <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {bookings.map(booking => {
              const cfg = statusConfig[booking.status] || statusConfig.Pending;
              const Icon = cfg.icon;
              return (
                <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Coach: <span className="text-primary">{booking.coachId?.name || 'Unknown'}</span>
                      </p>
                      <p className="text-sm text-gray-400">{booking.coachId?.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        📅 {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        &nbsp;·&nbsp; 🕐 {booking.sessionPeriod}
                      </p>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 w-fit border ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3 h-3" />
                    {booking.status}
                    {booking.status === 'Confirmed' && ' ✓'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;
