
// ══════════════════════════════════════════════
// NUTRITION
// ══════════════════════════════════════════════
const MACROS = {
  cal:   { target: 2500, fillId: 'cal-fill',   valId: 'cal-val'   },
  prot:  { target: 275,  fillId: 'prot-fill',  valId: 'prot-val'  },
  carb:  { target: 325,  fillId: 'carb-fill',  valId: 'carb-val'  },
  fat:   { target: 70,   fillId: 'fat-fill',   valId: 'fat-val'   },
  water: { target: 4.5,  fillId: 'water-fill', valId: 'water-val' },
};

function updateMacro(key, val, target) {
  const num = parseFloat(val);
  const pct = Math.min((num / target) * 100, 100);
  const valEl = document.getElementById(key + '-val');
  if (valEl) valEl.textContent = key === 'water' ? num.toFixed(1) : Math.round(num);
  const fillEl = document.getElementById(key + '-fill');
  if (fillEl) fillEl.style.width = pct + '%';
  const nut = loadToday('nutrition', {});
  nut[key] = num;
  saveToday('nutrition', nut);
}

function loadNutritionValues() {
  const nut = loadToday('nutrition', {});
  Object.keys(MACROS).forEach(key => {
    const sl = document.getElementById(key + '-slider');
    if (sl && nut[key] !== undefined) {
      sl.value = nut[key];
      updateMacro(key, nut[key], MACROS[key].target);
    }
  });
}

function renderMealSections() {
  const container = document.getElementById('mealSections');
  if (!container) return;
  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks & Shakes'];
  const savedMeals = loadToday('meals', {});
  container.innerHTML = meals.map(name => {
    const key = name.toLowerCase().replace(/\s+/g, '_');
    const items = savedMeals[key] || [];
    return `<div class="meal-section">
      <div class="meal-header" onclick="toggleMeal('ms-${key}')">
        <span>${name}</span>
        <span style="color:var(--text2);font-size:12px;">${items.length} items</span>
      </div>
      <div class="meal-body" id="ms-${key}">
        <div class="meal-form">
          <input type="text" class="form-input" id="mf-name-${key}" placeholder="Food name">
          <input type="number" class="form-input" id="mf-cal-${key}" placeholder="Cal" style="max-width:80px;">
          <input type="number" class="form-input" id="mf-prot-${key}" placeholder="Protein g" style="max-width:90px;">
          <button class="btn-secondary" onclick="addMealItem('${key}')" style="padding:8px 12px;">+</button>
        </div>
        <div class="meal-items" id="mi-${key}">
          ${items.map((item, i) => `<div class="meal-item">
            <span>${item.name}</span>
            <div style="display:flex;gap:12px;align-items:center;">
              <span style="color:var(--text2);font-size:12px;">${item.cal} cal · ${item.prot}g protein</span>
              <button class="meal-del" onclick="deleteMealItem('${key}',${i})">✕</button>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleMeal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'block';
}

function addMealItem(key) {
  const name = document.getElementById('mf-name-' + key).value.trim();
  const cal  = parseInt(document.getElementById('mf-cal-' + key).value) || 0;
  const prot = parseInt(document.getElementById('mf-prot-' + key).value) || 0;
  if (!name) return;
  const savedMeals = loadToday('meals', {});
  if (!savedMeals[key]) savedMeals[key] = [];
  savedMeals[key].push({ name, cal, prot });
  saveToday('meals', savedMeals);
  renderMealSections();
}

function deleteMealItem(key, idx) {
  const savedMeals = loadToday('meals', {});
  if (savedMeals[key]) { savedMeals[key].splice(idx, 1); saveToday('meals', savedMeals); }
  renderMealSections();
}

function saveNutrition() { alert('Nutrition saved!'); }


// ══════════════════════════════════════════════
// HACKING CHECKLIST
// ══════════════════════════════════════════════
function renderHackingChecklists() {
  const container = document.getElementById('hackingChecklists');
  if (!container) return;
  const data = load('hacking_checks', {});
  container.innerHTML = HACK_CHECKLISTS.map(section => {
    const total = section.items.length;
    const done  = section.items.filter((_, i) => data[section.title + i]).length;
    const pct   = Math.round((done / total) * 100);
    return `<div class="checklist-section">
      <div class="checklist-title">
        <span style="color:${section.color}">${section.title}</span>
        <span class="cl-pct">${done}/${total} · ${pct}%</span>
      </div>
      <div class="mini-bar" style="margin-bottom:1rem">
        <div class="mini-fill" style="background:${section.color};width:${pct}%"></div>
      </div>
      ${section.items.map((item, i) => {
        const key = section.title + i;
        return `<div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="hack-${key}" ${data[key] ? 'checked' : ''}
            onchange="saveCheck('hacking_checks','${key}',this.checked)">
          <label class="cl-label ${data[key] ? 'done' : ''}" for="hack-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  const hackData = load('hack_stats', {});
  ['thmRooms','pythonProjects','ctfSolved','githubRepos'].forEach(id => {
    const el = document.getElementById(id);
    if (el && hackData[id]) el.value = hackData[id];
  });
  updateHackBars();
}

function saveHackStat() {
  const data = {
    thmRooms:       parseInt(document.getElementById('thmRooms').value) || 0,
    pythonProjects: parseInt(document.getElementById('pythonProjects').value) || 0,
    ctfSolved:      parseInt(document.getElementById('ctfSolved').value) || 0,
    githubRepos:    parseInt(document.getElementById('githubRepos').value) || 0,
  };
  save('hack_stats', data);
  updateHackBars();
}

function updateHackBars() {
  const data = load('hack_stats', {});
  const thmBar = document.getElementById('thm-bar');
  const pyBar  = document.getElementById('py-bar');
  if (thmBar) thmBar.style.width = Math.min(((data.thmRooms || 0) / 50) * 100, 100) + '%';
  if (pyBar)  pyBar.style.width  = Math.min(((data.pythonProjects || 0) / 5) * 100, 100) + '%';
}

function saveCheck(storeKey, key, checked) {
  const data = load(storeKey, {});
  data[key] = checked;
  save(storeKey, data);
  const lbl = document.querySelector(`label[for$="${key}"]`);
  if (lbl) lbl.classList.toggle('done', checked);
  updatePhaseProgress();
}


// ══════════════════════════════════════════════
// READING TRACKER
// ══════════════════════════════════════════════
function renderBooks() {
  const container = document.getElementById('bookCards');
  if (!container) return;
  const bookData = load('books', {});

  // Merge built-in + custom books
  const customBooks = load('custom_books', []);
  const allBooks = [...BOOKS, ...customBooks];

  let totalPages = 0, completed = 0;
  allBooks.forEach(b => {
    const bd = bookData[b.id] || {};
    totalPages += bd.pagesRead || 0;
    if (bd.status === 'Completed') completed++;
  });

  const compEl  = document.getElementById('booksComplete');
  const pagesEl = document.getElementById('totalPages');
  if (compEl)  compEl.textContent  = completed;
  if (pagesEl) pagesEl.textContent = totalPages;

  container.innerHTML = allBooks.map(b => {
    const bd  = bookData[b.id] || { status: 'Not Started', pagesRead: 0, rating: 0, notes: '' };
    const pct = b.pages > 0 ? Math.min(Math.round(((bd.pagesRead || 0) / b.pages) * 100), 100) : 0;
    const isCustom = customBooks.find(c => c.id === b.id);
    return `<div class="book-card">
      <div class="book-card-header">
        <div class="book-num-badge">${b.num}</div>
        <div class="book-meta" style="flex:1;">
          <div class="book-title-text">${b.title} ${isCustom ? '<span style="font-size:10px;color:var(--text2);font-weight:400;">(custom)</span>' : ''}</div>
          <div class="book-author">${b.author}</div>
          ${b.why ? `<div class="book-why">${b.why}</div>` : ''}
        </div>
        ${isCustom ? `<button onclick="deleteCustomBook('${b.id}')" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:16px;padding:4px;">✕</button>` : ''}
      </div>
      <div class="book-controls">
        <select class="book-status" onchange="saveBookField('${b.id}','status',this.value)">
          ${['Not Started','Reading','Completed'].map(s => `<option ${bd.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
        <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text2);">
          <input type="number" min="0" max="${b.pages}" value="${bd.pagesRead||0}"
            style="width:60px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 6px;border-radius:6px;font-size:13px;text-align:center;"
            oninput="saveBookField('${b.id}','pagesRead',parseInt(this.value)||0)">
          / ${b.pages} pages
        </div>
        <div class="stars">${[1,2,3,4,5].map(s =>
          `<span class="star ${(bd.rating||0)>=s?'lit':''}" onclick="rateBook('${b.id}',${s})">★</span>`).join('')}
        </div>
      </div>
      <div class="book-progress-bar"><div class="book-progress-fill" style="width:${pct}%"></div></div>
      <textarea class="book-notes" placeholder="Key lessons from this book..."
        onchange="saveBookField('${b.id}','notes',this.value)">${bd.notes||''}</textarea>
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

function rateBook(id, rating) { saveBookField(id, 'rating', rating); renderBooks(); }

function quickAddPages(n) {
  if (!n || n <= 0) return;
  const bookData   = load('books', {});
  const customBooks = load('custom_books', []);
  const allBooks   = [...BOOKS, ...customBooks];
  const reading    = allBooks.find(b => (bookData[b.id]?.status || 'Not Started') === 'Reading') || allBooks[0];
  if (!bookData[reading.id]) bookData[reading.id] = { status: 'Reading', pagesRead: 0, rating: 0, notes: '' };
  bookData[reading.id].pagesRead = Math.min((bookData[reading.id].pagesRead || 0) + n, reading.pages);
  if (bookData[reading.id].pagesRead >= reading.pages) bookData[reading.id].status = 'Completed';
  save('books', bookData);
  renderBooks();
  const el = document.getElementById('customPages');
  if (el) el.value = '';
}

function showAddBookForm() {
  const modal = document.getElementById('addBookModal');
  if (modal) modal.style.display = 'flex';
}

function hideAddBookForm() {
  const modal = document.getElementById('addBookModal');
  if (modal) modal.style.display = 'none';
}

function addCustomBook() {
  const title  = document.getElementById('newBookTitle').value.trim();
  const author = document.getElementById('newBookAuthor').value.trim();
  const pages  = parseInt(document.getElementById('newBookPages').value) || 100;
  if (!title) { alert('Enter book title'); return; }
  const customBooks = load('custom_books', []);
  const allBooks    = [...BOOKS, ...customBooks];
  const newBook = {
    id:     'custom_' + Date.now(),
    num:    allBooks.length + 1,
    title,
    author: author || 'Unknown',
    pages,
    why:    ''
  };
  customBooks.push(newBook);
  save('custom_books', customBooks);
  hideAddBookForm();
  document.getElementById('newBookTitle').value  = '';
  document.getElementById('newBookAuthor').value = '';
  document.getElementById('newBookPages').value  = '';
  renderBooks();
}

function deleteCustomBook(id) {
  if (!confirm('Remove this book?')) return;
  const customBooks = load('custom_books', []).filter(b => b.id !== id);
  save('custom_books', customBooks);
  renderBooks();
}


// ══════════════════════════════════════════════
// MIND & IQ
// ══════════════════════════════════════════════
function renderMindPage() {
  const container = document.getElementById('mindContainer');
  if (!container) return;

  const skillLog = load('skill_log', []);
  const mindChecks = load('mind_checks', {});
  const chessData = load('chess', { elo: 400 });

  container.innerHTML = `

    <!-- SKILL PRACTICE LOG -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-title">📝 Skills Practiced Today</div>
      <p style="font-size:13px;color:var(--text2);margin-bottom:1rem;">Log any skill you practiced — hacking, IQ test, reading, drawing, chess, coding, anything.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem;">
        <input type="text" id="skillInput" class="form-input" placeholder="e.g. TryHackMe Linux room, IQ test, reading 20 pages..." style="flex:1;min-width:200px;">
        <select id="skillCategory" class="form-input" style="max-width:160px;">
          <option>Ethical Hacking</option>
          <option>IQ / Logic</option>
          <option>Reading</option>
          <option>Chess</option>
          <option>Coding / Python</option>
          <option>Drawing / Art</option>
          <option>Communication</option>
          <option>Fitness</option>
          <option>Language</option>
          <option>Other</option>
        </select>
        <button class="btn-primary" onclick="logSkill()">Log</button>
      </div>
      <div id="skillList">
        ${skillLog.slice().reverse().slice(0,10).map(s => `
          <div style="background:var(--surface);border-radius:8px;padding:8px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:13px;">
            <div>
              <span style="color:var(--green);font-size:11px;font-weight:600;margin-right:8px;">${s.category}</span>
              <span>${s.skill}</span>
            </div>
            <span style="color:var(--text3);font-size:11px;">${s.date}</span>
          </div>`).join('') || '<div style="color:var(--text3);font-size:13px;">No skills logged yet. Start today!</div>'}
      </div>
    </div>

    <!-- CHESS ELO -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-title">♟️ Chess ELO</div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <input type="number" id="eloInput" value="${chessData.elo || 400}"
          style="width:110px;background:var(--surface);border:1px solid var(--border);color:var(--green);padding:8px;border-radius:8px;font-size:26px;font-weight:700;text-align:center;font-family:inherit;"
          oninput="save('chess',{elo:parseInt(this.value)||400})">
        <div style="font-size:13px;color:var(--text2);">
          <div>Target Phase 1: <strong style="color:var(--green)">1000+</strong></div>
          <div style="margin-top:4px;">Play daily on chess.com or lichess.org</div>
        </div>
      </div>
    </div>

    <!-- MENTAL MODELS -->
    <div class="card" style="margin-bottom:1rem;">
      <div class="card-title">🧠 Mental Models</div>
      <p style="font-size:13px;color:var(--text2);margin-bottom:1rem;">Learn 1 per week. Tick when understood. Write your own example.</p>
      ${MENTAL_MODELS.map((m, i) => `
        <div style="background:var(--surface);border-radius:8px;padding:12px;margin-bottom:8px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <input type="checkbox" class="cl-cb" id="mm-${i}" ${mindChecks['mm'+i]?'checked':''}
              onchange="saveCheck('mind_checks','mm${i}',this.checked)" style="margin-top:3px;">
            <div style="flex:1;">
              <div style="font-size:14px;font-weight:600;color:${mindChecks['mm'+i]?'var(--green)':'var(--text)'};">${m.title}</div>
              <div style="font-size:12px;color:var(--text2);margin-top:3px;line-height:1.5;">${m.desc}</div>
              <textarea placeholder="Your real-life example..."
                style="width:100%;margin-top:8px;background:var(--card);border:1px solid var(--border);color:var(--text);padding:6px 10px;border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;min-height:40px;"
                onchange="save('mind_note_${m.id}',this.value)">${load('mind_note_'+m.id,'')||''}</textarea>
            </div>
          </div>
        </div>`).join('')}
    </div>

    <!-- COMMUNICATION -->
    <div class="card">
      <div class="card-title">🗣️ Communication Curriculum</div>
      ${COMMUNICATION_CURRICULUM.map(section => `
        <div style="margin-bottom:1rem;">
          <div style="font-size:13px;font-weight:600;color:var(--text2);margin-bottom:8px;">${section.title}</div>
          ${section.items.map((item, i) => {
            const key = section.title + i;
            return `<div class="checklist-item">
              <input type="checkbox" class="cl-cb" id="comm-${key}" ${load('comm_checks',{})[key]?'checked':''}
                onchange="saveCheck('comm_checks','${key}',this.checked)">
              <label class="cl-label ${load('comm_checks',{})[key]?'done':''}" for="comm-${key}">${item}</label>
            </div>`;
          }).join('')}
        </div>`).join('')}
    </div>`;
}

function logSkill() {
  const skill    = document.getElementById('skillInput').value.trim();
  const category = document.getElementById('skillCategory').value;
  if (!skill) return;
  const log = load('skill_log', []);
  log.push({ skill, category, date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' }) });
  save('skill_log', log);
  document.getElementById('skillInput').value = '';
  renderMindPage();
}


// ══════════════════════════════════════════════
// MONEY TRACKER
// ══════════════════════════════════════════════
function renderMoney() {
  const incomeLog = load('income_log', []);
  const now       = new Date();
  const total     = incomeLog.reduce((s, e) => s + e.amount, 0);
  const month     = incomeLog.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, e) => s + e.amount, 0);

  const el = id => document.getElementById(id);
  if (el('totalEarned'))  el('totalEarned').textContent  = total.toLocaleString('en-IN');
  if (el('monthEarned'))  el('monthEarned').textContent  = month.toLocaleString('en-IN');

  // Phase progress bar
  const phase1Target = 5000;
  const phasePct = Math.min(Math.round((month / phase1Target) * 100), 100);
  if (el('phaseProgressFill')) el('phaseProgressFill').style.width = phasePct + '%';
  if (el('phasePct'))          el('phasePct').textContent = phasePct + '%';

  // Income list
  const listEl = el('incomeList');
  if (listEl) {
    listEl.innerHTML = incomeLog.length === 0
      ? '<div style="color:var(--text2);font-size:13px;padding:1rem 0;">No income logged yet. First ₹1000 incoming! 💪</div>'
      : '<div class="card-title">Income History</div>' + [...incomeLog].reverse().map(e => `
          <div class="income-entry">
            <div>
              <div style="font-weight:600;font-size:14px;">${e.source}</div>
              <div style="font-size:11px;color:var(--text2);margin-top:2px;">${e.category} · ${e.date}</div>
            </div>
            <div style="color:var(--green);font-weight:700;font-family:'JetBrains Mono',monospace;">₹${e.amount.toLocaleString('en-IN')}</div>
          </div>`).join('');
  }

  // Checklists
  const data = load('money_checks', {});
  const checkEl = el('moneyChecklists');
  if (checkEl) {
    checkEl.innerHTML = MONEY_CHECKLISTS.map(section => {
      const tot2  = section.items.length;
      const done2 = section.items.filter((_, i) => data[section.title + i]).length;
      const pct2  = Math.round((done2 / tot2) * 100);
      return `<div class="checklist-section">
        <div class="checklist-title">
          <span style="color:${section.color}">${section.title}</span>
          <span class="cl-pct">${done2}/${tot2} · ${pct2}%</span>
        </div>
        <div class="mini-bar" style="margin-bottom:1rem">
          <div class="mini-fill" style="background:${section.color};width:${pct2}%"></div>
        </div>
        ${section.items.map((item, i) => {
          const key = section.title + i;
          return `<div class="checklist-item">
            <input type="checkbox" class="cl-cb" id="mon-${key}" ${data[key]?'checked':''}
              onchange="saveCheck('money_checks','${key}',this.checked)">
            <label class="cl-label ${data[key]?'done':''}" for="mon-${key}">${item}</label>
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
  }
}

function addIncome() {
  const source   = document.getElementById('incomeSource').value.trim();
  const amount   = parseInt(document.getElementById('incomeAmount').value);
  const category = document.getElementById('incomeCategory').value;
  if (!source || !amount) { alert('Enter source and amount.'); return; }
  const log = load('income_log', []);
  log.push({ source, amount, category, date: todayKey() });
  save('income_log', log);
  document.getElementById('incomeSource').value  = '';
  document.getElementById('incomeAmount').value  = '';
  renderMoney();
}


// ══════════════════════════════════════════════
// AI SESSION
// ══════════════════════════════════════════════
let chatHistory    = [];
let sessionTimer   = null;
let sessionSeconds = 1800;
let sessionStarted = false;

function loadSessionCalendar() {
  const aiDateEl = document.getElementById('aiDate');
  if (aiDateEl) aiDateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const calEl = document.getElementById('sessionCalendar');
  if (!calEl) return;
  const now = new Date();
  let html = '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const has = load('session_' + key, null);
    html += `<div class="session-day ${has?'has-session':''}" title="${key}" onclick="loadPastSession('${key}')">${d.getDate()}</div>`;
  }
  html += '</div>';
  calEl.innerHTML = html;
  const groqKey = load('groq_key', '');
  const groqEl  = document.getElementById('groqKey');
  if (groqEl && groqKey) groqEl.value = groqKey;
}

function saveGroqKey() {
  const key = document.getElementById('groqKey').value.trim();
  if (key) { save('groq_key', key); alert('API Key saved!'); }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  if (!sessionStarted) { sessionStarted = true; startSessionTimer(); }
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
    appendMessage('ai', 'Add your free Groq API key on the right. Get it at console.groq.com — 2 minutes!');
    return;
  }
  const profile = getProfile();
  const system  = `You are a personal transformation coach for ${profile.name}, a ${profile.age}-year-old engineering student in Pune. Goals: ethical hacker (Phase 1 beginner), physical beast (gym 6x/week, calisthenics, boxing), financial freedom (₹10L/month by 23), Ayanokoji-level mind, communication master. Current daily targets: 2500 cal, 275g protein, 4.5L water, 10k steps, 8.5hr sleep, 2hr hacking study, 10 pages reading. Be direct, like a sharp older brother. Celebrate wins. Call out excuses firmly. Keep replies 100-150 words max. End every session with TOMORROW'S TOP 3: numbered list.`;
  try {
    const res  = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + groqKey },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role:'system', content:system }, ...chatHistory], max_tokens: 300, temperature: 0.85 })
    });
    const data  = await res.json();
    typing.remove();
    if (data.error) { appendMessage('ai', 'API Error: ' + (data.error.message || 'Check your key.')); return; }
    const reply = data.choices?.[0]?.message?.content || 'Try again.';
    appendMessage('ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
    saveSession();
  } catch (err) {
    typing.remove();
    appendMessage('ai', 'Network error. Check internet and API key.');
  }
}

function appendMessage(role, text) {
  const msgs = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const div  = document.createElement('div');
  div.style.cssText = 'display:flex;flex-direction:column;align-items:' + (role==='user'?'flex-end':'flex-start');
  div.innerHTML = `<div class="${role==='user'?'user-bubble':'ai-bubble'}">${text.replace(/\n/g,'<br>')}</div><div class="msg-time" style="${role==='user'?'':'text-align:left'}">${time}</div>`;
  msgs.appendChild(div);
  scrollChat();
}

function scrollChat() {
  const m = document.getElementById('chatMessages');
  if (m) m.scrollTop = m.scrollHeight;
}

function startSessionTimer() {
  sessionTimer = setInterval(() => {
    sessionSeconds--;
    const m = Math.floor(sessionSeconds / 60).toString().padStart(2,'0');
    const s = (sessionSeconds % 60).toString().padStart(2,'0');
    const t = document.getElementById('aiTimer');
    if (t) t.textContent = m + ':' + s;
    if (sessionSeconds === 300) appendMessage('ai', '5 minutes left. Let\'s wrap up with tomorrow\'s plan.');
    if (sessionSeconds <= 0) {
      clearInterval(sessionTimer);
      appendMessage('ai', 'Session complete! Great work today. Rest well.');
      saveSession();
    }
  }, 1000);
}

function saveSession() {
  const msgs = [...document.getElementById('chatMessages').querySelectorAll('.user-bubble,.ai-bubble')].map(el => ({ role: el.classList.contains('user-bubble')?'user':'ai', text: el.innerText }));
  save('session_' + todayKey(), msgs);
}

function loadPastSession(dateKey) {
  const session = load('session_' + dateKey, null);
  if (!session || !session.length) { alert('No session found for ' + dateKey); return; }
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = `<div style="text-align:center;color:var(--text2);font-size:12px;padding:8px;">Viewing: ${dateKey}</div>`;
  session.forEach(msg => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;justify-content:' + (msg.role==='user'?'flex-end':'flex-start');
    div.innerHTML = `<div class="${msg.role==='user'?'user-bubble':'ai-bubble'}">${msg.text}</div>`;
    msgs.appendChild(div);
  });
  scrollChat();
}


// ══════════════════════════════════════════════
// STATS & ANALYTICS
// ══════════════════════════════════════════════
let chartInstances = {};

function refreshStats() {
  let days = 0, gymSessions = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key    = d.toISOString().split('T')[0];
    const habits = load('daily_' + key + '_habits', null);
    if (habits && Object.values(habits).some(v => v)) days++;
    if (habits?.gym) gymSessions++;
  }
  const bookData     = load('books', {});
  const customBooks  = load('custom_books', []);
  const allBooks     = [...BOOKS, ...customBooks];
  const booksComplete = allBooks.filter(b => bookData[b.id]?.status === 'Completed').length;
  const hackData     = load('hack_stats', {});
  const skillLog     = load('skill_log', []);
  const incomeLog    = load('income_log', []);
  const totalIncome  = incomeLog.reduce((s, e) => s + e.amount, 0);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('st-days',    days);
  set('st-streak',  getStreak());
  set('st-gym',     gymSessions);
  set('st-books',   booksComplete);
  set('st-thm',     hackData.thmRooms || 0);
  set('st-skills',  skillLog.length);
  set('st-income',  '₹' + totalIncome.toLocaleString('en-IN'));

  // Circles
  drawCircle('circle-habits', getAvgCompletion(), '#4ade80');
  drawCircle('circle-hack',   Math.min(((hackData.thmRooms||0)/50)*100,100), '#60a5fa');
  drawCircle('circle-books',  Math.min((booksComplete/10)*100,100), '#c084fc');
  drawCircle('circle-gym',    Math.min((gymSessions/24)*100,100), '#fbbf24');

  setTimeout(renderCharts, 100);
}

function getAvgCompletion() {
  let total = 0, count = 0;
  const allItems = HABITS.flatMap(s => s.items);
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key    = d.toISOString().split('T')[0];
    const habits = load('daily_' + key + '_habits', null);
    if (habits) {
      total += allItems.filter(h => habits[h.id]).length;
      count += allItems.length;
    }
  }
  return count > 0 ? Math.round((total/count)*100) : 0;
}

function drawCircle(canvasId, pct, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 70, cy = 70, r = 55, lw = 10;
  ctx.clearRect(0, 0, 140, 140);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = '#1e1e1e'; ctx.lineWidth = lw; ctx.stroke();
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (Math.PI*2*pct/100));
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
  }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(Math.round(pct) + '%', cx, cy);
}

function renderCharts() {
  const mkChart = (id, type, label, dataFn, color) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    if (chartInstances[id]) { chartInstances[id].destroy(); }
    const { labels, datasets } = dataFn();
    chartInstances[id] = new Chart(canvas, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color:'#666', font:{ size:10 } }, grid: { color:'#1a1a1a' } },
          y: { ticks: { color:'#666', font:{ size:10 } }, grid: { color:'#1a1a1a' } }
        }
      }
    });
  };

  const last14 = (subkey, field) => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }));
      const data = load('daily_' + key + '_' + subkey, {});
      vals.push(data[field] || 0);
    }
    return { labels, vals };
  };

  mkChart('habitChart', 'line', 'Habits', () => {
    const labels = [], vals = [];
    const allItems = HABITS.flatMap(s => s.items);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }));
      const h = load('daily_' + key + '_habits', {});
      vals.push(allItems.length > 0 ? Math.round((allItems.filter(x => h[x.id]).length / allItems.length)*100) : 0);
    }
    return { labels, datasets: [{ data: vals, borderColor:'#4ade80', backgroundColor:'rgba(74,222,128,0.08)', tension:0.4, fill:true }] };
  });

  mkChart('calChart', 'bar', 'Calories', () => {
    const { labels, vals } = last14('nutrition', 'cal');
    return { labels, datasets: [{ data: vals, backgroundColor: vals.map(v => v >= 2400 ? 'rgba(74,222,128,0.7)' : 'rgba(248,113,113,0.5)') }] };
  });

  mkChart('waterChart', 'line', 'Water', () => {
    const { labels, vals } = last14('nutrition', 'water');
    return { labels, datasets: [{ data: vals, borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.08)', tension:0.4, fill:true }] };
  });

  mkChart('sleepChart', 'bar', 'Sleep', () => {
    const labels = [], vals = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      labels.push(d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }));
      const sl = load('daily_' + key + '_habits_sliders', {});
      vals.push(sl.sleep_hours || 0);
    }
    return { labels, datasets: [{ data: vals, backgroundColor: vals.map(v => v >= 7.5 ? 'rgba(192,132,252,0.7)' : 'rgba(251,191,36,0.5)') }] };
  });
}


// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
function initApp() {
  refreshDashboard();
  loadSettingsPage();
  renderTracker();
  loadNutritionValues();
  renderMealSections();
  renderGymSimple();
  renderHackingChecklists();
  renderBooks();
  renderMindPage();
  renderMoney();
  loadSessionCalendar();

  const lastPage = localStorage.getItem('gu_last_page') || 'dashboard';
  showPage(lastPage);
}

window.addEventListener('DOMContentLoaded', () => {
  checkOnboarding();
});
