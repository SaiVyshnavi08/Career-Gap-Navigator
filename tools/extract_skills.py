from ibm_watsonx_orchestrate.agent_builder.tools import tool
import json

COURSE_SKILL_MAP = {
    "ISM 610 Data Analytics": [
        "python", "sql", "data-analytics", "statistics", "pandas", "data-visualization"
    ],
    "CSC 520 Machine Learning": [
        "python", "machine-learning", "scikit-learn", "statistics", "pandas"
    ],
    "ISM 645 Database Management": [
        "sql", "data-modeling", "database"
    ],
    "ISM 620 Programming for Analytics": [
        "python", "r", "programming"
    ],
    "ISM 630 Business Intelligence": [
        "sql", "tableau", "excel", "data-visualization", "extract-transform-and-load-etl"
    ],
    "CSC 510 Artificial Intelligence": [
        "python", "machine-learning", "natural-language-processing", "deep-learning"
    ],
    "ISM 650 Project Management": [
        "project-management", "agile"
    ],
    "CSC 490 Cloud Computing": [
        "amazon-web-services", "microsoft-azure", "docker", "cloud-computing"
    ],
    "CSC 330 Software Engineering": [
        "java", "git", "software-engineering"
    ],
    "ISM 515 Data Mining": [
        "python", "machine-learning", "statistics", "data-analytics"
    ],
}

@tool
def extract_skills_from_courses(course_list: str) -> str:
    """
    Extract normalized skills from course names.
    """
    text = course_list.lower()
    found_skills = set()
    matched_courses = []

    for course_name, skills in COURSE_SKILL_MAP.items():
        if course_name.lower() in text:
            matched_courses.append(course_name)
            found_skills.update(skills)

    return json.dumps(
        {
            "matched_courses": matched_courses,
            "extracted_skills": sorted(found_skills),
        },
        indent=2,
    )
