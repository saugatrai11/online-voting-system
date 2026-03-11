import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  Users, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  UserPlus,
  Image as ImageIcon
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
    description: '',
    imageUrl: '' // Added for real-world visual identification
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
      alert("Could not load election details. Returning to dashboard.");
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Sending the electionId in the body so the backend can link them
      await API.post('/candidates/add', { ...formData, electionId });
      
      setFormData({ name: '', party: '', description: '', imageUrl: '' });
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add candidate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this candidate? This cannot be undone.")) return;
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
          <ArrowLeft size={18} /> Back to Control Panel
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Party / Symbol</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Nepali Congress / UML"
                    value={formData.party}
                    onChange={(e) => setFormData({...formData, party: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Photo URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="url" 
                      className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="https://image-link.com/photo.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50 mt-2"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Register Candidate"}
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase mb-2 inline-block">Current Roster</span>
                <h2 className="text-2xl font-black text-slate-900">{election?.title}</h2>
                <p className="text-slate-500 text-sm mt-1">{election?.description?.substring(0, 100)}...</p>
              </div>

              <div className="divide-y divide-slate-100">
                {candidates.length > 0 ? (
                  candidates.map((c) => (
                    <div key={c._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-200" />
                        ) : (
                          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-slate-200">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{c.name}</h4>
                          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{c.party}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(c._id)}
                        className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Candidate"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <Users className="mx-auto text-slate-200 mb-4" size={64} />
                    <p className="text-slate-400 font-medium">No candidates registered. Use the form to add one.</p>
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