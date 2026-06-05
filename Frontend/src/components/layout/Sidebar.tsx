import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, LayoutDashboard, History, Settings,
  LogOut, Zap, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import { useAuthStore } from '../../store'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/debug', icon: Bug, label: 'Analyze Error' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex flex-col h-screen shrink-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(13,21,40,0.98) 0%, rgba(8,13,26,0.98) 100%)',
        borderRight: '1px solid rgba(99,102,241,0.12)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-lg animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', filter: 'blur(8px)', opacity: 0.4, zIndex: -1 }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-sm whitespace-nowrap"
              style={{ fontFamily: 'Syne', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              DebugMind AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}
              >
                <Icon
                  size={16}
                  style={{ color: isActive ? '#6366f1' : '#475569' }}
                  className="shrink-0 transition-colors group-hover:text-indigo-400"
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm whitespace-nowrap"
                      style={{ color: isActive ? '#f1f5f9' : '#94a3b8' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1 h-4 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-2 pb-4 space-y-1 border-t pt-3" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 rounded-lg mb-2"
              style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#f1f5f9' }}>{user.name || user.email}</p>
                  <p className="text-xs truncate" style={{ color: '#475569' }}>{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ x: 2 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
          style={{ color: '#475569' }}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Collapse button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all"
        style={{
          background: '#0d1528',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#6366f1',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  )
}
