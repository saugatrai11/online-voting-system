import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar'; // Make sure you have the Navbar component created
import { LayoutDashboard, Timer, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
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
    fetchElections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-500 font-medium">Loading Elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Added Navbar at the top */}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" size={28} /> Voter Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Select an active election to participate and cast your vote.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 text-sm font-semibold text-slate-700">
            Total Available: {elections.length}
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <div 
              key={election._id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{election.title}</h2>
                  
                  {/* FIX: Changed election.status to election.isActive */}
                  {election.isActive ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                      <Timer size={14} /> LIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle size={14} /> ENDED
                    </span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 h-15">
                  {election.description || "No description provided for this election."}
                </p>

                <div className="bg-slate-50 rounded-lg p-3 mb-6">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Deadline</span>
                    <span className="text-slate-900">
                      {new Date(election.endDate).toLocaleDateString('en-US', {
                         month: 'short',
                         day: 'numeric',
                         year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* FIX: Updated button disabled logic to use isActive */}
                <button 
                  disabled={!election.isActive}
                  onClick={() => alert(`Redirecting to vote for: ${election.title}`)}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    election.isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  {election.isActive ? (
                    <>Cast Your Vote <CheckCircle size={18} /></>
                  ) : (
                    'Election Closed'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {elections.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 mt-10">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No Elections Found</h3>
            <p className="text-slate-500">There are currently no elections available in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;