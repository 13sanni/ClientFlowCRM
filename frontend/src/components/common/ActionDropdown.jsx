import { useState } from 'react'
import { cn } from '../../lib/utils'

function ActionDropdown({ align = 'right', buttonClassName = '', children, containerClassName = '', label }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative inline-flex', containerClassName)}>
      <button
        className={cn(
          'rounded-md border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-500 hover:border-slate-300',
          buttonClassName,
        )}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>

      {open && (
        <div
          className={cn(
            'absolute top-10 z-30 w-52 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-lg',
            align === 'left' ? 'left-0' : 'right-0',
          )}
          onClick={(event) => {
            if (event.target.closest('button,a')) {
              setOpen(false)
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ActionDropdown
