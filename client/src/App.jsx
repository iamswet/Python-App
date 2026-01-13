import React, { useEffect, useState } from 'react';

export default function App() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(setJobs)
      .catch(console.error);
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>Job Portal (MVP)</h1>
      <section>
        <h2>Jobs</h2>
        {jobs.length === 0 && <p>No jobs yet.</p>}
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              <strong>{job.title}</strong> — {job.company} — {job.location}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
