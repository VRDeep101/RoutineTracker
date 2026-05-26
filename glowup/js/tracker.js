// ── TRACKER.JS ──

function renderTracker() {
  const container = document.getElementById('habitsContainer');
  if (!container) return;
  const saved = loadToday('habits', {});
  const sliders = loadToday('habits_sliders', {});
  const dateEl = document.getElementById('trackerDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  container.innerHTML = HABITS.map(section => `
    <div class="habit-section">
      <div class="habit-section-title">${section.section}</div>
      ${section.items.map(item => `
        <div class="habit-item ${saved[item.id] ? 'checked' : ''}" id="hi-${item.id}">
          <input type="checkbox" class="habit-cb" id="hc-${item.id}" ${saved[item.id] ? 'checked' : ''}
            onchange="toggleHabit('${item.id}')">
          <label class="habit-label" for="hc-${item.id}">${item.label}</label>
        </div>
        ${item.hasSlider ? `
        <div class="habit-extra">
          <input type="range" class="habit-slider" min="${item.sliderMin}" max="${item.sliderMax}"
            step="${item.sliderStep || 1}" value="${sliders[item.sliderKey] || 0}"
            id="hs-${item.sliderKey}"
            oninput="updateHabitSlider('${item.sliderKey}', this.value, '${item.sliderUnit}')">
          <span class="habit-slider-val" id="hsv-${item.sliderKey}">
            ${item.sliderKey === 'steps_count'
              ? (sliders[item.sliderKey] || 0).toLocaleString()
              : (sliders[item.sliderKey] || 0)} ${item.sliderUnit}
          </span>
        </div>` : ''}
      `).join('')}
    </div>
  `).join('');
  updateTrackerScore();
}

function toggleHabit(id) {
  const cb = document.getElementById('hc-' + id);
  const row = document.getElementById('hi-' + id);
  const label = row ? row.querySelector('.habit-label') : null;
  const saved = loadToday('habits', {});
  saved[id] = cb.checked;
  saveToday('habits', saved);
  if (row) row.classList.toggle('checked', cb.checked);
  if (label) label.style.opacity = cb.checked ? '0.6' : '1';
  updateTrackerScore();
}

function updateHabitSlider(key, val, unit) {
  const sliders = loadToday('habits_sliders', {});
  sliders[key] = parseFloat(val);
  saveToday('habits_sliders', sliders);
  const display = document.getElementById('hsv-' + key);
  if (display) {
    display.textContent = key === 'steps_count'
      ? parseInt(val).toLocaleString() + ' ' + unit
      : parseFloat(val) + ' ' + unit;
  }
}

function updateTrackerScore() {
  const saved = loadToday('habits', {});
  const allItems = HABITS.flatMap(s => s.items);
  const total = allItems.length;
  const done = allItems.filter(h => saved[h.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const scoreEl = document.getElementById('trackerScore');
  if (scoreEl) scoreEl.textContent = `${done} / ${total} habits`;
  const fillEl = document.getElementById('scoreFill');
  if (fillEl) fillEl.style.width = pct + '%';
  const pctEl = document.getElementById('trackerPct');
  if (pctEl) pctEl.textContent = pct + '%';
  drawRing(pct);
  const ringEl = document.getElementById('ringPct');
  if (ringEl) ringEl.textContent = pct + '%';
}

function saveTracker() {
  const saved = loadToday('habits', {});
  const allSaved = Object.values(saved).some(v => v === true);
  if (allSaved) {
    alert(`✅ Progress saved! You completed ${Object.values(saved).filter(Boolean).length} habits today. Keep going!`);
  } else {
    alert('Check off at least one habit first!');
  }
}

function loadTracker() {
  if (confirm('Reset today\'s tracker?')) {
    saveToday('habits', {});
    saveToday('habits_sliders', {});
    renderTracker();
  }
}
