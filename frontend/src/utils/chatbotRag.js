import {
  AZEEM_INFO,
  SERVICES,
  PROJECTS,
  FAQ,
  PORTFOLIO_KEYWORDS,
  OFF_TOPIC_PHRASES,
  OFF_TOPIC_KEYWORDS,
} from '../data/knowledgeBase';
import { PRICING, ADDONS } from '../data/pricing';

// ─── Text utilities ──────────────────────────────────────────────────────────

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s$?'-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreKeywords(text, keywords, weight = 1) {
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) {
      score += kw.includes(' ') ? weight * 2 : weight;
    }
  }
  return score;
}

function scorePhrases(text, phrases, weight = 3) {
  let score = 0;
  for (const phrase of phrases) {
    if (text.includes(phrase)) score += weight;
  }
  return score;
}

function portfolioRelevance(text) {
  return scoreKeywords(text, PORTFOLIO_KEYWORDS);
}

function offTopicScore(text) {
  let score = scorePhrases(text, OFF_TOPIC_PHRASES, 4);
  score += scoreKeywords(text, OFF_TOPIC_KEYWORDS, 2);
  return score;
}

// ─── Intent definitions (scored, not first-match) ────────────────────────────

const INTENTS = [
  {
    id: 'bot_help',
    phrases: ['who are you', 'what are you', 'what can you do', 'what do you do bot', 'help me', 'your capabilities', 'how can you help'],
    keywords: ['help', 'capabilities', 'azeembot', 'assistant bot'],
    minScore: 2,
  },
  {
    id: 'greeting',
    phrases: ['good morning', 'good evening', 'good afternoon', 'hi there', 'hey there'],
    keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings'],
    minScore: 1,
    exact: ['hi', 'hey', 'hello'],
  },
  {
    id: 'thanks',
    phrases: ['thank you', 'thanks a lot', 'much appreciated'],
    keywords: ['thanks', 'thank', 'appreciate', 'awesome', 'perfect', 'great job'],
    minScore: 1,
  },
  {
    id: 'estimate',
    phrases: ['get an estimate', 'project estimate', 'generate estimate', 'want an estimate', 'need a quote', 'how much would it cost', 'how much for my'],
    keywords: ['estimate', 'quote', 'proposal', 'budget'],
    minScore: 2,
  },
  {
    id: 'pricing',
    phrases: ['what are your prices', 'how much do you charge', 'price list', 'cost of editing', 'your rates', 'how much for a youtube', 'how much for a reel'],
    keywords: ['pricing', 'price', 'cost', 'charge', 'fee', 'rate', 'how much', 'dollar', '$'],
    minScore: 2,
  },
  {
    id: 'portfolio',
    phrases: ['show me your work', 'see your work', 'past projects', 'previous work', 'your portfolio', 'sample work', 'examples of your'],
    keywords: ['portfolio', 'sample', 'example', 'showreel'],
    minScore: 2,
  },
  {
    id: 'contact',
    phrases: ['how do i contact', 'how to contact', 'how to hire', 'reach azeem', 'get in touch', 'book azeem'],
    keywords: ['contact', 'whatsapp', 'upwork', 'email', 'phone', 'hire', 'message'],
    minScore: 2,
  },
  {
    id: 'about',
    phrases: ['who is azeem', 'about azeem', 'tell me about azeem', 'who are you azeem', 'azeem naveed', 'your experience', 'your background'],
    keywords: ['azeem', 'naveed', 'experience', 'background', 'years'],
    minScore: 2,
  },
  {
    id: 'services',
    phrases: ['what services', 'what do you offer', 'types of video', 'what can you edit', 'editing services', 'do you edit'],
    keywords: ['services', 'offerings', 'service list'],
    minScore: 2,
  },
  {
    id: 'addons',
    phrases: ['add on', 'extra services', 'rush delivery'],
    keywords: ['addon', 'add-on', 'extras', 'rush'],
    minScore: 2,
  },
];

function scoreIntent(text, intent) {
  let score = scorePhrases(text, intent.phrases || [], 4);
  score += scoreKeywords(text, intent.keywords || [], 1.5);

  if (intent.exact?.includes(text)) score += 3;

  // Boost when portfolio context exists
  if (portfolioRelevance(text) > 0) score += 0.5;

  return score;
}

function matchIntentByScore(text) {
  let best = { id: 'unknown', score: 0 };

  for (const intent of INTENTS) {
    const score = scoreIntent(text, intent);
    const min = intent.minScore ?? 2;
    if (score >= min && score > best.score) {
      best = { id: intent.id, score };
    }
  }

  return best;
}

function matchFAQ(text) {
  let best = null;
  let bestScore = 0;

  for (const faq of FAQ) {
    let score = scorePhrases(text, faq.phrases || [], 5);
    score += scoreKeywords(text, faq.keywords || [], 2);
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return bestScore >= 2 ? { faq: best, score: bestScore } : null;
}

function isOffTopic(text, portfolioScore, intentScore, faqMatch) {
  const offScore = offTopicScore(text);

  // Clear off-topic with no portfolio connection
  if (offScore >= 4 && portfolioScore === 0) return true;
  if (offScore >= 2 && portfolioScore === 0 && intentScore < 3 && !faqMatch) return true;

  // Long general questions with zero portfolio signals
  const words = text.split(' ').filter(Boolean);
  if (words.length >= 4 && portfolioScore === 0 && intentScore === 0 && !faqMatch && offScore >= 1) {
    return true;
  }

  // Questions starting with general knowledge patterns
  if (/^(what is|who is|how do i make|can you explain|tell me about) (?!.*(video|edit|youtube|reel|azeem|footage|project|price|service))/i.test(text)) {
    if (portfolioScore === 0 && offScore >= 1) return true;
  }

  return false;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function matchIntent(input) {
  const text = normalize(input);
  if (!text) return 'greeting';

  const pScore = portfolioRelevance(text);
  const faqMatch = matchFAQ(text);
  const faqScore = faqMatch?.score ?? 0;
  const { id, score: intentScore } = matchIntentByScore(text);
  const bestScore = Math.max(intentScore, faqScore);

  if (isOffTopic(text, pScore, bestScore, faqMatch?.faq)) return 'off_topic';

  if (faqMatch && faqScore >= intentScore && faqScore >= 2) return `faq:${faqMatch.faq.id}`;
  if (id !== 'unknown') return id;
  if (faqMatch) return `faq:${faqMatch.faq.id}`;

  return pScore > 0 ? 'fallback_portfolio' : 'off_topic';
}

export function generateResponse(intent, input) {
  if (intent.startsWith('faq:')) {
    const faqId = intent.slice(4);
    const faq = FAQ.find((f) => f.id === faqId);
    if (faq) return { text: faq.a, showQuickReplies: true };
  }

  switch (intent) {
    case 'off_topic':
      return {
        text: `I'm **AzeemBot** — the assistant for **Azeem Naveed's video editing portfolio**. I'm not able to help with general questions outside of that.\n\nBut I **can** help you with:\n\n• **Pricing & estimates** for video editing\n• **Services** (YouTube, Reels, promos, events, corporate)\n• **Portfolio** & sample work\n• **Turnaround**, revisions & delivery formats\n• **How to hire** or contact Azeem\n\nTry asking something like *"How much for a YouTube edit?"* or use a quick reply below 👇`,
        showQuickReplies: true,
      };

    case 'bot_help':
      return {
        text: `I'm **AzeemBot** — an AI assistant built into this portfolio site. I answer questions about **Azeem Naveed's video editing services** only.\n\n**I can help with:**\n• Service list & what's included\n• **Pricing** ranges and **project estimates**\n• **Portfolio** highlights\n• Turnaround, revisions, file delivery\n• **Contact** & hiring info\n\n**I can't help with:** general knowledge, coding, medical/legal advice, or topics unrelated to hiring Azeem as a video editor.\n\nWhat would you like to know about his work?`,
        showQuickReplies: true,
      };

    case 'greeting':
      return {
        text: `Hi there! 👋 I'm **AzeemBot**, your guide to Azeem Naveed's video editing services.\n\nAsk me about **pricing**, **services**, **past work**, or get a **project estimate**. How can I help?`,
        showQuickReplies: true,
      };

    case 'about':
      return {
        text: `**About Azeem Naveed** 🎬\n\n${AZEEM_INFO.bio}\n\n**Experience:** ${AZEEM_INFO.experience}\n**Tools:** ${AZEEM_INFO.tools.join(', ')}\n**Strengths:** ${AZEEM_INFO.strengths.join(', ')}\n\n📍 ${AZEEM_INFO.location} — ${AZEEM_INFO.availability}\n⏱️ ${AZEEM_INFO.responseTime}`,
        showQuickReplies: true,
      };

    case 'services': {
      const list = SERVICES.map((s) => `• **${s.name}** — ${s.description}\n  _Turnaround: ${s.turnaround}_`).join('\n\n');
      return {
        text: `**Video Editing Services** 🎬\n\n${list}\n\nWant **pricing** for a specific service or a custom **estimate**?`,
        showQuickReplies: true,
        showEstimateButton: true,
      };
    }

    case 'portfolio': {
      const list = PROJECTS.map((p) => `• **${p.title}**\n  _${p.type}, ${p.year}_ — ${p.description}`).join('\n\n');
      return {
        text: `**Portfolio Highlights** 🎞️\n\n${list}\n\nScroll to the **Work** section to watch each project, or ask about **pricing** for a similar edit.`,
        showQuickReplies: true,
      };
    }

    case 'pricing': {
      const list = PRICING.map((p) => {
        const [starter, standard, premium] = p.tiers;
        return `**${p.icon} ${p.service}**\n  Starter: ${starter.price} | Standard: ${standard.price} | Premium: ${premium.price}`;
      }).join('\n\n');
      const addons = ADDONS.map((a) => `• ${a.name}: ${a.price}`).join('\n');
      return {
        text: `**Service Pricing (USD)** 💰\n\n${list}\n\n**Add-ons:**\n${addons}\n\n> ⚠️ _Sample ranges — final price depends on footage length, complexity, and deadline. Use the **Estimate Generator** for a tailored range._`,
        showEstimateButton: true,
        showQuickReplies: true,
      };
    }

    case 'addons':
      return {
        text: `**Available Add-ons** ➕\n\n${ADDONS.map((a) => `• **${a.name}** — ${a.price}`).join('\n')}\n\nAdd these during the estimate generator or mention them in your project brief.`,
        showEstimateButton: true,
      };

    case 'contact':
      return {
        text: `**Contact Azeem** 📞\n\n📧 **Email:** [azeemnaveed100@gmail.com](mailto:azeemnaveed100@gmail.com)\n💬 **WhatsApp:** [+94 78 205 2653](https://wa.me/94782052653)\n💼 **Upwork:** [Hire on Upwork](https://www.upwork.com/freelancers/azeemn2)\n\n📝 Or use the **Contact form** at the bottom of this page.\n\n⏱️ ${AZEEM_INFO.responseTime}`,
        showWhatsApp: true,
        showQuickReplies: true,
      };

    case 'thanks':
      return {
        text: `You're welcome! 😊 Anything else about Azeem's **services**, **pricing**, or **portfolio** I can help with?`,
        showQuickReplies: true,
      };

    case 'estimate':
      return {
        text: `**Project Estimate** 📋\n\nI can generate a detailed price range for your project. Click **Get Estimate** below to open the generator — fill in your project type, tier, and add-ons for an instant range.\n\n> ⚠️ _Estimates are for planning only. Contact Azeem for a confirmed quote._`,
        showEstimateButton: true,
      };

    case 'fallback_portfolio':
      return {
        text: `I'm not fully sure about that specific detail, but I can definitely help with Azeem's **video editing services**.\n\nTry asking about:\n• **Pricing** or get an **estimate**\n• **Services** offered\n• **Portfolio** work\n• **Turnaround** & revisions\n• **How to contact** Azeem\n\nOr pick a quick reply below 👇`,
        showQuickReplies: true,
      };

    default:
      return {
        text: `I'm **AzeemBot** — I help with questions about Azeem Naveed's **video editing portfolio**.\n\nI can assist with **pricing**, **services**, **past work**, **estimates**, and **contact info**. What would you like to know?`,
        showQuickReplies: true,
      };
  }
}
