'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Case, InvestigationUpdate, Evidence, Suspect, Witness,
  mockCases, mockInvestigationUpdates, mockEvidence, mockSuspects, mockWitnesses,
} from './mock-data'

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

  const addCase = (caseItem: Case) => {
    setCases((prevCases) => {
      // Check if case already exists
      if (prevCases.some((c) => c.case_id === caseItem.case_id)) {
        return prevCases
      }
      return [...prevCases, caseItem]
    })
  }

  const updateCase = (case_id: string, updates: Partial<Case>) => {
    setCases((prevCases) =>
      prevCases.map((c) => (c.case_id === case_id ? { ...c, ...updates } : c))
    )
  }

  const deleteCase = (case_id: string) => {
    setCases((prevCases) => prevCases.filter((c) => c.case_id !== case_id))
  }

  const getCase = (case_id: string) => {
    return cases.find((c) => c.case_id === case_id)
  }

  const addInvestigationUpdate = (update: InvestigationUpdate) => {
    setInvestigationUpdates((prevUpdates) => [update, ...prevUpdates])
    // Keep the case's updated_at in sync with the new diary entry
    updateCase(update.case_id, { updated_at: update.created_at })
  }

  const getInvestigationUpdates = (case_id: string) => {
    return investigationUpdates
      .filter((u) => u.case_id === case_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const addEvidence = (item: Evidence) => {
    setEvidence((prev) => [item, ...prev])
    updateCase(item.case_id, { updated_at: item.uploaded_at })
  }

  const getEvidence = (case_id: string) => {
    return evidence.filter((e) => e.case_id === case_id)
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
  }

  const addSuspect = (suspect: Suspect) => {
    setSuspects((prev) => [suspect, ...prev])
  }

  const updateSuspectStatus = (suspect_id: string, status: Suspect['status']) => {
    setSuspects((prev) => prev.map((s) => s.suspect_id === suspect_id ? { ...s, status } : s))
  }

  const getSuspects = (case_id: string) => {
    return suspects.filter((s) => s.case_id === case_id)
  }

  const addWitness = (witness: Witness) => {
    setWitnesses((prev) => [witness, ...prev])
  }

  const getWitnesses = (case_id: string) => {
    return witnesses.filter((w) => w.case_id === case_id)
  }

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
