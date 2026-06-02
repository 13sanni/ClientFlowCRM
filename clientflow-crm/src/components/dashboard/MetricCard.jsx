function MetricCard({ label, value, change, trend, tone }) {
  const trendLabel = trend === 'up' ? 'Increased' : 'Decreased'

  return (
    <article className="metric-card">
      <div className="metric-card__header">
        <p>{label}</p>
        <span className={`metric-card__marker metric-card__marker--${tone}`} aria-hidden="true" />
      </div>
      <p className="metric-card__value">{value}</p>
      <p className={`metric-card__trend metric-card__trend--${trend}`}>
        <span aria-hidden="true">{trend === 'up' ? '+' : '-'}</span>
        {change}
        <span className="metric-card__trend-label">{trendLabel} vs last month</span>
      </p>
    </article>
  )
}

export default MetricCard
