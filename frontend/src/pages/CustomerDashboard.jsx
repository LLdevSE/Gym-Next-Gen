import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, User, Zap, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-center py-10">Loading User Profile...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row items-center gap-6 glass-card p-8 bg-gradient-to-r from-surface to-primary/5 border-primary/20">
         <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full border-2 border-primary" />
         <div>
            <h1 className="text-3xl font-heading text-white">WELCOME, {user.name}</h1>
            <p className="text-primary font-medium tracking-wide">STATUS: ACTIVE MEMBERSHIP</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Link to="/oracle" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group cursor-pointer border-secondary/20">
            <Zap className="w-12 h-12 text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-heading text-white">NEXTGEN AI ORACLE</h2>
            <p className="text-sm text-muted-foreground mt-2">Generate your personalized fitness & meal blueprint.</p>
         </Link>
         
         <Link to="/store" className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group cursor-pointer">
            <ShoppingBag className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-heading text-white">GYM STORE</h2>
            <p className="text-sm text-muted-foreground mt-2">Browse elite supplements and training gear.</p>
         </Link>
      </div>

      <div className="glass-card overflow-hidden mt-8">
        <div className="p-6 border-b border-white/10 bg-surface/50 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-white" />
          <h2 className="text-xl font-heading">My Training Sessions</h2>
        </div>
        
        {bookings.length === 0 ? (
           <div className="p-8 text-center text-gray-500">You have no upcoming sessions scheduled.</div>
        ) : (
           <div className="divide-y divide-white/5">
              {bookings.map(booking => (
                 <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="p-3 rounded-full bg-white/5">
                          <User className="w-6 h-6 text-gray-400" />
                       </div>
                       <div>
                          <p className="font-medium text-lg">Coach: {booking.coachId?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-400">Date: {new Date(booking.date).toLocaleDateString()} | Slot: {booking.sessionPeriod}</p>
                       </div>
                    </div>
                    
                    <span className={`px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                       ${booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                         booking.status === 'Confirmed' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 
                         'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                       {booking.status}
                    </span>
                 </div>
              ))}
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;
