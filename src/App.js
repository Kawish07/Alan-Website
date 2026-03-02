import React from 'react';
import useLenis from './hooks/useLenis';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Popup from './components/Popup';
import Home from './pages/Home';
import Search from './pages/Search';
import PropertyDetails from './pages/PropertyDetails';
import Valuation from './pages/Valuation';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import FirstTimeBuyer from './pages/FirstTimeBuyer';
import CashOffer from './pages/CashOffer';
import SellBeforeYouBuy from './pages/SellBeforeYouBuy';
import BookShowing from './pages/BookShowing';
import LoanApplication from './pages/LoanApplication';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Protected Route Component for Users
const UserRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null; // Or a simple spinner
  // Admin is allowed to visit user dashboard too
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

// Protected Route Component for Admins ONLY
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  useLenis();
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Popup /> 
        <Routes>
          {/* Public Core */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listings" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          
          {/* Conversion / Landing Pages */}
          <Route path="/valuation" element={<Valuation />} />
          <Route path="/home-valuation" element={<Valuation />} />
          <Route path="/first-time-buyers" element={<FirstTimeBuyer />} />
          <Route path="/cash-offer" element={<CashOffer />} />
          <Route path="/sell-before-you-buy" element={<SellBeforeYouBuy />} />
          <Route path="/book-showing" element={<BookShowing />} />
          <Route path="/loan-application" element={<LoanApplication />} />
          
          {/* User Auth & Dashboard */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
          
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/leads" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/properties" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/content" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/marketing" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;