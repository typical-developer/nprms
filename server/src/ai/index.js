// AI orchestration: prefer the free Groq model when a key is present, and
// transparently fall back to the offline rule-based engine otherwise (or if
// the API call fails). Every function returns a `source` field so the UI can
// show whether the model or the fallback produced the result.
import { hasGroq, groqChat, groqJson } from './groq.js'
import { ruleCategorize, ruleAnalyzeCase, ruleChat, ruleInsights, ruleReport } from './fallback.js'

const VALID_CATEGORIES = ['Theft', 'Assault', 'Fraud', 'Armed Robbery', 'Missing Person', 'Homicide', 'Cybercrime']
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const SYSTEM = 'You are an assistant embedded in NPRMS, the Nigeria Police Records Management System. ' +
  'You help officers triage and investigate criminal cases. Be precise, factual and concise. ' +
  'Never invent case facts that were not provided.'

export function aiStatus() {
  return { provider: hasGroq() ? 'groq' : 'rule-based', modelConfigured: hasGroq() }
}

export async function aiCategorize({ title = '', description = '' }) {
  if (hasGroq()) {
    try {
      const result = await groqJson([
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            `Classify this incident report. Respond with JSON only: ` +
            `{"category": one of ${JSON.stringify(VALID_CATEGORIES)}, ` +
            `"priority": one of ${JSON.stringify(VALID_PRIORITIES)}, ` +
            `"suggestedTitle": a short case title (max 12 words), ` +
            `"rationale": one sentence}.\n\n` +
            `Title: ${title}\nDescription: ${description}`,
        },
      ], { temperature: 0.1 })

      const category = VALID_CATEGORIES.includes(result.category) ? result.category : ruleCategorize(title, description).category
      const priority = VALID_PRIORITIES.includes(result.priority) ? result.priority : 'Medium'
      return {
        category,
        priority,
        suggestedTitle: (result.suggestedTitle || title || `${category} case`).slice(0, 120),
        rationale: result.rationale || '',
        confidence: 'model',
        source: 'groq',
      }
    } catch (e) {
      return { ...ruleCategorize(title, description), warning: `Model unavailable (${e.message}); used fallback.` }
    }
  }
  return ruleCategorize(title, description)
}

export async function aiAnalyzeCase(caseData, related = {}) {
  if (hasGroq()) {
    try {
      const result = await groqJson([
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            `Analyse this case file and respond with JSON only: ` +
            `{"summary": 2-4 sentence overview, "riskLevel": "Moderate"|"Elevated"|"High", ` +
            `"keyPoints": string[] (gaps/risks), "suggestedNextSteps": string[] (concrete actions)}.\n\n` +
            `CASE: ${JSON.stringify(slimCase(caseData))}\n` +
            `UPDATES: ${JSON.stringify((related.updates || []).map((u) => u.content))}\n` +
            `EVIDENCE: ${JSON.stringify((related.evidence || []).map((e) => e.description))}\n` +
            `SUSPECTS: ${JSON.stringify((related.suspects || []).map((s) => ({ name: s.full_name, status: s.status })))}\n` +
            `WITNESSES: ${JSON.stringify((related.witnesses || []).map((w) => w.relationship_to_case))}`,
        },
      ], { temperature: 0.3, maxTokens: 1100 })

      return {
        summary: result.summary || ruleAnalyzeCase(caseData, related).summary,
        riskLevel: result.riskLevel || 'Moderate',
        keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
        suggestedNextSteps: Array.isArray(result.suggestedNextSteps) ? result.suggestedNextSteps : [],
        source: 'groq',
      }
    } catch (e) {
      return { ...ruleAnalyzeCase(caseData, related), warning: `Model unavailable (${e.message}); used fallback.` }
    }
  }
  return ruleAnalyzeCase(caseData, related)
}

export async function aiChat({ question, history = [], caseData = null, related = {} }) {
  if (hasGroq()) {
    try {
      const contextBlock = caseData
        ? `Context — current case:\n${JSON.stringify(slimCase(caseData))}\n` +
          `Recent updates: ${JSON.stringify((related.updates || []).slice(0, 5).map((u) => u.content))}\n` +
          `Suspects: ${JSON.stringify((related.suspects || []).map((s) => ({ name: s.full_name, status: s.status })))}\n`
        : 'No specific case is open.'
      const messages = [
        { role: 'system', content: `${SYSTEM}\n\n${contextBlock}` },
        ...history.slice(-6).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })),
        { role: 'user', content: question },
      ]
      const answer = await groqChat(messages, { temperature: 0.4, maxTokens: 800 })
      return { answer, source: 'groq' }
    } catch (e) {
      const fb = ruleChat(question, caseData, related)
      return { ...fb, warning: `Model unavailable (${e.message}); used fallback.` }
    }
  }
  return ruleChat(question, caseData, related)
}

export async function aiInsights(stats) {
  if (hasGroq()) {
    try {
      const result = await groqJson([
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            `You are briefing a station commander. Given these aggregate case statistics, respond with JSON only: ` +
            `{"headline": one sentence, "trends": string[], "priorities": string[], "recommendations": string[]}.\n\n` +
            `STATS: ${JSON.stringify(stats)}`,
        },
      ], { temperature: 0.3, maxTokens: 900 })
      return {
        headline: result.headline || ruleInsights(stats).headline,
        trends: Array.isArray(result.trends) ? result.trends : [],
        priorities: Array.isArray(result.priorities) ? result.priorities : [],
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
        source: 'groq',
      }
    } catch (e) {
      return { ...ruleInsights(stats), warning: `Model unavailable (${e.message}); used fallback.` }
    }
  }
  return ruleInsights(stats)
}

export async function aiCaseReport(caseData, related = {}) {
  if (hasGroq()) {
    try {
      const report = await groqChat([
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            `Write a formal, well-structured police investigation report for the following case. ` +
            `Use numbered sections: Summary, Incident Details, Complainant, Suspects, Witnesses, Evidence, ` +
            `Investigation Log, Assessment & Recommended Next Steps. Keep it factual; do not invent details.\n\n` +
            `CASE: ${JSON.stringify(slimCase(caseData))}\n` +
            `SUSPECTS: ${JSON.stringify((related.suspects || []).map((s) => ({ name: s.full_name, alias: s.alias, status: s.status, marks: s.identifying_marks })))}\n` +
            `WITNESSES: ${JSON.stringify((related.witnesses || []).map((w) => ({ name: w.full_name, rel: w.relationship_to_case, statement: w.statement })))}\n` +
            `EVIDENCE: ${JSON.stringify((related.evidence || []).map((e) => ({ name: e.file_name, type: e.file_type, desc: e.description })))}\n` +
            `LOG: ${JSON.stringify((related.updates || []).map((u) => ({ type: u.update_type, content: u.content })))}`,
        },
      ], { temperature: 0.35, maxTokens: 1600 })
      return { report, source: 'groq' }
    } catch (e) {
      return { ...ruleReport(caseData, related), warning: `Model unavailable (${e.message}); used fallback.` }
    }
  }
  return ruleReport(caseData, related)
}

function slimCase(c) {
  if (!c) return null
  return {
    case_number: c.case_number, title: c.title, description: c.description,
    category: c.category, priority: c.priority, status: c.status,
    location: c.location, date_reported: c.date_reported,
    complainant_name: c.complainant_name, resolution_summary: c.resolution_summary,
  }
}
