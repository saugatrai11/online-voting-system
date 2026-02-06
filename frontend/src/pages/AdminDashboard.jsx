import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  PlusCircle, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2,
  LayoutDashboard,
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate hook
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const initialFormState = { 
    title: '', 
    description: '', 
    type: 'National', 
    startDate: '', 
    endDate: '' 
  };
  const [newElection, setNewElection] = useState(initialFormState);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await API.get('/elections');
      setElections(res.data);
    } catch (err) {
      console.error("Error fetching elections", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      await API.post('/elections/create', newElection);
      setShowModal(false);
      setNewElection(initialFormState);
      fetchElections();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to create election";
      alert(errorMsg);
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
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
      <p className="text-slate-500 font-medium">Loading Management Console...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" /> Admin Control Panel
            </h1>
            <p className="text-slate-500">Manage global elections and candidate registration</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <PlusCircle size={20} /> Create New Election
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Election Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {elections.length > 0 ? (
                elections.map((election) => (
                  <tr key={election._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{election.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase">{election.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      {election.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle size={14} /> ACTIVE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-full w-fit">
                          <XCircle size={14} /> CLOSED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => toggleStatus(election._id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          election.isActive 
                          ? "border-red-200 text-red-600 hover:bg-red-50" 
                          : "border-green-200 text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {election.isActive ? "Close Election" : "Open Election"}
                      </button>
                      
                      {/* ✅ Corrected Navigation using navigate() */}
                      <button 
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors inline-flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50"
                        title="Manage Candidates"
                        onClick={() => navigate(`/admin/candidates/${election._id}`)}
                      >
                        <Users size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No elections created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[95vh]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><PlusCircle size={24} /></div>
                <h2 className="text-2xl font-bold text-slate-900">Configure Election</h2>
              </div>

              <form onSubmit={handleCreateElection} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Election Title</label>
                  <input 
                    type="text" required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Presidential Election 2026"
                    value={newElection.title}
                    onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all"
                    placeholder="Details about this election..."
                    value={newElection.description}
                    onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Calendar size={14} /> Start Date
                    </label>
                    <input 
                      type="date" required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={newElection.startDate}
                      onChange={(e) => setNewElection({...newElection, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Calendar size={14} /> End Date
                    </label>
                    <input 
                      type="date" required
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={newElection.endDate}
                      onChange={(e) => setNewElection({...newElection, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Launch Election
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;