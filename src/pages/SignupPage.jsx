import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cnic: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          cnic: formData.cnic,
        }
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert("Registration Successful! ");
      navigate("/login");
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "15px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        
        input:focus { 
          outline: none; 
          border-color: #10b981 !important; 
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); 
        }

        .main-container {
          display: flex;
          flex-direction: row;
          width: 100%;
          max-width: 1000px;
          background: #fff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }

        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
          padding: 50px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justifyContent: center;
        }

        .right-panel {
          flex: 1;
          padding: 50px;
          background: #fff;
        }

        /* Responsive Mobile Styles */
        @media (max-width: 850px) {
          .main-container {
            flex-direction: column;
            border-radius: 20px;
          }
          .left-panel {
            padding: 40px 30px;
            text-align: center;
            align-items: center;
          }
          .right-panel {
            padding: 40px 25px;
          }
          .hero-title {
            font-size: 32px !important;
          }
          .logo-img {
            margin: 0 auto 20px auto !important;
          }
        }
      `}</style>

      <div className="main-container ">

        {/* LEFT SIDE: Info */}
        <div className="left-panel flex justify-center flex-col order-2F">
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>S</div>

          <h1 className="hero-title" style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Start Your <br /> <span style={{ color: "#34d399" }}>Tech Journey</span> With Us.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.6 }}>
            Join the largest free IT training program in Pakistan and upgrade your skills.
          </p>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="right-panel">
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b" }}>Create Account</h2>
            <p style={{ color: "#64748b", marginTop: 5 }}>Join SMIT Batch 2025</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                required
                onChange={handleChange}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                required
                onChange={handleChange}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>CNIC</label>
              <input
                type="text"
                name="cnic"
                placeholder="42101XXXXXXX"
                required
                onChange={handleChange}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
              />
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.2)",
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 25, color: "#64748b", fontSize: 14 }}>
            Already have an account? <Link to="/login" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}