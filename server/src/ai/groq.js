import { config } from '../config.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export function hasGroq() {
  return Boolean(config.ai.groqApiKey)
}

// Low-level chat completion against Groq's free OpenAI-compatible API.
// `json` = true asks the model to return a single JSON object.
export async function groqChat(messages, { json = false, temperature = 0.3, maxTokens = 900 } = {}) {
  if (!hasGroq()) throw new Error('GROQ_API_KEY not configured')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.ai.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.ai.groqModel,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Groq API error ${res.status}: ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function groqJson(messages, opts = {}) {
  const content = await groqChat(messages, { ...opts, json: true })
  try {
    return JSON.parse(content)
  } catch {
    // Best-effort: pull the first {...} block out of the response.
    const match = content.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Model did not return valid JSON')
  }
}
