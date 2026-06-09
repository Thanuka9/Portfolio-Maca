const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const serveFrontend = isProduction || process.env.SERVE_FRONTEND === 'true';

// ─── Rate limiting (in-memory) ───────────────────────────────────────────────
function createRateLimiter(maxRequests, windowMs) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
    }
    entry.count += 1;
    hits.set(key, entry);
    if (entry.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

const postLimiter = createRateLimiter(10, 15 * 60 * 1000);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'];

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (!isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json({ limit: '100kb' }));

// ─── Mail helper ─────────────────────────────────────────────────────────────
async function createMailTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  if (smtpUser && smtpPass) {
    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      }),
      from: `"Azeem Naveed" <${smtpUser}>`,
      isTestMode: false,
    };
  }

  if (isProduction) {
    return null;
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      }),
      from: '"Azeem Naveed (Test)" <sender@ethereal.email>',
      isTestMode: true,
    };
  } catch (err) {
    console.warn('Email transporter unavailable:', err.message);
    return null;
  }
}

async function sendMail({ to, subject, html }) {
  const mailConfig = await createMailTransporter();
  if (!mailConfig) {
    console.log('\n====== EMAIL (no SMTP configured) ======\n', subject, '\nTo:', to, '\n========================================\n');
    return { mock: true };
  }

  const info = await mailConfig.transporter.sendMail({
    from: mailConfig.from,
    to,
    subject,
    html,
  });

  if (mailConfig.isTestMode) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Test email preview:', previewUrl);
    return { previewUrl };
  }

  return { messageId: info.messageId };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── API routes ──────────────────────────────────────────────────────────────
app.use('/api/reviews', postLimiter, reviewsRouter);

const contactsPath = path.join(__dirname, 'data', 'contacts.json');
const notifyEmail = process.env.NOTIFY_EMAIL || 'azeemnaveed100@gmail.com';

app.post('/api/contact', postLimiter, async (req, res) => {
  const { name, email, phone, projectType, budget, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const contact = {
    id: Date.now(),
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 200),
    phone: String(phone || '').slice(0, 50),
    projectType: String(projectType || '').slice(0, 100),
    budget: String(budget || '').slice(0, 50),
    message: String(message).slice(0, 5000),
    createdAt: new Date().toISOString(),
  };

  let contacts = [];
  try {
    contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
  } catch (_) {}
  contacts.push(contact);
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));

  const emailHtml = `
    <h2>New Contact Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(contact.phone || 'N/A')}</p>
    <p><strong>Project Type:</strong> ${escapeHtml(contact.projectType || 'N/A')}</p>
    <p><strong>Budget:</strong> ${escapeHtml(contact.budget || 'N/A')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(contact.message).replace(/\n/g, '<br>')}</p>
  `;

  try {
    await sendMail({
      to: notifyEmail,
      subject: `New inquiry from ${contact.name}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error('Contact notification email failed:', err.message);
  }

  console.log('New contact inquiry from:', contact.name, '|', contact.email);
  res.status(201).json({ message: 'Message received! I will get back to you within 24 hours.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/estimate/email', postLimiter, async (req, res) => {
  const { estimate, clientEmail } = req.body;
  if (!estimate || !clientEmail) {
    return res.status(400).json({ error: 'Estimate details and client email are required.' });
  }

  const addonsRows = estimate.addonsApplied.length > 0
    ? estimate.addonsApplied.map(a => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;color:#555;font-size:13px;">${escapeHtml(a.name)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;text-align:right;font-family:monospace;color:#333;font-size:13px;">${escapeHtml(a.price)}</td>
        </tr>`).join('')
    : '';

  const notesSection = estimate.notes ? `
    <div style="margin-bottom:24px;padding:16px 20px;background:#f8f9ff;border:1px solid #d0d8f0;border-radius:10px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#7a82a0;margin-bottom:8px;">Project Notes</div>
      <div style="font-size:13px;color:#444;line-height:1.6;">${escapeHtml(estimate.notes)}</div>
    </div>` : '';

  const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f5f8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
    <div style="height:6px;background:linear-gradient(90deg,#1a5fd1,#0bc4d4);"></div>
    <div style="padding:30px 40px;">
      <h1 style="color:#1a5fd1;margin:0;">AZEEM NAVEED</h1>
      <p style="color:#7a82a0;font-size:12px;">Project Estimate ${escapeHtml(estimate.estimateNum)}</p>
      <p><strong>Client:</strong> ${escapeHtml(estimate.client)}</p>
      <p><strong>Service:</strong> ${escapeHtml(estimate.service)} — ${escapeHtml(estimate.tier)} Tier</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr><td>${escapeHtml(estimate.service)}</td><td style="text-align:right;">$${escapeHtml(estimate.baseMin)}–$${escapeHtml(estimate.baseMax)}</td></tr>
        ${addonsRows}
      </table>
      <div style="text-align:center;padding:20px;background:#eef3ff;border:2px solid #1a5fd1;border-radius:10px;">
        <div style="font-size:28px;font-weight:bold;color:#1a5fd1;">$${escapeHtml(estimate.totalMin)}–$${escapeHtml(estimate.totalMax)}</div>
      </div>
      ${notesSection}
      <p style="font-size:11px;color:#78520a;background:#fffbf0;border:1px solid #f5a623;padding:12px;border-radius:8px;">
        This is a preliminary estimate only — not a binding quote.
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await sendMail({
      to: `${clientEmail}, ${notifyEmail}`,
      subject: `Project Estimate ${estimate.estimateNum} — Azeem Naveed`,
      html: emailHtml,
    });
    res.status(200).json({
      success: true,
      message: result.mock ? 'Estimate logged (configure SMTP for email delivery).' : 'Email sent successfully!',
      previewUrl: result.previewUrl,
      mock: !!result.mock,
    });
  } catch (error) {
    console.error('Error sending estimate email:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// ─── Serve frontend in production ────────────────────────────────────────────
if (serveFrontend) {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
    console.log('Serving frontend from', frontendDist);
  } else {
    console.warn('Frontend dist not found. Run: cd frontend && npm run build');
  }
}

app.listen(PORT, () => {
  console.log(`\n✅ Azeem Portfolio Backend running on http://localhost:${PORT}`);
  console.log(`   Reviews API: http://localhost:${PORT}/api/reviews`);
  if (process.env.ADMIN_API_KEY) {
    console.log(`   Admin API:   http://localhost:${PORT}/api/reviews/admin`);
  } else {
    console.log('   Admin API:   disabled (set ADMIN_API_KEY to enable)');
  }
  console.log('');
});
