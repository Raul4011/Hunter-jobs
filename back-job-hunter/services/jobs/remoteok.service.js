// src/services/jobs/remoteok.service.js
const axios = require("axios");

async function fetchRemoteOkJobs() {
  const { data } = await axios.get("https://remoteok.com/api");

  // el primer elemento es metadata
  const jobs = data.slice(1);

  return jobs.map((job) => ({
    id: `remoteok-${job.id}`,
    title: job.position,
    company: job.company,
    location: job.location,
    url: job.url,
    tags: job.tags || [],
    source: "remoteok",
    date: job.date
  }));
}

module.exports = { fetchRemoteOkJobs };