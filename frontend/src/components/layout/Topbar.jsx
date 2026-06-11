import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Search, Settings } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { api } from '../../lib/api'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Topbar({ onOpenSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await api.get('/notifications')
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } catch (err) {
        console.error('Failed to load notifications', err)
      }
    }
    if (user) {
      loadNotifications()
    }
  }, [user])

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      setIsNotificationsOpen(false)
    } catch (err) {
      console.error('Failed to mark notifications read', err)
    }
  }

  const handleLogout = async () => {
    setIsProfileOpen(false)
    await logout()
    navigate('/auth/sign-in')
  }

  const displayName = user?.name || 'User'
  const displayEmail = user?.email || ''
  const initials = getInitials(displayName)

  return (
    <header className="glass-panel sticky top-0 z-10 flex h-[68px] items-center gap-4 px-7 max-[520px]:gap-3 max-[520px]:px-4">
      <button
        className="hidden border-0 bg-transparent p-0 text-slate-500 max-[520px]:block"
        type="button"
        aria-label="Open navigation"
        onClick={onOpenSidebar}
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* ── Search ── */}
      <div className="relative w-[min(440px,100%)]">
        <label className="flex items-center gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-300 focus-within:bg-white">
          <Search size={16} strokeWidth={2} className="text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search clients, deals, or tasks</span>
          <input
            className="w-full border-0 bg-transparent py-2.5 text-xs text-slate-700 outline-none placeholder:text-slate-400"
            type="search"
            placeholder="Search clients, deals, or tasks"
            onFocus={() => setIsSearchOpen(true)}
          />
        </label>

        {isSearchOpen && (
          <div className="absolute left-0 top-11 z-30 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <div className="flex items-center justify-between px-2 py-2">
              <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
                Quick search
              </p>
              <button
                className="border-0 bg-transparent text-[11px] font-bold text-slate-400"
                type="button"
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="px-2 py-3 text-xs font-semibold text-slate-400">
              Start typing to search across clients, deals, and tasks.
            </p>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3.5 max-[520px]:gap-1.5">
        {/* ── Notifications ── */}
        <div className="relative">
          <button
            className="relative grid h-8 w-8 place-items-center rounded-md border-0 bg-transparent text-slate-500 hover:bg-slate-100"
            type="button"
            aria-expanded={isNotificationsOpen}
            aria-label="View notifications"
            onClick={() => setIsNotificationsOpen((open) => !open)}
          >
            <Bell size={17} strokeWidth={2} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-10 z-30 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-2 py-2">
                <p className="m-0 text-xs font-bold text-slate-700">Notifications</p>
                <button
                  className="border-0 bg-transparent text-[11px] font-bold text-blue-700"
                  type="button"
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              </div>
                {notifications.length === 0 && (
                  <p className="p-2 text-xs text-slate-500 text-center">No notifications</p>
                )}
                {notifications.map((notification) => (
                  <button
                    className={`rounded-md border-0 bg-transparent px-2 py-2 text-left hover:bg-slate-100 ${notification.isRead ? 'opacity-70' : ''}`}
                    key={notification.id}
                    type="button"
                    onClick={async () => {
                      if (!notification.isRead) {
                        try {
                          await api.patch(`/notifications/${notification.id}/read`)
                          setUnreadCount(prev => Math.max(0, prev - 1))
                          setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n))
                        } catch (err) {}
                      }
                      setIsNotificationsOpen(false)
                    }}
                  >
                    <span className="block text-xs font-bold text-slate-700">
                      {notification.title}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {notification.body || notification.detail}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── User Menu ── */}
        <div className="relative">
          <button
            className="flex items-center gap-2 border-0 bg-transparent text-xs font-bold text-slate-600"
            type="button"
            aria-expanded={isProfileOpen}
            aria-label="Open user menu"
            onClick={() => setIsProfileOpen((open) => !open)}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
              {initials}
            </span>
            <span className="max-[520px]:hidden">{displayName}</span>
            <ChevronDown
              size={15}
              strokeWidth={2}
              className="text-slate-400 max-[520px]:hidden"
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-10 z-30 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-2 py-2">
                <p className="m-0 text-xs font-bold text-slate-700">{displayName}</p>
                <span className="text-[11px] font-semibold text-slate-400">{displayEmail}</span>
              </div>

              <nav className="mt-2 grid gap-1" aria-label="User menu">
                <Link
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-xs font-bold text-slate-600 no-underline hover:bg-slate-100"
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings size={15} strokeWidth={2} />
                  Profile settings
                </Link>
                <button
                  className="flex items-center gap-2 rounded-md border-0 bg-transparent px-2 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={15} strokeWidth={2} />
                  Log out
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
