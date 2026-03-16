import styles from './MetricCard.module.css'

export default function MetricCard({ label, value, sub, accent }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${accent ? styles.accent : ''}`}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}
