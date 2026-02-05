import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';
import Ballot from './pages/Ballot';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';

// --- 🛡️ Protected Route Wrapper ---
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
    <AuthProvider> {/* Wrap here to provide context to the whole app */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route
            path="/ballot/:electionId"
            element={<ProtectedRoute><Ballot /></ProtectedRoute>
            }/>

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

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Catch All */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
              <h1 className="text-6xl font-black text-slate-200">404</h1>
              <p className="text-slate-500 mt-2 font-medium">Page not found.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                Go Back Home
              </button>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;