import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, UserPlus, Loader2, XCircle, 
  Phone, AtSign, Eye, EyeOff, Calendar, MapPin 
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', username: '', email: '', phone: '', 
    password: '', confirmPassword: '', dob: '', district: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }
    
    setIsSubmitting(true);
    try {
      // 🛡️ Full Payload including dob and district
      const dataToSend = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dob: formData.dob,
        district: formData.district
      };

      await API.post('/auth/register', dataToSend);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Voter Registration</h1>
          <p className="text-slate-500 mt-2">Create your secure digital voting identity</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-2 rounded-r-lg">
            <XCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><User size={18} /></span>
                <input
                  type="text" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><AtSign size={18} /></span>
                <input
                  type="text" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="johndoe123"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><Mail size={18} /></span>
                <input
                  type="email" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* 🛡️ NEW: Date of Birth (Fixes Age Check) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Date of Birth</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><Calendar size={18} /></span>
                <input
                  type="date" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>

            {/* 🛡️ NEW: District (Fixes District Check) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">District / Region</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><MapPin size={18} /></span>
                <select
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                >
                  <option value="">Select District</option>
                  <option value="North Zone">North Zone</option>
                  <option value="South Zone">South Zone</option>
                  <option value="East Zone">East Zone</option>
                  <option value="West Zone">West Zone</option>
                  <option value="Central">Central</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><Phone size={18} /></span>
                <input
                  type="tel" required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="98XXXXXXXX"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"} required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div className="md:col-start-2">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400"><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"} required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : <span>Create Voter Account</span>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;