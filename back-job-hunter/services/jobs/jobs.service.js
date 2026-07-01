// src/services/jobs/jobs.service.js
const { fetchRemoteOkJobs } = require("./remoteok.service");

async function getAllJobs() {
  const remoteJobs = await fetchRemoteOkJobs();

  // acá después vas a sumar linkedin, etc.
  return remoteJobs;
}

module.exports = { getAllJobs };