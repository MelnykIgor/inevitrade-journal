import React, { useState } from 'react'
import Logo from './Logo.jsx'
import { supabase } from '../supabase.js'

export default function LoginPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
        } else {
          setInfo('Check your email to confirm your account, then sign in.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const formFields = (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="bg-surface2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="bg-surface2 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
      </div>

      {error && <p className="text-xs text-loss">{error}</p>}
      {info && <p className="text-xs text-accent3">{info}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent2 transition-all hover:scale-[1.02] text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-glow disabled:opacity-60"
      >
        {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
      </button>

      <p className="text-center text-xs text-gray-500">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
                setInfo('')
              }}
              className="text-accent3 hover:text-accent transition-colors"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError('')
                setInfo('')
              }}
              className="text-accent3 hover:text-accent transition-colors"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </>
  )

  return (
    <div className="min-h-screen flex text-gray-100">
      <div className="space-bg">
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <div className="nebula nebula-4" />
        <div className="star-layer" />
        <div className="star-layer-3" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {/* Mobile: centered card (Option A) */}
        <div className="sm:hidden w-full max-w-sm bg-surface backdrop-blur-md border border-border rounded-2xl p-6 text-center">
          <div className="w-11 h-11 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent3 shadow-glow mx-auto mb-3">
            <Logo className="w-5 h-5" />
          </div>
          <h1 className="text-white font-medium text-base">MelFemTrade</h1>
          <p className="text-gray-400 text-xs mb-5">
            {mode === 'signin' ? 'Sign in to your journal' : 'Create your account'}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
            {formFields}
          </form>
        </div>

        {/* Desktop / tablet: split layout (Option B) */}
        <div className="hidden sm:grid w-full max-w-3xl grid-cols-2 bg-surface backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-glow">
          <div className="bg-gradient-to-b from-accent/15 to-accent/5 border-r border-border flex flex-col justify-center p-8">
            <div className="w-10 h-10 rounded-lg bg-accent/25 border border-accent/40 flex items-center justify-center text-accent3 mb-4">
              <Logo className="w-5 h-5" />
            </div>
            <h1 className="text-white font-medium text-lg mb-1.5">MelFemTrade</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track every trade, spot your patterns, and grow as a trader.
            </p>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-white font-medium text-sm mb-4">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              {formFields}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
