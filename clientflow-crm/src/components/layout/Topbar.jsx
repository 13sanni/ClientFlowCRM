import { Bell, ChevronDown, Menu, Search } from 'lucide-react'

function Topbar({ onOpenSidebar }) {
  return (
    <header className="flex h-[68px] items-center gap-4 border-b border-slate-200 bg-white px-7 max-[520px]:gap-3 max-[520px]:px-4">
      <button
        className="hidden border-0 bg-transparent p-0 text-slate-500 max-[520px]:block"
        type="button"
        aria-label="Open navigation"
        onClick={onOpenSidebar}
      >
        <Menu size={20} strokeWidth={2} />
      </button>

      <label className="flex w-[min(440px,100%)] items-center gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-300 focus-within:bg-white">
        <Search size={16} strokeWidth={2} className="text-slate-400" aria-hidden="true" />
        <span className="sr-only">Search clients, deals, or tasks</span>
        <input
          className="w-full border-0 bg-transparent py-2.5 text-xs text-slate-700 outline-none placeholder:text-slate-400"
          type="search"
          placeholder="Search clients, deals, or tasks"
        />
      </label>

      <div className="ml-auto flex items-center gap-3.5 max-[520px]:gap-1.5">
        <button
          className="relative grid h-8 w-8 place-items-center rounded-md border-0 bg-transparent text-slate-500 hover:bg-slate-100"
          type="button"
          aria-label="View notifications"
        >
          <Bell size={17} strokeWidth={2} aria-hidden="true" />
          <span className="absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
        </button>
        <button
          className="flex items-center gap-2 border-0 bg-transparent text-xs font-bold text-slate-600"
          type="button"
          aria-label="Open user menu"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-[10px] font-bold text-stone-700">
            JD
          </span>
          <span className="max-[520px]:hidden">Jordan Davis</span>
          <ChevronDown
            size={15}
            strokeWidth={2}
            className="text-slate-400 max-[520px]:hidden"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  )
}

export default Topbar
