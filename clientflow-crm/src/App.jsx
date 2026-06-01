import { useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

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
        </main>
      </div>
    </div>
  )
}

export default App
