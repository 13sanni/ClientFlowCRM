const notificationSettings = [
  'Deal stage changes',
  'Task assignments',
  'Invoice payment updates',
]

function SettingsPage() {
  return (
    <main className="px-10 py-9 max-[520px]:px-6 max-[520px]:py-7">
      <div className="flex items-start justify-between gap-4 max-[520px]:flex-col">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Workspace admin
          </p>
          <h1 className="mt-2 text-[29px] font-bold tracking-normal text-slate-900">Settings</h1>
        </div>
        <button
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
          type="button"
        >
          Save changes
        </button>
      </div>

      <section className="mt-6 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 max-[1100px]:grid-cols-1">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Profile
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Account details</h2>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Full name</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="text"
                defaultValue="Jordan Davis"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Email</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="email"
                defaultValue="jordan@clientflow.io"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Role</span>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300">
                <option>Workspace admin</option>
                <option>Sales manager</option>
                <option>Sales rep</option>
              </select>
            </label>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Company
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Workspace settings</h2>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Workspace name</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="text"
                defaultValue="Acme Studio"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Default currency</span>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300">
                <option>USD</option>
                <option>EUR</option>
                <option>INR</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Timezone</span>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300">
                <option>Asia/Calcutta</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </label>
          </div>
        </article>
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1fr)_300px] gap-4 max-[1100px]:grid-cols-1">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Notifications
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Alert preferences</h2>

          <div className="mt-5 grid gap-3">
            {notificationSettings.map((setting) => (
              <label
                className="flex items-center justify-between gap-4 rounded-md border border-slate-100 px-3 py-3"
                key={setting}
              >
                <span className="text-xs font-bold text-slate-600">{setting}</span>
                <input className="h-4 w-4 accent-blue-600" type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="m-0 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            Security
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-700">Access controls</h2>

          <div className="mt-5 grid gap-3">
            <div className="rounded-md border border-slate-100 p-3">
              <p className="m-0 text-xs font-bold text-slate-700">Two-factor auth</p>
              <span className="mt-1 block text-[11px] font-semibold text-slate-400">Not enabled</span>
            </div>
            <div className="rounded-md border border-slate-100 p-3">
              <p className="m-0 text-xs font-bold text-slate-700">Active sessions</p>
              <span className="mt-1 block text-[11px] font-semibold text-slate-400">3 devices</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default SettingsPage
