import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    cnic: ""
  });

  const [stats, setStats] = useState({
    totalStudents: '0',
    activeCourses: '14',
    pendingLeaves: '0',
    admins: '5',
  });

  // --- Functions ---
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (!error) {
      setStudentsList(data);
      setStats(prev => ({ ...prev, totalStudents: data.length.toString() }));
    }
    setLoading(false);
  };

  const fetchLeaves = async () => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setLeaveRequests(data);
      const pendingCount = data.filter(leave => leave.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingLeaves: pendingCount.toString() }));
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      alert(`Leave ${newStatus} successfully!`);
      fetchLeaves(); 
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchLeaves();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;
      const newUserId = authData?.user?.id;
      const { error: dbError } = await supabase
        .from('profiles')
        .insert([{ 
          id: newUserId, 
          full_name: formData.fullName, 
          email: formData.email, 
          cnic: formData.cnic, 
          rollNo: "SMIT-" + Math.floor(Math.random() * 1000),
          role: 'student' 
        }]);
      if (dbError) throw dbError;
      alert("Student added!");
      fetchStudents();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        tr:hover { background-color: #f1f5f9; transition: 0.2s; }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside style={{ width: "260px", background: "#fff", borderRight: "1px solid #e2e8f0", padding: "30px", display: "flex", flexDirection: "column", position: "fixed", height: "100vh" }}>
        <div style={{ marginBottom: "40px" }}>
          <img src="https://www.saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf2096.png" height="45" alt="SMIT" />
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <NavItem icon="📊" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon="👨‍🎓" label="Students" active={activeTab === 'students'} onClick={() => { setActiveTab('students'); fetchStudents(); }} />
          <NavItem icon="📚" label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <NavItem icon="✉️" label="Leave Requests" active={activeTab === 'leaves'} onClick={() => { setActiveTab('leaves'); fetchLeaves(); }} />
        </nav>

        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
              <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>A</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", margin: 0 }}>Admin Portal</p>
                <button onClick={handleLogout} style={{ color: "#ef4444", fontSize: "11px", border: "none", background: "none", cursor: "pointer" }}>Logout Account</button>
              </div>
           </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "40px" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
              {activeTab === 'dashboard' ? 'Admin Dashboard' : 
               activeTab === 'students' ? 'Student Management' : 
               activeTab === 'courses' ? 'Course Catalog' : 'Leave Requests'}
            </h2>
            <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Welcome back, SMIT Administrator</p>
          </div>
          
          {activeTab === 'students' && (
            <button onClick={() => setIsModalOpen(true)} style={{ background: "#059669", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
              + Add New Student
            </button>
          )}
        </header>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              <StatCard icon="👥" label="Total Students" value={stats.totalStudents} color="#0284c7" bg="#f0f9ff" />
              <StatCard icon="📖" label="Active Courses" value={stats.activeCourses} color="#059669" bg="#f0fdf4" />
              <StatCard icon="📅" label="Pending Leaves" value={stats.pendingLeaves} color="#d97706" bg="#fffbeb" />
              <StatCard icon="🛡️" label="Admins" value={stats.admins} color="#7c3aed" bg="#f5f3ff" />
            </div>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Recent Activity</h3>
                <ActivityItem desc="System check performed by Admin" time="10 mins ago" />
                <ActivityItem desc={`Total ${stats.totalStudents} students verified`} time="1 hour ago" />
            </div>
          </>
        )}

        {/* 2. STUDENTS TAB */}
        {activeTab === 'students' && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Registered Students List</h3>
              <button onClick={fetchStudents} style={{ color: "#059669", background: "none", border: "none", fontWeight: "600", cursor: "pointer" }}>🔄 Refresh</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>STUDENT NAME</th>
                  <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>EMAIL ADDRESS</th>
                  <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>CNIC</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((st) => (
                  <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "15px", fontWeight: "600" }}>{st.full_name}</td>
                    <td style={{ padding: "15px" }}>{st.email}</td>
                    <td style={{ padding: "15px" }}>{st.cnic || "---"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. COURSES TAB (Naya Section) */}
        {activeTab === 'courses' && (
          <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
             <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Available Courses</h3>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                {["Web & Mobile App Development", "Graphic Design", "Python Chatbot", "Video Editing", "Digital Marketing"].map(course => (
                  <div key={course} style={{ padding: "20px", borderRadius: "15px", border: "1px solid #f1f5f9", background: "#f8fafc" }}>
                    <p style={{ fontWeight: "700", margin: 0 }}>{course}</p>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>Batch 10 - Active</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* 4. LEAVES TAB */}
        {activeTab === 'leaves' && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
             <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Pending Requests</h3>
                <button onClick={fetchLeaves} style={{ color: "#059669", background: "none", border: "none", cursor: "pointer" }}>🔄 Refresh</button>
             </div>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f8fafc" }}>
                   <tr style={{ textAlign: "left" }}>
                      <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>REASON</th>
                      <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>DATES</th>
                      <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>STATUS</th>
                      <th style={{ padding: "15px", color: "#64748b", fontSize: "13px" }}>ACTION</th>
                   </tr>
                </thead>
                <tbody>
                   {leaveRequests.map((lr) => (
                     <tr key={lr.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "15px", fontWeight: "600" }}>{lr.reason}</td>
                        <td style={{ padding: "15px", fontSize: "13px" }}>{lr.start_date} to {lr.end_date}</td>
                        <td style={{ padding: "15px" }}>
                           <span style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", background: lr.status === 'pending' ? '#fffbeb' : '#f0fdf4', color: lr.status === 'pending' ? '#d97706' : '#16a34a' }}>
                             {lr.status.toUpperCase()}
                           </span>
                        </td>
                        <td style={{ padding: "15px" }}>
                           {lr.status === 'pending' && (
                             <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => updateLeaveStatus(lr.id, 'approved')} style={{ background: "#059669", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Approve</button>
                                <button onClick={() => updateLeaveStatus(lr.id, 'rejected')} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Reject</button>
                             </div>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </main>

      {/* --- ADD STUDENT MODAL --- */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={() => setIsModalOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(3px)" }}></div>
          <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: "400px", borderRadius: "20px", padding: "35px" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>Add New Student</h3>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <input type="text" placeholder="CNIC" required onChange={(e) => setFormData({...formData, cnic: e.target.value})} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#f1f5f9", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#059669", color: "#fff", cursor: "pointer" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderRadius: "10px", cursor: "pointer", background: active ? "#059669" : "transparent", color: active ? "#fff" : "#64748b", fontWeight: "600" }}>
    <span style={{ fontSize: "18px" }}>{icon}</span>
    <span style={{ fontSize: "14px" }}>{label}</span>
  </div>
);

const StatCard = ({ icon, label, value, color, bg }) => (
  <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
    <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: color, marginBottom: "15px" }}>{icon}</div>
    <p style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", margin: "0 0 5px 0" }}>{label}</p>
    <p style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{value}</p>
  </div>
);

const ActivityItem = ({ desc, time }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
    <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>{desc}</p>
    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{time}</span>
  </div>
);

export default AdminDashboard;