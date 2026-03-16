import styles from './LoanTabs.module.css'

export default function LoanTabs({ loans, selectedId, onSelect, onAdd, onEdit }) {
  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        {loans.map((loan) => (
          <button
            key={loan.id}
            className={`${styles.tab} ${loan.id === selectedId ? styles.active : ''}`}
            onClick={() =>
              loan.id === selectedId ? onEdit(loan) : onSelect(loan.id)
            }
          >
            {loan.name}
          </button>
        ))}
      </div>
      <button className={styles.addBtn} onClick={onAdd} title="Add loan">
        +
      </button>
    </div>
  )
}
