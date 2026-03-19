# import streamlit as st
# import requests
# import os
# import json
# from collections import Counter
# from dotenv import load_dotenv

# load_dotenv()

# # ========== CONFIG ==========
# THEIRSTACK_API_KEY = os.getenv("THEIRSTACK_API_KEY")
# API_URL = "https://api.theirstack.com/v1/jobs/search"

# SKILLSBUILD_COURSES = {
#     "python": {"name": "Python for Data Science", "url": "https://skillsbuild.org/college-students/course/python-for-data-science"},
#     "sql": {"name": "SQL and Relational Databases", "url": "https://skillsbuild.org/college-students/course/sql-and-relational-databases"},
#     "machine-learning": {"name": "Machine Learning with Python", "url": "https://skillsbuild.org/college-students/course/machine-learning-with-python"},
#     "deep-learning": {"name": "Deep Learning Fundamentals", "url": "https://skillsbuild.org/college-students/course/deep-learning-fundamentals"},
#     "data-visualization": {"name": "Data Visualization with Python", "url": "https://skillsbuild.org/college-students/course/data-visualization-with-python"},
#     "cloud-computing": {"name": "Cloud Computing Fundamentals", "url": "https://skillsbuild.org/college-students/course/cloud-computing-fundamentals"},
#     "amazon-web-services": {"name": "Cloud Computing Fundamentals (AWS)", "url": "https://skillsbuild.org/college-students/course/cloud-computing-fundamentals"},
#     "microsoft-azure": {"name": "Cloud Computing Fundamentals (Azure)", "url": "https://skillsbuild.org/college-students/course/cloud-computing-fundamentals"},
#     "docker": {"name": "Containers & Kubernetes Essentials", "url": "https://skillsbuild.org/college-students/course/containers-kubernetes-essentials"},
#     "kubernetes": {"name": "Containers & Kubernetes Essentials", "url": "https://skillsbuild.org/college-students/course/containers-kubernetes-essentials"},
#     "natural-language-processing": {"name": "Natural Language Processing", "url": "https://skillsbuild.org/college-students/course/nlp-fundamentals"},
#     "tableau": {"name": "Data Visualization & Dashboards", "url": "https://skillsbuild.org/college-students/course/data-viz-dashboards"},
#     "tensorflow": {"name": "Deep Learning with TensorFlow", "url": "https://skillsbuild.org/college-students/course/deep-learning-tensorflow"},
#     "pytorch": {"name": "Deep Learning with PyTorch", "url": "https://skillsbuild.org/college-students/course/deep-learning-pytorch"},
#     "apache-spark": {"name": "Big Data with Apache Spark", "url": "https://skillsbuild.org/college-students/course/big-data-spark"},
#     "r": {"name": "R Programming Fundamentals", "url": "https://skillsbuild.org/college-students/course/r-programming"},
#     "git": {"name": "Git and GitHub Essentials", "url": "https://skillsbuild.org/college-students/course/git-github-essentials"},
#     "java": {"name": "Java Programming Fundamentals", "url": "https://skillsbuild.org/college-students/course/java-fundamentals"},
#     "data-science": {"name": "Data Science Foundations", "url": "https://skillsbuild.org/college-students/course/data-science-foundations"},
#     "artificial-intelligence": {"name": "AI Fundamentals", "url": "https://skillsbuild.org/college-students/course/ai-fundamentals"},
#     "cybersecurity": {"name": "Cybersecurity Fundamentals", "url": "https://skillsbuild.org/college-students/course/cybersecurity-fundamentals"},
#     "project-management": {"name": "Project Management Fundamentals", "url": "https://skillsbuild.org/college-students/course/project-management"},
#     "excel": {"name": "Data Analysis with Excel", "url": "https://skillsbuild.org/college-students/course/data-analysis-excel"},
#     "power-bi": {"name": "Data Visualization & Dashboards", "url": "https://skillsbuild.org/college-students/course/data-viz-dashboards"},
#     "extract-transform-and-load-etl": {"name": "Data Engineering Essentials", "url": "https://skillsbuild.org/college-students/course/data-engineering-essentials"},
# }

# COURSE_SKILL_MAP = {
#     "ISM 610 Data Analytics": ["python", "sql", "data-visualization", "statistics", "pandas", "data-analytics"],
#     "CSC 520 Machine Learning": ["python", "machine-learning", "scikit-learn", "statistics", "pandas"],
#     "ISM 645 Database Management": ["sql", "data-modeling", "database-design"],
#     "ISM 620 Programming for Analytics": ["python", "r", "programming", "data-structures"],
#     "ISM 630 Business Intelligence": ["sql", "tableau", "excel", "data-visualization", "extract-transform-and-load-etl"],
#     "CSC 510 Artificial Intelligence": ["python", "machine-learning", "natural-language-processing", "deep-learning"],
#     "ISM 650 Project Management": ["project-management", "agile", "communication"],
#     "CSC 330 Software Engineering": ["java", "git", "software-engineering", "testing-and-analysis"],
#     "ISM 515 Data Mining": ["python", "machine-learning", "statistics", "data-analytics"],
#     "CSC 490 Cloud Computing": ["amazon-web-services", "microsoft-azure", "docker", "cloud-computing"],
# }

# ROLE_TITLES = {
#     "Data Scientist": ["Data Scientist", "Data Science"],
#     "Data Analyst": ["Data Analyst", "Data Analytics", "Business Analyst"],
#     "ML Engineer": ["Machine Learning Engineer", "ML Engineer", "AI Engineer"],
#     "Data Engineer": ["Data Engineer", "ETL Developer", "Analytics Engineer"],
#     "AI/ML": ["AI", "Machine Learning", "Artificial Intelligence"],
#     "Software Engineer": ["Software Engineer", "Software Developer", "Backend Engineer"],
# }

# # ========== AGENT 1: CURRICULUM ANALYZER ==========
# def agent_curriculum_analyzer(courses_text):
#     found_skills = set()
#     for course_key, skills in COURSE_SKILL_MAP.items():
#         course_words = course_key.lower().split()
#         text_lower = courses_text.lower()
#         if any(word in text_lower for word in course_words if len(word) > 3):
#             found_skills.update(skills)

#     # Also check for direct skill mentions
#     all_known_skills = set()
#     for skills in COURSE_SKILL_MAP.values():
#         all_known_skills.update(skills)
#     for skill in all_known_skills:
#         if skill.replace("-", " ") in courses_text.lower():
#             found_skills.add(skill)

#     return sorted(found_skills)


# # ========== AGENT 2: JOB MARKET SCOUT (LIVE API) ==========
# def agent_job_market_scout(target_role, location="North Carolina"):
#     titles = ROLE_TITLES.get(target_role, [target_role])

#     try:
#         response = requests.post(
#             API_URL,
#             headers={
#                 "Authorization": f"Bearer {THEIRSTACK_API_KEY}",
#                 "Content-Type": "application/json"
#             },
#             json={
#                 "posted_at_max_age_days": 30,
#                 "job_title_or": titles,
#                 "job_location_pattern_or": [location],
#                 "limit": 15,
#                 "page": 0
#             },
#             timeout=15
#         )
#         data = response.json()

#         if "data" not in data or not data["data"]:
#             # Broaden search if no results
#             response = requests.post(
#                 API_URL,
#                 headers={
#                     "Authorization": f"Bearer {THEIRSTACK_API_KEY}",
#                     "Content-Type": "application/json"
#                 },
#                 json={
#                     "posted_at_max_age_days": 30,
#                     "job_title_or": titles,
#                     "job_location_pattern_or": ["United States"],
#                     "limit": 15,
#                     "page": 0
#                 },
#                 timeout=15
#             )
#             data = response.json()

#         jobs = data.get("data", [])
#         if not jobs:
#             return {"jobs_found": 0, "matching_jobs": [], "tech_skills": [], "keyword_skills": []}

#         # Extract skills from technology_slugs and keyword_slugs
#         tech_counter = Counter()
#         keyword_counter = Counter()
#         matching_jobs = []

#         for job in jobs:
#             job_title = job.get("job_title", "Unknown")
#             company = job.get("company", "Unknown")
#             location = job.get("location", "Unknown")
#             url = job.get("url", "")
#             date_posted = job.get("date_posted", "")
#             salary = job.get("salary_string", None)
#             remote = job.get("remote", False)

#             matching_jobs.append({
#                 "title": job_title,
#                 "company": company,
#                 "location": location,
#                 "url": url,
#                 "date_posted": date_posted,
#                 "salary": salary,
#                 "remote": remote
#             })

#             for tech in job.get("technology_slugs", []) or []:
#                 tech_counter[tech] += 1
#             for kw in job.get("keyword_slugs", []) or []:
#                 keyword_counter[kw] += 1

#         return {
#             "jobs_found": len(jobs),
#             "matching_jobs": matching_jobs,
#             "tech_skills": tech_counter.most_common(20),
#             "keyword_skills": keyword_counter.most_common(30),
#         }

#     except Exception as e:
#         st.error(f"API Error: {str(e)}")
#         return {"jobs_found": 0, "matching_jobs": [], "tech_skills": [], "keyword_skills": []}


# # ========== AGENT 3: GAP ANALYZER ==========
# def agent_gap_analyzer(student_skills, market_data):
#     student_lower = {s.lower() for s in student_skills}

#     required_gaps = []
#     matched_skills = []

#     for skill, count in market_data["tech_skills"]:
#         skill_clean = skill.lower().strip()
#         if skill_clean in student_lower:
#             matched_skills.append({"skill": skill, "demand": count})
#         else:
#             required_gaps.append({"skill": skill, "demand": count, "priority": "HIGH"})

#     # Also check keyword skills for gaps (filter to meaningful ones)
#     skip_keywords = {"job-descriptions", "provide-support", "use-case", "planning-and-design",
#                      "visual-art-design", "product-development-and-design", "policies-and-practices",
#                      "team-communication", "reporting-and-disclosure", "adaptive-project-management-and-reporting",
#                      "good-manufacturing-practice-gmp", "food-and-drug-administration-fda-or-usfda",
#                      "pharmaceutical-manufacturing", "education-training", "ecology-environment",
#                      "sensors-test-measurement", "electrical-engineering-and-planning",
#                      "environment-health-and-safety-hsse", "biotechnology", "cyber-intelligence",
#                      "training-certification"}

#     keyword_gaps = []
#     for skill, count in market_data["keyword_skills"]:
#         skill_clean = skill.lower().strip()
#         if skill_clean in skip_keywords:
#             continue
#         if skill_clean not in student_lower and skill_clean not in {g["skill"] for g in required_gaps}:
#             keyword_gaps.append({"skill": skill, "demand": count, "priority": "MEDIUM"})

#     return {
#         "matched_skills": matched_skills,
#         "required_gaps": required_gaps[:10],
#         "keyword_gaps": keyword_gaps[:10]
#     }


# # ========== AGENT 4: SKILLSBUILD RECOMMENDER ==========
# def agent_skillsbuild_recommender(gaps, jobs_found):
#     recommendations = []
#     seen_courses = set()

#     all_gaps = gaps["required_gaps"] + gaps["keyword_gaps"]

#     for gap in all_gaps:
#         skill_slug = gap["skill"].lower().strip()
#         if skill_slug in SKILLSBUILD_COURSES and skill_slug not in seen_courses:
#             course = SKILLSBUILD_COURSES[skill_slug]
#             recommendations.append({
#                 "skill_gap": gap["skill"].replace("-", " ").title(),
#                 "priority": gap["priority"],
#                 "course_name": course["name"],
#                 "course_url": course["url"],
#                 "reason": f"Found in {gap['demand']} of {jobs_found} job postings"
#             })
#             seen_courses.add(skill_slug)

#     return recommendations


# # ========== STREAMLIT UI ==========
# st.set_page_config(page_title="Career Gap Navigator", page_icon="🎯", layout="wide")

# # Header
# st.markdown("""
# <div style="text-align: center; padding: 1rem 0;">
#     <h1>🎯 Career Gap Navigator</h1>
#     <p style="font-size: 1.1rem; opacity: 0.8;">
#         Multi-Agent AI System powered by IBM watsonx Orchestrate & SkillsBuild
#     </p>
# </div>
# """, unsafe_allow_html=True)

# st.markdown("---")

# # Input section
# col1, col2, col3 = st.columns([2, 1, 1])

# with col1:
#     st.subheader("📚 Your courses")
#     courses_input = st.text_area(
#         "Paste your current courses (one per line)",
#         value="ISM 610 Data Analytics\nCSC 520 Machine Learning\nISM 645 Database Management\nISM 620 Programming for Analytics",
#         height=150,
#         help="Enter course codes and names as they appear on your transcript"
#     )

# with col2:
#     st.subheader("💼 Target role")
#     target_role = st.selectbox(
#         "What role are you targeting?",
#         ["Data Scientist", "Data Analyst", "ML Engineer", "Data Engineer", "AI/ML", "Software Engineer"]
#     )

# with col3:
#     st.subheader("📍 Location")
#     location = st.selectbox(
#         "Preferred job location",
#         ["North Carolina", "United States", "Remote"]
#     )

# st.markdown("")

# if st.button("🔍 Analyze My Career Gap", type="primary", use_container_width=True):

#     if not THEIRSTACK_API_KEY:
#         st.error("TheirStack API key not found. Please set THEIRSTACK_API_KEY in your .env file.")
#         st.stop()

#     # ===== AGENT 1 =====
#     with st.status("🤖 **Agent 1: Curriculum Analyzer** — Extracting skills from your courses...", expanded=True) as status:
#         student_skills = agent_curriculum_analyzer(courses_input)
#         st.write(f"Found **{len(student_skills)}** skills: {', '.join(s.replace('-', ' ').title() for s in student_skills)}")
#         status.update(label=f"✅ Agent 1 complete — {len(student_skills)} skills extracted", state="complete")

#     # ===== AGENT 2 =====
#     with st.status("🤖 **Agent 2: Job Market Scout** — Searching live job postings...", expanded=True) as status:
#         market_data = agent_job_market_scout(target_role, location)
#         st.write(f"Found **{market_data['jobs_found']}** live job postings for '{target_role}' in {location}")
#         if market_data["matching_jobs"]:
#             for job in market_data["matching_jobs"][:3]:
#                 st.write(f"  • {job['title']} at **{job['company']}** — {job['location']}")
#         status.update(label=f"✅ Agent 2 complete — {market_data['jobs_found']} live jobs found", state="complete")

#     if market_data["jobs_found"] == 0:
#         st.warning("No jobs found for this search. Try broadening your location to 'United States'.")
#         st.stop()

#     # ===== AGENT 3 =====
#     with st.status("🤖 **Agent 3: Gap Analyzer** — Comparing your skills to market demands...", expanded=True) as status:
#         gaps = agent_gap_analyzer(student_skills, market_data)
#         st.write(f"Matched **{len(gaps['matched_skills'])}** skills, found **{len(gaps['required_gaps'])}** tech gaps and **{len(gaps['keyword_gaps'])}** keyword gaps")
#         status.update(label=f"✅ Agent 3 complete — {len(gaps['required_gaps'])} gaps identified", state="complete")

#     # ===== AGENT 4 =====
#     with st.status("🤖 **Agent 4: SkillsBuild Recommender** — Matching courses to your gaps...", expanded=True) as status:
#         recommendations = agent_skillsbuild_recommender(gaps, market_data["jobs_found"])
#         st.write(f"Found **{len(recommendations)}** IBM SkillsBuild courses for your gaps")
#         status.update(label=f"✅ Agent 4 complete — {len(recommendations)} courses recommended", state="complete")

#     st.markdown("---")

#     # ===== RESULTS =====
#     st.subheader("📊 Your Career Gap Report")

#     res1, res2 = st.columns(2)

#     with res1:
#         st.markdown("#### ✅ Skills you have (market-aligned)")
#         if gaps["matched_skills"]:
#             for s in gaps["matched_skills"]:
#                 skill_name = s["skill"].replace("-", " ").title()
#                 st.success(f"**{skill_name}** — found in {s['demand']}/{market_data['jobs_found']} postings")
#         else:
#             st.info("No direct technology matches — your skills may be listed as keywords instead")

#     with res2:
#         st.markdown("#### ⚠️ Skills you're missing")
#         if gaps["required_gaps"]:
#             for g in gaps["required_gaps"][:8]:
#                 skill_name = g["skill"].replace("-", " ").title()
#                 st.error(f"**{skill_name}** — in {g['demand']}/{market_data['jobs_found']} postings")
#         if gaps["keyword_gaps"]:
#             for g in gaps["keyword_gaps"][:5]:
#                 skill_name = g["skill"].replace("-", " ").title()
#                 st.warning(f"**{skill_name}** — in {g['demand']}/{market_data['jobs_found']} postings")

#     st.markdown("---")

#     # ===== SKILLSBUILD COURSES =====
#     st.subheader("📚 Recommended IBM SkillsBuild Courses")

#     if recommendations:
#         for rec in recommendations:
#             priority_icon = "🔴" if rec["priority"] == "HIGH" else "🟡"
#             st.markdown(f"{priority_icon} **{rec['course_name']}** — closes gap in *{rec['skill_gap']}*")
#             st.markdown(f"&nbsp;&nbsp;&nbsp;&nbsp;🔗 [{rec['course_url']}]({rec['course_url']})")
#             st.caption(f"&nbsp;&nbsp;&nbsp;&nbsp;{rec['reason']}")
#     else:
#         st.info("No direct SkillsBuild matches found. Visit [IBM SkillsBuild](https://skillsbuild.org) to explore courses.")

#     st.markdown("---")

#     # ===== MATCHING JOBS =====
#     st.subheader("🏢 Live Job Postings (from today's market)")

#     for job in market_data["matching_jobs"]:
#         col_j1, col_j2 = st.columns([3, 1])
#         with col_j1:
#             title_text = f"**{job['title']}** at {job['company']}"
#             if job.get("remote"):
#                 title_text += " 🌐 Remote"
#             st.markdown(title_text)
#             st.caption(f"📍 {job['location']} • Posted: {job['date_posted']}")
#         with col_j2:
#             if job.get("url"):
#                 st.link_button("Apply →", job["url"], use_container_width=True)

#     st.markdown("---")

#     # ===== RESPONSIBLE AI =====
#     st.subheader("🔍 How This Analysis Was Made (Responsible AI)")
#     st.info(
#         f"**4 specialized AI agents** collaborated to produce this report:\n\n"
#         f"1. **Curriculum Analyzer** extracted {len(student_skills)} skills from your coursework\n"
#         f"2. **Job Market Scout** searched {market_data['jobs_found']} real-time job postings via TheirStack API\n"
#         f"3. **Gap Analyzer** compared your skills against live market demands\n"
#         f"4. **SkillsBuild Recommender** matched {len(recommendations)} IBM courses to close your gaps\n\n"
#         f"📅 Data sourced from live job postings within the last 30 days\n"
#         f"🔒 No personal data is stored or shared\n"
#         f"📊 All recommendations are transparent — you can see exactly why each was made"
#     )

#     st.markdown("---")
#     st.caption("Built for NCCU AI Hackathon 2026 | Powered by IBM watsonx Orchestrate & SkillsBuild")