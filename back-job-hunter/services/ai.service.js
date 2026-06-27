const aiClient = require("./ai.client");
const { buildJobScorePrompt } = require("./prompts/jobscore");

function safeParseJSON(text) {
  try {
    // limpia posibles ```json
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Invalid JSON from AI: " + text);
  }
}

async function analyzeJob(job, profile) {
  const prompt = buildJobScorePrompt(job, profile);

  try {
    const response = await aiClient.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    const parsed = safeParseJSON(content);

    return {
      ...parsed,
      raw: content
    };

  } catch (error) {
    console.error("AI analysis failed:", {
      jobId: job.id,
      error: error.message
    });

    // fallback seguro
    return {
      must_have_match: 0,
      role_fit: 0,
      experience_fit: 0,
      score: 0,
      decision: "skip",
      strengths: [],
      gaps: ["AI failure"],
      reason: "AI service error",
      error: error.message
    };
  }
}

module.exports = { analyzeJob };