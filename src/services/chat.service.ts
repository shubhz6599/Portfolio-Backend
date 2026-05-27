import OpenAI from 'openai';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENROUTER_API_KEY,
});

// ── 1. Fetch all portfolio data from your existing MongoDB connection ──────────
async function fetchPortfolioContext() {
  const db = mongoose.connection.db!;

  const [experiences, profiles, projects, skillgroups] = await Promise.all([
    db.collection('experiences').find({}).toArray(),
    db.collection('profiles').find({}).toArray(),
    db.collection('projects').find({}).toArray(),
    db.collection('skillgroups').find({}).toArray(),
  ]);

  return `
=== PROFILE ===
${JSON.stringify(profiles, null, 2)}

=== EXPERIENCES ===
${JSON.stringify(experiences, null, 2)}

=== PROJECTS ===
${JSON.stringify(projects, null, 2)}

=== SKILL GROUPS ===
${JSON.stringify(skillgroups, null, 2)}
`.trim();
}

// ── 2. Classify if question is portfolio-related (keyword + LLM fallback) ─────
const PORTFOLIO_KEYWORDS = [
  'experience', 'work history', 'job', 'career', 'company', 'role',
  'project', 'built', 'developed', 'created', 'portfolio',
  'skill', 'technology', 'tech stack', 'programming',
  'profile', 'about shubham', 'shubham', 'education', 'background',
  'worked on', 'know about',
];

const GREETING_PATTERNS = [
  'hi',
  'hello',
  'hey',
  'hii',
  'hola',
  'good morning',
  'good afternoon',
  'good evening',
  'yo',
  'buddy'
];

const IDENTITY_PATTERNS = [
  'who are you',
  'what are you',
  'tell me about yourself',
  'your identity',
  'who created you',
  'are you chatgpt',
  'are you ai'
];
const SMALL_TALK_PATTERNS = [
  'how are you',
  'how are u',
  'How r u',
  'how you doing',
  'how u doing',
  'how’s it going',
  'whats up',
  'what’s up',
  'sup',
  'are you okay',
  'r u okay'

];

function isSmallTalk(question: string): boolean {
  const lower = question.toLowerCase().trim();

  return SMALL_TALK_PATTERNS.some(p =>
    lower.includes(p)
  );
}
function isGreeting(question: string): boolean {
  const lower = question.toLowerCase().trim();

  return GREETING_PATTERNS.some(g =>
    lower === g ||
    lower.startsWith(g + ' ') ||
    lower.includes(g)
  );
}
function isIdentityQuestion(question: string): boolean {
  const lower = question.toLowerCase();

  return IDENTITY_PATTERNS.some(i =>
    lower.includes(i)
  );
}

async function isPortfolioRelated(question: string): Promise<boolean> {
  const lower = question.toLowerCase();

  // Fast path — keyword match, no LLM call needed
  if (PORTFOLIO_KEYWORDS.some((kw) => lower.includes(kw))) {
    return true;
  }

  // Slow path — LLM classification for ambiguous questions
  try {
    const res = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b:free',
      max_tokens: 5,
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier. Reply ONLY "yes" or "no".
Is this question about a person's portfolio (work experience, projects, skills, bio)?`,
        },
        { role: 'user', content: question },
      ],
    });
    return res.choices[0]?.message?.content?.trim().toLowerCase() === 'yes';
  } catch {
    return false; // safe fallback
  }
}

// ── 3. Answer using portfolio data as context (RAG pattern) ───────────────────
async function answerFromPortfolio(question: string): Promise<string> {
  const context = await fetchPortfolioContext();

  const res = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b:free',
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant for Shubham's personal portfolio.
Answer using ONLY the data below. If the answer isn't there, say "I don't have that information in Shubham's portfolio."

--- PORTFOLIO DATA ---
${context}
--- END OF DATA ---`,
      },
      { role: 'user', content: question },
    ],
  });

  return res.choices[0]?.message?.content ?? 'No response generated.';
}

// ── 4. Answer using general knowledge (global search) ────────────────────────
async function answerGlobally(question: string): Promise<string> {
  const res = await client.chat.completions.create({
    model: 'openai/gpt-oss-20b:free',
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: `
You are Shubham Karkhile's portfolio assistant.

Never say:
- "I am ChatGPT"
- "I am OpenAI"
- "large language model"

If asked who you are, say:
"I'm Shubham Karkhile's AI assistant. I help visitors learn about his work, projects, and can also help with general questions."

Answer naturally and concisely.
`
      },
      { role: 'user', content: question },
    ],
  });

  return res.choices[0]?.message?.content ?? 'No response generated.';
}

// ── 5. Main exported function ─────────────────────────────────────────────────
export type AiResponse =
  | { type: 'portfolio_answer'; answer: string }
  | { type: 'confirm_global'; message: string }
  | { type: 'global_answer'; answer: string };

export async function getAiChatResponse(
  question: string,
): Promise<AiResponse> {

  try {

    // Portfolio intent
    if (await isPortfolioRelated(question)) {
      const answer = await answerFromPortfolio(question);

      return {
        type: 'portfolio_answer',
        answer
      };
    }

    // Identity intent
    if (isIdentityQuestion(question)) {
      return {
        type: 'global_answer',
        answer:
          "I'm Shubham Karkhile's AI assistant. I help visitors explore his portfolio, projects, experience, and can also help with general questions."
      };
    }

    // Small talk intent
    if (isSmallTalk(question)) {
      return {
        type: 'global_answer',
        answer:
          "I'm doing well, thanks for asking! 😊 I'm Shubham's AI assistant. How can I help you today?"
      };
    }

    // Greeting intent
    if (isGreeting(question)) {
      return {
        type: 'global_answer',
        answer:
          "Hey! 👋 I'm Shubham's AI assistant. How can I help you today?"
      };
    }

    // General questions
    const globalAnswer = await answerGlobally(question);

    return {
      type: 'global_answer',
      answer:
`While I'm built to tell you all about Shubham Karkhile and his work, I'm also happy to help with general questions.

${globalAnswer}`
    };

  } catch (err:any) {
    console.error('OPENROUTER ERROR:', err);
    throw err;
  }
}