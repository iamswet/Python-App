const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');

// List jobs
router.get('/', async (req, res) => {
  const jobs = await prisma.job.findMany({ where: { active: true }, include: { employer: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(jobs);
});

// Get job
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const job = await prisma.job.findUnique({ where: { id }, include: { employer: true } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Create job (employer only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'EMPLOYER') return res.status(403).json({ error: 'Only employers can create jobs' });
  const { title, company, location, description, salaryRange } = req.body;
  try {
    const job = await prisma.job.create({ data: { title, company, location, description, salaryRange, employerId: req.user.id } });
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job
router.put('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employerId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  const updated = await prisma.job.update({ where: { id }, data: req.body });
  res.json(updated);
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.employerId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  await prisma.job.delete({ where: { id } });
  res.json({ success: true });
});

module.exports = router;
