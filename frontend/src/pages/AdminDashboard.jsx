import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Users, Dumbbell, Store, LayoutDashboard } from 'lucide-react';

import UserManager from '../components/admin/UserManager';
import ProductManager from '../components/admin/ProductManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
         const { data } = await axios.get('/api/users', { headers: { Authorization: `Bearer ${user.token}` } });
         setUsers(data);
      } catch (error) {
         console.error('Failed to fetch stats', error);
      } finally {
         setLoading(false);
      }
    };
    if (activeTab === 'Overview') fetchStats();
  }, [user, activeTab]);

  const tabs = [
     { id: 'Overview', icon: LayoutDashboard },
     { id: 'Users', icon: Users },
     { id: 'Inventory', icon: Store }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-heading text-white">ADMINISTRATOR OVERRIDE</h1>
            <p className="text-muted-foreground">Manage your gym facility and application ecosystem.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-surface/50 p-1 rounded-xl border border-white/5">
           {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                       activeTab === tab.id ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,242,254,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                 >
                    <Icon className="w-4 h-4" /> {tab.id}
                 </button>
              )
           })}
        </div>
      </div>

      {/* Tab Content Rendering */}
      <AnimatePresence mode="wait">
         {activeTab === 'Overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="glass-card p-6 border-l-4 border-l-primary/50">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                       <Users className="w-6 h-6" />
                       <h2 className="text-xl font-heading">Total Users</h2>
                    </div>
                    {loading ? <div className="animate-pulse h-10 bg-white/5 rounded w-16"></div> : <p className="text-4xl font-bold">{users.length}</p>}
                 </div>
                 
                 <div className="glass-card p-6 border-l-4 border-l-secondary/50">
                    <div className="flex items-center gap-3 mb-4 text-secondary">
                       <Dumbbell className="w-6 h-6" />
                       <h2 className="text-xl font-heading">Active Coaches</h2>
                    </div>
                    {loading ? <div className="animate-pulse h-10 bg-white/5 rounded w-16"></div> : <p className="text-4xl font-bold">{users.filter(u => u.role === 'Coach').length}</p>}
                 </div>
         
                 <div className="glass-card p-6 border-l-4 border-l-red-400/50">
                    <div className="flex items-center gap-3 mb-4 text-red-400">
                       <ShieldAlert className="w-6 h-6" />
                       <h2 className="text-xl font-heading">System Admins</h2>
                    </div>
                    {loading ? <div className="animate-pulse h-10 bg-white/5 rounded w-16"></div> : <p className="text-4xl font-bold text-gray-500">{users.filter(u => u.role === 'Admin').length}</p>}
                 </div>
               </div>
               
               <div className="glass-card p-12 text-center mt-8 border-primary/20">
                  <h3 className="text-2xl font-heading text-white mb-2">System Running Smoothly</h3>
                  <p className="text-gray-400">Navigate to the Users or Inventory tabs to manage records.</p>
               </div>
            </motion.div>
         )}

         {activeTab === 'Users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card border-none">
               <UserManager token={user.token} />
            </motion.div>
         )}

         {activeTab === 'Inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card border-none">
               <ProductManager token={user.token} />
            </motion.div>
         )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminDashboard;
