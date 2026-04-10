import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [activeTab, setActiveTab] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 1. Auth Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password 
    });

    if (authError) throw authError;

    // 2. Database se role uthao (Bina kisi extra filter ke pehle check karte hain)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // --- DEBUGGING LOGS (Browser Console mein check karein) ---
    console.log("Logged In User ID:", authData.user.id);
    console.log("Database se mila profile data:", profile);
    
    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error("Profile table mein aapka data nahi mila.");
    }

    const dbRole = profile.role?.toLowerCase().trim();
    console.log("Final Role Cleaned:", dbRole);
    console.log("Selected Tab:", activeTab);

    // 3. Strict Navigation Logic
    if (activeTab === 'admin') {
      if (dbRole === 'admin') {
        navigate('/admin');
      } else {
        await supabase.auth.signOut();
        setError(`Ghalat Rasta! Aapka role database mein '${dbRole}' hai, 'admin' nahi.`);
        return;
      }
    } 
    else if (activeTab === 'student') {
      if (dbRole === 'student') {
        navigate('/student');
      } else {
        await supabase.auth.signOut();
        setError(`Access Denied: Aap Admin hain, Student portal login nahi kar sakte.`);
        return;
      }
    }

  } catch (err) {
    console.error("Login Error Details:", err);
    setError(err.message === "Invalid login credentials" ? "Email ya Password ghalat hai." : err.message);
  } finally {
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
          justify-content: center;
        }
        .right-panel {
          flex: 1;
          padding: 50px;
          background: #fff;
        }
        @media (max-width: 850px) {
          .main-container { flex-direction: column; }
          .left-panel { display: none; }
          .right-panel { padding: 40px 25px; }
        }
      `}</style>

      <div className="main-container">
        
        <div className="left-panel">
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, marginBottom: 25 }}>S</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Welcome Back to <br /> <span style={{ color: "#34d399" }}>SMIT Connect.</span>
          </h1>
          <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.6 }}>
            Login to access your dashboard, track your progress, and stay updated with your classes.
          </p>
        </div>

        <div className="right-panel">
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", margin: 0 }}>Login</h2>
            <p style={{ color: "#64748b", marginTop: 5 }}>Sign in to your portal account</p>
          </div>

          <div style={{ display: "flex", background: "#f1f5f9", padding: "5px", borderRadius: "14px", marginBottom: "25px" }}>
            <button 
              onClick={() => { setActiveTab('student'); setError(''); }}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", background: activeTab === 'student' ? "#fff" : "transparent", color: activeTab === 'student' ? "#059669" : "#64748b", transition: "0.3s" }}
            >
              Student
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setError(''); }}
              style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", background: activeTab === 'admin' ? "#fff" : "transparent", color: activeTab === 'admin' ? "#059669" : "#64748b", transition: "0.3s" }}
            >
              Admin
            </button>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "#fef2f2", color: "#dc2626", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", border: "1px solid #fee2e2" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                 <label style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Password</label>
                 <Link to="/forgot" style={{ fontSize: 12, color: "#059669", fontWeight: 700, textDecoration: "none" }}>Forgot Password?</Link>
              </div>
              <input
                type="password"
                placeholder="admin123 "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "13px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc", boxSizing: "border-box" }}
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
              {loading ? "Signing in..." : `Sign in as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 25, color: "#64748b", fontSize: 14 }}>
            New student? <Link to="/signup" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;