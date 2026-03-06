import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const CoachDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/bookings/coachbookings', config);
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const updateStatus = async (id, status) => {
     try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/bookings/${id}/status`, { status }, config);
        // Optimistically update UI
        setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
     } catch(error) {
        alert('Failed to update status');
     }
  }

  if (loading) return <div className="text-center py-10">Loading Coach Data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-6 glass-card p-8">
         <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full border-2 border-primary" />
         <div>
            <h1 className="text-3xl font-heading text-white">COACH HQ: {user.name}</h1>
            <p className="text-muted-foreground mt-2">Manage your upcoming training sessions</p>
         </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-surface/50 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-heading">Session Requests</h2>
        </div>
        
        {bookings.length === 0 ? (
           <div className="p-8 text-center text-gray-500">No session requests currently.</div>
        ) : (
           <div className="divide-y divide-white/5">
              {bookings.map(booking => (
                 <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div>
                       <p className="font-medium text-lg">{booking.customerId?.name || 'Unknown User'}</p>
                       <p className="text-sm text-gray-400">Date: {new Date(booking.date).toLocaleDateString()} | Slot: {booking.sessionPeriod}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-xs uppercase
                          ${booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                            booking.status === 'Confirmed' ? 'bg-secondary/20 text-secondary' : 
                            'bg-red-500/20 text-red-400'}`}>
                          {booking.status}
                       </span>

                       {booking.status === 'Pending' && (
                          <div className="flex gap-2">
                             <button onClick={() => updateStatus(booking._id, 'Confirmed')} className="p-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full transition-colors" title="Confirm">
                                <CheckCircle className="w-5 h-5" />
                             </button>
                             <button onClick={() => updateStatus(booking._id, 'Declined')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors" title="Decline">
                                <XCircle className="w-5 h-5" />
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </motion.div>
  );
};

export default CoachDashboard;
