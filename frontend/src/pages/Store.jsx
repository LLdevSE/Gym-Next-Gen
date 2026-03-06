import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/store/ProductCard';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter } from 'lucide-react';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch store products', error);
      } finally {
         setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = categoryFilter === 'All' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  if (loading) return <div className="text-center py-20 text-primary animate-pulse">Initializing Storefront...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <ShoppingBag className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-heading text-white uppercase tracking-wide">Elite Gear & Nutrition</h1>
            <p className="text-muted-foreground">Fuel your NextGen Journey.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search products..." className="w-full bg-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <select 
               className="bg-surface border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
             >
                <option value="All">All Categories</option>
                <option value="Equipment">Equipment</option>
                <option value="Supplement">Supplements</option>
                <option value="Apparel">Apparel</option>
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
          <div className="text-center py-20 glass-card">
             <p className="text-gray-400">No products found for this category.</p>
          </div>
      )}

    </motion.div>
  );
};

export default Store;
