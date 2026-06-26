const aiClient = require("./ai.client");
const { buildJobScorePrompt } = require("./prompts/jobscore");

async function analyzeJob(job, profile) {
  const prompt = buildJobScorePrompt(job, profile);

  const response = await aiClient.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyzeJob };