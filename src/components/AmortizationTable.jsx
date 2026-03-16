import { useState, useEffect, useRef } from 'react'
import styles from './AmortizationTable.module.css'
import { fmtDate, fmtCurrency, fmtCurrencyDec } from '../utils/mortgage'

export default function AmortizationTable({ schedule, annualSummary, currentWeek }) {
  const [tableMode, setTableMode] = useState('all')
  const currentRowRef = useRef(null)

  useEffect(() => {
    if (tableMode === 'all' && currentRowRef.current) {
      setTimeout(() => {
        currentRowRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 100)
    }
  }, [tableMode])

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Amortization schedule</span>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tableMode === 'all' ? styles.active : ''}`}
            onClick={() => setTableMode('all')}
          >
            All payments
          </button>
          <button
            className={`${styles.tab} ${tableMode === 'annual' ? styles.active : ''}`}
            onClick={() => setTableMode('annual')}
          >
            Annual summary
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        {tableMode === 'all' ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.left}>Date</th>
                <th>Week #</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => {
                const isCurrent = i === currentWeek - 1
                return (
                  <tr
                    key={s.week}
                    className={isCurrent ? styles.currentRow : ''}
                    ref={isCurrent ? currentRowRef : null}
                  >
                    <td className={styles.left}>{fmtDate(s.date)}</td>
                    <td>{s.week}</td>
                    <td>{fmtCurrencyDec(s.payment)}</td>
                    <td className={styles.principal}>{fmtCurrencyDec(s.principal)}</td>
                    <td className={styles.interest}>{fmtCurrencyDec(s.interest)}</td>
                    <td>{fmtCurrency(s.balance)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.left}>Year</th>
                <th className={styles.left}>Period</th>
                <th>Principal paid</th>
                <th>Interest paid</th>
                <th>Year-end balance</th>
              </tr>
            </thead>
            <tbody>
              {annualSummary.map((a) => (
                <tr key={a.year}>
                  <td className={styles.left}>{a.label}</td>
                  <td className={styles.left} style={{ color: 'var(--color-text-secondary)' }}>Year {a.year}</td>
                  <td className={styles.principal}>{fmtCurrency(a.principal)}</td>
                  <td className={styles.interest}>{fmtCurrency(a.interest)}</td>
                  <td>{fmtCurrency(a.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
