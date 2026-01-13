const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, uploadDir), filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) });
const upload = multer({ storage });

// Apply to a job
router.post('/:jobId/apply', auth, upload.single('resume'), async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (req.user.role !== 'APPLICANT') return res.status(403).json({ error: 'Only applicants can apply' });
  const resumePath = req.file ? req.file.path : null;
  try {
    const application = await prisma.application.create({ data: { jobId, applicantId: req.user.id, resumePath, coverLetter: req.body.coverLetter } });
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Employer: list applicants for a job
router.get('/:jobId/applicants', auth, async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employerId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  const apps = await prisma.application.findMany({ where: { jobId }, include: { applicant: true } });
  res.json(apps);
});

module.exports = router;
