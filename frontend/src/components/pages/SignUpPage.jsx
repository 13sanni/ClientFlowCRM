import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email').toLowerCase(),
  workspaceName: z.string().trim().min(2, 'Workspace name required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function SignUpPage() {
  const navigate = useNavigate()
  const register = useAuthStore(state => state.register)
  const [serverError, setServerError] = useState(null)
  
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', workspaceName: '', password: '' }
  })

  const onSubmit = async (data) => {
    setServerError(null)
    const result = await register(data)
    if (result.success) {
      navigate('/')
    } else {
      setServerError(result.error)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[minmax(420px,1.05fr)_minmax(0,0.95fr)] bg-slate-50 max-[900px]:grid-cols-1">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px] rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div>
            <p className="m-0 text-xs font-bold uppercase tracking-normal text-slate-500">
              Start workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-normal text-slate-900">Create account</h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Set up your CRM workspace and invite your team later.
            </p>
          </div>

          {serverError && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Full name</span>
              <input
                className={cn("rounded-md border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300", errors.name ? "border-red-300" : "border-slate-200")}
                type="text"
                placeholder="Jordan Davis"
                {...formRegister('name')}
              />
              {errors.name && <span className="text-[10px] text-red-600">{errors.name.message}</span>}
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Work email</span>
              <input
                className={cn("rounded-md border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300", errors.email ? "border-red-300" : "border-slate-200")}
                type="email"
                placeholder="jordan@company.com"
                {...formRegister('email')}
              />
              {errors.email && <span className="text-[10px] text-red-600">{errors.email.message}</span>}
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Workspace name</span>
              <input
                className={cn("rounded-md border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300", errors.workspaceName ? "border-red-300" : "border-slate-200")}
                type="text"
                placeholder="Acme Studio"
                {...formRegister('workspaceName')}
              />
              {errors.workspaceName && <span className="text-[10px] text-red-600">{errors.workspaceName.message}</span>}
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Password</span>
              <input
                className={cn("rounded-md border bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-300", errors.password ? "border-red-300" : "border-slate-200")}
                type="password"
                placeholder="Create password"
                {...formRegister('password')}
              />
              {errors.password && <span className="text-[10px] text-red-600">{errors.password.message}</span>}
            </label>

            <button
              className="mt-2 rounded-md border-0 bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating workspace...' : 'Create workspace'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs font-semibold text-slate-500">
            Already have an account?{' '}
            <Link className="font-bold text-blue-700 no-underline hover:text-blue-800" to="/auth/sign-in">
              Sign in
            </Link>
          </p>
        </div>
      </section>

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
            Built for growing sales teams
          </p>
          <h2 className="mt-3 max-w-lg text-[42px] font-bold leading-tight tracking-normal">
            Launch a cleaner CRM workflow without spreadsheet drift.
          </h2>
          <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-slate-400">
            Track clients, deals, invoices, and work queues from a single operational dashboard.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Role controls', 'Reports', 'Task queues'].map((item) => (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3" key={item}>
              <p className="m-0 text-xs font-bold text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default SignUpPage
