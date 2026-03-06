import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { 
  ShieldCheck, 
  Loader2, 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2 
} from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // New success state
  
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Security Check
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setError('');
    setIsSubmitting(true);
    try {
      // ✅ NOTE: Ensure backend expects "code" and not "otp"
      await API.post('/auth/verify-otp', { email, code: otp });
      setIsVerified(true);
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    setError('');
    try {
      await API.post('/auth/resend-otp', { email });
      setTimer(60); 
      setCanResend(false);
      alert("A new 6-digit code has been sent to your inbox.");
    } catch (err) {
      setError("Failed to resend. Please wait a moment and try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // If successfully verified, show a success animation
  if (isVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Email Verified!</h2>
          <p className="text-slate-500 mt-2">Account activated successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border border-slate-100">
        
        {/* Progress Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enter Secure Code</h2>
        <p className="text-slate-500 mt-2 mb-8 text-sm leading-relaxed">
          We've sent a 6-digit verification code to <br/> 
          <span className="font-bold text-slate-900">{email}</span>
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-bounce">
            <XCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              required
              autoFocus
              className="w-full text-center text-4xl font-black tracking-[0.4em] py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-200"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Verifying...</span>
              </>
            ) : (
              "Activate Account"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50">
          <p className="text-sm text-slate-400 mb-3">Didn't receive the email?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resendLoading}
            className={`flex items-center justify-center w-full gap-2 font-bold text-sm transition-all py-2 rounded-lg ${
              canResend 
              ? 'text-blue-600 hover:bg-blue-50' 
              : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            {resendLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} className={!canResend ? '' : 'animate-pulse text-blue-500'} />
            )}
            {canResend ? "Resend OTP Now" : `Resend available in ${timer}s`}
          </button>
        </div>

        <button 
          onClick={() => navigate('/register')}
          className="mt-6 flex items-center justify-center w-full text-slate-400 hover:text-slate-600 text-xs font-bold gap-2 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Change Email
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;