'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Case, mockCases } from './mock-data'

interface CaseContextType {
  cases: Case[]
  addCase: (caseItem: Case) => void
  updateCase: (case_id: string, updates: Partial<Case>) => void
  deleteCase: (case_id: string) => void
  getCase: (case_id: string) => Case | undefined
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([...mockCases])

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

  return (
    <CaseContext.Provider
      value={{
        cases,
        addCase,
        updateCase,
        deleteCase,
        getCase,
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
