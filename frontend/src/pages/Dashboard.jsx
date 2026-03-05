import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Vote, Newspaper, Clock, BarChart3, CheckCircle2, Trophy, ArrowRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect Admin to the proper URL
    if (!authLoading && user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get('/elections');
        setElections(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user && user.role !== 'admin') fetchElections();
  }, [authLoading, user]);

  if (authLoading || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name || 'Voter'} 👋</h1>
          <p className="text-slate-500">Secure Blockchain Voting System 2026</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Available Ballots</h2>
            {elections.map((election) => (
              <div key={election._id} className="bg-white border p-6 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold">{election.title}</h3>
                <p className="text-slate-600 mb-6">{election.description}</p>
                <button 
                  onClick={() => navigate(`/ballot/${election._id}`)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all"
                >
                  Cast Your Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;