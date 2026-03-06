import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { 
  ShieldCheck, Newspaper, Calendar, ArrowRight, 
  Info, Bell, Globe, Lock, CheckCircle 
} from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({ totalElections: 0, totalVoters: '1.2M+' });

  // Mock News Data (In a real app, fetch this from /api/news)
  const updates = [
    { id: 1, title: "National Election 2026: Registration Open", date: "March 05, 2026", category: "Urgent" },
    { id: 2, title: "Blockchain Security Audit Completed", date: "March 01, 2026", category: "Security" },
    { id: 3, title: "How to cast your vote using the SmartVote App", date: "Feb 28, 2026", category: "Guide" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- Public Header --- */}
      <nav className="border-b px-6 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-600 font-black text-2xl">
          <ShieldCheck size={32} /> SmartVote
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
              My Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="font-bold text-slate-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
              Secure. Transparent. <span className="text-blue-600">Immutable.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Welcome to the 2026 General Elections Portal. Exercise your democratic right through the world's most secure blockchain-based voting infrastructure.
            </p>
            {!user && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-xl mb-6 flex gap-3">
                <Info className="shrink-0" />
                <p className="text-sm font-medium">Please <strong>Login</strong> or <strong>Register</strong> to participate in active ballots.</p>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <img src="https://illustrations.popsy.co/blue/online-registration.svg" alt="Voting" className="w-full h-auto" />
          </div>
        </div>
      </header>

      {/* --- News & Updates Section --- */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Newspaper className="text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Latest Announcements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {updates.map((item) => (
            <div key={item.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded">
                {item.category}
              </span>
              <h3 className="font-bold text-slate-900 mt-4 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar size={14} /> {item.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Eligibility Section --- */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How to Participate</h2>
            <p className="text-slate-400">Follow these 3 simple steps to cast your secure vote</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">1</div>
              <h4 className="text-xl font-bold mb-2">Identity Verification</h4>
              <p className="text-slate-400 text-sm">Register with your Citizen ID and verify your email/phone via OTP.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">2</div>
              <h4 className="text-xl font-bold mb-2">Explore Candidates</h4>
              <h4 className="text-xl font-bold mb-2">Explore Candidates</h4>
              <p className="text-slate-400 text-sm">Review candidate profiles, manifestos, and party history on your dashboard.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">3</div>
              <h4 className="text-xl font-bold mb-2">Secure Casting</h4>
              <p className="text-slate-400 text-sm">Submit your ballot. Your choice is encrypted and recorded on the blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-6 text-center border-t text-slate-400 text-sm">
        <p>&copy; 2026 SmartVote Govt Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;