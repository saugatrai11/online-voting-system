import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { PlusCircle, Users, CheckCircle, XCircle, Loader2, LayoutDashboard, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const initialFormState = { title: '', description: '', type: 'National', startDate: '', endDate: '' };
  const [newElection, setNewElection] = useState(initialFormState);

  useEffect(() => { fetchElections(); }, []);

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
    try {
      await API.post('/elections/create', newElection);
      setShowModal(false);
      setNewElection(initialFormState);
      fetchElections();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create election");
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

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2"><LayoutDashboard /> Admin Panel</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <PlusCircle size={20} /> Create New Election
          </button>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase">Election Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {elections.map((election) => (
                <tr key={election._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold">{election.title}</td>
                  <td className="px-6 py-4">
                    {election.isActive ? <span className="text-green-600">ACTIVE</span> : <span className="text-red-600">CLOSED</span>}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => toggleStatus(election._id)} className="border px-3 py-1 rounded">
                      {election.isActive ? "Close" : "Open"}
                    </button>
                    <button onClick={() => navigate(`/admin/candidates/${election._id}`)} className="p-2 bg-slate-100 rounded">
                      <Users size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal logic remains same as provided */}
    </div>
  );
};

export default AdminDashboard;