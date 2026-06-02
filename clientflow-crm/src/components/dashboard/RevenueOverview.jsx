const revenueData = [
  { month: 'Jan', value: 18 },
  { month: 'Feb', value: 24 },
  { month: 'Mar', value: 22 },
  { month: 'Apr', value: 31 },
  { month: 'May', value: 36 },
  { month: 'Jun', value: 42 },
]

const pipelineStages = [
  { label: 'Qualified', value: '$32,640', percentage: 38, tone: 'blue' },
  { label: 'Proposal', value: '$24,300', percentage: 28, tone: 'green' },
  { label: 'Negotiation', value: '$18,520', percentage: 21, tone: 'amber' },
  { label: 'Closing', value: '$10,960', percentage: 13, tone: 'violet' },
]

const chartPoints = revenueData
  .map(({ value }, index) => {
    const x = 30 + index * 68
    const y = 154 - value * 2.7

    return `${x},${y}`
  })
  .join(' ')

function RevenueOverview() {
  return (
    <section className="revenue-panel" aria-labelledby="revenue-overview-title">
      <div className="revenue-panel__chart">
        <div className="panel-heading">
          <div>
            <p className="panel-heading__eyebrow">Performance</p>
            <h2 id="revenue-overview-title">Revenue overview</h2>
          </div>
          <button className="panel-heading__filter" type="button">
            Last 6 months
            <span aria-hidden="true">&#8964;</span>
          </button>
        </div>

        <div className="revenue-panel__summary">
          <p>$42,860</p>
          <span>+18.4% vs previous period</span>
        </div>

        <div className="revenue-chart">
          <svg
            className="revenue-chart__svg"
            viewBox="0 0 390 190"
            role="img"
            aria-labelledby="revenue-chart-title revenue-chart-description"
          >
            <title id="revenue-chart-title">Monthly revenue trend</title>
            <desc id="revenue-chart-description">
              Revenue increased from eighteen thousand dollars in January to forty-two thousand
              dollars in June.
            </desc>
            {[36, 76, 116, 156].map((y) => (
              <line
                key={y}
                className="revenue-chart__grid-line"
                x1="30"
                x2="370"
                y1={y}
                y2={y}
              />
            ))}
            <polyline className="revenue-chart__line" points={chartPoints} />
            {revenueData.map(({ month, value }, index) => {
              const x = 30 + index * 68
              const y = 154 - value * 2.7

              return (
                <g key={month}>
                  <circle className="revenue-chart__point" cx={x} cy={y} r="4" />
                  <text className="revenue-chart__month" x={x} y="182" textAnchor="middle">
                    {month}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="pipeline-summary">
        <div className="pipeline-summary__heading">
          <p className="panel-heading__eyebrow">Sales pipeline</p>
          <h2>$86,420</h2>
          <span>32 open deals</span>
        </div>

        <div className="pipeline-summary__stages">
          {pipelineStages.map((stage) => (
            <div className="pipeline-stage" key={stage.label}>
              <div className="pipeline-stage__details">
                <p>
                  <span
                    className={`pipeline-stage__dot pipeline-stage__dot--${stage.tone}`}
                    aria-hidden="true"
                  />
                  {stage.label}
                </p>
                <span>{stage.value}</span>
              </div>
              <div className="pipeline-stage__track">
                <span
                  className={`pipeline-stage__progress pipeline-stage__progress--${stage.tone}`}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RevenueOverview
