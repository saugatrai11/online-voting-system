import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';

// Components
import Navbar from './components/Navbar';

// --- 🛡️ Protected Route Wrapper ---
// This component checks if the user is authenticated before showing the page.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
          <p className="text-slate-500 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// --- 🌐 Main App Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes: Accessible by anyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected Routes: Require Authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Admin Route (Optional Placeholder) */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <div className="p-10 text-center font-bold text-2xl text-slate-800">
                Admin Dashboard - Implementation in progress
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 404 Catch All */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-slate-900">404</h1>
            <p className="text-slate-500">Page not found.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 text-blue-600 font-bold"
            >
              Go Home
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;