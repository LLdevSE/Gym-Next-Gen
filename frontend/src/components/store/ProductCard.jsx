import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden flex flex-col h-full group"
    >
      <div className="relative h-48 overflow-hidden bg-white/5 p-4 flex items-center justify-center">
        {/* Using a placeholder if imageUrl is broken or relative */}
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500&auto=format&fit=crop"} 
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-surface/80 backdrop-blur-md rounded text-xs font-semibold text-primary uppercase border border-primary/20">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-medium text-white line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-400 mt-2 flex-grow line-clamp-3">{product.description}</p>
        
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-xs text-secondary font-medium block mb-1">
              {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
            </span>
            <span className="text-2xl font-bold font-heading text-white">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="p-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
