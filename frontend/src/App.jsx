import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ballot from './pages/Ballot';
import AdminDashboard from './pages/AdminDashboard'; 
import ManageCandidates from './pages/ManageCandidates';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Session...</div>;
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
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Voter Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ballot/:electionId" element={<ProtectedRoute><Ballot /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/candidates/:electionId" element={
            <ProtectedRoute adminOnly={true}><ManageCandidates /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div className="p-20 text-center">404 - Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;