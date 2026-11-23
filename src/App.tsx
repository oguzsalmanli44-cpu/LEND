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

// Product photos from Unsplash (free to use under the Unsplash License).
import camera from "./photos/camera.jpg";
import drill from "./photos/drill.jpg";
import surfboard from "./photos/surfboard.jpg";
import guitar from "./photos/guitar.jpg";
import drone from "./photos/drone.jpg";
import backpack from "./photos/backpack.jpg";
import speakers from "./photos/speakers.jpg";
import tent from "./photos/tent.jpg";
import instant from "./photos/instant.jpg";
import macbook from "./photos/macbook.jpg";
import tesla from "./photos/tesla.jpg";
import studio from "./photos/studio.jpg";
import jbl from "./photos/jbl.jpg";
import nikon from "./photos/nikon.jpg";

// ── Dates ─────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const rel = n => { const d = today(); d.setDate(d.getDate()+n); return iso(d); };
const parseIso = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
const dayDiff = (a, b) => Math.round((parseIso(b) - parseIso(a)) / 86400000);
const fmtDate = s => parseIso(s).toLocaleDateString("en-GB", { day:"numeric", month:"short" });
const fmtRange = (a, b) => a === b ? fmtDate(a) : `${fmtDate(a)} – ${fmtDate(b)}`;

// ── Pricing ───────────────────────────────────────────────────────────────
// Longer rentals get cheaper per day: 10% off from 3 days, 20% off from 7 days.
const discountRate = days => days >= 7 ? 0.2 : days >= 3 ? 0.1 : 0;
const DELIVERY_FEE = 10;
function quote(item, days, delivery = false) {
  const base = item.price * days;
  const discount = Math.round(base * discountRate(days));
  const fee = Math.round((base - discount) * 0.1);
  const insurance = item.insured ? 5 : 0;
  const deliveryFee = delivery ? DELIVERY_FEE : 0;
  return { base, discount, fee, insurance, deliveryFee, total: base - discount + fee + insurance + deliveryFee };
}

// Baku metro stations used for pickup points.
const METRO = ["28 May","Nizami","Sahil","İçərişəhər","Gənclik","Nərimanov","Elmlər Akademiyası","İnşaatçılar","20 Yanvar","Koroğlu","Neftçilər","Xalqlar Dostluğu","Memar Əcəmi","Həzi Aslanov","Nəsimi","8 Noyabr"];

const LISTINGS = [
  { id:1,  cat:"cameras",  title:"Sony A7III + 50mm Lens",       photo:camera,    owner:"Elvin K.",   ownerRating:4.9, ownerJoined:"2023", city:"Baku",     metro:"28 May",            price:35,  deposit:200, retail:4200,  rating:4.9, reviews:28, color:"#1A1A2E", emoji:"📷", desc:"Full frame mirrorless, perfect for weddings or portraits. Includes battery, charger, 64GB card.", rules:["Return fully charged","Include all accessories","No commercial use without approval"], insured:true,  verified:true, availability:"Available now",     bookedDates:[rel(3),rel(4),rel(5)] },
  { id:2,  cat:"tools",    title:"Cordless Drill + Bit Set",     photo:drill,     owner:"Ruslan M.",  ownerRating:4.8, ownerJoined:"2022", city:"Baku",     metro:"Nərimanov",         price:12,  deposit:80,  retail:450,   rating:4.8, reviews:41, color:"#1C3A1C", emoji:"🔧", desc:"18V cordless drill with two batteries and a full bit set. Perfect for home renovation projects.", rules:["Clean before return","No masonry without asking","Return same day if 1-day rental"], insured:true,  verified:true, availability:"Available now",     bookedDates:[rel(1)] },
  { id:3,  cat:"sports",   title:"Surfboard — 7ft Funboard",     photo:surfboard, owner:"Leyla A.",   ownerRating:5.0, ownerJoined:"2024", city:"Sumqayit", metro:null,                price:25,  deposit:150, retail:900,   rating:5.0, reviews:12, color:"#1A2A3A", emoji:"🏄", desc:"Great for beginners and intermediate surfers. Includes leash and wax.", rules:["Rinse after use","No rocks or reef","Carry bag must be returned"], insured:true,  verified:true, availability:"Available weekends", bookedDates:[rel(6),rel(7)] },
  { id:4,  cat:"music",    title:"Electric Guitar + Amp",        photo:guitar,    owner:"Kamran B.",  ownerRating:4.7, ownerJoined:"2023", city:"Baku",     metro:"Gənclik",           price:20,  deposit:300, retail:2600,  rating:4.7, reviews:19, color:"#2A1A1A", emoji:"🎸", desc:"Strat-style electric guitar with a 30W practice amp, cable, and picks.", rules:["No outdoor gigs","Handle with care","Includes free lesson if needed"], insured:true,  verified:true, availability:"Available now",     bookedDates:[] },
  { id:5,  cat:"tech",     title:"DJI Mavic 3 Drone",            photo:drone,     owner:"Nigar S.",   ownerRating:4.9, ownerJoined:"2022", city:"Baku",     metro:"Sahil",             price:55,  deposit:400, retail:3800,  rating:4.9, reviews:33, color:"#1A1A1A", emoji:"🚁", desc:"4K drone with obstacle avoidance. Great for real estate, events, or travel content. Three batteries included.", rules:["Must have drone license","No fly zones apply","Return with full battery"], insured:true,  verified:true, availability:"Available now",     bookedDates:[rel(10),rel(11)] },
  { id:6,  cat:"travel",   title:"65L Hiking Backpack",          photo:backpack,  owner:"Tural N.",   ownerRating:4.6, ownerJoined:"2023", city:"Baku",     metro:"Elmlər Akademiyası", price:10,  deposit:60,  retail:550,   rating:4.6, reviews:22, color:"#2A1C10", emoji:"🎒", desc:"Fully loaded hiking backpack with rain cover. Ideal for Quba, Qəbələ or Şahdağ trips.", rules:["Empty before return","No machine wash","Patch any tears"], insured:false, verified:true, availability:"Available now",     bookedDates:[] },
  { id:7,  cat:"events",   title:"PA Speaker System",            photo:speakers,  owner:"Anar Q.",    ownerRating:4.8, ownerJoined:"2021", city:"Baku",     metro:"Nizami",            price:45,  deposit:500, retail:5500,  rating:4.8, reviews:15, color:"#1A0A2A", emoji:"🔊", desc:"Two 12\" powered speakers + mixer. Handles 200 people.", rules:["Delivery available (+₼20)","Setup help included","Return by 10am next day"], insured:true,  verified:true, availability:"Book 2 days ahead", bookedDates:[rel(2),rel(9)] },
  { id:8,  cat:"outdoor",  title:"4-Person Camping Tent",        photo:tent,      owner:"Sevinc R.",  ownerRating:4.9, ownerJoined:"2023", city:"Ganja",    metro:null,                price:15,  deposit:100, retail:400,   rating:4.9, reviews:37, color:"#0A2A1A", emoji:"⛺", desc:"Waterproof, easy setup tent with stakes and poles.", rules:["Dry before returning","No fires near tent","Stake bag must be included"], insured:false, verified:true, availability:"Available now",     bookedDates:[] },
  { id:9,  cat:"events",   title:"Polaroid Instant Camera",      photo:instant,   owner:"Farid O.",   ownerRating:4.8, ownerJoined:"2023", city:"Baku",     metro:"İçərişəhər",        price:8,   deposit:60,  retail:250,   rating:4.8, reviews:24, color:"#1A2A1A", emoji:"📸", desc:"Instant camera for weddings and birthdays. Film packs available from the owner at cost.", rules:["Film not included","Keep away from sand and water","Return in the case"], insured:true,  verified:true, availability:"Available now",     bookedDates:[] },
  { id:10, cat:"tech",     title:"MacBook Pro 16\"",             photo:macbook,   owner:"Zulfiya H.", ownerRating:4.7, ownerJoined:"2022", city:"Baku",     metro:"28 May",            price:40,  deposit:600, retail:6500,  rating:4.7, reviews:9,  color:"#1C1C2A", emoji:"💻", desc:"Fast laptop for editing and design work. Fully wiped between rentals.", rules:["No software installs","Return in sleeve","Password set by owner"], insured:true,  verified:true, availability:"Available now",     bookedDates:[] },
  { id:11, cat:"vehicles", title:"Tesla Model 3 — Day Rental",   photo:tesla,     owner:"Orxan I.",   ownerRating:5.0, ownerJoined:"2022", city:"Baku",     metro:"Koroğlu",           price:80,  deposit:800, retail:75000, rating:5.0, reviews:18, color:"#0A0A1A", emoji:"🚗", desc:"Full electric, autopilot enabled. Includes full charge. 200km/day included.", rules:["Valid driving license required","Return with same charge","No smoking"], insured:true,  verified:true, availability:"Weekends only",     bookedDates:[rel(4),rel(5)] },
  { id:12, cat:"homes",    title:"Sunny Studio — Old City",      photo:studio,    owner:"Aytac L.",   ownerRating:4.6, ownerJoined:"2021", city:"Baku",     metro:"İçərişəhər",        price:120, deposit:0,   retail:null,  rating:4.6, reviews:11, color:"#1A0800", emoji:"🏠", desc:"Bright studio a short walk from the Old City. Ideal for photoshoots, workshops or small events.", rules:["Max 8 people","No loud music after 10pm","Cleaning fee ₼30 applies"], insured:true,  verified:true, availability:"Available now",     bookedDates:[rel(0),rel(1)] },
  { id:13, cat:"music",    title:"JBL Flip Bluetooth Speaker",   photo:jbl,       owner:"Rəşad M.",   ownerRating:4.8, ownerJoined:"2024", city:"Baku",     metro:"Gənclik",           price:6,   deposit:50,  retail:230,   rating:4.8, reviews:31, color:"#111111", emoji:"🔊", desc:"Waterproof portable speaker, 12 hours of battery. Perfect for a picnic at the Boulevard.", rules:["Return charged","Charging cable included"], insured:false, verified:true, availability:"Available now",     bookedDates:[] },
  { id:14, cat:"cameras",  title:"Nikon D750 + 50mm f/1.8",      photo:nikon,     owner:"Günay T.",   ownerRating:4.9, ownerJoined:"2022", city:"Baku",     metro:"Memar Əcəmi",       price:28,  deposit:200, retail:2900,  rating:4.9, reviews:17, color:"#1A1A1A", emoji:"📷", desc:"Full frame DSLR with a sharp 50mm prime. Two batteries and a 64GB card.", rules:["Return fully charged","Format card before return"], insured:true,  verified:true, availability:"Available now",     bookedDates:[rel(7)] },
];

const EMPTY_LIST_FORM = { title:"", cat:"cameras", price:"", deposit:"", retail:"", desc:"", city:"Baku", metro:"28 May", rules:"", photo:null };

function datesBetween(a, b) {
  const out = [];
  for (let d = parseIso(a); iso(d) <= b; d.setDate(d.getDate()+1)) out.push(iso(d));
  return out;
}

const DEMO_OWNER_LISTINGS = LISTINGS.slice(0, 3);
const OWNER_BOOKINGS = [
  { id:1, item:"Sony A7III + 50mm Lens",  renter:"Sara M.", days:3, total:105, date:fmtRange(rel(3),rel(5)),   status:"active",    avatar:"S" },
  { id:2, item:"Sony A7III + 50mm Lens",  renter:"Ali K.",  days:1, total:35,  date:fmtDate(rel(9)),           status:"pending",   avatar:"A" },
  { id:3, item:"Polaroid Instant Camera", renter:"Lena B.", days:3, total:24,  date:fmtRange(rel(-12),rel(-10)), status:"completed", avatar:"L" },
  { id:4, item:"Cordless Drill + Bit Set",renter:"Musa T.", days:1, total:12,  date:fmtDate(rel(-20)),         status:"completed", avatar:"M" },
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

// Baku Metro style "M" marker for pickup points.
function MetroTag({ station, city, light=false }) {
  if (!station) return <span>📍 {city}</span>;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"5px" }}>
      <span className="metro-m">M</span>
      <span style={{ color: light ? "#fff" : undefined }}>{station}</span>
    </span>
  );
}

// Item photo, or a coloured panel with the category emoji when there is no photo.
function ItemPhoto({ item, height, radius=0, emojiSize=56, children }) {
  return (
    <div className="ph" style={{ height, borderRadius:radius, background:`linear-gradient(135deg,${item.color},${item.color}AA)` }}>
      {item.photo
        ? <img src={item.photo} alt={item.title} loading="lazy" />
        : <span style={{ fontSize:emojiSize }}>{item.emoji}</span>}
      {children}
    </div>
  );
}

// Month calendar for picking a rental date range. Booked and past days are blocked.
function RangeCalendar({ booked, range, onChange }) {
  const [offset, setOffset] = useState(0);
  const first = today(); first.setDate(1); first.setMonth(first.getMonth() + offset);
  const year = first.getFullYear(), month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday first
  const todayIso = iso(today());
  const bookedSet = new Set(booked);

  const pick = d => {
    if (bookedSet.has(d) || d < todayIso) return;
    const { start, end } = range;
    if (!start || end || d < start) return onChange({ start:d, end:null });
    const clash = datesBetween(start, d).some(x => bookedSet.has(x));
    onChange(clash ? { start:d, end:null } : { start, end:d });
  };

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(<div key={"b"+i} />);
  for (let n = 1; n <= daysInMonth; n++) {
    const d = `${year}-${pad(month+1)}-${pad(n)}`;
    const end = range.end || range.start;
    const isBooked = bookedSet.has(d), isPast = d < todayIso;
    const isEdge = d === range.start || d === range.end;
    const inRange = range.start && d > range.start && d < end;
    cells.push(
      <button key={d} type="button" onClick={()=>pick(d)} disabled={isBooked || isPast}
        className={`cal-day${isEdge?" edge":""}${inRange?" in":""}${isBooked?" booked":""}${d===todayIso?" today":""}`}
        aria-label={`${d}${isBooked?" (booked)":""}`}>
        {n}
      </button>
    );
  }

  return (
    <div className="cal">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
        <button type="button" className="cal-nav" onClick={()=>setOffset(o=>Math.max(0,o-1))} disabled={offset===0} aria-label="Previous month">‹</button>
        <div style={{ fontWeight:600, fontSize:"14px" }}>{first.toLocaleDateString("en-GB", { month:"long", year:"numeric" })}</div>
        <button type="button" className="cal-nav" onClick={()=>setOffset(o=>Math.min(5,o+1))} aria-label="Next month">›</button>
      </div>
      <div className="cal-grid">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(w=><div key={w} className="cal-w">{w}</div>)}
        {cells}
      </div>
      <div style={{ display:"flex", gap:"14px", fontSize:"11px", color:"#6B7280", marginTop:"10px" }}>
        <span><span className="cal-key" style={{ background:"#16A34A" }} /> Your dates</span>
        <span><span className="cal-key" style={{ background:"#F3F4F6", textDecoration:"line-through" }} /> Booked</span>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]           = useState("home");
  const [cat, setCat]                 = useState("all");
  const [search, setSearch]           = useState("");
  const [listings, setListings]       = useState(LISTINGS);
  const [selected, setSelected]       = useState(null);
  const [range, setRange]             = useState({ start:null, end:null }); // selected rental dates
  const [delivery, setDelivery]       = useState(false);
  const [metroFilter, setMetroFilter] = useState("all");
  const [sort, setSort]               = useState("popular"); // popular | price-asc | price-desc | rating
  const [insuredOnly, setInsuredOnly] = useState(false);
  const [maxPrice, setMaxPrice]       = useState(0); // 0 = any
  const [pickupPhotos, setPickupPhotos] = useState([null, null, null]);
  const [booking, setBooking]         = useState(null);
  const [saved, setSaved]             = useState([]);
  const [user, setUser]               = useState(null); // null = logged out
  const [showAuth, setShowAuth]       = useState(false);
  const [authMode, setAuthMode]       = useState("login"); // login | signup
  const [authStep, setAuthStep]       = useState(0); // 0=creds, 1=verify, 2=done
  const [authForm, setAuthForm]       = useState({ name:"", email:"", password:"" });
  const [verifyStep, setVerifyStep]   = useState(0); // 0=id, 1=selfie, 2=done
  const [listStep, setListStep]       = useState(0);
  const [listForm, setListForm]       = useState(EMPTY_LIST_FORM);
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

  const q = search.trim().toLowerCase();
  const filtered = listings.filter(l => {
    const mc = cat === "all" || l.cat === cat;
    const ms = !q || [l.title, l.city, l.cat, l.metro || "", l.desc].some(f => f.toLowerCase().includes(q));
    const mm = metroFilter === "all" || l.metro === metroFilter;
    const mi = !insuredOnly || l.insured;
    const mp = !maxPrice || l.price <= maxPrice;
    return mc && ms && mm && mi && mp;
  }).sort((a, b) =>
    sort === "price-asc" ? a.price - b.price :
    sort === "price-desc" ? b.price - a.price :
    sort === "rating" ? b.rating - a.rating :
    b.reviews - a.reviews
  );

  // Rental length in days (inclusive), from the picked date range.
  const days = range.start ? dayDiff(range.start, range.end || range.start) + 1 : 1;

  const openListing = item => {
    setSelected(item);
    setRange({ start:null, end:null });
    setDelivery(false);
    setScreen("listing");
    window.scrollTo(0, 0);
  };

  const go = s => { setScreen(s); window.scrollTo(0, 0); };

  // Read a picked image file into a data URL so it can be shown right away.
  const readPhoto = (file, done) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => done(r.result);
    r.readAsDataURL(file);
  };

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    if (!user) { setShowAuth(true); setAuthMode("signup"); return; }
    setSaved(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
    showNotif(saved.includes(id) ? "Removed from saved" : "Saved ❤️");
  };

  const handleBook = () => {
    if (!user) { setShowAuth(true); setAuthMode("signup"); return; }
    if (!user.verified) { go("verify"); return; }
    if (!range.start) { showNotif("Pick your dates first", "error"); return; }
    const end = range.end || range.start;
    const b = { item:selected, start:range.start, end, days, delivery, ...quote(selected, days, delivery) };
    setBooking(b);
    setListings(ls => ls.map(l => l.id === selected.id
      ? { ...l, bookedDates:[...l.bookedDates, ...datesBetween(range.start, end)] } : l));
    setPickupPhotos([null, null, null]);
    setBookingDone(true);
    go("booked");
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
    go(selected ? "listing" : "home");
    showNotif("Identity verified ✓");
  };

  const submitListing = () => {
    const newItem = {
      id: Math.max(...listings.map(l=>l.id)) + 1,
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
      photo: listForm.photo,
      metro: listForm.city === "Baku" ? listForm.metro : null,
      retail: parseInt(listForm.retail) || null,
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

  // Items the signed-in user listed this session, followed by demo listings.
  const myListings = [...listings.filter(l => user && l.owner === user.name), ...DEMO_OWNER_LISTINGS];

  // ── LISTING CARD ──────────────────────────────────────────────────────────
  const renderCard = (item, i) => (
    <div key={item.id} className="card card-hover" onClick={()=>openListing(item)} style={{ animation:`fadeUp 0.45s ease ${Math.min(i,8)*0.04}s both`, overflow:"hidden" }}>
      <ItemPhoto item={item} height="200px">
        <div className="ph-shade" style={{ position:"absolute", inset:0 }} />
        <button onClick={e=>toggleSave(item.id,e)} aria-label={saved.includes(item.id)?"Remove from saved":"Save"} style={{ position:"absolute", top:"12px", right:"12px", width:"32px", height:"32px", borderRadius:"50%", background:"rgba(255,255,255,0.92)", border:"none", cursor:"pointer", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {saved.includes(item.id) ? "❤️" : "🤍"}
        </button>
        <div style={{ position:"absolute", top:"12px", left:"12px", display:"flex", gap:"4px" }}>
          {item.verified && <span className="pill-light">✓ Verified</span>}
        </div>
        <div style={{ position:"absolute", bottom:"10px", left:"12px", right:"12px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"6px" }}>
          {item.insured ? <span className="pill-green">🛡 Protected</span> : <span />}
          {item.retail && <span className="pill-dark">New: ₼{item.retail.toLocaleString("en")}</span>}
        </div>
      </ItemPhoto>
      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ fontWeight:600, fontSize:"15px", color:"#111", marginBottom:"5px", lineHeight:1.3 }}>{item.title}</div>
        <div style={{ fontSize:"12px", color:"#6B7280", marginBottom:"12px", display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
          <MetroTag station={item.metro} city={item.city} />
          <span style={{ color:"#D1D5DB" }}>·</span>
          <span>{item.owner}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:700, color:"#111" }}>₼{item.price}</span>
            <span style={{ fontSize:"12px", color:"#9CA3AF" }}>/day</span>
            <div style={{ fontSize:"11px", color:"#16A34A", fontWeight:600 }}>₼{Math.round(item.price*7*0.8)} for a week</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", color:"#374151", fontWeight:600 }}>
            <span style={{ color:"#F59E0B" }}>★</span>{item.rating.toFixed(1)}
            <span style={{ color:"#9CA3AF", fontWeight:400 }}>({item.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );

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
    .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}

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

    /* Photo pills */
    .pill-light{background:rgba(255,255,255,0.92);border-radius:100px;padding:3px 10px;font-size:10px;font-weight:700;color:#16A34A;}
    .pill-green{background:rgba(22,163,74,0.92);border-radius:100px;padding:3px 10px;font-size:10px;font-weight:600;color:#fff;}
    .pill-dark{background:rgba(17,17,17,0.72);border-radius:100px;padding:3px 10px;font-size:10px;font-weight:600;color:#fff;backdrop-filter:blur(4px);}

    /* Photos */
    .ph{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;}
    .card-hover:hover .ph img{transform:scale(1.04);}
    .ph-shade::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.18) 0%,transparent 35%,transparent 65%,rgba(0,0,0,0.35) 100%);pointer-events:none;}
    .ph > *:not(img){position:relative;z-index:1;}
    .metro-m{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:#E4002B;color:#fff;font-size:9px;font-weight:700;flex-shrink:0;}

    /* Calendar */
    .cal{background:#F8F7F4;border-radius:14px;padding:14px;}
    .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
    .cal-w{font-size:10px;color:#9CA3AF;text-align:center;font-weight:600;padding-bottom:4px;}
    .cal-day{aspect-ratio:1;border:none;background:#fff;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:#111;cursor:pointer;transition:background 0.12s;font-variant-numeric:tabular-nums;}
    .cal-day:hover:not(:disabled){background:#DCFCE7;}
    .cal-day:disabled{background:transparent;color:#D1D5DB;cursor:not-allowed;}
    .cal-day.booked{text-decoration:line-through;color:#9CA3AF;background:#F3F4F6;}
    .cal-day.today{box-shadow:inset 0 0 0 1.5px #111;}
    .cal-day.in,.cal-day.in:hover:not(:disabled){background:#DCFCE7;color:#166534;border-radius:0;}
    .cal-day.edge,.cal-day.edge:hover:not(:disabled){background:#16A34A;color:#fff;font-weight:700;}
    .cal-nav{width:30px;height:30px;border-radius:50%;border:1.5px solid #E5E7EB;background:#fff;cursor:pointer;font-size:16px;}
    .cal-nav:disabled{opacity:0.35;cursor:default;}
    .cal-key{display:inline-block;width:10px;height:10px;border-radius:3px;vertical-align:-1px;margin-right:4px;}

    /* Toggle chips */
    .chip{border:1.5px solid #E5E7EB;border-radius:100px;padding:7px 14px;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#374151;transition:all 0.15s;}
    .chip.on{background:#F0FDF4;border-color:#16A34A;color:#16A34A;}
    .sel{border:1.5px solid #E5E7EB;border-radius:100px;padding:7px 30px 7px 14px;background:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#374151;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;}

    /* Photo upload slots */
    .slot{position:relative;aspect-ratio:4/3;border:2px dashed #E5E7EB;border-radius:14px;background:#FAFAF8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;overflow:hidden;font-size:12px;color:#6B7280;transition:all 0.15s;text-align:center;padding:6px;}
    .slot:hover{border-color:#16A34A;background:#F0FDF4;}
    .slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
    .slot input{position:absolute;inset:0;opacity:0;cursor:pointer;}

    button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #16A34A;outline-offset:2px;}
    @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;}}

    @media(max-width:1024px){ .hero-float{display:none!important;} }
    html,body{overflow-x:hidden;}
    @media(max-width:768px){
      .nav{padding:12px 16px;}
      .hide-mobile{display:none!important;}
      .show-mobile{display:flex!important;}
      .stack-mobile{grid-template-columns:1fr!important;gap:24px!important;}
      .hero{min-height:0!important;padding-top:104px!important;padding-bottom:56px!important;}
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

            {["🍎 Apple","🔵 Google"].map(p=>(
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
      <div className="hero" style={{ minHeight:"min(100vh, 860px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 16px 72px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)", width:"700px", height:"700px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(22,163,74,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />

        {/* Floating photo cards (desktop only) */}
        {[
          { id:1,  top:"20%",    left:"3%",  rot:"-4deg", delay:"0s" },
          { id:11, top:"24%",    right:"3%", rot:"3deg",  delay:"1s" },
          { id:4,  bottom:"16%", left:"5%",  rot:"3deg",  delay:"2s" },
          { id:5,  bottom:"14%", right:"5%", rot:"-3deg", delay:"0.5s" },
        ].map(f=>{
          const item = LISTINGS.find(l=>l.id===f.id);
          return (
            <div key={f.id} className="hero-float" onClick={()=>openListing(item)} style={{ position:"absolute", ...Object.fromEntries(["top","left","right","bottom"].filter(k=>f[k]).map(k=>[k,f[k]])), animation:`float 5s ease ${f.delay} infinite`, zIndex:1, cursor:"pointer" }}>
              <div className="card" style={{ width:"190px", padding:"8px", boxShadow:"0 12px 32px rgba(0,0,0,0.12)", borderRadius:"18px", transform:`rotate(${f.rot})` }}>
                <ItemPhoto item={item} height="120px" radius="12px" />
                <div style={{ padding:"8px 4px 2px", textAlign:"left" }}>
                  <div style={{ fontWeight:600, fontSize:"12px", color:"#111", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.title}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginTop:"2px" }}>
                    <span style={{ color:"#16A34A", fontWeight:700 }}>₼{item.price}/day</span>
                    <span style={{ color:"#6B7280", display:"inline-flex" }}><MetroTag station={item.metro} city={item.city} /></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ position:"relative", zIndex:2, maxWidth:"720px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#DCFCE7", border:"1px solid #BBF7D0", borderRadius:"100px", padding:"6px 16px", marginBottom:"24px", animation:"fadeIn 0.6s ease" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#16A34A", animation:"pulse 2s ease infinite" }} />
            <span style={{ fontSize:"12px", fontWeight:600, color:"#16A34A" }}>Live in Baku · pick up near your metro</span>
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
            {[["📷 Cameras","cameras"],["🚗 Cars","vehicles"],["🏠 Spaces","homes"],["🎸 Music","music"],["💻 Tech","tech"],["⛺ Outdoor","outdoor"]].map(([tag,id])=>(
              <button key={tag} className="cat" onClick={()=>{ setSearch(""); setCat(id); go("browse"); }} style={{ fontSize:"12px", padding:"6px 12px" }}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background:"#111", padding:"40px 32px" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"32px" }}>
          {[["₼0","to list your item"],["10%","platform fee only"],["90%","goes to the owner"],["Ⓜ","pickup near your metro"],["7+","days = 20% off"]].map(([n,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:"36px", fontWeight:700, color:"#fff", marginBottom:"4px" }}>{n}</div>
              <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:300 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:"80px 16px", maxWidth:"1000px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <div style={{ fontSize:"12px", fontWeight:600, color:"#16A34A", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>Simple by design</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(32px,5vw,52px)", fontWeight:700, letterSpacing:"-1px", color:"#111" }}>How lend. works</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:"16px" }}>
          {[
            { icon:"🔍", title:"Find", desc:"Browse thousands of items near you. Filter by category, price, or date." },
            { icon:"✅", title:"Verify", desc:"One-time ID check. Takes about a minute. Keeps everyone safe." },
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
      <div style={{ padding:"0 16px 80px", maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"28px" }}>
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, letterSpacing:"-0.5px", color:"#111" }}>Popular near you</h2>
            <div style={{ fontSize:"13px", color:"#9CA3AF", marginTop:"4px" }}>Early preview: these are example listings while we launch.</div>
          </div>
          <button className="btn btn-outline" onClick={()=>{ setCat("all"); setMetroFilter("all"); go("browse"); }}>View all →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
          {listings.slice(0,8).map(renderCard)}
        </div>
      </div>

      {/* Metro pickup */}
      <div style={{ padding:"0 16px 80px", maxWidth:"1200px", margin:"0 auto" }}>
        <div className="card" style={{ padding:"clamp(24px,4vw,40px)", display:"grid", gap:"20px" }}>
          <div>
            <div style={{ fontSize:"12px", fontWeight:600, color:"#E4002B", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}><span className="metro-m">M</span> Metro pickup</div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:700, letterSpacing:"-0.5px", color:"#111", lineHeight:1.1, textWrap:"balance" }}>Pick it up on your way home.</h2>
            <p style={{ fontSize:"15px", color:"#6B7280", lineHeight:1.7, marginTop:"10px", maxWidth:"560px" }}>Every Baku listing shows its nearest metro station. Choose yours and see what you can grab without a taxi.</p>
          </div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {METRO.filter(m=>listings.some(l=>l.metro===m)).map(m=>(
              <button key={m} className="cat" onClick={()=>{ setSearch(""); setCat("all"); setMetroFilter(m); go("browse"); }}>
                <span className="metro-m">M</span> {m}
                <span style={{ color:"#9CA3AF", fontWeight:400 }}>{listings.filter(l=>l.metro===m).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* What makes LEND different */}
      <div style={{ padding:"0 16px 80px", maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ marginBottom:"28px" }}>
          <div style={{ fontSize:"12px", fontWeight:600, color:"#16A34A", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>Only on lend.</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, letterSpacing:"-0.5px", color:"#111", lineHeight:1.1 }}>Built for renting, not just listing.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:"16px" }}>
          {[
            { k:"₼", title:"Rent vs buy", desc:"Every item shows what it costs new, so you see exactly how much you save by renting." },
            { k:"%", title:"Longer = cheaper", desc:"10% off from 3 days, 20% off from a week. Applied automatically at checkout." },
            { k:"📸", title:"Pickup photo check", desc:"Both sides snap the item's condition at handover. Disputes get settled with photos, not arguments." },
            { k:"🗓", title:"Live calendar", desc:"See booked days before you ask. Pick your dates and the price updates instantly." },
          ].map((f,i)=>(
            <div key={f.title} className="card" style={{ padding:"24px", animation:`fadeUp 0.5s ease ${i*0.06}s both` }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"#111", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',serif", fontSize:"20px", fontWeight:700, marginBottom:"16px" }}>{f.k}</div>
              <div style={{ fontWeight:600, fontSize:"16px", color:"#111", marginBottom:"6px" }}>{f.title}</div>
              <div style={{ fontSize:"13px", color:"#6B7280", lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance section */}
      <div style={{ background:"#fff", padding:"80px 32px", borderTop:"1px solid #F0EFEC", borderBottom:"1px solid #F0EFEC" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto" }}>
          <div className="stack-mobile" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#16A34A", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"12px" }}>Protection built in</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:700, letterSpacing:"-0.5px", color:"#111", marginBottom:"20px", lineHeight:1.1 }}>Every rental is<br/><em style={{ fontStyle:"italic" }}>protected.</em></h2>
              <p style={{ fontSize:"15px", color:"#6B7280", lineHeight:1.8, marginBottom:"28px" }}>
                Every rental has a deposit, a verified renter, and photos of the item's condition at pickup. If something goes wrong, there's a clear record of what happened.
              </p>
              {[
                { icon:"💳", title:"Secure deposits", desc:"Held during the rental, released on safe return" },
                { icon:"✅", title:"ID verification", desc:"Every renter verifies their ID before booking" },
                { icon:"📸", title:"Pickup photo check", desc:"Condition photos from both sides at handover" },
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
                { label:"Owners keep of every booking", value:"90%", icon:"💰", color:"#F0FDF4" },
                { label:"To list an item", value:"₼0", icon:"📦", color:"#FEF3C7" },
                { label:"Photos at every pickup", value:"3", icon:"📸", color:"#EFF6FF" },
                { label:"To verify your ID", value:"1 min", icon:"⚡", color:"#FDF4FF" },
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
        <div className="stack-mobile" style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"40px", marginBottom:"40px" }}>
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
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} lend. · Baku, Azerbaijan</span>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>Product photos from Unsplash</span>
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
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"90px 16px 60px" }}>
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

        {/* Filters */}
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center", marginBottom:"16px" }}>
          <label className="sr-only" htmlFor="f-metro">Metro station</label>
          <select id="f-metro" className="sel" value={metroFilter} onChange={e=>setMetroFilter(e.target.value)} style={metroFilter!=="all"?{ borderColor:"#E4002B", color:"#E4002B" }:undefined}>
            <option value="all">Ⓜ Any metro station</option>
            {METRO.map(m=><option key={m} value={m}>Ⓜ {m}</option>)}
          </select>
          <label className="sr-only" htmlFor="f-price">Max price per day</label>
          <select id="f-price" className="sel" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}>
            <option value={0}>Any price</option>
            {[10,25,50,100].map(p=><option key={p} value={p}>Up to ₼{p}/day</option>)}
          </select>
          <button className={`chip ${insuredOnly?"on":""}`} onClick={()=>setInsuredOnly(v=>!v)} aria-pressed={insuredOnly}>🛡 Protected only</button>
          <div style={{ flex:1 }} />
          <label className="sr-only" htmlFor="f-sort">Sort by</label>
          <select id="f-sort" className="sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="popular">Most rented</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", gap:"12px", flexWrap:"wrap" }}>
          <div style={{ fontSize:"14px", color:"#6B7280" }}>
            <strong style={{ color:"#111" }}>{filtered.length}</strong> item{filtered.length===1?"":"s"}
            {search && <> for “{search}”</>}
            {metroFilter!=="all" && <> near <strong style={{ color:"#111" }}>{metroFilter}</strong> metro</>}
            <span style={{ color:"#9CA3AF" }}> · example listings</span>
          </div>
          {(metroFilter!=="all"||insuredOnly||maxPrice||cat!=="all"||search) && (
            <button className="btn btn-ghost" style={{ padding:"6px 10px", fontSize:"12px" }} onClick={()=>{ setMetroFilter("all"); setInsuredOnly(false); setMaxPrice(0); setCat("all"); setSearch(""); }}>Clear filters</button>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
          {filtered.map(renderCard)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"64px 16px" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔍</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:"24px", color:"#111", marginBottom:"8px" }}>Nothing found</div>
            <div style={{ fontSize:"14px", color:"#9CA3AF", marginBottom:"24px" }}>Try another metro station or clear the filters, or be the first to list it.</div>
            <button className="btn btn-green btn-lg" onClick={()=>setScreen("list")}>List it yourself</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── LISTING DETAIL ────────────────────────────────────────────────────────
  if (screen === "listing" && selected) {
    const item = listings.find(l=>l.id===selected.id) || selected;
    const qt = quote(item, days, delivery);
    const rentWeek = quote(item, 7).total;
    const similar = listings.filter(l=>l.cat===item.cat && l.id!==item.id).slice(0,3);
    return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      {showAuth && <AuthModal />}
      <Notif />
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"90px 16px 60px" }}>
        <button className="btn btn-ghost" onClick={()=>go("browse")} style={{ marginBottom:"20px" }}>← Back to browse</button>

        <div className="stack-mobile" style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 380px", gap:"48px", alignItems:"start" }}>
          {/* Left */}
          <div style={{ minWidth:0 }}>
            <ItemPhoto item={item} height="clamp(260px,45vw,440px)" radius="24px" emojiSize={110}>
              <div className="ph-shade" style={{ position:"absolute", inset:0 }} />
              {item.insured && <div style={{ position:"absolute", top:"16px", left:"16px" }}><span className="pill-green" style={{ fontSize:"11px" }}>🛡 Deposit protected</span></div>}
              {item.verified && <div style={{ position:"absolute", top:"16px", right:"16px" }}><span className="pill-light" style={{ fontSize:"11px" }}>✓ Verified item</span></div>}
            </ItemPhoto>

            <div style={{ display:"flex", gap:"8px", margin:"24px 0 16px", flexWrap:"wrap" }}>
              <Badge label={item.availability} color={item.availability==="Available now"?"#DCFCE7":"#FEF3C7"} text={item.availability==="Available now"?"#16A34A":"#D97706"} />
              <Badge label={CATS.find(c=>c.id===item.cat)?.label || ""} color="#EFF6FF" text="#2563EB" />
              {item.deposit > 0 && <Badge label={`₼${item.deposit} deposit`} color="#FDF4FF" text="#7C3AED" />}
            </div>

            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(28px,4vw,38px)", fontWeight:700, letterSpacing:"-0.5px", color:"#111", marginBottom:"8px", lineHeight:1.1, textWrap:"balance" }}>{item.title}</h1>
            <div style={{ fontSize:"14px", color:"#6B7280", marginBottom:"20px", display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
              {item.metro ? <>Pickup near <MetroTag station={item.metro} city={item.city} /> metro, {item.city}</> : <>📍 Pickup in {item.city}</>}
            </div>

            {/* Rent vs buy */}
            {item.retail && (
              <div className="card" style={{ padding:"20px", marginBottom:"24px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"16px", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:"11px", fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>Buying new</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:"26px", fontWeight:700, color:"#9CA3AF", textDecoration:"line-through", fontVariantNumeric:"tabular-nums" }}>₼{item.retail.toLocaleString("en")}</div>
                </div>
                <div>
                  <div style={{ fontSize:"11px", fontWeight:600, color:"#16A34A", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>Renting for a week</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:"26px", fontWeight:700, color:"#111", fontVariantNumeric:"tabular-nums" }}>₼{rentWeek}</div>
                </div>
                <div style={{ background:"#F0FDF4", borderRadius:"12px", padding:"12px 14px", fontSize:"13px", color:"#166534", lineHeight:1.5 }}>
                  You save <strong>₼{(item.retail - rentWeek).toLocaleString("en")}</strong>. That's {Math.round((1 - rentWeek/item.retail)*100)}% less than buying.
                </div>
              </div>
            )}

            {/* Owner */}
            <div className="card" style={{ padding:"16px 20px", marginBottom:"28px", display:"flex", alignItems:"center", gap:"14px" }}>
              <Avatar name={item.owner} size={48} bg="#16A34A" />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:"15px", color:"#111" }}>{item.owner}</div>
                <div style={{ fontSize:"12px", color:"#9CA3AF" }}>Member since {item.ownerJoined} · {item.reviews} rentals · replies in ~1 hr</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <Stars r={item.ownerRating} />
                <div style={{ fontSize:"12px", color:"#6B7280" }}>{item.ownerRating} rating</div>
              </div>
            </div>

            <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:600, color:"#111", marginBottom:"12px" }}>About this item</h3>
            <p style={{ fontSize:"15px", color:"#374151", lineHeight:1.8, marginBottom:"28px", maxWidth:"65ch" }}>{item.desc}</p>

            {/* Rules */}
            {item.rules?.length > 0 && <>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:600, color:"#111", marginBottom:"12px" }}>Rental rules</h3>
              <div className="card" style={{ padding:"20px", marginBottom:"28px" }}>
                {item.rules.map((r,i)=>(
                  <div key={i} style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom: i<item.rules.length-1?"10px":0, fontSize:"14px", color:"#374151" }}>
                    <span style={{ color:"#16A34A", fontWeight:700 }}>✓</span> {r}
                  </div>
                ))}
              </div>
            </>}

            {/* Insurance details */}
            {item.insured && (
              <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"16px", padding:"20px", marginBottom:"28px" }}>
                <div style={{ fontWeight:600, fontSize:"14px", color:"#166534", marginBottom:"10px" }}>🛡 How this rental is protected</div>
                <div style={{ fontSize:"13px", color:"#166534", lineHeight:1.7 }}>
                  The owner holds a ₼{item.deposit} deposit that comes back after a safe return. At pickup, you and the owner both photograph the item, so any damage question is settled from the photos.
                </div>
              </div>
            )}

            {similar.length > 0 && <>
              <h3 style={{ fontFamily:"'Fraunces',serif", fontSize:"22px", fontWeight:600, color:"#111", marginBottom:"12px" }}>Similar items</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"14px" }}>
                {similar.map(renderCard)}
              </div>
            </>}
          </div>

          {/* Booking card */}
          <div style={{ position:"sticky", top:"90px" }}>
            <div className="card" style={{ padding:"24px", boxShadow:"0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:"4px", marginBottom:"4px" }}>
                <span style={{ fontFamily:"'Fraunces',serif", fontSize:"40px", fontWeight:700, color:"#111" }}>₼{item.price}</span>
                <span style={{ fontSize:"14px", color:"#9CA3AF" }}>/ day</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"4px", marginBottom:"18px" }}>
                <Stars r={item.rating} />
                <span style={{ fontSize:"13px", color:"#6B7280" }}>{item.rating} · {item.reviews} reviews</span>
              </div>

              <div style={{ fontSize:"12px", fontWeight:600, color:"#374151", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px", display:"flex", justifyContent:"space-between" }}>
                <span>Your dates</span>
                <span style={{ color: range.start ? "#16A34A" : "#9CA3AF", textTransform:"none", letterSpacing:0 }}>
                  {range.start ? `${fmtRange(range.start, range.end||range.start)} · ${days} day${days>1?"s":""}` : "Tap a start date"}
                </span>
              </div>
              <RangeCalendar booked={item.bookedDates} range={range} onChange={setRange} />
              {range.start && !range.end && <div style={{ fontSize:"12px", color:"#6B7280", marginTop:"8px" }}>Tap an end date, or book just this one day.</div>}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", margin:"14px 0" }}>
                {[[false,"Pick up", item.metro ? `${item.metro} metro` : item.city],[true,"Delivery", `+₼${DELIVERY_FEE} to your door`]].map(([v,l,sub])=>(
                  <button key={l} type="button" onClick={()=>setDelivery(v)} aria-pressed={delivery===v}
                    style={{ textAlign:"left", padding:"10px 12px", borderRadius:"12px", border:`1.5px solid ${delivery===v?"#16A34A":"#E5E7EB"}`, background: delivery===v?"#F0FDF4":"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{l}</div>
                    <div style={{ fontSize:"11px", color:"#6B7280" }}>{sub}</div>
                  </button>
                ))}
              </div>

              {/* Price breakdown */}
              <div style={{ background:"#F8F7F4", borderRadius:"12px", padding:"16px", marginBottom:"16px", fontVariantNumeric:"tabular-nums" }}>
                {[
                  [`₼${item.price} × ${days} day${days>1?"s":""}`, `₼${qt.base}`],
                  ...(qt.discount ? [[`${days>=7?"Weekly":"3+ day"} discount (${discountRate(days)*100}%)`, `−₼${qt.discount}`, true]] : []),
                  ["Service fee (10%)", `₼${qt.fee}`],
                  ...(qt.insurance ? [["Protection fee", `₼${qt.insurance}`]] : []),
                  ...(delivery ? [["Delivery", `₼${qt.deliveryFee}`]] : []),
                ].map(([l,v,green])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", color: green?"#16A34A":"#374151", marginBottom:"8px", fontWeight: green?600:400 }}>
                    <span>{l}</span><span style={{ fontWeight:500 }}>{v}</span>
                  </div>
                ))}
                <div style={{ height:"1px", background:"#E5E7EB", margin:"12px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"15px", fontWeight:700, color:"#111" }}>
                  <span>Due now</span>
                  <span>₼{qt.total}</span>
                </div>
                {item.deposit > 0 && <div style={{ fontSize:"11px", color:"#9CA3AF", marginTop:"4px", textAlign:"right" }}>+ ₼{item.deposit} deposit, held and returned after a safe return</div>}
                {!qt.discount && <div style={{ fontSize:"11px", color:"#16A34A", marginTop:"6px" }}>Book 3+ days for 10% off, or a week for 20% off.</div>}
              </div>

              <button className="btn btn-green btn-lg btn-full" onClick={handleBook} style={{ marginBottom:"10px" }}>
                {!user ? "Sign up to book" : !user.verified ? "Verify ID to book" : range.start ? `Book ${days} day${days>1?"s":""} · ₼${qt.total}` : "Pick dates to book"}
              </button>

              {!user?.verified && user && (
                <div style={{ background:"#FEF3C7", border:"1px solid #FDE68A", borderRadius:"10px", padding:"10px 14px", fontSize:"12px", color:"#92400E", marginBottom:"10px" }}>
                  ⚠️ Identity verification required before booking. Takes 60 seconds.
                </div>
              )}

              <div style={{ textAlign:"center", fontSize:"12px", color:"#9CA3AF" }}>Free cancellation up to 24h before · Secure payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // ── VERIFY IDENTITY ───────────────────────────────────────────────────────
  if (screen === "verify") return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      <Notif />
      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"100px 24px 60px" }}>
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"20px", background:"#F0FDF4", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"28px" }}>🛡</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"8px" }}>Verify your identity</h2>
          <p style={{ fontSize:"15px", color:"#6B7280", lineHeight:1.7 }}>One-time check. Keeps everyone safe.</p>
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
            <div style={{ fontSize:"14px", color:"#6B7280", marginBottom:"32px" }}>Checking your documents</div>
            <button className="btn btn-green btn-lg btn-full" onClick={handleVerifyDone}>
              Verification complete ✓
            </button>
          </div>
        )}

        <div style={{ marginTop:"24px", background:"#F8F7F4", borderRadius:"14px", padding:"16px", fontSize:"13px", color:"#6B7280", lineHeight:1.7 }}>
          🔒 <strong style={{ color:"#111" }}>Your privacy is protected.</strong> Your documents are encrypted and only used to confirm who you are.</div>
      </div>
    </div>
  );

  // ── BOOKED ────────────────────────────────────────────────────────────────
  if (screen === "booked" && booking) {
    const b = booking;
    const shots = pickupPhotos.filter(Boolean).length;
    return (
    <div style={{ minHeight:"100vh", background:BG }}><style>{css}</style>
      <Header minimal />
      <Notif />
      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"96px 16px 60px" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:"36px", color:"#16A34A", animation:"pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✓</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(30px,6vw,40px)", fontWeight:700, color:"#111", marginBottom:"10px" }}>Booking confirmed!</h2>
          <p style={{ fontSize:"16px", color:"#6B7280" }}>
            <strong style={{ color:"#111" }}>{b.item.owner}</strong> will confirm within 2 hours and message you {b.delivery ? "a delivery time" : "the exact pickup spot"}.
          </p>
        </div>

        <div className="card" style={{ overflow:"hidden", margin:"24px 0" }}>
          <ItemPhoto item={b.item} height="140px" />
          <div style={{ padding:"8px 20px 12px", fontVariantNumeric:"tabular-nums" }}>
            {[
              ["Item", b.item.title],
              ["Dates", `${fmtRange(b.start, b.end)} · ${b.days} day${b.days>1?"s":""}`],
              ["Handover", b.delivery ? "Delivered to your door" : b.item.metro ? `Pickup near ${b.item.metro} metro` : `Pickup in ${b.item.city}`],
              ...(b.discount ? [["Discount", `−₼${b.discount}`]] : []),
              ["Total paid", `₼${b.total}`],
              ["Deposit held", b.item.deposit ? `₼${b.item.deposit}, returned after a safe return` : "None"],
            ].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", gap:"16px", fontSize:"14px", padding:"9px 0", borderBottom:"1px solid #F3F2EF" }}>
                <span style={{ color:"#9CA3AF", flexShrink:0 }}>{l}</span>
                <span style={{ fontWeight:500, color:"#111", textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup photo check */}
        <div className="card" style={{ padding:"20px", marginBottom:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"8px", marginBottom:"6px" }}>
            <div style={{ fontWeight:700, fontSize:"16px", color:"#111" }}>📸 Pickup photo check</div>
            <div style={{ fontSize:"12px", fontWeight:600, color: shots===3?"#16A34A":"#9CA3AF" }}>{shots}/3</div>
          </div>
          <p style={{ fontSize:"13px", color:"#6B7280", lineHeight:1.6, marginBottom:"14px" }}>
            When you get the item, take 3 photos of its condition. The owner sees them too, so nobody can blame you for damage that was already there.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
            {["Front","Back","Any marks"].map((label,i)=>(
              <label key={label} className="slot" style={pickupPhotos[i]?{ borderStyle:"solid", borderColor:"#16A34A" }:undefined}>
                {pickupPhotos[i] ? <img src={pickupPhotos[i]} alt={`${label} photo`} /> : <><span style={{ fontSize:"22px" }}>＋</span>{label}</>}
                <input type="file" accept="image/*" capture="environment" aria-label={`Add ${label} photo`}
                  onChange={e=>readPhoto(e.target.files?.[0], url=>setPickupPhotos(ps=>ps.map((p,j)=>j===i?url:p)))} />
              </label>
            ))}
          </div>
          {shots===3 && <div style={{ marginTop:"12px", background:"#F0FDF4", borderRadius:"10px", padding:"10px 12px", fontSize:"12px", color:"#166534" }}>✓ Condition recorded and shared with {b.item.owner}.</div>}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <button className="btn btn-green btn-lg btn-full" onClick={()=>go("browse")}>Browse more items</button>
          <button className="btn btn-outline btn-lg btn-full" onClick={()=>{ setDashTab("bookings"); go("dashboard"); }}>View my bookings</button>
        </div>
      </div>
    </div>
    );
  }

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
                    <label htmlFor="l-city" style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>City *</label>
                    <select id="l-city" className="inp" value={listForm.city} onChange={e=>setListForm(f=>({...f,city:e.target.value}))}>
                      {["Baku","Sumqayit","Ganja","Lankaran","Mingachevir","Shaki","Quba"].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {listForm.city === "Baku" && (
                    <div>
                      <label htmlFor="l-metro" style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>Nearest metro station for pickup</label>
                      <select id="l-metro" className="inp" value={listForm.metro} onChange={e=>setListForm(f=>({...f,metro:e.target.value}))}>
                        {METRO.map(m=><option key={m}>{m}</option>)}
                      </select>
                      <div style={{ fontSize:"12px", color:"#9CA3AF", marginTop:"6px" }}>Renters filter by metro. Listings with a station get more bookings.</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#374151", marginBottom:"8px" }}>Photo</div>
                    <label className="slot" style={{ aspectRatio:"16/9", ...(listForm.photo?{ borderStyle:"solid", borderColor:"#16A34A" }:{}) }}>
                      {listForm.photo
                        ? <img src={listForm.photo} alt="Your item" />
                        : <><span style={{ fontSize:"28px" }}>📷</span><strong style={{ color:"#111" }}>Add a photo of your item</strong><span>Real photos help renters trust your listing</span></>}
                      <input type="file" accept="image/*" aria-label="Add a photo of your item" onChange={e=>readPhoto(e.target.files?.[0], url=>setListForm(f=>({...f,photo:url})))} />
                    </label>
                    {listForm.photo && <button className="btn btn-ghost" style={{ marginTop:"6px", fontSize:"12px", padding:"6px 10px" }} onClick={()=>setListForm(f=>({...f,photo:null}))}>Remove photo</button>}
                  </div>
                </div>
              </div>
            )}

            {listStep === 1 && (
              <div style={{ animation:"fadeUp 0.4s ease" }}>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"32px", fontWeight:700, color:"#111", marginBottom:"6px" }}>Describe your item</h2>
                <p style={{ fontSize:"15px", color:"#6B7280", marginBottom:"28px" }}>A clear description helps renters choose your item.</p>
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
                    <label htmlFor="l-retail" style={{ fontSize:"13px", fontWeight:600, color:"#374151", display:"block", marginBottom:"8px" }}>What would it cost to buy new? (₼)</label>
                    <div style={{ position:"relative" }}>
                      <div style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", fontFamily:"'Fraunces',serif", fontSize:"20px", color:"#6B7280", pointerEvents:"none" }}>₼</div>
                      <input id="l-retail" className="inp" style={{ paddingLeft:"34px", fontSize:"20px", fontFamily:"'Fraunces',serif" }} placeholder="0" type="number" min="0" value={listForm.retail} onChange={e=>setListForm(f=>({...f,retail:e.target.value}))} />
                    </div>
                    {parseInt(listForm.retail) > 0 && (() => {
                      const sug = Math.max(3, Math.round(parseInt(listForm.retail) * 0.03));
                      const dep = Math.round(parseInt(listForm.retail) * 0.1 / 10) * 10;
                      return (
                        <div style={{ marginTop:"10px", background:"#111", color:"#fff", borderRadius:"14px", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px", flexWrap:"wrap" }}>
                          <div style={{ fontSize:"13px", lineHeight:1.5 }}>
                            <div style={{ fontWeight:600 }}>Suggested: ₼{sug}/day, ₼{dep} deposit</div>
                            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"12px" }}>A common starting point is about 3% of the item's price per day.</div>
                          </div>
                          <button className="btn btn-green" onClick={()=>setListForm(f=>({...f,price:String(sug),deposit:String(dep)}))}>Use these</button>
                        </div>
                      );
                    })()}
                  </div>
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
                    <div style={{ fontSize:"12px", color:"#9CA3AF", marginTop:"6px" }}>Held during the rental and returned when the item comes back safely.</div>
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
                  <div style={{ marginBottom:"16px" }}>
                    <ItemPhoto item={{ title:listForm.title, photo:listForm.photo, color:"#1A1A2E", emoji:CATS.find(c=>c.id===listForm.cat)?.icon || "📦" }} height="180px" radius="14px" />
                  </div>
                  {[
                    ["Title", listForm.title || "—"],
                    ["Category", CATS.find(c=>c.id===listForm.cat)?.label],
                    ["Pickup", listForm.city === "Baku" ? `${listForm.metro} metro, Baku` : listForm.city],
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
                  ✓ Renters pay a deposit and photograph your item at pickup, so you have a record of its condition.
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
              <button className="btn btn-outline btn-lg btn-full" onClick={()=>{ setListStep(0); setListForm(EMPTY_LIST_FORM); }}>List another item</button>
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
      <div className="stack-mobile" style={{ maxWidth:"1100px", margin:"0 auto", padding:"90px 24px 60px", display:"grid", gridTemplateColumns:"220px 1fr", gap:"32px", alignItems:"start" }}>

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

              <div className="stack-mobile" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"28px" }}>
                {[
                  { label:"Active bookings", value:"1", icon:"📅", color:"#EFF6FF" },
                  { label:"Items listed", value:`${myListings.length}`, icon:"📦", color:"#F0FDF4" },
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
                {myListings.map(item=>(
                  <div key={item.id} className="card" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:"16px" }}>
                    <div style={{ width:"64px", flexShrink:0 }}><ItemPhoto item={item} height="56px" radius="12px" emojiSize={26} /></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:"15px", color:"#111", marginBottom:"3px" }}>{item.title}</div>
                      <div style={{ fontSize:"12px", color:"#9CA3AF", display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}><MetroTag station={item.metro} city={item.city} /> · ₼{item.price}/day · {item.reviews} reviews</div>
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
              <div className="stack-mobile" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"28px" }}>
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
                  { title:"Identity verification", desc: user.verified ? "✓ Verified" : "⚠️ Not verified — required to book", icon:"🛡", action: !user.verified ? ()=>setScreen("verify") : null, actionLabel:"Verify now" },
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
