// ── UI.JS — Navigation, Clock, Onboarding ──

let sidebarOpen = true;
let isMobile = window.innerWidth <= 768;

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  const ni = document.querySelector(`[data-page="${name}"]`);
  if (ni) ni.classList.add('active');
  const titles = {
    dashboard: 'Dashboard', tracker: 'Daily Tracker', nutrition: 'Nutrition',
    gym: 'Gym & Physical', hacking: 'Hacking Progress', reading: 'Reading',
    mind: 'Mind & IQ', money: 'Money', ai: 'AI Session', stats: 'Stats', settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[name] || name;
  if (isMobile) closeSidebar();
  if (name === 'stats') setTimeout(renderCharts, 100);
  if (name === 'ai') loadSessionCalendar();
  if (name === 'dashboard') refreshDashboard();
  if (name === 'stats') refreshStats();
  if (name === 'gym') renderGymSimple();
  if (name === 'mind') renderMindPage();
  localStorage.setItem('gu_last_page', name);
}

function toggleSidebar() {
  if (isMobile) {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('open');
  } else {
    const sb = document.getElementById('sidebar');
    const mc = document.querySelector('.main-content');
    sidebarOpen = !sidebarOpen;
    sb.classList.toggle('collapsed', !sidebarOpen);
    mc.classList.toggle('expanded', !sidebarOpen);
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

function showTab(group, name) {
  document.querySelectorAll(`#page-${group} .tab-content`).forEach(tc => tc.classList.remove('active'));
  document.querySelectorAll(`#page-${group} .tab-btn`).forEach(tb => tb.classList.remove('active'));
  const tc = document.getElementById(`${group}-${name}`);
  if (tc) tc.classList.add('active');
  const clickedBtn = event.target;
  if (clickedBtn) clickedBtn.classList.add('active');
}

// ── CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('liveClock').textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  document.getElementById('liveDate').textContent = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// ── GREETING & QUOTE ──
function setGreeting() {
  const h = new Date().getHours();
  const profile = getProfile();
  let g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('greeting');
  if (el) el.textContent = `${g}, ${profile.name} 👋`;
}

function setDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  const q = QUOTES[day % QUOTES.length];
  const el = document.getElementById('quoteCard');
  if (el) el.textContent = `"${q}"`;
}

// ── ONBOARDING ──
function checkOnboarding() {
  const profile = getProfile();
  if (!profile.name || profile.name === 'User') {
    document.getElementById('onboardingModal').style.display = 'flex';
  } else {
    initApp();
  }
}

function obNext(step) {
  if (step === 2) {
    document.getElementById('ob1').style.display = 'none';
    document.getElementById('ob2').style.display = 'block';
    setTimeout(() => document.getElementById('obName').focus(), 100);
  } else if (step === 3) {
    const name = document.getElementById('obName').value.trim();
    if (!name) { document.getElementById('obName').style.borderColor = 'var(--red)'; return; }
    document.getElementById('ob2').style.display = 'none';
    document.getElementById('ob3').style.display = 'block';
    setTimeout(() => document.getElementById('obWeight').focus(), 100);
  } else if (step === 4) {
    const w = parseInt(document.getElementById('obWeight').value);
    if (!w || w < 30 || w > 200) { document.getElementById('obWeight').style.borderColor = 'var(--red)'; return; }
    document.getElementById('ob3').style.display = 'none';
    document.getElementById('ob4').style.display = 'block';
  }
}

function obFinish() {
  const name = document.getElementById('obName').value.trim() || 'User';
  const weight = parseInt(document.getElementById('obWeight').value) || 50;
  const apiKey = document.getElementById('obApiKey').value.trim();
  const profile = getProfile();
  profile.name = name;
  profile.weight = weight;
  profile.startDate = todayKey();
  save('profile', profile);
  if (apiKey) save('groq_key', apiKey);
  document.getElementById('onboardingModal').style.display = 'none';
  initApp();
}

// ── DASHBOARD REFRESH ──
function refreshDashboard() {
  const profile = getProfile();
  setGreeting();
  setDailyQuote();

  // Streak
  const streak = getStreak();
  const dayNum = getDayNumber();
  const streakEl = document.getElementById('dash-streak');
  if (streakEl) streakEl.textContent = streak;
  const userStreakEl = document.getElementById('userStreak');
  if (userStreakEl) userStreakEl.textContent = `🔥 Day ${dayNum}`;
  const userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = profile.name;
  const avatarEl = document.getElementById('userAvatar');
  if (avatarEl) avatarEl.textContent = profile.name.charAt(0).toUpperCase();

  // Load today's nutrition
  const nut = loadToday('nutrition', {});
  const waterEl = document.getElementById('dash-water');
  if (waterEl) waterEl.textContent = (nut.water || 0).toFixed(1);
  const calEl = document.getElementById('dash-cal');
  if (calEl) calEl.textContent = nut.cal || 0;

  const trackerEl = document.getElementById('dash-steps');
  const habits = loadToday('habits', {});
  const stepsVal = loadToday('habits_sliders', {});
  if (trackerEl) trackerEl.textContent = (stepsVal.steps_count || 0).toLocaleString();
  const sleepEl = document.getElementById('dash-sleep');
  if (sleepEl) sleepEl.textContent = (stepsVal.sleep_hours || 0).toFixed(1);

  // Completion ring
  const allHabits = HABITS.flatMap(s => s.items);
  const total = allHabits.length;
  const done = allHabits.filter(h => habits[h.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  drawRing(pct);

  const ringPctEl = document.getElementById('ringPct');
  if (ringPctEl) ringPctEl.textContent = pct + '%';

  // Phase progress
  updatePhaseProgress();
}

function drawRing(pct) {
  const canvas = document.getElementById('completionRing');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 65, lw = 12;
  ctx.clearRect(0, 0, 160, 160);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#1e1e1e';
  ctx.lineWidth = lw;
  ctx.stroke();
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * pct / 100));
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function updatePhaseProgress() {
  const hackData = load('hacking_checks', {});
  const totalHack = HACK_CHECKLISTS.flatMap(s => s.items).length;
  const doneHack = Object.values(hackData).filter(Boolean).length;
  setPhaseBar('ph-hack', doneHack, totalHack);

  const bookData = load('books', {});
  const doneBooks = BOOKS.filter(b => bookData[b.id]?.status === 'Completed').length;
  setPhaseBar('ph-read', doneBooks, BOOKS.length);

  const gymData = load('gym_checks', {});
  const totalGym = CALISTHENICS_LEVELS.flatMap(l => l.items).length;
  const doneGym = Object.values(gymData).filter(Boolean).length;
  setPhaseBar('ph-gym', doneGym, totalGym);

  const moneyData = load('money_checks', {});
  const totalMoney = MONEY_CHECKLISTS.flatMap(s => s.items).length;
  const doneMoney = Object.values(moneyData).filter(Boolean).length;
  setPhaseBar('ph-money', doneMoney, totalMoney);

  const mindData = load('mind_checks', {});
  const totalMind = MENTAL_MODELS.length + COMMUNICATION_CURRICULUM.flatMap(s => s.items).length;
  const doneMind = Object.values(mindData).filter(Boolean).length;
  setPhaseBar('ph-mind', doneMind, totalMind);
}

function setPhaseBar(id, done, total) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const bar = document.getElementById(id);
  if (bar) bar.style.width = pct + '%';
  const pctEl = document.getElementById(id + '-pct');
  if (pctEl) pctEl.textContent = pct + '%';
}

// ── SETTINGS LOAD/SAVE ──
function loadSettingsPage() {
  const p = getProfile();
  const fields = ['name','age','height','weight','cal','prot','water','sleep','steps'];
  const keys = ['name','age','height','weight','calTarget','protTarget','waterTarget','sleepTarget','stepsTarget'];
  fields.forEach((f, i) => {
    const el = document.getElementById('set-' + f);
    if (el) el.value = p[keys[i]] || '';
  });
}

function saveSettings() {
  const p = getProfile();
  p.name = document.getElementById('set-name').value || p.name;
  p.age = parseInt(document.getElementById('set-age').value) || p.age;
  p.height = document.getElementById('set-height').value || p.height;
  p.weight = parseFloat(document.getElementById('set-weight').value) || p.weight;
  p.calTarget = parseInt(document.getElementById('set-cal').value) || 2500;
  p.protTarget = parseInt(document.getElementById('set-prot').value) || 275;
  p.waterTarget = parseFloat(document.getElementById('set-water').value) || 4.5;
  p.sleepTarget = parseFloat(document.getElementById('set-sleep').value) || 8.5;
  p.stepsTarget = parseInt(document.getElementById('set-steps').value) || 10000;
  save('profile', p);
  refreshDashboard();
  alert('Settings saved! ✅');
}

function exportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('gu_')) data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'glowup_data_' + todayKey() + '.json';
  a.click();
}

function importData() { document.getElementById('importFile').click(); }

function doImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
      alert('Data imported successfully! Refreshing...');
      location.reload();
    } catch(err) { alert('Invalid file format.'); }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (confirm('Are you sure? This will delete ALL your data permanently.')) {
    if (confirm('Last chance. Really delete everything?')) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('gu_')) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
      location.reload();
    }
  }
}

window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 768;
});
