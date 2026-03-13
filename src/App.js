import React, { useEffect, useContext, lazy, Suspense } from 'react';
import useLenis from './hooks/useLenis';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Popup from './components/Popup';
import { trackListingAlertClick } from './api';
import { AuthContext } from './context/AuthContext';

// Code-split all page components
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Valuation = lazy(() => import('./pages/Valuation'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const FirstTimeBuyer = lazy(() => import('./pages/FirstTimeBuyer'));
const CashOffer = lazy(() => import('./pages/CashOffer'));
const HomeBuyers = lazy(() => import('./pages/HomeBuyers'));
const HomeSellers = lazy(() => import('./pages/HomeSellers'));
const SellBeforeYouBuy = lazy(() => import('./pages/SellBeforeYouBuy'));
const BookShowing = lazy(() => import('./pages/BookShowing'));
const LoanApplication = lazy(() => import('./pages/LoanApplication'));
const MortgageCalculator = lazy(() => import('./pages/MortgageCalculator'));
const MortgageLoanType = lazy(() => import('./pages/MortgageLoanType'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected Route — Users ONLY (blocks admin)
const UserRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

// Protected Route — Admins ONLY (blocks users)
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  useLenis();

  // Detect listing alert email clicks via UTM parameters
  useEffect(() => { trackListingAlertClick(); }, []);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Popup /> 
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0F172A' }} />}>
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
          <Route path="/home-buyers" element={<HomeBuyers />} />
          <Route path="/home-sellers" element={<HomeSellers />} />
          <Route path="/cash-offer" element={<CashOffer />} />
          <Route path="/sell-before-you-buy" element={<SellBeforeYouBuy />} />
          <Route path="/book-showing" element={<BookShowing />} />
          <Route path="/loan-application" element={<LoanApplication />} />
          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/mortgage/:loanType" element={<MortgageLoanType />} />
          
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

          {/* Catch-all for invalid URLs */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;