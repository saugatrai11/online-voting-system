import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

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
        const [electionRes, candidateRes] = await Promise.all([
          API.get(`/elections/${electionId}`),
          API.get(`/candidates/election/${electionId}`) 
        ]);
        setElection(electionRes.data);
        setCandidates(candidateRes.data);
      } catch (err) {
        console.error("Ballot Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBallotData();
  }, [electionId]);

  const handleVoteSubmission = async () => {
    if (!selectedCandidate) return;

    if (!window.confirm("Confirm your vote? This cannot be changed.")) return;

    setSubmitting(true);
    try {
      const res = await API.post('/vote', {
        electionId,
        candidateId: selectedCandidate
      });

      alert(`Success! Receipt: ${res.data.receipt.substring(0, 16)}...`);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Voting failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-6 text-slate-500 font-medium">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl border">
          <div className="text-center mb-8">
            <ShieldCheck size={48} className="mx-auto text-blue-600 mb-2" />
            <h1 className="text-3xl font-black">{election?.title}</h1>
            <p className="text-slate-500">Select one candidate</p>
          </div>

          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div 
                key={candidate._id}
                onClick={() => !submitting && setSelectedCandidate(candidate._id)}
                className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  selectedCandidate === candidate._id ? "border-blue-600 bg-blue-50" : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{candidate.name}</h3>
                    <p className="text-xs text-blue-600 font-bold uppercase">{candidate.party}</p>
                  </div>
                </div>
                {selectedCandidate === candidate._id && <CheckCircle2 className="text-blue-600" />}
              </div>
            ))}
          </div>

          <button 
            onClick={handleVoteSubmission}
            disabled={!selectedCandidate || submitting}
            className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-2xl disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Cast Secure Vote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ballot;