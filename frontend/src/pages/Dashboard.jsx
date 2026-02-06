import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Added Context Import
import API from '../api/axios';
import { 
  Vote, 
  Newspaper, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  Trophy,
  ArrowRight,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // ✅ FIX: Use user and loading from AuthContext instead of localStorage directly
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get('/elections');
        setElections(res.data);
      } catch (err) {
        console.error("Error fetching elections", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we aren't waiting on the auth check
    if (!authLoading) {
      fetchElections();
    }
  }, [authLoading]);

  const news = [
    { id: 1, title: "Candidate debate scheduled for tomorrow at 6 PM.", time: "2h ago", category: "Update" },
    { id: 2, title: "New security protocols implemented for digital IDs.", time: "5h ago", category: "Security" },
    { id: 3, title: "Early voting turnout reaches record highs in Zone A.", time: "1d ago", category: "News" },
  ];

  // ✅ Loading State (Handles both Auth and Data fetching)
  if (authLoading || loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
        <p className="text-slate-500 font-medium">Synchronizing Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          {/* ✅ FIX: Now uses the centralized user state */}
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.name || 'Voter'} 👋
          </h1>
          <p className="text-slate-500">Secure Blockchain Voting System | General Election 2026</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Vote size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Elections</p>
              <p className="text-2xl font-bold text-slate-900">{elections.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600"><BarChart3 size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Participation</p>
              <p className="text-2xl font-bold text-slate-900">1,250</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">System Status</p>
              <p className="text-2xl font-bold text-slate-900 uppercase text-[10px] mt-2 text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                Secure & Online
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Active Elections */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Available Ballots</h2>
            </div>

            {elections.length > 0 ? (
              elections.map((election) => (
                <div key={election._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md transition-all mb-4">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {election.type || 'National'}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">{election.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 size={14} /> Open
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {election.description || 'Cast your vote securely. Your vote is encrypted and anonymous.'}
                    </p>
                    
                    <button 
                      onClick={() => navigate(`/ballot/${election._id}`)}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98]"
                    >
                      Cast Your Vote <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-400 font-medium">No active elections found in the database.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Newspaper size={20} className="text-blue-600" /> Latest News
            </h2>
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-5 shadow-sm">
              {news.map((item) => (
                <div key={item.id} className="group cursor-pointer pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                    <span className="text-blue-500">{item.category}</span>
                    <span className="text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <Trophy className="mb-4 text-blue-200" size={32} />
                <h3 className="font-bold text-lg mb-2">Voting Matters!</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  By participating, you are shaping the future of our digital community. Every vote is secured via end-to-end encryption.
                </p>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-50"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;