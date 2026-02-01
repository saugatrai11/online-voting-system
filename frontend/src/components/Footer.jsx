const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.grid}>
        
        {/* About */}
        <div>
          <h3>Online Voting System</h3>
          <p>Secure & Transparent Digital Voting Platform</p>
        </div>

        {/* Links */}
        <div>
          <h4>Quick Links</h4>
          <ul style={styles.list}>
            <li>Home</li>
            <li>About</li>
            <li>Elections</li>
            <li>Results</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4>Support</h4>
          <ul style={styles.list}>
            <li>FAQ</li>
            <li>Help Center</li>
            <li>Security</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4>Contact</h4>
          <p>Email: support@voting.com</p>
          <p>Phone: +977 9800000000</p>
        </div>

      </div>

      <p style={styles.copy}>
        © {new Date().getFullYear()} Online Voting System — All Rights Reserved
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#0f172a",
    color: "white",
    padding: "40px",
    marginTop: "40px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8"
  },
  copy: {
    textAlign: "center",
    marginTop: "25px",
    opacity: 0.7
  }
};

export default Footer;
