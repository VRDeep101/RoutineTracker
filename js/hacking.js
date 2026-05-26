// ── READING.JS ──

function renderBooks() {
  const container = document.getElementById('bookCards');
  if (!container) return;
  const bookData = load('books', {});
  let totalPages = 0, completed = 0;
  BOOKS.forEach(b => {
    const bd = bookData[b.id] || {};
    totalPages += bd.pagesRead || 0;
    if (bd.status === 'Completed') completed++;
  });
  const compEl = document.getElementById('booksComplete');
  if (compEl) compEl.textContent = completed;
  const pagesEl = document.getElementById('totalPages');
  if (pagesEl) pagesEl.textContent = totalPages;

  container.innerHTML = BOOKS.map(b => {
    const bd = bookData[b.id] || { status: 'Not Started', pagesRead: 0, rating: 0, notes: '' };
    const pct = Math.min(Math.round((bd.pagesRead / b.pages) * 100), 100);
    return `
    <div class="book-card">
      <div class="book-card-header">
        <div class="book-num-badge">${b.num}</div>
        <div class="book-meta">
          <div class="book-title-text">${b.title}</div>
          <div class="book-author">${b.author}</div>
          <div class="book-why">Why: ${b.why}</div>
        </div>
      </div>
      <div class="book-controls">
        <select class="book-status" onchange="saveBookField('${b.id}','status',this.value)">
          ${['Not Started','Reading','Completed'].map(s => `<option ${bd.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
        <div class="book-pages-display">
          <input type="number" min="0" max="${b.pages}" value="${bd.pagesRead||0}" placeholder="0"
            style="width:60px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 6px;border-radius:6px;font-size:13px;text-align:center;"
            oninput="saveBookField('${b.id}','pagesRead',parseInt(this.value)||0)"> / ${b.pages} pages
        </div>
        <div class="stars">${[1,2,3,4,5].map(s => `<span class="star ${(bd.rating||0)>=s?'lit':''}" onclick="rateBook('${b.id}',${s})">★</span>`).join('')}</div>
      </div>
      <div class="book-progress-bar"><div class="book-progress-fill" style="width:${pct}%"></div></div>
      <textarea class="book-notes" placeholder="Key lessons from this book..." onchange="saveBookField('${b.id}','notes',this.value)">${bd.notes||''}</textarea>
    </div>`;
  }).join('');
}

function saveBookField(id, field, val) {
  const bookData = load('books', {});
  if (!bookData[id]) bookData[id] = {};
  bookData[id][field] = val;
  save('books', bookData);
  if (field === 'pagesRead' || field === 'status') renderBooks();
}

function rateBook(id, rating) {
  saveBookField(id, 'rating', rating);
  renderBooks();
}

function quickAddPages(n) {
  if (!n || n <= 0) return;
  const bookData = load('books', {});
  const reading = BOOKS.find(b => (bookData[b.id]?.status || 'Not Started') === 'Reading');
  const target = reading || BOOKS[0];
  if (!bookData[target.id]) bookData[target.id] = { status: 'Reading', pagesRead: 0, rating: 0, notes: '' };
  bookData[target.id].pagesRead = Math.min((bookData[target.id].pagesRead || 0) + n, target.pages);
  if (bookData[target.id].pagesRead >= target.pages) bookData[target.id].status = 'Completed';
  save('books', bookData);
  renderBooks();
  const customEl = document.getElementById('customPages');
  if (customEl) customEl.value = '';
}


// ── MIND.JS ──

function renderChess() {
  const container = document.getElementById('mind-chess');
  if (!container) return;
  const chessData = load('chess', { elo: 400, games: 0 });
  container.innerHTML = `
    <div class="card">
      <div class="card-title">ELO Rating</div>
      <div class="chess-elo">
        <input type="number" class="elo-input" id="eloInput" value="${chessData.elo || 400}" oninput="saveChess()">
        <div>
          <div style="font-size:13px;color:var(--text2)">Target: 1000+ (Phase 1)</div>
          <div style="font-size:13px;color:var(--text2);margin-top:4px">Games played: 
            <input type="number" style="width:60px;background:var(--surface);border:1px solid var(--border);color:var(--green);padding:4px;border-radius:6px;font-size:14px;text-align:center;"
              value="${chessData.games||0}" oninput="saveChess()"> total
          </div>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-top:8px;">chess.com · lichess.org — Play 1 game daily</div>
    </div>
    <div class="card">
      <div class="card-title">Chess Curriculum</div>
      <div class="checklist-section" style="padding:0;background:none;border:none;">
        ${['Create chess.com account','Learn all piece movements and special moves','King\'s pawn opening memorized','Sicilian defense basics learned','Scholar\'s mate recognized and defended','Back rank checkmate pattern','Smothered mate pattern','5 openings memorized (3 white, 2 black)','Endgame: K+Q vs K mastered','Tactical patterns: pins, forks, skewers','Puzzle Rush — 5 mins daily','ELO 800+ achieved','ELO 1000+ achieved'].map((item, i) => {
          const data = load('chess_checks', {});
          return `<div class="checklist-item">
            <input type="checkbox" class="cl-cb" id="ch-${i}" ${data['ch'+i]?'checked':''} onchange="saveCheck('chess_checks','ch${i}',this.checked)">
            <label class="cl-label ${data['ch'+i]?'done':''}" for="ch-${i}">${item}</label>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function saveChess() {
  const elo = parseInt(document.getElementById('eloInput')?.value) || 400;
  save('chess', { elo, games: 0 });
}

function renderMentalModels() {
  const container = document.getElementById('mind-models');
  if (!container) return;
  const data = load('mind_checks', {});
  container.innerHTML = `
    <div style="color:var(--text2);font-size:13px;margin-bottom:1rem;">Learn 1 mental model per week. Apply it in real life. Write your own example.</div>
    ${MENTAL_MODELS.map((m, i) => `
    <div class="card" style="margin-bottom:10px;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <input type="checkbox" class="cl-cb" style="margin-top:3px;" id="mm-${i}" ${data['mm'+i]?'checked':''}
          onchange="saveCheck('mind_checks','mm${i}',this.checked)">
        <div style="flex:1;">
          <div style="font-size:14px;font-weight:600;color:${data['mm'+i]?'var(--green)':'var(--text)'};">${m.title}</div>
          <div style="font-size:13px;color:var(--text2);margin-top:4px;line-height:1.5;">${m.desc}</div>
          <textarea placeholder="Your real-life example of this model..."
            style="width:100%;margin-top:8px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:8px;border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;min-height:44px;"
            onchange="saveMindNote('${m.id}',this.value)">${load('mind_note_'+m.id, '')}</textarea>
        </div>
      </div>
    </div>`).join('')}`;
}

function saveMindNote(id, val) { save('mind_note_' + id, val); }

function renderCommunication() {
  const container = document.getElementById('mind-comm');
  if (!container) return;
  const data = load('comm_checks', {});
  container.innerHTML = COMMUNICATION_CURRICULUM.map(section => `
    <div class="checklist-section">
      <div class="checklist-title">${section.title}</div>
      ${section.items.map((item, i) => {
        const key = section.title + i;
        return `
        <div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="comm-${key}" ${data[key]?'checked':''} onchange="saveCheck('comm_checks','${key}',this.checked)">
          <label class="cl-label ${data[key]?'done':''}" for="comm-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`).join('');
}


// ── MONEY.JS ──

function renderMoney() {
  const incomeLog = load('income_log', []);
  const total = incomeLog.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const month = incomeLog.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);
  const totalEl = document.getElementById('totalEarned');
  if (totalEl) totalEl.textContent = total.toLocaleString('en-IN');
  const monthEl = document.getElementById('monthEarned');
  if (monthEl) monthEl.textContent = month.toLocaleString('en-IN');

  const listEl = document.getElementById('incomeList');
  if (listEl) {
    if (incomeLog.length === 0) {
      listEl.innerHTML = '<div class="card-title">Income Log</div><div style="color:var(--text2);font-size:13px;">No income logged yet. First ₹1000 incoming! 💪</div>';
    } else {
      listEl.innerHTML = '<div class="card-title">Income Log</div>' + [...incomeLog].reverse().map(e => `
        <div class="income-entry">
          <div>
            <div style="font-weight:600;">${e.source}</div>
            <div class="income-cat">${e.category} · ${e.date}</div>
          </div>
          <div class="income-amt">₹${e.amount.toLocaleString('en-IN')}</div>
        </div>`).join('');
    }
  }

  const data = load('money_checks', {});
  const checklistEl = document.getElementById('moneyChecklists');
  if (checklistEl) {
    checklistEl.innerHTML = MONEY_CHECKLISTS.map(section => {
      const total2 = section.items.length;
      const done = section.items.filter((_, i) => data[section.title + i]).length;
      const pct = Math.round((done / total2) * 100);
      return `
      <div class="checklist-section">
        <div class="checklist-title">
          <span style="color:${section.color}">${section.title}</span>
          <span class="cl-pct">${done}/${total2} · ${pct}%</span>
        </div>
        <div class="mini-bar" style="margin-bottom:1rem"><div class="mini-fill" style="background:${section.color};width:${pct}%"></div></div>
        ${section.items.map((item, i) => {
          const key = section.title + i;
          return `
          <div class="checklist-item">
            <input type="checkbox" class="cl-cb" id="mon-${key}" ${data[key]?'checked':''} onchange="saveCheck('money_checks','${key}',this.checked)">
            <label class="cl-label ${data[key]?'done':''}" for="mon-${key}">${item}</label>
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
  }
}

function addIncome() {
  const source = document.getElementById('incomeSource').value.trim();
  const amount = parseInt(document.getElementById('incomeAmount').value);
  const category = document.getElementById('incomeCategory').value;
  if (!source || !amount) { alert('Enter source and amount.'); return; }
  const log = load('income_log', []);
  log.push({ source, amount, category, date: todayKey() });
  save('income_log', log);
  document.getElementById('incomeSource').value = '';
  document.getElementById('incomeAmount').value = '';
  renderMoney();
}


// ── AI.JS ──

let chatHistory = [];
let sessionTimer = null;
let sessionSeconds = 1800;
let sessionStarted = false;

function loadSessionCalendar() {
  const aiDateEl = document.getElementById('aiDate');
  if (aiDateEl) aiDateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const calEl = document.getElementById('sessionCalendar');
  if (!calEl) return;
  const now = new Date();
  let html = '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const hasSession = load('session_' + key, null);
    html += `<div class="session-day ${hasSession ? 'has-session' : ''}" title="${key}" onclick="loadPastSession('${key}')">${d.getDate()}</div>`;
  }
  html += '</div>';
  calEl.innerHTML = html;
  const groqKey = load('groq_key', '');
  const groqEl = document.getElementById('groqKey');
  if (groqEl && groqKey) groqEl.value = groqKey;
}

function saveGroqKey() {
  const key = document.getElementById('groqKey').value.trim();
  if (key) { save('groq_key', key); alert('✅ API Key saved!'); }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  if (!sessionStarted) {
    sessionStarted = true;
    startSessionTimer();
  }

  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  typing.style.display = 'flex';
  document.getElementById('chatMessages').appendChild(typing);
  scrollChat();

  const groqKey = load('groq_key', '');
  if (!groqKey) {
    typing.remove();
    appendMessage('ai', "⚠️ Please add your Groq API key in the panel on the right. Get it free at console.groq.com — it takes 2 minutes!");
    return;
  }

  const profile = getProfile();
  const systemPrompt = `You are a personal transformation coach and accountability partner for ${profile.name}, a ${profile.age}-year-old engineering student in Pune, India.

Profile: ${profile.age} years, ${profile.height}, ${profile.weight}kg (bulking to 70kg). Engineering 2nd year student with 8+ hours free daily.

Goals: Become extraordinary — ethical hacker (Phase 1: Linux/Python/TryHackMe, working toward OSCP), physical beast (gym 6x/week + calisthenics + boxing + MMA + self-defence), financial independence (₹0 to ₹10L/month by 23, lambo by 23), Ayanokoji-level sharp mind (chess, reading, mental models, logic), communication master, skin glow up.

Current Phase 1 targets: 2500 cal, 275g protein, 4.5L water, 10k steps, 8.5hr sleep, 2hr hacking study, 10 pages reading.

Your role in this 30-min daily session:
1. Listen to what the user tells you about their day
2. Celebrate genuine wins enthusiastically
3. Call out excuses firmly but constructively
4. Ask sharp questions that force deeper thinking
5. Give specific, actionable advice for tomorrow
6. End every session with "TOMORROW'S TOP 3:" followed by 3 numbered priorities

Tone: Direct older brother who has achieved what the user wants. Not preachy. Not soft. Straight talk. Warm when they win. Firm when they make excuses. Keep replies concise — 100-150 words max so conversation flows naturally. Never be generic. Always be specific to this person's goals.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...chatHistory],
        max_tokens: 300,
        temperature: 0.85
      })
    });
    const data = await res.json();
    typing.remove();
    if (data.error) {
      appendMessage('ai', '⚠️ API Error: ' + (data.error.message || 'Check your API key.'));
      return;
    }
    const reply = data.choices?.[0]?.message?.content || "Couldn't get a response. Try again.";
    appendMessage('ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
    saveSession();
  } catch (err) {
    typing.remove();
    appendMessage('ai', '⚠️ Network error. Check your internet connection and API key.');
  }
}

function appendMessage(role, text) {
  const msgs = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;flex-direction:column;align-items:' + (role === 'user' ? 'flex-end' : 'flex-start');
  div.innerHTML = `<div class="${role === 'user' ? 'user-bubble' : 'ai-bubble'}">${text.replace(/\n/g, '<br>')}</div>
    <div class="msg-time" style="${role === 'user' ? '' : 'text-align:left'}">${time}</div>`;
  msgs.appendChild(div);
  scrollChat();
}

function scrollChat() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function startSessionTimer() {
  sessionTimer = setInterval(() => {
    sessionSeconds--;
    const m = Math.floor(sessionSeconds / 60).toString().padStart(2, '0');
    const s = (sessionSeconds % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('aiTimer');
    if (timerEl) timerEl.textContent = m + ':' + s;
    if (sessionSeconds <= 300 && sessionSeconds > 299) {
      appendMessage('ai', '⏱ 5 minutes left in today\'s session. Let\'s wrap up with tomorrow\'s plan.');
    }
    if (sessionSeconds <= 0) {
      clearInterval(sessionTimer);
      appendMessage('ai', '✅ Session complete! Great work showing up today. Your tomorrow self will thank you for this. Get some rest.');
      saveSession();
    }
  }, 1000);
}

function saveSession() {
  const msgs = [...document.getElementById('chatMessages').querySelectorAll('.user-bubble,.ai-bubble')].map(el => ({
    role: el.classList.contains('user-bubble') ? 'user' : 'ai',
    text: el.innerText
  }));
  save('session_' + todayKey(), msgs);
}

function loadPastSession(dateKey) {
  const session = load('session_' + dateKey, null);
  if (!session || session.length === 0) { alert('No session found for ' + dateKey); return; }
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = `<div style="text-align:center;color:var(--text2);font-size:12px;padding:8px;">Viewing session from ${dateKey}</div>`;
  session.forEach(msg => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;justify-content:' + (msg.role === 'user' ? 'flex-end' : 'flex-start');
    div.innerHTML = `<div class="${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}">${msg.text}</div>`;
    msgs.appendChild(div);
  });
  scrollChat();
}


// ── STATS.JS ──

let chartInstances = {};

function refreshStats() {
  const st_days = document.getElementById('st-days');
  const st_streak = document.getElementById('st-streak');
  const st_gym = document.getElementById('st-gym');
  const st_books = document.getElementById('st-books');

  let days = 0, gymSessions = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const habits = load('daily_' + key + '_habits', null);
    if (habits && Object.values(habits).some(v => v)) days++;
    if (habits?.gym) gymSessions++;
  }
  if (st_days) st_days.textContent = days;
  if (st_streak) st_streak.textContent = getStreak();
  if (st_gym) st_gym.textContent = gymSessions;
  const bookData = load('books', {});
  const booksComplete = BOOKS.filter(b => bookData[b.id]?.status === 'Completed').length;
  if (st_books) st_books.textContent = booksComplete;
}

function renderCharts() {
  renderChart('habitChart', 'line', 'Daily Habit Completion %', () => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      const habits = load('daily_' + key + '_habits', {});
      const allItems = HABITS.flatMap(s => s.items);
      const done = allItems.filter(h => habits[h.id]).length;
      vals.push(allItems.length > 0 ? Math.round((done / allItems.length) * 100) : 0);
    }
    return { labels, datasets: [{ label: '% Complete', data: vals, borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)', tension: 0.4, fill: true }] };
  });

  renderChart('calChart', 'bar', 'Calories', () => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      const nut = load('daily_' + key + '_nutrition', {});
      vals.push(nut.cal || 0);
    }
    return { labels, datasets: [{ label: 'Calories', data: vals, backgroundColor: vals.map(v => v >= 2400 ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.7)') }] };
  });

  renderChart('waterChart', 'line', 'Water (L)', () => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      const nut = load('daily_' + key + '_nutrition', {});
      vals.push(nut.water || 0);
    }
    return { labels, datasets: [{ label: 'Water (L)', data: vals, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.1)', tension: 0.4, fill: true }] };
  });

  renderChart('sleepChart', 'bar', 'Sleep (hrs)', () => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      const sliders = load('daily_' + key + '_habits_sliders', {});
      vals.push(sliders.sleep_hours || 0);
    }
    return { labels, datasets: [{ label: 'Sleep (hrs)', data: vals, backgroundColor: vals.map(v => v >= 7.5 ? 'rgba(192,132,252,0.7)' : 'rgba(251,191,36,0.7)') }] };
  });
}

function renderChart(canvasId, type, label, dataFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (chartInstances[canvasId]) { chartInstances[canvasId].destroy(); }
  const { labels, datasets } = dataFn();
  chartInstances[canvasId] = new Chart(canvas, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#1e1e1e' } },
        y: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#1e1e1e' } }
      }
    }
  });
}


// ── APP.JS — Main Init ──

function initApp() {
  refreshDashboard();
  loadSettingsPage();
  renderTracker();
  loadNutritionValues();
  renderMealSections();
  renderGymSimple();
  renderHackingChecklists();
  renderBooks();
  renderChess();
  renderMentalModels();
  renderCommunication();
  renderMoney();
  loadSessionCalendar();

  // Go to last visited page
  const lastPage = localStorage.getItem('gu_last_page') || 'dashboard';
  showPage(lastPage);
}

window.addEventListener('DOMContentLoaded', () => {
  checkOnboarding();
});
