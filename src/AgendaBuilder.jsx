import { useState, useEffect, useRef } from "react";

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
const LOCATIONS = ["Stage 1 \u2014 ATV Main Stage","Stage 2 \u2014 ATV Lennox Boardroom","Stage 3 \u2014 ATV Pitch Practice Room","Stage 4 \u2014 Roam Buckhead Garage","Stage 5 \u2014 Roam Forum","Stage 6 \u2014 TechRise Stage","Stage 7 \u2014 ATV Roundtable Room 1","Stage 8 \u2014 ATV Roundtable Room 2","Stage 9 \u2014 ATV Community Room"];
const SESSION_TYPES = ["Keynote","Panel","Workshop","Fireside Chat","Roundtable","Presentation","Demo","Startup Pitch","Networking","Social Event","Debate"];
const TOPIC_TAGS = ["AI Strategy","Use Case Discovery","ROI","Change Management","Adoption","Workforce Readiness","Data Readiness","Data Governance","Data Architecture","Infrastructure","LLMs","Agents","RAG","Prompt Engineering","Model Evaluation","AI Security","Risk Management","Compliance","Privacy","Responsible AI","Executive Governance","Organizational Alignment","Implementation","Pilot to Production","Case Studies","Business Outcomes","Automation","Productivity","Marketing AI","Operations","Founders","Fundraising","Enterprise Sales","Community Building","Partnerships"];
const AUDIENCE_TAGS = ["Executive","Practitioner","Technical","Beginner Friendly","Advanced","Panel","Workshop","Roundtable","Fireside Chat","Case Study","Demo","Startup","Enterprise"];
const TIMES=[];for(let h=7;h<=21;h++)for(let m=0;m<60;m+=5)TIMES.push(String(h).padStart(2,"0")+":"+String(m).padStart(2,"0"));
const uid=()=>Math.random().toString(36).slice(2,10);
const SK="aiweek-events-v5";

function generateAnchors(days) {
  const ms=LOCATIONS[0],cr=LOCATIONS[8],a=[];
  const S=(d,s,e,t,tr,ti,lo)=>a.push({id:uid(),date:d,startTime:s,endTime:e,sessionType:t,trackId:tr,title:ti,location:lo,topicTags:[],audienceTags:[],speakers:[],sponsor:"",description:"",status:"publish",locked:true});
  days.forEach((day,i)=>{
    if(i===0){S(day.id,"15:00","17:00","Startup Pitch","startup-showcase","Startup Showcase",cr);S(day.id,"17:00","19:00","Social Event","networking","Community Happy Hour",cr)}
    else if(i===1){S(day.id,"08:00","09:00","Networking","networking","Registration & Morning Networking",ms);S(day.id,"09:00","09:15","Keynote","ai-in-action","Opening Keynote",ms);S(day.id,"09:25","09:55","Keynote","ai-in-action","Main Stage Keynote",ms);S(day.id,"10:05","10:35","Panel","ai-in-action","Main Stage Panel",ms);S(day.id,"10:45","11:20","Fireside Chat","ai-in-action","Main Stage Fireside Chat",ms);S(day.id,"13:00","13:30","Networking","networking","Networking Lunch",cr);S(day.id,"16:00","18:00","Social Event","networking","VIP Happy Hour",cr)}
    else if(i===2){S(day.id,"08:00","10:00","Social Event","networking","Women in AI & Tech Breakfast",cr);S(day.id,"10:00","10:15","Keynote","ai-in-action","Opening Keynote",ms);S(day.id,"10:25","10:55","Keynote","ai-in-action","Main Stage Keynote",ms);S(day.id,"11:05","11:20","Fireside Chat","ai-in-action","Main Stage Session",ms);S(day.id,"13:00","13:30","Networking","networking","Networking Lunch",cr)}
  });
  return a;
}

function mkAtlanta(){
  const days=[{id:"2026-04-20",label:"Day 1",subtitle:"Community Day"},{id:"2026-04-21",label:"Day 2",subtitle:"Are We Ready?"},{id:"2026-04-22",label:"Day 3",subtitle:"How Do We Implement?"}];
  const[L0,L1,L2,L3,L4,L5,L6,L7,L8]=LOCATIONS;
  const[D1,D2,D3]=days.map(d=>d.id);
  const S=(d,s,e,t,tr,ti,lo,tt=[],at=[],de="",sp="",lk=false)=>({id:uid(),date:d,startTime:s,endTime:e,sessionType:t,trackId:tr,title:ti,location:lo,topicTags:tt,audienceTags:at,description:de,speakers:[],sponsor:sp,status:"publish",locked:lk});
  const ss=[
    // DAY 1
    S(D1,"15:00","15:10","Keynote","startup-showcase","Startup Showcase Welcome",L8,["Founders","Community Building"],["Startup"],"","",true),
    S(D1,"15:20","15:50","Panel","startup-showcase","How Buyers Evaluate AI and Cyber Vendors",L8,["Enterprise Sales","AI Strategy"],["Startup","Enterprise"]),
    S(D1,"16:00","16:30","Startup Pitch","startup-showcase","Startup Pitches \u2014 Round 1",L8,["Founders","Fundraising"],["Startup"]),
    S(D1,"16:40","17:00","Panel","startup-showcase","What Makes a Startup Stand Out and How Pilots Actually Work",L8,["Founders","Pilot to Production"],["Startup","Enterprise"]),
    S(D1,"17:00","19:00","Social Event","networking","Community Happy Hour",L8,["Community Building","Partnerships"],["Beginner Friendly"],"","",true),
    // DAY 2 Anchors
    S(D2,"08:00","09:00","Networking","networking","Registration & Morning Networking",L0,["Community Building"],["Beginner Friendly"],"","",true),
    S(D2,"09:00","09:15","Keynote","ai-in-action","Welcome & Opening Remarks",L0,["AI Strategy"],["Executive"],"","Enterprise Technology Association"),
    S(D2,"09:25","09:55","Keynote","ai-in-action","What Happens After the Demo: A Real Look at AI, Process, and Work That Actually Ships",L0,["Implementation","Case Studies","Business Outcomes"],["Executive","Practitioner"],"Stephen Gates pulls back the curtain on how AI is actually being used in real client work.","CRZY Design"),
    S(D2,"10:05","10:35","Panel","ai-in-action","Inside Big Tech: How AI Actually Gets Built & Deployed",L0,["Implementation","Infrastructure","LLMs"],["Technical","Enterprise"]),
    S(D2,"10:45","11:20","Fireside Chat","ai-in-action","AI Under Constraints: What Regulated Industries Can Teach Everyone Else",L0,["Compliance","Risk Management","Responsible AI"],["Executive","Enterprise"]),
    // D2 Slot A
    S(D2,"11:40","12:10","Keynote","ai-in-action","Atlanta\u2019s Advantage: Why This City Will Lead AI",L0,["AI Strategy","Community Building"],["Executive"]),
    S(D2,"11:40","12:10","Panel","exec-governance","The AI Governance Gap: Why Most Companies Aren\u2019t Ready",L1,["Executive Governance","Compliance"],["Executive"]),
    S(D2,"11:40","12:10","Fireside Chat","marketing-ops","The AI Conversation Chain: Why Brands Disappear After the First Prompt",L2,["Marketing AI","Automation"],["Practitioner"]),
    S(D2,"11:40","12:10","Panel","ai-security","The New Risks Every Organization Needs to Understand",L3,["AI Security","Risk Management","Privacy"],["Executive","Technical"],"","Axe.AI"),
    S(D2,"11:40","12:10","Panel","ai-strategy","The Hidden Costs of Bad AI Execution",L4,["ROI","AI Strategy","Business Outcomes"],["Executive"]),
    S(D2,"11:40","12:10","Panel","ai-adoption","What Every Workforce Needs to Embed in Their Culture",L5,["Change Management","Workforce Readiness"],["Executive"]),
    S(D2,"11:40","12:10","Roundtable","architecture","What\u2019s in Your AI Stack?",L6,["Infrastructure","LLMs","Agents"],["Technical","Advanced","Roundtable"]),
    S(D2,"11:40","12:10","Roundtable","ai-strategy","Moving from AI Experiments to Real Business Value",L7,["ROI","Pilot to Production"],["Executive","Roundtable"]),
    // D2 Slot B
    S(D2,"12:20","12:50","Workshop","ai-security","Deepfakes and the Death of Trust",L0,["AI Security","Risk Management","Privacy"],["Executive","Practitioner"]),
    S(D2,"12:20","12:50","Presentation","exec-governance","Tales from the Trenches: The AI Incidents No CEO Wants to Experience",L1,["Risk Management","Case Studies"],["Executive","Case Study"]),
    S(D2,"12:20","12:50","Panel","marketing-ops","From Data to Demand: AI Is Changing Customer Acquisition",L2,["Marketing AI","Automation","Business Outcomes"],["Practitioner","Enterprise"]),
    S(D2,"12:20","12:50","Presentation","ai-security","Protecting Data, Models, and Workflows",L3,["AI Security","Data Governance"],["Technical","Enterprise"],"","Axe.AI"),
    S(D2,"12:20","12:50","Presentation","ai-strategy","Tackling AI in Manufacturing",L4,["Use Case Discovery","Operations","Case Studies"],["Practitioner","Enterprise"]),
    S(D2,"12:20","12:50","Presentation","ai-adoption","How Leaders Prepare Teams for AI Literacy",L5,["Workforce Readiness","Change Management"],["Executive","Beginner Friendly"],"","USAII"),
    S(D2,"12:20","12:50","Roundtable","marketing-ops","How to Turn Event Leads into Revenue Using AI",L6,["Marketing AI","Enterprise Sales"],["Practitioner","Roundtable"]),
    S(D2,"12:20","12:50","Roundtable","ai-strategy","AI in Healthcare: What\u2019s Working Right Now",L7,["Use Case Discovery","Case Studies"],["Executive","Roundtable"]),
    // D2 Lunch
    S(D2,"13:00","13:30","Networking","networking","Networking Lunch",L8,["Community Building"],["Beginner Friendly"],"","",true),
    // D2 Slot C
    S(D2,"13:40","14:10","Presentation","marketing-ops","The Death of the American Salesman",L0,["Marketing AI","Enterprise Sales"],["Practitioner","Enterprise"],"","AIprl Assist"),
    S(D2,"13:40","14:10","Presentation","exec-governance","Operationalizing AI: Strategy, Culture, and Real Deployment",L1,["Executive Governance","Implementation"],["Executive"],"","Nexigen"),
    S(D2,"13:40","14:10","Presentation","data-infra","Your AI Is Only as Smart as Your Data: Is Yours Ready?",L2,["Data Readiness","Data Governance"],["Executive","Practitioner"],"","CapGemini"),
    S(D2,"13:40","14:10","Presentation","ai-security","Ready or Not? How America\u2019s AI Rules Will Change How We Hire, Build and Deploy AI",L3,["Compliance","Risk Management"],["Executive","Enterprise"]),
    S(D2,"13:40","14:10","Panel","ai-adoption","The Human Side of AI: Trust, Leadership, and Change",L4,["Change Management","Workforce Readiness"],["Executive"]),
    S(D2,"13:40","14:10","Panel","ai-strategy","Where Should You Actually Use AI?",L5,["Use Case Discovery","ROI"],["Executive","Practitioner"]),
    S(D2,"13:40","14:10","Roundtable","marketing-ops","AI Is Changing Customer Experience",L6,["Marketing AI","Use Case Discovery"],["Practitioner","Roundtable"]),
    S(D2,"13:40","14:10","Roundtable","ai-strategy","AI in Fintech: Real-World Applications",L7,["Use Case Discovery","Case Studies"],["Executive","Roundtable"]),
    // D2 Slot D
    S(D2,"14:20","14:50","Debate","ai-strategy","AI Adoption Gap: Enterprise vs. SMB",L0,["AI Strategy","Adoption","ROI"],["Executive"]),
    S(D2,"14:20","14:50","Fireside Chat","ai-adoption","The SMB AI Playbook: Making AI Stick",L1,["Adoption","Change Management"],["Practitioner","Startup"]),
    S(D2,"14:20","14:50","Workshop","marketing-ops","Your Website Is Losing 97% of Buyers \u2014 and How AI Agents Fix It",L2,["Marketing AI","Agents","Automation"],["Practitioner","Workshop"]),
    S(D2,"14:20","14:50","Presentation","architecture","AI in the War Room",L3,["AI Strategy","Infrastructure"],["Executive","Advanced"]),
    S(D2,"14:20","14:50","Presentation","ai-strategy","The Future of AI Isn\u2019t Chatbots, It\u2019s Invisible Systems",L4,["Agents","Infrastructure"],["Technical","Advanced"]),
    S(D2,"14:20","14:50","Workshop","marketing-ops","Film / Creative AI",L5,["Marketing AI","Productivity"],["Practitioner","Workshop"]),
    S(D2,"14:20","14:50","Roundtable","ai-adoption","AI in Education: Building the Next Workforce",L6,["Workforce Readiness","Adoption"],["Executive","Roundtable"]),
    // D2 Slot E
    S(D2,"15:00","15:30","Workshop","ai-strategy","Skills for Thrills: Why Context Beats Commands in AI Development",L0,["Prompt Engineering","Implementation"],["Practitioner","Technical","Workshop"]),
    S(D2,"15:00","15:30","Presentation","marketing-ops","Why Your ICP Is Wrong",L1,["Marketing AI","Enterprise Sales","ROI"],["Practitioner"]),
    S(D2,"15:00","15:30","Presentation","marketing-ops","The AI-Powered Marketing Stack",L2,["Marketing AI","Automation"],["Practitioner"]),
    S(D2,"15:00","15:30","Debate","architecture","Infrastructure Wars",L3,["Infrastructure","Responsible AI"],["Executive","Practitioner"]),
    S(D2,"15:00","15:30","Debate","ai-adoption","Will AI Replace More Jobs Than It Creates?",L4,["Workforce Readiness","Change Management"],["Executive"]),
    S(D2,"15:00","15:30","Debate","ai-strategy","Start Fast or Start Right?",L5,["AI Strategy","Pilot to Production","ROI"],["Executive","Practitioner"]),
    // D2 VIP
    S(D2,"16:00","18:00","Social Event","networking","VIP Happy Hour",L8,["Community Building","Partnerships"],["Executive"],"","",true),
    // DAY 3 Anchors
    S(D3,"08:00","10:00","Social Event","networking","Women in AI & Tech Breakfast",L8,["Community Building","Workforce Readiness"],["Executive"],"","",true),
    S(D3,"10:00","10:15","Keynote","ai-in-action","Welcome to Day 3 \u2014 How Do We Implement?",L0,["AI Strategy","Implementation"],["Executive"],"","Enterprise Technology Association"),
    S(D3,"10:25","10:55","Keynote","ai-in-action","Reality Bites: AI Governance in the Field",L0,["Executive Governance","Compliance","Responsible AI"],["Executive"],"Jodi Daniels and Justin Daniels discuss practical AI governance challenges."),
    S(D3,"11:05","11:20","Fireside Chat","ai-in-action","Protecting Georgia\u2019s Children in the Age of AI",L0,["Responsible AI","Compliance","Privacy"],["Executive"],"AI-powered platforms are shaping what children see, learn, and believe.","Enterprise Technology Association"),
    // D3 Slot A
    S(D3,"11:40","12:10","Presentation","ai-in-action","Inside a $2B Transformation: Modernizing Aramark at Scale",L0,["Implementation","Case Studies","Business Outcomes"],["Executive","Enterprise","Case Study"]),
    S(D3,"11:40","12:10","Panel","exec-governance","When Your Eyes & Ears Are Powered by AI",L1,["Privacy","Executive Governance","Compliance"],["Executive"]),
    S(D3,"11:40","12:10","Panel","architecture","What\u2019s Real vs Hype in AI Right Now?",L2,["LLMs","Agents","Model Evaluation"],["Technical","Practitioner"]),
    S(D3,"11:40","12:10","Panel","marketing-ops","How to Make AI a Daily Business Habit",L3,["Productivity","Automation","Operations"],["Practitioner"]),
    S(D3,"11:40","12:10","Panel","data-infra","AI Governance vs Speed: Who Wins?",L4,["Data Governance","Compliance"],["Executive","Technical"]),
    S(D3,"11:40","12:10","Panel","architecture","How to Leverage AI: Agentic Coding Tools",L5,["Agents","Infrastructure","Productivity"],["Technical","Advanced"]),
    S(D3,"11:40","12:10","Roundtable","exec-governance","What\u2019s Blocking Your AI Initiatives Right Now?",L6,["Executive Governance","Organizational Alignment"],["Executive","Roundtable"],"","Nexigen"),
    S(D3,"11:40","12:10","Roundtable","ai-strategy","Where Is Healthcare Broken and AI Making a Difference?",L7,["Use Case Discovery","Case Studies"],["Executive","Roundtable"]),
    // D3 Slot B
    S(D3,"12:20","12:50","Panel","ai-strategy","How Enterprise Teams Are Adopting AI \u2014 The Hard Decisions",L0,["Adoption","Change Management","Implementation"],["Executive","Enterprise"]),
    S(D3,"12:20","12:50","Presentation","exec-governance","How to Stay Human in the Age of Intelligent Machines",L1,["Workforce Readiness","Change Management"],["Executive"]),
    S(D3,"12:20","12:50","Presentation","architecture","From Prototype to Production \u2014 Building AI Apps That Work",L2,["Pilot to Production","LLMs"],["Technical","Advanced"]),
    S(D3,"12:20","12:50","Presentation","marketing-ops","AI in the Flow of Work: Models Into Operational Advantage",L3,["Operations","Productivity","Automation"],["Practitioner","Enterprise"],"","CapGemini"),
    S(D3,"12:20","12:50","Debate","data-infra","Vendors vs. In-House: Buy the Stack vs. Build",L4,["Infrastructure","Data Architecture","ROI"],["Technical","Executive"]),
    S(D3,"12:20","12:50","Presentation","ai-security","Building IP in the Age of Generative AI",L5,["Compliance","Risk Management"],["Executive","Enterprise"]),
    S(D3,"12:20","12:50","Roundtable","ai-strategy","Where Is AI Actually Driving Revenue Right Now?",L6,["ROI","Business Outcomes","Enterprise Sales"],["Executive","Roundtable"]),
    S(D3,"12:20","12:50","Roundtable","exec-governance","AI Risk Roundtable: Builder, Buyer, or Regulator?",L7,["Risk Management","Compliance"],["Executive","Roundtable"]),
    // D3 Lunch
    S(D3,"13:00","13:30","Networking","networking","Networking Lunch",L8,["Community Building"],["Beginner Friendly"],"","",true),
    // D3 Slot C
    S(D3,"13:40","14:10","Workshop","ai-strategy","Robots Are Ready. Are Your Teams?",L0,["Workforce Readiness","Change Management","Automation"],["Executive","Workshop"]),
    S(D3,"13:40","14:10","Debate","exec-governance","Who Should Own AI Risk: Builder, Buyer, or Regulator?",L1,["Risk Management","Compliance","Responsible AI"],["Executive"]),
    S(D3,"13:40","14:10","Panel","architecture","Building AI Products with Gen AI",L2,["LLMs","Agents","Pilot to Production"],["Technical","Advanced"]),
    S(D3,"13:40","14:10","Panel","marketing-ops","Building AI for the 99%: What Deployments Taught Us",L3,["Implementation","Business Outcomes","Operations"],["Practitioner","Enterprise"]),
    S(D3,"13:40","14:10","Panel","data-infra","What to Watch When AI Goes Live: Models, Drift, and Risk",L4,["Model Evaluation","Infrastructure","Risk Management"],["Technical","Advanced"]),
    S(D3,"13:40","14:10","Workshop","architecture","What Game Design Teaches Us About AI",L5,["Implementation","Use Case Discovery"],["Practitioner","Workshop"]),
    // D3 Slot D
    S(D3,"14:20","14:50","Workshop","ai-strategy","Blue Collar AI 2.0: Office Manager to Autonomous Operator",L0,["Use Case Discovery","Automation","Operations"],["Practitioner","Workshop"]),
    S(D3,"14:20","14:50","Fireside Chat","ai-adoption","The AI Talent Gap: What Companies Need vs What Exists",L1,["Workforce Readiness","Adoption"],["Executive"]),
    S(D3,"14:20","14:50","Workshop","architecture","A Step-by-Step Guide to Building Your First GenAI App",L2,["LLMs","Prompt Engineering","Implementation"],["Technical","Beginner Friendly","Workshop"]),
    S(D3,"14:20","14:50","Presentation","ai-security","Red Teaming AI: Stress-Testing Models Before Attackers Do",L3,["AI Security","Model Evaluation"],["Technical","Advanced"],"","AXE.AI"),
    S(D3,"14:20","14:50","Workshop","ai-adoption","AI Isn\u2019t Failing \u2014 Our Learning Models Are",L4,["Workforce Readiness","Adoption"],["Practitioner"],"","USAII"),
    S(D3,"14:20","14:50","Presentation","marketing-ops","How AI Is Rewriting Search and What It Means for Your Brand",L5,["Marketing AI","AI Strategy"],["Practitioner"]),
    // D3 Slot E
    S(D3,"15:00","15:30","Panel","ai-strategy","How to Eliminate Busywork and Scale Without Hiring",L0,["Productivity","Automation","ROI"],["Executive","Practitioner"]),
    S(D3,"15:00","15:30","Presentation","ai-adoption","The Small Business GenAI Playbook",L1,["Adoption","Use Case Discovery","ROI"],["Startup","Practitioner"]),
    S(D3,"15:00","15:30","Workshop","exec-governance","Governed by Design: AI Governance Workshop",L2,["Executive Governance","Compliance"],["Executive","Workshop"]),
    S(D3,"15:00","15:30","Presentation","ai-security","AI Governance in Practice: Risk Without Slowing Innovation",L3,["AI Security","Compliance"],["Executive","Enterprise"],"","Nexigen"),
    S(D3,"15:00","15:30","Workshop","ai-adoption","AI, Creativity, and Community: Building Inclusive Tech",L4,["Community Building","Workforce Readiness"],["Practitioner","Workshop"]),
    S(D3,"15:00","15:30","Debate","ai-security","Is AI Strengthening Security \u2014 or Breaking It?",L5,["AI Security","Risk Management"],["Technical","Executive"]),
  ];
  return{id:"atlanta-2026",name:"Atlanta",dates:[D1,D2,D3],days,sessions:ss};
}

const font=`'Poppins','DM Sans',system-ui,sans-serif`;
const mono=`'JetBrains Mono',monospace`;
const css=`
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
.evs{display:flex;gap:4px;margin-top:10px;flex-wrap:wrap;align-items:center}
.evb{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:6px 14px;border-radius:25px;cursor:pointer;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:rgba(255,255,255,.55);transition:all .2s}
.evb:hover{background:rgba(255,255,255,.15);color:#fff}
.evb.a{background:white;color:var(--prussian);border-color:white;font-weight:800}
.evb.add{border-style:dashed;border-color:rgba(255,255,255,.3)}
.dt{display:flex;gap:3px;margin-top:10px;flex-wrap:wrap}
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
.sc.lk{border-left:3px solid var(--aqua)}
.ctb{height:4px;width:100%}.cb{padding:14px}
.ct{font-family:${mono};font-size:10px;color:var(--t3);margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
.ctl{font-weight:700;font-size:13px;line-height:1.35;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cm{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}
.cp{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:2px 7px;border-radius:25px}
.csp{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--t2);display:flex;align-items:center;gap:3px;margin-top:6px}
.cl{font-family:'DM Sans',sans-serif;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.03em;margin-top:3px}
.cspon{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--spectrum);font-weight:600;margin-top:4px}
.mo{position:fixed;inset:0;background:rgba(0,19,36,.55);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.ml{background:#fff;border-radius:20px;width:100%;max-width:700px;max-height:92vh;overflow-y:auto;box-shadow:var(--shl)}
.mh{padding:20px 24px 14px;border-bottom:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;border-radius:20px 20px 0 0}
.mh h2{font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:-.02em}
.mb{padding:20px 24px}.mf{padding:14px 24px 20px;border-top:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;bottom:0;background:#fff;border-radius:0 0 20px 20px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fgr{display:flex;flex-direction:column;gap:5px}.fgr.f{grid-column:1/-1}
.fl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3)}
.fi,.fsl,.fta{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--t1);border:1px solid var(--bdr);border-radius:var(--rs);padding:9px 12px;background:var(--bg2);width:100%;transition:border-color .2s}
.fi:focus,.fsl:focus,.fta:focus{outline:none;border-color:var(--azure)}
.fta{min-height:70px;resize:vertical}
.tg{display:flex;flex-wrap:wrap;gap:5px}
.tc{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;padding:4px 10px;border-radius:25px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--t2);transition:all .15s;user-select:none}
.tc.s{background:var(--spectrum);color:#fff;border-color:var(--spectrum)}
.tc.s2{background:var(--prussian);color:#fff;border-color:var(--prussian)}
.xb{width:30px;height:30px;border-radius:50%;border:1px solid var(--bdr);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--t2);transition:all .2s}
.xb:hover{background:var(--bg2);color:var(--t1)}
.es{text-align:center;padding:60px 28px;color:var(--t3)}
.es h3{font-weight:800;font-size:18px;text-transform:uppercase;margin-bottom:6px;color:var(--t2)}
.es p{font-family:'DM Sans',sans-serif;font-size:13px;margin-bottom:20px}
.lktag{display:inline-block;font-family:${mono};font-size:9px;color:var(--aqua);background:var(--prussian);padding:2px 6px;border-radius:4px;margin-left:4px}
.nem{background:#fff;border-radius:20px;padding:28px;max-width:480px;width:100%;box-shadow:var(--shl)}
.nem h2{font-weight:800;font-size:18px;text-transform:uppercase;margin-bottom:16px}
@media(max-width:640px){.hd{padding:16px 14px 14px}.sb,.fb,.ag{padding-left:14px;padding-right:14px}.ag{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.ml,.nem{max-width:100%}}
`;

export default function AgendaBuilder(){
  const[events,setEvents]=useState([]);
  const[eid,setEid]=useState(null);
  const[aDay,setADay]=useState(null);
  const[edit,setEdit]=useState(null);
  const[modal,setModal]=useState(false);
  const[neModal,setNeModal]=useState(false);
  const[search,setSearch]=useState("");
  const[fT,setFT]=useState("all");
  const[fL,setFL]=useState("all");
  const[fTy,setFTy]=useState("all");
  const[ready,setReady]=useState(false);
  const fileRef=useRef(null);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get(SK);if(r?.value){const d=JSON.parse(r.value);if(d.length){setEvents(d);setEid(d[0].id);setADay(d[0].days[1]?.id||d[0].days[0].id)}else{const a=mkAtlanta();setEvents([a]);setEid(a.id);setADay(a.days[1].id)}}else{const a=mkAtlanta();setEvents([a]);setEid(a.id);setADay(a.days[1].id)}}catch{const a=mkAtlanta();setEvents([a]);setEid(a.id);setADay(a.days[1].id)}setReady(true)})()},[]);
  useEffect(()=>{if(ready)(async()=>{try{await window.storage.set(SK,JSON.stringify(events))}catch{}})()},[events,ready]);

  const ev=events.find(e=>e.id===eid);
  const ss=ev?.sessions||[];
  const days=ev?.days||[];
  const trk=id=>TRACKS.find(t=>t.id===id)||TRACKS[0];
  const filtered=ss.filter(s=>{if(s.date!==aDay)return false;if(fT!=="all"&&s.trackId!==fT)return false;if(fL!=="all"&&s.location!==fL)return false;if(fTy!=="all"&&s.sessionType!==fTy)return false;if(search){const q=search.toLowerCase();return s.title.toLowerCase().includes(q)||s.speakers?.some(sp=>sp.toLowerCase().includes(q))||s.description?.toLowerCase().includes(q)||s.sponsor?.toLowerCase().includes(q)}return true}).sort((a,b)=>a.startTime.localeCompare(b.startTime)||a.location.localeCompare(b.location));
  const dc={};days.forEach(d=>{dc[d.id]=ss.filter(x=>x.date===d.id).length});
  const upd=fn=>setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:fn(e.sessions)}:e));
  const save=s=>{upd(p=>{const i=p.findIndex(x=>x.id===s.id);if(i>=0){const n=[...p];n[i]=s;return n}return[...p,s]});setModal(false);setEdit(null)};
  const del=id=>{upd(p=>p.filter(x=>x.id!==id));setModal(false);setEdit(null)};
  const dup=s=>{upd(p=>[...p,{...s,id:uid(),title:s.title+" (Copy)",speakers:[...(s.speakers||[])],topicTags:[...(s.topicTags||[])],audienceTags:[...(s.audienceTags||[])],locked:false}])};
  const newS=()=>({id:uid(),date:aDay||days[1]?.id||days[0]?.id,startTime:"11:40",endTime:"12:10",title:"",trackId:"ai-in-action",sessionType:"Panel",location:LOCATIONS[0],topicTags:[],audienceTags:[],speakers:[],sponsor:"",description:"",status:"publish",locked:false});
  const createEv=(name,d1,d2,d3)=>{const ds=[{id:d1,label:"Day 1",subtitle:"Community Day"},{id:d2,label:"Day 2",subtitle:"Conference Day 1"},{id:d3,label:"Day 3",subtitle:"Conference Day 2"}];const ne={id:uid(),name,dates:[d1,d2,d3],days:ds,sessions:generateAnchors(ds)};setEvents(p=>[...p,ne]);setEid(ne.id);setADay(ne.days[1].id);setNeModal(false)};
  const delEv=()=>{if(events.length<=1){alert("Cannot delete the only event.");return}if(!confirm("Delete "+ev.name+" event and all its sessions?"))return;const rem=events.filter(e=>e.id!==eid);setEvents(rem);setEid(rem[0].id);setADay(rem[0].days[1]?.id||rem[0].days[0].id)};

  const exportCSV=()=>{if(!ev)return;const hdr=["Date","Track","Title","Start Time","End Time","Location","Checkin Type","Background Color","Text Color","Tags","Speakers","Session Type","RSVP","Capacity","Sponsor","Description","Main Video","Main Video Restrict","Other Video1","Other Video1 Restrict","Other Video2","Other Video2 Restrict","Other Video3","Other Video3 Restrict","Other Video4","Other Video4 Restrict","File1","File2","File3","File4","File5","Send Push Before #Minutes","Send Push Text","Status"];const esc=v=>{const x=String(v||"");return x.includes(",")||x.includes('"')||x.includes("\n")?`"${x.replace(/"/g,'""')}"`:x};const rows=[...ss].sort((a,b)=>a.date.localeCompare(b.date)||a.startTime.localeCompare(b.startTime)||a.location.localeCompare(b.location)).map(s=>{const t=trk(s.trackId);const tags=[...(s.topicTags||[]),...(s.audienceTags||[])].join(",");return[s.date,t.name,s.title,s.startTime,s.endTime,s.location,"",t.bg,t.fg,tags,(s.speakers||[]).join(","),s.sessionType,"No","Unlimited",s.sponsor||"",s.description||"","","","","","","","","","","","","","","","","","",s.status].map(esc).join(",")});const csv="\uFEFF"+hdr.join(",")+"\n"+rows.join("\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=ev.name+"_AI_Week_Eventify.csv";a.click();URL.revokeObjectURL(url)};

  const handleImport=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev2=>{try{const text=ev2.target.result.replace(/^\uFEFF/,"");const lines=[];let cur="",inQ=false;for(const ch of text){if(ch==='"'){inQ=!inQ;cur+=ch}else if(ch==="\n"&&!inQ){lines.push(cur);cur=""}else cur+=ch}if(cur.trim())lines.push(cur);if(lines.length<2)return;const pL=l=>{const r=[];let f="",q=false;for(let i=0;i<l.length;i++){const c=l[i];if(c==='"'){if(q&&l[i+1]==='"'){f+='"';i++}else q=!q}else if(c===","&&!q){r.push(f.trim());f=""}else f+=c}r.push(f.trim());return r};const h=pL(lines[0]);const ci=n=>h.findIndex(x=>x.toLowerCase().replace(/[^a-z]/g,"")===n.toLowerCase().replace(/[^a-z]/g,""));const imp=[];for(let i=1;i<lines.length;i++){const c=pL(lines[i]);if(c.length<5)continue;const title=c[ci("title")]||"";if(!title)continue;const tn=c[ci("track")]||"";const mt=TRACKS.find(t=>t.name.toLowerCase()===tn.toLowerCase());imp.push({id:uid(),date:c[ci("date")]||"",startTime:c[ci("starttime")]||"09:00",endTime:c[ci("endtime")]||"09:30",title,trackId:mt?.id||"ai-in-action",sessionType:c[ci("sessiontype")]||"Panel",location:c[ci("location")]||LOCATIONS[0],topicTags:(c[ci("tags")]||"").split(",").map(t=>t.trim()).filter(Boolean),audienceTags:[],speakers:(c[ci("speakers")]||"").split(",").map(t=>t.trim()).filter(Boolean),sponsor:c[ci("sponsor")]||"",description:c[ci("description")]||"",status:c[ci("status")]||"publish",locked:false})}if(imp.length)upd(()=>imp)}catch(err){console.error(err)}};reader.readAsText(file);e.target.value=""};

  return(
    <div className="D"><style>{css}</style>
    <div className="hd">
      <div className="hr">
        <div><h1>AI Week Agenda Builder</h1><div className="sub">Multi-City Eventify Schedule Manager</div></div>
        <div className="ha">
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} style={{display:"none"}} />
          <button className="b bo bs" onClick={()=>fileRef.current?.click()}>↑ Import</button>
          <button className="b bo bs" onClick={exportCSV} disabled={!ss.length}>↓ Export CSV</button>
          <button className="b ba bs" onClick={()=>{setEdit(newS());setModal(true)}}>+ Add Session</button>
        </div>
      </div>
      <div className="evs">
        {events.map(e=><button key={e.id} className={`evb ${eid===e.id?"a":""}`} onClick={()=>{setEid(e.id);setADay(e.days[1]?.id||e.days[0]?.id)}}>{e.name}</button>)}
        <button className="evb add" onClick={()=>setNeModal(true)}>+ New Event</button>
      </div>
      {days.length>0&&<div className="dt">{days.map(d=><button key={d.id} className={`dtb ${aDay===d.id?"a":""}`} onClick={()=>setADay(d.id)}>{d.label} — {d.subtitle} ({dc[d.id]||0})</button>)}</div>}
    </div>

    <div className="sb">
      <div className="st"><span className="sn">{ss.length}</span><span className="sl">Sessions</span></div>
      <div className="st"><span className="sn">{new Set(ss.flatMap(s=>s.speakers||[])).size}</span><span className="sl">Speakers</span></div>
      <div className="st"><span className="sn">{new Set(ss.filter(s=>s.sponsor?.trim()).map(s=>s.sponsor)).size}</span><span className="sl">Sponsors</span></div>
      <div className="st"><span className="sn">{ss.filter(s=>s.locked).length}</span><span className="sl">Anchors</span></div>
      <div style={{flex:1}}/>
      {ev&&<button className="b bg bs" onClick={()=>{if(confirm("Reset "+ev.name+" to anchor events only?")){upd(()=>generateAnchors(ev.days))}}}>Reset Anchors</button>}
      {ev&&events.length>1&&<button className="b bd bs" onClick={delEv}>Delete Event</button>}
    </div>

    <div className="fb">
      <input className="si" placeholder="Search sessions, speakers, sponsors..." value={search} onChange={e=>setSearch(e.target.value)} />
      <select className="fs" value={fT} onChange={e=>setFT(e.target.value)}><option value="all">All Tracks</option>{TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
      <select className="fs" value={fL} onChange={e=>setFL(e.target.value)}><option value="all">All Stages</option>{LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}</select>
      <select className="fs" value={fTy} onChange={e=>setFTy(e.target.value)}><option value="all">All Types</option>{SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
    </div>

    {filtered.length===0?(<div className="es"><h3>{ss.length===0?"No Sessions Yet":"No Matches"}</h3><p>{ss.length===0?"Add your first session or import a CSV.":"Try adjusting filters."}</p>{ss.length===0&&<button className="b bp" onClick={()=>{setEdit(newS());setModal(true)}}>+ Add Session</button>}</div>):(
      <div className="ag">{filtered.map(s=>{const t=trk(s.trackId);return(
        <div key={s.id} className={`sc ${s.locked?"lk":""}`} onClick={()=>{setEdit({...s,speakers:[...(s.speakers||[])],topicTags:[...(s.topicTags||[])],audienceTags:[...(s.audienceTags||[])]});setModal(true)}}>
          <div className="ctb" style={{background:t.bg}}/>
          <div className="cb">
            <div className="ct"><span>{s.startTime} — {s.endTime}{s.locked&&<span className="lktag">ANCHOR</span>}</span><span className="cp" style={{background:t.bg+"20",color:t.bg}}>{t.name.length>28?t.name.slice(0,25)+"…":t.name}</span></div>
            <div className="ctl">{s.title}</div>
            <div className="cm"><span className="cp" style={{background:"var(--bg2)",color:"var(--t2)"}}>{s.sessionType}</span>{(s.topicTags||[]).slice(0,2).map(tg=><span key={tg} className="cp" style={{background:"rgba(0,132,255,.08)",color:"var(--azure)"}}>{tg}</span>)}</div>
            {s.sponsor?.trim()&&<div className="cspon">Sponsored by {s.sponsor}</div>}
            {(s.speakers||[]).length>0&&<div className="csp">🎤 {s.speakers.slice(0,3).join(", ")}{s.speakers.length>3?` +${s.speakers.length-3}`:""}</div>}
            <div className="cl">📍 {s.location}</div>
          </div>
        </div>)})}</div>)}

    {modal&&edit&&<SModal s={edit} days={days} isNew={!ss.find(x=>x.id===edit.id)} onSave={save} onDel={del} onDup={dup} onClose={()=>{setModal(false);setEdit(null)}} />}
    {neModal&&<NEModal onCreate={createEv} onClose={()=>setNeModal(false)} />}
    </div>
  );
}

function SModal({s:init,days,isNew,onSave,onDel,onDup,onClose}){
  const[s,setS]=useState(init);const[spk,setSpk]=useState("");
  const set=(k,v)=>setS(p=>({...p,[k]:v}));
  const addSp=()=>{const n=spk.trim();if(n&&!(s.speakers||[]).includes(n)){set("speakers",[...(s.speakers||[]),n]);setSpk("")}};
  const remSp=i=>set("speakers",(s.speakers||[]).filter((_,j)=>j!==i));
  const togT=t=>{const tags=s.topicTags||[];set("topicTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};
  const togA=t=>{const tags=s.audienceTags||[];set("audienceTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="ml">
      <div className="mh"><h2>{isNew?"Add Session":"Edit Session"}{s.locked&&<span className="lktag">ANCHOR</span>}</h2><button className="xb" onClick={onClose}>×</button></div>
      <div className="mb">
        <div className="fgr f" style={{marginBottom:14}}><label className="fl">Session Title</label><input className="fi" value={s.title} onChange={e=>set("title",e.target.value)} placeholder="Enter session title..." style={{fontSize:15,fontWeight:600}} /></div>
        <div className="fg">
          <div className="fgr"><label className="fl">Date</label><select className="fsl" value={s.date} onChange={e=>set("date",e.target.value)}>{days.map(d=><option key={d.id} value={d.id}>{d.label} — {d.subtitle} ({d.id})</option>)}</select></div>
          <div className="fgr"><label className="fl">Stage</label><select className="fsl" value={s.location} onChange={e=>set("location",e.target.value)}>{LOCATIONS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
          <div className="fgr"><label className="fl">Start Time</label><select className="fsl" value={s.startTime} onChange={e=>set("startTime",e.target.value)}>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div className="fgr"><label className="fl">End Time</label><select className="fsl" value={s.endTime} onChange={e=>set("endTime",e.target.value)}>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div className="fgr"><label className="fl">Track</label><select className="fsl" value={s.trackId} onChange={e=>set("trackId",e.target.value)}>{TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
          <div className="fgr"><label className="fl">Session Type</label><select className="fsl" value={s.sessionType} onChange={e=>set("sessionType",e.target.value)}>{SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Sponsor</label><input className="fi" value={s.sponsor||""} onChange={e=>set("sponsor",e.target.value)} placeholder="Sponsor name (optional)..." /></div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Speakers</label>
          <div style={{display:"flex",gap:6}}><input className="fi" value={spk} onChange={e=>setSpk(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSp()}}} placeholder="Type name, press Enter..." /><button className="b bp bs" onClick={addSp}>Add</button></div>
          {(s.speakers||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>{s.speakers.map((sp,i)=><span key={i} className="cp" style={{background:"var(--prussian)",color:"#fff",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",fontSize:11}}>{sp}<span onClick={()=>remSp(i)} style={{cursor:"pointer",opacity:.6,fontSize:13,lineHeight:1}}>×</span></span>)}</div>}
        </div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Topic Tags</label><div className="tg">{TOPIC_TAGS.map(t=><span key={t} className={`tc ${(s.topicTags||[]).includes(t)?"s":""}`} onClick={()=>togT(t)}>{t}</span>)}</div></div>
        <div className="fgr f" style={{marginTop:14}}><label className="fl">Audience & Format Tags</label><div className="tg">{AUDIENCE_TAGS.map(t=><span key={t} className={`tc ${(s.audienceTags||[]).includes(t)?"s2":""}`} onClick={()=>togA(t)}>{t}</span>)}</div></div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Description</label><textarea className="fta" value={s.description||""} onChange={e=>set("description",e.target.value)} placeholder="Session description..." /></div>
      </div>
      <div className="mf">
        <div style={{display:"flex",gap:6}}>
          {!isNew&&!s.locked&&<button className="b bd bs" onClick={()=>{if(confirm("Delete?"))onDel(s.id)}}>Delete</button>}
          {!isNew&&<button className="b bg bs" onClick={()=>{onDup(s);onClose()}}>Duplicate</button>}
          {s.locked&&<span style={{fontSize:10,color:"var(--t3)"}}>Anchor events can be edited but not deleted</span>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button className="b bg bs" onClick={onClose}>Cancel</button>
          <button className="b bp bs" onClick={()=>onSave(s)} disabled={!s.title.trim()}>{isNew?"Add Session":"Save"}</button>
        </div>
      </div>
    </div></div>
  );
}

function NEModal({onCreate,onClose}){
  const[name,setName]=useState("");
  const[d1,setD1]=useState("2026-05-12");
  const[d2,setD2]=useState("2026-05-13");
  const[d3,setD3]=useState("2026-05-14");
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div className="nem">
      <h2>Create New Event</h2>
      <p style={{fontSize:12,color:"var(--t2)",marginBottom:20,fontFamily:"'DM Sans',sans-serif"}}>
        Anchor events will auto-populate: Startup Showcase, Community Happy Hour, Registration, Networking Lunch, VIP Happy Hour, and Women in AI & Tech Breakfast.
      </p>
      <div className="fg">
        <div className="fgr f"><label className="fl">City Name</label><input className="fi" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Nashville, Cincinnati, Columbus..." /></div>
        <div className="fgr f" style={{marginTop:4}}><label className="fl">Day 1 — Community Day</label><input className="fi" type="date" value={d1} onChange={e=>{setD1(e.target.value);const dt=new Date(e.target.value);const x=new Date(dt);x.setDate(dt.getDate()+1);const y=new Date(dt);y.setDate(dt.getDate()+2);setD2(x.toISOString().split('T')[0]);setD3(y.toISOString().split('T')[0])}} /></div>
        <div className="fgr"><label className="fl">Day 2</label><input className="fi" type="date" value={d2} onChange={e=>setD2(e.target.value)} /></div>
        <div className="fgr"><label className="fl">Day 3</label><input className="fi" type="date" value={d3} onChange={e=>setD3(e.target.value)} /></div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
        <button className="b bg bs" onClick={onClose}>Cancel</button>
        <button className="b bp bs" disabled={!name.trim()} onClick={()=>onCreate(name.trim(),d1,d2,d3)}>Create Event</button>
      </div>
    </div></div>
  );
}
