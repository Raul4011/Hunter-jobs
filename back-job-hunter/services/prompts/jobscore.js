function buildJobScorePrompt(job, profile) {
  return `
You are a senior technical recruiter specialized in fullstack development hiring.

Your task is to evaluate how suitable a job is for a candidate.

---

CANDIDATE PROFILE:
- Target role: Fullstack / Frontend Developer
- Experience: ${profile.experience_years} years
- Skills: ${profile.skills.join(", ")}
- Strong skills: ${profile.strong_skills.join(", ")}
- Weak skills: ${profile.weak_skills.join(", ")}

---

JOB:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description:
${job.description}

---

EVALUATION RULES:

1. TECH MATCH (0-100):
How many required skills match candidate skills?

2. SENIORITY MATCH (0-100):
Is the level appropriate (junior/mid/senior)?

3. KEYWORD MATCH (0-100):
How many relevant technologies appear in both sides?

4. OVERALL SCORE (0-100):
Weighted combination:
- tech_match 50%
- seniority_match 30%
- keyword_match 20%

---

DECISION RULES:
- 80-100 → "apply"
- 50-79 → "review"
- 0-49 → "skip"

---

RETURN ONLY VALID JSON:

{
  "tech_match": number,
  "seniority_match": number,
  "keyword_match": number,
  "score": number,
  "decision": "apply" | "review" | "skip",
  "strengths": [string],
  "gaps": [string],
  "reason": string
}
`;
}

module.exports = { buildJobScorePrompt };