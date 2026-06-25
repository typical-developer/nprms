// Rule-based AI fallback. Runs with zero configuration so every AI feature
// works even without a model key. Deterministic, offline, free.

const CATEGORY_KEYWORDS = {
  'Armed Robbery': ['armed', 'gun', 'gunmen', 'gunman', 'pistol', 'rifle', 'weapon', 'robbed at gunpoint', 'ak-47'],
  'Homicide': ['homicide', 'murder', 'killed', 'killing', 'dead body', 'corpse', 'body found', 'stab wound', 'manslaughter'],
  'Missing Person': ['missing', 'disappeared', 'last seen', 'abducted', 'kidnap', 'kidnapped', 'whereabouts unknown'],
  'Cybercrime': ['cyber', 'online', 'email', 'phishing', 'hacked', 'hacking', 'sim swap', 'sim card', 'wire transfer', 'account compromised', 'malware', 'internet fraud', 'otp', 'login'],
  'Fraud': ['fraud', 'scam', 'deceived', 'fake', 'forged', 'investment', 'advance fee', 'ponzi', 'impersonat', 'counterfeit', 'embezzle'],
  'Assault': ['assault', 'attacked', 'beaten', 'beating', 'fight', 'altercation', 'cutlass', 'machete', 'injured', 'wounded', 'battery'],
  'Theft': ['theft', 'stolen', 'stole', 'burglary', 'shoplift', 'pickpocket', 'broke into', 'missing item', 'generator', 'vehicle'],
}

const CATEGORY_ORDER = [
  'Homicide', 'Armed Robbery', 'Missing Person', 'Cybercrime', 'Fraud', 'Assault', 'Theft',
]

function scoreCategory(text) {
  const lower = text.toLowerCase()
  const scores = {}
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[cat] = words.reduce((n, w) => (lower.includes(w) ? n + 1 : n), 0)
  }
  let best = 'Theft'
  let bestScore = 0
  for (const cat of CATEGORY_ORDER) {
    if (scores[cat] > bestScore) { best = cat; bestScore = scores[cat] }
  }
  return { best, bestScore }
}

function detectLargeAmount(text) {
  // Detect figures like "₦15 million", "5 million", "₦2.5m".
  return /(₦|ngn|naira)?\s*\d+(\.\d+)?\s*(m|million|bn|billion)/i.test(text)
}

function detectMinor(text) {
  const lower = text.toLowerCase()
  if (/\b(child|minor|teenager|teen|pupil|student|baby|toddler)\b/.test(lower)) return true
  const ageMatch = lower.match(/(\d{1,2})\s*[- ]?year[- ]?old/)
  if (ageMatch && Number(ageMatch[1]) < 18) return true
  return false
}

export function ruleCategorize(title = '', description = '') {
  const text = `${title} ${description}`.trim()
  const { best, bestScore } = scoreCategory(text)

  let priority = 'Medium'
  const critical = ['Homicide', 'Armed Robbery']
  if (critical.includes(best)) priority = 'Critical'
  else if (best === 'Missing Person') priority = detectMinor(text) ? 'Critical' : 'High'
  else if (['Cybercrime', 'Fraud'].includes(best)) priority = detectLargeAmount(text) ? 'High' : 'Medium'
  else if (best === 'Assault') priority = /cutlass|machete|weapon|serious|critical/i.test(text) ? 'High' : 'Medium'
  if (detectLargeAmount(text) && priority === 'Medium') priority = 'High'

  const confidence = bestScore === 0 ? 'low' : bestScore >= 2 ? 'high' : 'medium'
  const suggestedTitle = title?.trim()
    ? title.trim()
    : `${best} reported${/at ([\w\s]+)/i.test(text) ? ` at ${RegExp.$1.trim()}` : ''}`.slice(0, 120)

  return {
    category: best,
    priority,
    suggestedTitle,
    confidence,
    rationale: bestScore === 0
      ? 'No strong category signal found; defaulted to Theft. Please review.'
      : `Matched ${bestScore} keyword signal(s) for "${best}". Priority set from category and severity cues.`,
    source: 'rule-based',
  }
}

function nextStepsFor(caseData, related) {
  const steps = []
  const status = caseData.status
  const category = caseData.category
  const hasSuspects = (related.suspects || []).length > 0
  const hasWitnesses = (related.witnesses || []).length > 0
  const hasEvidence = (related.evidence || []).length > 0

  if (status === 'Registered') steps.push('Assign the case to an investigating officer.')
  if (!hasEvidence) steps.push('Collect and log physical/digital evidence with proper chain of custody.')
  if (!hasWitnesses) steps.push('Canvass the scene and record statements from available witnesses.')
  if (!hasSuspects) steps.push('Develop and document suspect descriptions or persons of interest.')

  switch (category) {
    case 'Armed Robbery':
      steps.push('Request CCTV footage from the scene and neighbouring premises.')
      steps.push('Circulate suspect/vehicle descriptions to nearby divisions and checkpoints.')
      break
    case 'Homicide':
      steps.push('Secure the crime scene and obtain the forensic/pathology report.')
      steps.push('Establish time of death and reconstruct the victim’s last known movements.')
      break
    case 'Missing Person':
      steps.push('Issue a circulation bulletin with a recent photograph.')
      steps.push('Check hospitals, mortuaries, transport hubs and contact phone records.')
      break
    case 'Cybercrime':
      steps.push('Preserve digital logs and request records from the relevant bank/telco.')
      steps.push('Trace IP/transaction trail and engage the cybercrime unit.')
      break
    case 'Fraud':
      steps.push('Obtain financial transaction records and trace the flow of funds.')
      steps.push('Identify and freeze beneficiary accounts where possible.')
      break
    case 'Assault':
      steps.push('Obtain the medical/injury report and photograph injuries.')
      steps.push('Interview the complainant and any bystanders promptly.')
      break
    case 'Theft':
      steps.push('Circulate descriptions/serial numbers of stolen items to markets and dealers.')
      steps.push('Review nearby CCTV and check for similar reported thefts.')
      break
  }

  if (caseData.priority === 'Critical') {
    steps.unshift('Escalate to a supervisor for priority resourcing given the Critical rating.')
  }
  return steps.slice(0, 7)
}

function riskLevel(caseData, related) {
  if (caseData.priority === 'Critical' || ['Homicide', 'Armed Robbery'].includes(caseData.category)) return 'High'
  if (caseData.priority === 'High') return 'Elevated'
  if ((related.suspects || []).some((s) => s.status === 'At Large')) return 'Elevated'
  return 'Moderate'
}

export function ruleAnalyzeCase(caseData, related = {}) {
  const updates = related.updates || []
  const evidence = related.evidence || []
  const suspects = related.suspects || []
  const witnesses = related.witnesses || []

  const atLarge = suspects.filter((s) => s.status === 'At Large').length
  const inCustody = suspects.filter((s) => s.status === 'In Custody').length

  const summary =
    `${caseData.case_number} — a ${caseData.priority.toLowerCase()}-priority ${caseData.category} case ` +
    `currently "${caseData.status}". Reported at ${caseData.location || 'an unspecified location'} by ` +
    `${caseData.complainant_name || 'the complainant'}. ` +
    `The file holds ${evidence.length} evidence item(s), ${suspects.length} suspect(s) ` +
    `(${inCustody} in custody, ${atLarge} at large), ${witnesses.length} witness statement(s) and ` +
    `${updates.length} investigation update(s).` +
    (caseData.resolution_summary ? ` Resolution noted: ${caseData.resolution_summary}` : '')

  const keyPoints = []
  if (atLarge > 0) keyPoints.push(`${atLarge} suspect(s) still at large.`)
  if (evidence.length === 0) keyPoints.push('No evidence has been logged yet.')
  if (witnesses.length === 0) keyPoints.push('No witness statements recorded.')
  if (updates.length === 0) keyPoints.push('No investigation updates logged — case may be stalling.')
  if (caseData.status === 'Registered' && !caseData.assigned_officer) keyPoints.push('Case is unassigned.')
  if (keyPoints.length === 0) keyPoints.push('Case file is reasonably complete; maintain momentum.')

  return {
    summary,
    riskLevel: riskLevel(caseData, related),
    keyPoints,
    suggestedNextSteps: nextStepsFor(caseData, related),
    source: 'rule-based',
  }
}

export function ruleInsights(stats = {}) {
  const {
    total = 0, active = 0, overdue = 0, unassigned = 0,
    criticalOpen = 0, byCategory = {}, byStatus = {}, resolutionRate = 0,
  } = stats

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

  const headline =
    `${total} cases on file — ${active} active, ${overdue} overdue, ${unassigned} unassigned. ` +
    `Resolution rate ${resolutionRate}%.`

  const trends = []
  if (topCategory && topCategory[1] > 0) trends.push(`${topCategory[0]} is the most common category (${topCategory[1]} cases).`)
  if (byStatus['Under Investigation']) trends.push(`${byStatus['Under Investigation']} case(s) actively under investigation.`)
  if (byStatus['Reopened']) trends.push(`${byStatus['Reopened']} reopened case(s) need attention.`)
  if (trends.length === 0) trends.push('Caseload is light; no dominant trend.')

  const priorities = []
  if (criticalOpen > 0) priorities.push(`${criticalOpen} open Critical-priority case(s) require immediate resourcing.`)
  if (overdue > 0) priorities.push(`${overdue} case(s) have had no update in 7+ days.`)
  if (unassigned > 0) priorities.push(`${unassigned} case(s) are waiting to be assigned to an officer.`)
  if (priorities.length === 0) priorities.push('No urgent escalations detected.')

  const recommendations = []
  if (unassigned > 0) recommendations.push('Assign the backlog of unassigned cases to available officers.')
  if (overdue > 0) recommendations.push('Request status updates on overdue cases and reassign if officers are overloaded.')
  if (criticalOpen > 0) recommendations.push('Hold a briefing on open Critical cases and confirm resourcing.')
  if (resolutionRate < 40 && total > 5) recommendations.push('Resolution rate is low — review investigative bottlenecks.')
  if (recommendations.length === 0) recommendations.push('Maintain current workflow; metrics are healthy.')

  return { headline, trends, priorities, recommendations, source: 'rule-based' }
}

export function ruleReport(caseData, related = {}) {
  const updates = related.updates || []
  const evidence = related.evidence || []
  const suspects = related.suspects || []
  const witnesses = related.witnesses || []
  const analysis = ruleAnalyzeCase(caseData, related)

  const lines = []
  lines.push(`INVESTIGATION REPORT — ${caseData.case_number}`)
  lines.push(`Title: ${caseData.title}`)
  lines.push(`Category: ${caseData.category} | Priority: ${caseData.priority} | Status: ${caseData.status}`)
  lines.push(`Location: ${caseData.location || 'N/A'} | Reported: ${caseData.date_reported || 'N/A'}`)
  lines.push('')
  lines.push('1. SUMMARY')
  lines.push(analysis.summary)
  lines.push('')
  lines.push('2. INCIDENT DETAILS')
  lines.push(caseData.description || 'No description recorded.')
  lines.push('')
  lines.push('3. COMPLAINANT')
  lines.push(`${caseData.complainant_name || 'N/A'} — ${caseData.complainant_contact || 'no contact'}`)
  lines.push('')
  lines.push(`4. SUSPECTS (${suspects.length})`)
  if (suspects.length) suspects.forEach((s, i) => lines.push(`  4.${i + 1} ${s.full_name}${s.alias ? ` (aka ${s.alias})` : ''} — ${s.status}`))
  else lines.push('  None recorded.')
  lines.push('')
  lines.push(`5. WITNESSES (${witnesses.length})`)
  if (witnesses.length) witnesses.forEach((w, i) => lines.push(`  5.${i + 1} ${w.full_name} — ${w.relationship_to_case}`))
  else lines.push('  None recorded.')
  lines.push('')
  lines.push(`6. EVIDENCE (${evidence.length})`)
  if (evidence.length) evidence.forEach((e, i) => lines.push(`  6.${i + 1} ${e.file_name} (${e.file_type}) — ${e.description}`))
  else lines.push('  None recorded.')
  lines.push('')
  lines.push(`7. INVESTIGATION LOG (${updates.length})`)
  if (updates.length) updates.forEach((u) => lines.push(`  - [${u.update_type}] ${u.content}`))
  else lines.push('  No updates logged.')
  lines.push('')
  lines.push('8. ASSESSMENT & RECOMMENDED NEXT STEPS')
  lines.push(`Risk level: ${analysis.riskLevel}`)
  analysis.suggestedNextSteps.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`))
  if (caseData.resolution_summary) {
    lines.push('')
    lines.push('9. RESOLUTION')
    lines.push(caseData.resolution_summary)
  }

  return { report: lines.join('\n'), source: 'rule-based' }
}

export function ruleChat(question, caseData, related = {}) {
  const analysis = caseData ? ruleAnalyzeCase(caseData, related) : null
  const intro = caseData
    ? `Regarding ${caseData.case_number} (${caseData.category}, ${caseData.status}): `
    : ''
  const q = (question || '').toLowerCase()

  let body
  if (!caseData) {
    body = 'Open a specific case to ask focused questions about it. I can summarise a case, flag risks and suggest investigative next steps.'
  } else if (/next|step|do|should|recommend|advise/.test(q)) {
    body = 'Recommended next steps:\n- ' + analysis.suggestedNextSteps.join('\n- ')
  } else if (/risk|danger|threat|urgent|priorit/.test(q)) {
    body = `Assessed risk level is ${analysis.riskLevel}. ${analysis.keyPoints.join(' ')}`
  } else if (/summar|overview|brief|status/.test(q)) {
    body = analysis.summary
  } else {
    body = `${analysis.summary}\n\nKey points: ${analysis.keyPoints.join(' ')}`
  }

  return {
    answer: intro + body,
    note: 'Generated by the built-in rule-based assistant. Add a free GROQ_API_KEY on the server for full conversational AI.',
    source: 'rule-based',
  }
}
