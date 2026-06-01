import './App.css'
import Sidebar from './components/layout/Sidebar'

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <p className="app-content__eyebrow">Workspace overview</p>
        <h1>Dashboard</h1>
      </main>
    </div>
  )
}

export default App
