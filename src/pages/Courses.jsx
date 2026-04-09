import React, { useState } from 'react';

const COURSES_DATA = [
  { id: 1, name: "Web & Mobile Development", icon: "💻", duration: "6 Months", status: "open", students: 1240, desc: "Master MERN Stack and Mobile App development from scratch." },
  { id: 2, name: "AI & Machine Learning", icon: "🤖", duration: "8 Months", status: "open", students: 890, desc: "Learn Python, Deep Learning and Neural Networks." },
  { id: 3, name: "Cybersecurity", icon: "🔐", duration: "4 Months", status: "closed", students: 650, desc: "Ethical hacking and network security professional course." },
  { id: 4, name: "Cloud Computing", icon: "☁️", duration: "5 Months", status: "open", students: 720, desc: "Learn AWS, Docker, and Kubernetes deployment." },
  { id: 5, name: "UI/UX Design", icon: "🎨", duration: "3 Months", status: "open", students: 980, desc: "Modern interface design using Figma and Adobe XD." },
  { id: 6, name: "Graphic Design", icon: "🖌️", duration: "4 Months", status: "open", students: 1500, desc: "Professional visual communication and branding." },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  return (
    <div style={{ background: "#f0fdf4", minHeight: "100vh", padding: "100px 20px 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@800&display=swap');
        .course-card { transition: all 0.3s ease; border: 1px solid #d1fae5; }
        .course-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(5,150,105,0.1); border-color: #10b981; }
        .modal-fade { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header Section */}
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", marginBottom: 50 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, color: "#064e3b", marginBottom: 10 }}>Available Courses</h1>
        <p style={{ color: "#059669", fontSize: 18, fontWeight: 500 }}>Unlock your potential with our free world-class IT programs</p>
      </div>

      {/* Courses Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 25 }}>
        {COURSES_DATA.map((course) => (
          <div key={course.id} className="course-card" style={{ background: "#fff", borderRadius: 24, padding: 30, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, background: "#ecfdf5", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                {course.icon}
              </div>
              <span style={{ 
                height: "fit-content", padding: "6px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: course.status === 'open' ? "#d1fae5" : "#fee2e2",
                color: course.status === 'open' ? "#065f46" : "#991b1b"
              }}>
                {course.status === 'open' ? "● ADMISSIONS OPEN" : "✕ CLOSED"}
              </span>
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#064e3b", marginBottom: 10 }}>{course.name}</h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{course.desc}</p>
            
            <div style={{ display: "flex", gap: 15, marginBottom: 25, fontSize: 13, fontWeight: 600, color: "#059669" }}>
              <span>⏱ {course.duration}</span>
              <span>👥 {course.students}+ Enrolled</span>
            </div>

            <button 
              disabled={course.status !== 'open'}
              onClick={() => handleApply(course)}
              style={{
                width: "100%", padding: "14px", borderRadius: 14, border: "none", fontWeight: 700, fontSize: 15, cursor: course.status === 'open' ? "pointer" : "not-allowed",
                background: course.status === 'open' ? "linear-gradient(135deg, #10b981, #059669)" : "#e2e8f0",
                color: course.status === 'open' ? "#fff" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              {course.status === 'open' ? "Apply Now →" : "Admissions Closed"}
            </button>
          </div>
        ))}
      </div>

      {/* --- ADMISSION FORM POPUP (MODAL) --- */}
      {showModal && (
        <div className="modal-fade" style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={() => setShowModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(6, 78, 59, 0.7)", backdropFilter: "blur(8px)" }}></div>
          
          <div style={{ position: "relative", background: "#fff", width: "100%", maxWidth: "600px", borderRadius: 32, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #10b981, #064e3b)", padding: "30px", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800 }}>Admission Form</h2>
                  <p style={{ opacity: 0.8, fontSize: 14 }}>Applying for: {selectedCourse?.name}</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer" }}>&times;</button>
              </div>
            </div>

            {/* Modal Body */}
            <form style={{ padding: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} onSubmit={(e) => { e.preventDefault(); alert("Application Submitted!"); setShowModal(false); }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Full Name</label>
                <input required type="text" placeholder="Enter your full name" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Father Name</label>
                <input required type="text" placeholder="Father name" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>CNIC / B-Form</label>
                <input required type="text" placeholder="42101-XXXXXXX-X" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Email</label>
                <input required type="email" placeholder="email@example.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Phone Number</label>
                <input required type="tel" placeholder="03XXXXXXXXX" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none" }} />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Last Qualification</label>
                <select style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", outline: "none", background: "#fff" }}>
                  <option>Matric</option>
                  <option>Intermediate</option>
                  <option>Graduate</option>
                  <option>Masters</option>
                </select>
              </div>

              <div style={{ gridColumn: "span 2", paddingTop: 10 }}>
                <button type="submit" style={{
                  width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "#10b981", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 10px 20px rgba(16,185,129,0.2)"
                }}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}