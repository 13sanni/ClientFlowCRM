import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Copy, Check, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function DemoCredentialsCard({ onFill, mode = 'signin' }) {
  const [copiedField, setCopiedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [fillFeedback, setFillFeedback] = useState(false)

  const demoEmail = 'admin@clientflow.io'
  const demoPassword = 'Password@123'

  const copyToClipboard = async (text, fieldName) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleFill = () => {
    if (onFill) {
      onFill(demoEmail, demoPassword)
      setFillFeedback(true)
      setTimeout(() => setFillFeedback(false), 2500)
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white p-4 shadow-xs transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <span className="text-xs font-bold text-slate-800">Demo Account</span>
            <span className="ml-1.5 hidden text-[11px] font-semibold text-slate-500 sm:inline">
              (Preloaded CRM data)
            </span>
          </div>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
          Admin Access
        </span>
      </div>

      {/* Credentials Grid */}
      <div className="mt-3 grid gap-2">
        {/* Email Row */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-2xs">
          <div className="min-w-0 pr-2">
            <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Email ID</p>
            <p className="m-0 truncate font-mono text-xs font-semibold text-slate-800">{demoEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(demoEmail, 'email')}
            title="Copy Email"
            className="flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            {copiedField === 'email' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Password Row */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-2xs">
          <div className="min-w-0 pr-2">
            <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</p>
            <p className="m-0 truncate font-mono text-xs font-semibold text-slate-800">
              {showPassword ? demoPassword : '••••••••••••'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard(demoPassword, 'password')}
              title="Copy Password"
              className="flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              {copiedField === 'password' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3">
        {mode === 'signin' ? (
          <button
            type="button"
            onClick={handleFill}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-blue-700 active:scale-[0.99]"
          >
            {fillFeedback ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Credentials Applied to Form!</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>Auto-fill Demo Credentials</span>
              </>
            )}
          </button>
        ) : (
          <Link
            to="/auth/sign-in?fillDemo=true"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-blue-600 px-3 py-2 text-xs font-bold text-white no-underline shadow-2xs transition-all hover:bg-blue-700 active:scale-[0.99]"
          >
            <span>Sign in with Demo Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
