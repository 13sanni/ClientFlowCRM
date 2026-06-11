import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ActivityPanels from './components/dashboard/ActivityPanels'
import MetricCard from './components/dashboard/MetricCard'
import RecentClients from './components/dashboard/RecentClients'
import RevenueOverview from './components/dashboard/RevenueOverview'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import ClientsPage from './components/pages/ClientsPage'
import DealsPage from './components/pages/DealsPage'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'
import HelpCenterPage from './components/pages/HelpCenterPage'
import InvoicesPage from './components/pages/InvoicesPage'
import ReportsPage from './components/pages/ReportsPage'
import SettingsPage from './components/pages/SettingsPage'
import SignInPage from './components/pages/SignInPage'
import SignUpPage from './components/pages/SignUpPage'
import TasksPage from './components/pages/TasksPage'
import { useAuthStore } from './store/authStore'
import { api } from './lib/api'

// ─── Auth Guard ────────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="text-xs font-semibold text-slate-400">Loading workspace…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return children
}

// ─── App Router ────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

// ─── Dashboard Shell ───────────────────────────────────────────────────────────
function DashboardShell() {
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
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────
function DashboardPage() {
  const [metrics, setMetrics] = useState([
    { label: 'Total clients', value: '-', change: '-', trend: 'none', tone: 'blue' },
    { label: 'Pipeline value', value: '-', change: '-', trend: 'none', tone: 'green' },
    { label: 'Tasks due', value: '-', change: '-', trend: 'none', tone: 'amber' },
    { label: 'Conversion rate', value: '-', change: '-', trend: 'none', tone: 'violet' },
  ])

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [clientsRes, dealsRes, tasksRes] = await Promise.all([
          api.get('/clients?page=1&pageSize=1'),
          api.get('/deals?page=1&pageSize=1000'),
          api.get('/tasks?page=1&pageSize=1000&status=TODO,IN_PROGRESS,IN_REVIEW')
        ])

        const totalClients = clientsRes.pagination?.total || 0
        const totalPipelineValue = dealsRes.items?.reduce((sum, d) => sum + (d.value || 0), 0) || 0
        const totalTasks = tasksRes.pagination?.total || 0

        // Simple win rate from deals
        const allDeals = dealsRes.items || []
        const wonDeals = allDeals.filter(d => d.status === 'WON').length
        const convRate = allDeals.length > 0 ? ((wonDeals / allDeals.length) * 100).toFixed(1) : '0.0'

        setMetrics([
          { label: 'Total clients', value: totalClients.toString(), change: '-', trend: 'none', tone: 'blue' },
          { label: 'Pipeline value', value: `$${(totalPipelineValue / 1000).toFixed(1)}k`, change: '-', trend: 'none', tone: 'green' },
          { label: 'Tasks due', value: totalTasks.toString(), change: '-', trend: 'none', tone: 'amber' },
          { label: 'Conversion rate', value: `${convRate}%`, change: '-', trend: 'none', tone: 'violet' },
        ])
      } catch (err) {
        console.error('Failed to load dashboard metrics', err)
      }
    }
    loadMetrics()
  }, [])

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
