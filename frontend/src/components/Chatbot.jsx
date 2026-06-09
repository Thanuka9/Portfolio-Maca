import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, ChevronDown, FileText,
  Printer, Download, AlertTriangle, Check, Phone,
} from 'lucide-react';
import { QUICK_REPLIES } from '../data/knowledgeBase';
import { PRICING, ADDONS, COMPLEXITY } from '../data/pricing';
import { apiUrl } from '../config/api';
import { matchIntent, generateResponse } from '../utils/chatbotRag';

// ─── Estimate Modal ────────────────────────────────────────────────────────────

const ESTIMATE_SERVICES = PRICING.map(p => ({ value: p.id, label: `${p.icon} ${p.service}` }));
const ESTIMATE_TIERS = ['starter', 'standard', 'premium'];
const COMPLEXITY_OPTIONS = Object.entries(COMPLEXITY).map(([k, v]) => ({ value: k, label: `${v.label} — ${v.description}` }));

function EstimateModal({ onClose }) {
  const [step, setStep] = useState(1); // 1=form, 2=result
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    projectType: '',
    tier: 'standard',
    complexity: 'standard',
    duration: '',
    revisions: '3',
    deadline: '',
    notes: '',
    rushDelivery: false,
    addSubtitles: false,
    addThumbnail: false,
    addVoiceover: false,
  });
  const [estimate, setEstimate] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [emailPreviewUrl, setEmailPreviewUrl] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generateEstimate = () => {
    const service = PRICING.find(p => p.id === form.projectType);
    if (!service) return;
    const tier = service.tiers.find(t => t.name.toLowerCase() === form.tier) || service.tiers[1];
    const cx = COMPLEXITY[form.complexity] || COMPLEXITY.standard;
    const baseMin = Math.round(tier.priceMin * cx.multiplier);
    const baseMax = Math.round(tier.priceMax * cx.multiplier);
    let addonsTotal = 0;
    const addonsApplied = [];
    if (form.rushDelivery) { addonsTotal += 40; addonsApplied.push({ name: 'Rush Delivery (48h)', price: '$40' }); }
    if (form.addSubtitles) { addonsTotal += 30; addonsApplied.push({ name: 'Subtitles / Captions', price: '$30' }); }
    if (form.addThumbnail) { addonsTotal += 20; addonsApplied.push({ name: 'Custom Thumbnail', price: '$20' }); }
    if (form.addVoiceover) { addonsTotal += 25; addonsApplied.push({ name: 'Voiceover Integration', price: '$25' }); }
    const totalMin = baseMin + addonsTotal;
    const totalMax = baseMax + addonsTotal;
    const today = new Date();
    const estimateNum = `AZE-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900) + 100}`;
    setEmailStatus('idle');
    setEmailPreviewUrl(null);
    setEstimate({
      estimateNum,
      date: today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      client: form.clientName || 'Valued Client',
      clientEmail: form.clientEmail,
      service: service.service,
      tier: tier.name,
      complexity: cx.label,
      includes: tier.includes,
      baseMin, baseMax,
      addonsApplied,
      addonsTotal,
      totalMin, totalMax,
      revisions: form.revisions,
      deadline: form.deadline,
      duration: form.duration,
      notes: form.notes,
    });
    setStep(2);
  };

  const handlePrint = () => {
    if (!estimate) return;
    const addonsRows = estimate.addonsApplied.length > 0
      ? estimate.addonsApplied.map(a => `
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;color:#555;font-size:13px;">${a.name}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #e8eaf0;text-align:right;font-family:monospace;color:#333;font-size:13px;">${a.price}</td>
          </tr>`).join('')
      : '';

    const notesSection = estimate.notes ? `
      <div style="margin-bottom:24px;padding:16px 20px;background:#f8f9ff;border:1px solid #d0d8f0;border-radius:10px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#7a82a0;margin-bottom:8px;">Project Notes</div>
        <div style="font-size:13px;color:#444;line-height:1.6;">${estimate.notes}</div>
      </div>` : '';

    const deadlineRow = estimate.deadline ? `
      <div style="padding:14px 18px;background:#fff;border:1px solid #dde1ee;border-radius:8px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#7a82a0;margin-bottom:4px;">Desired Delivery</div>
        <div style="font-size:14px;font-weight:600;color:#1a1d2e;">${new Date(estimate.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>` : '';

    const durationRow = estimate.duration ? `
      <div style="padding:14px 18px;background:#fff;border:1px solid #dde1ee;border-radius:8px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#7a82a0;margin-bottom:4px;">Video Duration</div>
        <div style="font-size:14px;font-weight:600;color:#1a1d2e;">${estimate.duration}</div>
      </div>` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Estimate ${estimate.estimateNum} — Azeem Naveed</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff;
      color: #1a1d2e;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }
    /* ── Top accent bar ── */
    .accent-bar {
      height: 6px;
      background: linear-gradient(90deg, #1a5fd1 0%, #0bc4d4 100%);
    }
    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 36px 48px 28px;
      border-bottom: 1px solid #eaecf5;
    }
    .brand-name {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #1a5fd1;
      margin-bottom: 4px;
    }
    .brand-sub {
      font-size: 12px;
      color: #7a82a0;
      margin-bottom: 2px;
    }
    .estimate-badge {
      display: inline-block;
      background: #1a5fd1;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 8px;
    }
    .estimate-id {
      font-size: 11px;
      color: #7a82a0;
      font-family: monospace;
      text-align: right;
    }
    /* ── Body content ── */
    .body { padding: 32px 48px; }
    /* ── Section title ── */
    .section-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #7a82a0;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid #eaecf5;
    }
    /* ── Info grid ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 28px;
    }
    .info-card {
      padding: 14px 18px;
      background: #f6f8ff;
      border: 1px solid #dde1ee;
      border-radius: 8px;
    }
    .info-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7a82a0;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #1a1d2e;
    }
    .info-value.accent { color: #1a5fd1; }
    /* ── Line items table ── */
    .breakdown-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      border: 1px solid #dde1ee;
      border-radius: 10px;
      overflow: hidden;
    }
    .breakdown-table thead th {
      background: #1a5fd1;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 12px 16px;
      text-align: left;
    }
    .breakdown-table thead th:last-child { text-align: right; }
    .breakdown-table tbody tr:nth-child(even) td { background: #f6f8ff; }
    .breakdown-table tbody td {
      padding: 12px 16px;
      border-bottom: 1px solid #e8eaf0;
      font-size: 13px;
      color: #333;
      background: #fff;
    }
    .breakdown-table tbody td:last-child {
      text-align: right;
      font-family: monospace;
      font-weight: 600;
      color: #1a1d2e;
    }
    .breakdown-table tbody td .item-desc {
      font-size: 11px;
      color: #7a82a0;
      margin-top: 3px;
    }
    /* ── Total box ── */
    .total-box {
      background: linear-gradient(135deg, #eef3ff 0%, #e6fbfc 100%);
      border: 2px solid #1a5fd1;
      border-radius: 12px;
      padding: 22px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    .total-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #1a5fd1;
      margin-bottom: 6px;
    }
    .total-amount {
      font-size: 36px;
      font-weight: 900;
      color: #1a5fd1;
      letter-spacing: -1px;
    }
    .total-meta {
      text-align: right;
      font-size: 12px;
      color: #555;
    }
    .total-meta .check {
      color: #14a85a;
      font-weight: 700;
      display: block;
      margin-top: 4px;
    }
    /* ── Disclaimer ── */
    .disclaimer {
      background: #fffbf0;
      border: 2px solid #f5a623;
      border-radius: 10px;
      padding: 20px 24px;
      margin-bottom: 28px;
    }
    .disclaimer-title {
      font-size: 13px;
      font-weight: 800;
      color: #b45309;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .disclaimer p {
      font-size: 12px;
      color: #78520a;
      line-height: 1.65;
      margin-bottom: 8px;
    }
    .disclaimer p:last-child { margin-bottom: 0; color: #a06a20; }
    .disclaimer strong { color: #7c4a08; }
    /* ── Footer ── */
    .doc-footer {
      border-top: 1px solid #eaecf5;
      padding: 18px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #9ea7c0;
    }
    @media print {
      body { margin: 0; }
      .page { max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="accent-bar"></div>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">AZEEM NAVEED</div>
      <div class="brand-sub">Professional Video Editor · Kandy, Sri Lanka</div>
      <div class="brand-sub">azeemnaveed100@gmail.com · +94 78 205 2653</div>
    </div>
    <div style="text-align:right;">
      <div class="estimate-badge">ESTIMATE</div>
      <div class="estimate-id">${estimate.estimateNum}</div>
      <div class="estimate-id" style="margin-top:3px;">${estimate.date}</div>
    </div>
  </div>

  <div class="body">

    <!-- Project Details -->
    <div class="section-title">Project Details</div>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Prepared For</div>
        <div class="info-value">${estimate.client}</div>
        <div style="font-size:11px;color:#7a82a0;font-family:monospace;margin-top:2px;">${estimate.clientEmail}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Service</div>
        <div class="info-value">${estimate.service}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Package Tier</div>
        <div class="info-value accent">${estimate.tier} Tier</div>
      </div>
      <div class="info-card">
        <div class="info-label">Complexity</div>
        <div class="info-value">${estimate.complexity}</div>
      </div>
      ${estimate.duration ? `<div class="info-card"><div class="info-label">Video Duration</div><div class="info-value">${estimate.duration}</div></div>` : ''}
      ${estimate.deadline ? `<div class="info-card"><div class="info-label">Desired Delivery</div><div class="info-value">${new Date(estimate.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>` : ''}
      <div class="info-card">
        <div class="info-label">Revisions Included</div>
        <div class="info-value">${estimate.revisions} rounds</div>
      </div>
      <div class="info-card">
        <div class="info-label">Delivery Method</div>
        <div class="info-value" style="color:#14a85a;">✓ Remote / Online</div>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="section-title">Price Breakdown</div>
    <table class="breakdown-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${estimate.service} — ${estimate.tier} Tier</strong>
            <div class="item-desc">${estimate.includes}</div>
          </td>
          <td>$${estimate.baseMin}–$${estimate.baseMax}</td>
        </tr>
        ${addonsRows}
      </tbody>
    </table>

    <!-- Total -->
    <div class="total-box">
      <div>
        <div class="total-label">Estimated Total</div>
        <div class="total-amount">$${estimate.totalMin}–$${estimate.totalMax}</div>
      </div>
      <div class="total-meta">
        <span>${estimate.revisions} revisions included</span>
        <span class="check">✓ Remote delivery</span>
        ${estimate.addonsTotal > 0 ? `<span style="display:block;margin-top:4px;color:#999;">Incl. $${estimate.addonsTotal} in add-ons</span>` : ''}
      </div>
    </div>

    ${notesSection}

    <!-- Disclaimer -->
    <div class="disclaimer">
      <div class="disclaimer-title">
        ⚠️ IMPORTANT DISCLAIMER — ESTIMATE ONLY
      </div>
      <p>
        This document is a <strong>preliminary estimate only</strong> and is intended for planning and budgeting
        purposes. The actual price may vary significantly based on the final project scope, raw footage length
        and quality, number and complexity of revisions, specific creative requirements, and delivery timeline.
      </p>
      <p>
        <strong>This estimate does not constitute a binding contract or official quote.</strong> For an accurate,
        confirmed quote, please contact Azeem Naveed directly at <strong>azeemnaveed100@gmail.com</strong> or
        via WhatsApp at <strong>+94 78 205 2653</strong> to discuss your project in detail.
      </p>
      <p>Estimate ID: ${estimate.estimateNum} · Generated: ${estimate.date}</p>
    </div>

  </div>

  <!-- Doc Footer -->
  <div class="doc-footer">
    <span>© ${new Date().getFullYear()} Azeem Naveed · Professional Video Editing</span>
    <span>upwork.com/freelancers/azeemn2</span>
  </div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
  };


  const handleWhatsApp = () => {
    if (!estimate) return;
    const msg = encodeURIComponent(
      `Hi Azeem! I received an estimate (${estimate.estimateNum}) for ${estimate.service} — ${estimate.tier} tier. Estimated range: $${estimate.totalMin}–$${estimate.totalMax}. I'd love to discuss this further!`
    );
    window.open(`https://wa.me/94782052653?text=${msg}`, '_blank');
  };

  const handleEmailEstimate = async () => {
    if (!estimate || !estimate.clientEmail) return;
    setSendingEmail(true);
    setEmailStatus('sending');
    try {
      const response = await fetch(apiUrl('/api/estimate/email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimate, clientEmail: estimate.clientEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setEmailStatus('sent');
        if (data.previewUrl) {
          setEmailPreviewUrl(data.previewUrl);
        }
      } else {
        setEmailStatus('error');
      }
    } catch (err) {
      console.error(err);
      setEmailStatus('error');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0e0e14] border border-[#414755]/60 rounded-2xl shadow-2xl z-10"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0e0e14]/95 backdrop-blur-sm border-b border-[#414755]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4b8eff]/20 border border-[#4b8eff]/30 flex items-center justify-center">
              <FileText size={16} className="text-[#4b8eff]" />
            </div>
            <div>
              <div className="font-display font-bold text-[#e5e2e1] text-sm">Project Estimate Generator</div>
              <div className="text-[#8b90a0] text-xs">Azeem Naveed — Video Editing</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#8b90a0] hover:text-[#e5e2e1] transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Your Name</label>
                  <input
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors placeholder:text-[#414755]"
                    placeholder="e.g. John Smith"
                    value={form.clientName}
                    onChange={e => set('clientName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors placeholder:text-[#414755]"
                    placeholder="e.g. john@example.com"
                    value={form.clientEmail}
                    onChange={e => set('clientEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Project Type *</label>
                  <select
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors appearance-none"
                    value={form.projectType}
                    onChange={e => set('projectType', e.target.value)}
                  >
                    <option value="">Select service...</option>
                    {ESTIMATE_SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Package Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ESTIMATE_TIERS.map(t => (
                      <button
                        key={t}
                        onClick={() => set('tier', t)}
                        className={`py-2 rounded-lg text-xs font-mono capitalize border transition-all ${
                          form.tier === t
                            ? 'bg-[#4b8eff]/20 border-[#4b8eff]/60 text-[#4b8eff]'
                            : 'bg-[#1a1a24] border-[#414755]/60 text-[#8b90a0] hover:border-[#414755]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Complexity</label>
                  <select
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors appearance-none"
                    value={form.complexity}
                    onChange={e => set('complexity', e.target.value)}
                  >
                    {COMPLEXITY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Final Video Duration</label>
                  <input
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors placeholder:text-[#414755]"
                    placeholder="e.g. 10–15 min"
                    value={form.duration}
                    onChange={e => set('duration', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Desired Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors"
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                  />
                </div>
                <div className="hidden sm:block"></div>
              </div>

              <div>
                <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-2">Add-ons</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'rushDelivery', label: '🚀 Rush Delivery (+$40)' },
                    { key: 'addSubtitles', label: '💬 Subtitles (+$30)' },
                    { key: 'addThumbnail', label: '🖼️ Thumbnail (+$20)' },
                    { key: 'addVoiceover', label: '🎙️ Voiceover (+$25)' },
                  ].map(addon => (
                    <button
                      key={addon.key}
                      onClick={() => set(addon.key, !form[addon.key])}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all text-left ${
                        form[addon.key]
                          ? 'bg-[#6ee7b7]/10 border-[#6ee7b7]/50 text-[#6ee7b7]'
                          : 'bg-[#1a1a24] border-[#414755]/60 text-[#8b90a0] hover:border-[#414755]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        form[addon.key] ? 'bg-[#6ee7b7] border-[#6ee7b7]' : 'border-[#414755]'
                      }`}>
                        {form[addon.key] && <Check size={10} className="text-[#0e0e14]" />}
                      </div>
                      {addon.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1.5">Project Notes</label>
                <textarea
                  className="w-full bg-[#1a1a24] border border-[#414755]/60 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#4b8eff]/60 transition-colors resize-none placeholder:text-[#414755]"
                  placeholder="Any specific requirements, style references, or notes..."
                  rows={3}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                />
              </div>

              <button
                onClick={generateEstimate}
                disabled={!form.projectType || !form.clientEmail}
                className="w-full flex items-center justify-center gap-2 bg-[#4b8eff] text-white font-display font-semibold py-3 rounded-xl hover:bg-[#6ba3ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <FileText size={16} />
                Generate Estimate
              </button>
            </div>
          ) : estimate ? (
            <div>
              {/* Printable estimate area */}
              <div>
                <div className="header flex justify-between items-start mb-6">
                  <div>
                    <div className="brand font-display text-2xl font-black text-[#adc6ff] tracking-tight">AZEEM NAVEED</div>
                    <div className="text-[#8b90a0] text-xs mt-1">Professional Video Editor · Kandy, Sri Lanka</div>
                    <div className="text-[#8b90a0] text-xs">azeemnaveed100@gmail.com · +94 78 205 2653</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-[#4b8eff]/20 border border-[#4b8eff]/40 text-[#4b8eff] text-xs font-mono px-3 py-1 rounded-full">
                      ESTIMATE
                    </div>
                    <div className="text-[#8b90a0] text-xs mt-2 font-mono">{estimate.estimateNum}</div>
                    <div className="text-[#8b90a0] text-xs">{estimate.date}</div>
                  </div>
                </div>

                <div className="bg-[#1a1a24] rounded-xl border border-[#414755]/40 p-5 mb-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Prepared For</div>
                      <div className="text-[#e5e2e1] font-display font-semibold">{estimate.client}</div>
                      <div className="text-[#8b90a0] text-xs font-mono mt-0.5">{estimate.clientEmail}</div>
                    </div>
                    <div>
                      <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Service</div>
                      <div className="text-[#e5e2e1] font-semibold text-sm">{estimate.service}</div>
                    </div>
                    <div>
                      <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Package</div>
                      <div className="text-[#4b8eff] font-semibold capitalize">{estimate.tier} Tier</div>
                    </div>
                    <div>
                      <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Complexity</div>
                      <div className="text-[#e5e2e1] text-sm">{estimate.complexity}</div>
                    </div>
                    {estimate.duration && (
                      <div>
                        <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Video Duration</div>
                        <div className="text-[#e5e2e1] text-sm">{estimate.duration}</div>
                      </div>
                    )}
                    {estimate.deadline && (
                      <div>
                        <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-1">Desired Delivery</div>
                        <div className="text-[#e5e2e1] text-sm">{new Date(estimate.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-2 mb-4">
                  <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-3">Breakdown</div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#414755]/30">
                    <div>
                      <div className="text-[#e5e2e1] text-sm font-semibold">{estimate.service} — {estimate.tier} Tier</div>
                      <div className="text-[#8b90a0] text-xs mt-0.5">{estimate.includes}</div>
                    </div>
                    <div className="text-[#e5e2e1] font-mono text-sm">${estimate.baseMin}–${estimate.baseMax}</div>
                  </div>
                  {estimate.addonsApplied.map(addon => (
                    <div key={addon.name} className="flex justify-between items-center py-2 border-b border-[#414755]/20">
                      <div className="text-[#c1c6d7] text-sm">{addon.name}</div>
                      <div className="text-[#c1c6d7] font-mono text-sm">{addon.price}</div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-[#4b8eff]/15 to-[#00c4cc]/10 border border-[#4b8eff]/30 rounded-xl p-5 mb-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider">Estimated Total</div>
                      <div className="text-[#4b8eff] text-3xl font-black font-display mt-1">
                        ${estimate.totalMin}–${estimate.totalMax}
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#8b90a0]">
                      <div className="font-mono">{estimate.revisions} revisions included</div>
                      <div className="mt-1 text-[#6ee7b7]">✓ Remote delivery</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {estimate.notes && (
                  <div className="bg-[#1a1a24] rounded-xl border border-[#414755]/40 p-4 mb-5">
                    <div className="text-[#8b90a0] text-xs font-mono uppercase tracking-wider mb-2">Project Notes</div>
                    <div className="text-[#c1c6d7] text-sm">{estimate.notes}</div>
                  </div>
                )}

                {/* DISCLAIMER */}
                <div className="bg-[#2a1500]/60 border border-[#f59e0b]/30 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#f59e0b] font-semibold text-sm font-display mb-2">
                        ⚠️ IMPORTANT DISCLAIMER — ESTIMATE ONLY
                      </div>
                      <p className="text-[#c1a56a] text-xs leading-relaxed">
                        This document is a <strong>preliminary estimate only</strong> and is intended for planning and budgeting purposes. The actual price may vary significantly based on the final project scope, raw footage length and quality, number and complexity of revisions, specific creative requirements, and delivery timeline.
                      </p>
                      <p className="text-[#c1a56a] text-xs leading-relaxed mt-2">
                        <strong>This estimate does not constitute a binding contract or official quote.</strong> For an accurate, confirmed quote, please contact Azeem Naveed directly at <strong>azeemnaveed100@gmail.com</strong> or via WhatsApp at <strong>+94 78 205 2653</strong> to discuss your project in detail.
                      </p>
                      <p className="text-[#8b90a0] text-xs mt-2">
                        Estimate ID: {estimate.estimateNum} · Generated: {estimate.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-[#4b8eff]/20 border border-[#4b8eff]/40 text-[#4b8eff] hover:bg-[#4b8eff]/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <Printer size={15} />
                  Print / Save PDF
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 bg-[#25d366]/20 border border-[#25d366]/40 text-[#25d366] hover:bg-[#25d366]/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  <Phone size={15} />
                  Discuss on WhatsApp
                </button>
                <button
                  onClick={handleEmailEstimate}
                  disabled={sendingEmail}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    emailStatus === 'sent'
                      ? 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981]'
                      : emailStatus === 'error'
                      ? 'bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444]'
                      : 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#a78bfa] hover:bg-[#8b5cf6]/30 disabled:opacity-50'
                  }`}
                >
                  <Send size={15} className={sendingEmail ? 'animate-spin' : ''} />
                  {sendingEmail ? 'Sending...' : emailStatus === 'sent' ? 'Email Sent!' : emailStatus === 'error' ? 'Failed!' : 'Email Estimate'}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 text-[#c1c6d7] hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm transition-all ml-auto"
                >
                  ← New Estimate
                </button>
              </div>
              {emailPreviewUrl && (
                <div className="mt-3 p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl text-center">
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#adc6ff] underline hover:text-[#4b8eff] transition-colors"
                  >
                    📬 [Dev Mode] Ethereal Test Mail Sent! Click here to view it.
                  </a>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Message Renderer ─────────────────────────────────────────────────────────

function renderMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      // Bold
      let parts = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      parts = parts.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Inline links
      parts = parts.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#4b8eff] hover:underline">$1</a>');
      // Blockquote
      if (line.startsWith('> ')) {
        const inner = parts.replace(/^&gt;\s*/, '').replace(/^> /, '');
        return <div key={i} className="border-l-2 border-[#f59e0b]/60 pl-3 my-1 text-[#c1a56a] text-xs italic">{inner.replace(/<[^>]+>/g, '')}</div>;
      }
      // Bullet
      if (line.startsWith('• ')) {
        return <div key={i} className="flex gap-2 text-xs text-[#c1c6d7]"><span className="text-[#4b8eff] mt-0.5 flex-shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: parts.replace(/^• /, '') }} /></div>;
      }
      if (!line.trim()) return <div key={i} className="h-2" />;
      return <div key={i} className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: parts }} />;
    });
}

// ─── Chatbot Widget ───────────────────────────────────────────────────────────

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: `Hi! 👋 I'm **AzeemBot** — your AI guide for Azeem's video editing portfolio.\n\nI can help with **pricing**, **services**, **past work**, and **project estimates**. I only answer questions related to hiring Azeem as a video editor.\n\nWhat can I help with?`,
      showQuickReplies: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setUnread(0);
    }
  }, [open, messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));

    const intent = matchIntent(text);
    const response = generateResponse(intent, text);

    setTyping(false);
    const botMsg = {
      id: Date.now() + 1,
      role: 'bot',
      text: response.text,
      showQuickReplies: response.showQuickReplies,
      showEstimateButton: response.showEstimateButton,
      showWhatsApp: response.showWhatsApp,
    };
    setMessages(m => [...m, botMsg]);
    if (!open) setUnread(u => u + 1);
    if (intent === 'estimate') {
      setTimeout(() => setShowEstimate(true), 300);
    }
  }, [open]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Estimate Modal */}
      <AnimatePresence>
        {showEstimate && <EstimateModal onClose={() => setShowEstimate(false)} />}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-w-[420px]"
          >
            <div className="chatbot-window flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#414755]/60"
              style={{ height: '560px', background: 'linear-gradient(160deg, #0d0d18 0%, #10101c 100%)' }}>

              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#414755]/40 bg-[#0e0e18]/80 backdrop-blur-sm flex-shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4b8eff] to-[#00c4cc] flex items-center justify-center shadow-lg">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#0e0e18]" />
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold text-[#e5e2e1] text-sm">AzeemBot</div>
                  <div className="text-[#6ee7b7] text-[10px] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#6ee7b7] rounded-full animate-pulse" />
                    Online · Typically replies instantly
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#8b90a0] hover:text-[#e5e2e1] transition-all"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chatbot-scroll">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'items-start'}`}>
                    {msg.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4b8eff] to-[#00c4cc] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'max-w-[75%]' : ''}`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-1 ${
                        msg.role === 'user'
                          ? 'bg-[#4b8eff] text-white rounded-br-sm'
                          : 'bg-[#1a1a28] border border-[#414755]/30 text-[#c1c6d7] rounded-bl-sm'
                      }`}>
                        {msg.role === 'user'
                          ? <span>{msg.text}</span>
                          : renderMarkdown(msg.text)}
                      </div>

                      {/* Bot action buttons */}
                      {msg.role === 'bot' && (msg.showEstimateButton || msg.showWhatsApp) && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {msg.showEstimateButton && (
                            <button
                              onClick={() => setShowEstimate(true)}
                              className="flex items-center gap-1.5 bg-[#4b8eff]/15 border border-[#4b8eff]/40 text-[#4b8eff] hover:bg-[#4b8eff]/25 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                            >
                              <FileText size={12} />
                              Get Estimate
                            </button>
                          )}
                          {msg.showWhatsApp && (
                            <a
                              href="https://wa.me/94782052653"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-[#25d366]/15 border border-[#25d366]/40 text-[#25d366] hover:bg-[#25d366]/25 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                            >
                              <MessageCircle size={12} />
                              Chat on WhatsApp
                            </a>
                          )}
                        </div>
                      )}

                      {/* Quick Replies */}
                      {msg.role === 'bot' && msg.showQuickReplies && msg.id === messages.filter(m => m.role === 'bot').at(-1)?.id && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {QUICK_REPLIES.map(q => (
                            <button
                              key={q.value}
                              onClick={() => sendMessage(q.value)}
                              className="bg-[#1a1a28] border border-[#414755]/50 text-[#c1c6d7] hover:border-[#4b8eff]/60 hover:text-[#4b8eff] px-2.5 py-1.5 rounded-full text-[10px] transition-all whitespace-nowrap"
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4b8eff] to-[#00c4cc] flex items-center justify-center flex-shrink-0">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="bg-[#1a1a28] border border-[#414755]/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#8b90a0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#8b90a0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#8b90a0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-[#414755]/30 bg-[#0d0d18]/60 flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about pricing, services, or get an estimate..."
                    className="flex-1 bg-[#1a1a28] border border-[#414755]/50 rounded-xl px-3.5 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#414755] focus:outline-none focus:border-[#4b8eff]/60 transition-colors"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || typing}
                    className="w-9 h-9 bg-[#4b8eff] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#6ba3ff] transition-all flex-shrink-0"
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
                <div className="text-center text-[#414755] text-[9px] font-mono mt-2">
                  Powered by AzeemBot AI · Estimates are approximate
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all"
        style={{
          background: open
            ? 'linear-gradient(135deg, #1a1a28 0%, #252535 100%)'
            : 'linear-gradient(135deg, #4b8eff 0%, #00c4cc 100%)',
          border: open ? '1px solid rgba(65,71,85,0.6)' : 'none',
          boxShadow: open ? 'none' : '0 8px 32px rgba(75,142,255,0.4), 0 2px 8px rgba(0,196,204,0.2)',
        }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        id="chatbot-toggle"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} className="text-[#c1c6d7]" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Unread badge */}
        {unread > 0 && !open && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4757] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            {unread}
          </div>
        )}
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: 'linear-gradient(135deg, #4b8eff, #00c4cc)' }} />
        )}
      </motion.button>
    </>
  );
}
