import { useState } from 'react'
import styles from './LoanForm.module.css'

function toDateInputValue(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function LoanForm({ loan, isEdit, canDelete, onSave, onDelete, onClose }) {
  const [name, setName] = useState(loan?.name || '')
  const [principal, setPrincipal] = useState(loan?.principal?.toString() || '')
  const [annualRate, setAnnualRate] = useState(
    loan ? (loan.annualRate * 100).toString() : ''
  )
  const [years, setYears] = useState(loan?.years?.toString() || '')
  const [startDate, setStartDate] = useState(
    loan ? toDateInputValue(loan.startDate) : ''
  )
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Required'
    if (!principal || Number(principal) <= 0) e.principal = 'Must be > 0'
    if (annualRate === '' || Number(annualRate) < 0) e.annualRate = 'Must be >= 0'
    if (!years || Number(years) < 1) e.years = 'Must be >= 1'
    if (!startDate) e.startDate = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSave({
      name: name.trim(),
      principal: Number(principal),
      annualRate: Number(annualRate) / 100,
      years: Number(years),
      startDate: new Date(startDate + 'T00:00:00'),
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.heading}>{isEdit ? 'Edit loan' : 'Add loan'}</h2>

        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Car loan"
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </label>

        <label className={styles.label}>
          Principal ($)
          <input
            className={styles.input}
            type="number"
            min="1"
            step="any"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          {errors.principal && <span className={styles.error}>{errors.principal}</span>}
        </label>

        <label className={styles.label}>
          Annual rate (%)
          <input
            className={styles.input}
            type="number"
            min="0"
            step="any"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
          {errors.annualRate && <span className={styles.error}>{errors.annualRate}</span>}
        </label>

        <label className={styles.label}>
          Term (years)
          <input
            className={styles.input}
            type="number"
            min="1"
            step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          {errors.years && <span className={styles.error}>{errors.years}</span>}
        </label>

        <label className={styles.label}>
          Start date
          <input
            className={styles.input}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {errors.startDate && <span className={styles.error}>{errors.startDate}</span>}
        </label>

        <div className={styles.actions}>
          {isEdit && canDelete && (
            <button type="button" className={styles.deleteBtn} onClick={onDelete}>
              Delete
            </button>
          )}
          <div className={styles.right}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
