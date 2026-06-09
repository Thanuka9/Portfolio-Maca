// ============================================================
// AZEEM NAVEED PORTFOLIO — CHATBOT KNOWLEDGE BASE
// All content for RAG-style intent matching
// ============================================================

import { projects } from './projects';

export const AZEEM_INFO = {
  name: "Azeem Naveed",
  title: "Professional Video Editor",
  location: "Kandy, Sri Lanka",
  experience: "6+ years",
  email: "azeemnaveed100@gmail.com",
  phone: "+94 78 205 2653",
  whatsapp: "https://wa.me/94782052653",
  upwork: "https://www.upwork.com/freelancers/azeemn2",
  bio: `Azeem Naveed is a professional video editor with 6+ years of experience crafting compelling visual stories for YouTube channels, brands, events, and social media platforms. Based in Kandy, Sri Lanka, he works remotely with local and international clients.`,
  tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "Adobe Audition", "Photoshop"],
  strengths: ["Color Grading", "Sound Design", "Motion Graphics", "Storytelling", "Pacing & Rhythm", "Audience Retention"],
  availability: "Available for new projects. Remote-friendly workflow for clients worldwide.",
  responseTime: "Usually responds within 24 hours.",
  workflow: [
    "Brief & requirements — you share vision, references, and footage details",
    "Quote or estimate — clear pricing based on scope and complexity",
    "First cut — initial edit delivered for your review",
    "Revisions — feedback rounds included in your package",
    "Final delivery — exported in your required format(s)",
  ],
};

/** Live portfolio projects — synced from projects.js */
export const PROJECTS = projects.map((p) => ({
  title: p.title,
  type: p.category,
  description: p.description,
  year: p.year,
}));

export const SERVICES = [
  {
    id: "youtube",
    name: "YouTube Video Editing",
    description: "Long-form YouTube content with storytelling, color grading, sound design, and retention-focused pacing.",
    includes: ["Cut & pacing", "Color correction & grading", "Sound design & music sync", "Text overlays & titles", "Thumbnail consultation", "Up to 3 revisions"],
    turnaround: "3–5 business days",
  },
  {
    id: "reels",
    name: "Reels & Short-form Videos",
    description: "Vertical edits for Instagram Reels, TikTok, and YouTube Shorts with trending audio and dynamic transitions.",
    includes: ["Vertical crop & resize", "Trending audio sync", "Caption overlays", "Dynamic transitions", "Up to 2 revisions"],
    turnaround: "1–2 business days",
  },
  {
    id: "promotional",
    name: "Promotional Videos",
    description: "Brand and product promos for marketing campaigns with motion graphics and branded text.",
    includes: ["Script-to-screen edit", "Motion graphics", "Brand color integration", "Custom music", "Up to 3 revisions"],
    turnaround: "3–5 business days",
  },
  {
    id: "event",
    name: "Event & Wedding Videos",
    description: "Cinematic highlight reels for weddings and events with warm color grading and emotional storytelling.",
    includes: ["Multi-camera edit", "Color grading", "Music sync", "Highlight reel format", "Up to 2 revisions"],
    turnaround: "5–7 business days",
  },
  {
    id: "corporate",
    name: "Corporate Videos",
    description: "Professional edits for presentations, training, interviews, and explainer videos.",
    includes: ["Interview editing", "Lower thirds & titles", "B-roll integration", "Branded templates", "Up to 3 revisions"],
    turnaround: "4–6 business days",
  },
  {
    id: "cinematic",
    name: "Cinematic Montage",
    description: "Creative montages with professional color grading, music-synced cuts, and cinematic flow.",
    includes: ["Creative cut & pacing", "Cinematic color grade", "Music-driven editing", "Sound design", "Up to 2 revisions"],
    turnaround: "3–5 business days",
  },
];

export const FAQ = [
  {
    id: "turnaround",
    q: "How long does it take?",
    a: "**Turnaround times** depend on project type:\n\n• Reels & Shorts: **1–2 business days**\n• YouTube & Promotional: **3–5 business days**\n• Corporate: **4–6 business days**\n• Events & Weddings: **5–7 business days**\n\n🚀 **Rush delivery (48h)** is available for an additional fee. Share your deadline upfront and Azeem will confirm what's possible.",
    keywords: ["long", "take", "turnaround", "time", "days", "fast", "quick", "rush", "deadline", "when", "duration", "how soon", "delivery time"],
    phrases: ["how long does it take", "how fast can you", "turnaround time"],
  },
  {
    id: "revisions",
    q: "How many revisions do I get?",
    a: "Most packages include **2–3 free revisions**:\n\n• Reels & Short Videos: **2 revisions**\n• YouTube, Promotional & Corporate: **3 revisions**\n• Events & Weddings: **2–3 revisions**\n\nAdditional revisions are available at **+$15–$25 each**. Clear briefs and reference links help nail the edit within the included rounds.",
    keywords: ["revision", "revisions", "change", "redo", "modify", "fix", "update", "feedback"],
    phrases: ["how many revisions", "revision policy"],
  },
  {
    id: "formats",
    q: "What video formats do you deliver?",
    a: "Default delivery is **MP4 (H.264/H.265)** — optimized for YouTube, Instagram, and web.\n\nOn request Azeem can also deliver:\n• **ProRes / MOV** (for further editing)\n• **4K** exports\n• **Platform-specific** sizes (Reels 9:16, Shorts, TikTok)\n\nMention your platform and resolution needs when you order.",
    keywords: ["format", "mp4", "file", "export", "deliver", "output", "resolution", "quality", "4k", "1080", "prores", "mov"],
    phrases: ["what format", "delivery format", "file format"],
  },
  {
    id: "international",
    q: "Do you work with international clients?",
    a: "Yes — Azeem works with clients **worldwide**. The workflow is fully remote.\n\n**Payment methods:** PayPal, Wise (TransferWise), and Upwork (recommended for first-time clients).\n\n**Communication:** Email, WhatsApp, or Upwork messages. Time zone: **Sri Lanka (UTC+5:30)** — flexible for global schedules.",
    keywords: ["international", "overseas", "remote", "online", "worldwide", "country", "outside", "abroad", "foreign", "timezone", "time zone"],
    phrases: ["work internationally", "international clients", "outside sri lanka"],
  },
  {
    id: "footage",
    q: "How do I send footage to you?",
    a: "Share raw footage via:\n\n• **Google Drive** (best for large files)\n• **Dropbox**\n• **WeTransfer** or **OneDrive**\n\nAzeem can provide a shared upload folder. For projects over **15 GB**, he'll coordinate the best transfer method with you.",
    keywords: ["send", "footage", "files", "upload", "share", "drive", "dropbox", "transfer", "raw", "wetransfer", "onedrive"],
    phrases: ["how do i send", "send footage", "upload footage", "share files"],
  },
  {
    id: "sample",
    q: "Do you offer a sample edit?",
    a: "For the right projects, Azeem can offer a **short sample edit (30–60 seconds)** from your footage so you can evaluate his style before committing to the full project.\n\nContact him via the form, email, or WhatsApp to discuss whether a sample makes sense for your project.",
    keywords: ["trial", "sample", "test", "try", "demo", "free", "example", "preview edit"],
    phrases: ["sample edit", "free trial", "try before"],
  },
  {
    id: "software",
    q: "What software do you use?",
    a: "Azeem's primary toolkit:\n\n• **Adobe Premiere Pro** — main editing\n• **DaVinci Resolve** — color grading\n• **After Effects** — motion graphics\n• **Adobe Audition** — audio cleanup & sound design\n• **Photoshop & Canva** — thumbnails and graphics",
    keywords: ["software", "tool", "program", "premiere", "davinci", "resolve", "after effects", "audition", "photoshop", "capcut", "apps"],
    phrases: ["what software", "which software", "editing software"],
  },
  {
    id: "contact",
    q: "How do I contact Azeem?",
    a: "**Contact options:**\n\n📧 **Email:** azeemnaveed100@gmail.com\n💬 **WhatsApp:** +94 78 205 2653\n💼 **Upwork:** upwork.com/freelancers/azeemn2\n📝 **Contact form** — bottom of this page\n\nHe usually responds within **24 hours**.",
    keywords: ["contact", "reach", "email", "phone", "whatsapp", "hire", "upwork", "message", "talk", "speak", "book", "get in touch"],
    phrases: ["how do i contact", "how to contact", "how to hire", "reach azeem"],
  },
  {
    id: "payment",
    q: "How does payment work?",
    a: "**Payment options:** PayPal, Wise, or Upwork escrow.\n\nFor direct clients, a **50% deposit** is typically requested to start, with the balance due on final delivery. Upwork handles milestones automatically if you hire through the platform.\n\nExact terms are confirmed in your project quote.",
    keywords: ["payment", "pay", "deposit", "paypal", "wise", "invoice", "milestones", "money", "transfer"],
    phrases: ["how do i pay", "payment method", "payment terms"],
  },
  {
    id: "process",
    q: "What is the editing process?",
    a: "**Typical workflow:**\n\n1️⃣ **Brief** — you share goals, references, and footage\n2️⃣ **Quote** — scope and pricing confirmed\n3️⃣ **First cut** — initial edit for review\n4️⃣ **Revisions** — feedback applied (2–3 rounds included)\n5️⃣ **Final delivery** — exported files ready to publish\n\nYou'll get updates throughout — communication is a priority.",
    keywords: ["process", "workflow", "steps", "how it works", "procedure", "start", "begin", "order"],
    phrases: ["how does it work", "editing process", "what is the process", "how to start"],
  },
  {
    id: "music",
    q: "Do you provide music and sound?",
    a: "Yes — Azeem handles **music selection, sync, and sound design** as part of most packages. He uses royalty-free libraries suitable for YouTube and social platforms.\n\nIf you have licensed music or a specific track, share it in the brief. For commercial campaigns, confirm licensing requirements upfront.",
    keywords: ["music", "sound", "audio", "sfx", "sound effects", "voiceover", "song", "background music"],
    phrases: ["provide music", "sound design", "add music"],
  },
  {
    id: "subtitles",
    q: "Can you add subtitles or captions?",
    a: "Yes — **subtitles and captions** can be added as an add-on (**+$20–$40** depending on length) or included in Premium tiers.\n\nFormats: burned-in captions for Reels/Shorts, or SRT files for YouTube. Specify language and style in your brief.",
    keywords: ["subtitle", "subtitles", "caption", "captions", "srt", "closed caption"],
    phrases: ["add subtitles", "add captions"],
  },
  {
    id: "thumbnail",
    q: "Do you design thumbnails?",
    a: "Yes — **custom thumbnail design** is available as an add-on (**+$20**) or included in Premium YouTube packages.\n\nThumbnails are designed for click-through rate with bold typography, contrast, and platform-safe composition.",
    keywords: ["thumbnail", "thumbnails", "cover image", "youtube thumbnail"],
    phrases: ["design thumbnail", "make thumbnail"],
  },
  {
    id: "nda",
    q: "Will my footage stay confidential?",
    a: "Absolutely. Client footage and project details are kept **confidential**. Azeem does not share unreleased work without permission.\n\nFor sensitive corporate content, an **NDA** can be signed on request before files are exchanged.",
    keywords: ["confidential", "nda", "privacy", "private", "secure", "secret"],
    phrases: ["non disclosure", "keep confidential", "sign nda"],
  },
  {
    id: "why",
    q: "Why hire Azeem?",
    a: "**Why clients choose Azeem:**\n\n✅ **6+ years** of professional editing experience\n✅ **80+ projects** delivered for **60+ clients**\n✅ Strong **storytelling & pacing** — not just cutting clips\n✅ **Fast communication** and reliable delivery\n✅ Experience with **YouTube, documentary, sports, horror, and quiz** formats\n✅ **Remote-friendly** — works with creators and brands globally\n✅ **4.9★ rating** and verified Upwork profile",
    keywords: ["why", "choose", "best", "different", "better", "recommend", "trust", "reliable", "quality"],
    phrases: ["why hire", "why choose", "why azeem", "what makes you"],
  },
];

export const QUICK_REPLIES = [
  { label: "💰 Pricing", value: "What are your prices?" },
  { label: "🎬 Services", value: "What services do you offer?" },
  { label: "📋 Get Estimate", value: "I want to get an estimate" },
  { label: "⏱️ Turnaround", value: "How long does it take?" },
  { label: "📁 Portfolio", value: "Show me your work" },
  { label: "📞 Contact", value: "How do I contact Azeem?" },
];

/** Keywords that indicate the question is about this portfolio / video editing */
export const PORTFOLIO_KEYWORDS = [
  "azeem", "naveed", "video", "edit", "editor", "editing", "footage", "youtube",
  "reel", "reels", "short", "shorts", "tiktok", "instagram", "promo", "promotional",
  "wedding", "event", "corporate", "montage", "cinematic", "portfolio", "project",
  "price", "pricing", "cost", "quote", "estimate", "budget", "rate", "fee", "hire",
  "service", "upwork", "thumbnail", "color grade", "grading", "subtitle", "caption",
  "revision", "deliver", "export", "mp4", "premiere", "davinci", "after effects",
  "showreel", "client", "freelance", "kandy", "sri lanka", "contact", "whatsapp",
  "payment", "deposit", "paypal", "footage", "raw", "clip", "documentary",
];

/** Strong signals the question is unrelated to this portfolio */
export const OFF_TOPIC_PHRASES = [
  "write me a", "write a poem", "tell me a joke", "solve this", "homework",
  "what is the capital", "who is the president", "weather in", "weather today",
  "stock price", "bitcoin", "crypto price", "recipe for", "how to cook",
  "medical advice", "diagnose", "python code", "javascript code", "fix my code",
  "debug my", "react component", "sql query", "machine learning model",
  "translate this to", "meaning of life", "play a game", "chess move",
  "football score", "cricket score", "movie recommendation", "best restaurant",
  "dating advice", "relationship advice", "legal advice", "tax advice",
  "who won the", "when was world war", "explain quantum", "chatgpt",
  "ignore previous", "pretend you are", "jailbreak", "roleplay as",
];

export const OFF_TOPIC_KEYWORDS = [
  "weather", "recipe", "cooking", "python", "javascript", "typescript", "java",
  "programming", "coding", "developer", "software engineer", "homework", "math",
  "algebra", "calculus", "physics", "chemistry", "biology", "medical", "doctor",
  "symptoms", "diagnosis", "lawyer", "legal", "investment", "crypto", "bitcoin",
  "stock", "forex", "politics", "election", "president", "prime minister",
  "restaurant", "hotel booking", "flight", "travel visa", "dating", "girlfriend",
  "boyfriend", "fortnite", "minecraft", "roblox", "game cheat",
];
