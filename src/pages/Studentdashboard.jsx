import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Leave Logic States ---
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaveData, setLeaveData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    attachment_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error("Profile Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // --- Submit Leave Function ---
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('leaves')
        .insert([{
          stud_id: user.id,
          start_date: leaveData.start_date,
          end_date: leaveData.end_date,
          reason: leaveData.reason,
          attachment_url: leaveData.attachment_url,
          status: 'pending'
        }]);

      if (error) throw error;

      alert("Leave request submitted successfully!");
      setIsLeaveModalOpen(false); // Modal band ho jaye
      setLeaveData({ start_date: '', end_date: '', reason: '', attachment_url: '' }); // Form clear
    } catch (err) {
      alert("Submission Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <div className="spinner">Loading Portal...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
      `}</style>

      {/* --- TOP NAVBAR --- */}
      <nav style={{ background: "#fff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
        <img src="https://www.smit.ee/social-1200x630.png" width={100} alt="SMIT" />
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "14px" }}>{profile?.fullName || "Student"}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>ID: {profile?.rollNo || "Pending"}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #ef4444", color: "#ef4444", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
            Logout
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
        <header style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
            Assalam-o-Alaikum, {profile?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: "#64748b", marginTop: "5px" }}>Welcome to Saylani Mass IT Training Student Portal.</p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <DashboardCard icon="🆔" label="Roll Number" value={profile?.rollNo || "Generating..."} color="#0ea5e9" />
          <DashboardCard icon="📧" label="Registered Email" value={profile?.email} color="#8b5cf6" />
          <DashboardCard icon="🪪" label="CNIC Number" value={profile?.cnic || "Not Provided"} color="#f59e0b" />
          <DashboardCard icon="🎓" label="Course Status" value="Active Student" color="#10b981" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
          <section style={{ background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>📢 Announcements</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <NotificationItem title="Class Schedule Update" desc="Upcoming Friday class will be held online via Zoom." date="Today" />
              <NotificationItem title="Exam Registration" desc="Mid-term registration is now open." date="Yesterday" />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#059669", padding: "25px", borderRadius: "20px", color: "#fff" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>Attendance QR</h4>
              <p style={{ fontSize: "13px", opacity: 0.9 }}>Show your ID card at the entrance to mark attendance.</p>
              <button style={{ width: "100%", marginTop: "15px", padding: "10px", borderRadius: "10px", border: "none", background: "#fff", color: "#059669", fontWeight: "700", cursor: "pointer" }}>View ID Card</button>
            </div>
            
            <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <QuickLink icon="📝" text="Submit Assignment" />
                {/* Yahan modal khulne ka function add kiya hai */}
                <QuickLink icon="📅" text="Apply for Leave" onClick={() => setIsLeaveModalOpen(true)} />
                <QuickLink icon="📜" text="View Result" />
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* --- LEAVE MODAL --- */}
      {isLeaveModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>Request Leave</h2>
              <button onClick={() => setIsLeaveModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>&times;</button>
            </div>

            <form onSubmit={handleLeaveSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "5px", display: "block" }}>Start Date</label>
                  <input type="date" required value={leaveData.start_date} onChange={(e) => setLeaveData({...leaveData, start_date: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "5px", display: "block" }}>End Date</label>
                  <input type="date" required value={leaveData.end_date} onChange={(e) => setLeaveData({...leaveData, end_date: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "5px", display: "block" }}>Reason</label>
                <textarea required rows="3" value={leaveData.reason} onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})} placeholder="Mention reason for leave..." style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", resize: "none" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "5px", display: "block" }}>Attachment URL (Optional)</label>
                <input type="text" value={leaveData.attachment_url} onChange={(e) => setLeaveData({...leaveData, attachment_url: e.target.value})} placeholder="Doc link (Google Drive / Image link)" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#059669", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS (QuickLink update kiya hai onClick ke liye) ---

const DashboardCard = ({ icon, label, value, color }) => (
  <div style={{ background: "#fff", padding: "20px", borderRadius: "18px", border: "1px solid #e2e8f0", borderLeft: `5px solid ${color}` }}>
    <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
    <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>{label}</p>
    <p style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>{value}</p>
  </div>
);

const NotificationItem = ({ title, desc, date }) => (
  <div style={{ padding: "15px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>{title}</h4>
      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{date}</span>
    </div>
    <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{desc}</p>
  </div>
);

const QuickLink = ({ icon, text, onClick }) => (
  <li 
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", fontSize: "14px", color: "#475569", fontWeight: "600" }}
  >
    <span>{icon}</span> {text}
  </li>
);

export default StudentDashboard;