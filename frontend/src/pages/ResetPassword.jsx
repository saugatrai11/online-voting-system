import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Lock, ShieldCheck, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ otp: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);
    try {
      await API.post('/auth/reset-password', { 
        email, 
        otp: formData.otp, 
        newPassword: formData.password 
      });
      alert("Password updated! Please login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP or request expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-full mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Enter the OTP sent to <span className="font-semibold text-slate-700">{email}</span> and your new password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Verification Code</label>
            <input 
              type="text" placeholder="000000" required maxLength="6"
              className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, "")})}
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400"><Lock size={18} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" required
                className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all mt-2">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;