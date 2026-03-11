import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { 
  PlusCircle, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  LayoutDashboard, 
  Calendar,
  X,
  FileText,
  ShieldCheck,
  MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Updated state to include minAge and requiredDistrict
  const initialFormState = { 
    title: '', 
    description: '', 
    type: 'National', 
    startDate: '', 
    endDate: '',
    minAge: 18,
    requiredDistrict: 'All'
  };
  const [newElection, setNewElection] = useState(initialFormState);

  // List of some common districts for selection (You can expand this)
  const nepalDistricts = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Kaski", "Chitwan", "Morang", 
    "Sunsari", "Jhapa", "Rupandehi", "Banke", "Kailali", "Dhanusa", "Parsa"
  ];

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchElections();
    }
  }, [user, navigate]);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await API.get('/elections');
      setElections(res.data);
    } catch (err) {
      console.error("Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/elections/create', newElection);
      setShowModal(false);
      setNewElection(initialFormState);
      fetchElections();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create election");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.put(`/elections/toggle/${id}`);
      fetchElections();
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium">Loading Management Console...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <LayoutDashboard className="text-blue-600" size={32} /> Admin Control Panel
            </h1>
            <p className="text-slate-500 mt-1">Manage global elections and eligibility rules</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <PlusCircle size={20} /> Create New Election
          </button>
        </div>

        {/* Elections Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Election & Rules</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {elections.length > 0 ? (
                elections.map((election) => (
                  <tr key={election._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{election.title}</div>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                           <ShieldCheck size={10}/> Age: {election.minAge}+
                         </span>
                         <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100 flex items-center gap-1">
                           <MapPin size={10}/> {election.requiredDistrict}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{election.type}</td>
                    <td className="px-6 py-4">
                      {election.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle size={14} /> ACTIVE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-full w-fit">
                          <XCircle size={14} /> CLOSED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleStatus(election._id)} 
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            election.isActive 
                            ? "border-red-200 text-red-600 hover:bg-red-50" 
                            : "border-green-200 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {election.isActive ? "End" : "Start"}
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/candidates/${election._id}`)} 
                          className="p-2 text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Users size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No elections found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Create Election Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={24} /></div>
              <h2 className="text-2xl font-bold text-slate-900">Configure Election</h2>
            </div>

            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={newElection.title}
                  onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 outline-none"
                  value={newElection.description}
                  onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                />
              </div>

              {/* Eligibility Settings */}
              <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Min. Age</label>
                  <input 
                    type="number" required min="18"
                    className="w-full p-2 bg-white border border-blue-200 rounded-lg outline-none"
                    value={newElection.minAge}
                    onChange={(e) => setNewElection({...newElection, minAge: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-700 uppercase mb-1">District Restriction</label>
                  <select 
                    className="w-full p-2 bg-white border border-blue-200 rounded-lg outline-none"
                    value={newElection.requiredDistrict}
                    onChange={(e) => setNewElection({...newElection, requiredDistrict: e.target.value})}
                  >
                    <option value="All">All Nepal</option>
                    {nepalDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={newElection.startDate}
                    onChange={(e) => setNewElection({...newElection, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={newElection.endDate}
                    onChange={(e) => setNewElection({...newElection, endDate: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Publish Election"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;