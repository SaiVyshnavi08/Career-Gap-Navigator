import { useState, useEffect, useRef } from "react";

const THEIRSTACK_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOjEsImp0aSI6Ijg2MGFmZDM2LTk5MDktNGZjYy1hMjI0LTc2ODE0ZTA5ZTVlNSIsImNyZWF0ZWRfYnkiOjE0OTg3MSwicGVybWlzc2lvbnMiOltdLCJhdWQiOiJhcGkiLCJpYXQiOjE3NzM4NjM3NDEsInN1YiI6IjE0OTI0NCIsIm5hbWUiOiJKb2Igc2VhcmNoIiwiZW1haWwiOiJndWRpcGFsbGlzYWl2eXNobmF2aUBnbWFpbC5jb20ifQ.-pvFS-GSUYh-qJHe8i26YO1xhFJxEmQ-dfbwq8JOJPE";

const COURSE_SKILL_MAP = {
  "ISM 610 Data Analytics": ["python","sql","data-analytics","statistics","pandas","data-visualization"],
  "CSC 520 Machine Learning": ["python","machine-learning","scikit-learn","statistics","pandas"],
  "ISM 645 Database Management": ["sql","data-modeling","database"],
  "ISM 620 Programming for Analytics": ["python","r","programming"],
  "ISM 630 Business Intelligence": ["sql","tableau","excel","data-visualization","extract-transform-and-load-etl"],
  "CSC 510 Artificial Intelligence": ["python","machine-learning","natural-language-processing","deep-learning"],
  "ISM 650 Project Management": ["project-management","agile"],
  "CSC 490 Cloud Computing": ["amazon-web-services","microsoft-azure","docker","cloud-computing"],
  "CSC 330 Software Engineering": ["java","git","software-engineering"],
  "ISM 515 Data Mining": ["python","machine-learning","statistics","data-analytics"],
};

const LEARNING_RESOURCES = {
  "python":[{name:"IBM SkillsBuild: Python for Data Science",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Kaggle: Python Course",url:"https://www.kaggle.com/learn/python",source:"Kaggle"},{name:"freeCodeCamp: Python",url:"https://www.freecodecamp.org/learn/scientific-computing-with-python/",source:"freeCodeCamp"},{name:"Google: Python Class",url:"https://developers.google.com/edu/python",source:"Google"}],
  "sql":[{name:"IBM SkillsBuild: SQL & Databases",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Kaggle: Intro to SQL",url:"https://www.kaggle.com/learn/intro-to-sql",source:"Kaggle"},{name:"SQLBolt Interactive",url:"https://sqlbolt.com/",source:"SQLBolt"},{name:"Mode: SQL Tutorial",url:"https://mode.com/sql-tutorial",source:"Mode"}],
  "machine-learning":[{name:"IBM SkillsBuild: ML with Python",url:"https://skillsbuild.org/college-students/course-catalog/artificial-intelligence",source:"IBM SkillsBuild"},{name:"Kaggle: Intro to ML",url:"https://www.kaggle.com/learn/intro-to-machine-learning",source:"Kaggle"},{name:"Google: ML Crash Course",url:"https://developers.google.com/machine-learning/crash-course",source:"Google"},{name:"fast.ai: Practical ML",url:"https://course.fast.ai/",source:"fast.ai"}],
  "deep-learning":[{name:"IBM SkillsBuild: Deep Learning",url:"https://skillsbuild.org/college-students/course-catalog/artificial-intelligence",source:"IBM SkillsBuild"},{name:"Kaggle: Deep Learning",url:"https://www.kaggle.com/learn/intro-to-deep-learning",source:"Kaggle"},{name:"fast.ai: Deep Learning",url:"https://course.fast.ai/",source:"fast.ai"},{name:"MIT OCW: Deep Learning",url:"https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2023/",source:"MIT"}],
  "amazon-web-services":[{name:"IBM SkillsBuild: Cloud",url:"https://skillsbuild.org/college-students/course-catalog/cloud-computing",source:"IBM SkillsBuild"},{name:"AWS Skill Builder Free",url:"https://explore.skillbuilder.aws/learn",source:"AWS"},{name:"freeCodeCamp: AWS",url:"https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-certification-study-course-pass-the-exam/",source:"freeCodeCamp"}],
  "microsoft-azure":[{name:"IBM SkillsBuild: Cloud",url:"https://skillsbuild.org/college-students/course-catalog/cloud-computing",source:"IBM SkillsBuild"},{name:"Microsoft Learn: Azure",url:"https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/",source:"Microsoft"}],
  "docker":[{name:"IBM SkillsBuild: Containers",url:"https://skillsbuild.org/college-students/course-catalog/cloud-computing",source:"IBM SkillsBuild"},{name:"Docker: Getting Started",url:"https://docs.docker.com/get-started/",source:"Docker"},{name:"KodeKloud: Docker",url:"https://kodekloud.com/courses/docker-for-the-absolute-beginner/",source:"KodeKloud"}],
  "kubernetes":[{name:"IBM SkillsBuild: Containers",url:"https://skillsbuild.org/college-students/course-catalog/cloud-computing",source:"IBM SkillsBuild"},{name:"Kubernetes Tutorial",url:"https://kubernetes.io/docs/tutorials/",source:"Kubernetes.io"}],
  "tableau":[{name:"IBM SkillsBuild: Data Viz",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Tableau Free Training",url:"https://www.tableau.com/learn/training",source:"Tableau"},{name:"Kaggle: Data Viz",url:"https://www.kaggle.com/learn/data-visualization",source:"Kaggle"}],
  "r":[{name:"IBM SkillsBuild: Data Science",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Swirl: Learn R",url:"https://swirlstats.com/",source:"Swirl"},{name:"Kaggle: R",url:"https://www.kaggle.com/learn/r",source:"Kaggle"}],
  "tensorflow":[{name:"IBM SkillsBuild: AI",url:"https://skillsbuild.org/college-students/course-catalog/artificial-intelligence",source:"IBM SkillsBuild"},{name:"TensorFlow Tutorials",url:"https://www.tensorflow.org/tutorials",source:"TensorFlow"},{name:"Kaggle: Deep Learning",url:"https://www.kaggle.com/learn/intro-to-deep-learning",source:"Kaggle"}],
  "pytorch":[{name:"IBM SkillsBuild: AI",url:"https://skillsbuild.org/college-students/course-catalog/artificial-intelligence",source:"IBM SkillsBuild"},{name:"PyTorch Tutorials",url:"https://pytorch.org/tutorials/",source:"PyTorch"},{name:"freeCodeCamp: PyTorch",url:"https://www.freecodecamp.org/news/pytorch-full-course/",source:"freeCodeCamp"}],
  "natural-language-processing":[{name:"IBM SkillsBuild: AI",url:"https://skillsbuild.org/college-students/course-catalog/artificial-intelligence",source:"IBM SkillsBuild"},{name:"Kaggle: NLP",url:"https://www.kaggle.com/learn/natural-language-processing",source:"Kaggle"},{name:"Hugging Face NLP",url:"https://huggingface.co/learn/nlp-course",source:"Hugging Face"}],
  "git":[{name:"IBM SkillsBuild: Web Dev",url:"https://skillsbuild.org/college-students/course-catalog/web-development",source:"IBM SkillsBuild"},{name:"GitHub Handbook",url:"https://docs.github.com/en/get-started/using-git",source:"GitHub"},{name:"Atlassian: Git",url:"https://www.atlassian.com/git",source:"Atlassian"}],
  "java":[{name:"IBM SkillsBuild: Web Dev",url:"https://skillsbuild.org/college-students/course-catalog/web-development",source:"IBM SkillsBuild"},{name:"MOOC.fi: Java",url:"https://java-programming.mooc.fi/",source:"MOOC.fi"}],
  "apache-spark":[{name:"IBM SkillsBuild: Data Science",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Databricks Learning",url:"https://www.databricks.com/learn",source:"Databricks"}],
  "data-visualization":[{name:"IBM SkillsBuild: Data Viz",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Kaggle: Data Viz",url:"https://www.kaggle.com/learn/data-visualization",source:"Kaggle"}],
  "cloud-computing":[{name:"IBM SkillsBuild: Cloud",url:"https://skillsbuild.org/college-students/course-catalog/cloud-computing",source:"IBM SkillsBuild"},{name:"AWS Skill Builder",url:"https://explore.skillbuilder.aws/learn",source:"AWS"},{name:"Google Cloud Free",url:"https://cloud.google.com/training/free",source:"Google Cloud"}],
  "extract-transform-and-load-etl":[{name:"IBM SkillsBuild: Data Science",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Kaggle: Advanced SQL",url:"https://www.kaggle.com/learn/advanced-sql",source:"Kaggle"}],
  "project-management":[{name:"IBM SkillsBuild: Professional",url:"https://skillsbuild.org/college-students/course-catalog/professional-skills",source:"IBM SkillsBuild"},{name:"Google: PM Certificate",url:"https://grow.google/projectmanagement/",source:"Google"}],
  "cybersecurity":[{name:"IBM SkillsBuild: Cybersecurity",url:"https://skillsbuild.org/college-students/course-catalog/cybersecurity",source:"IBM SkillsBuild"},{name:"Cisco NetAcad",url:"https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity",source:"Cisco"}],
  "excel":[{name:"IBM SkillsBuild: Data Science",url:"https://skillsbuild.org/college-students/course-catalog/data-science",source:"IBM SkillsBuild"},{name:"Microsoft: Excel",url:"https://support.microsoft.com/en-us/excel",source:"Microsoft"}],
  "power-bi":[{name:"Microsoft Learn: Power BI",url:"https://learn.microsoft.com/en-us/training/powerplatform/power-bi",source:"Microsoft"}],
};

const ROLE_TITLES = {
  "Data Scientist":["Data Scientist","Data Science"],
  "Data Analyst":["Data Analyst","Data Analytics","Business Analyst"],
  "ML Engineer":["Machine Learning Engineer","ML Engineer","AI Engineer"],
  "Data Engineer":["Data Engineer","ETL Developer","Analytics Engineer"],
  "Software Engineer":["Software Engineer","Software Developer","Backend Engineer"],
};

const SENIORITY_MAP = {
  "Intern / Entry":["intern","entry","junior","entry_level","internship","associate","graduate"],
  "Mid Level":["mid","mid_level","intermediate","2","3"],
  "Senior":["senior","lead","staff","principal","sr","manager","director"]
};

const SKILL_DIFFICULTY = {
  "python":1,"sql":1,"excel":1,"git":1,"r":1,"statistics":1,"data-visualization":1,"data-analytics":1,
  "tableau":2,"power-bi":2,"java":2,"pandas":2,"data-modeling":2,"programming":2,"project-management":2,"agile":2,
  "machine-learning":3,"scikit-learn":3,"natural-language-processing":3,"extract-transform-and-load-etl":3,"cloud-computing":3,
  "amazon-web-services":3,"microsoft-azure":3,"docker":3,"deep-learning":4,"tensorflow":4,"pytorch":4,
  "apache-spark":4,"kubernetes":4,"software-engineering":3,"database":1,
};

const SKIP_KW = new Set(["job-descriptions","provide-support","use-case","planning-and-design","visual-art-design","product-development-and-design","policies-and-practices","team-communication","reporting-and-disclosure","adaptive-project-management-and-reporting","good-manufacturing-practice-gmp","food-and-drug-administration-fda-or-usfda","pharmaceutical-manufacturing","education-training","ecology-environment","sensors-test-measurement","electrical-engineering-and-planning","environment-health-and-safety-hsse","biotechnology","cyber-intelligence","training-certification","training-and-development","information-technology","testing-and-analysis"]);

const fmt = s => s.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
const COMMON_SKILLS = ["Python","SQL","R","Java","JavaScript","Tableau","Excel","Power BI","Git","Docker","AWS","Azure","TensorFlow","PyTorch","Spark","Kubernetes","NLP","Machine Learning","Deep Learning","Data Visualization","Statistics","Pandas","Scikit-learn","REST APIs","Agile","CI/CD","MongoDB","PostgreSQL","Linux","Figma"];

const RESUME_KEYWORDS = ["python","sql","java","javascript","typescript","react","node","angular","vue","c++","c#","ruby","go","rust","swift","kotlin","php","scala","matlab","sas","spss","tableau","power bi","excel","git","github","docker","kubernetes","aws","azure","gcp","google cloud","tensorflow","pytorch","keras","scikit-learn","pandas","numpy","scipy","matplotlib","seaborn","plotly","spark","hadoop","kafka","airflow","dbt","snowflake","redshift","bigquery","mongodb","postgresql","mysql","redis","elasticsearch","rest api","graphql","ci/cd","jenkins","terraform","ansible","linux","bash","agile","scrum","jira","figma","sketch","machine learning","deep learning","nlp","natural language processing","computer vision","data visualization","data analytics","data science","data engineering","etl","data modeling","statistics","regression","classification","clustering","neural network","random forest","xgboost","reinforcement learning","generative ai","llm","rag","langchain","hugging face","prompt engineering","mlops","a/b testing"];

async function parsePDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
}

function extractSkillsFromResume(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  RESUME_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      const slug = kw.replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
      found.add(slug);
      const map = {"aws":"amazon-web-services","azure":"microsoft-azure","gcp":"google-cloud","google cloud":"google-cloud",
        "nlp":"natural-language-processing","natural language processing":"natural-language-processing",
        "machine learning":"machine-learning","deep learning":"deep-learning","data visualization":"data-visualization",
        "data analytics":"data-analytics","data science":"data-science","data engineering":"data-engineering",
        "power bi":"power-bi","scikit-learn":"scikit-learn","ci/cd":"ci-cd","rest api":"rest-api",
        "a/b testing":"ab-testing","data modeling":"data-modeling","computer vision":"computer-vision",
        "neural network":"neural-network","random forest":"random-forest","generative ai":"generative-ai",
        "prompt engineering":"prompt-engineering","hugging face":"hugging-face","etl":"extract-transform-and-load-etl"};
      if (map[kw]) found.add(map[kw]);
    }
  });
  return [...found];
}

function extractSkills(text, extra, resumeSkills) {
  const found = new Set();
  for (const [course, skills] of Object.entries(COURSE_SKILL_MAP)) {
    const words = course.toLowerCase().split(" ");
    const tl = text.toLowerCase();
    if (words.some(w => w.length > 3 && tl.includes(w))) skills.forEach(s => found.add(s));
  }
  extra.forEach(s => {
    const slug = s.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
    found.add(slug);
    const map = {aws:"amazon-web-services",azure:"microsoft-azure",nlp:"natural-language-processing","machine learning":"machine-learning","deep learning":"deep-learning",ml:"machine-learning",dl:"deep-learning",etl:"extract-transform-and-load-etl"};
    if (map[s.toLowerCase()]) found.add(map[s.toLowerCase()]);
  });
  resumeSkills.forEach(s => found.add(s));
  return [...found].sort();
}

async function fetchJobs(role, loc, seniority) {
  const titles = ROLE_TITLES[role] || [role];
  const payload = {posted_at_max_age_days:30,job_title_or:titles,job_location_pattern_or:[loc],limit:25,page:0};
  try {
    const r = await fetch("/api/v1/jobs/search", {
      method:"POST", headers:{Authorization:`Bearer ${THEIRSTACK_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const d = await r.json();
    if (!d.data?.length) {
      payload.job_location_pattern_or = ["United States"];
      const r2 = await fetch("/api/v1/jobs/search", {
        method:"POST", headers:{Authorization:`Bearer ${THEIRSTACK_API_KEY}`,"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      return (await r2.json()).data || [];
    }
    return d.data || [];
  } catch { return []; }
}

function calcMatch(skills, job) {
  const ss = new Set(skills.map(s=>s.toLowerCase()));
  const ts = (job.technology_slugs||[]).map(t=>t.toLowerCase());
  if (!ts.length) return 0;
  return Math.round(ts.filter(t=>ss.has(t)).length/ts.length*100);
}

function analyzeGaps(skills, jobs) {
  const ss = new Set(skills.map(s=>s.toLowerCase()));
  const tc={}, kc={};
  jobs.forEach(j=>{
    (j.technology_slugs||[]).forEach(t=>{tc[t]=(tc[t]||0)+1;});
    (j.keyword_slugs||[]).forEach(k=>{if(!SKIP_KW.has(k))kc[k]=(kc[k]||0)+1;});
  });
  const matched=[], gaps=[];
  Object.entries(tc).sort((a,b)=>b[1]-a[1]).forEach(([s,c])=>{
    if(ss.has(s))matched.push({skill:s,count:c}); else gaps.push({skill:s,count:c});
  });
  const gs=new Set(gaps.map(g=>g.skill));
  const kwg=[];
  Object.entries(kc).sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([s,c])=>{
    if(!ss.has(s)&&!gs.has(s))kwg.push({skill:s,count:c});
  });
  return {matched,techGaps:gaps.slice(0,12),kwGaps:kwg.slice(0,8)};
}

function generateLearningPath(gaps, jobCount) {
  const sorted = [...gaps.techGaps].sort((a,b) => {
    const da = SKILL_DIFFICULTY[a.skill] || 2;
    const db = SKILL_DIFFICULTY[b.skill] || 2;
    if (da !== db) return da - db;
    return b.count - a.count;
  });
  const weeks = [];
  let week = 1;
  sorted.forEach((g, i) => {
    const diff = SKILL_DIFFICULTY[g.skill] || 2;
    const hrs = diff <= 1 ? "3-5" : diff <= 2 ? "5-8" : diff <= 3 ? "8-12" : "10-15";
    const resources = LEARNING_RESOURCES[g.skill] || [];
    if (i > 0 && i % 2 === 0) week++;
    const existing = weeks.find(w => w.week === week);
    const item = { skill: g.skill, demand: g.count, hours: hrs, difficulty: diff, resources };
    if (existing) existing.skills.push(item);
    else weeks.push({ week, skills: [item] });
  });
  return weeks;
}

function Counter({end}){const[v,setV]=useState(0);useEffect(()=>{let s=0;const step=Math.max(1,Math.floor(end/20));const iv=setInterval(()=>{s=Math.min(s+step,end);setV(s);if(s>=end)clearInterval(iv);},50);return()=>clearInterval(iv);},[end]);return <span>{v}</span>;}

function Ring({pct,color,size=72,stroke=6}){const r=(size-stroke)/2,c=2*Math.PI*r;return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.5s ease"}}/></svg>);}

function AgentDot({n,label,status,detail}){
  const c={running:"#f59e0b",done:"#10b981",waiting:"#cbd5e1"};
  return(<div style={{display:"flex",gap:8,alignItems:"center",opacity:status==="waiting"?0.4:1,transition:"all 0.4s"}}>
    <div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:11,fontWeight:600,background:status==="done"?"#10b981":status==="running"?"#f59e0b":"#f1f5f9",
      color:status==="waiting"?"#94a3b8":"#fff",border:`2px solid ${c[status]}`,animation:status==="running"?"pulse 1.5s infinite":"none"}}>
      {status==="done"?"✓":n}</div>
    <div><div style={{fontSize:11,fontWeight:600,color:status==="done"?"#059669":status==="running"?"#d97706":"#94a3b8"}}>{label}</div>
      {detail&&<div style={{fontSize:10,color:"#64748b"}}>{detail}</div>}</div>
  </div>);
}

export default function App(){
  const [courses,setCourses]=useState("ISM 610 Data Analytics\nCSC 520 Machine Learning\nISM 645 Database Management\nISM 620 Programming for Analytics");
  const [role,setRole]=useState("Data Scientist");
  const [loc,setLoc]=useState("North Carolina");
  const [seniority,setSeniority]=useState("All");
  const [extra,setExtra]=useState([]);
  const [si,setSi]=useState("");
  const [showSug,setShowSug]=useState(false);
  const [resumeSkills,setResumeSkills]=useState([]);
  const [resumeName,setResumeName]=useState("");
  const [fRemote,setFRemote]=useState(false);
  const [fSponsor,setFSponsor]=useState(false);
  const [sortBy,setSortBy]=useState("match");
  const [loading,setLoading]=useState(false);
  const [steps,setSteps]=useState([0,0,0,0,0]);
  const [res,setRes]=useState(null);
  const [tab,setTab]=useState("gaps");
  const [expSkill,setExpSkill]=useState(null);
  const rRef=useRef(null);
  const fileRef=useRef(null);

  const sl=i=>["waiting","running","done"][steps[i]];
  const addSkill=s=>{const c=s.trim();if(c&&!extra.includes(c))setExtra([...extra,c]);setSi("");setShowSug(false);};
  const fSug=COMMON_SKILLS.filter(s=>s.toLowerCase().includes(si.toLowerCase())&&!extra.includes(s)).slice(0,8);

  async function handleResume(e){
    const file=e.target.files?.[0];
    if(!file)return;
    setResumeName(file.name);
    try{
      const text=await parsePDF(file);
      const skills=extractSkillsFromResume(text);
      setResumeSkills(skills);
    }catch(err){
      console.error(err);
      setResumeSkills([]);
    }
  }

  async function run(){
    setLoading(true);setRes(null);setSteps([1,0,0,0,0]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ courses, role, location: loc, extra_skills: extra, resume_text: "" })
      });
      const data = await response.json();

      // Animate pipeline
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 300));
        setSteps(prev => { const n = [...prev]; n[i] = 2; return n; });
      }

      const skills = data.student_skills || [];
      const jobs = (data.jobs || []).map(j => ({
        ...j, job_title: j.title, technology_slugs: j.tech_skills, keyword_slugs: j.keyword_skills,
        matchPct: (() => { const ss = new Set(skills.map(s=>s.toLowerCase())); const ts = (j.tech_skills||[]); return ts.length ? Math.round(ts.filter(t=>ss.has(t.toLowerCase())).length/ts.length*100) : 0; })()
      }));

      const gaps = {
        matched: data.gaps?.matched_skills || [],
        techGaps: (data.gaps?.skill_gaps || []).map(g => ({skill:g.skill, count:g.count})),
        kwGaps: []
      };

      const insight = data.insight || {};
      const path = (data.learning_path || []);

      setRes({skills, jobs, gaps, path, insight});
    } catch(err) {
      console.error(err);
      // Fallback to client-side
      const skills = extractSkills(courses, extra, []);
      setSteps([2,1,0,0,0]);
      const rawJobs = await fetchJobs(role, loc);
      setSteps([2,2,1,0,0]);
      const gaps = analyzeGaps(skills, rawJobs);
      setSteps([2,2,2,2,2]);
      const jm = rawJobs.map(j=>({...j, matchPct:calcMatch(skills,j)}));
      setRes({skills, jobs:jm, gaps, path:[], insight:{}});
    }
    setLoading(false);
    setTimeout(()=>rRef.current?.scrollIntoView({behavior:"smooth"}),200);
  }

  const fJobs=res?res.jobs
    .filter(j=>!fRemote||j.remote)
    .filter(j=>{if(!fSponsor)return true;const d=((j.description||"")+(j.job_title||"")).toLowerCase();
      return["sponsor","visa","h1b","opt","cpt"].some(k=>d.includes(k));})
    .filter(j=>{if(seniority==="All")return true;
      const s=(j.seniority||"").toLowerCase();
      const map={"Intern / Entry":["intern","entry","junior","entry_level","internship"],
        "Mid Level":["mid","mid_level"],
        "Senior":["senior","lead","staff","principal"]};
      return(map[seniority]||[]).some(k=>s.includes(k));})
    .sort((a,b)=>sortBy==="match"?b.matchPct-a.matchPct:sortBy==="date"?(b.date_posted||"").localeCompare(a.date_posted||""):0):[];
  const mp=res?Math.round(res.gaps.matched.length/Math.max(1,res.gaps.matched.length+res.gaps.techGaps.length)*100):0;
  const allGaps=res?[...res.gaps.techGaps,...res.gaps.kwGaps]:[];

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f0f4ff 0%,#fdf2f8 25%,#eff6ff 50%,#f5f3ff 75%,#ecfdf5 100%)",color:"#1e293b",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;}
        html,body,#root{min-height:100vh;width:100%;margin:0;padding:0;}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.3)}50%{box-shadow:0 0 0 8px rgba(139,92,246,0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .card{background:rgba(255,255,255,0.7);backdrop-filter:blur(12px);border:1px solid rgba(203,213,225,0.4);border-radius:16px;padding:24px;transition:all 0.3s;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
        .card:hover{border-color:rgba(139,92,246,0.25);box-shadow:0 4px 20px rgba(139,92,246,0.08)}
        .bp{background:linear-gradient(135deg,#818cf8,#a78bfa,#c084fc);border:none;color:#fff;padding:14px 32px;border-radius:14px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s;font-family:inherit;width:100%;background-size:200% 200%;animation:gradientShift 3s ease infinite;box-shadow:0 4px 15px rgba(139,92,246,0.25)}
        .bp:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(139,92,246,0.35)}
        .bp:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .tg{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:500;margin:3px}
        .tg-g{background:#ecfdf5;color:#059669;border:1px solid #a7f3d0}
        .tg-r{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
        .tg-a{background:#fffbeb;color:#d97706;border:1px solid #fde68a}
        .tg-b{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}
        .tg-p{background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe}
        select,textarea,input[type=text]{background:#fff;border:1px solid #e2e8f0;color:#1e293b;border-radius:10px;padding:10px 14px;font-size:14px;font-family:inherit;width:100%;outline:none;transition:all 0.3s;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
        select:focus,textarea:focus,input[type=text]:focus{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(167,139,250,0.15)}
        .tb{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.3s;border:none;font-family:inherit;background:transparent;color:#94a3b8}
        .tb-a{background:#ede9fe;color:#6d28d9}
        .tb:hover:not(.tb-a){color:#64748b;background:rgba(0,0,0,0.03)}
        .jr{padding:14px 16px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;transition:background 0.2s;gap:12px}
        .jr:hover{background:#faf5ff}
        .ab{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.2s;font-family:inherit;white-space:nowrap}
        .ab:hover{background:#dbeafe}
        .tog{position:relative;width:36px;height:20px;background:#e2e8f0;border-radius:10px;cursor:pointer;transition:background 0.3s;flex-shrink:0}
        .tog.on{background:#a78bfa}
        .tk{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform 0.3s;box-shadow:0 1px 3px rgba(0,0,0,0.15)}
        .tog.on .tk{transform:translateX(16px)}
        .mbar{height:8px;border-radius:4px;background:#f1f5f9;overflow:hidden;flex:1}
        .mfill{height:100%;border-radius:4px;transition:width 0.8s ease}
        .rc{padding:10px 14px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;transition:all 0.3s;cursor:pointer;text-decoration:none;color:inherit;display:block;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
        .rc:hover{border-color:#c4b5fd;background:#faf5ff;transform:translateY(-1px);box-shadow:0 4px 12px rgba(139,92,246,0.1)}
        .sug{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e2e8f0;border-radius:10px;margin-top:4px;z-index:10;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.1)}
        .si{padding:8px 14px;font-size:13px;cursor:pointer;transition:background 0.2s;color:#1e293b}
        .si:hover{background:#f5f3ff}
        .upload-zone{border:2px dashed #cbd5e1;border-radius:12px;padding:16px;text-align:center;cursor:pointer;transition:all 0.3s;background:rgba(255,255,255,0.5)}
        .upload-zone:hover{border-color:#a78bfa;background:#faf5ff}
        .upload-zone.has-file{border-color:#10b981;background:#ecfdf5}
        .week-card{border-left:3px solid #a78bfa;padding:16px;margin-bottom:12px;background:rgba(255,255,255,0.5);border-radius:0 12px 12px 0}
      `}</style>

      {/* HERO */}
      <div style={{padding:"36px 24px 20px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.15) 0%, rgba(244,114,182,0.08) 40%, transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",maxWidth:700,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:3,color:"#8b5cf6",textTransform:"uppercase",marginBottom:6}}>Multi-Agent AI System</div>
          <h1 style={{fontSize:34,fontWeight:700,background:"linear-gradient(135deg,#6d28d9 0%,#8b5cf6 40%,#ec4899 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2,marginBottom:6}}>Career Gap Navigator</h1>
          <p style={{color:"#64748b",fontSize:13}}>live job market analysis and skills builder</p>
        </div>
      </div>

      {/* INPUT */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"3fr 3fr 2fr 2fr",gap:12,marginBottom:12}}>
          {/* Courses */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Your courses</label>
            <textarea rows={4} value={courses} onChange={e=>setCourses(e.target.value)} placeholder="Paste courses..."/>
          </div>
          {/* Resume + Extra skills */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Resume (PDF) + Extra skills</label>
            <div className={`upload-zone ${resumeName?"has-file":""}`} onClick={()=>fileRef.current?.click()} style={{marginBottom:6,padding:10}}>
              <input ref={fileRef} type="file" accept=".pdf" onChange={handleResume} style={{display:"none"}}/>
              {resumeName?<div style={{fontSize:12}}><span style={{color:"#059669",fontWeight:600}}>✓ {resumeName}</span><br/><span style={{color:"#64748b",fontSize:11}}>{resumeSkills.length} skills extracted</span></div>
                :<div style={{fontSize:12,color:"#94a3b8"}}>📄 Drop resume PDF or click to upload</div>}
            </div>
            <div style={{position:"relative"}}>
              <input type="text" value={si} onChange={e=>{setSi(e.target.value);setShowSug(true);}} onFocus={()=>setShowSug(true)} onBlur={()=>setTimeout(()=>setShowSug(false),200)}
                onKeyDown={e=>{if(e.key==="Enter"&&si.trim()){e.preventDefault();addSkill(si);}}} placeholder="Type extra skill + Enter..." style={{fontSize:13,padding:"8px 12px"}}/>
              {showSug&&si&&fSug.length>0&&<div className="sug">{fSug.map(s=><div key={s} className="si" onMouseDown={()=>addSkill(s)}>{s}</div>)}</div>}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",minHeight:20,marginTop:4}}>
              {extra.map(s=><span key={s} className="tg tg-p" style={{cursor:"pointer",fontSize:10}} onClick={()=>setExtra(extra.filter(x=>x!==s))}>{s} ×</span>)}
              {resumeSkills.slice(0,6).map(s=><span key={`r-${s}`} className="tg tg-g" style={{fontSize:10}}>{fmt(s)}</span>)}
              {resumeSkills.length>6&&<span className="tg tg-g" style={{fontSize:10}}>+{resumeSkills.length-6} more</span>}
            </div>
          </div>
          {/* Role + Seniority */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Target role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{marginBottom:6,fontSize:13,padding:"8px 12px"}}>
              {Object.keys(ROLE_TITLES).map(r=><option key={r}>{r}</option>)}</select>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Experience level</label>
            <select value={seniority} onChange={e=>setSeniority(e.target.value)} style={{fontSize:13,padding:"8px 12px"}}>
              {["All","Intern / Entry","Mid Level","Senior"].map(s=><option key={s}>{s}</option>)}</select>
          </div>
          {/* Location */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Location</label>
            <select value={loc} onChange={e=>setLoc(e.target.value)} style={{marginBottom:6,fontSize:13,padding:"8px 12px"}}>
              {["North Carolina","United States","Remote","California","New York","Texas","Georgia","Virginia","Florida","Illinois","Washington"].map(l=><option key={l}>{l}</option>)}</select>
            <label style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:4,display:"block",letterSpacing:0.5,textTransform:"uppercase"}}>Agents pipeline</label>
            <div className="card" style={{padding:8}}>
              <AgentDot n={1} label="Curriculum" status={sl(0)} detail={steps[0]===2?`${res?.skills?.length} skills`:null}/>
              <AgentDot n={2} label="Job Scout" status={sl(1)} detail={steps[1]===2?`${res?.jobs?.length} jobs`:null}/>
              <AgentDot n={3} label="Gap Analyzer" status={sl(2)} detail={steps[2]===2?`${res?.gaps?.techGaps?.length} gaps`:null}/>
              <AgentDot n={4} label="Learning Path" status={sl(3)} detail={steps[3]===2?`${res?.path?.length} weeks`:null}/>
              <AgentDot n={5} label="Resources" status={sl(4)} detail={steps[4]===2?"done":null}/>
            </div>
          </div>
        </div>

        <button className="bp" onClick={run} disabled={loading||!courses.trim()}>
          {loading?"Agents analyzing live market...":"Analyze My Career Gap"}</button>
      </div>

      {/* RESULTS */}
      {res&&(
        <div ref={rRef} style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 60px",animation:"fadeUp 0.6s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
            {[{l:"Your skills",v:res.skills.length,c:"#059669"},{l:"Live jobs",v:res.jobs.length,c:"#2563eb"},
              {l:"Skill gaps",v:res.gaps.techGaps.length,c:"#d97706"},{l:"Market fit",v:mp,c:"#7c3aed",s:"%"},
              {l:"Study weeks",v:res.path.length,c:"#ec4899"}
            ].map((x,i)=>(
              <div key={i} className="card" style={{textAlign:"center",padding:14}}>
                <div style={{fontSize:26,fontWeight:700,color:x.c,fontFamily:"'JetBrains Mono',monospace"}}><Counter end={x.v}/>{x.s||""}</div>
                <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{x.l}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:4,marginBottom:16,background:"rgba(255,255,255,0.5)",padding:4,borderRadius:10,width:"fit-content",flexWrap:"wrap"}}>
            {[["gaps","Skill Gaps"],["jobs","Live Jobs"],["path","Learning Path"],["learn","Resources"],["transparency","Responsible AI"]].map(([id,l])=>(
              <button key={id} className={`tb ${tab===id?"tb-a":""}`} onClick={()=>setTab(id)}>{l}</button>))}
          </div>

          {/* GAPS */}
          {tab==="gaps"&&<div style={{animation:"fadeUp 0.4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="card">
                <h3 style={{fontSize:13,fontWeight:600,color:"#059669",marginBottom:10}}>✓ Skills you have</h3>
                <div style={{display:"flex",flexWrap:"wrap"}}>{res.gaps.matched.map((s,i)=><span key={i} className="tg tg-g">{fmt(s.skill)} ({s.count})</span>)}
                  {!res.gaps.matched.length&&<span style={{color:"#94a3b8",fontSize:12}}>No direct matches</span>}</div>
              </div>
              <div className="card">
                <h3 style={{fontSize:13,fontWeight:600,color:"#dc2626",marginBottom:10}}>✗ Skills to learn</h3>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                  {res.gaps.techGaps.map((g,i)=><span key={i} className="tg tg-r">{fmt(g.skill)} ({g.count})</span>)}
                  {res.gaps.kwGaps.slice(0,5).map((g,i)=><span key={`k${i}`} className="tg tg-a">{fmt(g.skill)} ({g.count})</span>)}
                </div>
              </div>
            </div>
            <div className="card" style={{marginTop:14}}>
              <h3 style={{fontSize:13,fontWeight:600,color:"#475569",marginBottom:12}}>Demand frequency</h3>
              {[...res.gaps.matched.map(s=>({...s,t:"m"})),...res.gaps.techGaps.map(s=>({...s,t:"g"}))]
                .sort((a,b)=>b.count-a.count).slice(0,14).map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <div style={{width:100,fontSize:11,color:"#64748b",textAlign:"right",flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fmt(s.skill)}</div>
                  <div className="mbar"><div className="mfill" style={{width:`${(s.count/res.jobs.length)*100}%`,
                    background:s.t==="m"?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#ef4444,#f87171)",transitionDelay:`${i*50}ms`}}/></div>
                  <div style={{width:20,fontSize:11,color:"#64748b",fontFamily:"'JetBrains Mono',monospace"}}>{s.count}</div>
                </div>))}
            </div>
          </div>}

          {/* JOBS */}
          {tab==="jobs"&&<div style={{animation:"fadeUp 0.4s ease"}}>
            <div className="card" style={{padding:"10px 16px",marginBottom:12,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className={`tog ${fRemote?"on":""}`} onClick={()=>setFRemote(!fRemote)}><div className="tk"/></div>
                <span style={{fontSize:12,color:"#64748b"}}>Remote</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className={`tog ${fSponsor?"on":""}`} onClick={()=>setFSponsor(!fSponsor)}><div className="tk"/></div>
                <span style={{fontSize:12,color:"#64748b"}}>Visa/Sponsorship</span>
              </div>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:11,color:"#94a3b8"}}>Sort:</span>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto",padding:"5px 8px",fontSize:12}}>
                  <option value="match">Best match %</option><option value="date">Most recent</option></select>
              </div>
            </div>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"10px 16px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:600,color:"#64748b"}}>{fJobs.length} jobs</span><span className="tg tg-b">Live data</span></div>
              {!fJobs.length&&<div style={{padding:30,textAlign:"center",color:"#94a3b8",fontSize:13}}>No jobs match filters</div>}
              {fJobs.map((j,i)=>{const mc=j.matchPct>=70?"#059669":j.matchPct>=40?"#d97706":"#dc2626";
                return(<div key={i} className="jr">
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:500}}>{j.job_title}</span>
                      {j.remote&&<span className="tg tg-b" style={{margin:0,fontSize:10}}>Remote</span>}
                      {j.seniority&&<span className="tg tg-p" style={{margin:0,fontSize:10}}>{j.seniority}</span>}
                    </div>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{j.company} · {j.location||"N/A"} · {j.date_posted}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                    <div style={{textAlign:"center",minWidth:44}}>
                      <div style={{fontSize:15,fontWeight:700,color:mc,fontFamily:"'JetBrains Mono',monospace"}}>{j.matchPct}%</div>
                      <div style={{fontSize:9,color:"#94a3b8"}}>match</div>
                    </div>
                    {j.url&&<a href={j.url} target="_blank" rel="noreferrer" className="ab">Apply</a>}
                  </div>
                </div>);})}
            </div>
          </div>}

          {/* LEARNING PATH */}
          {tab==="path"&&<div style={{animation:"fadeUp 0.4s ease"}}>
            <div className="card" style={{marginBottom:14}}>
              <h3 style={{fontSize:14,fontWeight:600,color:"#6d28d9",marginBottom:4}}>Your personalized learning path</h3>
              <p style={{fontSize:12,color:"#64748b"}}>{res.insight?.headline || "Skills ordered by difficulty — foundations first."}</p>
            </div>
            {(res.path||[]).map((w,wi)=>(
              <div key={wi} className="week-card" style={{animation:"fadeUp 0.4s ease",animationDelay:`${wi*100}ms`,animationFillMode:"both",
                borderLeftColor:wi<2?"#10b981":wi<4?"#f59e0b":"#8b5cf6"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>Week {w.week}</span>
                    {w.theme&&<span style={{fontSize:12,color:"#64748b",marginLeft:8}}>— {w.theme}</span>}
                  </div>
                  <span className="tg tg-p" style={{fontSize:10}}>{w.hours||"5-8"} hrs/week</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                  {(w.skills||[]).map((s,si)=><span key={si} className="tg tg-a" style={{fontSize:10}}>{typeof s==="string"?fmt(s):fmt(s.skill||"")}</span>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {(w.resources||[]).map((r,ri)=>(
                    <a key={ri} href={r.url} target="_blank" rel="noreferrer" className="rc" style={{padding:"8px 12px"}}>
                      <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{r.name}</div>
                      <div style={{fontSize:10,color:r.source==="IBM SkillsBuild"?"#7c3aed":"#64748b"}}>{r.source} — Free</div>
                    </a>))}
                </div>
              </div>
            ))}
            {!(res.path||[]).length&&<div className="card" style={{textAlign:"center",padding:30,color:"#94a3b8"}}>No learning path generated</div>}
          </div>}

          {/* LEARN */}
          {tab==="learn"&&<div style={{animation:"fadeUp 0.4s ease"}}>
            <p style={{fontSize:13,color:"#64748b",marginBottom:14}}>Click a skill gap to see free resources from IBM SkillsBuild, Kaggle, Google, freeCodeCamp & more</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:18}}>
              {allGaps.map((g,i)=>{const hr=!!LEARNING_RESOURCES[g.skill];
                return(<span key={i} className={`tg ${expSkill===g.skill?"tg-p":hr?"tg-r":"tg-a"}`}
                  style={{cursor:hr?"pointer":"default",fontSize:12,padding:"6px 12px"}}
                  onClick={()=>hr&&setExpSkill(expSkill===g.skill?null:g.skill)}>
                  {fmt(g.skill)} {hr?"▾":""}</span>);})}
            </div>
            {expSkill&&LEARNING_RESOURCES[expSkill]&&(
              <div className="card" style={{animation:"fadeUp 0.3s ease"}}>
                <h3 style={{fontSize:14,fontWeight:600,color:"#6d28d9",marginBottom:12}}>Learn {fmt(expSkill)}</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {LEARNING_RESOURCES[expSkill].map((r,i)=>(
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" className="rc">
                      <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{r.name}</div>
                      <div style={{fontSize:11,color:r.source==="IBM SkillsBuild"?"#7c3aed":"#64748b"}}>{r.source} — Free</div>
                    </a>))}
                </div>
              </div>)}
            {!expSkill&&<div className="card" style={{textAlign:"center",padding:30,color:"#94a3b8",fontSize:13}}>👆 Click a skill gap above</div>}
          </div>}

          {/* TRANSPARENCY */}
          {tab==="transparency"&&<div className="card" style={{animation:"fadeUp 0.4s ease"}}>
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:14,color:"#6d28d9"}}>Responsible AI — how this works</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[{a:"Curriculum Analyzer",d:`Extracted ${res.skills.length} skills from courses, resume${resumeName?` (${resumeName})`:""}, and ${extra.length} manual entries`},
                {a:"Job Market Scout",d:`Queried ${res.jobs.length} real-time ${seniority!=="All"?seniority+" ":""}postings via TheirStack API (last 30 days, ${loc})`},
                {a:"Gap Analyzer",d:`Compared ${res.skills.length} skills against ${res.gaps.techGaps.length+res.gaps.matched.length} market technologies. Match % = skills in job's tech stack / total stack`},
                {a:"Learning Path Generator",d:`Created ${res.path.length}-week study plan ordered by difficulty. Foundations first, advanced last. ~2 skills/week`},
                {a:"Resource Matcher",d:`Mapped gaps to free courses from IBM SkillsBuild, Kaggle, Google, freeCodeCamp, Hugging Face & more`}
              ].map((x,i)=>(<div key={i} style={{padding:12,borderRadius:10,background:"#faf5ff",border:"1px solid #ede9fe"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#7c3aed",marginBottom:4}}>Agent {i+1}: {x.a}</div>
                <div style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>{x.d}</div></div>))}
            </div>
            <div style={{marginTop:14,padding:12,borderRadius:10,background:"#ecfdf5",border:"1px solid #a7f3d0"}}>
              <div style={{fontSize:12,color:"#059669",lineHeight:1.6}}>
                All data from live postings. Resume parsed locally in browser — never uploaded to any server. No personal data stored. All recommendations transparent and traceable.</div>
            </div>
          </div>}

          <div style={{textAlign:"center",marginTop:36,fontSize:11,color:"#94a3b8"}}>
            </div>
        </div>
      )}
    </div>
  );
}