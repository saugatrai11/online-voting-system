import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import Ballot from './pages/Ballot';
import AdminDashboard from './pages/AdminDashboard'; 
import ManageCandidates from './pages/ManageCandidates';
import Navbar from './components/Navbar';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Results from './pages/Results'; // ✅ Imported

// --- Protected Route Helper ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-blue-600">
        Authenticating Session...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* --- Voter Routes --- */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ballot/:electionId" element={<ProtectedRoute><Ballot /></ProtectedRoute>} />
          <Route path="/results/:electionId" element={<ProtectedRoute><Results /></ProtectedRoute>} />

          {/* --- Admin Routes --- */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/candidates/:electionId" element={<ProtectedRoute adminOnly={true}><ManageCandidates /></ProtectedRoute>} />

          {/* --- Redirects & 404 --- */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
              <h1 className="text-6xl font-black text-slate-200">404</h1>
              <p className="text-slate-500 font-medium mb-4">Oops! Page not found.</p>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;