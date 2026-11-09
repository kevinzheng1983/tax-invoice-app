import { formatCurrency } from "@/lib/format";

export function MonthlyIncomeChart({ months }: { months: { month: string; amount: number }[] }) {
  const maximum = Math.max(100, ...months.map((month) => month.amount));
  const step = 10 ** Math.floor(Math.log10(maximum));
  const ceiling = Math.ceil(maximum / step) * step;
  const compact = (amount: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", notation: "compact", maximumFractionDigits: 1 }).format(amount);
  const currentMonth = months[months.length - 1];
  return <section className="income-chart" aria-label="Monthly invoice totals for the last six months">
    <div className="income-chart-heading"><h2>Monthly income</h2><span>Last 6 months</span></div>
    <p className="income-chart-subtitle">Invoice totals · AUD</p>
    <svg viewBox="0 0 360 220" role="img" aria-labelledby="income-chart-title">
      <title id="income-chart-title">{months.map((month) => `${month.month}: ${formatCurrency(month.amount)}`).join(", ")}</title>
      {[0, 0.5, 1].map((fraction) => <g key={fraction}>
        <line x1="44" x2="354" y1={180 - fraction * 140} y2={180 - fraction * 140} stroke="#e1e6e3"/>
        <text x="37" y={184 - fraction * 140} textAnchor="end" className="chart-axis">{compact(ceiling * fraction)}</text>
      </g>)}
      {months.map((month, index) => {
        const x = 50 + index * 51;
        const height = month.amount / ceiling * 140;
        const label = new Intl.DateTimeFormat("en-AU", { month: "short", timeZone: "UTC" }).format(new Date(`${month.month}-01T00:00:00Z`));
        return <g key={month.month}><title>{label} {month.month.slice(0, 4)}: {formatCurrency(month.amount)}</title>
          <rect x={x} y={180 - height} width="35" height={height} rx="4" fill={index === months.length - 1 ? "#087a49" : "#a8dfbe"}/>
          <text x={x + 17.5} y={Math.max(20, 172 - height)} textAnchor="middle" className="chart-value">{compact(month.amount)}</text>
          <text x={x + 17.5} y="203" textAnchor="middle" className="chart-axis">{label}</text>
        </g>;
      })}
    </svg>
    <p className="chart-caption">{new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${currentMonth.month}-01T00:00:00Z`))} · Month to date</p>
  </section>;
}
