import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    alert('Simulating Checkout Process... Success! Payment processed for $' + getCartTotal());
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12 glass-card p-12 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-heading text-white mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any gear yet.</p>
        <Link to="/store" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)]">
          Return to Store <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-heading text-white mb-8 border-b border-white/10 pb-4">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-grow space-y-4">
          {cartItems.map((item) => (
             <div key={item._id} className="glass border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center p-2">
                       <img src={item.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200"} alt="" className="max-h-full object-contain" />
                   </div>
                   <div>
                       <h3 className="font-medium text-white">{item.name}</h3>
                       <p className="text-sm text-gray-400">{item.category}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-8">
                   <div className="text-right">
                       <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                       <p className="font-bold text-lg text-primary">${(item.price * item.qty).toFixed(2)}</p>
                   </div>
                   <button 
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Item"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          ))}
        </div>

        {/* Order Summary Form */}
        <div className="w-full lg:w-96">
           <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-heading mb-6 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                 </div>
                 <div className="flex justify-between text-secondary text-sm">
                    <span>Member Discount (0%)</span>
                    <span>-$0.00</span>
                 </div>
                 <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span className="text-secondary">$0.00 (Free)</span>
                 </div>
                 <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                    <span className="font-medium text-white">Total</span>
                    <span className="text-3xl font-heading text-primary">${getCartTotal()}</span>
                 </div>
              </div>

              <button 
                 onClick={handleCheckout}
                 className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.4)]"
              >
                 <CreditCard className="w-5 h-5" />
                 CONFIRM PROTOCOL (PAY)
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
