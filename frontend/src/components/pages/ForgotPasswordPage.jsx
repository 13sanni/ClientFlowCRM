import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (_data) => {
    // Backend password-reset email route is scaffolded (PasswordResetToken in schema)
    // When SMTP is configured: await api.post('/auth/forgot-password', data)
    await new Promise((r) => setTimeout(r, 600)) // simulate network
    setSubmitted(true)
  }

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

        {submitted ? (
          <div className="mt-8">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
              <p className="m-0 text-sm font-bold text-emerald-800">Check your inbox</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-emerald-700">
                If <strong>{getValues('email')}</strong> is registered, you'll receive a reset link shortly.
              </p>
            </div>
            <Link
              className="mt-5 block text-center text-xs font-bold text-blue-700 no-underline hover:text-blue-800"
              to="/auth/sign-in"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
                Forgot password
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-900">
                Reset your password
              </h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                Enter your workspace email and we'll send you a reset link.
              </p>
            </div>

            <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="grid gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Work email</span>
                <input
                  className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="text-[10px] font-bold text-red-600">{errors.email.message}</span>
                )}
              </label>

              <button
                className="rounded-md border-0 bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : 'Send reset link'}
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
          </>
        )}
      </section>
    </main>
  )
}

export default ForgotPasswordPage
