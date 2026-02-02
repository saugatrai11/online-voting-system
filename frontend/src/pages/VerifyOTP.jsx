import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { ShieldCheck, Loader2, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

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

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await API.post('/auth/verify-otp', { email, code: otp });
      alert("Verification successful!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid verification code.");
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
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900">Verify Email</h2>
        <p className="text-slate-500 mt-2 mb-6 text-sm">
          Enter the code sent to <br/> <strong>{email}</strong>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center justify-center gap-2">
            <XCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            required
            className="w-full text-center text-3xl font-bold tracking-[0.5em] py-3 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:bg-blue-300"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm & Activate"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resendLoading}
            className={`flex items-center justify-center w-full gap-2 font-semibold text-sm transition-colors ${
              canResend ? 'text-blue-600 hover:text-blue-800' : 'text-slate-400'
            }`}
          >
            {resendLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} className={!canResend ? '' : 'animate-pulse'} />
            )}
            {canResend ? "Resend OTP Now" : `Resend in ${timer}s`}
          </button>
        </div>

        <button 
          onClick={() => navigate('/register')}
          className="mt-4 flex items-center justify-center w-full text-slate-400 hover:text-blue-600 text-xs gap-1 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Registration
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;