import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, Star, Clock, X } from 'lucide-react';

const CoachDirectory = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSpec, setFilterSpec] = useState('All');
  const [selectedCoach, setSelectedCoach] = useState(null); // For Booking Modal
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data } = await axios.get('/api/coaches');
        setCoaches(data);
      } catch (error) {
        console.error('Failed to fetch coaches', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  const filteredCoaches = filterSpec === 'All' 
     ? coaches 
     : coaches.filter(c => c.specialization === filterSpec);

  if (loading) return <div className="text-center py-20 text-primary animate-pulse">Scanning Coach Database...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Users className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-heading text-white uppercase tracking-wide">Elite Coach Directory</h1>
            <p className="text-muted-foreground">Select your mentor. Elevate your potential.</p>
          </div>
        </div>

        <div className="relative w-full md:w-auto">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <select 
             className="w-full md:w-64 bg-surface border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
             value={filterSpec}
             onChange={(e) => setFilterSpec(e.target.value)}
           >
              <option value="All">All Specializations</option>
              <option value="Strength">Strength & Hypertrophy</option>
              <option value="CrossFit">CrossFit & Conditioning</option>
              <option value="Yoga">Yoga & Mobility</option>
              <option value="HIIT">HIIT & fat Loss</option>
           </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredCoaches.map(coach => (
            <motion.div 
               whileHover={{ y: -5 }}
               key={coach._id}
               className="glass-card p-6 flex flex-col group h-full"
            >
               <div className="flex items-start gap-4 mb-4">
                  <img src={coach.user?.profileImage || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="" className="w-16 h-16 rounded-full border-2 border-white/10 group-hover:border-primary transition-colors" />
                  <div>
                     <h3 className="text-xl font-heading text-white">{coach.user?.name}</h3>
                     <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{coach.specialization}</span>
                  </div>
               </div>
               
               <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-3">{coach.bio}</p>
               
               <div className="flex flex-wrap gap-2 mb-6">
                  {coach.availableSessions.map(session => (
                     <span key={session} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {session}
                     </span>
                  ))}
               </div>
               
               <button 
                  onClick={() => setSelectedCoach(coach)}
                  className="w-full py-3 bg-white/5 hover:bg-primary/20 hover:text-primary text-white border border-white/10 hover:border-primary/50 transition-all rounded-lg font-medium tracking-wide flex justify-center items-center gap-2"
               >
                  <Star className="w-4 h-4" /> Book Session
               </button>
            </motion.div>
         ))}
      </div>

      {filteredCoaches.length === 0 && (
         <div className="text-center py-20 text-gray-400">No coaches found matching this specialization.</div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
         {selectedCoach && (
            <BookingModal 
               coach={selectedCoach} 
               onClose={() => setSelectedCoach(null)} 
               userToken={user?.token} 
            />
         )}
      </AnimatePresence>

    </motion.div>
  );
};

// Internal Modal Component for booking
const BookingModal = ({ coach, onClose, userToken }) => {
   const [date, setDate] = useState('');
   const [sessionPeriod, setSessionPeriod] = useState(coach.availableSessions[0] || 'Morning');
   const [submitting, setSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);

   const handleBook = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      if (!userToken) {
         alert('You must be logged in as a Customer to book a session.');
         setSubmitting(false);
         return;
      }
      
      try {
         const config = { headers: { Authorization: `Bearer ${userToken}` } };
         await axios.post('/api/bookings', {
            coachId: coach.user._id,
            sessionPeriod,
            date
         }, config);
         setSuccess(true);
      } catch (error) {
         alert(error.response?.data?.message || 'Failed to book session');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
         <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="glass-card p-6 md:p-8 w-full max-w-md relative border-primary/30"
         >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
               <X className="w-6 h-6" />
            </button>

            {success ? (
               <div className="text-center py-8">
                  <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                     <Star className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading text-white mb-2">Booking Requested!</h3>
                  <p className="text-gray-400 text-sm">Coach {coach.user.name} will review your request shortly. Check your dashboard for status updates.</p>
                  <button onClick={onClose} className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-sm">Close Window</button>
               </div>
            ) : (
               <>
                  <h2 className="text-2xl font-heading text-white mb-6 pr-8">Book Session with {coach.user.name}</h2>
                  
                  <form onSubmit={handleBook} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Select Date</label>
                        <input 
                           type="date" required 
                           min={new Date().toISOString().split('T')[0]}
                           className="w-full bg-surface/50 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-primary"
                           value={date} onChange={e => setDate(e.target.value)}
                        />
                     </div>
                     
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Select Time Slot</label>
                        <select 
                           className="w-full bg-surface/50 border border-white/10 rounded py-3 px-4 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                           value={sessionPeriod} onChange={e => setSessionPeriod(e.target.value)}
                        >
                           {coach.availableSessions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>

                     <button 
                        type="submit" disabled={submitting}
                        className="w-full mt-4 py-3 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)] disabled:opacity-50"
                     >
                        {submitting ? 'PROCESSING...' : 'CONFIRM REQUEST'}
                     </button>
                  </form>
               </>
            )}
         </motion.div>
      </motion.div>
   );
};

export default CoachDirectory;
