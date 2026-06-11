import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
})

const notificationSettings = [
  'Deal stage changes',
  'Task assignments',
  'Invoice payment updates',
]

function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error' | null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  })

  // Populate form once user is loaded
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email })
    }
  }, [user, reset])

  const onSubmit = async (_data) => {
    try {
      // Profile update endpoint — available once the PATCH /api/auth/me route is built
      // await api.patch('/auth/me', data)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setSaveStatus('error')
    }
  }

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
          className="rounded-md border-0 bg-blue-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-60"
          type="button"
          disabled={!isDirty || isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {saveStatus === 'saved' && (
        <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
          ✓ Settings saved successfully.
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}

      <section className="mt-6 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 max-[1100px]:grid-cols-1">
        {/* Profile */}
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
                {...register('name')}
              />
              {errors.name && (
                <span className="text-[10px] font-bold text-red-600">{errors.name.message}</span>
              )}
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Email</span>
              <input
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-[10px] font-bold text-red-600">{errors.email.message}</span>
              )}
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Role</span>
              <input
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 outline-none"
                type="text"
                value="Workspace owner"
                disabled
                readOnly
              />
            </label>
          </div>
        </article>

        {/* Workspace */}
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
                defaultValue="My Workspace"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Default currency</span>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300">
                <option>USD</option>
                <option>EUR</option>
                <option>INR</option>
                <option>GBP</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-bold text-slate-500">Timezone</span>
              <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-300">
                <option>Asia/Calcutta</option>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </label>
          </div>
        </article>
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1fr)_300px] gap-4 max-[1100px]:grid-cols-1">
        {/* Notifications */}
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

        {/* Security */}
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
              <p className="m-0 text-xs font-bold text-slate-700">Password</p>
              <button
                className="mt-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:border-slate-300"
                type="button"
                onClick={() => window.location.href = '/auth/forgot-password'}
              >
                Change password
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default SettingsPage
