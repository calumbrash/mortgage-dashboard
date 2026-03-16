import { useState, useMemo, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
} from 'chart.js'
import styles from './BalanceChart.module.css'
import { fmtDate } from '../utils/mortgage'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip)

export default function BalanceChart({ schedule, years, startYear }) {
  const [chartMode, setChartMode] = useState('balance')
  const currentYearIndex = Math.min(Math.max(new Date().getFullYear() - startYear, 0), years - 1)
  const [sliderYear, setSliderYear] = useState(currentYearIndex)

  useEffect(() => {
    setSliderYear(Math.min(Math.max(new Date().getFullYear() - startYear, 0), years - 1))
  }, [startYear, years])

  const yearData = useMemo(() => {
    const y = sliderYear + 1
    return schedule.filter((s) => s.year === y)
  }, [schedule, sliderYear])

  const labels = useMemo(() => yearData.map((s) => fmtDate(s.date)), [yearData])

  const chartData = useMemo(() => {
    if (chartMode === 'balance') {
      return {
        labels,
        datasets: [
          {
            label: 'Balance',
            data: yearData.map((s) => Math.round(s.balance)),
            borderColor: '#1D9E75',
            backgroundColor: 'rgba(29,158,117,0.08)',
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            tension: 0.3,
          },
        ],
      }
    }
    return {
      labels,
      datasets: [
        {
          label: 'Principal',
          data: yearData.map((s) => parseFloat(s.principal.toFixed(2))),
          backgroundColor: '#1D9E75',
          borderRadius: 2,
        },
        {
          label: 'Interest',
          data: yearData.map((s) => parseFloat(s.interest.toFixed(2))),
          backgroundColor: '#F0997B',
          borderRadius: 2,
        },
      ],
    }
  }, [chartMode, yearData, labels])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        stacked: chartMode === 'breakdown',
        ticks: { maxTicksLimit: 6, color: '#888', font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        stacked: chartMode === 'breakdown',
        ticks: {
          color: '#888',
          font: { size: 10 },
          callback: (v) =>
            chartMode === 'balance'
              ? '$' + (v / 1000).toFixed(0) + 'k'
              : '$' + v.toFixed(0),
        },
        grid: { color: 'rgba(128,128,128,0.1)' },
      },
    },
  }), [chartMode])

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Balance over time</span>
          <span className={styles.badge}>{startYear + sliderYear}</span>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${chartMode === 'balance' ? styles.active : ''}`}
            onClick={() => setChartMode('balance')}
          >
            Balance
          </button>
          <button
            className={`${styles.tab} ${chartMode === 'breakdown' ? styles.active : ''}`}
            onClick={() => setChartMode('breakdown')}
          >
            Principal / Interest
          </button>
        </div>
      </div>

      <div className={styles.chartArea}>
        {chartMode === 'balance' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      <div className={styles.sliderWrap}>
        <input
          type="range"
          min={0}
          max={years - 1}
          value={sliderYear}
          step={1}
          onChange={(e) => setSliderYear(Number(e.target.value))}
        />
        <div className={styles.sliderLabels}>
          <span>{startYear}</span>
          <span>{startYear + 5}</span>
          <span>{startYear + 10}</span>
          <span>{startYear + 15}</span>
          <span>{startYear + years}</span>
        </div>
      </div>

      <div className={styles.legend}>
        {chartMode === 'breakdown' && (
          <>
            <span>
              <span className={styles.legendDot} style={{ background: '#1D9E75' }} />
              Principal
            </span>
            <span>
              <span className={styles.legendDot} style={{ background: '#F0997B' }} />
              Interest
            </span>
          </>
        )}
      </div>
    </div>
  )
}
