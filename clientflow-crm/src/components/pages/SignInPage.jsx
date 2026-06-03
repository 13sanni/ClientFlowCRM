import { useState } from 'react'
import { Link } from 'react-router-dom'
import ActionModal from '../common/ActionModal'

function SignInPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  return (
    <main className="grid min-h-screen grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] bg-slate-50 max-[900px]:grid-cols-1">
      <section className="flex flex-col justify-between bg-slate-950 px-10 py-9 text-white max-[900px]:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-lg font-bold">C</span>
          <div>
            <p className="m-0 text-base font-bold">ClientFlow</p>
            <p className="m-0 text-xs text-slate-400">CRM workspace</p>
          </div>
        </div>

        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-blue-300">
            Sales operations dashboard
          </p>
          <h1 className="mt-3 max-w-lg text-[42px] font-bold leading-tight tracking-normal">
            Manage clients, deals, tasks, and revenue from one workspace.
          </h1>
          <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-slate-400">
            A focused CRM dashboard for teams that need pipeline visibility and operational control.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['RBAC ready', 'Pipeline views', 'Activity logs'].map((item) => (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3" key={item}>
              <p className="m-0 text-xs font-bold text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px] rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Use your workspace credentials to continue.
            </p>
          </div>

          <form className="mt-7 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Email</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="email"
                placeholder="jordan@clientflow.io"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Password</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="password"
                placeholder="Enter password"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <input className="h-4 w-4 accent-blue-600" type="checkbox" />
                Remember me
              </label>
              <Link className="text-xs font-bold text-blue-700 no-underline hover:text-blue-800" to="/auth/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              className="mt-2 rounded-md border-0 bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
              type="button"
              onClick={() => setIsDemoOpen(true)}
            >
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center text-xs font-semibold text-slate-500">
            New to ClientFlow?{' '}
            <Link className="font-bold text-blue-700 no-underline hover:text-blue-800" to="/auth/sign-up">
              Create account
            </Link>
          </p>
        </div>
      </section>

      {isDemoOpen && (
        <ActionModal
          title="Sign in preview"
          description="The sign-in UI is ready. Real authentication will be connected when the backend is added."
          primaryLabel="Got it"
          onClose={() => setIsDemoOpen(false)}
        >
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="m-0 text-sm font-bold text-blue-800">Next backend step: JWT + HTTP-only cookies.</p>
          </div>
        </ActionModal>
      )}
    </main>
  )
}

export default SignInPage
