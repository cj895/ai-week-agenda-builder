import { useState, useEffect, useRef } from "react";

const BRAND = { prussian: "#001324", azure: "#0084FF", aqua: "#00FFD9", spectrum: "#0047FF" };

const DAYS = [
  { id: "2026-04-20", label: "Day 1", subtitle: "Community Day", short: "Apr 20" },
  { id: "2026-04-21", label: "Day 2", subtitle: "Are We Ready?", short: "Apr 21" },
  { id: "2026-04-22", label: "Day 3", subtitle: "How Do We Implement?", short: "Apr 22" },
];

const TRACKS = [
  { id: "startup-showcase", name: "Startup Showcase", bg: "#00C2FF", fg: "#001324" },
  { id: "networking", name: "Community Networking", bg: "#00E0B8", fg: "#001324" },
  { id: "ai-strategy", name: "AI Strategy & Use Cases", bg: "#0084FF", fg: "#FFFFFF" },
  { id: "ai-adoption", name: "AI Adoption & Change Management", bg: "#5B8CFF", fg: "#FFFFFF" },
  { id: "data-infra", name: "Data Readiness & Infrastructure", bg: "#7A5CFF", fg: "#FFFFFF" },
  { id: "architecture", name: "Architecture, Models & Technical Stack", bg: "#4B3BFF", fg: "#FFFFFF" },
  { id: "ai-in-action", name: "AI in Action", bg: "#006DFF", fg: "#FFFFFF" },
  { id: "exec-governance", name: "Executive Governance & Organizational Alignment", bg: "#1F3A5F", fg: "#FFFFFF" },
  { id: "ai-security", name: "AI Security, Risk & Compliance", bg: "#003B8E", fg: "#FFFFFF" },
  { id: "marketing-ops", name: "AI for Marketing, Operations & Productivity", bg: "#00A3A3", fg: "#001324" },
];

const LOCATIONS = [
  "ATV Main Stage", "ATV Lennox Boardroom", "ATV Pitch Practice Room",
  "Roam Buckhead Garage", "Roam Forum", "TechRise Stage",
  "ATV Roundtable Room 1", "ATV Roundtable Room 2", "ATV Community Room",
];

const SESSION_TYPES = [
  "Keynote", "Panel", "Workshop", "Fireside Chat", "Roundtable",
  "Presentation", "Demo", "Startup Pitch", "Networking", "Social Event", "Debate",
];

const TOPIC_TAGS = [
  "AI Strategy", "Use Case Discovery", "ROI", "Change Management", "Adoption",
  "Workforce Readiness", "Data Readiness", "Data Governance", "Data Architecture",
  "Infrastructure", "LLMs", "Agents", "RAG", "Prompt Engineering", "Model Evaluation",
  "AI Security", "Risk Management", "Compliance", "Privacy", "Responsible AI",
  "Executive Governance", "Organizational Alignment", "Implementation",
  "Pilot to Production", "Case Studies", "Business Outcomes", "Automation",
  "Productivity", "Marketing AI", "Operations", "Founders", "Fundraising",
  "Enterprise Sales", "Community Building", "Partnerships",
];

const AUDIENCE_TAGS = [
  "Executive", "Practitioner", "Technical", "Beginner Friendly", "Advanced",
  "Panel", "Workshop", "Roundtable", "Fireside Chat", "Case Study", "Demo",
  "Startup", "Enterprise",
];

const TIMES = [];
for (let h = 7; h <= 20; h++)
  for (let m = 0; m < 60; m += 5)
    TIMES.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);

const uid = () => Math.random().toString(36).slice(2, 10);
const SK = "aiweek-agenda-v3";

const defaultSession = () => ({
  id: uid(), date: DAYS[1].id, startTime: "11:40", endTime: "12:10",
  title: "", trackId: "ai-in-action", sessionType: "Panel",
  location: LOCATIONS[0], topicTags: [], audienceTags: [], speakers: [],
  description: "", status: "publish",
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE PRE-POPULATED AGENDA
// ═══════════════════════════════════════════════════════════════
const s = (date, start, end, type, track, title, loc, topics=[], audience=[], desc="", speakers=[]) => ({
  id: uid(), date, startTime: start, endTime: end, sessionType: type,
  trackId: track, title, location: loc, topicTags: topics, audienceTags: audience,
  description: desc, speakers, status: "publish",
});

const L = { ms: "ATV Main Stage", lx: "ATV Lennox Boardroom", pp: "ATV Pitch Practice Room",
  rb: "Roam Buckhead Garage", rf: "Roam Forum", ts: "TechRise Stage",
  r1: "ATV Roundtable Room 1", r2: "ATV Roundtable Room 2", cr: "ATV Community Room" };

const D1="2026-04-20", D2="2026-04-21", D3="2026-04-22";

const INITIAL_SESSIONS = [
  // ═══ DAY 1 — COMMUNITY DAY ═══
  s(D1,"15:00","15:10","Keynote","startup-showcase","Startup Showcase Welcome",L.cr,["Founders","Community Building"],["Startup","Beginner Friendly"]),
  s(D1,"15:20","15:50","Panel","startup-showcase","How Buyers Evaluate AI and Cyber Vendors",L.cr,["Enterprise Sales","AI Strategy","Use Case Discovery"],["Startup","Enterprise"]),
  s(D1,"16:00","16:30","Startup Pitch","startup-showcase","Startup Pitches — Round 1",L.cr,["Founders","Fundraising","Pilot to Production"],["Startup"]),
  s(D1,"16:40","17:00","Panel","startup-showcase","What Makes a Startup Stand Out and How Pilots Actually Work",L.cr,["Founders","Pilot to Production","Enterprise Sales"],["Startup","Enterprise"]),
  s(D1,"17:00","19:00","Social Event","networking","Atlanta AI Week Community Happy Hour",L.cr,["Community Building","Partnerships"],["Beginner Friendly"]),

  // ═══ DAY 2 — ARE WE READY? ═══
  // Main Stage Morning (all attendees 9:00-11:30)
  s(D2,"08:00","09:00","Networking","networking","Registration & Morning Networking",L.ms,["Community Building"],["Beginner Friendly"]),
  s(D2,"09:00","09:15","Keynote","ai-in-action","Welcome & Opening Remarks",L.ms,["AI Strategy","Community Building"],["Executive","Beginner Friendly"]),
  s(D2,"09:25","09:55","Keynote","ai-in-action","What Happens After the Demo: A Real Look at AI, Process, and Work That Actually Ships",L.ms,
    ["Implementation","Case Studies","Business Outcomes","Pilot to Production"],["Executive","Practitioner"],
    "Stephen Gates pulls back the curtain on how AI is actually being used in real client work at CRZY Design. Real examples from Metallica to industrial startups — practical frameworks to stop experimenting and start building AI into your business."),
  s(D2,"10:05","10:35","Panel","ai-in-action","Inside Big Tech: How AI Actually Gets Built & Deployed",L.ms,
    ["Implementation","Infrastructure","LLMs","Pilot to Production"],["Technical","Enterprise"]),
  s(D2,"10:45","11:20","Fireside Chat","ai-in-action","AI Under Constraints: What Regulated Industries Can Teach Everyone Else",L.ms,
    ["Compliance","Risk Management","Responsible AI"],["Executive","Enterprise"]),

  // Concurrent Slot A: 11:40-12:10
  s(D2,"11:40","12:10","Keynote","ai-in-action","Atlanta's Advantage: Why This City Will Lead AI",L.ms,["AI Strategy","Community Building"],["Executive","Beginner Friendly"]),
  s(D2,"11:40","12:10","Panel","exec-governance","The AI Governance Gap: Why Most Companies Aren't Ready",L.lx,
    ["Executive Governance","Compliance","Organizational Alignment","Risk Management"],["Executive"]),
  s(D2,"11:40","12:10","Fireside Chat","marketing-ops","The AI Conversation Chain: Why Brands Disappear After the First Prompt",L.pp,
    ["Marketing AI","Automation","Use Case Discovery"],["Practitioner"]),
  s(D2,"11:40","12:10","Panel","ai-security","The New Risks Every Organization Needs to Understand",L.rb,
    ["AI Security","Risk Management","Privacy"],["Executive","Technical"]),
  s(D2,"11:40","12:10","Panel","ai-strategy","The Hidden Costs of Bad AI Execution",L.rf,
    ["ROI","AI Strategy","Business Outcomes"],["Executive","Practitioner"]),
  s(D2,"11:40","12:10","Panel","ai-adoption","What Every Workforce Needs to Embed in Their Culture",L.ts,
    ["Change Management","Workforce Readiness","Adoption","Organizational Alignment"],["Executive","Practitioner"]),
  s(D2,"11:40","12:10","Roundtable","architecture","What's in Your AI Stack? How Teams Are Building and Shipping Real Systems",L.r1,
    ["Infrastructure","LLMs","Agents","Data Architecture"],["Technical","Advanced","Roundtable"]),
  s(D2,"11:40","12:10","Roundtable","ai-strategy","Moving from AI Experiments to Real Business Value",L.r2,
    ["ROI","Pilot to Production","Business Outcomes","Implementation"],["Executive","Roundtable"]),

  // Concurrent Slot B: 12:20-12:50
  s(D2,"12:20","12:50","Workshop","ai-security","Deepfakes and the Death of Trust: How AI Is Rewriting Fraud, Reputation, and Corporate Risk",L.ms,
    ["AI Security","Risk Management","Privacy","Responsible AI"],["Executive","Practitioner"]),
  s(D2,"12:20","12:50","Presentation","exec-governance","Tales from the Trenches: The AI Incidents No CEO Wants to Experience",L.lx,
    ["Risk Management","Executive Governance","Case Studies","Compliance"],["Executive","Case Study"]),
  s(D2,"12:20","12:50","Panel","marketing-ops","From Data to Demand: AI Is Changing Customer Acquisition",L.pp,
    ["Marketing AI","Automation","Data Readiness","Business Outcomes"],["Practitioner","Enterprise"]),
  s(D2,"12:20","12:50","Presentation","ai-security","Protecting Data, Models, and Workflows",L.rb,
    ["AI Security","Data Governance","Infrastructure"],["Technical","Enterprise"]),
  s(D2,"12:20","12:50","Presentation","ai-strategy","Tackling AI in Manufacturing",L.rf,
    ["Use Case Discovery","Implementation","Operations","Case Studies"],["Practitioner","Enterprise"]),
  s(D2,"12:20","12:50","Presentation","ai-adoption","How Leaders Prepare Teams for AI Literacy",L.ts,
    ["Workforce Readiness","Change Management","Adoption"],["Executive","Beginner Friendly"]),
  s(D2,"12:20","12:50","Roundtable","marketing-ops","How to Turn Event Leads into Revenue Using AI",L.r1,
    ["Marketing AI","Automation","Enterprise Sales"],["Practitioner","Roundtable"]),
  s(D2,"12:20","12:50","Roundtable","ai-strategy","AI in Healthcare: What's Working Right Now",L.r2,
    ["Use Case Discovery","Case Studies","Implementation"],["Executive","Roundtable"]),

  // Lunch
  s(D2,"13:00","13:30","Networking","networking","Networking Lunch",L.cr,["Community Building","Partnerships"],["Beginner Friendly"]),

  // Concurrent Slot C: 1:40-2:10
  s(D2,"13:40","14:10","Presentation","marketing-ops","The Death of the American Salesman",L.ms,
    ["Marketing AI","Automation","Enterprise Sales","Business Outcomes"],["Practitioner","Enterprise"]),
  s(D2,"13:40","14:10","Presentation","exec-governance","Operationalizing AI: Strategy, Culture, and Real Deployment",L.lx,
    ["Executive Governance","Organizational Alignment","Implementation","Change Management"],["Executive"]),
  s(D2,"13:40","14:10","Presentation","data-infra","Your AI Is Only as Smart as Your Data: Is Yours Ready?",L.pp,
    ["Data Readiness","Data Governance","Data Architecture"],["Executive","Practitioner"]),
  s(D2,"13:40","14:10","Presentation","ai-security","Ready or Not? How America's AI Rules Will Change How We Hire, Build and Deploy AI",L.rb,
    ["Compliance","Risk Management","Responsible AI","AI Security"],["Executive","Enterprise"]),
  s(D2,"13:40","14:10","Panel","ai-adoption","The Human Side of AI: Trust, Leadership, and Change",L.rf,
    ["Change Management","Workforce Readiness","Adoption","Organizational Alignment"],["Executive","Practitioner"]),
  s(D2,"13:40","14:10","Panel","ai-strategy","Where Should You Actually Use AI? How Leaders Identify High-Impact Use Cases",L.ts,
    ["Use Case Discovery","ROI","AI Strategy","Business Outcomes"],["Executive","Practitioner"]),
  s(D2,"13:40","14:10","Roundtable","marketing-ops","AI Is Changing Customer Experience — And What Customers Actually Need",L.r1,
    ["Marketing AI","Use Case Discovery","Business Outcomes"],["Practitioner","Roundtable"]),
  s(D2,"13:40","14:10","Roundtable","ai-strategy","AI in Fintech: Real-World Applications",L.r2,
    ["Use Case Discovery","Case Studies","Implementation","Compliance"],["Executive","Roundtable"]),

  // Concurrent Slot D: 2:20-2:50
  s(D2,"14:20","14:50","Debate","ai-strategy","AI Adoption Gap: Enterprise vs. SMB",L.ms,
    ["AI Strategy","Adoption","ROI","Use Case Discovery"],["Executive","Practitioner"]),
  s(D2,"14:20","14:50","Fireside Chat","ai-adoption","The SMB AI Playbook: Making AI Stick When You Don't Have a Tech Team",L.lx,
    ["Adoption","Change Management","Implementation","Pilot to Production"],["Practitioner","Startup","Beginner Friendly"],
    "AI adoption is not a technology challenge — it's a change management challenge. This session shows leaders how to identify the right use cases, run safe pilots, and measure ROI."),
  s(D2,"14:20","14:50","Workshop","marketing-ops","Your Website Is Losing 97% of Buyers — and How AI Agents Fix It",L.pp,
    ["Marketing AI","Agents","Automation","Business Outcomes"],["Practitioner","Workshop"]),
  s(D2,"14:20","14:50","Presentation","architecture","AI in the War Room",L.rb,
    ["AI Strategy","Infrastructure","Enterprise Sales"],["Executive","Advanced"]),
  s(D2,"14:20","14:50","Presentation","ai-strategy","The Future of AI Isn't Chatbots, It's Invisible Systems",L.rf,
    ["Agents","Infrastructure","Implementation"],["Technical","Advanced"]),
  s(D2,"14:20","14:50","Workshop","marketing-ops","Film / Creative AI",L.ts,
    ["Marketing AI","Automation","Productivity"],["Practitioner","Workshop"]),
  s(D2,"14:20","14:50","Roundtable","ai-adoption","AI in Education: Building the Next Workforce",L.r1,
    ["Workforce Readiness","Use Case Discovery","Adoption"],["Executive","Roundtable"]),

  // Concurrent Slot E: 3:00-3:30
  s(D2,"15:00","15:30","Workshop","ai-strategy","Skills for Thrills: Why Context Beats Commands in AI Development",L.ms,
    ["Prompt Engineering","Implementation","Productivity"],["Practitioner","Technical","Workshop"]),
  s(D2,"15:00","15:30","Presentation","marketing-ops","Why Your ICP Is Wrong (And It's Killing Your AI Revenue)",L.lx,
    ["Marketing AI","AI Strategy","Enterprise Sales","ROI"],["Practitioner"]),
  s(D2,"15:00","15:30","Presentation","marketing-ops","The AI-Powered Marketing Stack: Creative Teams Are Moving Differently",L.pp,
    ["Marketing AI","Automation","Productivity","Implementation"],["Practitioner"]),
  s(D2,"15:00","15:30","Debate","architecture","Infrastructure Wars — Will AI Positively or Negatively Impact Communities?",L.rb,
    ["Infrastructure","Responsible AI","AI Strategy"],["Executive","Practitioner"]),
  s(D2,"15:00","15:30","Debate","ai-adoption","Will AI Replace More Jobs Than It Creates?",L.rf,
    ["Workforce Readiness","Change Management","Adoption","Responsible AI"],["Executive","Practitioner"]),
  s(D2,"15:00","15:30","Debate","ai-strategy","Start Fast or Start Right? The AI Use Case Debate",L.ts,
    ["AI Strategy","Pilot to Production","ROI","Implementation"],["Executive","Practitioner"]),

  // ═══ DAY 3 — HOW DO WE IMPLEMENT? ═══
  s(D3,"08:00","09:00","Social Event","networking","Women in AI & Tech Breakfast",L.cr,
    ["Community Building","Partnerships","Workforce Readiness"],["Executive","Beginner Friendly"]),

  // Main Stage Morning (all attendees 9:00-11:30)
  s(D3,"09:00","09:15","Keynote","ai-in-action","Welcome to Day 3 — How Do We Implement?",L.ms,["AI Strategy","Implementation"],["Executive","Beginner Friendly"]),
  s(D3,"09:25","09:55","Keynote","ai-in-action","Reality Bites: AI Governance in the Field",L.ms,
    ["Executive Governance","Compliance","Responsible AI","Risk Management"],["Executive"],
    "Privacy advisor Jodi Daniels and technology attorney Justin Daniels move beyond theory to discuss the practical challenges organizations face when implementing AI governance."),
  s(D3,"10:05","10:55","Fireside Chat","ai-in-action","Protecting Georgia's Children in the Age of AI: A Multi-Pronged Policy Approach",L.ms,
    ["Responsible AI","Compliance","Privacy","Risk Management"],["Executive"],
    "AI-powered platforms are shaping what children see, learn, and believe — often without guardrails. This session unpacks the real risks facing kids online and what legislation could mean for companies and families."),
  s(D3,"11:05","11:20","Presentation","ai-in-action","Inside a $2B Transformation: Modernizing Aramark Correctional Services at Scale",L.ms,
    ["Implementation","Case Studies","Business Outcomes","Pilot to Production"],["Executive","Enterprise","Case Study"]),

  // Concurrent Slot A: 11:40-12:10
  s(D3,"11:40","12:10","Workshop","ai-strategy","AI Is Scaling. Your People Aren't. Now What?",L.ms,
    ["Workforce Readiness","Change Management","Adoption","Organizational Alignment"],["Executive","Practitioner","Workshop"]),
  s(D3,"11:40","12:10","Panel","exec-governance","When Your Eyes & Ears Are Powered by AI — Balancing Productivity and Privacy",L.lx,
    ["Privacy","Executive Governance","Compliance","Responsible AI"],["Executive"]),
  s(D3,"11:40","12:10","Panel","architecture","What's Real vs Hype in AI Right Now?",L.pp,
    ["LLMs","Agents","Model Evaluation","AI Strategy"],["Technical","Practitioner"]),
  s(D3,"11:40","12:10","Panel","marketing-ops","How to Make AI a Daily Business Habit",L.rb,
    ["Productivity","Automation","Operations","Adoption"],["Practitioner"]),
  s(D3,"11:40","12:10","Panel","data-infra","AI Governance vs Speed: Who Wins?",L.rf,
    ["Data Governance","Compliance","Infrastructure","Executive Governance"],["Executive","Technical"]),
  s(D3,"11:40","12:10","Panel","architecture","How to Leverage AI to Amplify Existing Practices: Agentic Coding Tools",L.ts,
    ["Agents","Infrastructure","Productivity","Implementation"],["Technical","Advanced"]),
  s(D3,"11:40","12:10","Roundtable","exec-governance","What's Blocking Your AI Initiatives Right Now?",L.r1,
    ["Executive Governance","Organizational Alignment","Change Management"],["Executive","Roundtable"]),
  s(D3,"11:40","12:10","Roundtable","ai-strategy","Where Is Healthcare Broken and Where Is AI Making a Difference?",L.r2,
    ["Use Case Discovery","Case Studies","Implementation"],["Executive","Roundtable"]),

  // Concurrent Slot B: 12:20-12:50
  s(D3,"12:20","12:50","Panel","ai-strategy","How Enterprise Teams Are Adopting AI Internally — The Hard Decisions",L.ms,
    ["Adoption","Change Management","Implementation","Business Outcomes"],["Executive","Enterprise"]),
  s(D3,"12:20","12:50","Presentation","exec-governance","How to Stay Human, Relevant, and Valuable in the Age of Intelligent Machines",L.lx,
    ["Workforce Readiness","Change Management","Responsible AI"],["Executive","Practitioner"]),
  s(D3,"12:20","12:50","Presentation","architecture","From Prototype to Production — Building AI Apps That Actually Work",L.pp,
    ["Pilot to Production","Implementation","LLMs","Infrastructure"],["Technical","Advanced"]),
  s(D3,"12:20","12:50","Presentation","marketing-ops","AI in the Flow of Work: Turning Models Into Operational Advantage",L.rb,
    ["Operations","Productivity","Automation","Implementation"],["Practitioner","Enterprise"]),
  s(D3,"12:20","12:50","Debate","data-infra","Vendors vs. In-House: Buy the Stack vs. Build the Capability",L.rf,
    ["Infrastructure","Data Architecture","ROI","AI Strategy"],["Technical","Executive"]),
  s(D3,"12:20","12:50","Presentation","ai-security","Building IP in the Age of Generative AI: What You Own, What You Don't",L.ts,
    ["Compliance","Risk Management","Responsible AI"],["Executive","Enterprise"]),
  s(D3,"12:20","12:50","Roundtable","ai-strategy","Where Is AI Actually Driving Revenue Right Now?",L.r1,
    ["ROI","Business Outcomes","Case Studies","Enterprise Sales"],["Executive","Roundtable"]),
  s(D3,"12:20","12:50","Roundtable","exec-governance","AI Risk Roundtable: Builder, Buyer, or Regulator?",L.r2,
    ["Risk Management","Compliance","Executive Governance"],["Executive","Roundtable"]),

  // Lunch
  s(D3,"13:00","13:30","Networking","networking","Networking Lunch",L.cr,["Community Building","Partnerships"],["Beginner Friendly"]),

  // Concurrent Slot C: 1:40-2:10
  s(D3,"13:40","14:10","Workshop","ai-strategy","Robots Are Ready. Are Your Teams?",L.ms,
    ["Workforce Readiness","Change Management","Automation","Implementation"],["Executive","Workshop"]),
  s(D3,"13:40","14:10","Debate","exec-governance","Who Should Own AI Risk: The Builder, the Buyer, or the Regulator?",L.lx,
    ["Risk Management","Compliance","Responsible AI","Executive Governance"],["Executive"],
    "We're seeing lawsuits against Workday for hiring bias, Meta for harm to teens, and OpenAI for how models are trained — while new laws from New York to the EU are trying to catch up."),
  s(D3,"13:40","14:10","Panel","architecture","Building AI Products with Gen AI",L.pp,
    ["LLMs","Agents","Pilot to Production","Implementation"],["Technical","Advanced"]),
  s(D3,"13:40","14:10","Panel","marketing-ops","Building AI for the 99%: What Deployments Taught Us",L.rb,
    ["Implementation","Business Outcomes","Operations","Case Studies"],["Practitioner","Enterprise"]),
  s(D3,"13:40","14:10","Panel","data-infra","What to Watch When AI Goes Live: Monitoring Models, Drift, and Risk",L.rf,
    ["Model Evaluation","Infrastructure","Data Governance","Risk Management"],["Technical","Advanced"]),
  s(D3,"13:40","14:10","Workshop","architecture","What Game Design Teaches Us About the Future of AI",L.ts,
    ["Implementation","Use Case Discovery"],["Practitioner","Beginner Friendly","Workshop"]),

  // Concurrent Slot D: 2:20-2:50
  s(D3,"14:20","14:50","Workshop","ai-strategy","Blue Collar AI 2.0: Scaling From Office Manager to Autonomous Operator",L.ms,
    ["Use Case Discovery","Automation","Implementation","Operations"],["Practitioner","Workshop"]),
  s(D3,"14:20","14:50","Fireside Chat","ai-adoption","The AI Talent Gap: What Companies Need vs What Actually Exists",L.lx,
    ["Workforce Readiness","Adoption","Change Management"],["Executive"]),
  s(D3,"14:20","14:50","Workshop","architecture","A Step-by-Step Guide to Building Your First GenAI App",L.pp,
    ["LLMs","Prompt Engineering","Implementation","Pilot to Production"],["Technical","Beginner Friendly","Workshop"]),
  s(D3,"14:20","14:50","Presentation","ai-security","Red Teaming AI: Stress-Testing Models Before Attackers Do",L.rb,
    ["AI Security","Model Evaluation","Risk Management"],["Technical","Advanced"]),
  s(D3,"14:20","14:50","Workshop","ai-adoption","AI Isn't Failing — Our Learning Models Are",L.rf,
    ["Workforce Readiness","Adoption","Change Management"],["Practitioner"]),
  s(D3,"14:20","14:50","Presentation","marketing-ops","How AI Is Rewriting Search and What It Means for Your Brand",L.ts,
    ["Marketing AI","AI Strategy","Business Outcomes"],["Practitioner"]),

  // Concurrent Slot E: 3:00-3:30
  s(D3,"15:00","15:30","Panel","ai-strategy","How to Use AI to Eliminate Busywork and Scale Without Hiring",L.ms,
    ["Productivity","Automation","ROI","Business Outcomes"],["Executive","Practitioner"]),
  s(D3,"15:00","15:30","Presentation","ai-adoption","The Small Business GenAI Playbook: How Small Teams Are Using AI to Compete",L.lx,
    ["Adoption","Use Case Discovery","ROI","Implementation"],["Startup","Practitioner","Beginner Friendly"]),
  s(D3,"15:00","15:30","Workshop","exec-governance","Governed by Design: A Hands-On AI Governance Workshop",L.pp,
    ["Executive Governance","Compliance","Responsible AI","Organizational Alignment"],["Executive","Workshop"]),
  s(D3,"15:00","15:30","Presentation","ai-security","AI Governance in Practice: Managing Risk Without Slowing Innovation",L.rb,
    ["AI Security","Compliance","Risk Management","Executive Governance"],["Executive","Enterprise"]),
  s(D3,"15:00","15:30","Workshop","ai-adoption","AI, Creativity, and Community: How Atlanta Is Building an Inclusive Tech Ecosystem",L.rf,
    ["Community Building","Workforce Readiness","Partnerships","Adoption"],["Practitioner","Beginner Friendly","Workshop"]),
  s(D3,"15:00","15:30","Debate","ai-security","Is AI Strengthening Security — or Breaking It?",L.ts,
    ["AI Security","Risk Management","Infrastructure"],["Technical","Executive"]),
];

// ═══════════════════════════════════════════════════════════════
const font = `'Poppins','DM Sans',system-ui,sans-serif`;
const mono = `'JetBrains Mono',monospace`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--prussian:#001324;--azure:#0084FF;--aqua:#00FFD9;--spectrum:#0047FF;--r:16px;--rs:10px;--sh:0 2px 16px rgba(0,19,36,.07);--shl:0 8px 32px rgba(0,19,36,.12);--bdr:rgba(0,19,36,.08);--bg2:rgba(0,19,36,.02);--t1:#001324;--t2:rgba(0,19,36,.55);--t3:rgba(0,19,36,.35)}
body{background:#F8F9FB}
.D{font-family:${font};color:var(--t1);min-height:100vh;background:#F8F9FB}
.hd{background:linear-gradient(135deg,var(--prussian),var(--spectrum));padding:24px 28px 20px;position:sticky;top:0;z-index:50}
.hd h1{font-weight:900;font-size:20px;color:#fff;text-transform:uppercase;letter-spacing:-.02em}
.hd .sub{font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.55);margin-top:3px}
.hr{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.ha{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.b{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.06em;border:none;border-radius:25px;cursor:pointer;padding:8px 16px;transition:all .2s;display:inline-flex;align-items:center;gap:5px}
.bp{background:var(--spectrum);color:#fff}.bp:hover{background:#003ae0}
.ba{background:var(--aqua);color:var(--prussian)}.ba:hover{background:#00e6c3}
.bo{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.18)}.bo:hover{background:rgba(255,255,255,.18)}
.bg{background:transparent;color:var(--t2);border:1px solid var(--bdr)}.bg:hover{background:var(--bg2)}
.bd{background:#EF4444;color:#fff}.bd:hover{background:#DC2626}
.bs{padding:6px 12px;font-size:10px}
.dt{display:flex;gap:3px;margin-top:14px;flex-wrap:wrap}
.dtb{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:7px 14px;border-radius:25px;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(255,255,255,.55);transition:all .2s;white-space:nowrap}
.dtb:hover{background:rgba(255,255,255,.12);color:#fff}
.dtb.a{background:var(--aqua);color:var(--prussian);border-color:var(--aqua)}
.sb{display:flex;gap:20px;padding:14px 28px;background:#fff;border-bottom:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.st{display:flex;align-items:baseline;gap:5px}
.sn{font-weight:800;font-size:20px;color:var(--spectrum)}
.sl{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.04em}
.fb{display:flex;gap:8px;padding:14px 28px;background:#fff;border-bottom:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.si{font-family:'DM Sans',sans-serif;font-size:12px;border:1px solid var(--bdr);border-radius:25px;padding:7px 14px;background:var(--bg2);min-width:200px;color:var(--t1)}
.si:focus{outline:none;border-color:var(--azure)}
.fs{font-family:'DM Sans',sans-serif;font-size:11px;border:1px solid var(--bdr);border-radius:25px;padding:7px 12px;background:#fff;color:var(--t1);cursor:pointer}
.ag{display:grid;gap:10px;padding:20px 28px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.sc{background:#fff;border-radius:var(--r);border:1px solid var(--bdr);overflow:hidden;cursor:pointer;transition:all .2s;box-shadow:var(--sh)}
.sc:hover{box-shadow:var(--shl);transform:translateY(-2px)}
.ctb{height:4px;width:100%}
.cb{padding:14px}
.ct{font-family:${mono};font-size:10px;color:var(--t3);margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
.ctl{font-weight:700;font-size:13px;line-height:1.35;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cm{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}
.cp{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:2px 7px;border-radius:25px}
.csp{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--t2);display:flex;align-items:center;gap:3px;margin-top:6px}
.cl{font-family:'DM Sans',sans-serif;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.03em;margin-top:3px}
.mo{position:fixed;inset:0;background:rgba(0,19,36,.55);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.ml{background:#fff;border-radius:20px;width:100%;max-width:700px;max-height:92vh;overflow-y:auto;box-shadow:var(--shl)}
.mh{padding:20px 24px 14px;border-bottom:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;border-radius:20px 20px 0 0}
.mh h2{font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:-.02em}
.mb{padding:20px 24px}
.mf{padding:14px 24px 20px;border-top:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;bottom:0;background:#fff;border-radius:0 0 20px 20px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fgr{display:flex;flex-direction:column;gap:5px}
.fgr.f{grid-column:1/-1}
.fl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3)}
.fi,.fsl,.fta{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--t1);border:1px solid var(--bdr);border-radius:var(--rs);padding:9px 12px;background:var(--bg2);width:100%;transition:border-color .2s}
.fi:focus,.fsl:focus,.fta:focus{outline:none;border-color:var(--azure)}
.fta{min-height:70px;resize:vertical}
.tg{display:flex;flex-wrap:wrap;gap:5px}
.tc{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;padding:4px 10px;border-radius:25px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--t2);transition:all .15s}
.tc.s{background:var(--spectrum);color:#fff;border-color:var(--spectrum)}
.tc.s2{background:var(--prussian);color:#fff;border-color:var(--prussian)}
.xb{width:30px;height:30px;border-radius:50%;border:1px solid var(--bdr);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--t2);transition:all .2s}
.xb:hover{background:var(--bg2);color:var(--t1)}
.es{text-align:center;padding:60px 28px;color:var(--t3)}
.es h3{font-weight:800;font-size:18px;text-transform:uppercase;margin-bottom:6px;color:var(--t2)}
.es p{font-family:'DM Sans',sans-serif;font-size:13px;margin-bottom:20px}
@media(max-width:640px){.hd{padding:16px 14px 14px}.sb,.fb,.ag{padding-left:14px;padding-right:14px}.ag{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.ml{max-width:100%}}
`;

export default function AgendaBuilder() {
  const [sessions, setSessions] = useState([]);
  const [activeDay, setActiveDay] = useState(DAYS[1].id);
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [fTrack, setFTrack] = useState("all");
  const [fLoc, setFLoc] = useState("all");
  const [fType, setFType] = useState("all");
  const [ready, setReady] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(SK);
        if (r?.value) { setSessions(JSON.parse(r.value)); }
        else { setSessions(INITIAL_SESSIONS); }
      } catch { setSessions(INITIAL_SESSIONS); }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    (async () => { try { await window.storage.set(SK, JSON.stringify(sessions)); } catch {} })();
  }, [sessions, ready]);

  const trk = (id) => TRACKS.find(t => t.id === id) || TRACKS[0];

  const filtered = sessions.filter(s => {
    if (s.date !== activeDay) return false;
    if (fTrack !== "all" && s.trackId !== fTrack) return false;
    if (fLoc !== "all" && s.location !== fLoc) return false;
    if (fType !== "all" && s.sessionType !== fType) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.speakers?.some(sp => sp.toLowerCase().includes(q)) || s.description?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a,b) => a.startTime.localeCompare(b.startTime) || a.location.localeCompare(b.location));

  const dc = {}; DAYS.forEach(d => { dc[d.id] = sessions.filter(x => x.date === d.id).length; });

  const save = (s) => {
    setSessions(p => { const i = p.findIndex(x => x.id === s.id); if (i >= 0) { const n=[...p]; n[i]=s; return n; } return [...p,s]; });
    setModal(false); setEdit(null);
  };
  const del = (id) => { setSessions(p => p.filter(x => x.id !== id)); setModal(false); setEdit(null); };
  const dup = (s) => { setSessions(p => [...p, {...s, id:uid(), title:s.title+" (Copy)", speakers:[...(s.speakers||[])], topicTags:[...(s.topicTags||[])], audienceTags:[...(s.audienceTags||[])]}]); };

  const exportCSV = () => {
    const hdr = ["Date","Track","Title","Start Time","End Time","Location","Checkin Type","Background Color","Text Color","Tags","Speakers","Session Type","RSVP","Capacity","Description","Main Video","Main Video Restrict","Other Video1","Other Video1 Restrict","Other Video2","Other Video2 Restrict","Other Video3","Other Video3 Restrict","Other Video4","Other Video4 Restrict","File1","File2","File3","File4","File5","Send Push Before #Minutes","Send Push Text","Status"];
    const esc = v => { const x=String(v||""); return x.includes(",")||x.includes('"')||x.includes("\n")?`"${x.replace(/"/g,'""')}"`:x; };
    const rows = sessions.sort((a,b)=>a.date.localeCompare(b.date)||a.startTime.localeCompare(b.startTime)||a.location.localeCompare(b.location)).map(s => {
      const t = trk(s.trackId);
      const allTags = [...(s.topicTags||[]),...(s.audienceTags||[])].join(",");
      return [s.date,t.name,s.title,s.startTime,s.endTime,s.location,"",t.bg,t.fg,allTags,(s.speakers||[]).join(","),s.sessionType,"No","Unlimited",s.description||"","","","","","","","","","","","","","","","","","",s.status].map(esc).join(",");
    });
    const csv = "\uFEFF"+hdr.join(",")+"\n"+rows.join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="Atlanta_AI_Week_Eventify_Schedule.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result.replace(/^\uFEFF/,"");
        const lines = []; let cur="",inQ=false;
        for(const ch of text){if(ch==='"'){inQ=!inQ;cur+=ch}else if(ch==="\n"&&!inQ){lines.push(cur);cur=""}else{cur+=ch}}
        if(cur.trim())lines.push(cur);
        if(lines.length<2)return;
        const parseLine=l=>{const r=[];let f="",q=false;for(let i=0;i<l.length;i++){const c=l[i];if(c==='"'){if(q&&l[i+1]==='"'){f+='"';i++}else q=!q}else if(c===","&&!q){r.push(f.trim());f=""}else f+=c}r.push(f.trim());return r};
        const h=parseLine(lines[0]);const ci=n=>h.findIndex(x=>x.toLowerCase().replace(/[^a-z]/g,"")===n.toLowerCase().replace(/[^a-z]/g,""));
        const imp=[];
        for(let i=1;i<lines.length;i++){
          const c=parseLine(lines[i]);if(c.length<5)continue;
          const title=c[ci("title")]||"";if(!title)continue;
          const tn=c[ci("track")]||"";const mt=TRACKS.find(t=>t.name.toLowerCase()===tn.toLowerCase());
          imp.push({id:uid(),date:c[ci("date")]||D2,startTime:c[ci("starttime")]||"09:00",endTime:c[ci("endtime")]||"09:30",title,trackId:mt?.id||"ai-in-action",sessionType:c[ci("sessiontype")]||"Panel",location:c[ci("location")]||L.ms,topicTags:(c[ci("tags")]||"").split(",").map(t=>t.trim()).filter(Boolean),audienceTags:[],speakers:(c[ci("speakers")]||"").split(",").map(t=>t.trim()).filter(Boolean),description:c[ci("description")]||"",status:c[ci("status")]||"publish"});
        }
        if(imp.length)setSessions(imp);
      }catch(err){console.error(err)}
    };
    reader.readAsText(file); e.target.value="";
  };

  return (
    <div className="D">
      <style>{css}</style>
      <div className="hd">
        <div className="hr">
          <div><h1>AI Week Agenda Builder</h1><div className="sub">Atlanta 2026 — Eventify Schedule Manager</div></div>
          <div className="ha">
            <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} style={{display:"none"}} />
            <button className="b bo bs" onClick={()=>fileRef.current?.click()}>↑ Import</button>
            <button className="b bo bs" onClick={exportCSV} disabled={!sessions.length}>↓ Export CSV</button>
            <button className="b ba bs" onClick={()=>{setEdit(defaultSession());setModal(true)}}>+ Add Session</button>
          </div>
        </div>
        <div className="dt">
          {DAYS.map(d=>(
            <button key={d.id} className={`dtb ${activeDay===d.id?"a":""}`} onClick={()=>setActiveDay(d.id)}>
              {d.label} — {d.subtitle} ({dc[d.id]||0})
            </button>
          ))}
        </div>
      </div>

      <div className="sb">
        <div className="st"><span className="sn">{sessions.length}</span><span className="sl">Sessions</span></div>
        <div className="st"><span className="sn">{new Set(sessions.flatMap(s=>s.speakers||[])).size}</span><span className="sl">Speakers</span></div>
        <div className="st"><span className="sn">{new Set(sessions.map(s=>s.trackId)).size}</span><span className="sl">Tracks</span></div>
        <div className="st"><span className="sn">{new Set(sessions.map(s=>s.location)).size}</span><span className="sl">Stages</span></div>
        <div style={{flex:1}}/>
        {sessions.length>0 && <button className="b bg bs" onClick={()=>{if(confirm("Reset to default agenda?"))setSessions(INITIAL_SESSIONS)}}>Reset</button>}
      </div>

      <div className="fb">
        <input className="si" placeholder="Search sessions, speakers..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="fs" value={fTrack} onChange={e=>setFTrack(e.target.value)}>
          <option value="all">All Tracks</option>
          {TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="fs" value={fLoc} onChange={e=>setFLoc(e.target.value)}>
          <option value="all">All Stages</option>
          {LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
        </select>
        <select className="fs" value={fType} onChange={e=>setFType(e.target.value)}>
          <option value="all">All Types</option>
          {SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length===0?(
        <div className="es">
          <h3>{sessions.length===0?"No Sessions Yet":"No Matches"}</h3>
          <p>{sessions.length===0?"Add your first session or import a CSV.":"Try adjusting filters."}</p>
          {sessions.length===0&&<button className="b bp" onClick={()=>{setEdit(defaultSession());setModal(true)}}>+ Add Session</button>}
        </div>
      ):(
        <div className="ag">
          {filtered.map(s=>{
            const t=trk(s.trackId);
            return(
              <div key={s.id} className="sc" onClick={()=>{setEdit({...s,speakers:[...(s.speakers||[])],topicTags:[...(s.topicTags||[])],audienceTags:[...(s.audienceTags||[])]});setModal(true)}}>
                <div className="ctb" style={{background:t.bg}}/>
                <div className="cb">
                  <div className="ct">
                    <span>{s.startTime} — {s.endTime}</span>
                    <span className="cp" style={{background:t.bg+"20",color:t.bg}}>{t.name.length>25?t.name.slice(0,22)+"...":t.name}</span>
                  </div>
                  <div className="ctl">{s.title}</div>
                  <div className="cm">
                    <span className="cp" style={{background:"var(--bg2)",color:"var(--t2)"}}>{s.sessionType}</span>
                    {(s.topicTags||[]).slice(0,2).map(tg=>(
                      <span key={tg} className="cp" style={{background:"rgba(0,132,255,.08)",color:"var(--azure)"}}>{tg}</span>
                    ))}
                  </div>
                  {(s.speakers||[]).length>0&&<div className="csp">🎤 {s.speakers.slice(0,3).join(", ")}{s.speakers.length>3?` +${s.speakers.length-3}`:""}</div>}
                  <div className="cl">📍 {s.location}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal&&edit&&<Modal s={edit} isNew={!sessions.find(x=>x.id===edit.id)} onSave={save} onDel={del} onDup={dup} onClose={()=>{setModal(false);setEdit(null)}} />}
    </div>
  );
}

function Modal({s:init,isNew,onSave,onDel,onDup,onClose}){
  const[s,setS]=useState(init);
  const[spk,setSpk]=useState("");
  const set=(k,v)=>setS(p=>({...p,[k]:v}));
  const addSp=()=>{const n=spk.trim();if(n&&!(s.speakers||[]).includes(n)){set("speakers",[...(s.speakers||[]),n]);setSpk("")}};
  const remSp=i=>set("speakers",(s.speakers||[]).filter((_,j)=>j!==i));
  const togTopic=t=>{const tags=s.topicTags||[];set("topicTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};
  const togAud=t=>{const tags=s.audienceTags||[];set("audienceTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};

  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="ml">
        <div className="mh"><h2>{isNew?"Add Session":"Edit Session"}</h2><button className="xb" onClick={onClose}>×</button></div>
        <div className="mb">
          <div className="fgr f" style={{marginBottom:14}}>
            <label className="fl">Session Title</label>
            <input className="fi" value={s.title} onChange={e=>set("title",e.target.value)} placeholder="Enter session title..." style={{fontSize:15,fontWeight:600}} />
          </div>
          <div className="fg">
            <div className="fgr"><label className="fl">Date</label>
              <select className="fsl" value={s.date} onChange={e=>set("date",e.target.value)}>
                {DAYS.map(d=><option key={d.id} value={d.id}>{d.label} — {d.subtitle} ({d.short})</option>)}
              </select>
            </div>
            <div className="fgr"><label className="fl">Stage</label>
              <select className="fsl" value={s.location} onChange={e=>set("location",e.target.value)}>
                {LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="fgr"><label className="fl">Start Time</label>
              <select className="fsl" value={s.startTime} onChange={e=>set("startTime",e.target.value)}>
                {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="fgr"><label className="fl">End Time</label>
              <select className="fsl" value={s.endTime} onChange={e=>set("endTime",e.target.value)}>
                {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="fgr"><label className="fl">Track</label>
              <select className="fsl" value={s.trackId} onChange={e=>set("trackId",e.target.value)}>
                {TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="fgr"><label className="fl">Session Type</label>
              <select className="fsl" value={s.sessionType} onChange={e=>set("sessionType",e.target.value)}>
                {SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="fgr f" style={{marginTop:18}}>
            <label className="fl">Speakers</label>
            <div style={{display:"flex",gap:6}}>
              <input className="fi" value={spk} onChange={e=>setSpk(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSp()}}} placeholder="Type name, press Enter..." />
              <button className="b bp bs" onClick={addSp}>Add</button>
            </div>
            {(s.speakers||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
              {s.speakers.map((sp,i)=>(
                <span key={i} className="cp" style={{background:"var(--prussian)",color:"#fff",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",fontSize:11}}>
                  {sp}<span onClick={()=>remSp(i)} style={{cursor:"pointer",opacity:.6,fontSize:13,lineHeight:1}}>×</span>
                </span>
              ))}
            </div>}
          </div>

          <div className="fgr f" style={{marginTop:18}}>
            <label className="fl">Topic Tags</label>
            <div className="tg">{TOPIC_TAGS.map(t=><span key={t} className={`tc ${(s.topicTags||[]).includes(t)?"s":""}`} onClick={()=>togTopic(t)}>{t}</span>)}</div>
          </div>

          <div className="fgr f" style={{marginTop:14}}>
            <label className="fl">Audience & Format Tags</label>
            <div className="tg">{AUDIENCE_TAGS.map(t=><span key={t} className={`tc ${(s.audienceTags||[]).includes(t)?"s2":""}`} onClick={()=>togAud(t)}>{t}</span>)}</div>
          </div>

          <div className="fgr f" style={{marginTop:18}}>
            <label className="fl">Description</label>
            <textarea className="fta" value={s.description||""} onChange={e=>set("description",e.target.value)} placeholder="Session description for attendees..." />
          </div>
        </div>
        <div className="mf">
          <div style={{display:"flex",gap:6}}>
            {!isNew&&<button className="b bd bs" onClick={()=>{if(confirm("Delete?"))onDel(s.id)}}>Delete</button>}
            {!isNew&&<button className="b bg bs" onClick={()=>{onDup(s);onClose()}}>Duplicate</button>}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="b bg bs" onClick={onClose}>Cancel</button>
            <button className="b bp bs" onClick={()=>onSave(s)} disabled={!s.title.trim()}>{isNew?"Add Session":"Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
