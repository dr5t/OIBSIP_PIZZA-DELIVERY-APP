import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/user/Dashboard';
import PizzaBuilder from './pages/user/PizzaBuilder';
import Checkout from './pages/user/Checkout';
import MyOrders from './pages/user/MyOrders';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import Inventory from './pages/admin/Inventory';
import OrderManagement from './pages/admin/OrderManagement';

import './index.css';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-wrapper" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> : <Register />
      } />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ForgotPassword />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/build-pizza" element={
        <ProtectedRoute><PizzaBuilder /></ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute><Checkout /></ProtectedRoute>
      } />
      <Route path="/my-orders" element={
        <ProtectedRoute><MyOrders /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute adminOnly><Inventory /></ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute adminOnly><OrderManagement /></ProtectedRoute>
      } />

      <Route path="*" element={
        <Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'} />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
