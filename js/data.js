// ── DATA.JS — Constants, Storage, Defaults ──

const QUOTES = [
  "The person who works hardest in secret wins loudest in public.",
  "Discipline is choosing what you want most over what you want now.",
  "The silent ones are always the most dangerous.",
  "Your future self is watching you right now through memories.",
  "Work in silence. Let the lambo make the noise.",
  "Every TryHackMe room is a brick in your empire.",
  "Consistency beats intensity. Show up every single day.",
  "You are not behind. You are exactly where you need to be.",
  "Ayanokoji didn't become sharp by being comfortable.",
  "Your competitors are scrolling. You are building.",
  "Pain is temporary. The person you become is permanent.",
  "What you do when no one is watching defines who you are.",
  "Eat, train, hack, read, sleep, repeat.",
  "Your 23-year-old self is counting on your 19-year-old discipline.",
  "Extraordinary people do ordinary things extraordinarily consistently.",
  "Hard things done daily become easy things done automatically.",
  "Knowledge without execution is just entertainment.",
  "Don't wish it were easier. Wish you were better.",
  "The grind you hate today is the story you'll tell later.",
  "Start before you're ready. Improve as you go.",
];

const HABITS = [
  {
    section: "🌅 Morning Routine",
    items: [
      { id: "wake_early", label: "Wake up before 6am" },
      { id: "cold_shower", label: "Cold shower (2+ mins)" },
      { id: "brush", label: "Brush teeth" },
      { id: "face_wash_am", label: "Face wash + sunscreen" },
      { id: "water_am", label: "Drink 500ml water immediately" },
      { id: "journal_am", label: "Morning journal — 3 intentions" },
    ]
  },
  {
    section: "💪 Physical",
    items: [
      { id: "gym", label: "Gym session done", hasSlider: true, sliderMin: 0, sliderMax: 180, sliderUnit: "min", sliderKey: "gym_duration" },
      { id: "calisthenics", label: "Calisthenics (push-ups, pull-ups, dips)" },
      { id: "boxing", label: "Shadowboxing / boxing (3 rounds)" },
      { id: "steps", label: "10,000 steps reached", hasSlider: true, sliderMin: 0, sliderMax: 20000, sliderStep: 500, sliderUnit: "steps", sliderKey: "steps_count" },
      { id: "stretch", label: "Stretching / mobility (10 mins)" },
    ]
  },
  {
    section: "🥗 Nutrition",
    items: [
      { id: "breakfast", label: "Breakfast eaten" },
      { id: "lunch", label: "Lunch eaten" },
      { id: "dinner", label: "Dinner eaten" },
      { id: "no_junk", label: "No junk food today" },
      { id: "creatine", label: "Creatine / protein shake taken" },
    ]
  },
  {
    section: "💻 Skills",
    items: [
      { id: "hacking_study", label: "Hacking / coding study (2+ hours)" },
      { id: "thm_room", label: "TryHackMe room completed" },
      { id: "reading", label: "Read 10+ pages" },
      { id: "chess", label: "Chess game played" },
      { id: "logic_puzzle", label: "Logic puzzle solved" },
    ]
  },
  {
    section: "✨ Skin & Grooming",
    items: [
      { id: "skincare_am", label: "Morning skincare (wash + serum + SPF)" },
      { id: "skincare_pm", label: "Night skincare (wash + niacinamide)" },
      { id: "face_massage", label: "Face massage / gua sha (5 mins)" },
    ]
  },
  {
    section: "🌙 Evening",
    items: [
      { id: "mirror_practice", label: "Mirror practice / communication drill" },
      { id: "journal_pm", label: "Evening journal + day rating" },
      { id: "prep_tomorrow", label: "Prep tomorrow (clothes, plan)" },
      { id: "no_phone_late", label: "No phone after 10pm" },
      { id: "sleep_by_11", label: "Sleep by 11pm" },
      { id: "sleep_hrs", label: "Slept 8+ hours", hasSlider: true, sliderMin: 0, sliderMax: 12, sliderStep: 0.5, sliderUnit: "hrs", sliderKey: "sleep_hours" },
    ]
  }
];

const BOOKS = [
  { id: "atomic", num: 1, title: "Atomic Habits", author: "James Clear", pages: 320, why: "Build any system. Everything starts here." },
  { id: "48laws", num: 2, title: "48 Laws of Power", author: "Robert Greene", pages: 480, why: "Understand power and strategy." },
  { id: "friends", num: 3, title: "How to Win Friends", author: "Dale Carnegie", pages: 288, why: "Make people like you. Communication weapon." },
  { id: "thinking", num: 4, title: "Thinking Fast and Slow", author: "Daniel Kahneman", pages: 499, why: "Understand your brain. Think better than 99%." },
  { id: "deepwork", num: 5, title: "Deep Work", author: "Cal Newport", pages: 296, why: "2-hour focus blocks need monk-level concentration." },
  { id: "richdad", num: 6, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", pages: 336, why: "Money mindset reset. Assets vs liabilities." },
  { id: "influence", num: 7, title: "Influence", author: "Robert Cialdini", pages: 320, why: "6 principles of persuasion. Business + life." },
  { id: "artofwar", num: 8, title: "Art of War", author: "Sun Tzu", pages: 68, why: "2500-year strategy. Read it twice." },
  { id: "neversplit", num: 9, title: "Never Split the Difference", author: "Chris Voss", pages: 288, why: "FBI negotiator teaches you to get what you want." },
  { id: "sapiens", num: 10, title: "Sapiens", author: "Yuval Harari", pages: 443, why: "Ayanokoji-level macro thinking." },
];

const HACK_CHECKLISTS = [
  {
    title: "Linux Mastery",
    color: "var(--green)",
    items: [
      "Ubuntu installed and running",
      "50+ terminal commands practiced (ls, cd, chmod, grep, find...)",
      "File permissions mastered (chmod, chown, umask)",
      "User management (adduser, su, sudo, /etc/passwd)",
      "Process management (ps, kill, top, htop)",
      "Networking commands (ping, ifconfig, netstat, curl, wget, ssh)",
      "Package management (apt, pip, git clone)",
      "Bash scripting: variables, loops, functions, conditionals",
      "OverTheWire: Bandit Level 0-10 completed",
    ]
  },
  {
    title: "Python for Hackers",
    color: "var(--blue)",
    items: [
      "Variables, data types, type conversion",
      "User input and print formatting",
      "If/else, for loops, while loops",
      "Functions (def, return, parameters)",
      "Lists, dictionaries, tuples, sets",
      "File handling (open, read, write, append)",
      "Error handling (try/except)",
      "Modules and pip installs",
      "socket library — port scanner built ✓",
      "requests library — web page fetcher built ✓",
      "Project 1: Password Generator completed",
      "Project 2: Port Scanner completed",
      "Project 3: Contact Book completed",
      "Project 4: Web page fetcher completed",
      "All projects on GitHub",
    ]
  },
  {
    title: "Networking Fundamentals",
    color: "var(--purple)",
    items: [
      "OSI model — all 7 layers understood",
      "TCP vs UDP — difference and use cases",
      "HTTP vs HTTPS — how SSL/TLS works",
      "DNS — how domain resolution works",
      "Common ports memorized (21, 22, 23, 25, 53, 80, 443, 3389)",
      "IP addressing and subnetting basics",
      "Wireshark — first packet captured and analyzed",
      "Nmap — scanned localhost successfully",
    ]
  },
  {
    title: "TryHackMe Progress",
    color: "var(--amber)",
    items: [
      "TryHackMe account created",
      "Pre-Security path — 100% complete",
      "Complete Beginner path — 100% complete",
      "Web Fundamentals path — started",
      "Jr Penetration Tester path — started",
      "First CTF on picoCTF completed",
      "TryHackMe top 5% ranking achieved",
    ]
  },
  {
    title: "Tools Setup",
    color: "var(--red)",
    items: [
      "Kali Linux installed (VM or dual boot)",
      "Burp Suite Community — installed and configured",
      "Nmap — installed and working",
      "Metasploitable2 home lab running",
      "DVWA running locally",
      "GitHub account created",
      "VS Code installed with Python extension",
    ]
  },
];

const MENTAL_MODELS = [
  { id: "first_principles", title: "First Principles Thinking", desc: "Break any problem down to its fundamental truths, then rebuild from scratch. Elon Musk uses this for everything." },
  { id: "inversion", title: "Inversion", desc: "Instead of thinking about how to succeed, think about how to fail — then avoid those things. Charlie Munger's favourite." },
  { id: "occams", title: "Occam's Razor", desc: "The simplest explanation is usually correct. Don't overcomplicate things." },
  { id: "pareto", title: "Pareto Principle (80/20)", desc: "80% of your results come from 20% of your actions. Identify and focus on the high-leverage 20%." },
  { id: "compounding", title: "Compounding", desc: "Small consistent gains stack exponentially. 1% better every day = 37x better in a year." },
  { id: "opportunity_cost", title: "Opportunity Cost", desc: "Every choice you make eliminates all other alternatives. What are you giving up by choosing this?" },
  { id: "confirmation_bias", title: "Confirmation Bias", desc: "You find what you look for. Actively seek evidence that contradicts your beliefs." },
  { id: "dunning_kruger", title: "Dunning-Kruger Effect", desc: "The less you know, the more confident you feel. True experts know how much they don't know." },
  { id: "survivorship", title: "Survivorship Bias", desc: "You only see the winners, not the thousands who failed. Beware of success stories without context." },
  { id: "second_order", title: "Second-Order Thinking", desc: "Ask: what happens next? And then what? Most people only think one step ahead." },
  { id: "circle_competence", title: "Circle of Competence", desc: "Know your edges. Operate within what you truly understand. Expand it deliberately." },
  { id: "sunk_cost", title: "Sunk Cost Fallacy", desc: "Past investment doesn't justify future loss. If it's wrong, cut it regardless of what you already spent." },
  { id: "hanlon", title: "Hanlon's Razor", desc: "Don't attribute to malice what can be explained by stupidity or ignorance." },
  { id: "skin_game", title: "Skin in the Game", desc: "Never take advice from someone who doesn't bear the consequences of being wrong." },
  { id: "map_territory", title: "Map vs Territory", desc: "The map is not the territory. Models and theories are simplifications — reality is always more complex." },
];

const COMMUNICATION_CURRICULUM = [
  {
    title: "Month 1 — Foundation",
    items: [
      "Mirror practice daily — 10 mins, eliminate 'umm' and 'like'",
      "Record yourself speaking — listen back weekly",
      "Introduce yourself to 1 new person every week",
      "Watch 5 Huberman/Lex Fridman podcasts for speaking style",
      "Start reading 'How to Win Friends and Influence People'",
    ]
  },
  {
    title: "Month 2 — Storytelling",
    items: [
      "Tell a 2-min story about your day (no filler words)",
      "Practice STAR method: Situation, Task, Action, Result",
      "Eye contact drill — 3-5 seconds, natural not creepy",
      "Speak 20% slower than feels natural",
      "Specifically compliment 3 people per week",
    ]
  },
  {
    title: "Month 3 — Confidence",
    items: [
      "Join college debate club or public speaking group",
      "Give first public speech (class presentation counts)",
      "Cold approach: talk to a stranger in a new place",
      "Voice modulation practice — loud/soft, fast/slow",
      "Study body language: 'What Every Body is Saying' — Joe Navarro",
    ]
  },
  {
    title: "Month 4-6 — Advanced",
    items: [
      "Apply negotiation tactics from 'Never Split the Difference'",
      "Handle a real disagreement calmly and constructively",
      "Speak confidently in front of 10+ people",
      "Initiate conversation with someone you genuinely admire",
      "Teach someone else a concept you recently learned",
    ]
  },
];

const MONEY_CHECKLISTS = [
  {
    title: "Phase 1 — First Income",
    color: "var(--amber)",
    items: [
      "Fiverr account created with professional photo",
      "First gig live: Basic Python scripting and automation",
      "Second gig: Data entry and web research",
      "Gig descriptions optimized with relevant keywords",
      "First order received 🎉",
      "First ₹1,000 earned online ⭐",
      "Zerodha account created",
      "Zerodha Varsity Module 1 complete",
      "Zerodha Varsity Module 2 complete",
      "Paper trading started (no real money yet)",
      "First SIP ₹500/month started (index fund)",
      "GitHub portfolio with 3+ projects",
      "LinkedIn profile created professionally",
    ]
  },
  {
    title: "Phase 2 — Bug Bounty & Freelance",
    color: "var(--green)",
    items: [
      "HackerOne account created",
      "First bug bounty program scope analyzed",
      "First vulnerability found and reported",
      "First bug bounty payout received 💰",
      "First freelance cybersecurity audit client",
      "First ₹10,000 month achieved ⭐",
      "Technical analysis basics learned",
      "First real trade executed (small amount)",
    ]
  },
];

const BOXING_CURRICULUM = [
  {
    title: "Month 1-2 — Foundation",
    items: [
      "Fighting stance (orthodox) — correct form held",
      "Footwork basics — forward, back, left, right",
      "Jab (1) — snap, retract, keep guard up",
      "Cross (2) — hip rotation, drive through",
      "1-2 combo fluent at speed",
      "3 rounds shadowboxing daily",
      "Basic head movement: slip left, slip right",
      "Watched 20 FightTips YouTube videos",
    ]
  },
  {
    title: "Month 3-4 — Combinations",
    items: [
      "Lead hook (3) — compact, shoulder protection",
      "Uppercut (4) — inside fighting tool",
      "1-2-3 combo clean",
      "1-2-3-4 combo clean",
      "Body shots (liver punch) practiced",
      "Partner pad work started",
      "Heavy bag work 3x/week",
    ]
  },
  {
    title: "Month 5-6 — Sparring Ready",
    items: [
      "Joined boxing gym in Pune",
      "Conditioning: 6 rounds skip rope + 6 rounds bag",
      "Distance management understood",
      "Counter-punching basics drilled",
      "First sparring session completed ⭐",
      "Combination defense practiced",
    ]
  },
  {
    title: "Phase 2+ — MMA & Self Defence",
    items: [
      "MMA gym joined in Pune",
      "Wrestling basics: takedown and sprawl",
      "BJJ basics: guard, mount, back control",
      "Muay Thai: elbows, knees, clinch",
      "Krav Maga self-defence seminar attended",
      "First MMA sparring session",
      "Competed in local amateur event",
    ]
  },
];

const CALISTHENICS_LEVELS = [
  {
    level: "Level 1 — Beginner",
    color: "var(--green)",
    items: [
      "3 x 20 push-ups (no rest between reps)",
      "3 x 5 strict pull-ups",
      "3 x 15 dips",
      "30s dead hang",
      "3 x 15 diamond push-ups",
      "30s hollow body hold",
      "3 x 10 pike push-ups",
      "Wall handstand hold 30s",
    ]
  },
  {
    level: "Level 2 — Intermediate",
    color: "var(--blue)",
    items: [
      "3 x 30 push-ups",
      "3 x 10 strict pull-ups",
      "3 x 25 dips",
      "60s dead hang",
      "5 archer push-ups each side",
      "3 x 10 dragon flags",
      "Freestanding handstand hold 5s",
      "L-sit hold 10s",
    ]
  },
  {
    level: "Level 3 — Advanced",
    color: "var(--purple)",
    items: [
      "3 x 15 one-arm push-up progressions",
      "3 x 15 weighted pull-ups (+10kg)",
      "Muscle-up (full clean rep) ⭐",
      "30s L-sit hold",
      "Handstand push-up (wall assisted)",
      "Front lever tuck hold 10s",
      "Back lever hold 10s",
    ]
  },
  {
    level: "Level 4 — Elite",
    color: "var(--amber)",
    items: [
      "One-arm pull-up progression",
      "Planche lean 30s",
      "Full front lever 5s",
      "Freestanding handstand push-ups",
      "Planche push-up",
    ]
  },
];

const SKIN_CHECKLIST = [
  {
    title: "Daily Skincare Routine",
    items: [
      "Morning: Gentle face wash",
      "Morning: Vitamin C serum (brightening)",
      "Morning: Moisturizer",
      "Morning: SPF 50 sunscreen (non-negotiable)",
      "Night: Gentle face wash",
      "Night: Niacinamide 10% serum",
      "Night: Moisturizer",
      "Night: Face massage / gua sha 5 mins",
    ]
  },
  {
    title: "Products to Get",
    items: [
      "Gentle face wash (CeraVe / Minimalist) — bought",
      "Vitamin C serum (Minimalist 10%) — bought",
      "Niacinamide 10% serum (Minimalist) — bought",
      "SPF 50 sunscreen (SunScoop / Neutrogena) — bought",
      "Basic moisturizer — bought",
      "Gua sha tool or jade roller — bought",
      "Lip balm — bought",
    ]
  },
  {
    title: "Height & Posture Protocol",
    items: [
      "Sleeping 8-9 hrs (growth hormone peaks in deep sleep)",
      "Dead hang 3 x 30s daily (spine decompression)",
      "Cat-cow stretch 2 mins daily",
      "Chest opener stretch daily",
      "Hip flexor stretch daily (counters sitting)",
      "Chin tucks 3 x 10 (fixes forward head posture)",
      "Calcium + Vitamin D in daily diet",
    ]
  },
];

// ── STORAGE HELPERS ──
function todayKey() {
  return new Date().toISOString().split('T')[0];
}

function save(key, val) {
  try { localStorage.setItem('gu_' + key, JSON.stringify(val)); } catch(e) {}
}

function load(key, def = null) {
  try {
    const v = localStorage.getItem('gu_' + key);
    return v !== null ? JSON.parse(v) : def;
  } catch(e) { return def; }
}

function saveToday(subkey, val) { save('daily_' + todayKey() + '_' + subkey, val); }
function loadToday(subkey, def = null) { return load('daily_' + todayKey() + '_' + subkey, def); }

function getProfile() {
  return load('profile', {
    name: 'User', age: 19, height: "5'6\"", weight: 50,
    calTarget: 2500, protTarget: 275, waterTarget: 4.5,
    sleepTarget: 8.5, stepsTarget: 10000,
    startDate: todayKey()
  });
}

function getStreak() {
  // Count consecutive days with saved tracker data
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const data = load('daily_' + key + '_habits', null);
    if (data && Object.values(data).some(v => v === true)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function getDayNumber() {
  const profile = getProfile();
  const start = new Date(profile.startDate || todayKey());
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}
