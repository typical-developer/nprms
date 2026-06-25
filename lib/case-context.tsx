'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Case, InvestigationUpdate, Evidence, Suspect, Witness,
  mockCases, mockInvestigationUpdates, mockEvidence, mockSuspects, mockWitnesses,
} from './mock-data'
import { api, getToken, sync } from './api'
import { useAuth } from './auth-context'

interface CaseContextType {
  cases: Case[]
  addCase: (caseItem: Case) => void
  updateCase: (case_id: string, updates: Partial<Case>) => void
  deleteCase: (case_id: string) => void
  getCase: (case_id: string) => Case | undefined
  investigationUpdates: InvestigationUpdate[]
  addInvestigationUpdate: (update: InvestigationUpdate) => void
  getInvestigationUpdates: (case_id: string) => InvestigationUpdate[]
  evidence: Evidence[]
  addEvidence: (item: Evidence) => void
  getEvidence: (case_id: string) => Evidence[]
  suspects: Suspect[]
  addSuspect: (suspect: Suspect) => void
  updateSuspectStatus: (suspect_id: string, status: Suspect['status']) => void
  getSuspects: (case_id: string) => Suspect[]
  witnesses: Witness[]
  addWitness: (witness: Witness) => void
  getWitnesses: (case_id: string) => Witness[]
  refresh: () => void
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([...mockCases])
  const [investigationUpdates, setInvestigationUpdates] = useState<InvestigationUpdate[]>([
    ...mockInvestigationUpdates,
  ])
  const [evidence, setEvidence] = useState<Evidence[]>([...mockEvidence])
  const [suspects, setSuspects] = useState<Suspect[]>([...mockSuspects])
  const [witnesses, setWitnesses] = useState<Witness[]>([...mockWitnesses])
  const { user } = useAuth()

  const refresh = () => {
    if (!getToken()) return
    api.get<Case[]>('/cases').then(setCases).catch(() => {})
    api.get<InvestigationUpdate[]>('/investigation-updates').then(setInvestigationUpdates).catch(() => {})
    api.get<Evidence[]>('/evidence').then(setEvidence).catch(() => {})
    api.get<Suspect[]>('/suspects').then(setSuspects).catch(() => {})
    api.get<Witness[]>('/witnesses').then(setWitnesses).catch(() => {})
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id])

  const addCase = (caseItem: Case) => {
    setCases((prev) => (prev.some((c) => c.case_id === caseItem.case_id) ? prev : [caseItem, ...prev]))
    sync(
      api.post<Case>('/cases', caseItem).then((saved) =>
        setCases((prev) => prev.map((c) => (c.case_id === caseItem.case_id ? saved : c)))
      ),
      'create case'
    )
  }

  const updateCase = (case_id: string, updates: Partial<Case>) => {
    setCases((prev) => prev.map((c) => (c.case_id === case_id ? { ...c, ...updates } : c)))
    sync(api.patch(`/cases/${case_id}`, updates), 'update case')
  }

  const deleteCase = (case_id: string) => {
    setCases((prev) => prev.filter((c) => c.case_id !== case_id))
    sync(api.del(`/cases/${case_id}`), 'delete case')
  }

  const getCase = (case_id: string) => cases.find((c) => c.case_id === case_id)

  // Bump a case's updated_at locally only; the server does the same when the
  // child record is persisted, so no separate PATCH is needed.
  const touchCaseLocal = (case_id: string, updated_at: string) =>
    setCases((prev) => prev.map((c) => (c.case_id === case_id ? { ...c, updated_at } : c)))

  const addInvestigationUpdate = (update: InvestigationUpdate) => {
    setInvestigationUpdates((prev) => [update, ...prev])
    touchCaseLocal(update.case_id, update.created_at)
    sync(api.post('/investigation-updates', update), 'add investigation update')
  }

  const getInvestigationUpdates = (case_id: string) =>
    investigationUpdates
      .filter((u) => u.case_id === case_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const addEvidence = (item: Evidence) => {
    setEvidence((prev) => [item, ...prev])
    touchCaseLocal(item.case_id, item.uploaded_at)
    sync(api.post('/evidence', item), 'add evidence')
  }

  const getEvidence = (case_id: string) =>
    evidence
      .filter((e) => e.case_id === case_id)
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())

  const addSuspect = (suspect: Suspect) => {
    setSuspects((prev) => [suspect, ...prev])
    sync(api.post('/suspects', suspect), 'add suspect')
  }

  const updateSuspectStatus = (suspect_id: string, status: Suspect['status']) => {
    setSuspects((prev) => prev.map((s) => (s.suspect_id === suspect_id ? { ...s, status } : s)))
    sync(api.patch(`/suspects/${suspect_id}`, { status }), 'update suspect status')
  }

  const getSuspects = (case_id: string) => suspects.filter((s) => s.case_id === case_id)

  const addWitness = (witness: Witness) => {
    setWitnesses((prev) => [witness, ...prev])
    sync(api.post('/witnesses', witness), 'add witness')
  }

  const getWitnesses = (case_id: string) => witnesses.filter((w) => w.case_id === case_id)

  return (
    <CaseContext.Provider
      value={{
        cases,
        addCase,
        updateCase,
        deleteCase,
        getCase,
        investigationUpdates,
        addInvestigationUpdate,
        getInvestigationUpdates,
        evidence,
        addEvidence,
        getEvidence,
        suspects,
        addSuspect,
        updateSuspectStatus,
        getSuspects,
        witnesses,
        addWitness,
        getWitnesses,
        refresh,
      }}
    >
      {children}
    </CaseContext.Provider>
  )
}

export function useCases() {
  const context = useContext(CaseContext)
  if (context === undefined) {
    throw new Error('useCases must be used within CaseProvider')
  }
  return context
}
