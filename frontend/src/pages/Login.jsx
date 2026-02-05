import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/login', formData);
      
      // ✅ FIX: Match the AuthContext logic (userData, token)
      // res.data.user contains { name, role, email, etc. }
      // res.data.token contains the JWT string
      login(res.data.user, res.data.token); 
      
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Invalid email or password.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Voter Login</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to cast your vote</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400"><Mail size={18} /></span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase()})}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/forgot-password" size="sm" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400"><Lock size={18} /></span>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:bg-blue-400 shadow-lg shadow-blue-100"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <span>Sign In</span>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;