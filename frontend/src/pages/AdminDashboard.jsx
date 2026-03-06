import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, Dumbbell, Store, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
         const config = {
           headers: {
             Authorization: `Bearer ${user.token}`,
           },
         };
         const { data } = await axios.get('/api/users', config);
         setUsers(data);
      } catch (error) {
         console.error('Failed to fetch users', error);
      } finally {
         setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading Admin Secure Data...</div>;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <ShieldAlert className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-heading text-white">ADMINISTRATOR OVERRIDE</h1>
          <p className="text-muted-foreground">Manage your gym facility and application ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-4 text-primary">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-heading">Total Users</h2>
           </div>
           <p className="text-4xl font-bold">{users.length}</p>
        </div>
        
        <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-4 text-secondary">
              <Dumbbell className="w-6 h-6" />
              <h2 className="text-xl font-heading">Active Coaches</h2>
           </div>
           <p className="text-4xl font-bold">{users.filter(u => u.role === 'Coach').length}</p>
        </div>

        <div className="glass-card p-6">
           <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Store className="w-6 h-6" />
              <h2 className="text-xl font-heading">Store Products</h2>
           </div>
           <p className="text-4xl font-bold text-gray-500">View Below</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-surface/50">
          <h2 className="text-xl font-heading">User Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {users.map((usr) => (
                    <tr key={usr._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-500">{usr._id.substring(18)}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                            <img src={usr.profileImage} alt="" className="w-8 h-8 rounded-full" />
                            {usr.name}
                        </td>
                        <td className="px-6 py-4">{usr.email}</td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${usr.role === 'Admin' ? 'bg-red-500/20 text-red-400' : usr.role === 'Coach' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                                {usr.role}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};

export default AdminDashboard;
