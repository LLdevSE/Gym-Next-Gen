import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManager = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
     name: '', price: 0, category: 'Equipment', stock: 0, imageUrl: '', description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch(err) { console.error('Error fetching inventory', err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
     if(!window.confirm('Delete this product permanently?')) return;
     try {
        await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts(products.filter(p => p._id !== id));
     } catch(err) { alert('Failed to delete product'); }
  };

  const openForm = (product = null) => {
     if (product) {
        setEditingProduct(product._id);
        setFormData({ name: product.name, price: product.price, category: product.category, stock: product.stock, imageUrl: product.imageUrl, description: product.description });
     } else {
        setEditingProduct(null);
        setFormData({ name: '', price: 0, category: 'Equipment', stock: 0, imageUrl: '', description: '' });
     }
     setShowModal(true);
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
     try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if (editingProduct) {
           const { data } = await axios.put(`/api/products/${editingProduct}`, formData, config);
           setProducts(products.map(p => p._id === editingProduct ? data : p));
        } else {
           const { data } = await axios.post('/api/products', formData, config);
           setProducts([...products, data]);
        }
        setShowModal(false);
     } catch(err) {
        alert('Failed to save product');
     }
  };

  if (loading) return <div className="text-center py-10">Loading Store Inventory...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-surface/50 p-6 rounded-t-xl border-b border-white/10">
         <h2 className="text-xl font-heading text-white">Store Inventory</h2>
         <button onClick={() => openForm()} className="bg-primary text-background font-bold py-2 px-4 rounded hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm shadow-[0_0_10px_rgba(0,242,254,0.3)]">
            <Plus className="w-4 h-4" /> Add Item
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
         {products.map(product => (
            <div key={product._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
               <div className="h-40 p-4 bg-black/20 flex items-center justify-center relative">
                  <img src={product.imageUrl} alt="" className="max-h-full object-contain" />
                  <span className="absolute top-2 right-2 px-2 py-1 bg-surface backdrop-blur-md rounded text-xs font-semibold text-primary uppercase border border-primary/20">
                     {product.category}
                  </span>
               </div>
               <div className="p-4">
                  <h3 className="font-medium text-white truncate text-lg mb-2">{product.name}</h3>
                  <div className="flex justify-between items-end mb-4 text-sm">
                     <span className="text-gray-400">Stock: <span className={product.stock > 0 ? 'text-secondary font-bold' : 'text-red-400 font-bold'}>{product.stock}</span></span>
                     <span className="text-primary font-bold text-xl font-heading">${product.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-end gap-2 border-t border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => openForm(product)} className="p-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors"><Edit3 className="w-4 h-4"/></button>
                     <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
         {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
               <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-card w-full max-w-2xl border-primary/30 overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-white/10 bg-surface/50">
                     <h2 className="text-xl font-heading text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                     <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Product Name</label>
                           <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Price ($)</label>
                           <input type="number" step="0.01" required value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Stock Level</label>
                           <input type="number" required value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Category</label>
                           <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary">
                              <option>Equipment</option>
                              <option>Supplement</option>
                              <option>Apparel</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Image URL</label>
                           <input type="text" required value={formData.imageUrl} onChange={e=>setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Description</label>
                           <textarea required rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-surface/50 border border-white/10 rounded py-2 px-3 text-white focus:outline-none focus:border-primary" />
                        </div>
                     </div>
                     <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                        <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
                           <Save className="w-4 h-4"/> Save Record
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

export default ProductManager;
