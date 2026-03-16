export const DEFAULT_LOAN_CONFIG = {
  id: 'default',
  name: 'Family loan',
  principal: 490000,
  annualRate: 0.02,
  years: 20,
  startDate: new Date(2023, 5, 21), // 21 June 2023
}

const WEEKS_PER_YEAR = 52
const MAX_WEEKS = 5200 // 100 years safety cap

export function getMinPayment(balance, weeklyRate) {
  const weeklyInterest = balance * weeklyRate
  return weeklyInterest + 0.01
}

export function buildSchedule(config = DEFAULT_LOAN_CONFIG, override) {
  const { principal, annualRate, years, startDate } = config
  const standardTotalWeeks = years * WEEKS_PER_YEAR
  const weeklyRate = annualRate / WEEKS_PER_YEAR

  let weeklyPayment
  if (weeklyRate === 0) {
    weeklyPayment = principal / standardTotalWeeks
  } else {
    weeklyPayment =
      principal *
      ((weeklyRate * Math.pow(1 + weeklyRate, standardTotalWeeks)) /
        (Math.pow(1 + weeklyRate, standardTotalWeeks) - 1))
  }

  const schedule = []
  let balance = principal
  let totalInterestPaid = 0
  let totalPrincipalPaid = 0

  const maxWeeks = override ? MAX_WEEKS : standardTotalWeeks

  for (let i = 1; i <= maxWeeks && balance > 0; i++) {
    const currentPayment =
      override && i >= override.fromWeek ? override.payment : weeklyPayment

    const interest = balance * weeklyRate
    const principal_ = Math.min(currentPayment - interest, balance)
    balance = Math.max(0, balance - principal_)
    totalInterestPaid += interest
    totalPrincipalPaid += principal_

    schedule.push({
      week: i,
      date: addWeeks(startDate, i),
      payment: principal_ + interest,
      interest,
      principal: principal_,
      balance,
      totalInterestPaid,
      totalPrincipalPaid,
      year: Math.ceil(i / WEEKS_PER_YEAR),
    })
  }

  return { schedule, weeklyPayment, totalWeeks: schedule.length }
}

export function buildAnnualSummary(schedule, startYear) {
  const baseYear = startYear != null ? startYear : 2022
  const maxYear = schedule.length > 0 ? schedule[schedule.length - 1].year : 0
  return Array.from({ length: maxYear }, (_, i) => {
    const y = i + 1
    const yearRows = schedule.filter((s) => s.year === y)
    const last = yearRows[yearRows.length - 1]
    return {
      year: y,
      label: (baseYear + y).toString(),
      principal: yearRows.reduce((a, b) => a + b.principal, 0),
      interest: yearRows.reduce((a, b) => a + b.interest, 0),
      balance: last ? last.balance : 0,
    }
  })
}

export function addWeeks(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n * 7)
  return d
}

export function fmtDate(d) {
  return d.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function fmtCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-NZ')
}

export function fmtCurrencyDec(n, decimals = 2) {
  return (
    '$' +
    n
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  )
}

export function getCurrentWeek(startDate, years) {
  const today = new Date()
  return Math.max(
    0,
    Math.min(
      Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000)),
      years * WEEKS_PER_YEAR
    )
  )
}
