import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ActivityPanels from './components/dashboard/ActivityPanels'
import MetricCard from './components/dashboard/MetricCard'
import RecentClients from './components/dashboard/RecentClients'
import RevenueOverview from './components/dashboard/RevenueOverview'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import ClientsPage from './components/pages/ClientsPage'
import DealsPage from './components/pages/DealsPage'
import InvoicesPage from './components/pages/InvoicesPage'
import TasksPage from './components/pages/TasksPage'

const metrics = [
  { label: 'Total clients', value: '1,284', change: '12.5%', trend: 'up', tone: 'blue' },
  { label: 'Pipeline value', value: '$86,420', change: '8.2%', trend: 'up', tone: 'green' },
  { label: 'Tasks due', value: '24', change: '4.1%', trend: 'down', tone: 'amber' },
  { label: 'Conversion rate', value: '28.6%', change: '3.7%', trend: 'up', tone: 'violet' },
]

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
        Workspace overview
      </p>
      <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Dashboard</h1>
      <section
        className="mt-6 grid grid-cols-4 gap-3.5 max-[520px]:grid-cols-1 min-[521px]:max-[1100px]:grid-cols-2"
        aria-label="CRM metrics"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
      <RevenueOverview />
      <RecentClients />
      <ActivityPanels />
    </main>
  )
}

export default App
