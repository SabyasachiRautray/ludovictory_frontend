import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store/index';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Spinner from '@/pages/Spinner';
import PrizeHouse from '@/pages/PrizeHouse';
import ShoppingBazaar from '@/pages/ShoppingBazaar';
import GameZone from '@/pages/GameZone';
import GamePlay from '@/pages/GamePlay';
import Profile from '@/pages/Profile';
import Leaderboard from '@/pages/Leaderboard';
import Contact from '@/pages/Contact';
import { About, Privacy, Terms } from '@/pages/StaticPages';
import BuyTokens from "./pages/BuyTokens";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/spinner" element={<ProtectedRoute><PageTransition><Spinner /></PageTransition></ProtectedRoute>} />
        {/* <Route path="/prizes" element={<ProtectedRoute><PageTransition><PrizeHouse /></PageTransition></ProtectedRoute>} /> */}
        <Route path="/bazaar" element={<ProtectedRoute><PageTransition><ShoppingBazaar /></PageTransition></ProtectedRoute>} />
        {/* <Route path="/game" element={<ProtectedRoute><PageTransition><GameZone /></PageTransition></ProtectedRoute>} /> */}
        {/* <Route path="/game/:sessionId" element={<ProtectedRoute><PageTransition><GamePlay /></PageTransition></ProtectedRoute>} /> */}
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><PageTransition><Leaderboard /></PageTransition></ProtectedRoute>} />
        {/* <Route path="/contact" element={<ProtectedRoute><PageTransition><Contact /></PageTransition></ProtectedRoute>} /> */}
        <Route path="/buy-tokens" element={<ProtectedRoute><PageTransition><BuyTokens /></PageTransition></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(0 0% 100%)',
            border: '1px solid hsl(39 34% 78%)',
            color: 'hsl(229 36% 18%)',
          },
        }}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
