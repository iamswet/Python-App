const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow the React dev server or the origin set in CLIENT_ORIGIN
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: clientOrigin, credentials: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api', applicationsRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Job portal server is running' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
