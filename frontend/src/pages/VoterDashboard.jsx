import { useState } from "react";

const VoterDashboard = () => {
  const [elections, setElections] = useState([
    { name: "Student Council", hasVoted: false },
    { name: "Class Rep", hasVoted: false },
  ]);

  const vote = (index) => {
    if (elections[index].hasVoted) {
      alert("You already voted in this election");
      return;
    }
    const updated = [...elections];
    updated[index].hasVoted = true;
    setElections(updated);
    alert("Vote submitted! ✅");
  };

  return (
    <div>
      <h2>Voter Dashboard</h2>
      <div>
        {elections.map((el, idx) => (
          <div key={idx}>
            <p>{el.name}</p>
            <button onClick={() => vote(idx)} disabled={el.hasVoted}>
              {el.hasVoted ? "Voted" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoterDashboard;
