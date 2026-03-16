# Mortgage Dashboard

An interactive mortgage dashboard built with React + Vite.

## Loan Details

| Setting | Value |
|---|---|
| Principal | $490,000 |
| Annual Rate | 2.00% |
| Term | 20 years |
| Start Date | 21 June 2023 |
| Frequency | Weekly |

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Install & Run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder — ready to deploy to any static host.

## Deployment Options

### Netlify (easiest)
1. Run `npm run build`
2. Drag and drop the `dist/` folder at [app.netlify.com/drop](https://app.netlify.com/drop)

### Vercel
```bash
npx vercel
```

### GitHub Pages
Push to GitHub, then enable Pages in repo settings pointing at the `dist/` branch via GitHub Actions.

## Customising the Loan

Edit `src/utils/mortgage.js` and update `MORTGAGE_CONFIG`:

```js
export const MORTGAGE_CONFIG = {
  principal: 490000,       // Starting loan amount
  annualRate: 0.02,        // 2% = 0.02
  years: 20,               // Loan term in years
  startDate: new Date(2023, 5, 21),  // Month is 0-indexed (5 = June)
}
```

## Project Structure

```
src/
├── utils/
│   └── mortgage.js          # All loan calculations
├── components/
│   ├── MetricCard.jsx        # Summary stat cards
│   ├── ProgressBar.jsx       # Loan payoff progress
│   ├── SplitBar.jsx          # Principal vs interest split
│   ├── BalanceChart.jsx      # Interactive chart with year slider
│   └── AmortizationTable.jsx # Full payment schedule table
├── App.jsx                   # Main layout
├── App.module.css
└── index.css                 # Global styles & CSS variables
```
