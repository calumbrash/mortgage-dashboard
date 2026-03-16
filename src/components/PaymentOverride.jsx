import { useState, useEffect } from 'react'
import { fmtCurrency } from '../utils/mortgage'
import styles from './PaymentOverride.module.css'

export default function PaymentOverride({
  defaultPayment,
  minPayment,
  currentOverride,
  weeksSaved,
  interestSaved,
  onPaymentChange,
}) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(
      currentOverride != null
        ? currentOverride.toFixed(2)
        : defaultPayment.toFixed(2)
    )
  }, [currentOverride, defaultPayment])

  const parsed = parseFloat(inputValue)
  const isValid = !isNaN(parsed) && parsed >= minPayment
  const showError = inputValue !== '' && !isNaN(parsed) && parsed < minPayment

  function commit() {
    if (!isValid) return
    if (Math.abs(parsed - defaultPayment) < 0.01) {
      onPaymentChange(null)
    } else {
      onPaymentChange(parsed)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commit()
  }

  function handleReset() {
    onPaymentChange(null)
  }

  const isActive = currentOverride != null
  const isBetter = weeksSaved > 0

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>What-if weekly payment</span>
      <div className={styles.inputGroup}>
        <span className={styles.prefix}>$</span>
        <input
          className={`${styles.input} ${showError ? styles.hasError : ''}`}
          type="number"
          step="0.01"
          min={minPayment}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isActive && (
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset
        </button>
      )}
      {showError && (
        <span className={styles.error}>
          Must exceed weekly interest ({fmtCurrency(minPayment)})
        </span>
      )}
      {isActive && !showError && (
        <span
          className={`${styles.comparison} ${!isBetter ? styles.negative : ''}`}
        >
          {isBetter
            ? `Saves ${weeksSaved} weeks \u00b7 Saves ${fmtCurrency(interestSaved)} interest`
            : `Adds ${Math.abs(weeksSaved)} weeks \u00b7 ${fmtCurrency(Math.abs(interestSaved))} more interest`}
        </span>
      )}
    </div>
  )
}
