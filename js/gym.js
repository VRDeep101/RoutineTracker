// ── SIMPLE GYM WEEKLY VIEW ──

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function renderGymSimple() {
  const container = document.getElementById('gym-workout');
  if (!container) return;

  const dates = getWeekDates();
  const today = new Date().toISOString().split('T')[0];
  const gymData = load('gym_simple', {});

  const items = ['Gym', 'Calisthenics', 'Shadowboxing / Boxing', 'Morning Skincare', 'Night Skincare'];
  const keys = ['gym', 'calisthenics', 'boxing', 'skin_am', 'skin_pm'];

  let html = '<div style="overflow-x:auto;">';
  html += '<table style="width:100%;border-collapse:collapse;min-width:500px;">';

  // Header row - days
  html += '<thead><tr>';
  html += '<th style="padding:10px 14px;text-align:left;font-size:13px;color:var(--text2);font-weight:500;border-bottom:1px solid var(--border);width:180px;">Activity</th>';
  dates.forEach((date, i) => {
    const isToday = date === today;
    html += `<th style="padding:10px 8px;text-align:center;font-size:12px;color:${isToday ? 'var(--green)' : 'var(--text2)'};font-weight:${isToday ? '700' : '500'};border-bottom:1px solid var(--border);">${DAYS[i]}<br><span style="font-size:10px;opacity:0.6;">${date.slice(8)}</span></th>`;
  });
  html += '</tr></thead>';

  // Rows - activities
  html += '<tbody>';
  items.forEach((item, ri) => {
    const key = keys[ri];
    html += '<tr style="border-bottom:1px solid #111;">';
    html += `<td style="padding:12px 14px;font-size:14px;font-weight:500;color:var(--text);">${item}</td>`;
    dates.forEach((date) => {
      const cellKey = date + '_' + key;
      const checked = gymData[cellKey] || false;
      const isToday = date === today;
      html += `<td style="padding:8px;text-align:center;background:${isToday ? 'rgba(57,255,133,0.03)' : 'transparent'};">
        <input type="checkbox" 
          style="width:18px;height:18px;accent-color:var(--green);cursor:pointer;"
          ${checked ? 'checked' : ''}
          onchange="saveGymCheck('${cellKey}', this.checked)">
      </td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  // Weekly summary
  const weekTotal = {};
  keys.forEach(k => { weekTotal[k] = 0; });
  dates.forEach(date => {
    keys.forEach(k => {
      if (gymData[date + '_' + k]) weekTotal[k]++;
    });
  });

  html += '<div style="margin-top:1.5rem;display:flex;gap:10px;flex-wrap:wrap;">';
  items.forEach((item, i) => {
    const count = weekTotal[keys[i]];
    const color = count >= 5 ? 'var(--green)' : count >= 3 ? 'var(--amber)' : 'var(--text2)';
    html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:13px;">
      <span style="color:var(--text2);">${item}</span>
      <span style="color:${color};font-weight:700;margin-left:8px;">${count}/7</span>
    </div>`;
  });
  html += '</div>';

  // Body weight log
  const weightLog = load('weight_log', {});
  const todayWeight = weightLog[today] || '';
  html += `<div style="margin-top:1.5rem;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1rem 1.25rem;">
    <div style="font-size:13px;font-weight:600;color:var(--text2);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">Today's Weight</div>
    <div style="display:flex;gap:10px;align-items:center;">
      <input type="number" id="bodyWeightInput" value="${todayWeight}" placeholder="e.g. 51.5" step="0.1" min="30" max="200"
        style="width:120px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:8px;font-size:15px;font-family:inherit;">
      <span style="color:var(--text2);font-size:14px;">kg</span>
      <button class="btn-primary" onclick="saveBodyWeight()" style="padding:8px 16px;">Save</button>
    </div>
  </div>`;

  container.innerHTML = html;
}

function saveGymCheck(cellKey, checked) {
  const gymData = load('gym_simple', {});
  gymData[cellKey] = checked;
  save('gym_simple', gymData);
  renderGymSimple();
}


// ── KEEP BODY WEIGHT SAVE ──
function saveBodyWeight() {
  const val = parseFloat(document.getElementById('bodyWeightInput').value);
  if (val && val > 0) {
    const log = load('weight_log', {});
    log[new Date().toISOString().split('T')[0]] = val;
    save('weight_log', log);
    alert('Weight saved: ' + val + 'kg');
  }
}

function saveGymWorkout() {}


// ── HACKING CHECKLIST ──
function saveCheck(storeKey, key, checked) {
  const data = load(storeKey, {});
  data[key] = checked;
  save(storeKey, data);
  const lbl = document.querySelector('label[for$="' + key + '"]');
  if (lbl) lbl.classList.toggle('done', checked);
  updatePhaseProgress();
}
