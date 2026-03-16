import styles from './ProgressBar.module.css'
import { fmtCurrency, fmtDate, addWeeks } from '../utils/mortgage'

export default function ProgressBar({ principal, currentBalance, weeksPassed, totalWeeks, startDate }) {
  const paidOff = principal - currentBalance
  const pct = Math.max(0.5, (paidOff / principal) * 100)
  const payoffDate = addWeeks(startDate, totalWeeks)

  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Loan paid off</div>
        <div className={styles.labels}>
          <span>{fmtCurrency(paidOff)} paid</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.sublabels}>
          <span>{fmtCurrency(currentBalance)} remaining</span>
          <span>Payoff: {fmtDate(payoffDate)}</span>
        </div>
      </div>
    </div>
  )
}
