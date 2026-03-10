import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, CreditCard, ChevronRight, ArrowLeft, Minus, Plus, MapPin, ShieldCheck, Lock, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const STEPS = {
  CART: 1,
  ADDRESS: 2,
  PAYMENT: 3
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(STEPS.CART);
  const navigate = useNavigate();

  // Pricing calculations
  const subtotal = parseFloat(getCartTotal() || 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Address Form State
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '', apt: '', city: '', state: '', zip: ''
  });
  const [promoCode, setPromoCode] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // Input Handler helper
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    alert(`Simulating Checkout Process...\n\nPayment successful for $${total.toFixed(2)}\nOrder Processed!`);
    clearCart();
    navigate('/store');
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (cartItems.length === 0 && currentStep === STEPS.CART) {
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

  const renderStepper = () => (
    <div className="flex items-center justify-center mb-12 overflow-x-auto pb-4">
      <div className={`flex items-center gap-3 whitespace-nowrap ${currentStep >= STEPS.CART ? 'text-primary' : 'text-gray-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= STEPS.CART ? 'bg-primary text-background shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 'bg-surface border border-white/10'}`}>1</div>
        <span className="font-heading tracking-wide uppercase">Cart</span>
      </div>
      <div className={`w-8 sm:w-16 h-[2px] mx-2 sm:mx-4 ${currentStep >= STEPS.ADDRESS ? 'bg-primary shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 'bg-white/10'}`} />
      
      <div className={`flex items-center gap-3 whitespace-nowrap ${currentStep >= STEPS.ADDRESS ? 'text-primary' : 'text-gray-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= STEPS.ADDRESS ? 'bg-primary text-background shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 'bg-surface border border-white/10'}`}>2</div>
        <span className="font-heading tracking-wide uppercase">Address</span>
      </div>
      <div className={`w-8 sm:w-16 h-[2px] mx-2 sm:mx-4 ${currentStep >= STEPS.PAYMENT ? 'bg-primary shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 'bg-white/10'}`} />
      
      <div className={`flex items-center gap-3 whitespace-nowrap ${currentStep === STEPS.PAYMENT ? 'text-primary' : 'text-gray-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep === STEPS.PAYMENT ? 'bg-primary text-background shadow-[0_0_10px_rgba(0,242,254,0.5)]' : 'bg-surface border border-white/10'}`}>3</div>
        <span className="font-heading tracking-wide uppercase">Payment</span>
      </div>
    </div>
  );

  const renderOrderSummary = (buttonText, buttonAction, icon) => (
    <div className="glass-card p-6 sticky top-24">
      <h2 className="text-lg font-heading mb-6 border-b border-white/10 pb-4 text-white">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-secondary">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        {currentStep === STEPS.CART && (
          <div className="pt-4 pb-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap border border-white/5">
                Apply
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
          <span className="font-medium text-white">Total</span>
          <span className="text-2xl font-heading text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={buttonAction}
        className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.2)]"
      >
        {icon}
        {buttonText}
      </button>

      {currentStep === STEPS.PAYMENT && (
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Secure SSL Encrypted Checkout</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-white font-medium mb-3">Delivery Information</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Estimated delivery</span>
                <span className="text-white">3-5 business days</span>
              </div>
              <div className="flex justify-between">
                <span>Free delivery</span>
                <span className="text-white">On orders over $100</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-heading text-white">Checkout Overview</h1>
        <div className="text-sm text-gray-400 hidden sm:flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-primary" /> Secure Checkout
        </div>
      </div>
      
      {renderStepper()}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CART */}
            {currentStep === STEPS.CART && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-heading text-white mb-6">Shopping Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</h2>
                {cartItems.map((item) => (
                   <div key={item._id} className="glass border border-white/5 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                         <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center p-3 shrink-0">
                             <img src={item.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200"} alt="" className="max-h-full object-contain" />
                         </div>
                         <div>
                             <h3 className="font-medium text-white text-lg">{item.name}</h3>
                             <p className="text-sm text-gray-400 mb-2">Category: {item.category}</p>
                             <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8 ml-auto">
                         <div className="flex items-center gap-3 bg-background border border-white/10 rounded-lg p-1">
                            <button 
                               onClick={() => updateQuantity(item._id, item.qty - 1)}
                               className="p-1 hover:bg-white/10 rounded text-gray-300 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-white">{item.qty}</span>
                            <button 
                               onClick={() => updateQuantity(item._id, item.qty + 1)}
                               className="p-1 hover:bg-white/10 rounded text-gray-300 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                         </div>
                         <button 
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                            title="Remove Item"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                ))}
              </motion.div>
            )}

            {/* STEP 2: ADDRESS */}
            {currentStep === STEPS.ADDRESS && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading text-white">Shipping & Billing Address</h2>
                </div>
                
                <div className="glass border border-white/5 rounded-xl p-6 md:p-8">
                  <h3 className="text-lg font-medium text-white mb-6 border-b border-white/10 pb-2">Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm text-gray-400">First Name</label>
                       <input type="text" name="firstName" value={shippingAddress.firstName} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-gray-400">Last Name</label>
                       <input type="text" name="lastName" value={shippingAddress.lastName} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm text-gray-400">Email Address</label>
                       <input type="email" name="email" value={shippingAddress.email} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm text-gray-400">Phone Number</label>
                       <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm text-gray-400">Street Address</label>
                       <input type="text" name="street" value={shippingAddress.street} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm text-gray-400">Apartment, suite, etc. (optional)</label>
                       <input type="text" name="apt" value={shippingAddress.apt} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-gray-400">City</label>
                       <input type="text" name="city" value={shippingAddress.city} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-gray-400">State / Province</label>
                       <input type="text" name="state" value={shippingAddress.state} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-gray-400">Postal Code</label>
                       <input type="text" name="zip" value={shippingAddress.zip} onChange={handleShippingChange} className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  <div className="mt-10 mb-6">
                    <h3 className="text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">Billing Address</h3>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border ${sameAsShipping ? 'bg-primary border-primary' : 'border-white/20 bg-background group-hover:border-primary/50'} flex items-center justify-center transition-colors`}>
                        {sameAsShipping && <Check className="w-3 h-3 text-background font-bold" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={sameAsShipping} onChange={() => setSameAsShipping(!sameAsShipping)} />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Same as shipping address</span>
                    </label>
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button onClick={() => setCurrentStep(STEPS.CART)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </button>
                    {/* The primary button is handled in the sidebar for mobile/desktop consistency, but we duplicate here on mobile if needed */}
                    <button onClick={() => setCurrentStep(STEPS.PAYMENT)} className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold">
                       Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === STEPS.PAYMENT && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-heading text-white">Payment Information</h2>
                </div>
                
                <div className="glass border border-white/5 rounded-xl p-6 md:p-8 space-y-8">
                  
                  {/* Payment Method Selector */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      
                      {/* Credit Card Option */}
                      <label className={`block border ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'} rounded-xl cursor-pointer transition-colors p-4 relative`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-gray-500'}`}>
                              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                            <span className="text-white font-medium">Credit/Debit Card</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-10 h-6 bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs">Visa</div>
                            <div className="w-10 h-6 bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs">MC</div>
                          </div>
                        </div>
                        <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      </label>

                      {/* UPI/Other Option mocked */}
                      <label className={`block border ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'} rounded-xl cursor-pointer transition-colors p-4 relative`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-gray-500'}`}>
                              {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                            <span className="text-white font-medium">UPI Payment</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-auto px-2 h-6 bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs text-secondary">Google Pay</div>
                          </div>
                        </div>
                        <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      </label>
                      
                    </div>
                  </div>

                  {/* Card Details Form - shown only if card selected */}
                  {paymentMethod === 'card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-white/10">
                      <h3 className="text-lg font-medium text-white">Card Details</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm text-gray-400">Card Number</label>
                           <div className="relative">
                             <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pl-12 text-white font-mono focus:outline-none focus:border-primary transition-colors" />
                             <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <label className="text-sm text-gray-400">Cardholder Name</label>
                           <input type="text" placeholder="JANE DOE" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white uppercase focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-sm text-gray-400">Expiry Date</label>
                             <input type="text" placeholder="MM/YY" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-primary transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm text-gray-400">CVV</label>
                             <input type="text" placeholder="123" maxLength="4" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                    <button onClick={() => setCurrentStep(STEPS.ADDRESS)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Address
                    </button>
                    {/* Mobile completion button */}
                    <button onClick={handleCheckout} className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold">
                       Submit Order <Check className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sidebar Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          {currentStep === STEPS.CART && renderOrderSummary("Proceed to Checkout", () => setCurrentStep(STEPS.ADDRESS), <ChevronRight className="w-5 h-5" />)}
          {currentStep === STEPS.ADDRESS && renderOrderSummary("Continue to Payment", () => setCurrentStep(STEPS.PAYMENT), <ChevronRight className="w-5 h-5" />)}
          {currentStep === STEPS.PAYMENT && renderOrderSummary("Complete Order", handleCheckout, <Check className="w-5 h-5" />)}
        </div>
      </div>
    </div>
  );
};

export default Cart;
