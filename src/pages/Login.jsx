import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom';
import smit from '../assets/smit.png'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();
if (!profile) {
  await supabase.auth.signOut();
  setError("Your Account is not authorized Please contact to admin");
  return;
}
      if (profileError) throw profileError;

      const userRole = profile?.role?.trim().toLowerCase();

      if (email === 'admin@gmail.com' || userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'student') {
        navigate('/student');
      } else {
        setError("Unauthorized role: " + profile?.role);
      }
    } catch (err) {
      setError(err.message);
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
        input:focus { outline: none; border-color: #10b981 !important; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        
        .login-container {
          display: flex;
          width: 100%;
          max-width: 1000px;
          background: #fff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 850px) {
          .login-container { flex-direction: column; }
          .left-info { display: none; } /* Mobile par left panel hide kar diya for cleaner login */
          .right-form { padding: 40px 25px; }
        }
      `}</style>

      <div className="login-container">
        
        {/* LEFT PANEL - Branding */}
        <div className="left-info" style={{ 
          flex: 1, 
          background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)", 
          padding: "60px", 
          color: "#fff", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center"
        }}>
          <img src={smit} width={100} alt="SMIT"  />
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
            Welcome Back to <br/> <span style={{ color: "#34d399" }}>SMIT Connect</span>
          </h1>
          <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.6 }}>
            Login to access your dashboard, track your attendance, and manage your courses.
          </p>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="right-form" style={{ flex: 1, padding: "60px", background: "#fff" }}>
          <div style={{ marginBottom: 35 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>Login</h2>
            <p style={{ color: "#64748b", marginTop: 5 }}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "#fef2f2", color: "#dc2626", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", border: "1px solid #fee2e2" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 15, background: "#f8fafc" }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: 25 }}>
              <Link to="/forgot-password" style={{ fontSize: "13px", color: "#059669", fontWeight: 600, textDecoration: "none" }}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: "100%", 
              padding: "16px", 
              background: "#059669", 
              color: "#fff", 
              border: "none", 
              borderRadius: "12px", 
              fontSize: 16, 
              fontWeight: 700, 
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.3)",
              opacity: loading ? 0.8 : 1
            }}>
              {loading ? "Signing in..." : "Login to Portal"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 30, color: "#64748b", fontSize: 14 }}>
            New Student? <Link to="/signup" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;