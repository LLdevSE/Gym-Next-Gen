import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<div className="text-center py-20"><h1 className="text-5xl font-heading text-primary mb-4">GYM NEXT GEN</h1><p className="text-muted-foreground">The future of fitness</p></div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/coach" element={<ProtectedRoute allowedRoles={['Coach']}><CoachDashboard /></ProtectedRoute>} />
                <Route path="/customer" element={<ProtectedRoute allowedRoles={['Customer']}><CustomerDashboard /></ProtectedRoute>} />
                
                <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
