const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GeminiRequest {
  contents: { parts: { text: string }[] }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export async function askGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const body: GeminiRequest = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  };

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insight available.';
}

export function buildInsightPrompt(data: {
  habits: { name: string; streak: number; done: boolean }[];
  tasks: { name: string; hour: number; priority: string; done: boolean }[];
  lifeScores: Record<string, number>;
  focusMinutes: number;
  focusSessions: number;
  currentEnergy: number;
  greeting: string;
}): string {
  const habitSummary = data.habits.map(h =>
    `${h.name}: ${h.done ? 'done today' : 'not done'}, ${h.streak}-day streak`
  ).join('; ');

  const taskSummary = data.tasks.map(t =>
    `${t.name} (${t.priority}, ${t.hour}:00, ${t.done ? 'completed' : 'pending'})`
  ).join('; ');

  const scoreSummary = Object.entries(data.lifeScores)
    .map(([k, v]) => `${k}: ${v}/10`)
    .join(', ');

  return `You are LifeOS AI Coach — a warm, insightful personal optimization assistant. Analyze this user's data and give 2-3 SHORT, actionable insights. Be specific, reference their actual data. Use a friendly but direct tone. No generic advice.

USER DATA:
- Time of day: ${data.greeting}
- Current energy level: ${data.currentEnergy}%
- Today's habits: ${habitSummary || 'No habits tracked yet'}
- Today's tasks: ${taskSummary || 'No tasks scheduled yet'}
- Life balance scores: ${scoreSummary}
- Focus today: ${data.focusMinutes} minutes across ${data.focusSessions} sessions

RULES:
- Keep each insight to 1-2 sentences max
- Reference specific numbers from their data
- If they have low scores, suggest ONE specific action
- If streaks are strong, acknowledge it
- If no data yet, welcome them and suggest getting started
- Use emoji sparingly (1 per insight max)
- Format as bullet points starting with a bold label`;
}

export const isGeminiConfigured = !!GEMINI_API_KEY;
