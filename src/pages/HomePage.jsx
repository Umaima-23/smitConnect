import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const FACEBOOK_POSTS = [
  {
    id: 1,
    text: "🎉 SMIT is now accepting applications for the Spring 2025 batch! Join thousands of students who have transformed their careers through our free IT programs.",
     image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv5LVRvbEYO_xFFqBHadCm5XE7rQvGcMpkTg&s',
    date: "2 hours ago",
    url: "https://www.facebook.com/saylani.smit"
  },
  {
    id: 2,
    text: "🏆 Congratulations to our Web Development graduates! Our latest batch achieved a 94% placement rate within 3 months. Hard work pays off!",
image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUVvj52QHJU1cwHx9QkLZxvMfe0RBadlksg&s',
    date: "Yesterday",
    url: "https://www.facebook.com/saylani.smit"
  },
  {
    id: 3,
    text: "📢 New Course Alert: Artificial Intelligence & Machine Learning batch starting January 2025. Limited seats available. Registration closes soon!",
image:'https://i.ytimg.com/vi/5zloFgmG3UE/maxresdefault.jpg',
    date: "2 days ago",
    url: "https://www.facebook.com/saylani.smit"
  }
];

const COURSES = [
  { id: 1, name: "Web & Mobile Development", icon: "💻", duration: "6 Months", status: "open", students: 1240 },
  { id: 2, name: "AI & Machine Learning", icon: "🤖", duration: "8 Months", status: "open", students: 890 },
  { id: 3, name: "Cybersecurity", icon: "🔐", duration: "4 Months", status: "closed", students: 650 },
];

const STATS = [
  { value: "50K+", label: "Graduates", icon: "🎓" },
  { value: "200+", label: "Expert Trainers", icon: "👨‍🏫" },
  { value: "15+", label: "Programs", icon: "📚" },
  { value: "94%", label: "Placement Rate", icon: "💼" },
];

export default function SMITHomePage() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f0fdf4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .hero-text-2 { animation: fadeUp 0.8s 0.15s ease forwards; opacity: 0; }
        .card-hover { transition: all 0.3s ease; cursor: pointer; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(5,150,105,0.1); }
        .ticker-content { display: inline-block; animation: ticker 28s linear infinite; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(6, 78, 59, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px, 5vw, 60px)", transition: "0.3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>S</div>
          <div style={{ color: "#fff" }}>
            <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>SMIT Connect</div>
            <div style={{ opacity: 0.6, fontSize: 9 }}>SAYLANI MASS IT TRAINING</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Link to="/courses" style={{ color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Courses</Link>
          <button onClick={() => navigate('/login')} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid white", color: "white", padding: "8px 15px", borderRadius: 8, cursor: "pointer" }}>Log In</button>
          <button onClick={() => navigate('/signup')} style={{ background: "#f59e0b", border: "none", color: "#fff", padding: "8px 15px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Sign Up →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "80vh", background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)", display: "flex", alignItems: "center", paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", width: "100%", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40 }}>
          <div>
            <h1 className="hero-text-2" style={{ fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Free IT Education<br /><span style={{ color: "#10b981" }}>For Every Pakistani</span></h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginTop: 20 }}>Join SMIT and transform your career with world-class technology courses at zero cost.</p>
            <button onClick={() => navigate('/courses')} style={{ marginTop: 30, background: "#10b981", border: "none", color: "#fff", padding: "14px 30px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Apply Now</button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: 30, borderRadius: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
             <h3 style={{ color: "#fff", marginBottom: 15 }}>Featured Courses</h3>
             {COURSES.map(c => (
               <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                 <span>{c.icon} {c.name}</span>
                 <span style={{ color: "#10b981" }}>{c.status}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} className="card-hover" style={{ textAlign: "center", padding: 30, background: "#f0fdf4", borderRadius: 20 }}>
              <div style={{ fontSize: 30 }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: "#064e3b" }}>{s.value}</div>
              <div style={{ color: "#059669", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST POSTS SECTION */}
      <section style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 40 }}>
          <div style={{ padding: 10, background: "#dbeafe", borderRadius: 12, color: "#2563eb", display: "flex" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b" }}>Latest Updates from SMIT</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 30 }}>
          {FACEBOOK_POSTS.map(post => (
            <div key={post.id} className="card-hover" style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 240, position: "relative" }}>
                <img src={post.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Post" />
                <div style={{ position: "absolute", top: 15, left: 15, background: "rgba(255,255,255,0.95)", padding: "6px 14px", borderRadius: 10, fontSize: 11, fontWeight: 800, color: "#064e3b", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                  {post.date}
                </div>
              </div>
              <div style={{ padding: 25, flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ color: "#475569", lineHeight: 1.6, fontSize: 15, flex: 1 }}>{post.text}</p>
                <a href={post.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", marginTop: 25 }}>
                  <button style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "#eff6ff", color: "#2563eb", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    View on Facebook 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#064e3b", padding: "40px 60px", color: "#fff", textAlign: "center", marginTop: 40 }}>
        <p>© 2024 SMIT Connect Portal. Helping Youth Flourish.</p>
      </footer>
    </div>
  );
}