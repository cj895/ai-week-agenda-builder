import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

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
const SESSION_TYPES = ["Keynote","Panel","Workshop","Fireside Chat","Roundtable","Presentation","Demo","Startup Pitch","Networking","Social Event","Debate"];
const TOPIC_TAGS = ["AI Strategy","Use Case Discovery","ROI","Change Management","Adoption","Workforce Readiness","Data Readiness","Data Governance","Data Architecture","Infrastructure","LLMs","Agents","RAG","Prompt Engineering","Model Evaluation","AI Security","Risk Management","Compliance","Privacy","Responsible AI","Executive Governance","Organizational Alignment","Implementation","Pilot to Production","Case Studies","Business Outcomes","Automation","Productivity","Marketing AI","Operations","Founders","Fundraising","Enterprise Sales","Community Building","Partnerships"];
const AUDIENCE_TAGS = ["Executive","Practitioner","Technical","Beginner Friendly","Advanced","Panel","Workshop","Roundtable","Fireside Chat","Case Study","Demo","Startup","Enterprise"];
// Time helpers: store in 24h, display in 12h, let users type naturally
function parseTime(input){
  if(!input)return null;
  let s=input.trim().toLowerCase().replace(/\s+/g,"");
  // Already 24h like "14:30"
  let m=s.match(/^(\d{1,2}):(\d{2})$/);
  if(m){const h=parseInt(m[1]),mi=parseInt(m[2]);if(h>=0&&h<=23&&mi>=0&&mi<=59)return String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0")}
  // 12h with am/pm like "2:30pm", "2:30 pm", "230pm"
  m=s.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)$/);
  if(m){let h=parseInt(m[1]),mi=parseInt(m[2]||"0");const ap=m[3];if(ap==="pm"&&h!==12)h+=12;if(ap==="am"&&h===12)h=0;if(h>=0&&h<=23&&mi>=0&&mi<=59)return String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0")}
  // Just a number like "9" or "14"
  m=s.match(/^(\d{1,2})$/);
  if(m){const h=parseInt(m[1]);if(h>=0&&h<=23)return String(h).padStart(2,"0")+":00"}
  // Number with am/pm like "9am" "2pm"
  m=s.match(/^(\d{1,2})(am|pm)$/);
  if(m){let h=parseInt(m[1]);const ap=m[2];if(ap==="pm"&&h!==12)h+=12;if(ap==="am"&&h===12)h=0;if(h>=0&&h<=23)return String(h).padStart(2,"0")+":00"}
  return null;
}
function to12h(t24){
  if(!t24)return"";
  const[hh,mm]=t24.split(":").map(Number);
  const ap=hh>=12?"PM":"AM";const h=hh===0?12:hh>12?hh-12:hh;
  return h+":"+String(mm).padStart(2,"0")+" "+ap;
}
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);

const ATL_STAGES=["Stage 1 \u2014 ATV Main Stage","Stage 2 \u2014 ATV Lennox Boardroom","Stage 3 \u2014 ATV Pitch Practice Room","Stage 4 \u2014 Roam Buckhead Garage","Stage 5 \u2014 Roam Forum","Stage 6 \u2014 TechRise Stage","Stage 7 \u2014 ATV Roundtable Room 1","Stage 8 \u2014 ATV Roundtable Room 2","Stage 9 \u2014 ATV Community Room"];
const DEFAULT_STAGES=["Stage 1 \u2014 Main Stage","Stage 2 \u2014 Breakout Room A","Stage 3 \u2014 Breakout Room B","Stage 4 \u2014 Breakout Room C","Stage 5 \u2014 Breakout Room D","Stage 6 \u2014 Breakout Room E","Stage 7 \u2014 Roundtable Room 1","Stage 8 \u2014 Roundtable Room 2","Stage 9 \u2014 Community Room"];

const toDb=(s,eventId)=>({id:s.id,event_id:eventId,date:s.date,start_time:s.startTime,end_time:s.endTime,title:s.title||"",track_id:s.trackId,session_type:s.sessionType,location:s.location,topic_tags:s.topicTags||[],audience_tags:s.audienceTags||[],speakers:s.speakers||[],sponsor:s.sponsor||"",description:s.description||"",status:s.status||"publish",locked:s.locked??true});
const fromDb=(r)=>({id:r.id,date:r.date,startTime:r.start_time,endTime:r.end_time,title:r.title||"",trackId:r.track_id,sessionType:r.session_type,location:r.location,topicTags:r.topic_tags||[],audienceTags:r.audience_tags||[],speakers:r.speakers||[],sponsor:r.sponsor||"",description:r.description||"",status:r.status||"publish",locked:r.locked??true});

const slot=(d,s,e,type,track,loc,title="")=>({id:uid(),date:d,startTime:s,endTime:e,sessionType:type,trackId:track,title,location:loc,topicTags:[],audienceTags:[],speakers:[],sponsor:"",description:"",status:"publish",locked:true});

function buildSkeleton(days,stg){
  const[S0,S1,S2,S3,S4,S5,S6,S7,S8]=[stg[0]||"Stage 1",stg[1]||"Stage 2",stg[2]||"Stage 3",stg[3]||"Stage 4",stg[4]||"Stage 5",stg[5]||"Stage 6",stg[6]||"Stage 7",stg[7]||"Stage 8",stg[8]||"Stage 9"];
  const[D1,D2,D3]=days.map(d=>d.id);const ss=[];
  ss.push(slot(D1,"15:00","15:10","Keynote","startup-showcase",S8,"Startup Showcase Welcome"));
  ss.push(slot(D1,"15:20","15:50","Panel","startup-showcase",S8));
  ss.push(slot(D1,"16:00","16:30","Startup Pitch","startup-showcase",S8));
  ss.push(slot(D1,"16:40","17:00","Panel","startup-showcase",S8));
  ss.push(slot(D1,"17:00","19:00","Social Event","networking",S8,"Community Happy Hour"));
  ss.push(slot(D2,"08:00","09:00","Networking","networking",S0,"Registration & Morning Networking"));
  ss.push(slot(D2,"09:00","09:15","Keynote","ai-in-action",S0));
  ss.push(slot(D2,"09:15","09:45","Keynote","ai-in-action",S0));
  ss.push(slot(D2,"09:45","10:15","Panel","ai-in-action",S0));
  ss.push(slot(D2,"10:15","10:50","Fireside Chat","ai-in-action",S0));
  const bSlots=[["11:40","12:10"],["12:20","12:50"],["13:40","14:10"],["14:20","14:50"],["15:00","15:30"]];
  const grid2=[
    [[S0,"ai-in-action","Keynote"],[S1,"exec-governance","Panel"],[S2,"marketing-ops","Fireside Chat"],[S3,"ai-security","Panel"],[S4,"ai-strategy","Panel"],[S5,"ai-adoption","Panel"],[S6,"architecture","Roundtable"],[S7,"ai-strategy","Roundtable"]],
    [[S0,"ai-security","Workshop"],[S1,"exec-governance","Presentation"],[S2,"marketing-ops","Panel"],[S3,"ai-security","Presentation"],[S4,"ai-strategy","Presentation"],[S5,"ai-adoption","Presentation"],[S6,"marketing-ops","Roundtable"],[S7,"ai-strategy","Roundtable"]],
    [[S0,"marketing-ops","Presentation"],[S1,"exec-governance","Presentation"],[S2,"data-infra","Presentation"],[S3,"ai-security","Presentation"],[S4,"ai-adoption","Panel"],[S5,"ai-strategy","Panel"],[S6,"marketing-ops","Roundtable"],[S7,"ai-strategy","Roundtable"]],
    [[S0,"ai-strategy","Debate"],[S1,"ai-adoption","Fireside Chat"],[S2,"marketing-ops","Workshop"],[S3,"architecture","Presentation"],[S4,"ai-strategy","Presentation"],[S5,"marketing-ops","Workshop"],[S6,"ai-adoption","Roundtable"]],
    [[S0,"ai-strategy","Workshop"],[S1,"marketing-ops","Presentation"],[S2,"marketing-ops","Presentation"],[S3,"architecture","Debate"],[S4,"ai-adoption","Debate"],[S5,"ai-strategy","Debate"]],
  ];
  bSlots.forEach(([st,en],si)=>{grid2[si].forEach(([loc,tr,ty])=>{ss.push(slot(D2,st,en,ty,tr,loc))})});
  ss.push(slot(D2,"13:00","13:30","Networking","networking",S8,"Networking Lunch"));
  ss.push(slot(D2,"16:00","18:00","Social Event","networking",S8,"VIP Happy Hour"));
  ss.push(slot(D3,"08:00","10:00","Social Event","networking",S8,"Women in AI & Tech Breakfast"));
  ss.push(slot(D3,"10:00","10:15","Keynote","ai-in-action",S0));
  ss.push(slot(D3,"10:15","10:45","Keynote","ai-in-action",S0));
  ss.push(slot(D3,"10:45","11:00","Fireside Chat","ai-in-action",S0));
  const grid3=[
    [[S0,"ai-in-action","Presentation"],[S1,"exec-governance","Panel"],[S2,"architecture","Panel"],[S3,"marketing-ops","Panel"],[S4,"data-infra","Panel"],[S5,"architecture","Panel"],[S6,"exec-governance","Roundtable"],[S7,"ai-strategy","Roundtable"]],
    [[S0,"ai-strategy","Panel"],[S1,"exec-governance","Presentation"],[S2,"architecture","Presentation"],[S3,"marketing-ops","Presentation"],[S4,"data-infra","Debate"],[S5,"ai-security","Presentation"],[S6,"ai-strategy","Roundtable"],[S7,"exec-governance","Roundtable"]],
    [[S0,"ai-strategy","Workshop"],[S1,"exec-governance","Debate"],[S2,"architecture","Panel"],[S3,"marketing-ops","Panel"],[S4,"data-infra","Panel"],[S5,"architecture","Workshop"]],
    [[S0,"ai-strategy","Workshop"],[S1,"ai-adoption","Fireside Chat"],[S2,"architecture","Workshop"],[S3,"ai-security","Presentation"],[S4,"ai-adoption","Workshop"],[S5,"marketing-ops","Presentation"]],
    [[S0,"ai-strategy","Panel"],[S1,"ai-adoption","Presentation"],[S2,"exec-governance","Workshop"],[S3,"ai-security","Presentation"],[S4,"ai-adoption","Workshop"],[S5,"ai-security","Debate"]],
  ];
  bSlots.forEach(([st,en],si)=>{grid3[si].forEach(([loc,tr,ty])=>{ss.push(slot(D3,st,en,ty,tr,loc))})});
  ss.push(slot(D3,"13:00","13:30","Networking","networking",S8,"Networking Lunch"));
  return ss;
}

function mkAtlanta(){
  const days=[{id:"2026-04-20",label:"Day 1",subtitle:"Community Day"},{id:"2026-04-21",label:"Day 2",subtitle:"Are We Ready?"},{id:"2026-04-22",label:"Day 3",subtitle:"How Do We Implement?"}];
  const ss=buildSkeleton(days,ATL_STAGES);
  const[D1,D2,D3]=days.map(d=>d.id);const[S0,S1,S2,S3,S4,S5,S6,S7,S8]=ATL_STAGES;
  const fill=(date,time,loc,data)=>{const s=ss.find(x=>x.date===date&&x.startTime===time&&x.location===loc);if(s)Object.assign(s,data)};
  fill(D1,"15:20",S8,{title:"How Buyers Evaluate AI and Cyber Vendors"});fill(D1,"16:00",S8,{title:"Startup Pitches \u2014 Round 1"});fill(D1,"16:40",S8,{title:"What Makes a Startup Stand Out and How Pilots Actually Work"});
  fill(D2,"09:00",S0,{title:"Welcome & Opening Remarks",sponsor:"Enterprise Technology Association"});fill(D2,"09:15",S0,{title:"What Happens After the Demo",sponsor:"CRZY Design",description:"Stephen Gates pulls back the curtain on how AI is actually being used in real client work.",topicTags:["Implementation","Case Studies","Business Outcomes"],audienceTags:["Executive","Practitioner"]});fill(D2,"09:45",S0,{title:"Inside Big Tech: How AI Actually Gets Built & Deployed"});fill(D2,"10:15",S0,{title:"AI Under Constraints: What Regulated Industries Can Teach Everyone Else"});
  fill(D2,"11:40",S0,{title:"Atlanta\u2019s Advantage: Why This City Will Lead AI"});fill(D2,"11:40",S1,{title:"The AI Governance Gap"});fill(D2,"11:40",S2,{title:"The AI Conversation Chain"});fill(D2,"11:40",S3,{title:"The New Risks Every Organization Needs to Understand",sponsor:"Axe.AI"});fill(D2,"11:40",S4,{title:"The Hidden Costs of Bad AI Execution"});fill(D2,"11:40",S5,{title:"What Every Workforce Needs to Embed in Their Culture"});fill(D2,"11:40",S6,{title:"What\u2019s in Your AI Stack?"});fill(D2,"11:40",S7,{title:"Moving from AI Experiments to Real Business Value"});
  fill(D2,"12:20",S0,{title:"Deepfakes and the Death of Trust"});fill(D2,"12:20",S1,{title:"Tales from the Trenches"});fill(D2,"12:20",S2,{title:"From Data to Demand"});fill(D2,"12:20",S3,{title:"Protecting Data, Models, and Workflows",sponsor:"Axe.AI"});fill(D2,"12:20",S4,{title:"Tackling AI in Manufacturing"});fill(D2,"12:20",S5,{title:"How Leaders Prepare Teams for AI Literacy",sponsor:"USAII"});fill(D2,"12:20",S6,{title:"How to Turn Event Leads into Revenue Using AI"});fill(D2,"12:20",S7,{title:"AI in Healthcare"});
  fill(D2,"13:40",S0,{title:"The Death of the American Salesman",sponsor:"AIprl Assist"});fill(D2,"13:40",S1,{title:"Operationalizing AI",sponsor:"Nexigen"});fill(D2,"13:40",S2,{title:"Your AI Is Only as Smart as Your Data",sponsor:"CapGemini"});fill(D2,"13:40",S3,{title:"Ready or Not? How America\u2019s AI Rules Will Change Everything"});fill(D2,"13:40",S4,{title:"The Human Side of AI"});fill(D2,"13:40",S5,{title:"Where Should You Actually Use AI?"});fill(D2,"13:40",S6,{title:"AI Is Changing Customer Experience"});fill(D2,"13:40",S7,{title:"AI in Fintech"});
  fill(D2,"14:20",S0,{title:"AI Adoption Gap: Enterprise vs. SMB"});fill(D2,"14:20",S1,{title:"The SMB AI Playbook"});fill(D2,"14:20",S2,{title:"Your Website Is Losing 97% of Buyers"});fill(D2,"14:20",S3,{title:"AI in the War Room"});fill(D2,"14:20",S4,{title:"The Future of AI Isn\u2019t Chatbots"});fill(D2,"14:20",S5,{title:"Film / Creative AI"});fill(D2,"14:20",S6,{title:"AI in Education"});
  fill(D2,"15:00",S0,{title:"Skills for Thrills"});fill(D2,"15:00",S1,{title:"Why Your ICP Is Wrong"});fill(D2,"15:00",S2,{title:"The AI-Powered Marketing Stack"});fill(D2,"15:00",S3,{title:"Infrastructure Wars"});fill(D2,"15:00",S4,{title:"Will AI Replace More Jobs Than It Creates?"});fill(D2,"15:00",S5,{title:"Start Fast or Start Right?"});
  fill(D3,"10:00",S0,{title:"Welcome to Day 3",sponsor:"Enterprise Technology Association"});fill(D3,"10:15",S0,{title:"Reality Bites: AI Governance in the Field"});fill(D3,"10:45",S0,{title:"Protecting Georgia\u2019s Children in the Age of AI",sponsor:"Enterprise Technology Association"});
  fill(D3,"11:40",S0,{title:"Inside a $2B Transformation"});fill(D3,"11:40",S1,{title:"When Your Eyes & Ears Are Powered by AI"});fill(D3,"11:40",S2,{title:"What\u2019s Real vs Hype?"});fill(D3,"11:40",S3,{title:"How to Make AI a Daily Habit"});fill(D3,"11:40",S4,{title:"AI Governance vs Speed"});fill(D3,"11:40",S5,{title:"Agentic Coding Tools"});fill(D3,"11:40",S6,{title:"What\u2019s Blocking Your AI?",sponsor:"Nexigen"});fill(D3,"11:40",S7,{title:"Healthcare: Where Is AI Making a Difference?"});
  fill(D3,"12:20",S0,{title:"How Enterprise Teams Are Adopting AI"});fill(D3,"12:20",S1,{title:"How to Stay Human"});fill(D3,"12:20",S2,{title:"From Prototype to Production"});fill(D3,"12:20",S3,{title:"AI in the Flow of Work",sponsor:"CapGemini"});fill(D3,"12:20",S4,{title:"Vendors vs. In-House"});fill(D3,"12:20",S5,{title:"Building IP in the Age of GenAI"});fill(D3,"12:20",S6,{title:"Where Is AI Driving Revenue?"});fill(D3,"12:20",S7,{title:"AI Risk Roundtable"});
  fill(D3,"13:40",S0,{title:"Robots Are Ready. Are Your Teams?"});fill(D3,"13:40",S1,{title:"Who Should Own AI Risk?"});fill(D3,"13:40",S2,{title:"Building AI Products with Gen AI"});fill(D3,"13:40",S3,{title:"Building AI for the 99%"});fill(D3,"13:40",S4,{title:"What to Watch When AI Goes Live"});fill(D3,"13:40",S5,{title:"What Game Design Teaches Us About AI"});
  fill(D3,"14:20",S0,{title:"Blue Collar AI 2.0"});fill(D3,"14:20",S1,{title:"The AI Talent Gap"});fill(D3,"14:20",S2,{title:"Build Your First GenAI App"});fill(D3,"14:20",S3,{title:"Red Teaming AI",sponsor:"AXE.AI"});fill(D3,"14:20",S4,{title:"AI Isn\u2019t Failing \u2014 Our Learning Models Are",sponsor:"USAII"});fill(D3,"14:20",S5,{title:"How AI Is Rewriting Search"});
  fill(D3,"15:00",S0,{title:"Eliminate Busywork and Scale Without Hiring"});fill(D3,"15:00",S1,{title:"The Small Business GenAI Playbook"});fill(D3,"15:00",S2,{title:"Governed by Design"});fill(D3,"15:00",S3,{title:"AI Governance in Practice",sponsor:"Nexigen"});fill(D3,"15:00",S4,{title:"AI, Creativity, and Community"});fill(D3,"15:00",S5,{title:"Is AI Strengthening Security?"});
  return{id:"atlanta-2026",name:"Atlanta",dates:days.map(d=>d.id),days,stages:ATL_STAGES,sessions:ss};
}

const font=`'Poppins','DM Sans',system-ui,sans-serif`;const mono=`'JetBrains Mono',monospace`;
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
.saving{position:fixed;bottom:20px;right:20px;background:var(--prussian);color:var(--aqua);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;padding:8px 16px;border-radius:25px;z-index:200;opacity:0;transition:opacity .3s;pointer-events:none}.saving.show{opacity:1}
.evs{display:flex;gap:4px;margin-top:10px;flex-wrap:wrap;align-items:center}
.evb{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:6px 14px;border-radius:25px;cursor:pointer;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:rgba(255,255,255,.55);transition:all .2s}.evb:hover{background:rgba(255,255,255,.15);color:#fff}.evb.a{background:white;color:var(--prussian);border-color:white;font-weight:800}.evb.add{border-style:dashed;border-color:rgba(255,255,255,.3)}
.dt{display:flex;gap:3px;margin-top:10px;flex-wrap:wrap}
.dtb{font-family:'DM Sans',sans-serif;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.04em;padding:7px 14px;border-radius:25px;cursor:pointer;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(255,255,255,.55);transition:all .2s;white-space:nowrap}.dtb:hover{background:rgba(255,255,255,.12);color:#fff}.dtb.a{background:var(--aqua);color:var(--prussian);border-color:var(--aqua)}
.sb{display:flex;gap:20px;padding:14px 28px;background:#fff;border-bottom:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.st{display:flex;align-items:baseline;gap:5px}.sn{font-weight:800;font-size:20px;color:var(--spectrum)}.sn.warn{color:#F59E0B}.sl{font-family:'DM Sans',sans-serif;font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.04em}
.fb{display:flex;gap:8px;padding:14px 28px;background:#fff;border-bottom:1px solid var(--bdr);flex-wrap:wrap;align-items:center}
.si{font-family:'DM Sans',sans-serif;font-size:12px;border:1px solid var(--bdr);border-radius:25px;padding:7px 14px;background:var(--bg2);min-width:200px;color:var(--t1)}.si:focus{outline:none;border-color:var(--azure)}
.fs{font-family:'DM Sans',sans-serif;font-size:11px;border:1px solid var(--bdr);border-radius:25px;padding:7px 12px;background:#fff;color:var(--t1);cursor:pointer}
.ag{display:grid;gap:10px;padding:20px 28px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.sc{background:#fff;border-radius:var(--r);border:1px solid var(--bdr);overflow:hidden;cursor:grab;transition:all .2s;box-shadow:var(--sh)}.sc:hover{box-shadow:var(--shl);transform:translateY(-2px)}.sc.empty{border:2px dashed #F59E0B;background:rgba(245,158,11,.03)}
.sc.dragging{opacity:.4;transform:scale(.95);box-shadow:none}
.sc:active{cursor:grabbing}
.ctb{height:4px;width:100%}.cb{padding:14px}
.ct{font-family:${mono};font-size:10px;color:var(--t3);margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
.ctl{font-weight:700;font-size:13px;line-height:1.35;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.ctl.needs{color:#F59E0B;font-style:italic}
.cm{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}
.cp{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:2px 7px;border-radius:25px}
.csp{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--t2);display:flex;align-items:center;gap:3px;margin-top:6px}
.cl{font-family:'DM Sans',sans-serif;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.03em;margin-top:3px}
.cspon{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--spectrum);font-weight:600;margin-top:4px}
.mo{position:fixed;inset:0;background:rgba(0,19,36,.55);backdrop-filter:blur(3px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.ml{background:#fff;border-radius:20px;width:100%;max-width:700px;max-height:92vh;overflow-y:auto;box-shadow:var(--shl)}
.mh{padding:20px 24px 14px;border-bottom:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1;border-radius:20px 20px 0 0}.mh h2{font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:-.02em}
.mb{padding:20px 24px}.mf{padding:14px 24px 20px;border-top:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center;position:sticky;bottom:0;background:#fff;border-radius:0 0 20px 20px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}.fgr{display:flex;flex-direction:column;gap:5px}.fgr.f{grid-column:1/-1}
.fl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3)}
.fi,.fsl,.fta{font-family:'DM Sans',sans-serif;font-size:13px;color:var(--t1);border:1px solid var(--bdr);border-radius:var(--rs);padding:9px 12px;background:var(--bg2);width:100%;transition:border-color .2s}.fi:focus,.fsl:focus,.fta:focus{outline:none;border-color:var(--azure)}
.fta{min-height:70px;resize:vertical}
.tg{display:flex;flex-wrap:wrap;gap:5px}
.tc{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;padding:4px 10px;border-radius:25px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--t2);transition:all .15s;user-select:none}.tc.s{background:var(--spectrum);color:#fff;border-color:var(--spectrum)}.tc.s2{background:var(--prussian);color:#fff;border-color:var(--prussian)}
.xb{width:30px;height:30px;border-radius:50%;border:1px solid var(--bdr);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--t2);transition:all .2s}.xb:hover{background:var(--bg2);color:var(--t1)}
.es{text-align:center;padding:60px 28px;color:var(--t3)}.es h3{font-weight:800;font-size:18px;text-transform:uppercase;margin-bottom:6px;color:var(--t2)}.es p{font-family:'DM Sans',sans-serif;font-size:13px;margin-bottom:20px}
.nem{background:#fff;border-radius:20px;padding:28px;max-width:540px;width:100%;box-shadow:var(--shl)}.nem h2{font-weight:800;font-size:18px;text-transform:uppercase;margin-bottom:16px}
.fonly{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.fbtn{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;padding:4px 10px;border-radius:25px;cursor:pointer;border:1px solid var(--bdr);background:#fff;color:var(--t2)}.fbtn.active{background:var(--aqua);color:var(--prussian);border-color:var(--aqua)}
.load{display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:${font};font-weight:800;font-size:16px;color:var(--t3);text-transform:uppercase}
.stg-row{display:flex;gap:6px;align-items:center;margin-bottom:8px}
.stg-row input{flex:1}
.stg-num{font-family:${mono};font-size:10px;color:var(--t3);width:18px;text-align:right;flex-shrink:0}
.stg-del{width:24px;height:24px;border-radius:50%;border:1px solid var(--bdr);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--t3);flex-shrink:0}.stg-del:hover{background:#fee;color:#ef4444;border-color:#ef4444}
@media(max-width:640px){.hd{padding:16px 14px 14px}.sb,.fb,.ag{padding-left:14px;padding-right:14px}.ag{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.ml,.nem{max-width:100%}}
`;

export default function AgendaBuilder(){
  const[events,setEvents]=useState([]);const[eid,setEid]=useState(null);const[aDay,setADay]=useState(null);
  const[edit,setEdit]=useState(null);const[modal,setModal]=useState(false);
  const[neModal,setNeModal]=useState(false);const[stgModal,setStgModal]=useState(false);
  const[search,setSearch]=useState("");const[fT,setFT]=useState("all");const[fL,setFL]=useState("all");const[fTy,setFTy]=useState("all");const[fEmpty,setFEmpty]=useState("all");
  const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);
  const[dragId,setDragId]=useState(null);
  const saveTimer=useRef(null);
  const flash=()=>{setSaving(true);clearTimeout(saveTimer.current);saveTimer.current=setTimeout(()=>setSaving(false),1200)};

  useEffect(()=>{(async()=>{
    const{data:evRows}=await supabase.from("events").select("*").order("created_at");
    if(evRows&&evRows.length>0){
      const{data:sessRows}=await supabase.from("sessions").select("*");
      const loaded=evRows.map(e=>({id:e.id,name:e.name,dates:e.dates,days:e.days,stages:e.stages||ATL_STAGES,sessions:(sessRows||[]).filter(s=>s.event_id===e.id).map(fromDb)}));
      setEvents(loaded);setEid(loaded[0].id);setADay(loaded[0].days[1]?.id||loaded[0].days[0].id);
    } else {
      const atl=mkAtlanta();const evId=atl.id;
      await supabase.from("events").insert({id:evId,name:atl.name,dates:atl.dates,days:atl.days,stages:atl.stages});
      const dbRows=atl.sessions.map(s=>toDb(s,evId));
      for(let i=0;i<dbRows.length;i+=50){await supabase.from("sessions").insert(dbRows.slice(i,i+50))}
      setEvents([atl]);setEid(evId);setADay(atl.days[1].id);
    }
    setLoading(false);
  })()},[]);

  const ev=events.find(e=>e.id===eid);const ss=ev?.sessions||[];const days=ev?.days||[];const stages=ev?.stages||ATL_STAGES;
  const trk=id=>TRACKS.find(t=>t.id===id)||TRACKS[0];
  const isEmpty=s=>!s.title.trim();const emptyCount=ss.filter(isEmpty).length;const filledCount=ss.filter(s=>!isEmpty(s)).length;
  const filtered=ss.filter(s=>{if(s.date!==aDay)return false;if(fT!=="all"&&s.trackId!==fT)return false;if(fL!=="all"&&s.location!==fL)return false;if(fTy!=="all"&&s.sessionType!==fTy)return false;if(fEmpty==="empty"&&!isEmpty(s))return false;if(fEmpty==="filled"&&isEmpty(s))return false;if(search){const q=search.toLowerCase();return s.title.toLowerCase().includes(q)||s.speakers?.some(sp=>sp.toLowerCase().includes(q))||s.description?.toLowerCase().includes(q)||s.sponsor?.toLowerCase().includes(q)}return true}).sort((a,b)=>a.startTime.localeCompare(b.startTime)||a.location.localeCompare(b.location));
  const dc={};days.forEach(d=>{dc[d.id]=ss.filter(x=>x.date===d.id).length});
  const dcE={};days.forEach(d=>{dcE[d.id]=ss.filter(x=>x.date===d.id&&isEmpty(x)).length});

  const save=async(s)=>{setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:e.sessions.find(x=>x.id===s.id)?e.sessions.map(x=>x.id===s.id?s:x):[...e.sessions,s]}:e));setModal(false);setEdit(null);flash();await supabase.from("sessions").upsert(toDb(s,eid))};
  const del=async(id)=>{setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:e.sessions.filter(x=>x.id!==id)}:e));setModal(false);setEdit(null);flash();await supabase.from("sessions").delete().eq("id",id)};
  const dup=async(s)=>{const n={...s,id:uid(),title:s.title?(s.title+" (Copy)"):"",speakers:[...(s.speakers||[])],topicTags:[...(s.topicTags||[])],audienceTags:[...(s.audienceTags||[])],locked:false};setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:[...e.sessions,n]}:e));flash();await supabase.from("sessions").insert(toDb(n,eid))};

  const createEv=async(name,d1,d2,d3,stgs)=>{
    const ds=[{id:d1,label:"Day 1",subtitle:"Community Day"},{id:d2,label:"Day 2",subtitle:"Conference Day 1"},{id:d3,label:"Day 3",subtitle:"Conference Day 2"}];
    const evId=uid();const newSs=buildSkeleton(ds,stgs);
    await supabase.from("events").insert({id:evId,name,dates:[d1,d2,d3],days:ds,stages:stgs});
    const dbRows=newSs.map(s=>toDb(s,evId));
    for(let i=0;i<dbRows.length;i+=50){await supabase.from("sessions").insert(dbRows.slice(i,i+50))}
    setEvents(p=>[...p,{id:evId,name,dates:[d1,d2,d3],days:ds,stages:stgs,sessions:newSs}]);
    setEid(evId);setADay(ds[1].id);setNeModal(false);flash();
  };

  const saveStages=async(newStages)=>{
    setEvents(p=>p.map(e=>e.id===eid?{...e,stages:newStages}:e));
    flash();await supabase.from("events").update({stages:newStages}).eq("id",eid);
    setStgModal(false);
  };

  const resetSkeleton=async()=>{if(!ev||!confirm("Reset "+ev.name+" to empty skeleton?"))return;const ss2=buildSkeleton(ev.days,stages);await supabase.from("sessions").delete().eq("event_id",eid);const dbRows=ss2.map(s=>toDb(s,eid));for(let i=0;i<dbRows.length;i+=50){await supabase.from("sessions").insert(dbRows.slice(i,i+50))}setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:ss2}:e));flash()};

  // Drag-and-drop: swap time+location between two sessions
  const swapSessions=async(idA,idB)=>{
    if(idA===idB)return;
    const a=ss.find(x=>x.id===idA),b=ss.find(x=>x.id===idB);
    if(!a||!b)return;
    const swapped_a={...a,startTime:b.startTime,endTime:b.endTime,location:b.location};
    const swapped_b={...b,startTime:a.startTime,endTime:a.endTime,location:a.location};
    setEvents(p=>p.map(e=>e.id===eid?{...e,sessions:e.sessions.map(x=>x.id===idA?swapped_a:x.id===idB?swapped_b:x)}:e));
    flash();
    await supabase.from("sessions").upsert(toDb(swapped_a,eid));
    await supabase.from("sessions").upsert(toDb(swapped_b,eid));
  };

  // Add a new stage to this event
  const addStage=async(name)=>{
    if(!name.trim()||stages.includes(name.trim()))return;
    const updated=[...stages,name.trim()];
    setEvents(p=>p.map(e=>e.id===eid?{...e,stages:updated}:e));
    flash();await supabase.from("events").update({stages:updated}).eq("id",eid);
  };

  const newS=()=>({id:uid(),date:aDay||days[1]?.id||days[0]?.id,startTime:"11:40",endTime:"12:10",title:"",trackId:"ai-in-action",sessionType:"Panel",location:stages[0]||"Stage 1",topicTags:[],audienceTags:[],speakers:[],sponsor:"",description:"",status:"publish",locked:false});

  const exportCSV=()=>{if(!ev)return;const hdr=["Date","Track","Title","Start Time","End Time","Location","Checkin Type","Background Color","Text Color","Tags","Speakers","Session Type","RSVP","Capacity","Sponsor","Description","Main Video","Main Video Restrict","Other Video1","Other Video1 Restrict","Other Video2","Other Video2 Restrict","Other Video3","Other Video3 Restrict","Other Video4","Other Video4 Restrict","File1","File2","File3","File4","File5","Send Push Before #Minutes","Send Push Text","Status"];const esc=v=>{const x=String(v||"");return x.includes(",")||x.includes('"')||x.includes("\n")?`"${x.replace(/"/g,'""')}"`:x};const rows=[...ss].sort((a,b)=>a.date.localeCompare(b.date)||a.startTime.localeCompare(b.startTime)||a.location.localeCompare(b.location)).map(s=>{const t=trk(s.trackId);const tags=[...(s.topicTags||[]),...(s.audienceTags||[])].join(",");return[s.date,t.name,s.title||"TBD",s.startTime,s.endTime,s.location,"",t.bg,t.fg,tags,(s.speakers||[]).join(","),s.sessionType,"No","Unlimited",s.sponsor||"",s.description||"","","","","","","","","","","","","","","","","","",s.status].map(esc).join(",")});const csv="\uFEFF"+hdr.join(",")+"\n"+rows.join("\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=ev.name+"_AI_Week_Eventify.csv";a.click();URL.revokeObjectURL(url)};

  if(loading)return<div className="D"><style>{css}</style><div className="load">Loading agenda...</div></div>;
  return(
    <div className="D"><style>{css}</style>
    <div className={`saving ${saving?"show":""}`}>Saved to cloud</div>
    <div className="hd">
      <div className="hr">
        <div><h1>AI Week Agenda Builder</h1><div className="sub">Multi-City {"\u2022"} Cloud-Synced {"\u2022"} Eventify Ready</div></div>
        <div className="ha">
          <button className="b bo bs" onClick={exportCSV} disabled={!ss.length}>{"\u2193"} Export CSV</button>
          <button className="b ba bs" onClick={()=>{setEdit(newS());setModal(true)}}>+ Add Session</button>
        </div>
      </div>
      <div className="evs">
        {events.map(e=><button key={e.id} className={`evb ${eid===e.id?"a":""}`} onClick={()=>{setEid(e.id);setADay(e.days[1]?.id||e.days[0]?.id)}}>{e.name}</button>)}
        <button className="evb add" onClick={()=>setNeModal(true)}>+ New Event</button>
      </div>
      {days.length>0&&<div className="dt">{days.map(d=><button key={d.id} className={`dtb ${aDay===d.id?"a":""}`} onClick={()=>setADay(d.id)}>{d.label} {"\u2014"} {d.subtitle} ({dc[d.id]||0}){dcE[d.id]>0&&<span style={{opacity:.6,marginLeft:4}}>{"\u2022"} {dcE[d.id]} open</span>}</button>)}</div>}
    </div>
    <div className="sb">
      <div className="st"><span className="sn">{ss.length}</span><span className="sl">Slots</span></div>
      <div className="st"><span className="sn">{filledCount}</span><span className="sl">Filled</span></div>
      <div className="st"><span className={`sn ${emptyCount>0?"warn":""}`}>{emptyCount}</span><span className="sl">Open</span></div>
      <div className="st"><span className="sn">{new Set(ss.flatMap(s=>s.speakers||[])).size}</span><span className="sl">Speakers</span></div>
      <div className="st"><span className="sn">{new Set(ss.filter(s=>s.sponsor?.trim()).map(s=>s.sponsor)).size}</span><span className="sl">Sponsors</span></div>
      <div style={{flex:1}}/>
      <button className="b bg bs" onClick={()=>setStgModal(true)}>{"\u2699"} Stages</button>
      {ev&&<button className="b bg bs" onClick={resetSkeleton}>Reset</button>}
    </div>
    <div className="fb">
      <input className="si" placeholder="Search sessions, speakers, sponsors..." value={search} onChange={e=>setSearch(e.target.value)} />
      <select className="fs" value={fT} onChange={e=>setFT(e.target.value)}><option value="all">All Tracks</option>{TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
      <select className="fs" value={fL} onChange={e=>setFL(e.target.value)}><option value="all">All Stages</option>{stages.map(l=><option key={l} value={l}>{l}</option>)}</select>
      <select className="fs" value={fTy} onChange={e=>setFTy(e.target.value)}><option value="all">All Types</option>{SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
      <div className="fonly">{["all","empty","filled"].map(v=><button key={v} className={`fbtn ${fEmpty===v?"active":""}`} onClick={()=>setFEmpty(v)}>{v==="all"?"All":v==="empty"?"Open Slots":"Filled"}</button>)}</div>
    </div>
    {filtered.length===0?(<div className="es"><h3>No Matches</h3><p>Try adjusting filters.</p></div>):(
      <div className="ag">{filtered.map(s=>{const t=trk(s.trackId);const empty=isEmpty(s);return(
        <div key={s.id} className={`sc ${empty?"empty":""} ${dragId===s.id?"dragging":""}`} draggable
          onDragStart={e=>{setDragId(s.id);e.dataTransfer.effectAllowed="move"}}
          onDragEnd={()=>setDragId(null)}
          onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move"}}
          onDrop={e=>{e.preventDefault();if(dragId&&dragId!==s.id)swapSessions(dragId,s.id);setDragId(null)}}
          onClick={()=>{if(dragId)return;setEdit({...s,speakers:[...(s.speakers||[])],topicTags:[...(s.topicTags||[])],audienceTags:[...(s.audienceTags||[])]});setModal(true)}}>
          <div className="ctb" style={{background:t.bg}}/><div className="cb">
            <div className="ct"><span>{"\u2630"} {to12h(s.startTime)} {"\u2014"} {to12h(s.endTime)}</span><span className="cp" style={{background:t.bg+"20",color:t.bg}}>{t.name.length>28?t.name.slice(0,25)+"\u2026":t.name}</span></div>
            <div className={`ctl ${empty?"needs":""}`}>{empty?"\u26A0 OPEN SLOT \u2014 Needs Title":s.title}</div>
            <div className="cm"><span className="cp" style={{background:"var(--bg2)",color:"var(--t2)"}}>{s.sessionType}</span>{(s.topicTags||[]).slice(0,2).map(tg=><span key={tg} className="cp" style={{background:"rgba(0,132,255,.08)",color:"var(--azure)"}}>{tg}</span>)}</div>
            {s.sponsor?.trim()&&<div className="cspon">Sponsored by {s.sponsor}</div>}
            {(s.speakers||[]).length>0&&<div className="csp">{"\uD83C\uDFA4"} {s.speakers.slice(0,3).join(", ")}{s.speakers.length>3?` +${s.speakers.length-3}`:""}</div>}
            <div className="cl">{"\uD83D\uDCCD"} {s.location}</div>
          </div></div>)})}</div>)}
    {modal&&edit&&<SModal s={edit} days={days} stages={stages} isNew={!ss.find(x=>x.id===edit.id)} onSave={save} onDel={del} onDup={dup} onAddStage={addStage} onClose={()=>{setModal(false);setEdit(null)}} />}
    {neModal&&<NEModal onCreate={createEv} onClose={()=>setNeModal(false)} />}
    {stgModal&&<StgModal stages={stages} onSave={saveStages} onClose={()=>setStgModal(false)} />}
    </div>);
}

function SModal({s:init,days,stages,isNew,onSave,onDel,onDup,onAddStage,onClose}){
  const[s,setS]=useState(init);const[spk,setSpk]=useState("");const[busy,setBusy]=useState(false);
  const[addingStage,setAddingStage]=useState(false);const[newStg,setNewStg]=useState("");
  const[startDisp,setStartDisp]=useState(to12h(init.startTime));
  const[endDisp,setEndDisp]=useState(to12h(init.endTime));
  const[startErr,setStartErr]=useState(false);
  const[endErr,setEndErr]=useState(false);
  const set=(k,v)=>setS(p=>({...p,[k]:v}));
  const addSp=()=>{const n=spk.trim();if(n&&!(s.speakers||[]).includes(n)){set("speakers",[...(s.speakers||[]),n]);setSpk("")}};
  const remSp=i=>set("speakers",(s.speakers||[]).filter((_,j)=>j!==i));
  const togT=t=>{const tags=s.topicTags||[];set("topicTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};
  const togA=t=>{const tags=s.audienceTags||[];set("audienceTags",tags.includes(t)?tags.filter(x=>x!==t):[...tags,t])};
  const doSave=async()=>{setBusy(true);await onSave(s);setBusy(false)};
  const doAddStage=async()=>{const n=newStg.trim();if(!n)return;await onAddStage(n);set("location",n);setNewStg("");setAddingStage(false)};
  const handleStartBlur=()=>{const p=parseTime(startDisp);if(p){set("startTime",p);setStartDisp(to12h(p));setStartErr(false)}else{setStartErr(true)}};
  const handleEndBlur=()=>{const p=parseTime(endDisp);if(p){set("endTime",p);setEndDisp(to12h(p));setEndErr(false)}else{setEndErr(true)}};
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="ml">
      <div className="mh"><h2>{isNew?"Add Session":"Edit Session"}</h2><button className="xb" onClick={onClose}>{"\u00D7"}</button></div>
      <div className="mb">
        <div className="fgr f" style={{marginBottom:14}}><label className="fl">Session Title</label><input className="fi" value={s.title} onChange={e=>set("title",e.target.value)} placeholder="Enter session title..." style={{fontSize:15,fontWeight:600}} /></div>
        <div className="fg">
          <div className="fgr"><label className="fl">Date</label><select className="fsl" value={s.date} onChange={e=>set("date",e.target.value)}>{days.map(d=><option key={d.id} value={d.id}>{d.label} {"\u2014"} {d.subtitle}</option>)}</select></div>
          <div className="fgr"><label className="fl">Stage</label>
            {addingStage?(
              <div style={{display:"flex",gap:6}}>
                <input className="fi" value={newStg} onChange={e=>setNewStg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();doAddStage()}}} placeholder="New stage name..." autoFocus />
                <button className="b bp bs" onClick={doAddStage}>Add</button>
                <button className="b bg bs" onClick={()=>setAddingStage(false)}>{"\u00D7"}</button>
              </div>
            ):(
              <div style={{display:"flex",gap:6}}>
                <select className="fsl" style={{flex:1}} value={s.location} onChange={e=>set("location",e.target.value)}>{stages.map(l=><option key={l} value={l}>{l}</option>)}</select>
                <button className="b bg bs" onClick={()=>setAddingStage(true)} title="Add new stage">+</button>
              </div>
            )}
          </div>
          <div className="fgr"><label className="fl">Start Time</label><input className="fi" style={startErr?{borderColor:"#EF4444"}:{}} value={startDisp} onChange={e=>{setStartDisp(e.target.value);setStartErr(false)}} onBlur={handleStartBlur} placeholder="e.g. 9:00 AM, 2pm, 14:30" /></div>
          <div className="fgr"><label className="fl">End Time</label><input className="fi" style={endErr?{borderColor:"#EF4444"}:{}} value={endDisp} onChange={e=>{setEndDisp(e.target.value);setEndErr(false)}} onBlur={handleEndBlur} placeholder="e.g. 10:30 AM, 3pm, 15:30" /></div>
          <div className="fgr"><label className="fl">Track</label><select className="fsl" value={s.trackId} onChange={e=>set("trackId",e.target.value)}>{TRACKS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
          <div className="fgr"><label className="fl">Session Type</label><select className="fsl" value={s.sessionType} onChange={e=>set("sessionType",e.target.value)}>{SESSION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        </div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Sponsor</label><input className="fi" value={s.sponsor||""} onChange={e=>set("sponsor",e.target.value)} placeholder="Sponsor name (optional)..." /></div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Speakers</label>
          <div style={{display:"flex",gap:6}}><input className="fi" value={spk} onChange={e=>setSpk(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSp()}}} placeholder="Type name, press Enter..." /><button className="b bp bs" onClick={addSp}>Add</button></div>
          {(s.speakers||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>{s.speakers.map((sp,i)=><span key={i} className="cp" style={{background:"var(--prussian)",color:"#fff",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",fontSize:11}}>{sp}<span onClick={()=>remSp(i)} style={{cursor:"pointer",opacity:.6,fontSize:13,lineHeight:1}}>{"\u00D7"}</span></span>)}</div>}
        </div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Topic Tags</label><div className="tg">{TOPIC_TAGS.map(t=><span key={t} className={`tc ${(s.topicTags||[]).includes(t)?"s":""}`} onClick={()=>togT(t)}>{t}</span>)}</div></div>
        <div className="fgr f" style={{marginTop:14}}><label className="fl">Audience & Format Tags</label><div className="tg">{AUDIENCE_TAGS.map(t=><span key={t} className={`tc ${(s.audienceTags||[]).includes(t)?"s2":""}`} onClick={()=>togA(t)}>{t}</span>)}</div></div>
        <div className="fgr f" style={{marginTop:18}}><label className="fl">Description</label><textarea className="fta" value={s.description||""} onChange={e=>set("description",e.target.value)} placeholder="Session description..." /></div>
      </div>
      <div className="mf">
        <div style={{display:"flex",gap:6}}>
          {!isNew&&<button className="b bd bs" onClick={async()=>{if(!confirm("Delete this session?"))return;setBusy(true);await onDel(s.id);setBusy(false)}} disabled={busy}>Delete</button>}
          {!isNew&&<button className="b bg bs" onClick={async()=>{setBusy(true);await onDup(s);onClose();setBusy(false)}} disabled={busy}>Duplicate</button>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button className="b bg bs" onClick={onClose}>Cancel</button>
          <button className="b bp bs" onClick={doSave} disabled={busy}>{busy?"Saving...":isNew?"Add Session":"Save"}</button>
        </div>
      </div>
    </div></div>);
}

function StgModal({stages:init,onSave,onClose}){
  const[stgs,setStgs]=useState([...init]);const[busy,setBusy]=useState(false);
  const upd=(i,v)=>{const n=[...stgs];n[i]=v;setStgs(n)};
  const add=()=>setStgs([...stgs,`Stage ${stgs.length+1} \u2014 New Venue`]);
  const rem=(i)=>{if(stgs.length<=1)return;setStgs(stgs.filter((_,j)=>j!==i))};
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="nem" style={{maxWidth:520}}>
      <h2>Manage Stages</h2>
      <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Edit venue names for this event. Changes apply to future sessions. Existing sessions keep their assigned stage name.</p>
      <div style={{maxHeight:400,overflowY:"auto",marginBottom:16}}>
        {stgs.map((s,i)=>(
          <div key={i} className="stg-row">
            <span className="stg-num">{i+1}</span>
            <input className="fi" value={s} onChange={e=>upd(i,e.target.value)} />
            <button className="stg-del" onClick={()=>rem(i)} title="Remove stage">{"\u00D7"}</button>
          </div>
        ))}
      </div>
      <button className="b bg bs" onClick={add} style={{marginBottom:16}}>+ Add Stage</button>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button className="b bg bs" onClick={onClose}>Cancel</button>
        <button className="b bp bs" disabled={busy||stgs.some(s=>!s.trim())} onClick={async()=>{setBusy(true);await onSave(stgs.filter(s=>s.trim()));setBusy(false)}}>{busy?"Saving...":"Save Stages"}</button>
      </div>
    </div></div>);
}

function NEModal({onCreate,onClose}){
  const[step,setStep]=useState(1);const[name,setName]=useState("");const[busy,setBusy]=useState(false);
  const[d1,setD1]=useState("2026-05-12");const[d2,setD2]=useState("2026-05-13");const[d3,setD3]=useState("2026-05-14");
  const[stgs,setStgs]=useState([...DEFAULT_STAGES]);
  const updStg=(i,v)=>{const n=[...stgs];n[i]=v;setStgs(n)};
  const addStg=()=>setStgs([...stgs,`Stage ${stgs.length+1} \u2014 New Venue`]);
  const remStg=i=>{if(stgs.length<=1)return;setStgs(stgs.filter((_,j)=>j!==i))};
  return(
    <div className="mo" onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="nem">
      <h2>{step===1?"New Event":"Set Up Stages"}</h2>
      {step===1?(<>
        <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Enter the city and dates. Next you'll set up the venues/stages.</p>
        <div className="fg">
          <div className="fgr f"><label className="fl">City Name</label><input className="fi" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Nashville, Cincinnati..." /></div>
          <div className="fgr f" style={{marginTop:4}}><label className="fl">Day 1</label><input className="fi" type="date" value={d1} onChange={e=>{setD1(e.target.value);const dt=new Date(e.target.value);const x=new Date(dt);x.setDate(dt.getDate()+1);const y=new Date(dt);y.setDate(dt.getDate()+2);setD2(x.toISOString().split('T')[0]);setD3(y.toISOString().split('T')[0])}} /></div>
          <div className="fgr"><label className="fl">Day 2</label><input className="fi" type="date" value={d2} onChange={e=>setD2(e.target.value)} /></div>
          <div className="fgr"><label className="fl">Day 3</label><input className="fi" type="date" value={d3} onChange={e=>setD3(e.target.value)} /></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <button className="b bg bs" onClick={onClose}>Cancel</button>
          <button className="b bp bs" disabled={!name.trim()} onClick={()=>setStep(2)}>Next: Stages {"\u2192"}</button>
        </div>
      </>):(<>
        <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Enter the venue names for {name}. Stage 1 is your Main Stage. The last stage is used for social events (Happy Hour, Breakfast, Lunch). You can edit these later.</p>
        <div style={{maxHeight:360,overflowY:"auto",marginBottom:12}}>
          {stgs.map((s,i)=>(
            <div key={i} className="stg-row">
              <span className="stg-num">{i+1}</span>
              <input className="fi" value={s} onChange={e=>updStg(i,e.target.value)} placeholder={`Stage ${i+1} name...`} />
              <button className="stg-del" onClick={()=>remStg(i)}>{"\u00D7"}</button>
            </div>
          ))}
        </div>
        <button className="b bg bs" onClick={addStg} style={{marginBottom:16}}>+ Add Stage</button>
        <div style={{display:"flex",gap:8,justifyContent:"space-between",marginTop:8}}>
          <button className="b bg bs" onClick={()=>setStep(1)}>{"\u2190"} Back</button>
          <button className="b bp bs" disabled={busy||stgs.some(s=>!s.trim())} onClick={async()=>{setBusy(true);await onCreate(name.trim(),d1,d2,d3,stgs.filter(s=>s.trim()));setBusy(false)}}>{busy?"Creating...":"Create Event"}</button>
        </div>
      </>)}
    </div></div>);
}
