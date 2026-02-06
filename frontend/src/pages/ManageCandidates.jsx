import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  UserPlus, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  User, 
  Flag, 
  ShieldAlert 
} from 'lucide-react';

const ManageCandidates = () => {
  // ✅ Ensure this matches the dynamic segment in your App.jsx route (e.g., /admin/candidates/:electionId)
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: '', party: '' });

  useEffect(() => {
    if (electionId) {
      fetchData();
    }
  }, [electionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // ✅ Fix: Use the '/election/' prefix to match the backend route
      const [electionRes, candidatesRes] = await Promise.all([
        API.get(`/elections/${electionId}`),
        API.get(`/candidates/election/${electionId}`) 
      ]);

      setElection(electionRes.data);
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
      alert("Could not load election or candidate details. Check if the IDs are correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ Fix: Ensure we are hitting /candidates/add
      await API.post(`/candidates/add`, { 
        ...formData, 
        electionId 
      });
      
      setFormData({ name: '', party: '' });
      fetchData(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Are you sure? This will remove the candidate from the ballot.")) return;
    try {
      await API.delete(`/candidates/${id}`);
      fetchData();
    } catch (err) {
      alert("Error deleting candidate");
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium">Loading Candidates...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium cursor-pointer border-none bg-transparent"
        >
          <ArrowLeft size={18} /> Back to Admin Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-10">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                <UserPlus size={20} />
                <h2 className="font-bold text-lg text-slate-900">Add Candidate</h2>
              </div>
              
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Party / Affiliation</label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="e.g. Independent"
                      value={formData.party}
                      onChange={(e) => setFormData({...formData, party: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Register Candidate"}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Election Management</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{election?.title || "Election Ballot"}</h1>
              <p className="text-slate-500 text-sm mt-2">Manage the ballot options for this specific election.</p>
            </div>

            <div className="space-y-3">
              {candidates.length > 0 ? (
                candidates.map((c) => (
                  <div 
                    key={c._id} 
                    className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-blue-300 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{c.name}</h3>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {c.party}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteCandidate(c._id)}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Remove Candidate"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-3xl text-center">
                  <ShieldAlert className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-medium">No candidates registered for this election yet.</p>
                  <p className="text-slate-300 text-sm mt-1">Use the form to the left to get started.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;