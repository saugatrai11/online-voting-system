import { useState } from "react";

const AdminDashboard = () => {
  const [electionName, setElectionName] = useState("");
  const [elections, setElections] = useState([]);

  const createElection = () => {
    if (!electionName) return alert("Enter election name");
    setElections([...elections, { name: electionName, candidates: [] }]);
    setElectionName("");
    alert("Election created (frontend only for now)");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Create Election</h3>
        <input
          placeholder="Election Name"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
        />
        <button onClick={createElection}>Create</button>
      </div>

      <div>
        <h3>Existing Elections</h3>
        {elections.length === 0 ? (
          <p>No elections yet</p>
        ) : (
          elections.map((el, idx) => <p key={idx}>{el.name}</p>)
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
