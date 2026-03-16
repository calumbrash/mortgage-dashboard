import styles from './SplitBar.module.css'
import { fmtCurrencyDec, fmtDate } from '../utils/mortgage'

export default function SplitBar({ payment, weekNumber }) {
  if (!payment) return null
  const pPct = ((payment.principal / payment.payment) * 100).toFixed(1)
  const iPct = ((payment.interest / payment.payment) * 100).toFixed(1)

  return (
    <div className={styles.wrap}>
      <div className={styles.sectionTitle}>This week's payment</div>
      <div className={styles.bar}>
        <div className={styles.principal} style={{ width: `${pPct}%` }}>
          <span className={styles.barLabel}>{pPct}% principal</span>
        </div>
        <div className={styles.interest} style={{ width: `${iPct}%` }}>
          <span className={styles.barLabel}>{iPct}% interest</span>
        </div>
      </div>
      <div className={styles.legend}>
        <span>
          <span className={styles.dot} style={{ background: 'var(--color-teal)' }} />
          Principal {fmtCurrencyDec(payment.principal)}
        </span>
        <span>
          <span className={styles.dot} style={{ background: 'var(--color-coral)' }} />
          Interest {fmtCurrencyDec(payment.interest)}
        </span>
      </div>
      <div className={styles.meta}>
        Payment #{weekNumber} · {fmtDate(payment.date)}
      </div>
    </div>
  )
}
