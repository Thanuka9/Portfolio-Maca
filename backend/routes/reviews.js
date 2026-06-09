const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/reviews.json');

function readReviews() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeReviews(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const reviews = readReviews().filter(r => r.status === 'approved');
  res.json(reviews);
});

router.post('/', (req, res) => {
  const { name, email, role, projectType, rating, comment } = req.body;
  if (!name || !comment || !rating) {
    return res.status(400).json({ error: 'Name, rating, and comment are required.' });
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  const reviews = readReviews();
  const newReview = {
    id: Date.now(),
    name: String(name).slice(0, 100),
    email: String(email || '').slice(0, 200),
    role: String(role || '').slice(0, 100),
    projectType: String(projectType || '').slice(0, 100),
    rating: Number(rating),
    comment: String(comment).slice(0, 2000),
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  };

  reviews.push(newReview);
  writeReviews(reviews);

  res.status(201).json({ message: 'Review submitted successfully. It will appear after approval.', id: newReview.id });
});

const ADMIN_KEY = process.env.ADMIN_API_KEY;

function adminAuth(req, res, next) {
  if (!ADMIN_KEY) {
    return res.status(503).json({ error: 'Admin API is not configured. Set ADMIN_API_KEY environment variable.' });
  }
  const key = req.headers['x-admin-key'];
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized. A valid x-admin-key header is required.' });
  }
  next();
}

router.get('/admin', adminAuth, (req, res) => {
  res.json(readReviews());
});

router.patch('/admin/:id', adminAuth, (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const reviews = readReviews();
  const idx = reviews.findIndex(r => r.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found.' });

  reviews[idx].status = status;
  writeReviews(reviews);
  res.json(reviews[idx]);
});

router.delete('/admin/:id', adminAuth, (req, res) => {
  let reviews = readReviews();
  const idx = reviews.findIndex(r => r.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Review not found.' });

  reviews.splice(idx, 1);
  writeReviews(reviews);
  res.json({ message: 'Deleted.' });
});

module.exports = router;
