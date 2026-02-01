import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1>Secure Online Voting System</h1>
          <p>
            A transparent, secure and fast digital voting platform built for fair elections.
          </p>
          <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </section>

      {/* LATEST NEWS */}
      <section style={styles.section}>
        <h2>📰 Latest Election News</h2>
        <div style={styles.grid}>
          <div style={styles.card}>🗳️ Student Council Elections Open</div>
          <div style={styles.card}>📢 New Voting Rules Announced</div>
          <div style={styles.card}>🔒 Improved Security Updates</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.sectionAlt}>
        <h2>⚙️ How Voting Works</h2>
        <div style={styles.grid}>
          <div style={styles.infoCard}>1️⃣ Register & Verify</div>
          <div style={styles.infoCard}>2️⃣ Login Securely</div>
          <div style={styles.infoCard}>3️⃣ Vote Only Once</div>
          <div style={styles.infoCard}>4️⃣ View Live Results</div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2>✨ Key Features</h2>
        <div style={styles.grid}>
          <div style={styles.featureCard}>🔐 Secure Authentication</div>
          <div style={styles.featureCard}>📊 Real-Time Results</div>
          <div style={styles.featureCard}>👨‍💼 Admin Control Panel</div>
          <div style={styles.featureCard}>🧾 Verified Voting System</div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2>Ready to Vote?</h2>
        <p>Sign up now and take part in secure elections.</p>
        <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
          Login to Vote
        </button>
      </section>

      <Footer />
    </>
  );
};

const styles = {
  hero: {
    height: "80vh",
    background: "linear-gradient(to right, #1e3a8a, #2563eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center"
  },
  heroContent: {
    maxWidth: "600px"
  },
  primaryBtn: {
    marginTop: "20px",
    padding: "12px 25px",
    background: "white",
    color: "#2563eb",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  },
  secondaryBtn: {
    marginTop: "15px",
    padding: "12px 25px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  },
  section: {
    padding: "60px 40px",
    textAlign: "center"
  },
  sectionAlt: {
    padding: "60px 40px",
    textAlign: "center",
    background: "#f8fafc"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "25px"
  },
  card: {
    padding: "20px",
    background: "#f1f5f9",
    borderRadius: "10px"
  },
  infoCard: {
    padding: "20px",
    background: "#e0f2fe",
    borderRadius: "10px",
    fontWeight: "bold"
  },
  featureCard: {
    padding: "20px",
    background: "#ecfeff",
    borderRadius: "10px",
    fontWeight: "bold"
  },
  cta: {
    padding: "70px 30px",
    background: "#0f172a",
    color: "white",
    textAlign: "center"
  }
};

export default Home;
