import { useState } from 'react';
export default function StationLocator() {
  const [input, setInput] = useState('');
  const [res, setRes] = useState('');
  const find = () => {
    const data = { "Kathmandu": "Ratna Rajya School", "Lalitpur": "Patan School" };
    setRes(data[input] || "General Office");
  };
  return (
    <div className="bg-white p-6 rounded-3xl border">
      <h3 className="font-bold mb-4">Polling Station</h3>
      <input className="border p-2 w-full rounded mb-2" onChange={(e) => setInput(e.target.value)} />
      <button onClick={find} className="bg-blue-600 text-white w-full py-2 rounded">Find</button>
      {res && <p className="mt-3 font-semibold text-blue-600">{res}</p>}
    </div>
  );
}