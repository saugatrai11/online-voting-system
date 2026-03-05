import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  UserPlus,
  Shield
} from 'lucide-react';

const ManageCandidates = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    party: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [electionRes, candidateRes] = await Promise.all([
        API.get(`/elections/${electionId}`),
        API.get(`/candidates/election/${electionId}`)
      ]);
      setElection(electionRes.data);
      setCandidates(candidateRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ FIX: Most backends need the electionId associated with the candidate
      // We send it in the body so the backend knows which election this person belongs to
      await API.post('/candidates/add', { ...formData, electionId });
      
      setFormData({ name: '', party: '', description: '' });
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Add Error:", err);
      alert(err.response?.data?.msg || "Failed to add candidate. Check backend routes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this candidate?")) return;
    try {
      await API.delete(`/candidates/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')} 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Elections
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-xl font-bold">Add Candidate</h2>
              </div>

              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Party Affiliation</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Democratic Party"
                    value={formData.party}
                    onChange={(e) => setFormData({...formData, party: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Bio / Description</label>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Candidate background..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Register Candidate"}
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">{election?.title}</h2>
                <p className="text-slate-500 text-sm italic">Managing candidate roster for this election</p>
              </div>

              <div className="divide-y divide-slate-100">
                {candidates.length > 0 ? (
                  candidates.map((c) => (
                    <div key={c._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{c.name}</h4>
                          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{c.party}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(c._id)}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Users className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium">No candidates registered yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;