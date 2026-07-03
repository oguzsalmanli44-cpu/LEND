import { useState, useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────
const CATS = [
  { id:"all",      label:"All",         icon:"◈" },
  { id:"cameras",  label:"Cameras",     icon:"📷" },
  { id:"tools",    label:"Tools",       icon:"🔧" },
  { id:"sports",   label:"Sports",      icon:"⚽" },
  { id:"music",    label:"Music",       icon:"🎸" },
  { id:"travel",   label:"Travel",      icon:"🎒" },
  { id:"tech",     label:"Tech",        icon:"💻" },
  { id:"events",   label:"Events",      icon:"🎉" },
  { id:"outdoor",  label:"Outdoor",     icon:"⛺" },
  { id:"vehicles", label:"Vehicles",    icon:"🚗" },
  { id:"homes",    label:"Spaces",      icon:"🏠" },
];

const LISTINGS = [
  { id:1,  cat:"cameras",  title:"Sony A7III + 50mm Lens",         owner:"Elvin K.",    ownerRating:4.9, ownerJoined:"2023", city:"Baku",       price:35,  deposit:200, rating:4.9, reviews:28, color:"#1A1A2E", emoji:"📷", desc:"Full frame mirrorless, perfect for weddings or portraits. Includes battery, charger, 64GB card.",   rules:["Return fully charged","Include all accessories","No commercial use without approval"],  insured:true,  verified:true,  availability:"Available now",      bookedDates:["2025-06-10","2025-06-11"] },
  { id:2,  cat:"tools",    title:"Makita Power Drill Set",          owner:"Ruslan M.",   ownerRating:4.8, ownerJoined:"2022", city:"Baku",       price:12,  deposit:80,  rating:4.8, reviews:41, color:"#1C3A1C", emoji:"🔧", desc:"Professional drill with full bit set. Perfect for home renovation projects.",                   rules:["Clean before return","No masonry without asking","Return same day if 1-day rental"],   insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
  { id:3,  cat:"sports",   title:"Surfboard — 7ft Funboard",        owner:"Leyla A.",    ownerRating:5.0, ownerJoined:"2024", city:"Sumqayit",   price:25,  deposit:150, rating:5.0, reviews:12, color:"#1A2A3A", emoji:"🏄", desc:"Great for beginners and intermediate surfers. Includes leash and wax.",                       rules:["Rinse after use","No rocks or reef","Carry bag must be returned"],                    insured:true,  verified:true,  availability:"Available weekends",  bookedDates:["2025-06-14","2025-06-15"] },
  { id:4,  cat:"music",    title:"Fender Stratocaster + Amp",       owner:"Kamran B.",   ownerRating:4.7, ownerJoined:"2023", city:"Baku",       price:20,  deposit:300, rating:4.7, reviews:19, color:"#2A1A1A", emoji:"🎸", desc:"Classic Strat in sunburst. Includes amp, cable, and picks.",                                 rules:["No outdoor gigs","Handle with care","Includes free lesson if needed"],                insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
  { id:5,  cat:"tech",     title:"DJI Mavic Pro 3 Drone",           owner:"Nigar S.",    ownerRating:4.9, ownerJoined:"2022", city:"Baku",       price:55,  deposit:400, rating:4.9, reviews:33, color:"#1A1A1A", emoji:"🚁", desc:"4K drone with obstacle avoidance. Great for real estate, events, or travel content.",         rules:["Must have drone license","No fly zones apply","Return with full battery"],            insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
  { id:6,  cat:"travel",   title:"Osprey 65L Hiking Pack",          owner:"Tural N.",    ownerRating:4.6, ownerJoined:"2023", city:"Baku",       price:10,  deposit:60,  rating:4.6, reviews:22, color:"#2A1C10", emoji:"🎒", desc:"Fully loaded hiking backpack with rain cover.",                                               rules:["Empty before return","No machine wash","Patch any tears"],                           insured:false, verified:true,  availability:"Available now",      bookedDates:[] },
  { id:7,  cat:"events",   title:"PA Speaker System (2x Yamaha)",   owner:"Anar Q.",     ownerRating:4.8, ownerJoined:"2021", city:"Baku",       price:45,  deposit:500, rating:4.8, reviews:15, color:"#1A0A2A", emoji:"🔊", desc:"2x Yamaha DXR12 speakers + mixer. Handles 200 people.",                                      rules:["Delivery available (+₼20)","Setup help included","Return by 10am next day"],         insured:true,  verified:true,  availability:"Book 2 days ahead",  bookedDates:["2025-06-08","2025-06-09"] },
  { id:8,  cat:"outdoor",  title:"4-Person Camping Tent",           owner:"Sevinc R.",   ownerRating:4.9, ownerJoined:"2023", city:"Ganja",      price:15,  deposit:100, rating:4.9, reviews:37, color:"#0A2A1A", emoji:"⛺", desc:"Waterproof, easy setup tent with stakes and poles.",                                         rules:["Dry before returning","No fires near tent","Stake bag must be included"],             insured:false, verified:true,  availability:"Available now",      bookedDates:[] },
  { id:9,  cat:"cameras",  title:"GoPro Hero 12 + Mount Kit",       owner:"Farid O.",    ownerRating:4.8, ownerJoined:"2023", city:"Baku",       price:18,  deposit:120, rating:4.8, reviews:24, color:"#1A2A1A", emoji:"🎬", desc:"Full mount kit — chest, helmet, selfie stick. Extra batteries included.",                    rules:["Return all mounts","Format card before return","No underwater without case"],        insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
  { id:10, cat:"tech",     title:"MacBook Pro M3 16\"",             owner:"Zulfiya H.",  ownerRating:4.7, ownerJoined:"2022", city:"Baku",       price:40,  deposit:600, rating:4.7, reviews:9,  color:"#1C1C2A", emoji:"💻", desc:"Latest MacBook Pro. Fully wiped between rentals.",                                           rules:["No software installs","Return in sleeve","Password set by owner"],                   insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
  { id:11, cat:"vehicles", title:"Tesla Model 3 — Day Rental",      owner:"Orxan I.",    ownerRating:5.0, ownerJoined:"2022", city:"Baku",       price:80,  deposit:800, rating:5.0, reviews:18, color:"#0A0A1A", emoji:"🚗", desc:"Full electric, autopilot enabled. Includes full charge. 200km/day included.",               rules:["Valid driving license required","Return with same charge","No smoking"],              insured:true,  verified:true,  availability:"Weekends only",      bookedDates:["2025-06-07","2025-06-08"] },
  { id:12, cat:"homes",    title:"Rooftop Studio — Old Baku",       owner:"Aytac L.",    ownerRating:4.6, ownerJoined:"2021", city:"Baku",       price:120, deposit:0,   rating:4.6, reviews:11, color:"#1A0800", emoji:"🏠", desc:"Stunning rooftop studio with Old City views. Ideal for photoshoots or events.",            rules:["Max 8 people","No loud music after 10pm","Cleaning fee ₼30 applies"],               insured:true,  verified:true,  availability:"Available now",      bookedDates:[] },
];

const OWNER_LISTINGS = LISTINGS.slice(0, 3);
const OWNER_BOOKINGS = [
  { id:1, item:"Sony A7III + 50mm Lens", renter:"Sara M.", days:2, total:70, date:"Jun 10–12", status:"active",    avatar:"S" },
  { id:2, item:"Sony A7III + 50mm Lens", renter:"Ali K.",  days:1, total:35, date:"Jun 15",    status:"pending",   avatar:"A" },
  { id:3, item:"GoPro Hero 12",          renter:"Lena B.", days:3, total:54, date:"May 28–31", status:"completed", avatar:"L" },
  { id:4, item:"Makita Drill Set",       renter:"Musa T.", days:1, total:12, date:"May 20",    status:"completed", avatar:"M" },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function Stars({ r }) {
  return <span style={{ color:"#F59E0B", fontSize:"13px" }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}</span>;
}
function Badge({ label, color="#DCFCE7", text="#16A34A" }) {
  return <span style={{ background:color, color:text, borderRadius:"100px", padding:"3px 10px", fontSize:"11px", fontWeight:600 }}>{label}</span>;
}
function Avatar({ name, size=36, bg="#6C63FF" }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.38, flexShrink:0 }}>{name[0]}</div>;
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]           = useState("home");
  const [cat, setCat]                 = useState("all");
  const [search, setSearch]           = useState("");
  const [listings, setListings]       = useState(LISTINGS);
  const [selected, setSelected]       = useState(null);
  const [days, setDays]               = useState(1);
  const [saved, setSaved]             = useState([]);
  const [user, setUser]               = useState(null); // null = logged out
  const [showAuth, setShowAuth]       = useState(false);
  const [authMode, setAuthMode]       = useState("login"); // login | signup
  const [authStep, setAuthStep]       = useState(0); // 0=creds, 1=verify, 2=done
  const [authForm, setAuthForm]       = useState({ name:"", email:"", password:"" });
  const [verifyStep, setVerifyStep]   = useState(0); // 0=id, 1=selfie, 2=done
  const [listStep, setListStep]       = useState(0);
  const [listForm, setListForm]       = useState({ title:"", cat:"cameras", price:"", deposit:"", desc:"", city:"Baku", rules:"" });
  const [bookingDone, setBookingDone] = useState(false);
  const [dashTab, setDashTab]         = useState("overview"); // overview | listings | bookings | earnings | settings
  const [scrolled, setScrolled]       = useState(false);
  const [notif, setNotif]             = useState(null);
  const [mobileMenu, setMobileMenu]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const showNotif = (msg, type="success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3500);
  };

  const filtered = listings.filter(l => {
    const mc = cat === "all" || l.cat === cat;
    const ms = l.title.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase()) || l.cat.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    if (!user) { setShowAuth(true); setAuthMode("signup"); return; }
    setSaved(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
    showNotif(saved.includes(id) ? "Removed from saved" : "Saved ❤️");
  };

  const handleBook = () => {
    if (!user) { setShowAuth(true); setAuthMode("signup"); return; }
    if (!user.verified) { setScreen("verify"); return; }
    setBookingDone(true);
    setScreen("booked");
    showNotif("Booking confirmed! 🎉");
  };

  const handleLogin = () => {
    const u = { name: authForm.name || "Rashid", email: authForm.email || "rashid@email.com", verified: false, joined:"2025", avatar:"R", totalRentals:0, totalEarnings:0 };
    setUser(u);
    setShowAuth(false);
    setAuthStep(0);
    setAuthForm({ name:"", email:"", password:"" });
    showNotif(`Welcome back! 👋`);
  };

  const handleVerifyDone = () => {
    setUser(u => ({ ...u, verified:true }));
    setVerifyStep(0);
    setScreen("home");
    showNotif("Identity verified ✓");
  };

  const submitListing = () => {
    const newItem = {
      id: listings.length + 1,
      cat: listForm.cat,
      title: listForm.title,
      owner: user?.name || "You",
      ownerRating: 5.0, ownerJoined:"2025",
      city: listForm.city,
      price: parseInt(listForm.price) || 20,
      deposit: parseInt(listForm.deposit) || 50,
      rating: 5.0, reviews: 0,
      color: "#1A1A2E",
      emoji: CATS.find(c=>c.id===listForm.cat)?.icon || "📦",
      desc: listForm.desc,
      rules: listForm.rules ? listForm.rules.split("\n").filter(Boolean) : [],
      insured: false, verified: true,
      availability: "Available now",
      bookedDates: [],
    };
    setListings(l => [newItem, ...l]);
    setListStep(4);
    showNotif("Item listed successfully! 🎉");
  };

  // ── CSS ──────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px;}
    body{background:#F8F7F4;font-family:'DM Sans',sans-serif;color:#111;}

    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes pop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes notifIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes progress{from{width:0}to{width:100%}}

    /* Nav */
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:14px 32px;display:flex;align-items:center;justify-content:space-between;transition:all 0.3s;gap:16px;}
    .nav.scrolled{background:rgba(248,247,244,0.97);backdrop-filter:blur(16px);border-bottom:1px solid #F0EFEC;box-shadow:0 1px 12px rgba(0,0,0,0.06);}
    .logo{font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:#111;cursor:pointer;letter-spacing:-0.5px;flex-shrink:0;}
    .logo span{color:#16A34A;}

    /* Buttons */
    .btn{border:none;border-radius:10px;padding:10px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;display:inline-flex;align-items:center;gap:6px;}
    .btn:hover{filter:brightness(0.95);}
    .btn:active{transform:scale(0.97);}
    .btn-ghost{background:transparent;color:#6B7280;border:1px solid transparent;}
    .btn-ghost:hover{background:#F3F4F6;color:#111;border-color:#F3F4F6;}
    .btn-outline{background:#fff;color:#111;border:1.5px solid #E5E7EB;}
    .btn-outline:hover{border-color:#111;background:#F9FAFB;}
    .btn-dark{background:#111;color:#fff;}
    .btn-dark:hover{background:#222;}
    .btn-green{background:#16A34A;color:#fff;}
    .btn-green:hover{background:#15803D;}
    .btn-red{background:#EF4444;color:#fff;}
    .btn-red:hover{background:#DC2626;}
    .btn-lg{padding:14px 28px;font-size:15px;font-weight:600;border-radius:12px;}
    .btn-xl{padding:16px 36px;font-size:16px;font-weight:600;border-radius:14px;}
    .btn-full{width:100%;justify-content:center;}

    /* Cards */
    .card{background:#fff;border-radius:20px;border:1px solid #F0EFEC;transition:all 0.2s;}
    .card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.09);border-color:#E5E7EB;cursor:pointer;}

    /* Inputs */
    .inp{background:#F9FAFB;border:1.5px solid #E5E7EB;border-radius:12px;padding:13px 16px;font-family:'DM Sans',sans-serif;font-size:14px;color:#111;outline:none;width:100%;transition:all 0.15s;}
    .inp:focus{border-color:#16A34A;background:#fff;box-shadow:0 0 0 3px rgba(22,163,74,0.08);}
    .inp::placeholder{color:#9CA3AF;}
    textarea.inp{resize:none;line-height:1.6;}
    select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;}

    /* Category pills */
    .cat{border:1.5px solid #E5E7EB;border-radius:100px;padding:8px 16px;background:#fff;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#374151;display:flex;align-items:center;gap:5px;}
    .cat:hover{border-color:#16A34A;background:#F0FDF4;}
    .cat.active{background:#111;color:#fff;border-color:#111;}

    /* Modal overlay */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
    .modal{background:#fff;border-radius:24px;padding:32px;width:100%;max-width:440px;animation:fadeUp 0.3s ease;max-height:90vh;overflow-y:auto;}

    /* Dashboard */
    .dash-nav-btn{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;padding:10px 16px;border-radius:10px;color:#6B7280;transition:all 0.15s;display:flex;align-items:center;gap:8px;width:100%;text-align:left;}
    .dash-nav-btn:hover{background:#F3F4F6;color:#111;}
    .dash-nav-btn.active{background:#F0FDF4;color:#16A34A;font-weight:600;}

    /* Verify steps */
    .verify-box{border:2px dashed #E5E7EB;border-radius:20px;padding:32px;text-align:center;cursor:pointer;transition:all 0.2s;background:#FAFAF8;}
    .verify-box:hover{border-color:#16A34A;background:#F0FDF4;}
    .verify-box.done{border-style:solid;border-color:#16A34A;background:#F0FDF4;}

    /* Notif */
    .notif{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);border-radius:100px;padding:12px 24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;z-index:500;white-space:nowrap;animation:notifIn 0.3s ease;box-shadow:0 8px 24px rgba(0,0,0,0.15);}

    /* Stat card */
    .stat{background:#fff;border:1px solid #F0EFEC;border-radius:16px;padding:20px;text-align:center;}

    /* Search bar */
    .searchbar{display:flex;align-items:center;background:#fff;border:1.5px solid #E5E7EB;border-radius:14px;padding:6px 6px 6px 16px;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
    .searchbar:focus-within{border-color:#16A34A;box-shadow:0 4px 16px rgba(22,163,74,0.1);}
    .searchbar input{flex:1;border:none;outline:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;color:#111;}
    .searchbar input::placeholder{color:#9CA3AF;}

    @media(max-width:768px){
      .nav{padding:12px 16px;}
      .hide-mobile{display:none!important;}
      .show-mobile{display:flex!important;}
    }
  `;

  const BG = "#F8F7F4";

  // ── NOTIFICATION ──────────────────────────────────────────────────────────
  const Notif = () => notif ? (
    <div className="notif" style={{ background: notif.type==="error" ? "#EF4444" : "#111", color:"#fff" }}>
      {notif.msg}
    </div>
  ) : null;

  // ── AUTH MODAL ────────────────────────────────────────────────────────────
  const AuthModal = () => (
    <div className="overlay" onClick={()=>setShowAuth(false)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:"26px", fontWeight:600, color:"#111" }}>
            {authMode==="login" ? "Welcome back" : "Join lend."}
          </div>
          <button className="btn btn-ghost" onClick={()=>setShowAuth(false)} style={{ fontSize:"20px", padding:"6px 10px" }}>×</button>
        </div>

        {authStep === 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {authMode==="signup" && (
              <input className="inp" placeholder="Full name" value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))} />
            )}
            <input className="inp" placeholder="Email address" type="email" value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))} />
            <input className="inp" placeholder="Password" type="password" value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))} />
            <button className="btn btn-dark btn-lg btn-full" onClick={handleLogin} style={{ marginTop:"8px" }}>
              {authMode==="login" ? "Log in" : "Create account"}
            </button>
            <div style={{ textAlign:"center", fontSize:"13px", color:"#6B7280" }}>
              {authMode==="login" ? "No account? " : "Already have one? "}
              <button onClick={()=>setAuthMode(m=>m==="login"?"signup":"login")} style={{ background:"none", border:"none", color:"#16A34A", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"13px" }}>
                {authMode==="login" ? "Sign up" : "Log in"}
              </button>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"8px 0" }}>
              <div style={{ flex:1, height:"1px", background:"#F0EFEC" }} />
              <span style={{ fontSize:"12px", color:"#9CA3AF" }}>or continue with</span>
              <div style={{ flex:1, height:"1px", background:"#F0EFEC" }} />
            </div>

            {["🇦🇿 AzəriCard","🍎 Apple","🔵 Google"].map(p=>(
              <button key={p} className="btn btn-outline btn-full" onClick={handleLogin} style={{ justifyContent:"center" }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── HEADER ────────────────────────────────────────────────────────────────
  const Header = ({ minimal = false }) => (
    <nav className={`nav ${scrolled||minimal?"scrolled":""}`}>
      <div className="logo" onClick={()=>setScreen("home")}>lend<span>.</span></div>

      {!minimal && (
        <div className="searchbar hide-mobile" style={{ flex:1, maxWidth:"360px", margin:"0 24px" }}>
          <span style={{ fontSize:"16px", marginRight:"6px" }}>🔍</span>
          <input placeholder="Search items, cities..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setScreen("browse")} />
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
        {user ? (
          <>
            <button className="btn btn-ghost hide-mobile" onClick={()=>setScreen("list")}>List an item</button>
            <button className="btn btn-ghost hide-mobile" onClick={()=>{ setDashTab("overview"); setScreen("dashboard"); }}>
              <Avatar name={user.name} size={28} bg="#16A34A" />
              {user.name.split(" ")[0]}
              {!user.verified && <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#F59E0B", display:"inline-block" }} />}
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost hide-mobile" onClick={()=>{ setAuthMode("login"); setShowAuth(true); }}>Log in</button>
            <button className="btn btn-green" onClick={()=>{ setAuthMode("signup"); setShowAuth(true); }}>Sign up</button>
          </>
        )}
      </div>
    </nav>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header />
      {showAuth && <AuthModal />}
      <Notif />

      {/* Hero */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:"700px", height:"700px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(22,163,74,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />

        {/* Floating cards */}
        {[
          { emoji:"📷", title:"Sony A7III", price:"₼35/day", top:"22%", left:"4%", delay:"0s" },
          { emoji:"🚗", title:"Tesla Model 3", price:"₼80/day", top:"28%", right:"4%", delay:"1s" },
          { emoji:"🎸", title:"Fender Strat", price:"₼20/day", bottom:"30%", left:"3%", delay:"2s" },
          { emoji:"🚁", title:"DJI Mavic Pro", price:"₼55/day", bottom:"28%", right:"3%", delay:"0.5s" },
        ].map((f,i)=>(
          <div key={i} style={{ position:"absolute", ...Object.fromEntries(["top","left","right","bottom"].filter(k=>f[k]).map(k=>[k,f[k]])), animation:`float 4s ease ${f.delay} infinite`, opacity:0.9, zIndex:1 }}>
            <div className="card" style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:"10px", boxShadow:"0 4px 16px rgba(0,0,0,0.08)", borderRadius:"14px" }}>
              <span style={{ fontSize:"22px" }}>{f.emoji}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:"13px", color:"#111" }}>{f.title}</div>
                <div style={{ fontSize:"12px", color:"#16A34A", fontWeight:500 }}>{f.price}</div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ position:"relative", zIndex:2, maxWidth:"720px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#DCFCE7", border:"1px solid #BBF7D0", borderRadius:"100px", padding:"6px 16px", marginBottom:"24px", animation:"fadeIn 0.6s ease" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#16A34A", animation:"pulse 2s ease infinite" }} />
            <span style={{ fontSize:"12px", fontWeight:600, color:"#16A34A" }}>Live in Baku · 4,200+ items available</span>
          </div>

          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(44px,9vw,96px)", fontWeight:700, lineHeight:0.92, letterSpacing:"-3px", color:"#111", marginBottom:"24px", animation:"fadeUp 0.7s ease" }}>
            Rent <em style={{ fontStyle:"italic", color:"#16A34A" }}>anything</em><br/>from real<br/>people near you.
          </h1>

          <p style={{ fontSize:"18px", fontWeight:300, color:"#6B7280", marginBottom:"40px", lineHeight:1.7, maxWidth:"500px", margin:"0 auto 40px", animation:"fadeUp 0.7s ease 0.1s both" }}>
            Cameras. Cars. Drones. Tools. Apartments. Instruments. One platform. Your neighborhood.
          </p>

          <div style={{ maxWidth:"520px", margin:"0 auto 32px", animation:"fadeUp 0.7s ease 0.15s both" }}>
            <div className="searchbar" style={{ padding:"10px 10px 10px 20px" }}>
              <span style={{ fontSize:"20px", marginRight:"8px" }}>🔍</span>
              <input style={{ fontSize:"16px" }} placeholder="What do you want to rent?" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setScreen("browse")} />
              <button className="btn btn-green btn-lg" onClick={()=>setScreen("browse")}>Search</button>
            </div>
          </div>

          <div style={{ display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap", animation:"fadeUp 0.7s ease 0.2s both" }}>
            {["📷 Cameras","🚗 Cars","🏠 Spaces","🎸 Music","🚁 Drones","⛺ Outdoor"].map(tag=>(
              <button key={tag} className="cat" onClick={()=>{ setSearch(tag.split(" ").slice(1).join(" ")); setScreen("browse"); }} style={{ fontSize:"12px", padding:"6px 12px" }}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:"#111", padding:"40px 32px" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"32px" }}>
          {[["4,200+","items available"],["₼8.2M","saved by renters"],["12,000+","verified users"],["98%","on-time returns"],["10%","platform fee only"]].map(([n,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:"36px", fontWeight:700, color:"#fff", marginBottom:"4px" }}>{n}</div>
              <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:300 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:"80px 32px", maxWidth:"1000px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <div style={{ fontSize:"12px", fontWeight:600, color:"#16A34A", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>Simple by design</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(32px,5vw,52px)", fontWeight:700, letterSpacing:"-1px", color:"#111" }}>How lend. works</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"24px" }}>
          {[
            { icon:"🔍", title:"Find", desc:"Browse thousands of items near you. Filter by category, price, or date." },
            { icon:"✅", title:"Verify", desc:"One-time ID check via Stripe Identity. Takes 60 seconds. Keeps everyone safe." },
            { icon:"📅", title:"Book", desc:"Pick your dates, pay securely. Deposit held and released automatically." },
            { icon:"🤝", title:"Meet", desc:"Pick up, use, return. Leave a review. Build your rental reputation." },
            { icon:"💰", title:"Earn", desc:"List your idle items and earn while they sit. You keep 90% of every booking." },
          ].map((s,i)=>(
            <div key={i} className="card" style={{ padding:"28px 24px", animation:`fadeUp 0.5s ease ${i*0.08}s both` }}>
              <div style={{ fontSize:"36px", marginBottom:"14px" }}>{s.icon}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:600, color:"#111", marginBottom:"8px" }}>{s.title}</div>
              <div style={{ fontSize:"13px", color:"#6B7280", lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding:"0 32px 80px", maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, letterSpacing:"-0.5px", color:"#111" }}>Popular near you</h2>
          <button className="btn btn-outline" onClick={()=>setScreen("browse")}>View all →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
          {LISTINGS.slice(0,8).map((item,i)=>(
            <div key={item.id} className="card card-hover" onClick={()=>{ setSelected(item); setScreen("listing"); }} style={{ animationDelay:`${i*0.05}s`, animation:"fadeUp 0.5s ease both", overflow:"hidden" }}>
              <div style={{ height:"180px", background:`linear-gradient(135deg,${item.color},${item.color}AA)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <span style={{ fontSize:"64px", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}>{item.emoji}</span>
                <button onClick={e=>toggleSave(item.id,e)} style={{ position:"absolute", top:"12px", right:"12px", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
                  {saved.includes(item.id) ? "❤️" : "🤍"}
                </button>
                {item.insured && <div style={{ position:"absolute", bottom:"10px", left:"10px", background:"rgba(22,163,74,0.9)", borderRadius:"100px", padding:"3px 10px", fontSize:"10px", fontWeight:600, color:"#fff", backdropFilter:"blur(4px)" }}>🛡 Insured</div>}
                <div style={{ position:"absolute", top:"12px", left:"12px" }}>
                  {item.verified && <div style={{ background:"rgba(255,255,255,0.9)", borderRadius:"100px", padding:"3px 10px", fontSize:"10px", fontWeight:600, color:"#16A34A", backdropFilter:"blur(4px)" }}>✓ Verified</div>}
                </div>
              </div>
              <div style={{ padding:"16px" }}>
                <div style={{ fontWeight:600, fontSize:"15px", color:"#111", marginBottom:"4px", lineHeight:1.3 }}>{item.title}</div>
                <div style={{ fontSize:"12px", color:"#9CA3AF", marginBottom:"10px" }}>📍 {item.city} · {item.owner}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:700, color:"#111" }}>₼{item.price}</span>
                    <span style={{ fontSize:"12px", color:"#9CA3AF" }}>/day</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <Stars r={item.rating} />
                    <span style={{ fontSize:"12px", color:"#6B7280" }}>({item.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance section */}
      <div style={{ background:"#fff", padding:"80px 32px", borderTop:"1px solid #F0EFEC", borderBottom:"1px solid #F0EFEC" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#16A34A", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"12px" }}>Protection built in</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, letterSpacing:"-0.5px", color:"#111", marginBottom:"20px", lineHeight:1.1 }}>Every rental is<br/><em style={{ fontStyle:"italic" }}>covered.</em></h2>
              <p style={{ fontSize:"15px", color:"#6B7280", lineHeight:1.8, marginBottom:"28px" }}>
                We partner with Guardhog to insure every rental automatically. Owners are protected. Renters are covered. Nobody loses.
              </p>
              {[
                { icon:"🛡", title:"Item insurance", desc:"Up to ₼50,000 per item, per rental" },
                { icon:"💳", title:"Secure deposits", desc:"Held by Stripe, released on return" },
                { icon:"✅", title:"ID verification", desc:"All users verified via Stripe Identity" },
                { icon:"⭐", title:"Review system", desc:"Two-way reviews build trust" },
              ].map(f=>(
                <div key={f.title} style={{ display:"flex", gap:"14px", alignItems:"flex-start", marginBottom:"16px" }}>
                  <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"14px", color:"#111", marginBottom:"2px" }}>{f.title}</div>
                    <div style={{ fontSize:"13px", color:"#6B7280" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              {[
                { label:"Items insured", value:"4,200+", icon:"🛡", color:"#F0FDF4" },
                { label:"Claims paid", value:"₼2.1M", icon:"💰", color:"#FEF3C7" },
                { label:"Avg response", value:"< 2hrs", icon:"⚡", color:"#EFF6FF" },
                { label:"User satisfaction", value:"98%", icon:"⭐", color:"#FDF4FF" },
              ].map(s=>(
                <div key={s.label} className="card" style={{ padding:"24px", background:s.color, border:"none" }}>
                  <div style={{ fontSize:"28px", marginBottom:"8px" }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"4px" }}>{s.value}</div>
                  <div style={{ fontSize:"12px", color:"#6B7280", fontWeight:400 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"#111", padding:"80px 32px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(36px,6vw,64px)", fontWeight:700, letterSpacing:"-1px", color:"#fff", marginBottom:"16px", lineHeight:1.05 }}>
          Start earning<br/>from what you own.
        </h2>
        <p style={{ fontSize:"18px", color:"rgba(255,255,255,0.45)", marginBottom:"36px", fontWeight:300 }}>Your camera earns ₼35/day sitting in your bag. List it in 3 minutes.</p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn btn-green btn-xl" onClick={()=>setScreen("list")}>List your first item →</button>
          <button className="btn btn-outline btn-xl" onClick={()=>setScreen("browse")} style={{ color:"#fff", borderColor:"rgba(255,255,255,0.2)" }}>Browse items</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:"#0A0A0A", padding:"40px 32px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"40px", marginBottom:"40px" }}>
          <div>
            <div className="logo" style={{ color:"#fff", marginBottom:"12px", display:"block" }}>lend<span>.</span></div>
            <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", lineHeight:1.7, fontStyle:"italic", fontFamily:"'Fraunces',serif" }}>Making ownership optional, one rental at a time.</div>
          </div>
          {[["Rent",["Browse all","Cameras","Vehicles","Spaces","Tools"]],["Earn",["List an item","How pricing works","Insurance","Owner dashboard"]],["Company",["About","Blog","Careers","Contact","Privacy"]]].map(([title,links])=>(
            <div key={title}>
              <div style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.4)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"14px" }}>{title}</div>
              {links.map(l=><div key={l} style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", marginBottom:"10px", cursor:"pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"24px", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>© 2025 lend. · Baku, Azerbaijan</span>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>Making ownership optional.</span>
        </div>
      </div>
    </div>
  );

  // ── BROWSE ────────────────────────────────────────────────────────────────
  if (screen === "browse") return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      {showAuth && <AuthModal />}
      <Notif />
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"90px 24px 60px" }}>
        <div style={{ marginBottom:"20px" }}>
          <div className="searchbar" style={{ maxWidth:"520px" }}>
            <span style={{ fontSize:"18px", marginRight:"6px" }}>🔍</span>
            <input placeholder="Search anything..." value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:"18px", padding:"0 8px" }}>×</button>}
          </div>
        </div>

        <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"8px", marginBottom:"24px" }}>
          {CATS.map(c=><button key={c.id} className={`cat ${cat===c.id?"active":""}`} onClick={()=>setCat(c.id)}>{c.icon} {c.label}</button>)}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <div style={{ fontSize:"14px", color:"#6B7280" }}><strong style={{ color:"#111" }}>{filtered.length}</strong> items{search&&` for "${search}"`}</div>
          <div style={{ display:"flex", gap:"8px" }}>
            <Badge label="✓ Verified only" color="#F0FDF4" text="#16A34A" />
            <Badge label="🛡 Insured" color="#EFF6FF" text="#2563EB" />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
          {filtered.map((item,i)=>(
            <div key={item.id} className="card card-hover" onClick={()=>{ setSelected(item); setScreen("listing"); }} style={{ animationDelay:`${i*0.04}s`, animation:"fadeUp 0.4s ease both", overflow:"hidden" }}>
              <div style={{ height:"170px", background:`linear-gradient(135deg,${item.color},${item.color}99)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <span style={{ fontSize:"60px" }}>{item.emoji}</span>
                <button onClick={e=>toggleSave(item.id,e)} style={{ position:"absolute", top:"10px", right:"10px", width:"30px", height:"30px", borderRadius:"50%", background:"rgba(255,255,255,0.88)", border:"none", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {saved.includes(item.id)?"❤️":"🤍"}
                </button>
                <div style={{ position:"absolute", bottom:"8px", left:"8px", display:"flex", gap:"4px" }}>
                  {item.insured && <Badge label="🛡 Insured" color="rgba(22,163,74,0.85)" text="#fff" />}
                </div>
              </div>
              <div style={{ padding:"14px" }}>
                <div style={{ fontWeight:600, fontSize:"14px", color:"#111", marginBottom:"3px" }}>{item.title}</div>
                <div style={{ fontSize:"12px", color:"#9CA3AF", marginBottom:"8px" }}>📍 {item.city} · {item.owner}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:700, color:"#111" }}>₼{item.price}</span>
                    <span style={{ fontSize:"11px", color:"#9CA3AF" }}>/day</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                    <Stars r={item.rating} />
                    <span style={{ fontSize:"11px", color:"#6B7280" }}>({item.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔍</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:"24px", color:"#111", marginBottom:"8px" }}>Nothing found</div>
            <div style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"24px" }}>Be the first to list this item in Baku.</div>
            <button className="btn btn-green btn-lg" onClick={()=>setScreen("list")}>List it yourself</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── LISTING DETAIL ────────────────────────────────────────────────────────
  if (screen === "listing" && selected) return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      {showAuth && <AuthModal />}
      <Notif />
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"90px 24px 60px" }}>
        <button className="btn btn-ghost" onClick={()=>setScreen("browse")} style={{ marginBottom:"24px" }}>← Back to browse</button>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"48px", alignItems:"start" }}>
          {/* Left */}
          <div>
            <div style={{ height:"380px", background:`linear-gradient(135deg,${selected.color},${selected.color}88)`, borderRadius:"24px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"28px", border:"1px solid rgba(255,255,255,0.08)", position:"relative" }}>
              <span style={{ fontSize:"110px", filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.3))", animation:"float 4s ease infinite" }}>{selected.emoji}</span>
              {selected.insured && <div style={{ position:"absolute", top:"16px", left:"16px" }}><Badge label="🛡 Insured by Guardhog" color="rgba(22,163,74,0.9)" text="#fff" /></div>}
              {selected.verified && <div style={{ position:"absolute", top:"16px", right:"16px" }}><Badge label="✓ Verified item" color="rgba(255,255,255,0.9)" text="#16A34A" /></div>}
            </div>

            <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
              <Badge label={selected.availability} color={selected.availability==="Available now"?"#DCFCE7":"#FEF3C7"} text={selected.availability==="Available now"?"#16A34A":"#D97706"} />
              <Badge label={CATS.find(c=>c.id===selected.cat)?.label || ""} color="#EFF6FF" text="#2563EB" />
              {selected.deposit > 0 && <Badge label={`₼${selected.deposit} deposit`} color="#FDF4FF" text="#7C3AED" />}
            </div>

            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"36px", fontWeight:700, letterSpacing:"-0.5px", color:"#111", marginBottom:"8px" }}>{selected.title}</h1>
            <div style={{ fontSize:"14px", color:"#6B7280", marginBottom:"16px" }}>📍 {selected.city}</div>

            {/* Owner */}
            <div className="card" style={{ padding:"16px 20px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"14px" }}>
              <Avatar name={selected.owner} size={48} bg="#16A34A" />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:"15px", color:"#111" }}>{selected.owner}</div>
                <div style={{ fontSize:"12px", color:"#9CA3AF" }}>Member since {selected.ownerJoined} · {selected.reviews} rentals</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <Stars r={selected.ownerRating} />
                <div style={{ fontSize:"12px", color:"#6B7280" }}>{selected.ownerRating} rating</div>
              </div>
            </div>

            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:600, color:"#111", marginBottom:"12px" }}>About this item</h3>
            <p style={{ fontSize:"15px", color:"#374151", lineHeight:1.8, marginBottom:"28px" }}>{selected.desc}</p>

            {/* Rules */}
            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:600, color:"#111", marginBottom:"12px" }}>Rental rules</h3>
            <div className="card" style={{ padding:"20px", marginBottom:"28px" }}>
              {selected.rules?.map((r,i)=>(
                <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"10px", fontSize:"14px", color:"#374151" }}>
                  <span style={{ color:"#16A34A", fontWeight:700 }}>·</span> {r}
                </div>
              ))}
            </div>

            {/* Insurance details */}
            {selected.insured && (
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"16px", padding:"20px" }}>
                <div style={{ fontWeight:600, fontSize:"14px", color:"#166534", marginBottom:"10px" }}>🛡 This item is insured</div>
                <div style={{ fontSize:"13px", color:"#166534", lineHeight:1.7 }}>
                  Covered up to ₼50,000 per rental through our Guardhog partnership. If anything goes wrong, both renter and owner are fully protected. Deposit is held securely by Stripe and returned automatically upon safe return.
                </div>
              </div>
            )}
          </div>

          {/* Booking card */}
          <div style={{ position:"sticky", top:"100px" }}>
            <div className="card" style={{ padding:"28px", boxShadow:"0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:"4px", marginBottom:"6px" }}>
                <span style={{ fontFamily:"'Fraunces',serif", fontSize:"40px", fontWeight:700, color:"#111" }}>₼{selected.price}</span>
                <span style={{ fontSize:"14px", color:"#9CA3AF" }}>/ day</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"4px", marginBottom:"24px" }}>
                <Stars r={selected.rating} />
                <span style={{ fontSize:"13px", color:"#6B7280" }}>{selected.rating} · {selected.reviews} reviews</span>
              </div>

              {/* Days selector */}
              <div style={{ marginBottom:"16px" }}>
                <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Duration</label>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", justifyContent:"center", background:"#F8F7F4", borderRadius:"12px", padding:"12px" }}>
                  <button onClick={()=>setDays(d=>Math.max(1,d-1))} style={{ width:"32px", height:"32px", borderRadius:"50%", border:"1.5px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:"18px", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                  <div style={{ textAlign:"center" }}>
                    <span style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111" }}>{days}</span>
                    <div style={{ fontSize:"11px", color:"#9CA3AF" }}>day{days>1?"s":""}</div>
                  </div>
                  <button onClick={()=>setDays(d=>d+1)} style={{ width:"32px", height:"32px", borderRadius:"50%", border:"1.5px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:"18px", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ background:"#F8F7F4", borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
                {[
                  [`₼${selected.price} × ${days} day${days>1?"s":""}`, `₼${selected.price * days}`],
                  ["Service fee (10%)", `₼${Math.round(selected.price * days * 0.1)}`],
                  ["Insurance", "₼5"],
                  ...(selected.deposit > 0 ? [[`Security deposit (refundable)`, `₼${selected.deposit}`]] : []),
                ].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color:"#374151", marginBottom:"8px" }}>
                    <span>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ height:"1px", background:"#E5E7EB", margin:"12px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"15px", fontWeight:700, color:"#111" }}>
                  <span>Due now</span>
                  <span>₼{selected.price * days + Math.round(selected.price * days * 0.1) + 5}</span>
                </div>
                {selected.deposit > 0 && <div style={{ fontSize:"11px", color:"#9CA3AF", marginTop:"4px", textAlign:"right" }}>+ ₼{selected.deposit} deposit (returned on safe return)</div>}
              </div>

              <button className="btn btn-green btn-lg btn-full" onClick={handleBook} style={{ marginBottom:"10px" }}>
                {user ? (user.verified ? `Book now` : "Verify ID to book") : "Sign up to book"}
              </button>

              {!user?.verified && user && (
                <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"10px", padding:"10px 14px", fontSize:"12px", color:"#92400E", marginBottom:"10px" }}>
                  ⚠️ Identity verification required before booking. Takes 60 seconds.
                </div>
              )}

              <div style={{ textAlign:"center", fontSize:"12px", color:"#9CA3AF" }}>Free cancellation · Secure payment · Deposit returned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── VERIFY IDENTITY ───────────────────────────────────────────────────────
  if (screen === "verify") return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      <Notif />
      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"100px 24px 60px" }}>
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"20px", background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"28px" }}>🛡</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"8px" }}>Verify your identity</h2>
          <p style={{ fontSize:"15px", color:"#6B7280", lineHeight:1.7 }}>One-time check. Keeps everyone safe. Powered by Stripe Identity.</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex", gap:"4px", marginBottom:"36px" }}>
          {["ID Document","Selfie","Complete"].map((s,i)=>(
            <div key={i} style={{ flex:1, textAlign:"center" }}>
              <div style={{ height:"4px", borderRadius:"100px", background: i<=verifyStep?"#16A34A":"#E5E7EB", marginBottom:"6px", transition:"background 0.3s" }} />
              <div style={{ fontSize:"11px", color: i<=verifyStep?"#16A34A":"#9CA3AF", fontWeight: i===verifyStep?600:400 }}>{s}</div>
            </div>
          ))}
        </div>

        {verifyStep === 0 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div className="verify-box" onClick={()=>setVerifyStep(1)}>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>🪪</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:600, color:"#111", marginBottom:"8px" }}>Upload your ID</div>
              <div style={{ fontSize:"13px", color:"#6B7280", lineHeight:1.7 }}>Passport, national ID, or driving license. Your data is encrypted and never shared.</div>
              <div className="btn btn-dark" style={{ marginTop:"20px", display:"inline-flex" }}>Choose file →</div>
            </div>
          </div>
        )}

        {verifyStep === 1 && (
          <div style={{ animation:"fadeUp 0.4s ease" }}>
            <div className="verify-box done" style={{ marginBottom:"16px" }}>
              <div style={{ fontSize:"32px", marginBottom:"8px" }}>✅</div>
              <div style={{ fontWeight:600, color:"#16A34A" }}>ID uploaded</div>
            </div>
            <div className="verify-box" onClick={()=>setVerifyStep(2)}>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>🤳</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:600, color:"#111", marginBottom:"8px" }}>Take a selfie</div>
              <div style={{ fontSize:"13px", color:"#6B7280" }}>We'll match it to your ID automatically. Takes 10 seconds.</div>
              <div className="btn btn-dark" style={{ marginTop:"20px", display:"inline-flex" }}>Open camera →</div>
            </div>
          </div>
        )}

        {verifyStep === 2 && (
          <div style={{ animation:"fadeUp 0.4s ease", textAlign:"center" }}>
            <div style={{ width:"80px", height:"80px", border:"4px solid #F0EFEC", borderTop:"4px solid #16A34A", borderRadius:"50%", margin:"0 auto 24px", animation:"spin 1s linear infinite" }} />
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:"24px", fontWeight:600, color:"#111", marginBottom:"8px" }}>Verifying...</div>
            <div style={{ fontSize:"14px", color:"#6B7280", marginBottom:"32px" }}>Stripe Identity is checking your documents</div>
            <button className="btn btn-green btn-lg btn-full" onClick={handleVerifyDone}>
              Verification complete ✓
            </button>
          </div>
        )}

        <div style={{ marginTop:"24px", background:"#F8F7F4", borderRadius:"14px", padding:"16px", fontSize:"13px", color:"#6B7280", lineHeight:1.7 }}>
          🔒 <strong style={{ color:"#111" }}>Your privacy is protected.</strong> Documents are encrypted, processed by Stripe Identity, and never stored on our servers. We only receive a verified/not verified result.
        </div>
      </div>
    </div>
  );

  // ── BOOKED ────────────────────────────────────────────────────────────────
  if (screen === "booked") return (
    <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}><style>{css}</style>
      <Notif />
      <div style={{ textAlign:"center", padding:"40px 32px", maxWidth:"480px" }}>
        <div style={{ width:"88px", height:"88px", borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:"40px", animation:"pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✓</div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"40px", fontWeight:700, color:"#111", marginBottom:"10px" }}>Booking confirmed!</h2>
        <p style={{ fontSize:"16px", color:"#6B7280", marginBottom:"6px" }}>
          <strong style={{ color:"#111" }}>{selected?.owner}</strong> will confirm within 2 hours.
        </p>
        <p style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"8px" }}>You'll receive pickup details by message.</p>

        <div className="card" style={{ padding:"20px", margin:"24px 0", textAlign:"left" }}>
          {[
            ["Item", selected?.title],
            ["Duration", `${days} day${days>1?"s":""}`],
            ["Total paid", `₼${selected ? selected.price * days + Math.round(selected.price * days * 0.1) + 5 : 0}`],
            ["Deposit held", `₼${selected?.deposit || 0} (returned on safe return)`],
            ["Insurance", "Covered by Guardhog"],
          ].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", padding:"8px 0", borderBottom:"1px solid #F8F7F4" }}>
              <span style={{ color:"#9CA3AF" }}>{l}</span>
              <span style={{ fontWeight:500, color:"#111", textAlign:"right", maxWidth:"60%" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <button className="btn btn-green btn-lg btn-full" onClick={()=>setScreen("browse")}>Browse more items</button>
          <button className="btn btn-outline btn-lg btn-full" onClick={()=>{ setDashTab("bookings"); setScreen("dashboard"); }}>View my bookings</button>
        </div>
      </div>
    </div>
  );

  // ── LIST AN ITEM ──────────────────────────────────────────────────────────
  if (screen === "list") return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      {showAuth && <AuthModal />}
      <Notif />
      <div style={{ maxWidth:"600px", margin:"0 auto", padding:"100px 24px 60px" }}>
        {!user && (
          <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"16px", padding:"16px 20px", marginBottom:"24px", display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"20px" }}>⚠️</span>
            <div style={{ fontSize:"14px", color:"#92400E" }}>
              <strong>Sign up first</strong> to list an item. It only takes a minute.
              <button onClick={()=>{ setAuthMode("signup"); setShowAuth(true); }} style={{ background:"none", border:"none", color:"#D97706", fontWeight:700, cursor:"pointer", marginLeft:"8px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px" }}>Sign up →</button>
            </div>
          </div>
        )}

        {listStep < 4 ? (
          <>
            <div style={{ display:"flex", gap:"4px", marginBottom:"36px" }}>
              {["Details","Description","Pricing","Review"].map((s,i)=>(
                <div key={i} style={{ flex:1 }}>
                  <div style={{ height:"4px", borderRadius:"100px", background: i<=listStep?"#16A34A":"#E5E7EB", marginBottom:"5px", transition:"background 0.3s" }} />
                  <div style={{ fontSize:"10px", color: i<=listStep?"#16A34A":"#9CA3AF", fontWeight: i===listStep?600:400, textAlign:"center" }}>{s}</div>
                </div>
              ))}
            </div>

            {listStep === 0 && (
              <div style={{ animation:"fadeUp 0.4s ease" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"6px" }}>What are you listing?</h2>
                <p style={{ fontSize:"15px", color:"#6B7280", marginBottom:"28px" }}>Give it a name that makes it easy to find.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Item name *</label>
                    <input className="inp" placeholder="e.g. Sony A7III Camera with 50mm lens" value={listForm.title} onChange={e=>setListForm(f=>({...f,title:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Category *</label>
                    <select className="inp" value={listForm.cat} onChange={e=>setListForm(f=>({...f,cat:e.target.value}))}>
                      {CATS.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>City *</label>
                    <input className="inp" placeholder="e.g. Baku" value={listForm.city} onChange={e=>setListForm(f=>({...f,city:e.target.value}))} />
                  </div>
                </div>
              </div>
            )}

            {listStep === 1 && (
              <div style={{ animation:"fadeUp 0.4s ease" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"6px" }}>Describe your item</h2>
                <p style={{ fontSize:"15px", color:"#6B7280", marginBottom:"28px" }}>Good descriptions get 3x more bookings.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Description</label>
                    <textarea className="inp" rows={5} placeholder="Condition, what's included, any important details..." value={listForm.desc} onChange={e=>setListForm(f=>({...f,desc:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Rental rules (one per line)</label>
                    <textarea className="inp" rows={3} placeholder={"Return fully charged\nNo commercial use\nClean before returning"} value={listForm.rules} onChange={e=>setListForm(f=>({...f,rules:e.target.value}))} />
                  </div>
                </div>
              </div>
            )}

            {listStep === 2 && (
              <div style={{ animation:"fadeUp 0.4s ease" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"6px" }}>Set your price</h2>
                <p style={{ fontSize:"15px", color:"#6B7280", marginBottom:"28px" }}>You keep 90%. We take 10% to cover insurance and platform costs.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Daily price (₼) *</label>
                    <div style={{ position:"relative" }}>
                      <div style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", fontFamily:"'Fraunces',serif", fontSize:"20px", color:"#6B7280", pointerEvents:"none" }}>₼</div>
                      <input className="inp" style={{ paddingLeft:"34px", fontSize:"20px", fontFamily:"'Fraunces',serif" }} placeholder="0" type="number" value={listForm.price} onChange={e=>setListForm(f=>({...f,price:e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Security deposit (₼) — optional</label>
                    <div style={{ position:"relative" }}>
                      <div style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", fontFamily:"'Fraunces',serif", fontSize:"20px", color:"#6B7280", pointerEvents:"none" }}>₼</div>
                      <input className="inp" style={{ paddingLeft:"34px", fontSize:"20px", fontFamily:"'Fraunces',serif" }} placeholder="0" type="number" value={listForm.deposit} onChange={e=>setListForm(f=>({...f,deposit:e.target.value}))} />
                    </div>
                    <div style={{ fontSize:"12px", color:"#9CA3AF", marginTop:"6px" }}>Held by Stripe and returned automatically when item comes back safely.</div>
                  </div>

                  {listForm.price && (
                    <div style={{ background:"#DCFCE7", borderRadius:"14px", padding:"18px" }}>
                      <div style={{ fontSize:"13px", color:"#166534", fontWeight:600, marginBottom:"8px" }}>💰 Your earnings breakdown</div>
                      {[
                        [`Per rental (1 day)`, `₼${Math.round(parseInt(listForm.price)*0.9)}`],
                        [`Per week`, `₼${Math.round(parseInt(listForm.price)*0.9*7)}`],
                        [`Per month (fully booked)`, `₼${Math.round(parseInt(listForm.price)*0.9*30)}`],
                      ].map(([l,v])=>(
                        <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color:"#166534", marginBottom:"4px" }}>
                          <span>{l}</span><strong>{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {listStep === 3 && (
              <div style={{ animation:"fadeUp 0.4s ease" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"6px" }}>Review your listing</h2>
                <p style={{ fontSize:"15px", color:"#6B7280", marginBottom:"28px" }}>Looks good? Hit publish.</p>
                <div className="card" style={{ padding:"24px", marginBottom:"20px" }}>
                  <div style={{ height:"140px", background:"linear-gradient(135deg,#1A1A2E,#2A2A4E)", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"56px" }}>
                    {CATS.find(c=>c.id===listForm.cat)?.icon || "📦"}
                  </div>
                  {[
                    ["Title", listForm.title || "—"],
                    ["Category", CATS.find(c=>c.id===listForm.cat)?.label],
                    ["City", listForm.city],
                    ["Daily price", listForm.price ? `₼${listForm.price}` : "—"],
                    ["Deposit", listForm.deposit ? `₼${listForm.deposit}` : "None"],
                  ].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", padding:"8px 0", borderBottom:"1px solid #F8F7F4" }}>
                      <span style={{ color:"#9CA3AF" }}>{l}</span>
                      <span style={{ fontWeight:500, color:"#111" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"14px", padding:"14px 16px", fontSize:"13px", color:"#166534" }}>
                  ✓ Your item will be automatically insured once you connect your bank account in settings.
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:"10px", marginTop:"28px" }}>
              {listStep > 0 && <button className="btn btn-outline btn-lg" style={{ flex:1 }} onClick={()=>setListStep(s=>s-1)}>← Back</button>}
              <button
                className="btn btn-green btn-lg"
                style={{ flex:2 }}
                onClick={()=>{ listStep < 3 ? setListStep(s=>s+1) : submitListing(); }}
                disabled={listStep===0&&!listForm.title}
              >
                {listStep < 3 ? "Continue →" : "Publish listing 🎉"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease" }}>
            <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"36px", animation:"pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"36px", fontWeight:700, color:"#111", marginBottom:"8px" }}>You're live!</h2>
            <p style={{ fontSize:"16px", color:"#6B7280", marginBottom:"6px" }}><strong style={{ color:"#111" }}>{listForm.title}</strong> is now visible to renters.</p>
            <p style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"32px" }}>You'll get notified when someone books.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              <button className="btn btn-green btn-lg btn-full" onClick={()=>{ setDashTab("listings"); setScreen("dashboard"); }}>Manage in dashboard</button>
              <button className="btn btn-outline btn-lg btn-full" onClick={()=>{ setListStep(0); setListForm({ title:"", cat:"cameras", price:"", deposit:"", desc:"", city:"Baku", rules:"" }); }}>List another item</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  if (screen === "dashboard" && user) return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      <Notif />
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"90px 24px 60px", display:"grid", gridTemplateColumns:"220px 1fr", gap:"32px", alignItems:"start" }}>

        {/* Sidebar */}
        <div className="card" style={{ padding:"20px", position:"sticky", top:"90px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px", paddingBottom:"20px", borderBottom:"1px solid #F0EFEC" }}>
            <Avatar name={user.name} size={44} bg="#16A34A" />
            <div>
              <div style={{ fontWeight:600, fontSize:"15px", color:"#111" }}>{user.name}</div>
              <div style={{ fontSize:"12px", color:"#9CA3AF" }}>Member since {user.joined}</div>
              {!user.verified && (
                <button onClick={()=>setScreen("verify")} style={{ background:"none", border:"none", color:"#F59E0B", fontSize:"11px", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", padding:0, marginTop:"2px" }}>
                  ⚠️ Verify ID
                </button>
              )}
              {user.verified && <div style={{ fontSize:"11px", color:"#16A34A", fontWeight:600 }}>✓ Verified</div>}
            </div>
          </div>
          {[
            { id:"overview",  icon:"◈", label:"Overview" },
            { id:"bookings",  icon:"📅", label:"My Bookings" },
            { id:"listings",  icon:"📦", label:"My Listings" },
            { id:"earnings",  icon:"💰", label:"Earnings" },
            { id:"settings",  icon:"⚙️", label:"Settings" },
          ].map(item=>(
            <button key={item.id} className={`dash-nav-btn ${dashTab===item.id?"active":""}`} onClick={()=>setDashTab(item.id)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #F0EFEC" }}>
            <button className="dash-nav-btn" onClick={()=>{ setUser(null); setScreen("home"); showNotif("Logged out"); }}>
              <span>←</span> Log out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div>
          {dashTab === "overview" && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"24px" }}>
                Good morning, {user.name.split(" ")[0]} 👋
              </h2>

              {!user.verified && (
                <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"16px", padding:"18px 20px", marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>
                  <div>
                    <div style={{ fontWeight:600, color:"#92400E", marginBottom:"3px" }}>⚠️ Complete your verification</div>
                    <div style={{ fontSize:"13px", color:"#B45309" }}>Verify your identity to start booking and renting. Takes 60 seconds.</div>
                  </div>
                  <button className="btn btn-dark" onClick={()=>setScreen("verify")}>Verify now</button>
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"28px" }}>
                {[
                  { label:"Active bookings", value:"1", icon:"📅", color:"#EFF6FF" },
                  { label:"Items listed", value:`${OWNER_LISTINGS.length}`, icon:"📦", color:"#F0FDF4" },
                  { label:"Total earned", value:"₼117", icon:"💰", color:"#FEF3C7" },
                ].map(s=>(
                  <div key={s.label} className="card" style={{ padding:"20px", background:s.color, border:"none" }}>
                    <div style={{ fontSize:"24px", marginBottom:"8px" }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"4px" }}>{s.value}</div>
                    <div style={{ fontSize:"12px", color:"#6B7280" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:600, color:"#111", marginBottom:"16px" }}>Recent activity</h3>
              <div className="card" style={{ padding:"20px" }}>
                {OWNER_BOOKINGS.slice(0,3).map((b,i)=>(
                  <div key={b.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 0", borderBottom: i<2?"1px solid #F8F7F4":"none" }}>
                    <Avatar name={b.avatar} size={38} bg={b.status==="active"?"#16A34A":b.status==="pending"?"#F59E0B":"#6B7280"} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:500, fontSize:"14px", color:"#111" }}>{b.renter} booked <em>{b.item}</em></div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF" }}>{b.date} · {b.days} day{b.days>1?"s":""}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:600, fontSize:"14px", color:"#111" }}>₼{b.total}</div>
                      <Badge label={b.status} color={b.status==="active"?"#DCFCE7":b.status==="pending"?"#FEF3C7":"#F3F4F6"} text={b.status==="active"?"#16A34A":b.status==="pending"?"#D97706":"#6B7280"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === "bookings" && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"24px" }}>My Bookings</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {bookingDone ? (
                  <div className="card" style={{ padding:"20px", display:"flex", alignItems:"center", gap:"16px" }}>
                    <span style={{ fontSize:"40px" }}>{selected?.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:"15px", color:"#111", marginBottom:"3px" }}>{selected?.title}</div>
                      <div style={{ fontSize:"13px", color:"#9CA3AF" }}>by {selected?.owner} · {days} day{days>1?"s":""}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:700, color:"#111" }}>₼{selected ? selected.price*days+Math.round(selected.price*days*0.1)+5 : 0}</div>
                      <Badge label="Active" color="#DCFCE7" text="#16A34A" />
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"60px 20px" }}>
                    <div style={{ fontSize:"40px", marginBottom:"14px" }}>📅</div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", color:"#111", marginBottom:"8px" }}>No bookings yet</div>
                    <div style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"20px" }}>Find something to rent nearby.</div>
                    <button className="btn btn-green btn-lg" onClick={()=>setScreen("browse")}>Browse items</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {dashTab === "listings" && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111" }}>My Listings</h2>
                <button className="btn btn-green" onClick={()=>setScreen("list")}>+ Add item</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {OWNER_LISTINGS.map(item=>(
                  <div key={item.id} className="card" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:"16px" }}>
                    <div style={{ width:"56px", height:"56px", borderRadius:"14px", background:`linear-gradient(135deg,${item.color},${item.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", flexShrink:0 }}>{item.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:"15px", color:"#111", marginBottom:"3px" }}>{item.title}</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF" }}>📍 {item.city} · ₼{item.price}/day · {item.reviews} reviews</div>
                    </div>
                    <div style={{ textAlign:"right", display:"flex", flexDirection:"column", gap:"6px", alignItems:"flex-end" }}>
                      <Badge label={item.availability} color="#DCFCE7" text="#16A34A" />
                      <div style={{ display:"flex", gap:"6px" }}>
                        <button className="btn btn-ghost" style={{ padding:"4px 10px", fontSize:"12px" }}>Edit</button>
                        <button className="btn btn-ghost" style={{ padding:"4px 10px", fontSize:"12px", color:"#EF4444" }}>Pause</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashTab === "earnings" && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"24px" }}>Earnings</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"28px" }}>
                {[["₼117","This month"],["₼892","All time"],["₼35","Pending payout"]].map(([v,l])=>(
                  <div key={l} className="card" style={{ padding:"20px" }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"4px" }}>{v}</div>
                    <div style={{ fontSize:"13px", color:"#6B7280" }}>{l}</div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:"20px", marginBottom:"20px" }}>
                <div style={{ fontWeight:600, fontSize:"16px", color:"#111", marginBottom:"16px" }}>Transaction history</div>
                {OWNER_BOOKINGS.map((b,i)=>(
                  <div key={b.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i<OWNER_BOOKINGS.length-1?"1px solid #F8F7F4":"none" }}>
                    <div>
                      <div style={{ fontSize:"14px", fontWeight:500, color:"#111" }}>{b.renter} · {b.item}</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF" }}>{b.date}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontWeight:700, color:"#16A34A" }}>+₼{Math.round(b.total*0.9)}</div>
                      <div style={{ fontSize:"11px", color:"#9CA3AF" }}>after 10% fee</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:"20px", background:"#F0FDF4", border:"1px solid #BBF7D0" }}>
                <div style={{ fontWeight:600, color:"#166534", marginBottom:"6px" }}>💳 Payout method</div>
                <div style={{ fontSize:"13px", color:"#16A34A", marginBottom:"12px" }}>Connect your bank account to receive payouts every Monday.</div>
                <button className="btn btn-green">Connect bank account →</button>
              </div>
            </div>
          )}

          {dashTab === "settings" && (
            <div style={{ animation:"fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"28px", fontWeight:700, color:"#111", marginBottom:"24px" }}>Settings</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {[
                  { title:"Profile information", desc:"Name, email, phone number", icon:"👤" },
                  { title:"Identity verification", desc: user.verified ? "✓ Verified via Stripe Identity" : "⚠️ Not verified — required to book", icon:"🛡", action: !user.verified ? ()=>setScreen("verify") : null, actionLabel:"Verify now" },
                  { title:"Payment methods", desc:"Add or remove cards", icon:"💳" },
                  { title:"Bank account", desc:"For receiving payouts", icon:"🏦" },
                  { title:"Notifications", desc:"Email and push preferences", icon:"🔔" },
                  { title:"Privacy & data", desc:"Control your data", icon:"🔒" },
                ].map(s=>(
                  <div key={s.title} className="card" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:"14px" }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"#F8F7F4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>{s.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:"14px", color:"#111" }}>{s.title}</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF" }}>{s.desc}</div>
                    </div>
                    {s.action ? (
                      <button className="btn btn-dark" style={{ fontSize:"12px", padding:"8px 14px" }} onClick={s.action}>{s.actionLabel}</button>
                    ) : (
                      <span style={{ color:"#9CA3AF", fontSize:"18px" }}>›</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}
