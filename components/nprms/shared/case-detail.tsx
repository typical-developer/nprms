'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getStatusVariant, getPriorityVariant, getCategoryVariant } from '@/lib/badge-colors'
import { useAuth } from '@/lib/auth-context'
import { useCases } from '@/lib/case-context'
import { useNotifications } from '@/lib/notification-context'
import { format } from 'date-fns'
import { ArrowLeft, FileText, Image, Video, Music, Paperclip, Plus, ChevronDown, ChevronUp, UserX, User } from 'lucide-react'
import Link from 'next/link'
import type { Case, Evidence, Suspect, Witness, SuspectStatus } from '@/lib/mock-data'

interface CaseDetailProps {
  caseData: Case
  onBack: () => void
  canEdit?: boolean
  onUpdate?: (updates: Partial<Case>) => void
}

const fileTypeIcon = (type: Evidence['file_type']) => {
  switch (type) {
    case 'Image': return <Image className="w-4 h-4" />
    case 'Video': return <Video className="w-4 h-4" />
    case 'Audio': return <Music className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

function ResolutionSummaryField({ caseId, initialValue, onSave }: { caseId: string; initialValue: string; onSave: (v: string) => void }) {
  const [value, setValue] = useState(initialValue)
  const [saved, setSaved] = useState(false)
  return (
    <div className="mt-2 space-y-2">
      <Textarea
        placeholder="Describe how the case was resolved..."
        className="min-h-24"
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false) }}
      />
      <Button size="sm" disabled={!value.trim() || saved} onClick={() => { onSave(value.trim()); setSaved(true) }}>
        {saved ? 'Saved' : 'Save Resolution'}
      </Button>
    </div>
  )
}

const suspectStatusVariant = (status: SuspectStatus) => {
  switch (status) {
    case 'In Custody': return 'default'
    case 'Cleared': return 'secondary'
    default: return 'destructive'
  }
}

export function CaseDetail({ caseData, onBack, canEdit = false, onUpdate }: CaseDetailProps) {
  const { user } = useAuth()
  const {
    addInvestigationUpdate, getInvestigationUpdates,
    addEvidence, getEvidence,
    addSuspect, updateSuspectStatus, getSuspects,
    addWitness, getWitnesses,
  } = useCases()
  const { addNotification } = useNotifications()
  const [noteContent, setNoteContent] = useState('')

  // Evidence form state
  const [showEvidenceForm, setShowEvidenceForm] = useState(false)
  const [evidenceFileName, setEvidenceFileName] = useState('')
  const [evidenceFileType, setEvidenceFileType] = useState<Evidence['file_type']>('Document')
  const [evidenceDescription, setEvidenceDescription] = useState('')
  const [evidenceCustody, setEvidenceCustody] = useState('')

  // Suspect form state
  const [showSuspectForm, setShowSuspectForm] = useState(false)
  const [suspectName, setSuspectName] = useState('')
  const [suspectAlias, setSuspectAlias] = useState('')
  const [suspectAge, setSuspectAge] = useState('')
  const [suspectGender, setSuspectGender] = useState('')
  const [suspectAddress, setSuspectAddress] = useState('')
  const [suspectMarks, setSuspectMarks] = useState('')

  // Witness form state
  const [showWitnessForm, setShowWitnessForm] = useState(false)
  const [witnessName, setWitnessName] = useState('')
  const [witnessContact, setWitnessContact] = useState('')
  const [witnessStatement, setWitnessStatement] = useState('')
  const [witnessRelationship, setWitnessRelationship] = useState('')

  // Expanded witness statements
  const [expandedWitnesses, setExpandedWitnesses] = useState<Set<string>>(new Set())

  const updates = getInvestigationUpdates(caseData.case_id)
  const evidenceList = getEvidence(caseData.case_id)
  const suspectList = getSuspects(caseData.case_id)
  const witnessList = getWitnesses(caseData.case_id)

  const handleAddEvidence = () => {
    if (!evidenceFileName.trim() || !evidenceDescription.trim() || !user) return
    addEvidence({
      evidence_id: `ev${Date.now()}`,
      case_id: caseData.case_id,
      uploaded_by: user.full_name,
      file_name: evidenceFileName.trim(),
      file_type: evidenceFileType,
      description: evidenceDescription.trim(),
      custody_notes: evidenceCustody.trim(),
      uploaded_at: new Date().toISOString(),
    })
    addNotification({
      message: `Evidence "${evidenceFileName.trim()}" added to case ${caseData.case_number}`,
      type: 'Evidence Added',
      related_case_number: caseData.case_number,
    })
    setEvidenceFileName(''); setEvidenceDescription(''); setEvidenceCustody(''); setShowEvidenceForm(false)
  }

  const handleAddSuspect = () => {
    if (!suspectName.trim() || !user) return
    addSuspect({
      suspect_id: `s${Date.now()}`,
      case_id: caseData.case_id,
      full_name: suspectName.trim(),
      alias: suspectAlias.trim() || null,
      age: parseInt(suspectAge) || 0,
      gender: suspectGender.trim() || 'Unknown',
      address: suspectAddress.trim() || 'Unknown',
      identifying_marks: suspectMarks.trim(),
      status: 'At Large',
    })
    setSuspectName(''); setSuspectAlias(''); setSuspectAge(''); setSuspectGender('')
    setSuspectAddress(''); setSuspectMarks(''); setShowSuspectForm(false)
  }

  const handleAddWitness = () => {
    if (!witnessName.trim() || !witnessStatement.trim() || !user) return
    addWitness({
      witness_id: `w${Date.now()}`,
      case_id: caseData.case_id,
      full_name: witnessName.trim(),
      contact: witnessContact.trim(),
      statement: witnessStatement.trim(),
      relationship_to_case: witnessRelationship.trim(),
    })
    setWitnessName(''); setWitnessContact(''); setWitnessStatement(''); setWitnessRelationship('')
    setShowWitnessForm(false)
  }

  const toggleWitnessExpand = (id: string) => {
    setExpandedWitnesses((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSaveUpdate = () => {
    if (!noteContent.trim() || !user) return

    addInvestigationUpdate({
      update_id: `u${Date.now()}`,
      case_id: caseData.case_id,
      officer_name: user.full_name,
      update_type: 'Note',
      content: noteContent.trim(),
      created_at: new Date().toISOString(),
    })

    setNoteContent('')
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Case Title Section */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{caseData.case_number}: {caseData.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(caseData.status)} className="text-sm">
                {caseData.status}
              </Badge>
              <Badge variant={getPriorityVariant(caseData.priority)} className="text-sm">
                {caseData.priority} Priority
              </Badge>
              <Badge variant={getCategoryVariant(caseData.category)} className="text-sm">
                {caseData.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Case Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Date Reported</p>
            <p className="font-medium">{format(new Date(caseData.date_reported), 'PPP p')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Location</p>
            <p className="font-medium">{caseData.location}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Registered By</p>
            <p className="font-medium">{caseData.registered_by.full_name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Assigned Officer</p>
            <p className="font-medium">{caseData.assigned_officer?.full_name || 'Unassigned'}</p>
          </div>
        </div>
      </Card>

      {/* Case Description */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Case Description</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.description}</p>
      </Card>

      {/* Complainant Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Complainant Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">Name</Label>
            <p className="text-sm mt-1">{caseData.complainant_name}</p>
          </div>
          <div>
            <Label className="text-xs font-medium">Contact</Label>
            <p className="text-sm mt-1">{caseData.complainant_contact}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs font-medium">Address</Label>
            <p className="text-sm mt-1">{caseData.complainant_address}</p>
          </div>
        </div>
      </Card>

      {/* Case Status Update Section - Only for assigned officer */}
      {canEdit && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h2 className="text-lg font-semibold mb-4">Investigation Update</h2>
          <div className="space-y-4">
            {/* Status transition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status-change">Case Status</Label>
                <Select
                  value={caseData.status}
                  onValueChange={(v) => {
                    const newStatus = v as Case['status']
                    onUpdate?.({ status: newStatus, updated_at: new Date().toISOString() })
                    addInvestigationUpdate({
                      update_id: `u${Date.now()}`,
                      case_id: caseData.case_id,
                      officer_name: user?.full_name ?? '',
                      update_type: 'Status Change',
                      content: `Status changed to "${newStatus}"`,
                      created_at: new Date().toISOString(),
                    })
                  }}
                >
                  <SelectTrigger id="status-change" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Escalate / Flag</Label>
                <Button
                  variant="destructive"
                  className="mt-2 w-full"
                  onClick={() => {
                    onUpdate?.({ priority: 'Critical', updated_at: new Date().toISOString() })
                    addInvestigationUpdate({
                      update_id: `u${Date.now()}`,
                      case_id: caseData.case_id,
                      officer_name: user?.full_name ?? '',
                      update_type: 'Status Change',
                      content: 'Case escalated to Critical priority for supervisor review.',
                      created_at: new Date().toISOString(),
                    })
                  }}
                  disabled={caseData.priority === 'Critical'}
                >
                  {caseData.priority === 'Critical' ? 'Already Critical Priority' : 'Escalate to Critical'}
                </Button>
              </div>
            </div>

            {/* Resolution summary — visible when status is Resolved */}
            {(caseData.status === 'Resolved' || caseData.status === 'Closed') && (
              <div>
                <Label htmlFor="resolution">Resolution Summary</Label>
                <ResolutionSummaryField
                  caseId={caseData.case_id}
                  initialValue={caseData.resolution_summary ?? ''}
                  onSave={(summary) => onUpdate?.({ resolution_summary: summary, updated_at: new Date().toISOString() })}
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Investigation Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add investigation notes here..."
                className="mt-2 min-h-32"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveUpdate} disabled={!noteContent.trim()}>
                Save Update
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Evidence Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Evidence <span className="text-muted-foreground text-sm font-normal">({evidenceList.length})</span></h2>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setShowEvidenceForm((v) => !v)}>
              <Plus className="w-4 h-4 mr-1" /> Add Evidence
            </Button>
          )}
        </div>

        {canEdit && showEvidenceForm && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ev-filename">File / Item Name</Label>
                <Input id="ev-filename" className="mt-1" placeholder="e.g. cctv_footage.mp4" value={evidenceFileName} onChange={(e) => setEvidenceFileName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ev-type">Type</Label>
                <Select value={evidenceFileType} onValueChange={(v) => setEvidenceFileType(v as Evidence['file_type'])}>
                  <SelectTrigger id="ev-type" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea id="ev-desc" className="mt-1" placeholder="Describe the evidence..." value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ev-custody">Custody Notes</Label>
              <Input id="ev-custody" className="mt-1" placeholder="e.g. Received from complainant, original retained" value={evidenceCustody} onChange={(e) => setEvidenceCustody(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddEvidence} disabled={!evidenceFileName.trim() || !evidenceDescription.trim()}>Save Evidence</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowEvidenceForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {evidenceList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No evidence recorded for this case.</p>
        ) : (
          <div className="space-y-3">
            {evidenceList.map((ev) => (
              <div key={ev.evidence_id} className="flex gap-3 p-3 border rounded-lg">
                <div className="mt-1 text-muted-foreground">{fileTypeIcon(ev.file_type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{ev.file_name}</span>
                    <Badge variant="secondary" className="text-xs">{ev.file_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>
                  {ev.custody_notes && <p className="text-xs text-muted-foreground mt-1 italic">Custody: {ev.custody_notes}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Uploaded by {ev.uploaded_by} · {format(new Date(ev.uploaded_at), 'PPP')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Suspects Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Suspects <span className="text-muted-foreground text-sm font-normal">({suspectList.length})</span></h2>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setShowSuspectForm((v) => !v)}>
              <Plus className="w-4 h-4 mr-1" /> Add Suspect
            </Button>
          )}
        </div>

        {canEdit && showSuspectForm && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sus-name">Full Name</Label>
                <Input id="sus-name" className="mt-1" placeholder="Full name or 'Unknown'" value={suspectName} onChange={(e) => setSuspectName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sus-alias">Alias / Nickname</Label>
                <Input id="sus-alias" className="mt-1" placeholder="Optional" value={suspectAlias} onChange={(e) => setSuspectAlias(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sus-age">Age</Label>
                <Input id="sus-age" className="mt-1" type="number" placeholder="Estimated age" value={suspectAge} onChange={(e) => setSuspectAge(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sus-gender">Gender</Label>
                <Input id="sus-gender" className="mt-1" placeholder="Male / Female / Unknown" value={suspectGender} onChange={(e) => setSuspectGender(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="sus-address">Known Address</Label>
                <Input id="sus-address" className="mt-1" placeholder="Address or 'Unknown'" value={suspectAddress} onChange={(e) => setSuspectAddress(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="sus-marks">Identifying Marks / Description</Label>
                <Textarea id="sus-marks" className="mt-1" placeholder="Physical description, scars, tattoos..." value={suspectMarks} onChange={(e) => setSuspectMarks(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddSuspect} disabled={!suspectName.trim()}>Save Suspect</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSuspectForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {suspectList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suspects recorded for this case.</p>
        ) : (
          <div className="space-y-3">
            {suspectList.map((s) => (
              <div key={s.suspect_id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-medium text-sm">{s.full_name}{s.alias ? ` (aka "${s.alias}")` : ''}</p>
                    <p className="text-xs text-muted-foreground">{s.gender}{s.age ? `, ~${s.age} yrs` : ''} · {s.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={suspectStatusVariant(s.status) as any}>{s.status}</Badge>
                    {canEdit && (
                      <Select value={s.status} onValueChange={(v) => updateSuspectStatus(s.suspect_id, v as SuspectStatus)}>
                        <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="At Large">At Large</SelectItem>
                          <SelectItem value="In Custody">In Custody</SelectItem>
                          <SelectItem value="Cleared">Cleared</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                {s.identifying_marks && <p className="text-xs text-muted-foreground mt-2 italic">{s.identifying_marks}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Witnesses Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Witnesses <span className="text-muted-foreground text-sm font-normal">({witnessList.length})</span></h2>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setShowWitnessForm((v) => !v)}>
              <Plus className="w-4 h-4 mr-1" /> Add Witness
            </Button>
          )}
        </div>

        {canEdit && showWitnessForm && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/30 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="wit-name">Full Name</Label>
                <Input id="wit-name" className="mt-1" placeholder="Witness full name" value={witnessName} onChange={(e) => setWitnessName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="wit-contact">Contact</Label>
                <Input id="wit-contact" className="mt-1" placeholder="Phone number or email" value={witnessContact} onChange={(e) => setWitnessContact(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="wit-rel">Relationship to Case</Label>
                <Input id="wit-rel" className="mt-1" placeholder="e.g. Bystander, Neighbour, Victim's relative" value={witnessRelationship} onChange={(e) => setWitnessRelationship(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="wit-statement">Statement</Label>
                <Textarea id="wit-statement" className="mt-1 min-h-24" placeholder="Record witness statement here..." value={witnessStatement} onChange={(e) => setWitnessStatement(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddWitness} disabled={!witnessName.trim() || !witnessStatement.trim()}>Save Witness</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowWitnessForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {witnessList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No witnesses recorded for this case.</p>
        ) : (
          <div className="space-y-3">
            {witnessList.map((w) => {
              const expanded = expandedWitnesses.has(w.witness_id)
              const long = w.statement.length > 120
              return (
                <div key={w.witness_id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{w.full_name}</p>
                      <p className="text-xs text-muted-foreground">{w.relationship_to_case}{w.contact ? ` · ${w.contact}` : ''}</p>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {long && !expanded ? `${w.statement.slice(0, 120)}…` : w.statement}
                  </p>
                  {long && (
                    <button
                      className="text-xs text-primary mt-1 flex items-center gap-1"
                      onClick={() => toggleWitnessExpand(w.witness_id)}
                    >
                      {expanded ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Read full statement</>}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Timeline Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Case Timeline</h2>
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.update_id} className="flex gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">{update.update_type}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(update.created_at), 'PPP p')}</p>
                <p className="text-sm mt-1">{update.content}</p>
                <p className="text-xs text-muted-foreground mt-1">By {update.officer_name}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-4 pb-4 border-b">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Case Registered</p>
              <p className="text-xs text-muted-foreground">{format(new Date(caseData.created_at), 'PPP p')}</p>
              <p className="text-xs text-muted-foreground mt-1">By {caseData.registered_by.full_name}</p>
            </div>
          </div>
          {caseData.assigned_officer && (
            <div className="flex gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Case Assigned</p>
                <p className="text-xs text-muted-foreground">To {caseData.assigned_officer.full_name}</p>
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Last Updated</p>
              <p className="text-xs text-muted-foreground">{format(new Date(caseData.updated_at), 'PPP p')}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
