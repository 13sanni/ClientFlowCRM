import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'

const navigationItems = [
  { label: 'Overview', path: '/' },
  { label: 'Clients', path: '/clients' },
  { label: 'Deals', path: '/deals' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'Invoices', path: '/invoices' },
  { label: 'Reports', path: '/reports' },
]

const secondaryItems = [
  { label: 'Settings', path: '/', enabled: false },
  { label: 'Help center', path: '/', enabled: false },
]

function NavigationLink({ item, onClose }) {
  return (
    <NavLink
      className={({ isActive }) => {
        const active = item.enabled === false ? false : isActive

        return cn(
          'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-[13px] font-semibold text-slate-500 no-underline transition hover:bg-slate-100 hover:text-slate-700',
          active && 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700',
        )
      }}
      to={item.path}
      end={item.path === '/'}
      onClick={onClose}
    >
      {({ isActive }) => {
        const active = item.enabled === false ? false : isActive

        return (
          <>
            <span
              className={cn(
                'h-[7px] w-[7px] rounded-full border border-slate-300',
                active && 'border-blue-600 bg-blue-600',
              )}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </>
        )
      }}
    </NavLink>
  )
}

function Sidebar({ open = false, onClose }) {
  return (
    <>
      <button
        className={cn(
          'fixed inset-0 z-10 hidden border-0 bg-slate-950/40 max-[520px]:block',
          !open && 'max-[520px]:hidden',
        )}
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside
        className={cn(
          'flex min-h-screen w-[264px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 pb-5 pt-6 max-[520px]:fixed max-[520px]:inset-y-0 max-[520px]:left-0 max-[520px]:z-20 max-[520px]:w-[min(264px,calc(100vw-40px))] max-[520px]:transition-transform',
          open ? 'max-[520px]:translate-x-0' : 'max-[520px]:-translate-x-full',
        )}
      >
        <div className="flex items-center gap-2.5 px-1.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-700 text-[17px] font-bold text-white">
            C
          </span>
          <div>
            <p className="m-0 text-[15px] font-bold text-slate-900">ClientFlow</p>
            <p className="mt-0.5 text-[11px] text-slate-400">CRM workspace</p>
          </div>
          <button
            className="ml-auto hidden border-0 bg-transparent text-slate-500 max-[520px]:block"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <button
          className="mt-6 flex w-full cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white p-2 text-left text-slate-900 transition hover:border-slate-300"
          type="button"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-emerald-50 text-xs font-bold text-emerald-700">
            A
          </span>
          <span className="grid min-w-0 flex-1 gap-0.5">
            <span className="text-xs font-bold text-slate-700">Acme Studio</span>
            <span className="text-[11px] text-slate-400">Business plan</span>
          </span>
          <span className="text-base leading-none text-slate-400" aria-hidden="true">
            &#8964;
          </span>
        </button>

        <nav className="mt-7 grid gap-1" aria-label="Main navigation">
          <p className="m-0 px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Workspace
          </p>
          {navigationItems.map((item) => (
            <NavigationLink key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>

        <nav className="mt-auto grid gap-1 pt-7" aria-label="Support">
          {secondaryItems.map((item) => (
            <NavigationLink key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 px-1 pt-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-100 text-[10px] font-bold text-stone-700">
            JD
          </span>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-xs font-bold text-slate-700">Jordan Davis</p>
            <span className="text-[11px] text-slate-400">Workspace admin</span>
          </div>
          <button
            className="border-0 bg-transparent text-[15px] leading-none text-slate-400"
            type="button"
            aria-label="Open profile menu"
          >
            ...
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
