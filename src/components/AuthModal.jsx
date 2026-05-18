import { useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    if (!supabaseConfigured) return
    setBusy(true)
    setMsg(null)
    const fn = mode === 'login' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn.call(supabase.auth, { email, password })
    setBusy(false)
    if (error) {
      setMsg({ kind: 'error', text: error.message })
      return
    }
    if (mode === 'register') {
      setMsg({ kind: 'ok', text: 'Account created. You can now sign in.' })
      setMode('login')
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sage-900/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sage-800">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <button onClick={onClose} className="text-sage-600 hover:text-sage-800" aria-label="Close">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-warm-200 focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-warm-200 focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
          {msg && (
            <p className={`text-sm ${msg.kind === 'error' ? 'text-red-600' : 'text-sage-600'}`}>{msg.text}</p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-sage-600 mt-4 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
          <button
            className="text-sage-700 underline"
            onClick={() => {
              setMsg(null)
              setMode(mode === 'login' ? 'register' : 'login')
            }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
