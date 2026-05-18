import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set' })
  }

  const { topic } = req.body || {}
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Missing "topic" in body' })
  }

  const client = new Anthropic({ apiKey })

  const prompt = `Generate exactly 5 multiple choice quiz questions to test a beginner's understanding of "${topic}".

Return ONLY valid JSON, no markdown, no preamble, no commentary.
The JSON must be an array of 5 objects, each with this exact shape:
{
  "question": "string",
  "options": ["string for A", "string for B", "string for C", "string for D"],
  "correct_answer": "A" | "B" | "C" | "D"
}

Rules:
- Exactly 4 options per question.
- "correct_answer" must be the single letter "A", "B", "C", or "D".
- Questions should be clear, factual, and beginner-friendly.
- Do not number the questions.
- Output nothing except the JSON array.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
    const start = cleaned.indexOf('[')
    const end = cleaned.lastIndexOf(']')
    const jsonStr = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned

    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      return res.status(502).json({ error: 'Model did not return valid JSON', raw: text })
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return res.status(502).json({ error: 'Unexpected response shape', raw: text })
    }

    const valid = parsed.every(
      (q) =>
        q &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        ['A', 'B', 'C', 'D'].includes(q.correct_answer),
    )
    if (!valid) {
      return res.status(502).json({ error: 'Quiz items failed validation', raw: text })
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('quiz generation error', err)
    return res.status(500).json({ error: err.message || 'Quiz generation failed' })
  }
}
