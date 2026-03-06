import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, UserX, CheckCircle, Trash2, Edit3, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '../ImageUpload';

const INPUT = "w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary transition-colors";
const INPUT_SEC = "w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-secondary transition-colors";

const UserManager = ({ token }) => {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeUserTab, setActiveUserTab] = useState('Customer');

  // ── Create modal ──────────────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', email: '', password: '', role: 'Customer', profileImage: ''
  });

  // ── Edit Member modal ──────────────────────────────────────
  const [showMemberModal, setShowMemberModal]   = useState(false);
  const [editingMember, setEditingMember]       = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '', email: '', profileImage: '', membershipStatus: 'Active'
  });

  // ── Edit Coach modal ───────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoach, setEditingCoach]  = useState(null);
  const [editForm, setEditForm] = useState({
    specialization: '', bio: '', availableSessions: [], profileImage: ''
  });

  const sessions = ['Morning', 'Evening', 'Night'];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Create User ────────────────────────────────────────────
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/admin-create', createForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newUser = {
        ...data,
        profileImage: createForm.profileImage ||
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
      };
      setUsers([...users, newUser]);
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'Customer', profileImage: '' });
    } catch (err) { alert(err.response?.data?.message || 'Failed to create user'); }
  };

  // ── Edit Member ────────────────────────────────────────────
  const openEditMember = (user) => {
    setEditingMember(user);
    setMemberForm({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '',
      membershipStatus: user.membershipStatus || 'Active',
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/users/${editingMember._id}`, memberForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === data._id ? { ...u, ...data } : u));
      setShowMemberModal(false);
      setEditingMember(null);
    } catch (err) { alert(err.response?.data?.message || 'Failed to update member'); }
  };

  // ── Edit Coach ─────────────────────────────────────────────
  const openEditCoach = async (user) => {
    try {
      const { data: coaches } = await axios.get('/api/coaches');
      const cp = coaches.find(c => c.user?._id === user._id || c.user === user._id);
      if (cp) {
        setEditingCoach({ userId: user._id, coachProfileId: cp._id, name: user.name });
        setEditForm({
          specialization:    cp.specialization    || '',
          bio:               cp.bio               || '',
          availableSessions: cp.availableSessions || [],
          profileImage:      user.profileImage    || '',
        });
        setShowEditModal(true);
      } else {
        alert('No Coach Profile found. It may not have been created yet.');
      }
    } catch (err) { alert('Failed to fetch coach profile'); }
  };

  const handleToggleSession = (s) => setEditForm(prev => ({
    ...prev,
    availableSessions: prev.availableSessions.includes(s)
      ? prev.availableSessions.filter(x => x !== s)
      : [...prev.availableSessions, s]
  }));

  const handleSaveCoach = async (e) => {
    e.preventDefault();
    try {
      // Update coach profile (specialization, bio, sessions)
      await axios.put(`/api/coaches/admin/${editingCoach.coachProfileId}`,
        { specialization: editForm.specialization, bio: editForm.bio, availableSessions: editForm.availableSessions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update profile image on the User record
      if (editForm.profileImage) {
        await axios.put(`/api/users/${editingCoach.userId}`,
          { profileImage: editForm.profileImage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.map(u => u._id === editingCoach.userId
          ? { ...u, profileImage: editForm.profileImage } : u));
      }
      setShowEditModal(false);
      alert(`Coach profile for ${editingCoach.name} updated!`);
    } catch (err) { alert(err.response?.data?.message || 'Failed to update coach profile'); }
  };

  // ── Status toggle ──────────────────────────────────────────
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
      await axios.put(`/api/users/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === id ? { ...u, membershipStatus: newStatus } : u));
    } catch { alert('Failed to update status'); }
  };

  // ── Delete ─────────────────────────────────────────────────
  const deleteUser = async (id, role) => {
    if (!window.confirm(`Permanently delete this ${role}? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u._id !== id));
    } catch { alert('Failed to delete user'); }
  };

  const displayedUsers = users.filter(u => u.role === activeUserTab);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading User Directory...</div>;

  return (
    <div className="space-y-0">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface/50 p-6 rounded-t-xl border-b border-white/10 gap-4">
        <div className="flex gap-1 bg-background p-1 rounded-lg border border-white/5">
          <button onClick={() => setActiveUserTab('Customer')}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors ${activeUserTab === 'Customer' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}>
            Members ({users.filter(u => u.role === 'Customer').length})
          </button>
          <button onClick={() => setActiveUserTab('Coach')}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors ${activeUserTab === 'Coach' ? 'bg-secondary/20 text-secondary' : 'text-gray-400 hover:text-white'}`}>
            Coaches ({users.filter(u => u.role === 'Coach').length})
          </button>
        </div>
        <button onClick={() => setShowCreateModal(true)}
          className="bg-primary text-background font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-[0_0_10px_rgba(0,242,254,0.3)]">
          <Plus className="w-4 h-4" /> Add {activeUserTab === 'Coach' ? 'Coach' : 'Member'}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">{activeUserTab === 'Coach' ? 'Specialization' : 'Status'}</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedUsers.map(u => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={u.profileImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                      alt="" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div>
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide
                      ${u.role === 'Coach' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.role === 'Customer' && (
                    <button onClick={() => toggleStatus(u._id, u.membershipStatus)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors
                        ${(u.membershipStatus === 'Active' || !u.membershipStatus)
                          ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
                          : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'}`}>
                      {(u.membershipStatus === 'Active' || !u.membershipStatus) ? <CheckCircle className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {u.membershipStatus || 'Active'}
                    </button>
                  )}
                  {u.role === 'Coach' && (
                    <span className="text-gray-400 text-sm italic">Click Edit to manage</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Edit button — Members & Coaches */}
                    <button
                      onClick={() => u.role === 'Coach' ? openEditCoach(u) : openEditMember(u)}
                      className={`p-2 rounded transition-colors ${u.role === 'Coach'
                        ? 'text-secondary hover:bg-secondary/10'
                        : 'text-primary hover:bg-primary/10'}`}
                      title={u.role === 'Coach' ? 'Edit Coach Profile' : 'Edit Member'}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteUser(u._id, u.role)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {displayedUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                  No {activeUserTab === 'Coach' ? 'Coaches' : 'Members'} found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Create User Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="glass-card w-full max-w-md border-primary/30 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-surface/50">
                <h2 className="text-xl font-heading text-white">Create New User</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                {/* Profile image preview */}
                <ImageUpload
                  currentImage={createForm.profileImage}
                  onUpload={url => setCreateForm({ ...createForm, profileImage: url })}
                  token={token}
                  size="md" />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Full Name</label>
                  <input type="text" required value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                    className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Email Address</label>
                  <input type="email" required value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Temporary Password</label>
                  <input type="password" required value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                    className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">System Role</label>
                  <select required value={createForm.role}
                    onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                    className={INPUT}>
                    <option value="Customer">Gym Member (Customer)</option>
                    <option value="Coach">Trainer (Coach)</option>
                  </select>
                  {createForm.role === 'Coach' && (
                    <p className="text-[10px] text-secondary mt-1">* A default Coach Profile will be auto-generated.</p>
                  )}
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors">Cancel</button>
                  <button type="submit"
                    className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Provision User
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Member Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showMemberModal && editingMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="glass-card w-full max-w-md border-primary/30 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-surface/50">
                <div>
                  <h2 className="text-xl font-heading text-white">Edit Member</h2>
                  <p className="text-xs text-gray-400 mt-1">{editingMember.email}</p>
                </div>
                <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveMember} className="p-6 space-y-4">
                <ImageUpload
                  currentImage={memberForm.profileImage}
                  onUpload={url => setMemberForm({ ...memberForm, profileImage: url })}
                  token={token}
                  size="md" />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Full Name</label>
                  <input type="text" required value={memberForm.name}
                    onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                    className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Email Address</label>
                  <input type="email" required value={memberForm.email}
                    onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                    className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Membership Status</label>
                  <select value={memberForm.membershipStatus}
                    onChange={e => setMemberForm({ ...memberForm, membershipStatus: e.target.value })}
                    className={INPUT}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowMemberModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors">Cancel</button>
                  <button type="submit"
                    className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Coach Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showEditModal && editingCoach && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="glass-card w-full max-w-lg border-secondary/30 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-surface/50">
                <div>
                  <h2 className="text-xl font-heading text-white">Edit Coach Profile</h2>
                  <p className="text-xs text-gray-400 mt-1">{editingCoach.name}</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSaveCoach} className="p-6 space-y-4">
                {/* Profile image */}
                <ImageUpload
                  currentImage={editForm.profileImage}
                  onUpload={url => setEditForm({ ...editForm, profileImage: url })}
                  token={token}
                  size="md" />
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Specialization</label>
                  <select value={editForm.specialization}
                    onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
                    className={INPUT_SEC}>
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
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Coach Bio</label>
                  <textarea required rows={4} value={editForm.bio}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Write a short bio for this coach..."
                    className={`${INPUT_SEC} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">Available Sessions</label>
                  <div className="flex gap-3">
                    {sessions.map(s => (
                      <button key={s} type="button" onClick={() => handleToggleSession(s)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          editForm.availableSessions.includes(s)
                            ? 'bg-secondary/20 text-secondary border-secondary/50'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button type="button" onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors">Cancel</button>
                  <button type="submit"
                    className="px-6 py-2 bg-secondary text-background font-bold rounded hover:bg-secondary/90 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserManager;
