import json
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def generate_learning_path(skill_gaps: str) -> str:
    """
    Creates a week-by-week learning path for skill gaps with free resources.

    Args:
        skill_gaps: Comma-separated list of skills to learn

    Returns:
        JSON with weekly learning plan including IBM SkillsBuild and free resources
    """
    RESOURCES = {
        "python": [{"name": "IBM SkillsBuild: Python", "url": "https://skillsbuild.org/college-students/course-catalog/data-science", "source": "IBM SkillsBuild"}, {"name": "Kaggle Python", "url": "https://kaggle.com/learn/python", "source": "Kaggle"}],
        "sql": [{"name": "IBM SkillsBuild: SQL", "url": "https://skillsbuild.org/college-students/course-catalog/data-science", "source": "IBM SkillsBuild"}, {"name": "SQLBolt", "url": "https://sqlbolt.com", "source": "SQLBolt"}],
        "machine learning": [{"name": "IBM SkillsBuild: ML", "url": "https://skillsbuild.org/college-students/course-catalog/artificial-intelligence", "source": "IBM SkillsBuild"}, {"name": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course", "source": "Google"}],
        "deep learning": [{"name": "IBM SkillsBuild: DL", "url": "https://skillsbuild.org/college-students/course-catalog/artificial-intelligence", "source": "IBM SkillsBuild"}, {"name": "fast.ai", "url": "https://course.fast.ai", "source": "fast.ai"}],
        "aws": [{"name": "IBM SkillsBuild: Cloud", "url": "https://skillsbuild.org/college-students/course-catalog/cloud-computing", "source": "IBM SkillsBuild"}, {"name": "AWS Skill Builder", "url": "https://explore.skillbuilder.aws/learn", "source": "AWS"}],
        "docker": [{"name": "IBM SkillsBuild: Containers", "url": "https://skillsbuild.org/college-students/course-catalog/cloud-computing", "source": "IBM SkillsBuild"}, {"name": "Docker Getting Started", "url": "https://docs.docker.com/get-started", "source": "Docker"}],
        "tableau": [{"name": "IBM SkillsBuild: Data Viz", "url": "https://skillsbuild.org/college-students/course-catalog/data-science", "source": "IBM SkillsBuild"}, {"name": "Tableau Free Training", "url": "https://tableau.com/learn/training", "source": "Tableau"}],
        "nlp": [{"name": "IBM SkillsBuild: AI", "url": "https://skillsbuild.org/college-students/course-catalog/artificial-intelligence", "source": "IBM SkillsBuild"}, {"name": "HuggingFace NLP", "url": "https://huggingface.co/learn/nlp-course", "source": "Hugging Face"}],
        "tensorflow": [{"name": "IBM SkillsBuild: AI", "url": "https://skillsbuild.org/college-students/course-catalog/artificial-intelligence", "source": "IBM SkillsBuild"}, {"name": "TensorFlow Tutorials", "url": "https://tensorflow.org/tutorials", "source": "TensorFlow"}],
        "git": [{"name": "IBM SkillsBuild: Web Dev", "url": "https://skillsbuild.org/college-students/course-catalog/web-development", "source": "IBM SkillsBuild"}, {"name": "GitHub Handbook", "url": "https://docs.github.com/en/get-started/using-git", "source": "GitHub"}],
    }
    
    DIFFICULTY = {"python":1,"sql":1,"git":1,"excel":1,"tableau":2,"r":2,
        "machine learning":3,"aws":3,"docker":3,"deep learning":4,"nlp":3,"tensorflow":4}
    
    gaps = [s.strip().lower() for s in skill_gaps.split(",") if s.strip()]
    gaps.sort(key=lambda s: DIFFICULTY.get(s, 2))
    
    weeks = []
    week = 1
    for i, skill in enumerate(gaps):
        if i > 0 and i % 2 == 0:
            week += 1
        diff = DIFFICULTY.get(skill, 2)
        hrs = "3-5" if diff <= 1 else "5-8" if diff <= 2 else "8-12" if diff <= 3 else "10-15"
        resources = RESOURCES.get(skill, [{"name": f"Search: learn {skill} free", "url": f"https://google.com/search?q=learn+{skill.replace(' ','+')}+free+course", "source": "Google"}])
        
        existing = next((w for w in weeks if w["week"] == week), None)
        item = {"skill": skill, "hours_per_week": hrs, "resources": resources}
        if existing:
            existing["skills"].append(item)
        else:
            weeks.append({"week": week, "skills": [item]})
    
    return json.dumps({
        "total_weeks": len(weeks),
        "plan": weeks,
        "note": "Start with foundations, build up to advanced topics. All resources are free."
    }, indent=2)
