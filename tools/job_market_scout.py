from ibm_watsonx_orchestrate.agent_builder.tools import tool
import json
import requests
from collections import Counter

API_URL = "https://api.theirstack.com/v1/jobs/search"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOjEsImp0aSI6IjYxYjg2NzI3LTVkOGEtNDZhMy1hNTM4LTVlZWEzODk2YTVmMCIsImNyZWF0ZWRfYnkiOjE0OTg3MSwicGVybWlzc2lvbnMiOltdLCJhdWQiOiJhcGkiLCJpYXQiOjE3NzM4ODE2MTEsInN1YiI6IjE0OTI0NCIsIm5hbWUiOiJKb2JzIiwiZW1haWwiOiJndWRpcGFsbGlzYWl2eXNobmF2aUBnbWFpbC5jb20ifQ.DoJhpjxIbeginaPZ5uS_a1TOfW9G0WYd4ZNH7_6bQIo"
@tool
def analyze_job_market(target_role: str) -> str:
    """
    Fetch real job data and return ranked skills + job titles.
    """

    ROLE_MAP = {
        "Data Scientist": ["Data Scientist", "Data Science"],
        "Data Analyst": ["Data Analyst", "Data Analytics"],
        "ML Engineer": ["Machine Learning Engineer", "ML Engineer"],
    }

    titles = ROLE_MAP.get(target_role, [target_role])

    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "posted_at_max_age_days": 30,
                "job_title_or": titles,
                "limit": 15,
                "page": 0
            },
            timeout=10
        )

        data = response.json()
        jobs = data.get("data", [])

        tech_counter = Counter()
        job_titles = []

        for job in jobs:
            job_titles.append(f"{job.get('job_title')} at {job.get('company')}")
            for tech in job.get("technology_slugs", []) or []:
                tech_counter[tech] += 1

        ranked_skills = [
            {"skill": skill, "count": count}
            for skill, count in tech_counter.most_common(10)
        ]

        return json.dumps({
            "jobs_found": len(jobs),
            "matching_jobs": job_titles[:5],
            "market_skills_ranked": ranked_skills
        }, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e)})