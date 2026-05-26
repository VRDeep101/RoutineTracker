// ── NUTRITION.JS ──

const MACROS = {
  cal: { target: 2500, unit: 'kcal', fillId: 'cal-fill', valId: 'cal-val' },
  prot: { target: 275, unit: 'g', fillId: 'prot-fill', valId: 'prot-val' },
  carb: { target: 325, unit: 'g', fillId: 'carb-fill', valId: 'carb-val' },
  fat: { target: 70, unit: 'g', fillId: 'fat-fill', valId: 'fat-val' },
  water: { target: 4.5, unit: 'L', fillId: 'water-fill', valId: 'water-val' },
};

function updateMacro(key, val, target) {
  const num = parseFloat(val);
  const pct = Math.min((num / target) * 100, 100);
  const valEl = document.getElementById(key + '-val');
  if (valEl) valEl.textContent = key === 'water' ? num.toFixed(1) : Math.round(num);
  const fillEl = document.getElementById(key + '-fill');
  if (fillEl) fillEl.style.width = pct + '%';
  const nutData = loadToday('nutrition', {});
  nutData[key] = num;
  saveToday('nutrition', nutData);
}

function loadNutritionValues() {
  const nut = loadToday('nutrition', {});
  Object.keys(MACROS).forEach(key => {
    const slider = document.getElementById(key + '-slider');
    if (slider && nut[key] !== undefined) {
      slider.value = nut[key];
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
    return `
    <div class="meal-section">
      <div class="meal-header" onclick="toggleMealSection('ms-${key}')">
        <span>${name}</span>
        <span style="color:var(--text2);font-size:12px;">${items.length} items</span>
      </div>
      <div class="meal-body" id="ms-${key}">
        <div class="meal-form">
          <input type="text" class="form-input" id="mf-name-${key}" placeholder="Food name">
          <input type="number" class="form-input" id="mf-cal-${key}" placeholder="Cal" min="0" style="max-width:80px;">
          <input type="number" class="form-input" id="mf-prot-${key}" placeholder="Protein g" min="0" style="max-width:90px;">
          <button class="btn-secondary" onclick="addMealItem('${key}')" style="padding:8px 12px;">+</button>
        </div>
        <div class="meal-items" id="mi-${key}">
          ${items.map((item, i) => `
            <div class="meal-item">
              <span>${item.name}</span>
              <div style="display:flex;gap:12px;align-items:center;">
                <span style="color:var(--text2);font-size:12px;">${item.cal} cal · ${item.prot}g protein</span>
                <button class="meal-del" onclick="deleteMealItem('${key}', ${i})">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleMealSection(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'block';
}

function addMealItem(key) {
  const name = document.getElementById('mf-name-' + key).value.trim();
  const cal = parseInt(document.getElementById('mf-cal-' + key).value) || 0;
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

function saveNutrition() { alert('✅ Nutrition saved for today!'); }


// ── GYM.JS ──

const GYM_EXERCISES = {
  push: ['Bench Press', 'Overhead Press', 'Incline DB Press', 'Lateral Raises', 'Tricep Pushdown', 'Cable Flyes'],
  pull: ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Face Pulls', 'Bicep Curl', 'Hammer Curl'],
  legs: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl', 'Calf Raises', 'Lunges'],
};

function renderGymWorkout() {
  const container = document.getElementById('gym-workout');
  if (!container) return;
  const day = new Date().getDay();
  const dayMap = { 1: 'push', 2: 'pull', 3: 'legs', 4: 'push', 5: 'pull', 6: 'legs', 0: 'rest' };
  const today = dayMap[day];
  const savedGym = loadToday('gym_workout', {});
  const weightData = load('weight_log', {});
  const todayWeight = weightData[todayKey()] || '';

  let html = `
    <div class="card">
      <div class="card-title">Weight Log</div>
      <div style="display:flex;gap:10px;align-items:center;">
        <input type="number" class="form-input" id="bodyWeightInput" value="${todayWeight}" placeholder="Today's weight (kg)" style="max-width:200px;" step="0.1">
        <button class="btn-primary" onclick="saveBodyWeight()">Save</button>
      </div>
    </div>`;

  if (today === 'rest') {
    html += `<div class="card" style="text-align:center;padding:2rem;">
      <div style="font-size:48px;margin-bottom:1rem;">😴</div>
      <div style="font-size:18px;font-weight:600;">Rest Day</div>
      <div style="color:var(--text2);margin-top:8px;">Muscle grows during recovery. Sleep 8+ hours tonight.</div>
    </div>`;
  } else {
    const exercises = GYM_EXERCISES[today] || [];
    html += `<div class="card">
      <div class="card-title">${today.toUpperCase()} DAY — ${new Date().toLocaleDateString('en-IN',{weekday:'long'})}</div>
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid var(--border);font-size:12px;color:var(--text2);text-transform:uppercase;">
            <th style="padding:8px;text-align:left;">Exercise</th>
            <th style="padding:8px;text-align:center;">Set 1 (kg × reps)</th>
            <th style="padding:8px;text-align:center;">Set 2</th>
            <th style="padding:8px;text-align:center;">Set 3</th>
          </tr>
        </thead>
        <tbody>
          ${exercises.map(ex => {
            const key = ex.toLowerCase().replace(/\s/g, '_');
            const saved = savedGym[key] || [{kg:'',reps:''},{kg:'',reps:''},{kg:'',reps:''}];
            return `<tr style="border-bottom:1px solid #1a1a1a;">
              <td style="padding:10px 8px;font-size:13px;font-weight:500;">${ex}</td>
              ${[0,1,2].map(si => `
                <td style="padding:6px 4px;text-align:center;">
                  <div style="display:flex;gap:4px;justify-content:center;align-items:center;">
                    <input type="number" placeholder="kg" min="0" value="${saved[si]?.kg||''}"
                      style="width:52px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 6px;border-radius:6px;font-size:12px;text-align:center;"
                      oninput="saveGymSet('${key}',${si},'kg',this.value)">
                    <span style="color:var(--text3);font-size:12px;">×</span>
                    <input type="number" placeholder="reps" min="0" value="${saved[si]?.reps||''}"
                      style="width:48px;background:var(--surface);border:1px solid var(--border);color:var(--text);padding:4px 6px;border-radius:6px;font-size:12px;text-align:center;"
                      oninput="saveGymSet('${key}',${si},'reps',this.value)">
                  </div>
                </td>
              `).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      </div>
      <button class="btn-primary" style="margin-top:1rem;" onclick="saveGymWorkout()"><i class="fa fa-save"></i> Save Workout</button>
    </div>`;
  }
  container.innerHTML = html;
}

function saveGymSet(exercise, setIdx, field, val) {
  const savedGym = loadToday('gym_workout', {});
  if (!savedGym[exercise]) savedGym[exercise] = [{},{},{}];
  savedGym[exercise][setIdx][field] = val;
  saveToday('gym_workout', savedGym);
}

function saveBodyWeight() {
  const val = parseFloat(document.getElementById('bodyWeightInput').value);
  if (val && val > 0) {
    const log = load('weight_log', {});
    log[todayKey()] = val;
    save('weight_log', log);
    alert('✅ Weight saved: ' + val + 'kg');
  }
}

function saveGymWorkout() { alert('✅ Workout saved!'); }

function renderCalisthenics() {
  const container = document.getElementById('gym-calisthenics');
  if (!container) return;
  const data = load('gym_checks', {});
  container.innerHTML = CALISTHENICS_LEVELS.map(level => {
    const total = level.items.length;
    const done = level.items.filter((_, i) => data[level.level + i]).length;
    const pct = Math.round((done / total) * 100);
    return `
    <div class="checklist-section">
      <div class="checklist-title">
        <span style="color:${level.color}">${level.level}</span>
        <span class="cl-pct">${done}/${total}</span>
      </div>
      <div class="mini-bar" style="margin-bottom:1rem"><div class="mini-fill" style="background:${level.color};width:${pct}%"></div></div>
      ${level.items.map((item, i) => {
        const key = level.level + i;
        return `
        <div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="cal-${key}" ${data[key] ? 'checked' : ''}
            onchange="saveCheck('gym_checks','${key}',this.checked)">
          <label class="cl-label ${data[key] ? 'done' : ''}" for="cal-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function renderBoxing() {
  const container = document.getElementById('gym-boxing');
  if (!container) return;
  const data = load('boxing_checks', {});
  container.innerHTML = BOXING_CURRICULUM.map(section => {
    const total = section.items.length;
    const done = section.items.filter((_, i) => data[section.title + i]).length;
    const pct = Math.round((done / total) * 100);
    return `
    <div class="checklist-section">
      <div class="checklist-title">
        <span>${section.title}</span>
        <span class="cl-pct">${done}/${total}</span>
      </div>
      <div class="mini-bar" style="margin-bottom:1rem"><div class="mini-fill" style="background:var(--red);width:${pct}%"></div></div>
      ${section.items.map((item, i) => {
        const key = section.title + i;
        return `
        <div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="box-${key}" ${data[key] ? 'checked' : ''}
            onchange="saveCheck('boxing_checks','${key}',this.checked)">
          <label class="cl-label ${data[key] ? 'done' : ''}" for="box-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

function renderSkin() {
  const container = document.getElementById('gym-skin');
  if (!container) return;
  const data = load('skin_checks', {});
  container.innerHTML = SKIN_CHECKLIST.map(section => `
    <div class="checklist-section">
      <div class="checklist-title">${section.title}</div>
      ${section.items.map((item, i) => {
        const key = section.title + i;
        return `
        <div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="skin-${key}" ${data[key] ? 'checked' : ''}
            onchange="saveCheck('skin_checks','${key}',this.checked)">
          <label class="cl-label ${data[key] ? 'done' : ''}" for="skin-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`).join('');
}

// ── HACKING.JS ──

function renderHackingChecklists() {
  const container = document.getElementById('hackingChecklists');
  if (!container) return;
  const data = load('hacking_checks', {});
  container.innerHTML = HACK_CHECKLISTS.map(section => {
    const total = section.items.length;
    const done = section.items.filter((_, i) => data[section.title + i]).length;
    const pct = Math.round((done / total) * 100);
    return `
    <div class="checklist-section">
      <div class="checklist-title">
        <span style="color:${section.color}">${section.title}</span>
        <span class="cl-pct">${done}/${total} · ${pct}%</span>
      </div>
      <div class="mini-bar" style="margin-bottom:1rem"><div class="mini-fill" style="background:${section.color};width:${pct}%"></div></div>
      ${section.items.map((item, i) => {
        const key = section.title + i;
        return `
        <div class="checklist-item">
          <input type="checkbox" class="cl-cb" id="hack-${key}" ${data[key] ? 'checked' : ''}
            onchange="saveCheck('hacking_checks','${key}',this.checked)">
          <label class="cl-label ${data[key] ? 'done' : ''}" for="hack-${key}">${item}</label>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  const hackData = load('hack_stats', {});
  if (hackData.thmRooms) document.getElementById('thmRooms').value = hackData.thmRooms;
  if (hackData.pythonProjects) document.getElementById('pythonProjects').value = hackData.pythonProjects;
  if (hackData.ctfSolved) document.getElementById('ctfSolved').value = hackData.ctfSolved;
  if (hackData.githubRepos) document.getElementById('githubRepos').value = hackData.githubRepos;
  updateHackBars();
}

function saveHackStat() {
  const data = {
    thmRooms: parseInt(document.getElementById('thmRooms').value) || 0,
    pythonProjects: parseInt(document.getElementById('pythonProjects').value) || 0,
    ctfSolved: parseInt(document.getElementById('ctfSolved').value) || 0,
    githubRepos: parseInt(document.getElementById('githubRepos').value) || 0,
  };
  save('hack_stats', data);
  updateHackBars();
}

function updateHackBars() {
  const data = load('hack_stats', {});
  const thmPct = Math.min(((data.thmRooms || 0) / 50) * 100, 100);
  const pyPct = Math.min(((data.pythonProjects || 0) / 5) * 100, 100);
  const thmBar = document.getElementById('thm-bar');
  const pyBar = document.getElementById('py-bar');
  if (thmBar) thmBar.style.width = thmPct + '%';
  if (pyBar) pyBar.style.width = pyPct + '%';
}

function saveCheck(storeKey, key, checked) {
  const data = load(storeKey, {});
  data[key] = checked;
  save(storeKey, data);
  document.querySelector(`label[for$="${key}"]`)?.classList.toggle('done', checked);
  updatePhaseProgress();
}
