import { useState } from 'react'
import './App.css'
import ActivityPanels from './components/dashboard/ActivityPanels'
import MetricCard from './components/dashboard/MetricCard'
import RecentClients from './components/dashboard/RecentClients'
import RevenueOverview from './components/dashboard/RevenueOverview'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

const metrics = [
  { label: 'Total clients', value: '1,284', change: '12.5%', trend: 'up', tone: 'blue' },
  { label: 'Pipeline value', value: '$86,420', change: '8.2%', trend: 'up', tone: 'green' },
  { label: 'Tasks due', value: '24', change: '4.1%', trend: 'down', tone: 'amber' },
  { label: 'Conversion rate', value: '28.6%', change: '3.7%', trend: 'up', tone: 'violet' },
]

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="app-main">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="app-content">
          <p className="app-content__eyebrow">Workspace overview</p>
          <h1>Dashboard</h1>
          <section className="metrics-grid" aria-label="CRM metrics">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>
          <RevenueOverview />
          <RecentClients />
          <ActivityPanels />
        </main>
      </div>
    </div>
  )
}

export default App
