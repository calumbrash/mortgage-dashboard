import { useEffect, useMemo, useState } from 'react'
import styles from './App.module.css'
import {
  buildSchedule,
  buildAnnualSummary,
  getCurrentWeek,
  getMinPayment,
  fmtCurrency,
  fmtCurrencyDec,
  fmtDate,
} from './utils/mortgage'
import useLoans from './hooks/useLoans'
import LoanTabs from './components/LoanTabs'
import LoanForm from './components/LoanForm'
import MetricCard from './components/MetricCard'
import ProgressBar from './components/ProgressBar'
import SplitBar from './components/SplitBar'
import BalanceChart from './components/BalanceChart'
import AmortizationTable from './components/AmortizationTable'
import PaymentOverride from './components/PaymentOverride'

export default function App() {
  const { loans, selectedLoan, selectedId, setSelectedId, addLoan, updateLoan, deleteLoan } =
    useLoans()

  const [formState, setFormState] = useState(null)
  const [customPayment, setCustomPayment] = useState(null)

  // Reset override when switching loans
  useEffect(() => {
    setCustomPayment(null)
  }, [selectedId])

  const weeksPassed = useMemo(
    () => getCurrentWeek(selectedLoan.startDate, selectedLoan.years),
    [selectedLoan.startDate, selectedLoan.years]
  )

  // Original schedule (no override) — used for comparison
  const original = useMemo(
    () => buildSchedule(selectedLoan),
    [selectedLoan]
  )

  // Projected schedule with override
  const projected = useMemo(() => {
    if (customPayment == null) return original
    return buildSchedule(selectedLoan, {
      fromWeek: weeksPassed + 1,
      payment: customPayment,
    })
  }, [selectedLoan, customPayment, weeksPassed, original])

  const { schedule, weeklyPayment, totalWeeks } = projected
  const startYear = selectedLoan.startDate.getFullYear()

  const annualSummary = useMemo(
    () => buildAnnualSummary(schedule, startYear - 1),
    [schedule, startYear]
  )

  const currentPayment = weeksPassed > 0 ? schedule[weeksPassed - 1] : schedule[0]
  const latestBalance = currentPayment ? currentPayment.balance : selectedLoan.principal
  const totalInterest = schedule[totalWeeks - 1].totalInterestPaid

  const weeklyRate = selectedLoan.annualRate / 52
  const minPayment = getMinPayment(latestBalance, weeklyRate)

  const weeksSaved = original.totalWeeks - projected.totalWeeks
  const interestSaved =
    original.schedule[original.totalWeeks - 1].totalInterestPaid -
    projected.schedule[projected.totalWeeks - 1].totalInterestPaid

  const dynamicYears = Math.ceil(totalWeeks / 52)

  const metrics = [
    {
      label: 'Current balance',
      value: fmtCurrency(latestBalance),
      sub: 'as of today',
    },
    {
      label: 'Weekly payment',
      value: fmtCurrencyDec(customPayment != null ? customPayment : weeklyPayment),
      sub: customPayment != null ? 'what-if override' : 'fixed amount',
    },
    {
      label: 'Total interest',
      value: fmtCurrency(totalInterest),
      sub: 'over full term',
    },
    {
      label: 'Payments made',
      value: weeksPassed.toLocaleString(),
      sub: `of ${totalWeeks.toLocaleString()}`,
    },
  ]

  const pills = [
    ['Principal', fmtCurrency(selectedLoan.principal)],
    ['Rate', (selectedLoan.annualRate * 100).toFixed(2) + '% p.a.'],
    ['Term', selectedLoan.years + ' years'],
    ['Frequency', 'Weekly'],
  ]

  function handleFormSave(data) {
    if (formState.mode === 'add') {
      addLoan(data)
    } else {
      updateLoan(formState.loan.id, data)
    }
    setFormState(null)
  }

  function handleFormDelete() {
    deleteLoan(formState.loan.id)
    setFormState(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Loan Dashboard</h1>
          <p className={styles.subtitle}>
            {selectedLoan.name} &middot; Started {fmtDate(selectedLoan.startDate)}
          </p>
        </header>

        <LoanTabs
          loans={loans}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={() => setFormState({ mode: 'add' })}
          onEdit={(loan) => setFormState({ mode: 'edit', loan })}
        />

        <div className={styles.pills}>
          {pills.map(([label, value]) => (
            <span key={label} className={styles.pill}>
              {label} <strong>{value}</strong>
            </span>
          ))}
        </div>

        <div className={styles.metricsGrid}>
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        <PaymentOverride
          defaultPayment={weeklyPayment}
          minPayment={minPayment}
          currentOverride={customPayment}
          weeksSaved={weeksSaved}
          interestSaved={interestSaved}
          onPaymentChange={setCustomPayment}
        />

        <div className={styles.twoCol}>
          <div className={styles.card}>
            <ProgressBar
              principal={selectedLoan.principal}
              currentBalance={latestBalance}
              weeksPassed={weeksPassed}
              totalWeeks={totalWeeks}
              startDate={selectedLoan.startDate}
            />
          </div>
          <div className={styles.card}>
            <SplitBar payment={currentPayment} weekNumber={weeksPassed || 1} />
          </div>
        </div>

        <div className={styles.card}>
          <BalanceChart schedule={schedule} years={dynamicYears} startYear={startYear} />
        </div>

        <div className={styles.card}>
          <AmortizationTable
            schedule={schedule}
            annualSummary={annualSummary}
            currentWeek={weeksPassed}
          />
        </div>
      </div>

      {formState && (
        <LoanForm
          loan={formState.mode === 'edit' ? formState.loan : null}
          isEdit={formState.mode === 'edit'}
          canDelete={loans.length > 1}
          onSave={handleFormSave}
          onDelete={handleFormDelete}
          onClose={() => setFormState(null)}
        />
      )}
    </div>
  )
}
