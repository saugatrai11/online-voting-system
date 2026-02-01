import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser } from "../services/authService";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyUser({ email, code });
      alert(res.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Verification failed");
    }
  };

  return (
    <div>
      <h2>Verify Email</h2>
      <p>Enter the verification code sent to {email}</p>
      <form onSubmit={handleVerify}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification Code"
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify;
