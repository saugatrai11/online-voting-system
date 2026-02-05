import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get user data from context or local storage
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Voter" };

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get('/elections'); // Ensure this route exists in your backend
        setElections(res.data);
      } catch (err) {
        console.error("Error fetching elections", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const news = [
    { id: 1, title: "Candidate debate scheduled for tomorrow at 6 PM.", time: "2h ago", category: "Update" },
    { id: 2, title: "New security protocols implemented for digital IDs.", time: "5h ago", category: "Security" },
    { id: 3, title: "Early voting turnout reaches record highs in Zone A.", time: "1d ago", category: "News" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name} 👋</h1>
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
              <p className="text-2xl font-bold text-slate-900 uppercase text-xs mt-2 text-green-600">Secure & Online</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Active Elections */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Available Ballots</h2>
            </div>

            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : elections.length > 0 ? (
              elections.map((election) => (
                <div key={election._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all mb-4">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                          {election.type || 'National'}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">{election.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Open
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">{election.description || 'Cast your vote securely. Your vote is encrypted and anonymous.'}</p>
                    
                    {/* ✅ FIX: Button now navigates to the Ballot page with the real ID */}
                    <button 
                      onClick={() => navigate(`/ballot/${election._id}`)}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                      Cast Your Vote <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-500">No active elections found in the database.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Newspaper size={20} className="text-blue-600" /> Latest News
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
              {news.map((item) => (
                <div key={item.id} className="group cursor-pointer pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex justify-between text-xs font-bold uppercase mb-1">
                    <span className="text-blue-500">{item.category}</span>
                    <span className="text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <Trophy className="mb-4 opacity-80" size={32} />
              <h3 className="font-bold text-lg mb-2">Voting Matters!</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                By participating, you are shaping the future of our digital community. Every vote is secured via end-to-end encryption.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;