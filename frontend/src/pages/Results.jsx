import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';

const Results = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // ✅ FIXED: Added '/vote' prefix to match server route: /api/vote/results/:electionId
        const res = await API.get(`/vote/results/${electionId}`);
        
        // Note: Your backend returns { name, party, votes }. 
        // We map 'votes' to the key 'votes' expected by Recharts.
        setData(res.data.map(c => ({ name: c.name, votes: c.votes })));
      } catch (err) { 
        console.error("Error fetching results", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchResults();
  }, [electionId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6 font-bold text-sm">
          <ArrowLeft size={18} /> BACK TO DASHBOARD
        </button>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <Trophy className="text-yellow-500" /> Election Results
          </h2>

          {/* ✅ FIXED: Added h-80 wrapper to ensure container has dimensions */}
          <div className="h-80 w-full">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#2563eb" radius={[10, 10, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-400 mt-20">No votes cast for this election yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;