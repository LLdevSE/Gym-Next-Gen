import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, User, Edit3, Save, Dumbbell, Sun, Moon, Sunrise } from 'lucide-react';

const CoachDashboard = () => {
  const [activeTab, setActiveTab] = useState('Sessions');
  const [bookings, setBookings] = useState([]);
  const [coachProfile, setCoachProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Form state for editing profile
  const [editForm, setEditForm] = useState({ specialization: '', bio: '', availableSessions: [] });
  const sessions = ['Morning', 'Evening', 'Night'];
  const sessionIcons = { Morning: Sunrise, Evening: Sun, Night: Moon };

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, [user]);

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

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/coaches/myprofile', config);
      setCoachProfile(data);
      setEditForm({
        specialization: data.specialization || '',
        bio: data.bio || '',
        availableSessions: data.availableSessions || [],
      });
    } catch (error) {
      console.error('Failed to fetch coach profile', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleToggleSession = (session) => {
    setEditForm(prev => ({
      ...prev,
      availableSessions: prev.availableSessions.includes(session)
        ? prev.availableSessions.filter(s => s !== session)
        : [...prev.availableSessions, session],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put('/api/coaches/profile', editForm, config);
      setCoachProfile(data);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/bookings/${id}/status`, { status }, config);
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">

      {/* Header Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 glass-card p-8 bg-gradient-to-r from-surface to-secondary/5 border-secondary/20">
        <img src={user.profileImage} alt="" className="w-24 h-24 rounded-full border-2 border-secondary object-cover" />
        <div className="flex-1">
          <h1 className="text-3xl font-heading text-white">COACH HQ: {user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
          {coachProfile && (
            <div className="flex gap-3 mt-3 flex-wrap">
              <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full border border-secondary/30">
                {coachProfile.specialization}
              </span>
              {coachProfile.availableSessions?.map(s => (
                <span key={s} className="px-3 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10">{s}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-secondary">{confirmedCount}</p>
            <p className="text-xs text-gray-400">Confirmed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface/50 p-1 rounded-xl border border-white/5 w-fit">
        {['Sessions', 'My Profile'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab
                ? 'bg-secondary/20 text-secondary shadow-[0_0_10px_rgba(79,172,254,0.2)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'Sessions' ? <Calendar className="w-4 h-4" /> : <User className="w-4 h-4" />}
            {tab}
            {tab === 'Sessions' && pendingCount > 0 && (
              <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">

        {/* Sessions Tab */}
        {activeTab === 'Sessions' && (
          <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-surface/50 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-heading">Session Requests</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading sessions...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No session requests yet. Customers will book you from the Coach Directory.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {bookings.map(booking => (
                  <div key={booking._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{booking.customerId?.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-400">{booking.customerId?.email}</p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          📅 {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} &nbsp;·&nbsp; 🕐 {booking.sessionPeriod}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide font-medium
                        ${booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          booking.status === 'Confirmed' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {booking.status}
                      </span>

                      {booking.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(booking._id, 'Confirmed')}
                            className="p-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full transition-colors" title="Confirm Booking">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => updateStatus(booking._id, 'Declined')}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-full transition-colors" title="Decline Booking">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Profile Tab */}
        {activeTab === 'My Profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-surface/50 flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-heading">Edit Coach Profile</h2>
            </div>

            {profileLoading ? (
              <div className="p-8 text-center text-gray-400">Loading your profile...</div>
            ) : (
              <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-widest">Specialization</label>
                  <select value={editForm.specialization}
                    onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-secondary">
                    <option>Strength</option>
                    <option>Yoga</option>
                    <option>HIIT</option>
                    <option>Cardio</option>
                    <option>General Fitness</option>
                    <option>Nutrition</option>
                    <option>Martial Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-widest">Your Bio</label>
                  <textarea rows={5} value={editForm.bio}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell members about your training philosophy, experience, and achievements..."
                    className="w-full bg-surface/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-secondary resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-widest">Available Sessions</label>
                  <div className="flex gap-4">
                    {sessions.map(s => {
                      const Icon = sessionIcons[s];
                      const active = editForm.availableSessions.includes(s);
                      return (
                        <button key={s} type="button" onClick={() => handleToggleSession(s)}
                          className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                            active
                              ? 'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_12px_rgba(79,172,254,0.2)]'
                              : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'
                          }`}>
                          <Icon className="w-6 h-6" />
                          <span className="text-sm font-medium">{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button type="submit" disabled={saving}
                    className="px-8 py-3 bg-secondary text-background font-bold rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoachDashboard;
