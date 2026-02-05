import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  ShieldCheck, 
  Loader2, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  User,
  Info
} from 'lucide-react';

const Ballot = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [receipt, setReceipt] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        // Ensure the electionId exists before calling API
        if (!electionId) return;
        
        const res = await API.get(`/candidates/${electionId}`);
        setCandidates(res.data);
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [electionId]);

  const handleVote = async (candidateId, candidateName) => {
    // Confirmation Dialog
    const confirmVote = window.confirm(
      `Confirm Vote: Are you sure you want to vote for ${candidateName}? This cannot be reversed.`
    );
    
    if (!confirmVote) return;

    setIsVoting(true);
    try {
      const response = await API.post('/vote', {
        electionId,
        candidateId
      });

      setReceipt(response.data.receipt);
      setVoteSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Voting failed. You might have already voted in this election.";
      alert(errorMsg);
    } finally {
      setIsVoting(false);
    }
  };

  // 1. Loading State
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-500 font-medium animate-pulse">Loading Official Ballot...</p>
    </div>
  );

  // 2. Vote Success View (Receipt)
  if (voteSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vote Recorded</h2>
          <p className="text-slate-500 mb-6 text-sm">Your vote was successfully hashed and stored on the secure ledger.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Digital Verification Receipt</p>
            <code className="text-[11px] break-all text-blue-700 font-mono leading-relaxed block bg-white p-2 border border-slate-100 rounded">
              {receipt}
            </code>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-500 mb-8 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Exit to Dashboard
        </button>
        
        <div className="mb-8 border-l-4 border-blue-600 pl-6">
          <h1 className="text-3xl font-bold text-slate-900">Official Ballot</h1>
          <p className="text-slate-500 mt-1">Please select your preferred candidate below.</p>
        </div>

        {/* 3. Empty State Logic (Better UI) */}
        {candidates.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Candidates Found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              There are currently no candidates assigned to this election. Please contact the administrator.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-50">
              <p className="text-[10px] text-slate-300 font-mono">REF_ID: {electionId}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {candidates.map((c) => (
              <div 
                key={c._id} 
                className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{c.name}</h3>
                    <p className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded inline-block">
                      {c.party}
                    </p>
                  </div>
                </div>
                <button 
                  disabled={isVoting}
                  onClick={() => handleVote(c._id, c.name)}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-2"
                >
                  {isVoting ? <Loader2 size={18} className="animate-spin" /> : "Cast Vote"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 py-6 border-t border-slate-200 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-xs font-bold">
            <ShieldCheck size={16} /> End-to-End Encryption Verified
          </div>
          <p className="text-slate-400 text-[10px] text-center max-w-sm">
            Your vote is anonymized using SHA-256 hashing. Once cast, your identity is disconnected from your choice to ensure total privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ballot;