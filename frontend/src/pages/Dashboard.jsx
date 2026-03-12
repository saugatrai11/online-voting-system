import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Loader2, BarChart3, Vote } from 'lucide-react';

import VoterSummary from '../components/VoterSummary';
import NoticeBoard from '../components/NoticeBoard';
import StationLocator from '../components/StationLocator';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get('/elections');
        setElections(res.data);
      } catch (err) { console.error("Fetch error", err); }
      finally { setLoading(false); }
    };
    if (!authLoading && user && user.role !== 'admin') fetchElections();
  }, [authLoading, user]);

  if (authLoading || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Welcome, {user?.name} 👋</h1>
          <p className="text-slate-500">Secure Blockchain Voting System 2026</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <VoterSummary user={user} />
            <h2 className="text-xl font-bold">Active & Past Ballots</h2>
            
            {elections.map((e) => (
              <div key={e._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{e.title}</h3>
                  <p className="text-slate-500 text-sm">{e.description}</p>
                </div>
                
                <div className="flex gap-3">
                  {/* Logic: If election is active, show Vote button, else show Results */}
                  {e.status === 'active' ? (
                    <button onClick={() => navigate(`/ballot/${e._id}`)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all">
                      <Vote size={18} /> Cast Vote
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/results/${e._id}`)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                      <BarChart3 size={18} /> View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            <NoticeBoard />
            <StationLocator />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;