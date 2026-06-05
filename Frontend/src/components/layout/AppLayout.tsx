import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import Topbar from './Topbar'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back — here\'s your debugging overview' },
  '/debug': { title: 'Debug Workspace', subtitle: 'Paste code, analyze errors, get AI-powered fixes' },
  '/history': { title: 'Error History', subtitle: 'All past debug sessions and resolved issues' },
  '/settings': { title: 'Settings', subtitle: 'Configure your preferences and API keys' },
}

export default function AppLayout() {
  const location = useLocation()
  const meta = pageTitles[location.pathname] || { title: 'DebugMind AI', subtitle: '' }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
