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
      login(res.data.user, res.data.token); 
      
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password.');
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
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email" required
            className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase()})}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} required
              className="w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;