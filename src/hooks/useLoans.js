import { useState, useMemo, useCallback } from 'react'
import { DEFAULT_LOAN_CONFIG } from '../utils/mortgage'

const STORAGE_KEY = 'mortgage-loans'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function serialize(loans) {
  return JSON.stringify(
    loans.map((l) => ({ ...l, startDate: l.startDate.toISOString() }))
  )
}

function deserialize(json) {
  try {
    const arr = JSON.parse(json)
    return arr.map((l) => ({ ...l, startDate: new Date(l.startDate) }))
  } catch {
    return null
  }
}

function loadLoans() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = deserialize(raw)
    if (parsed && parsed.length > 0) return parsed
  }
  return [{ ...DEFAULT_LOAN_CONFIG, id: 'default' }]
}

function loadSelectedId(loans) {
  const saved = localStorage.getItem(STORAGE_KEY + '-selected')
  if (saved && loans.some((l) => l.id === saved)) return saved
  return loans[0].id
}

export default function useLoans() {
  const [loans, setLoansRaw] = useState(loadLoans)
  const [selectedId, setSelectedIdRaw] = useState(() => loadSelectedId(loadLoans()))

  const setLoans = useCallback((updater) => {
    setLoansRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(STORAGE_KEY, serialize(next))
      return next
    })
  }, [])

  const setSelectedId = useCallback((id) => {
    setSelectedIdRaw(id)
    localStorage.setItem(STORAGE_KEY + '-selected', id)
  }, [])

  const selectedLoan = useMemo(
    () => loans.find((l) => l.id === selectedId) || loans[0],
    [loans, selectedId]
  )

  const addLoan = useCallback((loan) => {
    const newLoan = { ...loan, id: generateId() }
    setLoans((prev) => [...prev, newLoan])
    setSelectedId(newLoan.id)
    return newLoan
  }, [setLoans, setSelectedId])

  const updateLoan = useCallback((id, updates) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    )
  }, [setLoans])

  const deleteLoan = useCallback((id) => {
    setLoans((prev) => {
      const next = prev.filter((l) => l.id !== id)
      if (next.length === 0) return prev
      return next
    })
    setSelectedIdRaw((prevId) => {
      if (prevId === id) {
        const remaining = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return remaining[0]?.id || prevId
      }
      return prevId
    })
  }, [setLoans])

  return { loans, selectedLoan, selectedId, setSelectedId, addLoan, updateLoan, deleteLoan }
}
