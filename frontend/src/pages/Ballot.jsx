import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';

const Ballot = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchBallotData = async () => {
      try {
        setLoading(true);
        // Fetch Election details and Candidates in parallel
        const [electionRes, candidateRes] = await Promise.all([
          API.get(`/elections/${electionId}`),
          API.get(`/candidates/election/${electionId}`) 
        ]);
        setElection(electionRes.data);
        setCandidates(candidateRes.data);
      } catch (err) {
        console.error("Ballot Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (electionId) fetchBallotData();
  }, [electionId]);

  // ✅ New Function to handle the voting process
  const handleVoteSubmission = async () => {
    if (!selectedCandidate) return;

    const confirmVote = window.confirm(
      "Are you sure you want to cast your vote? This action cannot be undone."
    );
    if (!confirmVote) return;

    setSubmitting(true);
    try {
      // Matches your backend route: router.post("/", auth, castVote)
      const res = await API.post('/vote', {
        electionId,
        candidateId: selectedCandidate
      });

      // Show the receipt from your crypto.createHash logic
      alert(`Vote Cast Successfully!\n\nYour Receipt: ${res.data.receipt.substring(0, 12)}...`);
      
      // Redirect user to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Voting Error:", err);
      const errorMsg = err.response?.data?.msg || "An error occurred while casting your vote.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium">Preparing Secure Ballot...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={18} /> Exit to Dashboard
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <ShieldCheck size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Official Ballot</h1>
            <p className="text-blue-600 font-bold mt-1 uppercase tracking-tight">
              {election?.title || "Active Election"}
            </p>
            <p className="text-slate-500 mt-2">Please select your preferred candidate below.</p>
          </div>

          <div className="space-y-4">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <div 
                  key={candidate._id}
                  onClick={() => !submitting && setSelectedCandidate(candidate._id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedCandidate === candidate._id 
                    ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50" 
                    : "border-slate-100 hover:border-blue-200 bg-slate-50/30"
                  } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-slate-400 uppercase">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{candidate.name}</h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                        {candidate.party}
                      </p>
                    </div>
                  </div>
                  {selectedCandidate === candidate._id && (
                    <CheckCircle2 className="text-blue-600" size={24} />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-500 font-medium">No Candidates Found</p>
                <p className="text-slate-400 text-sm italic mt-1">REF_ID: {electionId}</p>
              </div>
            )}
          </div>

          {/* ✅ Connect the handleVoteSubmission to the button */}
          <button 
            onClick={handleVoteSubmission}
            disabled={!selectedCandidate || submitting}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Encrypting & Casting...
              </>
            ) : (
              "Cast Secure Vote"
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
            Powered by Secure Ledger Technology v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ballot;