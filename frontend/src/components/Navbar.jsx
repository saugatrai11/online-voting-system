import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <h2 style={styles.logo}>🗳️ Voting System</h2>

      {/* Links */}
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>

        <li><Link to="/about" style={styles.link}>About</Link></li>

        <li><Link to="/elections" style={styles.link}>Elections</Link></li>

        {/* Dropdown */}
        <li
          style={styles.dropdown}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span style={styles.link}>Features ▾</span>

          {showDropdown && (
            <ul style={styles.dropdownMenu}>
              <li><Link to="/how-it-works" style={styles.dropdownItem}>How Voting Works</Link></li>
              <li><Link to="/security" style={styles.dropdownItem}>Security</Link></li>
              <li><Link to="/results" style={styles.dropdownItem}>Live Results</Link></li>
              <li><Link to="/faq" style={styles.dropdownItem}>FAQ</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/contact" style={styles.link}>Contact</Link></li>
      </ul>

      {/* Right Buttons */}
      <div>
        {!token ? (
          <>
            <button style={styles.button} onClick={() => navigate("/login")}>Login</button>
            <button style={styles.buttonOutline} onClick={() => navigate("/register")}>Register</button>
          </>
        ) : (
          <>
            {role === "admin" && (
              <button style={styles.button} onClick={() => navigate("/admin")}>
                Admin Panel
              </button>
            )}

            {role === "voter" && (
              <button style={styles.button} onClick={() => navigate("/voter")}>
                Dashboard
              </button>
            )}

            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "#0f172a",
    color: "white"
  },
  logo: {
    fontWeight: "bold"
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "15px"
  },
  dropdown: {
    position: "relative",
    cursor: "pointer"
  },
  dropdownMenu: {
    position: "absolute",
    top: "25px",
    left: "0",
    background: "#1e293b",
    listStyle: "none",
    padding: "10px",
    borderRadius: "6px",
    width: "170px"
  },
  dropdownItem: {
    display: "block",
    padding: "8px",
    color: "white",
    textDecoration: "none"
  },
  button: {
    padding: "8px 14px",
    marginRight: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  },
  buttonOutline: {
    padding: "8px 14px",
    border: "1px solid #2563eb",
    background: "transparent",
    color: "#2563eb",
    borderRadius: "6px",
    cursor: "pointer"
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#dc2626",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Navbar;
