import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';

const Ballot = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchBallotData = async () => {
      try {
        setLoading(true);
        const [electionRes, candidateRes] = await Promise.all([
          API.get(`/elections/${electionId}`),
          API.get(`/candidates/election/${electionId}`) 
        ]);
        setElection(electionRes.data);
        setCandidates(candidateRes.data);
      } catch (err) {
        console.error("Ballot Fetch Error:", err);
        alert("Election details could not be loaded.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (electionId) fetchBallotData();
  }, [electionId, navigate]);

  const handleVoteSubmission = async () => {
    if (!selectedCandidate) return;

    const confirmVote = window.confirm(
      "CONFIRM VOTE: This action is permanent and will be digitally signed. Continue?"
    );
    if (!confirmVote) return;

    setSubmitting(true);
    try {
      const res = await API.post('/vote/cast', {
        electionId,
        candidateId: selectedCandidate
      });
      setReceipt(res.data.receipt);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Voting failed. You may have already voted or are ineligible.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">Initializing Secure Environment...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 transition-all font-bold text-sm bg-transparent border-none cursor-pointer group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> CANCEL AND EXIT
        </button>

        {/* --- Header Section --- */}
        <div className="bg-white rounded-t-[40px] p-8 border-x border-t border-slate-200 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-100">
              <ShieldCheck size={36} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Official Digital Ballot</h1>
          <div className="mt-2 flex flex-col items-center gap-1">
             <p className="text-blue-600 font-black uppercase text-sm tracking-widest">
               {election?.title}
             </p>
             <div className="flex gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                   <MapPin size={12} /> {election?.requiredDistrict || 'All Nepal'}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                   <Calendar size={12} /> {new Date(election?.endDate).toLocaleDateString()}
                </span>
             </div>
          </div>
        </div>

        {/* --- Candidate List --- */}
        <div className="bg-white p-6 border-x border-slate-200 space-y-3">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div 
                key={candidate._id}
                onClick={() => !submitting && setSelectedCandidate(candidate._id)}
                className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedCandidate === candidate._id 
                  ? "border-blue-600 bg-blue-50/40 ring-4 ring-blue-50/50" 
                  : "border-slate-100 hover:border-slate-300 bg-white"
                } ${submitting ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  {/* Photo Support */}
                  {candidate.imageUrl ? (
                    <img src={candidate.imageUrl} alt={c.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                  ) : (
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xl border border-slate-200">
                      {candidate.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">{candidate.name}</h3>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-0.5">
                      {candidate.party}
                    </p>
                  </div>
                </div>
                
                {/* Custom Radio Circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedCandidate === candidate._id ? "border-blue-600 bg-blue-600" : "border-slate-200"
                }`}>
                  {selectedCandidate === candidate._id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">No valid candidates found for this election.</p>
            </div>
          )}
        </div>

        {/* --- Action Section --- */}
        <div className="bg-slate-50 p-8 rounded-b-[40px] border-x border-b border-slate-200 shadow-sm">
          <button 
            onClick={handleVoteSubmission}
            disabled={!selectedCandidate || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={18} /> Processing Ledger...</>
            ) : (
              "Finalize & Cast Vote"
            )}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
            Security Protocol: SHA-256 Multi-Factor Encryption Active
          </p>
        </div>
      </div>

      {/* --- Success Modal --- */}
      {receipt && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl transform transition-all">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Vote Confirmed</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Your identity has been verified and your selection has been merged into the digital ledger.
            </p>
            
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 mb-8 text-left">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Immutable Receipt</p>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                 <code className="text-[10px] break-all text-blue-600 font-mono font-bold leading-normal">
                   {receipt}
                 </code>
              </div>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Finish Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ballot;