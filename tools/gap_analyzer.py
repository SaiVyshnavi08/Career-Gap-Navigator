import json
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def analyze_skill_gaps(student_skills: str, market_skills: str) -> str:
    """
    Compares student skills against market demanded skills and identifies gaps.

    Args:
        student_skills: Comma-separated list of student skills
        market_skills: Comma-separated list of market demanded skills

    Returns:
        JSON with matched skills, gaps, and readiness percentage
    """
    student = set(s.strip().lower() for s in student_skills.split(","))
    market = set(s.strip().lower() for s in market_skills.split(","))
    
    matched = sorted(student & market)
    gaps = sorted(market - student)
    readiness = round(len(matched) / max(1, len(market)) * 100)
    
    return json.dumps({
        "readiness_percent": readiness,
        "matched_skills": matched,
        "missing_skills": gaps,
        "total_market_skills": len(market),
        "recommendation": f"You are {readiness}% ready. Focus on: {', '.join(gaps[:3])}" if gaps else "You are market-ready!"
    }, indent=2)
