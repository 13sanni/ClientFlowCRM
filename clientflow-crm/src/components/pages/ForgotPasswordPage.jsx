import { useState } from 'react'
import { Link } from 'react-router-dom'
import ActionModal from '../common/ActionModal'

function ForgotPasswordPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <section className="w-full max-w-[430px] rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-lg font-bold text-white">
            C
          </span>
          <div>
            <p className="m-0 text-base font-bold text-slate-900">ClientFlow</p>
            <p className="m-0 text-xs font-semibold text-slate-400">Account recovery</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
            Forgot password
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
            Enter your workspace email and we will send reset instructions when backend email is connected.
          </p>
        </div>

        <form className="mt-7 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Work email</span>
            <input
              className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
              type="email"
              placeholder="jordan@company.com"
            />
          </label>

          <button
            className="rounded-md border-0 bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
            type="button"
            onClick={() => setIsDemoOpen(true)}
          >
            Send reset link
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-xs font-semibold">
          <Link className="font-bold text-blue-700 no-underline hover:text-blue-800" to="/auth/sign-in">
            Back to sign in
          </Link>
          <Link className="font-bold text-slate-500 no-underline hover:text-slate-700" to="/auth/sign-up">
            Create account
          </Link>
        </div>
      </section>

      {isDemoOpen && (
        <ActionModal
          title="Password reset preview"
          description="The recovery UI is ready. Email delivery will be connected through the backend later."
          primaryLabel="Got it"
          onClose={() => setIsDemoOpen(false)}
        >
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="m-0 text-sm font-bold text-blue-800">Next backend step: reset tokens and email queue.</p>
          </div>
        </ActionModal>
      )}
    </main>
  )
}

export default ForgotPasswordPage
