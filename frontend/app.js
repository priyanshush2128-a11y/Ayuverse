const app = document.querySelector("#app");

const doctors = [
  { name: "Dr. Ananya Verma", specialty: "Gynecology & Menstrual Health", city: "Raipur", state: "Chhattisgarh", hospital: "Raipur Women's Care Clinic", experience: "13 yrs", modes: "Clinic + Video", tags: ["period", "menstrual", "cycle", "cramps", "pcos", "heavy flow", "irregular", "pelvic"], rating: 4.8 },
  { name: "Dr. Vivek Agrawal", specialty: "Internal Medicine", city: "Raipur", state: "Chhattisgarh", hospital: "Central India Preventive Health", experience: "18 yrs", modes: "Clinic + Video", tags: ["general", "fatigue", "fever", "blood pressure", "medication", "preventive"], rating: 4.7 },
  { name: "Dr. Shalini Sahu", specialty: "Endocrinology", city: "Raipur", state: "Chhattisgarh", hospital: "Raipur Diabetes & Hormone Centre", experience: "12 yrs", modes: "Clinic + Video", tags: ["thyroid", "diabetes", "blood sugar", "weight", "hormonal", "pcos"], rating: 4.7 },
  { name: "Dr. Aditya Rao", specialty: "Preventive Cardiology", city: "Raipur", state: "Chhattisgarh", hospital: "HeartFirst Raipur", experience: "15 yrs", modes: "Clinic + Video", tags: ["blood pressure", "cholesterol", "lipid", "heart", "overweight"], rating: 4.6 },
  { name: "Dr. Nisha Jain", specialty: "Nutrition & Lifestyle Medicine", city: "Raipur", state: "Chhattisgarh", hospital: "Lifestyle Reset Raipur", experience: "10 yrs", modes: "Clinic + Video", tags: ["nutrition", "overweight", "cholesterol", "triglycerides", "lifestyle", "weight"], rating: 4.6 },
  { name: "Dr. Sameer Khan", specialty: "Psychiatry & Sleep", city: "Raipur", state: "Chhattisgarh", hospital: "MindSleep Raipur", experience: "11 yrs", modes: "Clinic + Video", tags: ["stress", "sleep", "anxiety", "low energy", "mood"], rating: 4.6 },
  { name: "Dr. Meenal Deshmukh", specialty: "Gynecology & Menstrual Health", city: "Bhilai", state: "Chhattisgarh", hospital: "Bhilai Women's Health Centre", experience: "14 yrs", modes: "Clinic + Video", tags: ["period", "menstrual", "cycle", "cramps", "pcos", "irregular"], rating: 4.7 },
  { name: "Dr. Harsh Tiwari", specialty: "Family Medicine", city: "Bilaspur", state: "Chhattisgarh", hospital: "Bilaspur Family Health", experience: "16 yrs", modes: "Clinic + Video", tags: ["general", "follow-up", "medication", "records", "preventive"], rating: 4.5 },
  { name: "Dr. Asha Mehta", specialty: "Preventive Cardiology", city: "Mumbai", state: "Maharashtra", hospital: "Ayuverse Heart & Metabolic Clinic", experience: "16 yrs", modes: "Clinic + Video", tags: ["blood pressure", "cholesterol", "lipid", "heart", "overweight"], rating: 4.8 },
  { name: "Dr. Rohan Iyer", specialty: "Metabolic Health", city: "Bengaluru", state: "Karnataka", hospital: "Urban Metabolic Centre", experience: "14 yrs", modes: "Clinic + Video", tags: ["diabetes", "blood sugar", "weight", "fatigue", "sleep"], rating: 4.7 },
  { name: "Dr. Neha Kapoor", specialty: "Gynecology & Menstrual Health", city: "Delhi", state: "Delhi", hospital: "CycleCare Women's Centre", experience: "15 yrs", modes: "Clinic + Video", tags: ["period", "menstrual", "cycle", "cramps", "pcos", "heavy flow", "irregular"], rating: 4.9 },
  { name: "Dr. Farah Siddiqui", specialty: "Reproductive Endocrinology", city: "Hyderabad", state: "Telangana", hospital: "Hormone & Fertility Institute", experience: "18 yrs", modes: "Clinic + Video", tags: ["pcos", "hormonal", "irregular", "fertility", "cycle"], rating: 4.8 },
  { name: "Dr. Kavya Nair", specialty: "Women's Health & Pain Care", city: "Kochi", state: "Kerala", hospital: "Ayuverse Women's Wellness", experience: "12 yrs", modes: "Clinic + Video", tags: ["cramps", "pelvic pain", "endometriosis", "period pain", "heavy flow"], rating: 4.7 },
  { name: "Dr. Arjun Sen", specialty: "Internal Medicine", city: "Kolkata", state: "West Bengal", hospital: "Eastern Preventive Care", experience: "20 yrs", modes: "Clinic + Video", tags: ["general", "fatigue", "fever", "blood pressure", "medication"], rating: 4.6 },
  { name: "Dr. Meera Subramanian", specialty: "Endocrinology", city: "Chennai", state: "Tamil Nadu", hospital: "Endocrine Care India", experience: "17 yrs", modes: "Clinic + Video", tags: ["thyroid", "diabetes", "blood sugar", "weight", "hormonal"], rating: 4.8 },
  { name: "Dr. Sandeep Kulkarni", specialty: "Psychiatry & Sleep", city: "Pune", state: "Maharashtra", hospital: "MindSleep Clinic", experience: "13 yrs", modes: "Clinic + Video", tags: ["stress", "sleep", "anxiety", "low energy", "mood"], rating: 4.7 },
  { name: "Dr. Nidhi Bansal", specialty: "Nutrition & Lifestyle Medicine", city: "Jaipur", state: "Rajasthan", hospital: "Lifestyle Reset Clinic", experience: "11 yrs", modes: "Video-first", tags: ["nutrition", "overweight", "cholesterol", "triglycerides", "lifestyle"], rating: 4.6 },
  { name: "Dr. Imran Qureshi", specialty: "Pulmonology", city: "Ahmedabad", state: "Gujarat", hospital: "BreathWell Institute", experience: "15 yrs", modes: "Clinic + Video", tags: ["asthma", "breathing", "allergy", "cough", "oxygen"], rating: 4.6 },
  { name: "Dr. Tsering Dolma", specialty: "Family Medicine", city: "Guwahati", state: "Assam", hospital: "North East Family Health", experience: "12 yrs", modes: "Clinic + Video", tags: ["general", "follow-up", "medication", "records", "preventive"], rating: 4.5 },
  { name: "Dr. Priya Raman", specialty: "Adolescent & Women's Health", city: "Coimbatore", state: "Tamil Nadu", hospital: "HerHealth Clinic", experience: "10 yrs", modes: "Clinic + Video", tags: ["menstrual", "cycle", "acne", "pcos", "young women"], rating: 4.7 },
];

const views = [
  ["dashboard", "fa-chart-pie", "Dashboard"],
  ["profile", "fa-id-card", "Profile Recheck"],
  ["checkins", "fa-heart-circle-check", "Check-Ins"],
  ["meds", "fa-pills", "Medication Hub"],
  ["records", "fa-folder-open", "Records Vault"],
  ["women", "fa-venus", "Women's Guardian"],
  ["guardian", "fa-shield-heart", "AI Guardian"],
  ["doctors", "fa-user-doctor", "Find a Doctor"],
  ["timeline", "fa-clock-rotate-left", "Timeline"],
  ["passport", "fa-address-card", "Passport"],
  ["bioage", "fa-dna", "Bio Age Calculator"],
  ["rewards", "fa-fire", "Rewards"],
];

const state = {
  token: localStorage.getItem("naya_token"),
  user: null,
  profile: null,
  data: null,
  view: "dashboard",
  authMode: "login",
  authDraft: { name: "", email: "", password: "" },
  modal: null,
  toast: "",
  busy: "",
  theme: localStorage.getItem("naya_theme") || "dark",
  guardianMessages: [],
  notificationsOpen: false,
  reminderPopups: [],
  bioAge: {
    age: "",
    sleep: 3,
    activity: 3,
    nutrition: 3,
    stress: 3,
  },
};

const api = async (path, options = {}) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || "Something went wrong");
  return body;
};

const uploadApi = async (path, formData) => {
  const headers = {};
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { method: "POST", headers, body: formData });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || "Something went wrong");
  return body;
};

const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "NH";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not set";
const today = () => new Date().toISOString().slice(0, 10);

function brandMarkup() {
  return `
    <div class="brand">
      <img class="brand-logo light-logo" src="/static/assets/ayuverse-logo-light.png" alt="Ayuverse logo">
      <img class="brand-logo dark-logo" src="/static/assets/ayuverse-logo-dark.png" alt="Ayuverse logo">
      <div class="brand-wordmark">Ayu<span>verse</span></div>
    </div>
  `;
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", state.theme === "dark");
}

function formatAiSummary(text = "") {
  const normalized = String(text)
    .replace(/\*\*/g, "")
    .replace(/\r/g, "")
    .replace(/\s+(Key Findings:)/g, "\n$1\n")
    .replace(/\s+(Possible Follow-up Questions for a Clinician:)/g, "\n$1\n")
    .replace(/\s+(Lifestyle\/Care Reminders:)/g, "\n$1\n")
    .replace(/\s+-\s+/g, "\n- ");
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  let html = "";
  let listOpen = false;
  const closeList = () => {
    if (listOpen) {
      html += "</ul>";
      listOpen = false;
    }
  };
  for (const line of lines) {
    if (line.endsWith(":")) {
      closeList();
      html += `<h4>${esc(line.slice(0, -1))}</h4>`;
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        html += "<ul>";
        listOpen = true;
      }
      html += `<li>${esc(line.slice(2))}</li>`;
    } else {
      closeList();
      html += `<p>${esc(line)}</p>`;
    }
  }
  closeList();
  return html || `<p>${esc(text)}</p>`;
}

function notify(message) {
  state.toast = message;
  render();
  setTimeout(() => {
    state.toast = "";
    render();
  }, 2400);
}

applyTheme();

async function boot() {
  if (!state.token) return render();
  try {
    const me = await api("/api/me");
    state.user = me.user;
    state.profile = me.profile;
  } catch {
    localStorage.removeItem("naya_token");
    state.token = null;
    render();
    return;
  }
  try {
    await loadDashboard();
  } catch (error) {
    state.data = emptyDashboard(state.user, state.profile);
    state.guardianMessages = [];
    state.toast = error.message || "Dashboard data could not load yet";
  } finally {
    if (!state.profile?.city) state.modal = "location";
    if (!state.profile?.reviewed_at) state.view = "profile";
    render();
  }
}

async function loadDashboard() {
  state.data = await api("/api/dashboard");
  state.user = state.data.user;
  state.profile = state.data.profile;
  syncReminderPopups();
  try {
    const history = await api("/api/guardian/messages");
    state.guardianMessages = history.messages || [];
  } catch {
    state.guardianMessages = [];
  }
}

function emptyDashboard(user, profile) {
  return {
    user,
    profile,
    profile_ready: !!profile?.reviewed_at,
    summary: {
      wellness: 0,
      streak: 0,
      avg_sleep: 0,
      avg_energy: 0,
      risk_label: "Baseline needed",
      next_action: profile?.reviewed_at ? "Add today's check-in." : "Review your profile to personalize insights.",
    },
    checkins: [],
    medications: [],
    medication_logs: [],
    medication_adherence: { completed: 0, scheduled: 0, percent: 0, pending_today: 0 },
    records: [],
    appointments: [],
    period_logs: [],
    period_days: [],
    womens_guardian: {
      phase: "Baseline needed",
      next_period_estimate: null,
      cycle_length: null,
      summary: "Log your period start and end dates to unlock cycle-aware guidance.",
      medication: [],
      exercise: [],
      doctor: [],
    },
    reminders: [],
  };
}

function reminders() {
  return state.data?.reminders || [];
}

function syncReminderPopups() {
  const seen = JSON.parse(sessionStorage.getItem("ayuverse_seen_reminders") || "[]");
  const seenSet = new Set(seen);
  const fresh = reminders().filter((reminder) => !seenSet.has(reminder.id)).slice(0, 3);
  if (!fresh.length) return;
  state.reminderPopups = fresh;
  sessionStorage.setItem("ayuverse_seen_reminders", JSON.stringify([...new Set([...seen, ...fresh.map((item) => item.id)])].slice(-80)));
}

function notificationDrawer() {
  const items = reminders();
  if (!state.notificationsOpen) return "";
  return `
    <div class="notification-drawer">
      <div class="notification-head">
        <div>
          <h3>Guardian Reminders</h3>
          <p>${items.length ? `${items.length} active reminder${items.length > 1 ? "s" : ""}` : "No active reminders right now."}</p>
        </div>
        <button class="btn icon ghost" data-action="toggle-notifications" title="Close notifications"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="notification-list">
        ${items.length ? items.map(reminderItem).join("") : `<div class="empty">Medication reminders disappear after you mark doses taken. Habit reminders update from your logs.</div>`}
      </div>
    </div>
  `;
}

function reminderPopups() {
  if (!state.reminderPopups.length) return "";
  return `
    <div class="reminder-popups">
      ${state.reminderPopups.map((item) => `
        <div class="reminder-popup ${esc(item.priority || "")}">
          <button class="btn icon ghost" data-dismiss-popup="${esc(item.id)}" title="Dismiss reminder"><i class="fa-solid fa-xmark"></i></button>
          ${reminderItem(item, true)}
        </div>
      `).join("")}
    </div>
  `;
}

function reminderItem(item, compact = false) {
  const isMed = item.type === "medication";
  const icon = isMed ? "fa-pills" : "fa-person-walking";
  return `
    <div class="notification-item ${esc(item.priority || "")} ${compact ? "compact" : ""}">
      <div class="icon-box"><i class="fa-solid ${icon}"></i></div>
      <div class="notification-copy">
        <b>${esc(item.title)}</b>
        <p>${esc(item.body)}</p>
      </div>
      ${isMed ? `<button class="btn primary" data-log-med="${esc(item.medication_id)}"><i class="fa-solid fa-check"></i>${esc(item.action || "Log taken")}</button>` : `<button class="btn ghost" data-view="${item.action?.toLowerCase().includes("check") ? "checkins" : "guardian"}"><i class="fa-solid fa-sparkles"></i>${esc(item.action || "Ask Guardian")}</button>`}
    </div>
  `;
}

function authScreen() {
  const isRegister = state.authMode === "register";
  const draft = state.authDraft || {};
  app.innerHTML = `
    <main class="auth-shell">
      <section class="auth-hero">
        ${brandMarkup()}
        <div class="auth-copy">
          <h1>Your preventive health command center, <strong>rebuilt around you.</strong></h1>
          <p>One calm place to understand your body, prepare for appointments, and turn everyday health signals into clear next steps.</p>
        </div>
        <div class="auth-strip">
          <div class="mini-proof"><i class="fa-solid fa-wand-magic-sparkles"></i><b>AI report clarity</b><p>Lab PDFs become readable summaries.</p></div>
          <div class="mini-proof"><i class="fa-solid fa-pills"></i><b>Medication rhythm</b><p>Mark doses and watch adherence.</p></div>
          <div class="mini-proof"><i class="fa-solid fa-venus"></i><b>Cycle-aware care</b><p>Period logs guide timely support.</p></div>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <h2>${isRegister ? "Create account" : "Welcome back"}</h2>
          <p>${isRegister ? "Start with a blank personal health workspace." : "Sign in to review and continue your health data."}</p>
          <div class="tabs">
            <button class="tab ${!isRegister ? "active" : ""}" data-auth-mode="login">Login</button>
            <button class="tab ${isRegister ? "active" : ""}" data-auth-mode="register">Register</button>
          </div>
          <form id="auth-form" class="form-grid">
            ${isRegister ? `<div class="field full"><label>Full name</label><input name="name" autocomplete="name" value="${esc(draft.name || "")}" required></div>` : ""}
            <div class="field full"><label>Email</label><input name="email" type="email" autocomplete="email" value="${esc(draft.email || "")}" required></div>
            <div class="field full"><label>Password</label><input name="password" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" value="${esc(draft.password || "")}" minlength="6" required></div>
            <div class="field full"><button class="btn primary" type="submit"><i class="fa-solid fa-arrow-right-to-bracket"></i>${isRegister ? "Create secure account" : "Login and recheck"}</button></div>
          </form>
        </div>
      </section>
    </main>
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;
}

function shell() {
  const title = views.find(([id]) => id === state.view)?.[2] || "Dashboard";
  const reminderCount = reminders().length;
  app.innerHTML = `
    <main class="app-shell">
      <aside class="sidebar">
        ${brandMarkup()}
        <nav class="nav">
          ${views.map(([id, icon, label]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}"><i class="fa-solid ${icon}"></i>${label}</button>`).join("")}
          <button class="theme-nav-toggle" data-action="toggle-theme">
            <i class="fa-solid ${state.theme === "dark" ? "fa-sun" : "fa-moon"}"></i>${state.theme === "dark" ? "Light Theme" : "Dark Theme"}
          </button>
        </nav>
        <div class="sidebar-footer">
          <div class="profile-chip">
            <div class="avatar">${esc(initials(state.user?.name))}</div>
            <div class="truncate">
              <b>${esc(state.user?.name)}</b>
              <div class="muted truncate">${esc(state.user?.email)}</div>
            </div>
          </div>
          <button class="btn ghost" data-action="logout"><i class="fa-solid fa-right-from-bracket"></i>Logout</button>
        </div>
      </aside>
      <section class="main">
        <header class="topbar">
          <div>
            <h2>${esc(title)}</h2>
            <p>${state.profile?.reviewed_at ? "Profile reviewed " + fmtDate(state.profile.reviewed_at) : "Please review your profile to personalize the experience."}</p>
          </div>
          <div class="topbar-actions">
            <span class="badge purple"><i class="fa-solid fa-circle"></i> Guardian ready</span>
            <button class="btn ghost notification-button ${reminderCount ? "has-alerts" : ""}" data-action="toggle-notifications">
              <i class="fa-solid fa-bell"></i>Notifications
              ${reminderCount ? `<span>${reminderCount}</span>` : ""}
            </button>
            <button class="btn primary" data-modal="checkin"><i class="fa-solid fa-heart-circle-check"></i>Check-In</button>
          </div>
        </header>
        <div class="content">${viewMarkup()}</div>
      </section>
    </main>
    ${notificationDrawer()}
    ${modalMarkup()}
    ${reminderPopups()}
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;
}

function viewMarkup() {
  const renderers = {
    dashboard: dashboardView,
    profile: profileView,
    checkins: checkinsView,
    meds: medsView,
    records: recordsView,
    women: womenView,
    guardian: guardianView,
    doctors: doctorsView,
    timeline: timelineView,
    passport: passportView,
    bioage: bioAgeView,
    rewards: rewardsView,
  };
  return (renderers[state.view] || dashboardView)();
}

function dashboardView() {
  const d = state.data;
  const s = d.summary;
  const pct = s.wellness || 0;
  return `
    <div class="grid">
      <section class="card hero-card span-8">
        <div>
          <span class="badge ${d.profile_ready ? "" : "warn"}"><i class="fa-solid ${d.profile_ready ? "fa-check" : "fa-triangle-exclamation"}"></i>${d.profile_ready ? "Profile personalized" : "Profile review needed"}</span>
          <h3 style="margin-top:16px;">${esc(s.next_action)} <span>${pct ? pct + "% wellness" : "Start baseline"}</span></h3>
          <p>Your dashboard stays empty until you add your own check-ins, medicines, records, and appointments.</p>
          <div class="actions">
            <button class="btn primary" data-modal="checkin"><i class="fa-solid fa-plus"></i>Add check-in</button>
            <button class="btn ghost" data-view="profile"><i class="fa-solid fa-user-check"></i>Review profile</button>
          </div>
        </div>
        <div class="orb-heart"><i class="fa-solid fa-heart-pulse"></i></div>
      </section>
      ${metricCard("Daily streak", `${s.streak} days`, "fa-fire", "Based on consecutive check-ins", "span-4")}
      <section class="card span-4 metric">
        <div class="ring" style="--pct:${pct}%;"><b>${pct || "--"}%</b></div>
        <div><h3>Wellness Score</h3><p class="muted">Calculated from mood, energy, sleep, activity, and stress.</p></div>
      </section>
      ${metricCard("Average sleep", s.avg_sleep ? `${s.avg_sleep} hrs` : "--", "fa-bed", "Last 30 check-ins", "span-4")}
      ${metricCard("Risk index", s.risk_label, "fa-shield-heart", "Adaptive preventive signal", "span-4")}
      <section class="card span-6">
        <div class="card-title"><h3>Recent Check-Ins</h3><button class="btn ghost" data-view="checkins">View all</button></div>
        ${listOrEmpty(d.checkins.slice(0, 4), (c) => `<div class="list-item"><div class="item-main"><div class="icon-box"><i class="fa-solid fa-heart"></i></div><div><b>${fmtDate(c.created_at)}</b><p class="muted">Mood ${c.mood}/5, energy ${c.energy}/5, sleep ${c.sleep_hours}h</p></div></div><span class="badge">Stress ${c.stress}/5</span></div>`, "No check-ins yet. Add your first baseline.")}
      </section>
      <section class="card span-6">
        <div class="card-title"><h3>Upcoming Care</h3><button class="btn ghost" data-view="doctors">Book</button></div>
        ${listOrEmpty(d.appointments.slice(0, 4), (a) => `<div class="list-item"><div><b>${esc(a.doctor_name)}</b><p class="muted">${esc(a.specialty)} · ${fmtDate(a.appointment_date)} at ${esc(a.slot)}</p></div><span class="badge purple">Booked</span></div>`, "No appointments booked yet.")}
      </section>
    </div>
  `;
}

function metricCard(label, value, icon, note, span = "span-3") {
  return `<section class="card ${span} metric"><div><p class="muted">${label}</p><div class="value">${esc(value)}</div><p class="muted">${note}</p></div><div class="icon-box"><i class="fa-solid ${icon}"></i></div></section>`;
}

function profileView() {
  const p = state.profile || {};
  return `
    <form id="profile-form" class="grid">
      <section class="card span-8">
        <div class="card-title"><div><h3>Health Profile Recheck</h3><p class="muted">Confirm this whenever you return so insights stay grounded in current data.</p></div><button class="btn ghost" type="button" data-modal="location"><i class="fa-solid fa-location-dot"></i>Set Location</button></div>
        <div class="form-grid">
          ${field("Date of birth", "date_of_birth", "date", p.date_of_birth)}
          ${select("Sex", "sex", p.sex, ["", "Female", "Male", "Intersex", "Prefer not to say"])}
          ${select("Blood type", "blood_type", p.blood_type, ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"])}
          ${field("City", "city", "text", p.city)}
          ${field("State", "state", "text", p.state)}
          ${field("Height (cm)", "height_cm", "number", p.height_cm)}
          ${field("Weight (kg)", "weight_kg", "number", p.weight_kg)}
          ${field("Emergency contact", "emergency_contact", "text", p.emergency_contact)}
          ${textarea("Allergies", "allergies", p.allergies)}
          ${textarea("Conditions", "conditions", p.conditions)}
          ${textarea("Health goals", "health_goals", p.health_goals)}
        </div>
        <div class="actions"><button class="btn primary" type="submit"><i class="fa-solid fa-floppy-disk"></i>Save and mark reviewed</button></div>
      </section>
      <aside class="card span-4">
        <h3>Why this matters</h3>
        <p>Returning users can quickly recheck profile details before reviewing scores, medications, records, and care plans.</p>
        <div class="list" style="margin-top:18px;">
          <div class="list-item"><span>Last review</span><b>${fmtDate(p.reviewed_at)}</b></div>
          <div class="list-item"><span>Location</span><b>${esc(p.city || "Not set")}</b></div>
          <div class="list-item"><span>Records</span><b>${state.data.records.length}</b></div>
          <div class="list-item"><span>Active meds</span><b>${state.data.medications.length}</b></div>
        </div>
      </aside>
    </form>
  `;
}

function checkinsView() {
  return `<div class="grid"><section class="card span-12"><div class="card-title"><h3>Daily Check-Ins</h3><button class="btn primary" data-modal="checkin"><i class="fa-solid fa-plus"></i>Add check-in</button></div>${listOrEmpty(state.data.checkins, checkinItem, "No check-ins yet.")}</section></div>`;
}

function checkinItem(c) {
  return `<div class="list-item"><div class="item-main"><div class="icon-box"><i class="fa-solid fa-calendar-day"></i></div><div><b>${fmtDate(c.created_at)}</b><p class="muted">${esc(c.notes || "No notes")}</p></div></div><span class="badge">Mood ${c.mood} · Energy ${c.energy} · Sleep ${c.sleep_hours}h</span></div>`;
}

function medsView() {
  const adherence = state.data.medication_adherence || { completed: 0, scheduled: 0, percent: 0, pending_today: 0 };
  return `
    <div class="grid med-hub-grid">
      <section class="card span-4 adherence-card">
        <div class="adherence-ring" style="--pct:${adherence.percent || 0}%;">
          <b>${adherence.percent || 0}%</b>
        </div>
        <h3>Weekly Adherence</h3>
        <p>You completed ${adherence.completed} of ${adherence.scheduled} scheduled dosages this week.</p>
        <div class="adherence-stats">
          <div><b>${adherence.pending_today}</b><span>Pending today</span></div>
          <div><b>${state.data.medications.length}</b><span>Active meds</span></div>
        </div>
      </section>
      <section class="card span-8 prescription-card">
        <div class="card-title">
          <h3>Active Prescription Schedule</h3>
          <button class="btn primary" data-modal="med"><i class="fa-solid fa-plus"></i>Add Medication</button>
        </div>
        ${listOrEmpty(state.data.medications, medItem, "No medications saved yet. Add one to start tracking daily logs.")}
      </section>
      <section class="card span-12">
        <div class="card-title"><h3>Recent Medication Logs</h3><span class="badge">${(state.data.medication_logs || []).length} this week</span></div>
        ${listOrEmpty(state.data.medication_logs || [], medLogItem, "No medication doses logged this week.")}
      </section>
    </div>
  `;
}

function medItem(m) {
  const taken = !!m.taken_today;
  return `
    <div class="med-row">
      <div class="item-main">
        <div class="med-pill-icon"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
        <div>
          <h4>${esc(m.name)} <span>${esc(m.dosage)}</span></h4>
          <p class="muted">${esc(m.frequency)}${m.time_of_day ? " · " + esc(m.time_of_day) : ""} · ${m.pills_left} pills remaining</p>
        </div>
      </div>
      <div class="med-row-actions">
        <span class="badge ${taken ? "" : "warn"}">${taken ? "Taken" : "Pending"}</span>
        <button class="btn ghost" data-log-med="${m.id}" ${taken ? "disabled" : ""}><i class="fa-solid fa-check"></i>${taken ? "Logged" : "Log Taken"}</button>
        <button class="btn icon danger-soft" data-delete-med="${m.id}" title="Delete medication"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `;
}

function medLogItem(log) {
  return `
    <div class="list-item">
      <div class="item-main">
        <div class="icon-box"><i class="fa-solid fa-check"></i></div>
        <div><b>${esc(log.medication_name || "Medication")}</b><p class="muted">Taken on ${fmtDate(log.log_date)} · logged ${fmtDate(log.created_at)}</p></div>
      </div>
      <span class="badge">Taken</span>
    </div>
  `;
}

function recordsView() {
  return `
    <div class="grid">
      <section class="card span-4">
        <h3>AI Health Report Summary</h3>
        <p style="margin-top:8px;">Upload a health report PDF and Ayuverse will save a Groq-powered summary in your vault.</p>
        <div class="actions">
          <button class="btn primary" data-modal="report"><i class="fa-solid fa-file-arrow-up"></i>Upload PDF</button>
          <button class="btn ghost" data-modal="record"><i class="fa-solid fa-plus"></i>Add note</button>
        </div>
      </section>
      <section class="card span-8">
        <div class="card-title"><h3>Records Vault</h3><span class="badge purple">${state.data.records.length} saved</span></div>
        ${listOrEmpty(state.data.records, recordItem, "No records saved yet.")}
      </section>
    </div>
  `;
}

function recordItem(r) {
  const isAi = r.category === "AI Health Report";
  const body = r.ai_summary || r.note;
  return `
    <div class="list-item ${isAi ? "record-report-item" : ""}">
      <div class="item-main">
        <div class="icon-box"><i class="fa-solid ${isAi ? "fa-wand-magic-sparkles" : "fa-file-medical"}"></i></div>
        <div class="record-content">
          <b>${esc(r.title)}</b>
          <p class="muted">${esc(r.category)} · ${fmtDate(r.created_at)}${r.file_name ? " · " + esc(r.file_name) : ""}</p>
          ${body ? `<div class="${isAi ? "ai-summary" : "record-note"}">${isAi ? formatAiSummary(body) : esc(body)}</div>` : ""}
        </div>
      </div>
    </div>
  `;
}

function womenView() {
  const guardian = state.data.womens_guardian || {};
  return `
    <div class="grid womens-grid">
      <section class="card span-6 cycle-calendar-card">
        <div class="card-title">
          <div>
            <h3>Period Calendar Log</h3>
            <p class="muted">Log start and end dates so Ayuverse can understand your cycle pattern.</p>
          </div>
          <button class="btn primary" data-modal="period"><i class="fa-solid fa-plus"></i>Log Period</button>
        </div>
        ${cycleCalendarMarkup()}
        <div class="period-log-list">
          <h4>Recent Logs</h4>
          ${listOrEmpty(state.data.period_logs || [], periodLogItem, "No period logs yet.")}
        </div>
      </section>
      <section class="card span-6 womens-assistant-card">
        <div class="assistant-orb"><i class="fa-solid fa-shield-heart"></i></div>
        <h3>Women's AI Guardian</h3>
        <p>${esc(guardian.summary || "Add period dates to receive cycle-aware suggestions.")}</p>
        <div class="cycle-stats">
          <div><span>Current phase</span><b>${esc(guardian.phase || "Not enough data")}</b></div>
          <div><span>Cycle length</span><b>${guardian.cycle_length ? `${guardian.cycle_length} days` : "Learning"}</b></div>
          <div><span>Next period</span><b>${guardian.next_period_estimate ? fmtDate(guardian.next_period_estimate) : "Learning"}</b></div>
        </div>
        ${adviceBlock("Medication Support", "fa-capsules", guardian.medication)}
        ${adviceBlock("Exercise Plan", "fa-person-walking", guardian.exercise)}
        ${adviceBlock("Doctor Guidance", "fa-user-doctor", guardian.doctor)}
      </section>
    </div>
  `;
}

function cycleCalendarMarkup() {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const offset = first.getDay();
  const periodSet = new Set(state.data.period_days || []);
  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push(`<div class="cycle-day muted-day"></div>`);
  for (let day = 1; day <= totalDays; day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isPeriod = periodSet.has(iso);
    const isToday = iso === today();
    cells.push(`<div class="cycle-day ${isPeriod ? "period" : ""} ${isToday ? "today" : ""}"><span>${day}</span></div>`);
  }
  return `
    <div class="cycle-month-head">
      <h4>${todayDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h4>
      <div class="calendar-legend"><span><i class="period-dot"></i>Period</span><span><i class="today-dot"></i>Today</span></div>
    </div>
    <div class="cycle-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<b>${d}</b>`).join("")}</div>
    <div class="cycle-calendar">${cells.join("")}</div>
  `;
}

function periodLogItem(log) {
  return `
    <div class="list-item period-log-item">
      <div>
        <b>${fmtDate(log.start_date)}${log.end_date ? " - " + fmtDate(log.end_date) : ""}</b>
        <p class="muted">${esc(log.flow || "Flow not set")}${log.symptoms ? " · " + esc(log.symptoms) : ""}</p>
      </div>
      <button class="btn icon ghost" data-delete-period="${log.id}" title="Delete period log"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;
}

function adviceBlock(title, icon, items = []) {
  return `
    <div class="advice-block">
      <h4><i class="fa-solid ${icon}"></i>${title}</h4>
      <ul>${(items?.length ? items : ["Log more cycle data to personalize this section."]).map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function guardianView() {
  const s = state.data.summary;
  const p = state.profile || {};
  const messages = state.guardianMessages || [];
  const contextCards = [
    { icon: "fa-heart-circle-check", label: "Check-ins", value: state.data.checkins.length },
    { icon: "fa-pills", label: "Active meds", value: state.data.medications.length },
    { icon: "fa-folder-open", label: "Reports", value: state.data.records.length },
    { icon: "fa-bell", label: "Reminders", value: reminders().length },
    { icon: "fa-location-dot", label: "Care city", value: p.city || "Set city" },
  ];
  const quickPrompts = [
    "Based on my recent logs, what should I focus on today?",
    "Suggest safe exercises for my current condition and energy.",
    "I feel my condition is severe. Which doctor should I contact?",
    "Review my medicines and missed logs.",
    "Explain my health report summary in simple words.",
  ];
  const defaultGreeting = `
    <div class="guardian-empty">
      <div class="guardian-orb"><i class="fa-solid fa-sparkles"></i></div>
      <h3>How can I help with your health today?</h3>
      <p>I remember your saved check-ins, medication logs, reports, profile, appointments, and cycle logs inside Ayuverse.</p>
    </div>
  `;
  return `
    <section class="guardian-shell">
      <div class="guardian-hero">
        <div>
          <span class="badge purple"><i class="fa-solid fa-wand-magic-sparkles"></i>AI Guardian with health memory</span>
          <h3>Hello ${esc((state.user?.name || "there").split(" ")[0])}, ask anything about your care.</h3>
          <p>Get clear next steps, exercise guidance, medication reminders, and doctor escalation when symptoms sound serious.</p>
        </div>
        <div class="guardian-pulse">
          <i class="fa-solid fa-shield-heart"></i>
          <span>${esc(s.risk_label)}</span>
        </div>
      </div>
      <div class="guardian-context-row">
        ${contextCards.map((card) => `
          <div class="guardian-context-card">
            <i class="fa-solid ${card.icon}"></i>
            <span>${esc(card.label)}</span>
            <b>${esc(card.value)}</b>
          </div>
        `).join("")}
      </div>
      ${reminders().length ? `
        <div class="guardian-reminder-strip">
          <div class="card-title">
            <div><h3>Active Reminders</h3><p class="muted">Medication nudges clear when doses are logged. Habit nudges refresh from your logs.</p></div>
            <button class="btn ghost" data-action="toggle-notifications"><i class="fa-solid fa-bell"></i>Open all</button>
          </div>
          <div class="guardian-reminder-grid">${reminders().slice(0, 3).map((item) => reminderItem(item, true)).join("")}</div>
        </div>
      ` : ""}
      <div class="guardian-chat-panel">
        <div class="guardian-chat-head">
          <div>
            <h3>Ayuverse Guardian</h3>
            <p>Personalized from your saved data. For emergencies, seek urgent care.</p>
          </div>
          <button class="btn ghost" data-view="doctors"><i class="fa-solid fa-user-doctor"></i>Find Doctor</button>
        </div>
        <div class="guardian-messages">
          ${messages.length ? messages.map(chatBubble).join("") : defaultGreeting}
          ${state.busy === "guardian" ? `<div class="chat-bubble assistant loading"><span></span><span></span><span></span></div>` : ""}
        </div>
        <div class="guardian-prompts">
          ${quickPrompts.map((prompt) => `<button type="button" data-guardian-prompt="${esc(prompt)}">${esc(prompt)}</button>`).join("")}
        </div>
        <form id="guardian-chat-form" class="guardian-composer">
          <input name="message" autocomplete="off" placeholder="Ask about symptoms, exercise, medicines, reports, or which doctor to contact..." ${state.busy === "guardian" ? "disabled" : ""} required>
          <button class="btn primary icon" type="submit" title="Send" ${state.busy === "guardian" ? "disabled" : ""}><i class="fa-solid fa-paper-plane"></i></button>
        </form>
      </div>
    </section>
  `;
}

function chatBubble(message) {
  const role = message.role === "user" ? "user" : "assistant";
  const icon = role === "user" ? initials(state.user?.name) : `<i class="fa-solid fa-shield-heart"></i>`;
  return `
    <div class="chat-row ${role}">
      <div class="chat-avatar">${icon}</div>
      <div class="chat-bubble ${role}">
        ${formatChatText(message.content)}
        <time>${fmtDate(message.created_at)}</time>
      </div>
    </div>
  `;
}

function formatChatText(text = "") {
  const normalized = String(text).replace(/\*\*/g, "").replace(/\r/g, "").replace(/\s+-\s+/g, "\n- ");
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  let html = "";
  let listOpen = false;
  const closeList = () => {
    if (listOpen) {
      html += "</ul>";
      listOpen = false;
    }
  };
  for (const line of lines) {
    if (line.endsWith(":") && line.length < 80) {
      closeList();
      html += `<h4>${esc(line.slice(0, -1))}</h4>`;
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        html += "<ul>";
        listOpen = true;
      }
      html += `<li>${esc(line.slice(2))}</li>`;
    } else {
      closeList();
      html += `<p>${esc(line)}</p>`;
    }
  }
  closeList();
  return html || `<p>${esc(text)}</p>`;
}

function guardianDoctorContext() {
  return rankedDoctors().slice(0, 8).map((doctor) => ({
    name: doctor.name,
    specialty: doctor.specialty,
    city: doctor.city,
    state: doctor.state,
    hospital: doctor.hospital,
    score: doctor.score,
    reasons: doctor.reasons,
    contact: doctorContact(doctor),
  }));
}

async function sendGuardianMessage(message) {
  const trimmed = String(message || "").trim();
  if (!trimmed || state.busy === "guardian") return;
  const optimistic = { role: "user", content: trimmed, created_at: new Date().toISOString() };
  state.guardianMessages = [...(state.guardianMessages || []), optimistic];
  state.busy = "guardian";
  render();
  try {
    const res = await api("/api/guardian/chat", {
      method: "POST",
      body: JSON.stringify({ message: trimmed, doctor_context: guardianDoctorContext() }),
    });
    state.guardianMessages = [...state.guardianMessages.slice(0, -1), ...(res.messages || [])];
  } catch (error) {
    state.guardianMessages = [
      ...state.guardianMessages,
      { role: "assistant", content: `Quick Read:\n- ${error.message}\n\nNext Step:\n- Please try again in a moment.`, created_at: new Date().toISOString() },
    ];
  } finally {
    state.busy = "";
    render();
  }
}

function userNeedSignals() {
  const p = state.profile || {};
  const latest = state.data.checkins?.[0] || {};
  const text = [
    p.conditions, p.allergies, p.health_goals,
    ...(state.data.records || []).map((r) => `${r.title} ${r.category} ${r.note || ""} ${r.ai_summary || ""}`),
    ...(state.data.medications || []).map((m) => `${m.name} ${m.dosage} ${m.frequency}`),
    ...(state.data.period_logs || []).map((log) => `${log.flow || ""} ${log.symptoms || ""} ${log.notes || ""}`),
  ].join(" ").toLowerCase();
  const signals = [];
  const add = (key, label, active) => { if (active) signals.push({ key, label }); };
  add("menstrual", "Cycle or period support", /period|menstrual|cycle|cramp|pcos|heavy flow|irregular|pelvic|endometriosis/.test(text) || (state.data.womens_guardian?.alerts || []).length > 0);
  add("metabolic", "Metabolic or weight risk", /blood sugar|diabetes|overweight|bmi|weight|triglyceride|ldl|cholesterol|lipid/.test(text));
  add("cardiology", "Heart or blood pressure", /blood pressure|hypertension|heart|cardio|cholesterol|ldl/.test(text));
  add("sleep", "Sleep, stress, or mood", Number(latest.stress || 0) >= 4 || Number(latest.sleep_hours || 8) < 6 || /stress|sleep|anxiety|fatigue|low energy|mood/.test(text));
  add("respiratory", "Breathing or allergy", /asthma|breathing|allergy|cough|wheeze/.test(text));
  add("general", "General preventive follow-up", signals.length === 0);
  return signals;
}

function rankedDoctors() {
  const p = state.profile || {};
  const city = (p.city || "").trim().toLowerCase();
  const stateName = (p.state || "").trim().toLowerCase();
  const signals = userNeedSignals();
  const healthText = [
    p.conditions, p.allergies, p.health_goals,
    ...(state.data.records || []).map((r) => `${r.title} ${r.category} ${r.note || ""} ${r.ai_summary || ""}`),
    ...(state.data.medications || []).map((m) => `${m.name} ${m.dosage} ${m.frequency}`),
    ...(state.data.period_logs || []).map((log) => `${log.flow || ""} ${log.symptoms || ""} ${log.notes || ""}`),
  ].join(" ").toLowerCase();
  const signalText = signals.map((s) => s.key).join(" ");
  return doctors.map((doctor) => {
    let score = 52 + Math.round(doctor.rating * 5);
    let locationRank = 0;
    const reasons = [];
    if (city && doctor.city.toLowerCase() === city) {
      locationRank = 3;
      score += 30;
      reasons.push("same city");
    } else if (stateName && doctor.state.toLowerCase() === stateName) {
      locationRank = 2;
      score += 18;
      reasons.push("same state");
    } else if (doctor.modes.toLowerCase().includes("video")) {
      locationRank = 1;
      score += 3;
      reasons.push("video consult");
    }
    for (const tag of doctor.tags) {
      const tagKey = tag.toLowerCase();
      if (healthText.includes(tagKey) || signalText.includes(tagKey) || signals.some((s) => tagKey.includes(s.key) || s.label.toLowerCase().includes(tagKey))) {
        score += 8;
        reasons.push(tag);
      }
    }
    if ((p.sex || "").toLowerCase() === "female" && /gynecology|women|reproductive/i.test(doctor.specialty)) {
      score += 8;
      reasons.push("women's health fit");
    }
    score = Math.min(99, score);
    if (!reasons.length) reasons.push("broad preventive fit");
    return { ...doctor, score, locationRank, reasons: [...new Set(reasons)].slice(0, 4) };
  }).sort((a, b) => (b.locationRank - a.locationRank) || (b.score - a.score));
}

function doctorsView() {
  const p = state.profile || {};
  const ranked = rankedDoctors();
  const top = ranked.slice(0, 3);
  const grouped = ranked.reduce((acc, doc) => {
    (acc[doc.specialty] ||= []).push(doc);
    return acc;
  }, {});
  return `
    <div class="grid">
      <section class="card span-12 doctor-reco-hero">
        <div>
          <span class="badge purple"><i class="fa-solid fa-location-dot"></i>${esc(p.city || "Set your city")}${p.state ? ", " + esc(p.state) : ""}</span>
          <h3>Nearest Doctors First, Then India-Wide Specialists</h3>
          <p>Matches prioritize your city and state before expanding to national specialists based on your profile, records, check-ins, and women's cycle logs.</p>
        </div>
        <button class="btn primary" data-modal="location"><i class="fa-solid fa-location-dot"></i>Update Location</button>
      </section>
      <section class="card span-12">
        <div class="card-title"><h3>Nearest Best Matches</h3><span class="badge">${top.length} ranked</span></div>
        <div class="doctor-grid ranked-doctor-grid">${top.map(doctorCard).join("")}</div>
      </section>
      ${Object.entries(grouped).map(([specialty, docs]) => `
        <section class="card span-12">
          <div class="card-title"><h3>${esc(specialty)}</h3><span class="badge purple">${docs.length} option${docs.length > 1 ? "s" : ""}</span></div>
          <div class="doctor-grid">${docs.map(doctorCard).join("")}</div>
        </section>
      `).join("")}
    </div>
  `;
}

function doctorCard(d) {
  const contact = doctorContact(d);
  return `
    <article class="doctor-card">
      <div class="doctor-card-top">
        <div class="avatar"><i class="fa-solid fa-user-doctor"></i></div>
        <span class="badge">${d.score}% match</span>
      </div>
      <h3>${esc(d.name)}</h3>
      <p class="doctor-specialty">${esc(d.specialty)}</p>
      <div class="doctor-meta">
        <span><i class="fa-solid fa-hospital"></i>${esc(d.hospital)}</span>
        <span><i class="fa-solid fa-location-dot"></i>${esc(d.city)}, ${esc(d.state)}</span>
        <span><i class="fa-solid fa-briefcase-medical"></i>${esc(d.experience)}</span>
        <span><i class="fa-solid fa-video"></i>${esc(d.modes)}</span>
      </div>
      <div class="doctor-contact">
        <span><i class="fa-solid fa-phone"></i><a href="tel:${esc(contact.phoneHref)}">${esc(contact.phone)}</a></span>
        <span><i class="fa-solid fa-envelope"></i><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></span>
        <span><i class="fa-solid fa-map-location-dot"></i>${esc(contact.address)}</span>
      </div>
      <div class="doctor-reasons">${d.reasons.map((r) => `<span>${esc(r)}</span>`).join("")}</div>
      <div class="doctor-actions">
        <a class="btn ghost" href="tel:${esc(contact.phoneHref)}"><i class="fa-solid fa-phone"></i>Call</a>
        <button class="btn primary" data-book="${esc(d.name)}" data-specialty="${esc(d.specialty)}"><i class="fa-solid fa-calendar-check"></i>Book consult</button>
      </div>
    </article>
  `;
}

function doctorContact(d) {
  const seed = [...d.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const phone = `+91 ${70000 + (seed % 20000)} ${10000 + ((seed * 7) % 80000)}`;
  const slug = d.name
    .replace(/^Dr\.\s*/i, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  const citySlug = d.city.toLowerCase().replace(/[^a-z]+/g, "");
  return {
    phone,
    phoneHref: phone.replace(/\s+/g, ""),
    email: `${slug}.${citySlug}@ayuverse.example`,
    address: `${d.hospital}, ${d.city}, ${d.state}`,
  };
}

function timelineView() {
  const items = [
    ...state.data.checkins.map((x) => ({ date: x.created_at, title: "Daily check-in", body: `Mood ${x.mood}/5, energy ${x.energy}/5` })),
    ...state.data.records.map((x) => ({ date: x.created_at, title: x.title, body: x.category })),
    ...state.data.appointments.map((x) => ({ date: x.appointment_date, title: `Appointment with ${x.doctor_name}`, body: `${x.specialty} at ${x.slot}` })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  return `<div class="grid"><section class="card span-12"><h3>Health Timeline</h3><div class="timeline" style="margin-top:18px;">${items.length ? items.map((i) => `<div class="timeline-item"><div class="dot"></div><div class="list-item"><div><b>${esc(i.title)}</b><p class="muted">${fmtDate(i.date)} · ${esc(i.body)}</p></div></div></div>`).join("") : `<div class="empty">No timeline events yet.</div>`}</div></section></div>`;
}

function passportView() {
  const p = state.profile || {};
  return `<div class="grid"><section class="card span-12"><div class="passport"><div class="brand"><img class="brand-logo passport-brand-logo" src="/static/assets/ayuverse-logo-dark.png" alt="Ayuverse logo"><div class="brand-wordmark">Ayu<span>Passport</span></div></div><div class="profile-chip" style="margin-top:24px;"><div class="avatar">${esc(initials(state.user.name))}</div><div><h3>${esc(state.user.name)}</h3><p>${esc(state.user.email)}</p></div></div><div class="passport-grid">${passportField("Blood type", p.blood_type)}${passportField("DOB", p.date_of_birth)}${passportField("Allergies", p.allergies)}${passportField("Conditions", p.conditions)}${passportField("Emergency", p.emergency_contact)}${passportField("Reviewed", fmtDate(p.reviewed_at))}</div></div></section></div>`;
}

function passportField(label, value) {
  return `<div><p style="opacity:.62;">${esc(label)}</p><b>${esc(value || "Not set")}</b></div>`;
}

function chronologicalAge() {
  const dob = state.profile?.date_of_birth;
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday = now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age > 0 && age < 120 ? age : null;
}

function bioAgeScore() {
  const baseAge = Number(state.bioAge.age) || chronologicalAge() || 30;
  const factors = {
    sleep: Number(state.bioAge.sleep),
    activity: Number(state.bioAge.activity),
    nutrition: Number(state.bioAge.nutrition),
    stress: Number(state.bioAge.stress),
  };
  const adjustments = {
    sleep: (3 - factors.sleep) * 1.8,
    activity: (3 - factors.activity) * 2.1,
    nutrition: (3 - factors.nutrition) * 1.7,
    stress: (factors.stress - 3) * 2.0,
  };
  const totalAdjustment = Object.values(adjustments).reduce((sum, value) => sum + value, 0);
  const biologicalAge = Math.max(12, Math.round((baseAge + totalAdjustment) * 10) / 10);
  const lifestyleScore = Math.round(Math.max(0, Math.min(100, 100 - ((biologicalAge - baseAge + 8) / 16) * 100)));
  const gap = Math.round((biologicalAge - baseAge) * 10) / 10;
  return { baseAge, factors, biologicalAge, lifestyleScore, gap };
}

function bioAgeAdvice(result) {
  const advice = [];
  if (result.factors.sleep <= 2) advice.push("Improve sleep consistency with a fixed bedtime, dim lights, and a wind-down routine.");
  if (result.factors.activity <= 2) advice.push("Add 20-30 minutes of walking or light strength work on most days.");
  if (result.factors.nutrition <= 2) advice.push("Prioritize protein, vegetables, fiber, hydration, and fewer ultra-processed foods.");
  if (result.factors.stress >= 4) advice.push("Use breathing, meditation, journaling, or gentle yoga to lower daily stress load.");
  if (!advice.length) advice.push("Your lifestyle inputs look strong. Keep logging check-ins to watch how the trend changes.");
  return advice;
}

function bioAgeSlider(key, label, low, high) {
  const value = Number(state.bioAge[key]);
  return `
    <div class="bio-slider">
      <div class="range-row">
        <div>
          <label>${esc(label)}</label>
          <p class="muted">${esc(low)} to ${esc(high)}</p>
        </div>
        <div class="range-value">${value}/5</div>
      </div>
      <input name="${esc(key)}" type="range" min="1" max="5" value="${value}" data-bio-age-input="${esc(key)}">
    </div>
  `;
}

function bioAgeView() {
  const result = bioAgeScore();
  const gapText = result.gap === 0 ? "same as" : result.gap > 0 ? `${result.gap} years older than` : `${Math.abs(result.gap)} years younger than`;
  const status = result.gap <= -2 ? "Strong lifestyle signal" : result.gap <= 2 ? "Balanced lifestyle signal" : "Improvement opportunity";
  return `
    <div class="grid bio-age-grid">
      <section class="card span-7 bio-age-panel">
        <span class="badge purple"><i class="fa-solid fa-dna"></i>Lifestyle-based estimate</span>
        <h3>Biological Health Age Calculator</h3>
        <p>This calculator estimates how lifestyle factors may influence your health age. It is educational, not a diagnostic test.</p>
        <div class="form-grid bio-age-form">
          ${field("Chronological age", "age", "number", state.bioAge.age || chronologicalAge() || "")}
          ${bioAgeSlider("sleep", "Sleep quality", "Poor", "Excellent")}
          ${bioAgeSlider("activity", "Physical activity", "Inactive", "Very active")}
          ${bioAgeSlider("nutrition", "Nutrition habits", "Poor", "Very healthy")}
          ${bioAgeSlider("stress", "Stress levels", "Low", "Very high")}
        </div>
      </section>
      <section class="card span-5 bio-result-card">
        <div class="bio-age-ring" style="--pct:${result.lifestyleScore}%;"><b>${result.biologicalAge}</b><span>years</span></div>
        <h3>${status}</h3>
        <p>Your estimated biological health age is ${gapText} your chronological age of ${result.baseAge}.</p>
        <div class="bio-mini-stats">
          <div><span>Chronological</span><b>${result.baseAge}</b></div>
          <div><span>Biological</span><b>${result.biologicalAge}</b></div>
          <div><span>Lifestyle score</span><b>${result.lifestyleScore}%</b></div>
        </div>
      </section>
      <section class="card span-12">
        <div class="card-title"><h3>Personalized Focus Areas</h3><span class="badge">Updates instantly</span></div>
        <div class="bio-advice-grid">
          ${bioAgeAdvice(result).map((item) => `<div class="advice-block"><h4><i class="fa-solid fa-seedling"></i>Next step</h4><p>${esc(item)}</p></div>`).join("")}
        </div>
      </section>
    </div>
  `;
}

function rewardsView() {
  const count = state.data.checkins.length;
  const cells = Array.from({ length: 80 }, (_, i) => i < count ? `l${Math.min(3, (i % 3) + 1)}` : "");
  return `<div class="grid"><section class="card span-12"><h3>Consistency Heatmap</h3><p style="margin:8px 0 18px;">Every saved check-in fills one square.</p><div class="heatmap">${cells.map((c) => `<div class="heat ${c}"></div>`).join("")}</div></section>${metricCard("Check-ins logged", count, "fa-clipboard-check", "Keep building your own baseline.", "span-4")}${metricCard("Active meds", state.data.medications.length, "fa-pills", "Medication schedule entries.", "span-4")}${metricCard("Records stored", state.data.records.length, "fa-folder-open", "Vault metadata saved.", "span-4")}</div>`;
}

function listOrEmpty(items, renderer, emptyText) {
  return items?.length ? `<div class="list">${items.map(renderer).join("")}</div>` : `<div class="empty">${emptyText}</div>`;
}

function field(label, name, type = "text", value = "") {
  return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${esc(value || "")}"></div>`;
}

function textarea(label, name, value = "") {
  return `<div class="field full"><label>${label}</label><textarea name="${name}">${esc(value || "")}</textarea></div>`;
}

function select(label, name, value, options) {
  return `<div class="field"><label>${label}</label><select name="${name}">${options.map((o) => `<option value="${esc(o)}" ${o === value ? "selected" : ""}>${esc(o || "Select")}</option>`).join("")}</select></div>`;
}

function modalMarkup() {
  if (!state.modal) return "";
  const close = `<button class="btn icon ghost" data-close-modal><i class="fa-solid fa-xmark"></i></button>`;
  const forms = {
    checkin: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>10-Second Check-In</h3>${close}</div><form id="checkin-form" class="modal-body form-grid">
      <div class="field full"><label>Mood</label>${scoreButtons("mood", ["Terrible", "Bad", "Neutral", "Good", "Great"], 4)}</div>
      <div class="field full"><label>Energy</label>${scoreButtons("energy", ["Empty", "Low", "Balanced", "High", "Peak"], 3)}</div>
      ${field("Sleep hours", "sleep_hours", "number", 7)}
      ${field("Active minutes", "active_minutes", "number", 30)}
      <div class="field"><label>Stress</label><select name="stress"><option value="1">1 Calm</option><option value="2">2 Light</option><option value="3" selected>3 Moderate</option><option value="4">4 High</option><option value="5">5 Intense</option></select></div>
      ${textarea("Notes", "notes")}
      <div class="field full"><button class="btn primary" type="submit">Save check-in</button></div>
    </form></div></div>`,
    med: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Add Medication</h3>${close}</div><form id="med-form" class="modal-body form-grid">
      ${field("Medication name", "name")}
      ${field("Dosage", "dosage")}
      ${select("Frequency", "frequency", "Daily", ["Daily", "Twice daily", "Weekly", "As needed"])}
      ${field("Time of day", "time_of_day", "time")}
      ${field("Pills left", "pills_left", "number", 0)}
      <div class="field full"><button class="btn primary" type="submit">Save medication</button></div>
    </form></div></div>`,
    location: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Set Your City</h3>${close}</div><form id="location-form" class="modal-body form-grid">
      <div class="field full"><p class="muted">Ayuverse uses your city to prioritize nearby doctors, then expands to strong India-wide matches when your health signals need a specialist.</p></div>
      ${field("City", "city", "text", state.profile?.city || "")}
      ${field("State", "state", "text", state.profile?.state || "")}
      <div class="field full"><button class="btn primary" type="submit"><i class="fa-solid fa-location-dot"></i>Save location</button></div>
    </form></div></div>`,
    record: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Add Record Note</h3>${close}</div><form id="record-form" class="modal-body form-grid">
      ${field("Title", "title")}
      ${select("Category", "category", "Lab", ["Lab", "Prescription", "Imaging", "Visit note", "Insurance", "Other"])}
      ${textarea("Note", "note")}
      <div class="field full"><button class="btn primary" type="submit">Save record</button></div>
    </form></div></div>`,
    report: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Upload Health Report PDF</h3>${close}</div><form id="report-form" class="modal-body form-grid">
      ${field("Report title", "title", "text", "Health report")}
      <div class="field full"><label>PDF report</label><input name="file" type="file" accept="application/pdf,.pdf" required></div>
      <div class="field full"><p class="muted">The PDF is sent to the backend, summarized with Groq, and saved as a vault record. The app stores the summary, not the original PDF file.</p></div>
      <div class="field full"><button class="btn primary" type="submit"><i class="fa-solid fa-wand-magic-sparkles"></i>${state.busy === "report" ? "Summarizing..." : "Generate AI summary"}</button></div>
    </form></div></div>`,
    period: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Log Period Dates</h3>${close}</div><form id="period-form" class="modal-body form-grid">
      ${field("Start date", "start_date", "date", today())}
      ${field("End date", "end_date", "date", today())}
      ${select("Flow", "flow", "Medium", ["Light", "Medium", "Heavy", "Spotting"])}
      ${field("Symptoms", "symptoms", "text", "")}
      ${textarea("Notes", "notes")}
      <div class="field full"><button class="btn primary" type="submit"><i class="fa-solid fa-calendar-check"></i>Save cycle log</button></div>
    </form></div></div>`,
    booking: `<div class="modal"><div class="modal-box"><div class="modal-head"><h3>Book Consult</h3>${close}</div><form id="booking-form" class="modal-body form-grid">
      ${field("Doctor", "doctor_name", "text", state.booking?.doctor_name)}
      ${field("Specialty", "specialty", "text", state.booking?.specialty)}
      ${field("Date", "appointment_date", "date", today())}
      ${select("Slot", "slot", "10:30 AM", ["09:00 AM", "10:30 AM", "02:00 PM", "05:30 PM"])}
      ${textarea("Reason", "reason")}
      <div class="field full"><button class="btn primary" type="submit">Confirm appointment</button></div>
    </form></div></div>`,
  };
  return forms[state.modal] || "";
}

function scoreButtons(name, labels, active) {
  return `<div class="segmented">${labels.map((label, i) => `<button type="button" class="${i + 1 === active ? "active" : ""}" data-score="${name}" data-value="${i + 1}"><i class="fa-solid fa-circle"></i><span>${esc(label)}</span></button>`).join("")}</div><input type="hidden" name="${name}" value="${active}">`;
}

function render() {
  if (!state.token) authScreen();
  else if (!state.user || !state.data) loadingScreen();
  else shell();
}

function loadingScreen() {
  app.innerHTML = `
    <main class="auth-shell">
      <section class="auth-hero">
        ${brandMarkup()}
        <div class="auth-copy">
          <h1>Opening your <strong>Ayuverse</strong> workspace.</h1>
          <p>Loading your private dashboard, reminders, reports, and Guardian memory.</p>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <h2>Signing you in</h2>
          <p>Please wait a moment while your health workspace loads.</p>
        </div>
      </section>
    </main>
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
  `;
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.authMode) {
    state.authMode = target.dataset.authMode;
    render();
  }
  if (target.dataset.view) {
    state.view = target.dataset.view;
    state.notificationsOpen = false;
    render();
  }
  if (target.dataset.action === "logout") {
    localStorage.removeItem("naya_token");
    Object.assign(state, { token: null, user: null, profile: null, data: null, guardianMessages: [], view: "dashboard" });
    render();
  }
  if (target.dataset.action === "toggle-theme") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("naya_theme", state.theme);
    applyTheme();
    render();
  }
  if (target.dataset.action === "toggle-notifications") {
    state.notificationsOpen = !state.notificationsOpen;
    render();
  }
  if (target.dataset.dismissPopup) {
    state.reminderPopups = state.reminderPopups.filter((item) => item.id !== target.dataset.dismissPopup);
    render();
  }
  if (target.dataset.modal) {
    state.modal = target.dataset.modal;
    render();
  }
  if (target.dataset.closeModal !== undefined) {
    state.modal = null;
    render();
  }
  if (target.dataset.score) {
    const wrap = target.closest(".field");
    wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    target.classList.add("active");
    wrap.querySelector(`input[name="${target.dataset.score}"]`).value = target.dataset.value;
  }
  if (target.dataset.deleteMed) {
    await api(`/api/medications/${target.dataset.deleteMed}`, { method: "DELETE" });
    await loadDashboard();
    notify("Medication removed");
  }
  if (target.dataset.logMed) {
    target.disabled = true;
    await api(`/api/medications/${target.dataset.logMed}/logs`, { method: "POST" });
    await loadDashboard();
    state.reminderPopups = state.reminderPopups.filter((item) => item.medication_id !== Number(target.dataset.logMed));
    notify("Medication logged as taken");
  }
  if (target.dataset.deletePeriod) {
    await api(`/api/womens/period-logs/${target.dataset.deletePeriod}`, { method: "DELETE" });
    await loadDashboard();
    notify("Period log removed");
  }
  if (target.dataset.book) {
    state.booking = { doctor_name: target.dataset.book, specialty: target.dataset.specialty };
    state.modal = "booking";
    render();
  }
  if (target.dataset.guardianPrompt) {
    await sendGuardianMessage(target.dataset.guardianPrompt);
  }
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (!input.closest || !input.name) return;
  if (input.closest("#auth-form")) {
    state.authDraft[input.name] = input.value;
    return;
  }
  if (input.dataset.bioAgeInput !== undefined || input.closest(".bio-age-form")) {
    state.bioAge[input.name] = input.value;
    render();
  }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if (form.id === "auth-form") {
    state.authDraft = {
      ...state.authDraft,
      name: data.name || state.authDraft.name || "",
      email: data.email || "",
      password: data.password || "",
    };
  }
  try {
    if (form.id === "auth-form") {
      const path = state.authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const res = await api(path, { method: "POST", body: JSON.stringify(data) });
      state.token = res.token;
      localStorage.setItem("naya_token", state.token);
      state.authDraft = { name: "", email: "", password: "" };
      await boot();
      if (!state.token) throw new Error("Session could not be opened. Please try again.");
      notify(state.authMode === "register" ? "Account created" : "Logged in");
      return;
    }
    if (form.id === "profile-form") {
      ["height_cm", "weight_kg"].forEach((k) => data[k] = data[k] ? Number(data[k]) : null);
      const res = await api("/api/me/profile", { method: "PUT", body: JSON.stringify(data) });
      state.profile = res.profile;
      await loadDashboard();
      state.view = "dashboard";
      notify("Profile reviewed");
    }
    if (form.id === "location-form") {
      const res = await api("/api/me/profile", { method: "PUT", body: JSON.stringify(data) });
      state.profile = res.profile;
      state.modal = null;
      await loadDashboard();
      notify("Location saved");
    }
    if (form.id === "checkin-form") {
      ["mood", "energy", "active_minutes", "stress"].forEach((k) => data[k] = Number(data[k]));
      data.sleep_hours = Number(data.sleep_hours);
      await api("/api/checkins", { method: "POST", body: JSON.stringify(data) });
      state.modal = null;
      await loadDashboard();
      notify("Check-in saved");
    }
    if (form.id === "med-form") {
      data.pills_left = Number(data.pills_left || 0);
      await api("/api/medications", { method: "POST", body: JSON.stringify(data) });
      state.modal = null;
      await loadDashboard();
      notify("Medication saved");
    }
    if (form.id === "record-form") {
      await api("/api/records", { method: "POST", body: JSON.stringify(data) });
      state.modal = null;
      await loadDashboard();
      notify("Record saved");
    }
    if (form.id === "report-form") {
      const uploadData = new FormData(form);
      state.busy = "report";
      render();
      await uploadApi("/api/records/report-pdf", uploadData);
      state.busy = "";
      state.modal = null;
      await loadDashboard();
      state.view = "records";
      notify("AI report summary saved");
    }
    if (form.id === "period-form") {
      await api("/api/womens/period-logs", { method: "POST", body: JSON.stringify(data) });
      state.modal = null;
      await loadDashboard();
      state.view = "women";
      notify("Period log saved");
    }
    if (form.id === "booking-form") {
      await api("/api/appointments", { method: "POST", body: JSON.stringify(data) });
      state.modal = null;
      await loadDashboard();
      notify("Appointment booked");
    }
    if (form.id === "guardian-chat-form") {
      form.reset();
      await sendGuardianMessage(data.message);
    }
  } catch (error) {
    state.busy = "";
    notify(error.message);
  }
});

boot();
