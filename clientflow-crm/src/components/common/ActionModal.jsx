function ActionModal({ children, description, onClose, primaryLabel = 'Save', title }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="m-0 text-lg font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">{description}</p>
          )}
        </div>
        <div className="grid gap-4 px-5 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            className="rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-300"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
            type="button"
            onClick={onClose}
          >
            {primaryLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ActionModal
