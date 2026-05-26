<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GLOW UP OS — README</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #060608;
    --card: #0e0e12;
    --surface: #16161c;
    --border: #1e1e28;
    --green: #39ff85;
    --green2: #1aff6e;
    --blue: #4da6ff;
    --purple: #b57aff;
    --amber: #ffcc44;
    --red: #ff5566;
    --text: #f0f0f5;
    --text2: #7070a0;
    --text3: #35354a;
    --glow: 0 0 20px rgba(57,255,133,0.3);
    --glow2: 0 0 40px rgba(57,255,133,0.15);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    cursor: none;
  }

  /* CURSOR */
  .cursor {
    width: 12px; height: 12px;
    background: var(--green);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s;
    box-shadow: 0 0 10px var(--green), 0 0 20px rgba(57,255,133,0.5);
    transform: translate(-50%, -50%);
  }
  .cursor-ring {
    width: 32px; height: 32px;
    border: 1px solid rgba(57,255,133,0.4);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.15s ease;
    transform: translate(-50%, -50%);
  }

  /* NOISE OVERLAY */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
    opacity: 0.4;
  }

  /* GRID LINES */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(57,255,133,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,133,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .wrapper { position: relative; z-index: 2; max-width: 860px; margin: 0 auto; padding: 0 2rem 6rem; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 0 2rem;
    position: relative;
  }
  .hero-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--green);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    opacity: 0;
    animation: fadeUp 0.6s ease 0.2s forwards;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hero-tag::before {
    content: '';
    width: 24px; height: 1px;
    background: var(--green);
    box-shadow: var(--glow);
  }
  .hero-title {
    font-size: clamp(56px, 10vw, 96px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.3s forwards;
  }
  .hero-title .green { color: var(--green); text-shadow: var(--glow2); }
  .hero-sub {
    font-size: 16px;
    color: var(--text2);
    margin-top: 1.5rem;
    max-width: 520px;
    line-height: 1.7;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.5s forwards;
    font-weight: 400;
  }
  .hero-sub em {
    color: var(--text);
    font-style: normal;
    font-weight: 600;
  }
  .hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 2.5rem;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.7s ease 0.6s forwards;
  }
  .btn-glow {
    background: var(--green);
    color: #000;
    border: none;
    padding: 14px 28px;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: none;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    box-shadow: 0 0 20px rgba(57,255,133,0.4);
  }
  .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 0 35px rgba(57,255,133,0.6); }
  .btn-outline {
    background: transparent;
    color: var(--text2);
    border: 1px solid var(--border);
    padding: 14px 28px;
    border-radius: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: none;
    transition: all 0.2s;
  }
  .btn-outline:hover { border-color: var(--green); color: var(--green); }

  /* FLOATING BADGE */
  .hero-badge {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 160px; height: 160px;
    border: 1px solid rgba(57,255,133,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 20s linear infinite, fadeIn 1s ease 1s forwards;
    opacity: 0;
  }
  .hero-badge::before {
    content: 'GLOW UP OS • PHASE 1 • PUNE • 2026 •';
    position: absolute;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    letter-spacing: 0.15em;
    color: var(--green);
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    animation: spinReverse 20s linear infinite;
  }
  .badge-inner { font-size: 36px; }
  @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
  @keyframes spinReverse { to { transform: rotate(-360deg); } }
  @media (max-width: 700px) { .hero-badge { display: none; } }

  /* SECTIONS */
  section { margin-bottom: 5rem; }
  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--green);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .section-title { font-size: 32px; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
  .section-desc { color: var(--text2); font-size: 15px; line-height: 1.7; margin-bottom: 2rem; }

  /* HOW TO RUN */
  .steps { display: flex; flex-direction: column; gap: 1px; }
  .step {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .step:first-child { border-radius: 12px 12px 0 0; }
  .step:last-child { border-radius: 0 0 12px 12px; }
  .step::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0;
    background: rgba(57,255,133,0.05);
    transition: width 0.4s ease;
  }
  .step:hover::before { width: 100%; }
  .step:hover { border-color: rgba(57,255,133,0.3); }
  .step-num {
    width: 36px; height: 36px;
    border: 1px solid rgba(57,255,133,0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--green);
    flex-shrink: 0;
  }
  .step-text { font-size: 15px; font-weight: 500; }
  .step-sub { font-size: 13px; color: var(--text2); margin-top: 2px; font-weight: 400; }

  /* PAGES GRID */
  .pages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .page-item {
    background: var(--card);
    padding: 1.25rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .page-item::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--green);
    transform: scaleX(0);
    transition: transform 0.3s;
    transform-origin: left;
  }
  .page-item:hover { background: var(--surface); }
  .page-item:hover::after { transform: scaleX(1); }
  .page-icon { font-size: 22px; margin-bottom: 8px; }
  .page-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .page-desc { font-size: 12px; color: var(--text2); line-height: 1.5; }

  /* TARGETS TABLE */
  .targets { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .target-item {
    background: var(--card);
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;
  }
  .target-item:hover { background: var(--surface); }
  .target-name { font-size: 13px; color: var(--text2); font-weight: 500; }
  .target-val { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: var(--green); }
  @media (max-width: 500px) { .targets { grid-template-columns: 1fr; } }

  /* PHASE TIMELINE */
  .timeline { position: relative; padding-left: 2rem; }
  .timeline::before {
    content: '';
    position: absolute;
    left: 7px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--green), var(--purple), var(--amber), transparent);
  }
  .timeline-item {
    position: relative;
    margin-bottom: 2rem;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.5s ease;
  }
  .timeline-item.visible { opacity: 1; transform: translateX(0); }
  .timeline-dot {
    position: absolute;
    left: -2rem;
    top: 6px;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid var(--bg);
  }
  .timeline-phase {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 4px;
  }
  .timeline-title { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .timeline-income { font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
  .timeline-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }

  /* RULES */
  .rules { display: flex; flex-direction: column; gap: 1rem; }
  .rule {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    transition: all 0.3s;
    cursor: none;
  }
  .rule:hover { border-color: rgba(57,255,133,0.3); transform: translateX(6px); }
  .rule-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--green);
    font-weight: 700;
    padding-top: 2px;
    flex-shrink: 0;
  }
  .rule-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .rule-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }

  /* BOOKS GRID */
  .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .book {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .book::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .book:hover { border-color: rgba(57,255,133,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
  .book-n {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text3);
    margin-bottom: 6px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  .book-t { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .book-a { font-size: 11px; color: var(--text2); margin-bottom: 8px; }
  .book-w { font-size: 12px; color: var(--text2); line-height: 1.4; font-style: italic; }

  /* LINKS */
  .links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
  .link-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
    color: var(--text);
    text-decoration: none;
    cursor: none;
  }
  .link-item:hover { border-color: var(--green); color: var(--green); background: rgba(57,255,133,0.05); }
  .link-arrow { color: var(--text3); font-size: 10px; transition: all 0.2s; }
  .link-item:hover .link-arrow { color: var(--green); transform: translate(2px, -2px); }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding-top: 3rem;
    text-align: center;
  }
  .footer-big { font-size: clamp(32px, 6vw, 56px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
  .footer-big .green { color: var(--green); text-shadow: var(--glow2); }
  .footer-sub { color: var(--text2); font-size: 14px; line-height: 1.7; max-width: 480px; margin: 0 auto 2rem; }
  .footer-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text3);
    letter-spacing: 0.1em;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* MONO TEXT */
  code {
    font-family: 'JetBrains Mono', monospace;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--green);
  }

  /* API SECTION */
  .api-steps { display: flex; flex-direction: column; gap: 8px; }
  .api-step {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
  }
  .api-step-n {
    width: 24px; height: 24px;
    background: rgba(57,255,133,0.1);
    border: 1px solid rgba(57,255,133,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--green);
    flex-shrink: 0;
  }

  /* NAV */
  .topnav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(20px);
    background: rgba(6,6,8,0.8);
    border-bottom: 1px solid rgba(57,255,133,0.08);
  }
  .nav-logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--green);
    letter-spacing: 0.1em;
  }
  .nav-links { display: flex; gap: 1.5rem; }
  .nav-link {
    font-size: 12px;
    color: var(--text2);
    cursor: none;
    transition: color 0.2s;
    text-decoration: none;
    letter-spacing: 0.05em;
  }
  .nav-link:hover { color: var(--green); }
  @media (max-width: 600px) { .nav-links { display: none; } }

  /* BLINK */
  .blink { animation: pulse 1.5s infinite; }
</style>
</head>
<body>

<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>

<!-- NAV -->
<nav class="topnav">
  <div class="nav-logo">⚡ GLOW UP OS</div>
  <div class="nav-links">
    <a class="nav-link" href="#run">How to Run</a>
    <a class="nav-link" href="#pages">Features</a>
    <a class="nav-link" href="#ai">AI Setup</a>
    <a class="nav-link" href="#roadmap">Roadmap</a>
  </div>
</nav>

<div class="wrapper" style="padding-top: 60px;">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-tag">Personal Transformation OS</div>
    <h1 class="hero-title">GLOW<br><span class="green">UP OS</span></h1>
    <p class="hero-sub">
      Your complete transformation dashboard. Track <em>gym, nutrition, hacking, reading, money, mind</em> — all offline, no account, no ads. Just you and the mission.
    </p>
    <div class="hero-actions">
      <button class="btn-glow" onclick="document.getElementById('run').scrollIntoView({behavior:'smooth'})">How to Run →</button>
      <button class="btn-outline" onclick="document.getElementById('ai').scrollIntoView({behavior:'smooth'})">AI Setup (Free)</button>
    </div>
    <div class="hero-badge"><div class="badge-inner">⚡</div></div>
  </section>

  <!-- HOW TO RUN -->
  <section id="run" class="reveal">
    <div class="section-label">Getting Started</div>
    <h2 class="section-title">Run in 3 steps</h2>
    <p class="section-desc">No installation. No server. No account. Just a browser.</p>
    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div>
          <div class="step-text">Download & Extract the ZIP</div>
          <div class="step-sub">Extract anywhere — Desktop is fine</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div>
          <div class="step-text">Open the <code>glowup</code> folder</div>
          <div class="step-sub">Find <code>index.html</code> inside</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div>
          <div class="step-text">Double-click <code>index.html</code></div>
          <div class="step-sub">Opens in Chrome or Firefox — done. Your data saves automatically.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- PAGES -->
  <section id="pages" class="reveal">
    <div class="section-label">Features</div>
    <h2 class="section-title">11 pages, one mission</h2>
    <p class="section-desc">Everything you need to track your complete transformation — nothing you don't.</p>
    <div class="pages-grid">
      <div class="page-item"><div class="page-icon">🏠</div><div class="page-name">Dashboard</div><div class="page-desc">Live clock, completion ring, quick stats, daily quote</div></div>
      <div class="page-item"><div class="page-icon">📅</div><div class="page-name">Daily Tracker</div><div class="page-desc">30 habits with checkboxes + sliders — Notion-style</div></div>
      <div class="page-item"><div class="page-icon">🥗</div><div class="page-name">Nutrition</div><div class="page-desc">Macro sliders (cal, protein, carbs, fats, water) + meal log</div></div>
      <div class="page-item"><div class="page-icon">💪</div><div class="page-name">Gym & Physical</div><div class="page-desc">PPL log, calisthenics 4 levels, boxing curriculum, skin + height</div></div>
      <div class="page-item"><div class="page-icon">💻</div><div class="page-name">Hacking Progress</div><div class="page-desc">Linux → Python → Networking → TryHackMe — full checklists</div></div>
      <div class="page-item"><div class="page-icon">📚</div><div class="page-name">Reading</div><div class="page-desc">10 books, page tracking, star ratings, notes per book</div></div>
      <div class="page-item"><div class="page-icon">🧠</div><div class="page-name">Mind & IQ</div><div class="page-desc">Chess ELO tracker, 15 mental models, communication curriculum</div></div>
      <div class="page-item"><div class="page-icon">💰</div><div class="page-name">Money</div><div class="page-desc">Income log, Phase 1 & 2 money checklists, targets</div></div>
      <div class="page-item"><div class="page-icon">🤖</div><div class="page-name">AI Session</div><div class="page-desc">30-min daily coaching with free Groq AI — past sessions saved</div></div>
      <div class="page-item"><div class="page-icon">📊</div><div class="page-name">Stats</div><div class="page-desc">4 live charts — habits, calories, water, sleep</div></div>
      <div class="page-item"><div class="page-icon">⚙️</div><div class="page-name">Settings</div><div class="page-desc">Edit profile, targets, export/import all data</div></div>
    </div>
  </section>

  <!-- TARGETS -->
  <section class="reveal">
    <div class="section-label">Your Numbers</div>
    <h2 class="section-title">Daily targets</h2>
    <p class="section-desc">All editable in Settings. These are your Phase 1 defaults.</p>
    <div class="targets">
      <div class="target-item"><span class="target-name">Calories</span><span class="target-val">2500 kcal</span></div>
      <div class="target-item"><span class="target-name">Protein</span><span class="target-val">275g</span></div>
      <div class="target-item"><span class="target-name">Carbs</span><span class="target-val">325g</span></div>
      <div class="target-item"><span class="target-name">Fats</span><span class="target-val">70g</span></div>
      <div class="target-item"><span class="target-name">Water</span><span class="target-val">4.5L</span></div>
      <div class="target-item"><span class="target-name">Sleep</span><span class="target-val">8.5 hrs</span></div>
      <div class="target-item"><span class="target-name">Steps</span><span class="target-val">10,000</span></div>
      <div class="target-item"><span class="target-name">Gym</span><span class="target-val">6 days/week</span></div>
      <div class="target-item"><span class="target-name">Hacking study</span><span class="target-val">2 hrs/day</span></div>
      <div class="target-item"><span class="target-name">Reading</span><span class="target-val">10 pages/day</span></div>
    </div>
  </section>

  <!-- AI SETUP -->
  <section id="ai" class="reveal">
    <div class="section-label">AI Daily Session</div>
    <h2 class="section-title">Free AI coach setup</h2>
    <p class="section-desc">Uses Groq API — completely free, fast. Your personal coach who knows your exact goals, profile, and phase. 30 minutes every day.</p>
    <div class="api-steps">
      <div class="api-step"><div class="api-step-n">1</div><span>Go to <code>console.groq.com</code></span></div>
      <div class="api-step"><div class="api-step-n">2</div><span>Sign up with Google or email (free)</span></div>
      <div class="api-step"><div class="api-step-n">3</div><span>Click <code>API Keys</code> → <code>Create API Key</code></span></div>
      <div class="api-step"><div class="api-step-n">4</div><span>Copy the key — starts with <code>gsk_...</code></span></div>
      <div class="api-step"><div class="api-step-n">5</div><span>Open app → <strong>AI Session</strong> page → paste key → Save</span></div>
      <div class="api-step"><div class="api-step-n">6</div><span><span class="blink" style="color:var(--green);">●</span> &nbsp;Done. Your AI coach is live.</span></div>
    </div>
  </section>

  <!-- ROADMAP -->
  <section id="roadmap" class="reveal">
    <div class="section-label">4-Year Blueprint</div>
    <h2 class="section-title">Zero to extraordinary</h2>
    <p class="section-desc">Four phases. One direction. No detours.</p>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-dot" style="background:var(--green)"></div>
        <div class="timeline-phase">Phase 1 · Age 19 · Month 1-6</div>
        <div class="timeline-title">Foundation</div>
        <div class="timeline-income" style="background:rgba(57,255,133,0.1);color:var(--green);">₹0 → ₹5k/month</div>
        <div class="timeline-desc">Linux + Python basics, TryHackMe 50 rooms, Atomic Habits, Fiverr start, boxing fundamentals, 50→55kg body weight</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot" style="background:var(--blue)"></div>
        <div class="timeline-phase">Phase 2 · Age 19-20 · Month 7-12</div>
        <div class="timeline-title">Skill Building</div>
        <div class="timeline-income" style="background:rgba(77,166,255,0.1);color:var(--blue);">₹5k → ₹30k/month</div>
        <div class="timeline-desc">Web hacking OWASP, Burp Suite, HackTheBox, first bug bounty payout, MMA gym, 60kg, Python intermediate</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot" style="background:var(--purple)"></div>
        <div class="timeline-phase">Phase 3 · Age 20-21 · Year 2</div>
        <div class="timeline-title">Monetisation</div>
        <div class="timeline-income" style="background:rgba(181,122,255,0.1);color:var(--purple);">₹30k → ₹2L/month</div>
        <div class="timeline-desc">CEH certification, freelance pentesting clients, cybersecurity agency, trading, 68kg physical peak</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot" style="background:var(--amber)"></div>
        <div class="timeline-phase">Phase 4 · Age 22-23 · Year 3-4</div>
        <div class="timeline-title">Domination 🏎️</div>
        <div class="timeline-income" style="background:rgba(255,204,68,0.1);color:var(--amber);">₹2L → ₹10L+/month</div>
        <div class="timeline-desc">OSCP certified, own firm, red team ops, 70kg+ peak, dream car. The lambo phase.</div>
      </div>
    </div>
  </section>

  <!-- RULES -->
  <section class="reveal">
    <div class="section-label">Non-Negotiables</div>
    <h2 class="section-title">Break these and you fail</h2>
    <div class="rules">
      <div class="rule"><div class="rule-num">01</div><div><div class="rule-title">Never miss gym twice</div><div class="rule-desc">One missed day is life. Two in a row means the habit is broken. No exceptions after day 2.</div></div></div>
      <div class="rule"><div class="rule-num">02</div><div><div class="rule-title">2 hours of hacking is sacred</div><div class="rule-desc">3pm–5pm — phone silent, no interruptions. This block compounds into extraordinary skill.</div></div></div>
      <div class="rule"><div class="rule-num">03</div><div><div class="rule-title">Track everything</div><div class="rule-desc">What gets measured gets managed. If it's not in the app, it didn't happen.</div></div></div>
      <div class="rule"><div class="rule-num">04</div><div><div class="rule-title">Build in silence</div><div class="rule-desc">Don't post about your grind. The most dangerous people in the room are the ones nobody saw coming.</div></div></div>
      <div class="rule"><div class="rule-num">05</div><div><div class="rule-title">Sunday review — no skipping</div><div class="rule-desc">Every Sunday: rate each domain 1-10, write what went wrong, plan next week. This is how you compound growth.</div></div></div>
      <div class="rule"><div class="rule-num">06</div><div><div class="rule-title">Hard things first</div><div class="rule-desc">Gym before phone. Study before entertainment. The hard thing done first makes everything else feel easy.</div></div></div>
    </div>
  </section>

  <!-- BOOKS -->
  <section class="reveal">
    <div class="section-label">Phase 1 Reading</div>
    <h2 class="section-title">10 books, 6 months</h2>
    <p class="section-desc">10 pages/day = 1 book every 2-3 weeks. Read in this order.</p>
    <div class="books-grid">
      <div class="book" style="--c:var(--green)"><div class="book::before" style="background:var(--green)"></div><div class="book-n">01 — START HERE</div><div class="book-t">Atomic Habits</div><div class="book-a">James Clear</div><div class="book-w">Everything in this plan depends on habits.</div></div>
      <div class="book"><div class="book-n">02 — STRATEGY</div><div class="book-t">48 Laws of Power</div><div class="book-a">Robert Greene</div><div class="book-w">Understand how power actually works.</div></div>
      <div class="book"><div class="book-n">03 — COMMUNICATION</div><div class="book-t">How to Win Friends</div><div class="book-a">Dale Carnegie</div><div class="book-w">Make people like you. Essential weapon.</div></div>
      <div class="book"><div class="book-n">04 — IQ</div><div class="book-t">Thinking Fast & Slow</div><div class="book-a">Daniel Kahneman</div><div class="book-w">Think better than 99% of people.</div></div>
      <div class="book"><div class="book-n">05 — FOCUS</div><div class="book-t">Deep Work</div><div class="book-a">Cal Newport</div><div class="book-w">Monk-level focus for 2-hour study blocks.</div></div>
      <div class="book"><div class="book-n">06 — MONEY</div><div class="book-t">Rich Dad Poor Dad</div><div class="book-a">Robert Kiyosaki</div><div class="book-w">Assets vs liabilities. Mindset reset.</div></div>
      <div class="book"><div class="book-n">07 — PSYCHOLOGY</div><div class="book-t">Influence</div><div class="book-a">Robert Cialdini</div><div class="book-w">6 principles of persuasion. Use everywhere.</div></div>
      <div class="book"><div class="book-n">08 — STRATEGY</div><div class="book-t">Art of War</div><div class="book-a">Sun Tzu</div><div class="book-w">68 pages. 2500-year old edge. Read it twice.</div></div>
      <div class="book"><div class="book-n">09 — NEGOTIATION</div><div class="book-t">Never Split the Diff</div><div class="book-a">Chris Voss</div><div class="book-w">FBI negotiator on getting what you want.</div></div>
      <div class="book"><div class="book-n">10 — BIG PICTURE</div><div class="book-t">Sapiens</div><div class="book-a">Yuval Harari</div><div class="book-w">Ayanokoji-level macro thinking.</div></div>
    </div>
  </section>

  <!-- LINKS -->
  <section class="reveal">
    <div class="section-label">Resources</div>
    <h2 class="section-title">Everything you need</h2>
    <div class="links-grid">
      <a class="link-item" href="https://tryhackme.com" target="_blank">TryHackMe <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://hackthebox.com" target="_blank">HackTheBox <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://portswigger.net/web-security" target="_blank">PortSwigger <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://picoctf.org" target="_blank">picoCTF <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://overthewire.org" target="_blank">OverTheWire <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://zerodha.com/varsity" target="_blank">Zerodha Varsity <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://chess.com" target="_blank">Chess.com <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://console.groq.com" target="_blank">Groq API (Free) <span class="link-arrow">↗</span></a>
      <a class="link-item" href="https://fiverr.com" target="_blank">Fiverr <span class="link-arrow">↗</span></a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer reveal">
    <div class="footer-big">Day 1 starts<br>when you open<br><span class="green">index.html</span></div>
    <p class="footer-sub">Day 1461 is when the lambo arrives. Everything in between is just showing up. Every single day. No excuses.</p>
    <div class="footer-meta">GLOW UP OS v1.0 &nbsp;·&nbsp; Built May 2026 &nbsp;·&nbsp; Pune &nbsp;·&nbsp; Phase 1 of 4</div>
  </footer>

</div>

<script>
  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,.rule,.page-item,.step,.book').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; ring.style.borderColor = 'rgba(57,255,133,0.6)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(57,255,133,0.4)'; });
  });

  // SCROLL REVEAL
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

  // STAGGER REVEALS
  document.querySelectorAll('.step, .page-item, .book, .link-item, .api-step, .rule, .target-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.05) + 's';
  });
</script>
</body>
</html>